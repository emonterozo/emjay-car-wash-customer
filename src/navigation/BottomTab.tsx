import React from 'react';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Home, Services, QRCard, Transaction, More } from '@app/screens';
import { IMAGES } from '@app/constant';

const Tab = createBottomTabNavigator();

const TAB_ITEMS = [
  {
    icon_active: <Image source={IMAGES.HOME_ACTIVE} resizeMode="contain" />,
    icon_inactive: <Image source={IMAGES.HOME_INACTIVE} resizeMode="contain" />,
  },
  {
    icon_active: <Image source={IMAGES.SERVICE_ACTIVE} resizeMode="contain" />,
    icon_inactive: <Image source={IMAGES.SERVICE_INACTIVE} resizeMode="contain" />,
  },
  {
    icon_active: <Image source={IMAGES.QR_ACTIVE} resizeMode="contain" />,
    icon_inactive: <Image source={IMAGES.QR_INACTIVE} resizeMode="contain" />,
  },
  {
    icon_active: <Image source={IMAGES.HISTORY_ACTIVE} resizeMode="contain" />,
    icon_inactive: <Image source={IMAGES.HISTORY_INACTIVE} resizeMode="contain" />,
  },
  {
    icon_active: <Image source={IMAGES.MORE_ACTIVE} resizeMode="contain" />,
    icon_inactive: <Image source={IMAGES.MORE_INACTIVE} resizeMode="contain" />,
  },
];

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={handlePress} style={styles.tabButton}>
            {isFocused ? TAB_ITEMS[index].icon_active : TAB_ITEMS[index].icon_inactive}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="QRCard" component={QRCard} />
      <Tab.Screen name="Transaction" component={Transaction} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F2EF',
    marginBottom: 8,
    borderTopWidth: 1,
    borderColor: '#B7B7B7',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    paddingVertical: 20,
  },
  tabButton: {
    alignItems: 'center',
    gap: 6,
  },
});
