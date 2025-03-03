import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NavigationProp } from '../../types/navigation/types';
import { color, font } from '@app/styles';
import { IMAGES } from '@app/constant';

type NewAppHeaderProps = {
  imageSource: ImageSourcePropType;
  title: string;
  subtitle?: string;
  onPressRight?: () => void;
};

const NewAppHeader = ({ imageSource, title, subtitle, onPressRight }: NewAppHeaderProps) => {
  // const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Left Side: Circular image */}
      <View style={styles.circle}>
        <Image source={imageSource} style={styles.image} />
      </View>

      {/* Center: Two texts in a column */}
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right Side: Button Icon */}
      <TouchableOpacity onPress={onPressRight} style={styles.rightContainer}>
        <Image source={IMAGES.CLOSE_CIRCLE_BLACK} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#1F93E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 12,
  },
  title: {
    ...font.regular,
    fontSize: 24,
    color: color.black,
    lineHeight: 24,
  },
  subtitle: {
    ...font.regular,
    fontSize: 16,
    color: '#888888',
    marginTop: 4,
    lineHeight: 16,
  },
  rightContainer: {
    padding: 8,
  },
});

export default NewAppHeader;
