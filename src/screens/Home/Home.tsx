import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, Text } from 'react-native';

import { color, font } from '@app/styles';
import { IMAGES } from '@app/constant';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <View style={styles.heading}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello, John Doe!</Text>
          <Text style={styles.subHeader}>What service do you need today?</Text>
        </View>
        <Image source={IMAGES.AVATAR_BOY} style={styles.avatar} resizeMode="contain" />
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>1,020 Points</Text>
        <Text style={styles.label}>
          Earn more points by availing services to unlock free rewards!
        </Text>
      </View>
      <View>
        <Text style={styles.title}>Wash Service Count</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2EF',
    paddingTop: 20,
    paddingBottom: 10,
  },
  avatar: {
    height: 60,
    width: 60,
    backgroundColor: '#46A6FF',
    borderRadius: 90,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  greetingContainer: {
    gap: 5,
  },
  greeting: {
    ...font.regular,
    fontSize: 24,
    color: '#050303',
  },
  subHeader: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 20,
    color: '#888888',
  },
  pointsContainer: {
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: color.primary,
    marginVertical: 24,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
  },
  points: {
    ...font.bold,
    fontSize: 18,
    color: '#050303',
  },
  label: {
    ...font.regular,
    fontSize: 16,
    color: '#888888',
  },
  title: {
    ...font.bold,
    fontSize: 20,
    lineHeight: 20,
    color: '#050303',
  },
});

export default Home;
