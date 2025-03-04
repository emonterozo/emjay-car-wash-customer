import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { useNavigation } from '@react-navigation/native';

import { ScreenStatusProps } from '../../types/services/types';
import { color, font } from '@app/styles';
import {
  AppHeader,
  Button,
  ConfirmationModal,
  FormTextInput,
  LoadingAnimation,
  Toast,
} from '@app/components';
import { EyeCloseIcon, EyeOpenIcon } from '@app/icons';
import { areObjectsEqual } from '@app/helpers';
import { useNativeBackHandler } from '@app/hooks';

type FormValues = {
  contactNumber: string | undefined;
  password: string;
  confirmPassword: string;
};

type Errors = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof FormValues]?: string;
};

const validationSchema = Yup.object({
  contactNumber: Yup.string()
    .required('Phone Number is required')
    .matches(
      /^09[0-9]{9}$/,
      'Phone Number must be 11 digits long, starting with "09", and contain only numbers',
    ),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    // @ts-ignore
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const ForgoPassword = () => {
  const navigation = useNavigation();
  const [passwordSecure, setPasswordSecure] = useState({
    password: true,
    confirmPassword: true,
  });
  const [errors, setErrors] = useState<Errors>({});
  const initialFormValues: FormValues = {
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
  const [isToastVisible, setIsToastVisible] = useState(false);
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

        console.log('test');
      })
      .catch((err) => {
        const errorMessages: Errors = err.inner.reduce((acc: Errors, curr: ValidationError) => {
          acc[curr.path as keyof FormValues] = curr.message;
          return acc;
        }, {});
        setErrors(errorMessages);
        setIsToastVisible(true);
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

  const onToastClose = () => setIsToastVisible(false);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Register" onBack={handlePressBack} />
      <LoadingAnimation isLoading={screenStatus.isLoading} />
      <View>
        {/* <ErrorModal
          type={screenStatus.type}
          isVisible={screenStatus.hasError}
          onCancel={onCancel}
          onRetry={type === 'Add' ? handleAddEmployee : handleUpdateEmployee}
        /> */}
        <ConfirmationModal
          type="Register"
          isVisible={isConfirmationVisible}
          onNo={() => handleConfirmationPress('no')}
          onYes={() => handleConfirmationPress('yes')}
        />
      </View>
      <Toast
        isVisible={isToastVisible}
        message="Please complete the required fields before proceeding."
        duration={3000}
        type="error"
        onClose={onToastClose}
      />
      <View style={styles.heading}>
        <Text style={styles.label}>Reset your password</Text>
      </View>
      <ScrollView bounces={false} contentContainerStyle={styles.scrollViewContent}>
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
          title="Submit"
          variant="primary"
          buttonStyle={styles.button}
          textStyle={styles.textStyle}
          onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
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
    paddingBottom: 62,
    paddingHorizontal: 25,
  },
  button: {
    marginTop: 16,
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

export default ForgoPassword;
