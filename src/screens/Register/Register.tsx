import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { GenderType, ScreenStatusProps } from '../../types/services/types';
import type { Option } from '../../components/Dropdown/Dropdown';
import { color, font } from '@app/styles';
import {
  AppHeader,
  Button,
  CalendarPickerTrigger,
  ConfirmationModal,
  Dropdown,
  ErrorModal,
  FormTextInput,
  LoadingAnimation,
  Toast,
} from '@app/components';
import { EyeCloseIcon, EyeOpenIcon } from '@app/icons';
import { ERR_NETWORK, IMAGES } from '@app/constant';
import { areObjectsEqual } from '@app/helpers';
import { useNativeBackHandler } from '@app/hooks';
import { UnAuthNavigationProp } from '../../types/navigation/types';
import { signupRequest } from '@app/services';
import GlobalContext from '@app/context';

const GENDER_OPTIONS = [
  {
    id: '1',
    icon: <Image source={IMAGES.MALE} resizeMode="contain" />,
    label: 'MALE',
  },
  {
    id: '2',
    icon: <Image source={IMAGES.FEMALE} resizeMode="contain" />,
    label: 'FEMALE',
  },
];

type FormValues = {
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  gender: Option | undefined;
  contactNumber: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
};

type Errors = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof FormValues]?: string;
};

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  birthDate: Yup.date()
    .required('Birth date is required')
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      'You must be at least 18 years old',
    ),
  gender: Yup.object().required('Gender is required'),
  contactNumber: Yup.string()
    .required('Phone Number is required')
    .matches(
      /^09[0-9]{9}$/,
      'Phone Number must be 11 digits long, starting with "09", and contain only numbers',
    ),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    // @ts-ignore
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation<UnAuthNavigationProp>();
  const [passwordSecure, setPasswordSecure] = useState({
    password: true,
    confirmPassword: true,
  });
  const [errors, setErrors] = useState<Errors>({});
  const initialFormValues: FormValues = {
    firstName: '',
    lastName: '',
    birthDate: undefined,
    gender: undefined,
    contactNumber: undefined,
    password: '',
    confirmPassword: '',
  };
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [screenStatus, setScreenStatus] = useState<ScreenStatusProps>({
    isLoading: false,
    hasError: false,
    type: 'error',
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'error',
  });
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const toggleSecureEntry = (key: keyof typeof passwordSecure) => {
    setPasswordSecure({
      ...passwordSecure,
      [key]: !passwordSecure[key],
    });
  };

  const handleSubmit = () => {
    validationSchema
      .validate(formValues, { abortEarly: false })
      .then(async (_validData) => {
        setErrors({});
        setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
        const payload = {
          first_name: formValues.firstName,
          last_name: formValues.lastName,
          contact_number: formValues.contactNumber as string,
          gender: formValues.gender?.label as GenderType,
          birth_date: format(formValues.birthDate!, 'yyyy-MM-dd'),
          password: formValues.password!,
          fcm_token: user.fcmToken,
        };

        const response = await signupRequest(payload);

        setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });

        if (response.success && response.data) {
          const { _id, username } = response.data.user;
          setToast({
            isVisible: true,
            message:
              "Account created successfully! We've sent a one-time password (OTP) to your contact details. Please enter the OTP to verify your account.",
            type: 'success',
          });
          setTimeout(() => {
            navigation.replace('RegistrationOtp', { user: _id, username: username });
          }, 3100);
        } else {
          switch (response.status) {
            case 400:
              setToast({
                isVisible: true,
                message: 'The phone number is already in use. Please use a different number.',
                type: 'error',
              });
              break;
            default:
              setScreenStatus({
                isLoading: false,
                type: response.error === ERR_NETWORK ? 'connection' : 'error',
                hasError: true,
              });
              break;
          }
        }
      })
      .catch((err) => {
        const errorMessages: Errors = err.inner.reduce((acc: Errors, curr: ValidationError) => {
          acc[curr.path as keyof FormValues] = curr.message;
          return acc;
        }, {});
        setErrors(errorMessages);
        setToast({
          isVisible: true,
          message: 'Please complete the required fields before proceeding.',
          type: 'error',
        });
      });
  };

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

  const handleCalendarChange = (key: string, value: Date) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const handleDropdownChange = (key: string, value: Option) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const onToastClose = () => setToast({ isVisible: false, message: '', type: 'error' });

  const handlePressBack = () => {
    if (areObjectsEqual(initialFormValues, formValues)) {
      navigation.goBack();
    } else {
      setIsConfirmationVisible(true);
    }
  };

  useNativeBackHandler(() => {
    handlePressBack();
    return true;
  });

  const handleConfirmationPress = (action: 'yes' | 'no') => {
    setIsConfirmationVisible(false);
    switch (action) {
      case 'yes':
        navigation.goBack();
        break;
      default:
        break;
    }
  };

  const onCancel = () => {
    setScreenStatus({ ...screenStatus, hasError: false });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Register" onBack={handlePressBack} />
      <LoadingAnimation isLoading={screenStatus.isLoading} />
      <View style={styles.viewContainer}>
        <ErrorModal
          type={screenStatus.type}
          isVisible={screenStatus.hasError}
          onCancel={onCancel}
          onRetry={handleSubmit}
        />
        <ConfirmationModal
          type="Register"
          isVisible={isConfirmationVisible}
          onNo={() => handleConfirmationPress('no')}
          onYes={() => handleConfirmationPress('yes')}
        />
      </View>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        duration={3000}
        type={toast.type as 'success' | 'error' | 'info'}
        onClose={onToastClose}
      />
      <View style={styles.heading}>
        <Text style={styles.label}>Create a new account</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
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
          <CalendarPickerTrigger
            date={formValues.birthDate ?? new Date()}
            label="Date of Birth"
            placeholder="Select Date of Birth"
            value={getDateValue('birthDate', formValues.birthDate)}
            error={errors.birthDate}
            onSelectedDate={(selectedDate) => handleCalendarChange('birthDate', selectedDate)}
            onPressOpen={() => removeError('birthDate')}
            isDefaultCalendarSelection={false}
          />
          <Dropdown
            label="Gender"
            placeholder="Select Gender"
            selected={formValues.gender}
            options={GENDER_OPTIONS}
            onSelected={(selectedOption) => handleDropdownChange('gender', selectedOption)}
            optionMinWidth={196}
            error={errors.gender}
            onToggleOpen={() => removeError('gender')}
          />
          <FormTextInput
            label="Phone Number"
            placeholder="E.g 09123456789"
            error={errors.contactNumber}
            value={formValues.contactNumber}
            onChangeText={(value) => handleInputChange('contactNumber', value)}
            keyboardType="numeric"
            onFocus={() => removeError('contactNumber')}
            maxLength={11}
          />
          <FormTextInput
            label="Password"
            placeholder="Password"
            error={errors.password}
            value={formValues.password}
            onChangeText={(value) => handleInputChange('password', value)}
            onFocus={() => removeError('password')}
            maxLength={64}
            secureTextEntry={passwordSecure.password}
            endIcon={
              <Pressable onPress={() => toggleSecureEntry('password')}>
                {passwordSecure.password ? <EyeCloseIcon /> : <EyeOpenIcon />}
              </Pressable>
            }
          />
          <FormTextInput
            label="Confirm Password"
            placeholder="Confirm Password"
            error={errors.confirmPassword}
            value={formValues.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            onFocus={() => removeError('confirmPassword')}
            maxLength={64}
            secureTextEntry={passwordSecure.confirmPassword}
            endIcon={
              <Pressable onPress={() => toggleSecureEntry('confirmPassword')}>
                {passwordSecure.confirmPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
              </Pressable>
            }
          />
          <Button
            title="Sign up"
            variant="primary"
            buttonStyle={styles.button}
            textStyle={styles.textStyle}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  viewContainer: {
    flex: 1,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 25,
  },
  label: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#696969',
  },
  scrollViewContent: {
    gap: 24,
    paddingHorizontal: 25,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: 150,
  },
  textStyle: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
  },
});

export default Register;
