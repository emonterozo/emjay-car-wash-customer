import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, ScrollView, Platform } from 'react-native';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import {
  AppHeader,
  CalendarPickerTrigger,
  Dropdown,
  FormTextInput,
  Button,
  LoadingAnimation,
  Toast,
} from '@app/components';
import { color, font } from '@app/styles';
import { Option } from '../../components/Dropdown/Dropdown';
import GlobalContext from '@app/context';
import { updateProfile } from '@app/services';
import { FemaleIcon, MaleIcon } from '@app/icons';

const GENDER_OPTIONS = [
  {
    id: '1',
    icon: <MaleIcon width={25} height={25} fill="#2196f3" />,
    label: 'MALE',
  },
  {
    id: '2',
    icon: <FemaleIcon width={25} height={25} fill="#f78f8f" />,
    label: 'FEMALE',
  },
];

type FormValues = {
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  gender: Option | undefined;
  contactNumber: string | undefined;
  address: string | undefined;
  barangay: string | undefined;
  city: string | undefined;
  province: string | undefined;
};

type Errors = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof FormValues]?: string;
};

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  contactNumber: Yup.string()
    .required('Phone Number is required')
    .matches(
      /^09[0-9]{9}$/,
      'Phone Number must be 11 digits long, starting with "09", and contain only numbers',
    ),
  address: Yup.string().required('Address is required'),
  barangay: Yup.string().required('Barangay is required'),
  city: Yup.string().required('Municipality is required'),
  province: Yup.string().required('Province is required'),
});

const EditProfile = () => {
  const { user, setUser } = useContext(GlobalContext);
  const [errors, setErrors] = useState<Errors>({});
  const initialFormValues: FormValues = {
    firstName: user.first_name,
    lastName: user.last_name,
    address: user.address ?? undefined,
    barangay: user.barangay ?? undefined,
    city: user.city ?? undefined,
    province: user.city ?? undefined,
    birthDate: new Date(user.birth_date),
    gender: GENDER_OPTIONS.find((item) => item.label === user.gender),
    contactNumber: user.username,
  };
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'error',
  });
  const [coordinate, setCoordinate] = useState({ latitude: 0, longitude: 0 });
  const navigation = useNavigation();

  const removeError = (key: keyof typeof formValues) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const getDateValue = (key: keyof typeof formValues, value: Date | undefined) => {
    return formValues[key] === undefined ? undefined : format(new Date(value!), 'MMMM dd, yyyy');
  };

  const handleSubmit = () => {
    validationSchema
      .validate(formValues, { abortEarly: false })
      .then(async (validData) => {
        setErrors({});
        setIsLoading(true);

        const payload = {
          first_name: validData.firstName,
          last_name: validData.lastName,
          address: validData.address,
          barangay: validData.barangay,
          city: validData.city,
          province: validData.province,
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        };

        const response = await updateProfile(user.accessToken, user.refreshToken, user.id, payload);

        setIsLoading(false);

        if (response.success && response.data?.user) {
          const { first_name, last_name, address, barangay, city, province, distance } =
            response.data.user;
          setToast({ isVisible: true, message: 'Profile updated successfully.', type: 'success' });
          setUser({
            ...user,
            first_name,
            last_name,
            address,
            barangay,
            city,
            province,
            distance,
          });
          navigation.goBack();
        } else {
          setToast({
            isVisible: true,
            message:
              response.errors && response.errors?.length > 0
                ? response.errors[0].message
                : 'Something went wrong. Please try again.',
            type: 'error',
          });
        }
      })
      .catch((err) => {
        const errorMessages: Errors = err.inner.reduce((acc: Errors, curr: ValidationError) => {
          acc[curr.path as keyof FormValues] = curr.message;
          return acc;
        }, {});
        setErrors(errorMessages);
      });
  };

  const onToastClose = () => setToast({ isVisible: false, message: '', type: 'error' });

  const requestPermission = async () => {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    try {
      let permissionStatus = await check(permission!);

      if (permissionStatus !== RESULTS.GRANTED) {
        permissionStatus = await request(permission!);
        if (permissionStatus !== RESULTS.GRANTED) {
          setToast({
            isVisible: true,
            message: 'Location permission is required to share your location.',
            type: 'error',
          });
          return;
        }
      }

      setIsLoading(true);
      const position = await new Promise<GeolocationResponse>((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      setCoordinate({ latitude, longitude });
      setIsLoading(false);
    } catch {
      setToast({
        isVisible: true,
        message: 'Something went wrong while trying to get your location.',
        type: 'error',
      });
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Edit Profile" />
      <View style={styles.heading}>
        <Text style={styles.label}>Update your profile</Text>
        <Text style={styles.label}>
          To ensure accurate distance calculations for your scheduled bookings, we’ll use your
          current location. Please make sure you’re at home when updating your profile. Profile
          updates are limited to once every 5 days to prevent spamming.
        </Text>
      </View>
      <LoadingAnimation isLoading={isLoading} />
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        duration={3000}
        type={toast.type as 'error' | 'success' | 'info'}
        onClose={onToastClose}
      />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollViewContent}>
        <FormTextInput
          label="First Name"
          placeholder="Enter First Name"
          error={errors.firstName}
          value={formValues.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
          onFocus={() => removeError('firstName')}
          maxLength={64}
        />
        <FormTextInput
          label="Last Name"
          placeholder="Enter Last Name"
          error={errors.lastName}
          value={formValues.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
          onFocus={() => removeError('lastName')}
          maxLength={64}
        />
        <FormTextInput
          label="Address"
          placeholder="Enter Address"
          error={errors.address}
          value={formValues.address}
          onChangeText={(value) => handleInputChange('address', value)}
          onFocus={() => removeError('address')}
          maxLength={100}
        />
        <FormTextInput
          label="Barangay"
          placeholder="Enter Barangay"
          error={errors.barangay}
          value={formValues.barangay}
          onChangeText={(value) => handleInputChange('barangay', value)}
          onFocus={() => removeError('barangay')}
          maxLength={64}
        />
        <FormTextInput
          label="Municipality"
          placeholder="Enter Municipality"
          error={errors.city}
          value={formValues.city}
          onChangeText={(value) => handleInputChange('city', value)}
          onFocus={() => removeError('city')}
          maxLength={64}
        />
        <FormTextInput
          label="Province"
          placeholder="Enter Province"
          error={errors.province}
          value={formValues.province}
          onChangeText={(value) => handleInputChange('province', value)}
          onFocus={() => removeError('province')}
          maxLength={64}
        />
        <CalendarPickerTrigger
          isDisabled
          date={formValues.birthDate ?? new Date()}
          label="Date of Birth"
          placeholder="Select Date of Birth"
          value={getDateValue('birthDate', formValues.birthDate)}
          onSelectedDate={() => {}}
          textColor="#696969"
        />
        <Dropdown
          isDisabled
          label="Gender"
          placeholder="Select Gender"
          selected={formValues.gender}
          options={GENDER_OPTIONS}
          onSelected={() => {}}
          optionMinWidth={196}
          textColor="#696969"
        />
        <FormTextInput
          readOnly
          label="Phone Number"
          placeholder="E.g 09123456789"
          error={errors.contactNumber}
          value={formValues.contactNumber}
          keyboardType="numeric"
          maxLength={11}
          textColor="#696969"
        />
        {!(coordinate.latitude === 0 || coordinate.longitude === 0) && (
          <Button
            title="Submit"
            variant="primary"
            buttonStyle={styles.button}
            textStyle={styles.textStyle}
            onPress={handleSubmit}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 25,
    gap: 15,
  },
  label: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 18,
    color: '#696969',
  },
  scrollViewContent: {
    gap: 24,
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  button: {
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 28,
  },
  textStyle: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
  },
});

export default EditProfile;
