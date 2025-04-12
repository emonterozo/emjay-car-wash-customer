import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import { IMAGES } from '@app/constant';
import { color, font } from '@app/styles';

const Update = () => {
  const handlePress = () => {
    switch (Platform.OS) {
      case 'ios':
        break;

      default:
        break;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={IMAGES.UPDATE} style={styles.image} />
      <Image source={IMAGES.UPDATE_ICON} style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.header}>New Update Available</Text>
        <Text style={styles.title}>Update your application to the latest version</Text>
        <Text style={styles.description}>
          A brand new version of Emjay Rewards app is available in the App Store. Please update your
          app to use all of our amazing features.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? color.primary_pressed_state : color.primary },
          ]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Update Now!</Text>
          <Image source={IMAGES.ROTATE} />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '60%',
  },
  icon: {
    width: 120,
    height: 120,
    position: 'absolute',
    left: '50%',
    bottom: '36%',
    transform: [{ translateX: -60 }],
  },
  content: {
    marginTop: 34,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  header: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#5C5C5C',
    textAlign: 'center',
  },
  title: {
    ...font.bold,
    fontSize: 30,
    lineHeight: 30,
    color: '#050303',
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },
  button: {
    marginTop: 40,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 49,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 48,
    backgroundColor: color.primary,
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default Update;
