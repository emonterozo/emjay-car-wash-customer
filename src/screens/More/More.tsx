import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import { color, font } from '@app/styles';
import { AppHeaderImage, HorizontalLine } from '@app/components';
import { IMAGES } from '@app/constant';
import { ScrollView } from 'react-native-gesture-handler';

const More = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <StatusBar backgroundColor={color.background} barStyle="dark-content" />
        <AppHeaderImage
          title="John Doe"
          subtitle="What would you like to do?"
          imageSource={IMAGES.AVATAR_BOY}
        />
        <HorizontalLine />
        <View>
          <Text style={styles.textGeneral}>GENERAL</Text>
        </View>
        <TouchableOpacity style={styles.itemRow} onPress={() => {}}>
          <View style={styles.leftGroup}>
            <Image source={IMAGES.EDIT_PROFILE} style={[styles.image, styles.imageContainer]} />
            <Text style={[styles.itemText, styles.colorGrey]}>Edit Profile</Text>
          </View>

          <Image
            source={IMAGES.CHEVRON_RIGHT_BUTTON}
            style={[styles.image, styles.imageContainer]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow} onPress={() => {}}>
          <View style={styles.leftGroup}>
            <Image
              source={IMAGES.NOTIFICATION_SETTINGS}
              style={[styles.image, styles.imageContainer]}
            />
            <Text style={[styles.itemText, styles.colorGrey]}>Notification Settings</Text>
          </View>

          <Image
            source={IMAGES.CHEVRON_RIGHT_BUTTON}
            style={[styles.image, styles.imageContainer]}
          />
        </TouchableOpacity>

        <HorizontalLine />

        <View>
          <Text style={styles.textGeneral}>OTHER</Text>
        </View>

        <TouchableOpacity style={styles.itemRow} onPress={() => {}}>
          <View style={styles.leftGroup}>
            <Image source={IMAGES.PRIVACY_POLICY} style={[styles.image, styles.imageContainer]} />
            <Text style={[styles.itemText, styles.colorGrey]}>Privacy Policy</Text>
          </View>
          <Image
            source={IMAGES.CHEVRON_RIGHT_BUTTON}
            style={[styles.image, styles.imageContainer]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.itemRow, styles.verticalGap]} onPress={() => {}}>
          <View style={styles.leftGroup}>
            <Image
              source={IMAGES.TERMS_AND_CONDITION}
              style={[styles.image, styles.imageContainer]}
            />
            <Text style={[styles.itemText, styles.colorGrey]}>Terms & Condition</Text>
          </View>
          <Image
            source={IMAGES.CHEVRON_RIGHT_BUTTON}
            style={[styles.image, styles.imageContainer]}
          />
        </TouchableOpacity>

        <HorizontalLine />

        <TouchableOpacity style={[styles.itemRow, styles.topGap]} onPress={() => {}}>
          <View style={styles.leftGroup}>
            <Image source={IMAGES.SIGN_OUT} style={[styles.image, styles.imageContainer]} />
            <Text style={[styles.itemText, styles.colorRed]}>Sign Out</Text>
          </View>
          <Text style={styles.version}>V1.0.0</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    flex: 1,
  },
  textGeneral: {
    ...font.bold,
    fontSize: 16,
    color: '#888888',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  imageContainer: {
    width: 24,
    height: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginStart: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 12,
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
  },
  version: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#888888',
  },
  colorGrey: {
    color: '#696969',
  },
  colorRed: {
    color: '#FF7070',
  },
  verticalGap: {
    marginBottom: 24,
  },
  topGap: {
    marginTop: 24,
  },
});

export default More;
