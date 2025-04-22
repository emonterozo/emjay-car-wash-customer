import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { color, font } from '@app/styles';

type NewAppHeaderProps = {
  imageSource: ImageSourcePropType;
  title: string;
  subtitle?: string;
};

const NewAppHeader = ({ imageSource, title, subtitle }: NewAppHeaderProps) => {
  return (
    <View style={styles.container}>
      {/* Left Side: Circular image */}
      <View style={styles.avatarContainer}>
        <Image source={imageSource} style={styles.avatar} />
      </View>

      {/* Center: Two texts in a column */}
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
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
  avatarContainer: {
    backgroundColor: '#1F93E1',
    borderRadius: 60,
    width: 60,
    height: 60,
    overflow: 'hidden',
  },
  avatar: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: '100%',
    height: '100%',
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
});

export default NewAppHeader;
