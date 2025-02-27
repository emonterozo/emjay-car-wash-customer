import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, LayoutChangeEvent, Text } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { HollowCircleIcon } from '@app/icons';

export type OTPInputProps = {
  maxLength?: number;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
};

const OTPInput = ({ maxLength = 6, otp, setOtp }: OTPInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const left = useSharedValue(0);
  const opacity = useSharedValue(0);

  const [selectionIndex, setSelectionIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cursorCoordinates, setCursorCoordinates] = useState<number[]>([]);

  const startBlinking = () => {
    opacity.value = withRepeat(
      withTiming(0, { duration: 500 }),
      -1, // Infinite repetition
      true, // Reverse direction
    );
  };

  const stopBlinking = () => {
    cancelAnimation(opacity);
    opacity.value = 1; // Reset opacity to visible
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: left.value,
      opacity: opacity.value,
    };
  });

  const handleDigitPress = (index: number) => {
    if (inputRef.current?.isFocused()) {
      if (otp[index] !== undefined) {
        setSelectionIndex(index + 1);
        left.value = cursorCoordinates[index + 1]!;
      } else {
        setSelectionIndex(otp.length);
        left.value = cursorCoordinates[otp.length]!;
      }
    } else {
      inputRef.current?.focus();
      opacity.value = 1;
      startBlinking();
    }
  };

  useEffect(() => {
    if (containerWidth > 0) {
      let coordinatesHolder = [0];

      // will retrieve a list containing the x-coordinates of the cursor's position.
      for (let index = 0; index < maxLength; index++) {
        if (coordinatesHolder[index] === undefined) {
          coordinatesHolder.push(
            Math.round(coordinatesHolder[index - 1]! + containerWidth / maxLength),
          );
        }
      }
      coordinatesHolder.push(Math.round(containerWidth));
      setCursorCoordinates(coordinatesHolder);
    }
  }, [containerWidth, maxLength]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      runOnJS(stopBlinking)();
    })
    .onChange((event) => {
      const { absoluteX } = event;
      // this will change the x coordinate of the cursor
      for (let i = 0; i < otp.length + 1; i++) {
        const roundedValue = Math.round(absoluteX);
        if (roundedValue <= cursorCoordinates[1]! / 2) {
          // added this condition, zero's is not reaching in ios
          left.value = cursorCoordinates[0]!;
          runOnJS(setSelectionIndex)(0);
          break;
        } else if (roundedValue <= cursorCoordinates[i]!) {
          left.value = cursorCoordinates[i]!;
          runOnJS(setSelectionIndex)(i);
          break;
        }
      }
    })
    .onFinalize(() => {
      runOnJS(startBlinking)();
    });

  const onChangeText = (text: string) => {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const lastChar = text.charAt(text.length - 1);

    if (text.length === 0 || numbers.includes(lastChar)) {
      // Determine if the text was added or deleted
      const isInsert = text.length > otp.length;

      if (isInsert) {
        // Handling insertion of a new character
        const newValue = otp.slice(0, selectionIndex) + lastChar + otp.slice(selectionIndex);
        setOtp(newValue);
        left.value = cursorCoordinates[selectionIndex + 1]!;
        setSelectionIndex(selectionIndex + 1);
      } else {
        // Handling deletion of a character
        const newValue = otp.slice(0, selectionIndex - 1) + otp.slice(selectionIndex);
        setOtp(newValue);
        left.value = cursorCoordinates[selectionIndex - 1]!;
        setSelectionIndex(selectionIndex - 1);
      }
    }
  };

  const onBlur = () => {
    stopBlinking();
    opacity.value = 0;
    left.value = cursorCoordinates[otp.length]!;
    setSelectionIndex(otp.length);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    // will get the total width of the container that will hold otp digit
    setContainerWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (otp === '') {
      setSelectionIndex(0);
      left.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <View>
      <View>
        <TextInput
          testID="otp-input"
          ref={inputRef}
          style={styles.input}
          maxLength={maxLength}
          keyboardType="numeric"
          onChangeText={onChangeText}
          value={otp}
          onBlur={onBlur}
        />
      </View>
      <View style={[styles.otpMainContainer]}>
        <View onLayout={onLayout} style={styles.otpContainer}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.cursor, animatedStyle]} />
          </GestureDetector>
          {Array.from({ length: maxLength }, (_, index) => (
            <Pressable key={index} onPress={() => handleDigitPress(index)}>
              <View
                style={[
                  styles.digitContainer,
                  {
                    width: containerWidth / maxLength,
                  },
                ]}
              >
                {otp === '' ? <HollowCircleIcon /> : otp[index] && <Text>{otp[index]}</Text>}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 0,
    opacity: 0,
  },
  cursor: {
    position: 'absolute',
    borderWidth: 1,
    height: 50,
    borderColor: '#00A6ED',
  },
  otpMainContainer: {
    height: 69,
    marginVertical: 30,
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: '#8A8989',
  },
  otpContainer: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  digitContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OTPInput;
