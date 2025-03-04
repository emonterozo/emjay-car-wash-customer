import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNInput,
  TextInputProps as RNTextInputProps,
  AccessibilityProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Image,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { font, color } from '@app/styles';
import { isStringEmpty } from '@app/helpers';
import { IMAGES } from '@app/constant';

type FormTextInputProps = {
  label: string;
  labelColor?: string;
  enableColor?: string;
  disabledColor?: string;
  textColor?: string;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  error?: string;
  isErrorMessageVisible?: boolean;
} & RNTextInputProps &
  AccessibilityProps;

const FormTextInput = ({
  label,
  labelColor = '#050303',
  placeholderTextColor = '#696969',
  enableColor = '#8A8989',
  disabledColor = '#D9D9D9',
  textColor = '#050303',
  onFocus,
  onBlur,
  placeholder,
  startIcon,
  endIcon,
  error,
  readOnly,
  isErrorMessageVisible = true,
  ...prop
}: FormTextInputProps) => {
  const getTextInputColor = () => {
    return readOnly ? disabledColor : enableColor;
  };

  const borderColor = useSharedValue(getTextInputColor());

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(borderColor.value, { duration: 200 }),
    };
  });

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    borderColor.value = color.primary;
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    borderColor.value = getTextInputColor();
    if (onBlur) {
      onBlur(e);
    }
  };

  useEffect(() => {
    if (error) {
      borderColor.value = isStringEmpty(error) ? getTextInputColor() : '#FF7070';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        <Animated.View style={[styles.container, animatedStyle]}>
          {startIcon}
          <RNInput
            style={[
              styles.input,
              {
                color: textColor,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly={readOnly}
            {...prop}
          />
          {endIcon}
        </Animated.View>
      </View>
      {error && isErrorMessageVisible && (
        <View style={styles.errorContainer}>
          <Image source={IMAGES.HIGH_IMPORTANCE} resizeMode="contain" style={styles.image} />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 8,
  },
  label: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
  },
  container: {
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 23,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    flex: 1,
  },
  errorContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  error: {
    ...font.regular,
    fontSize: 12,
    lineHeight: 12,
    color: '#FF7070',
    flex: 1,
  },
  image: {
    width: 16,
    height: 16,
  },
});

export default FormTextInput;
