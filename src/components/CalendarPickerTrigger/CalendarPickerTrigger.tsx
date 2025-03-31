import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { font, color } from '@app/styles';
import { IMAGES } from '@app/constant';
import CalendarPicker from '../CalendarPicker/CalendarPicker';
import {
  getCurrentDateAtMidnightUTC,
  getMinimumDateAtMidnightUTC,
  isStringEmpty,
} from '@app/helpers';

export type CalendarPickerTriggerProps = {
  date: Date;
  label: string;
  labelColor?: string;
  placeholderTextColor?: string;
  placeholder?: string;
  enableColor?: string;
  disabledColor?: string;
  textColor?: string;
  error?: string;
  value: string | undefined;
  isDisabled?: boolean;
  onSelectedDate: (date: Date) => void;
  maxDate?: Date;
  minDate?: Date;
  onPressOpen?: () => void;
  isDefaultCalendarSelection?: boolean;
};

const CalendarPickerTrigger = ({
  date,
  label,
  labelColor = '#050303',
  placeholderTextColor = '#696969',
  enableColor = '#8A8989',
  disabledColor = '#D9D9D9',
  textColor = '#050303',
  placeholder,
  error,
  value,
  isDisabled,
  onSelectedDate,
  maxDate = getCurrentDateAtMidnightUTC(),
  minDate = getMinimumDateAtMidnightUTC(),
  onPressOpen,
  isDefaultCalendarSelection,
}: CalendarPickerTriggerProps) => {
  const getColor = () => {
    return isDisabled ? disabledColor : enableColor;
  };

  const borderColor = useSharedValue(getColor());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(borderColor.value, { duration: 200 }),
    };
  });

  const handlePressOpen = () => {
    borderColor.value = color.primary;
    setIsCalendarOpen(true);
    if (onPressOpen) {
      onPressOpen();
    }
  };

  const handlePressSelected = (selectedDate: Date) => {
    borderColor.value = getColor();
    setIsCalendarOpen(false);
    onSelectedDate(selectedDate);
  };

  useEffect(() => {
    if (error) {
      borderColor.value = isStringEmpty(error) ? getColor() : '#FF7070';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const onClose = () => {
    borderColor.value = getColor();
    setIsCalendarOpen(false);
  };

  return (
    <View style={styles.content}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <TouchableWithoutFeedback onPress={handlePressOpen} disabled={isDisabled}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Image
            source={value ? IMAGES.CALENDAR_ACTIVE : IMAGES.CALENDAR_INACTIVE}
            resizeMode="contain"
          />
          {value ? (
            <Text style={[styles.label, { color: textColor }]}>{value}</Text>
          ) : (
            <Text
              style={[
                styles.text,
                {
                  color: placeholderTextColor,
                },
              ]}
            >
              {placeholder}
            </Text>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
      {error && (
        <View style={styles.errorContainer}>
          <Image source={IMAGES.HIGH_IMPORTANCE} resizeMode="contain" style={styles.image} />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
      {isCalendarOpen && (
        <CalendarPicker
          date={date}
          isVisible={isCalendarOpen}
          onSelectedDate={handlePressSelected}
          onClose={onClose}
          maxDate={maxDate}
          minDate={minDate}
          isDefaultCalendarSelection={isDefaultCalendarSelection}
        />
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
    flex: 1,
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
  text: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    flex: 1,
  },
  errorContainer: {
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

export default CalendarPickerTrigger;
