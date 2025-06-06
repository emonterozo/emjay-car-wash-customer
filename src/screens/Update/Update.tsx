import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import React from 'react';
import { IMAGES } from '@app/constant';
import { color, font } from '@app/styles';
import { RotateIcon, UpdateIcon } from '@app/icons';

const Update = () => {
  const handlePress = () => {
    switch (Platform.OS) {
      case 'ios':
        break;

      default:
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.quindigitalsolutions.emjayrewards',
        );
        break;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={IMAGES.UPDATE} style={styles.image} />
      <View style={styles.icon}>
        <UpdateIcon width={120} height={120} fill={color.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.header}>NEW UPDATE AVAILABLE</Text>
        <Text style={styles.title}>Update your application to the latest version</Text>
        <Text style={styles.description}>
          {`A brand new version of Emjay Rewards app is available in the ${
            Platform.OS === 'ios' ? 'App Store' : 'Play Store'
          }. Please update
          your app to use all of our amazing features.`}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? color.primary_pressed_state : color.primary },
          ]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Update Now!</Text>
          <RotateIcon width={24} height={24} fill="#FFFFFF" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
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
