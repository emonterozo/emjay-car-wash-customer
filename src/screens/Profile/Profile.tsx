import React, { useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { AppHeader } from '@app/components';
import { color, font } from '@app/styles';
import GlobalContext from '@app/context';
import { NavigationProp } from '../../types/navigation/types';

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useContext(GlobalContext);

  const handlePress = (type: 'edit' | 'change') => {
    navigation.navigate(type === 'edit' ? 'EditProfile' : 'ChangePassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <AppHeader title="Profile" />
      <View style={styles.headerContent}>
        <Text style={styles.title}>PERSONAL DETAILS</Text>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('edit')}>
          <Text style={styles.edit}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.itemRow}>
          <View style={styles.itemContainer}>
            <Text style={styles.label}>Full name</Text>
            <Text style={styles.value}>{`${user.first_name} ${user.last_name}`}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemContainer}>
            <Text style={styles.label}>Date of birth</Text>
            <Text style={styles.value}>{format(new Date(user.birth_date), 'MMMM dd, yyyy')}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemContainer}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{user.gender[0] + user.gender.slice(1).toLowerCase()}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemContainer}>
            <Text style={styles.label}>Phone number</Text>
            <Text style={styles.value}>{user.username}</Text>
          </View>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.buttonChange,
          { backgroundColor: pressed ? color.primary_pressed_state : color.primary },
        ]}
        onPress={() => handlePress('change')}
      >
        <Text style={styles.buttonText}>Change password</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  title: {
    ...font.bold,
    fontSize: 16,
    color: '#888888',
    lineHeight: 16,
  },
  headerContent: {
    paddingHorizontal: 24,
    marginVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  itemContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  label: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
    color: '#050303',
  },
  value: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#696969',
  },
  edit: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#050303',
  },
  button: {
    borderBottomWidth: 1,
    borderColor: '#050303',
  },
  buttonChange: {
    marginTop: 40,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 49,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 30,
  },
  buttonText: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default Profile;
