import React, { useContext, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Button, FormTextInput, LoadingAnimation, Toast } from '@app/components';
import { color, font } from '@app/styles';
import { EyeCloseIcon, EyeOpenIcon } from '@app/icons';
import GlobalContext from '@app/context';
import { updateProfile } from '@app/services';

type FormValues = {
  currentPassword: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
};

type Errors = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof FormValues]?: string;
};

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current Password is required')
    .min(8, 'Current Password must be at least 8 characters long')
    .matches(/\d/, 'Current Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Current Password must contain at least one special character',
    ),
  password: Yup.string()
    .required('New Password is required')
    .min(8, 'New Password must be at least 8 characters long')
    .matches(/\d/, 'New Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'New Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .required('Confirm New Password is required')
    // @ts-ignore
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const ChangePassword = () => {
  const { user } = useContext(GlobalContext);
  const [passwordSecure, setPasswordSecure] = useState({
    currentPassword: true,
    password: true,
    confirmPassword: true,
  });
  const [errors, setErrors] = useState<Errors>({});
  const initialFormValues: FormValues = {
    currentPassword: undefined,
    password: undefined,
    confirmPassword: undefined,
  };
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'error',
  });
  const navigation = useNavigation();

  const onToastClose = () => setToast({ isVisible: false, message: '', type: 'error' });

  const toggleSecureEntry = (key: keyof typeof passwordSecure) => {
    setPasswordSecure({
      ...passwordSecure,
      [key]: !passwordSecure[key],
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

  const handleSubmit = () => {
    validationSchema
      .validate(formValues, { abortEarly: false })
      .then(async (validData) => {
        setErrors({});
        setIsLoading(true);

        const payload = {
          current_password: validData.currentPassword,
          password: validData.password,
        };

        const response = await updateProfile(user.accessToken, user.refreshToken, user.id, payload);

        setIsLoading(false);

        if (response.success && response.data?.user) {
          setToast({ isVisible: true, message: 'Profile updated successfully.', type: 'success' });

          navigation.goBack();
        } else if (response.status === 400) {
          setErrors({ currentPassword: 'Incorrect password' });
        } else {
          setToast({
            isVisible: true,
            message: 'Something went wrong. Please try again.',
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Change Password" />
      <View style={styles.heading}>
        <Text style={styles.label}>Change your password</Text>
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
          label="Current Password"
          placeholder="Current Password"
          error={errors.currentPassword}
          value={formValues.currentPassword}
          onChangeText={(value) => handleInputChange('currentPassword', value)}
          onFocus={() => removeError('currentPassword')}
          maxLength={64}
          secureTextEntry={passwordSecure.currentPassword}
          endIcon={
            <Pressable onPress={() => toggleSecureEntry('currentPassword')}>
              {passwordSecure.currentPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
            </Pressable>
          }
        />
        <FormTextInput
          label="New Password"
          placeholder="New Password"
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
          label="Confirm New Password"
          placeholder="Confirm New Password"
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

export default ChangePassword;
