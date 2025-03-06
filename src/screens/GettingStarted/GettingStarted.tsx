import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { IMAGES } from '@app/constant';
import { color, font } from '@app/styles';
import { MaterialCommunityIcon } from '@app/components';
import { UnAuthNavigationProp } from '../../types/navigation/types';
import { storeStatusGetStarted } from '@app/helpers';

const options = [
  {
    description:
      'Get a premium wash that removes dirt, dust, and grime for a sparkling clean finish.',
    image: IMAGES.FIRST,
  },
  {
    description: 'Our expert detailing makes your car look and feel brand new.',
    image: IMAGES.SECOND,
  },
  {
    description: 'Get a spotless clean without breaking the bank.',
    image: IMAGES.THIRD,
  },
];

const GettingStarted = () => {
  const navigation = useNavigation<UnAuthNavigationProp>();
  const [position, setPosition] = useState(0);

  const login = () => {
    navigation.replace('Login');
    storeStatusGetStarted();
  };

  const next = () => {
    if (position === options.length - 1) {
      login();
    } else {
      setPosition((prev) => prev + 1);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={options[position].image} style={styles.image} />
        <Text style={styles.description}>{options[position].description}</Text>
        <View style={styles.indicatorContainer}>
          {options.map((_item, index) => (
            <View
              key={index}
              style={[styles.indicator, position === index && styles.activeIndicator]}
            />
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={login}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={next}>
          <MaterialCommunityIcon name="chevron-right-circle" size={60} color="#050303" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    paddingHorizontal: 10,
  },
  content: {
    gap: 15,
    marginTop: 45,
  },
  description: {
    ...font.regular,
    fontSize: 29,
    color: '#050303',
  },
  image: {
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#050303',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '5%',
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    ...font.regular,
    fontSize: 20,
    color: '#050303',
  },
});

export default GettingStarted;
