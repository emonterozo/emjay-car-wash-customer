import React, { useContext, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, ScrollView } from 'react-native';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, font } from '@app/styles';
import {
  AppHeaderImage,
  ConfirmationModal,
  HorizontalLine,
  MaterialCommunityIcon,
} from '@app/components';
import { IMAGES } from '@app/constant';

import GlobalContext from '@app/context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'src/types/navigation/types';
import { ExitIcon, PrivacyPolicyIcon, ProfileIcon, TermsAndConditionsIcon } from '@app/icons';

const defaultUser = {
  id: '',
  first_name: '',
  last_name: '',
  gender: '',
  birth_date: '',
  username: '',
  accessToken: '',
  refreshToken: '',
  fcmToken: '',
  address: '',
  barangay: '',
  city: '',
  province: '',
};

const More = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user, setUser } = useContext(GlobalContext);
  const navigation = useNavigation<NavigationProp>();

  const handleSignOut = () => {
    setIsModalVisible(true);
  };

  const onSignOutYes = () => {
    setUser(defaultUser);
    setIsModalVisible(false);
  };

  const onSignOutNo = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <StatusBar backgroundColor={color.background} barStyle="dark-content" />
        <AppHeaderImage
          title={`${user.first_name} ${user.last_name}`}
          subtitle="What would you like to do?"
          imageSource={user.gender === 'MALE' ? IMAGES.AVATAR_BOY : IMAGES.AVATAR_GIRL}
        />
        <ConfirmationModal
          isVisible={isModalVisible}
          type="SignOut"
          onYes={onSignOutYes}
          onNo={onSignOutNo}
          textCancel="Cancel"
          textProceed="Confirm"
          haImage={false}
        />
        <HorizontalLine />
        <View style={styles.option}>
          <Text style={styles.textHeader}>GENERAL</Text>
          <TouchableOpacity style={styles.itemRow} onPress={() => navigation.navigate('Profile')}>
            <View style={styles.leftGroup}>
              <ProfileIcon width={24} height={24} />
              <Text style={[styles.itemText, styles.colorGrey]}>View Profile</Text>
            </View>
            <MaterialCommunityIcon name="chevron-right" size={24} color="#696969" />
          </TouchableOpacity>
        </View>
        <HorizontalLine />

        <View style={styles.option}>
          <Text style={styles.textHeader}>OTHER</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <View style={styles.leftGroup}>
                <PrivacyPolicyIcon width={24} height={24} />
                <Text style={[styles.itemText, styles.colorGrey]}>Privacy Policy</Text>
              </View>
              <MaterialCommunityIcon name="chevron-right" size={24} color="#696969" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => navigation.navigate('TermsConditions')}
            >
              <View style={styles.leftGroup}>
                <TermsAndConditionsIcon width={24} height={24} />
                <Text style={[styles.itemText, styles.colorGrey]}>Terms & Condition</Text>
              </View>
              <MaterialCommunityIcon name="chevron-right" size={24} color="#696969" />
            </TouchableOpacity>
          </View>
        </View>

        <HorizontalLine />

        <TouchableOpacity style={styles.bottom} onPress={handleSignOut}>
          <View style={styles.leftGroup}>
            <ExitIcon width={24} height={24} fill="#FF7070" />
            <Text style={[styles.itemText, styles.colorRed]}>Sign Out</Text>
          </View>
          <View style={styles.versionContainer}>
            <Text style={styles.version}>{`v${Config.APP_VERSION}`}</Text>
            {Config.APP_ENV !== 'Production' && (
              <Text style={styles.version}>{`(${Config.APP_ENV})`}</Text>
            )}
          </View>
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
  option: {
    marginHorizontal: 24,
    marginVertical: 24,
  },
  textHeader: {
    ...font.bold,
    fontSize: 16,
    color: '#888888',
    lineHeight: 16,
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
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
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    padding: 12,
    marginTop: 24,
  },
  row: {
    gap: 24,
  },
});

export default More;
