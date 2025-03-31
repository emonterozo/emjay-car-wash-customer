import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

import { color } from '@app/styles';
import { AppHeader } from '@app/components';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Privacy Policy" />
      <WebView
        source={{
          uri: 'https://emonterozo.github.io/emjay-autospa/privacy-policy.html',
        }}
        style={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
});

export default PrivacyPolicy;
