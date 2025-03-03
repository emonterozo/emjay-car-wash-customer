import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    borderBottomColor: 'rgba(136, 136, 136, 0.3)', // 30% opacity
    borderBottomWidth: 1,
  },
});

export default HorizontalLine;
