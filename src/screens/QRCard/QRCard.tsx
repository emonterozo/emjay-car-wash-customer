import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, Text, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { color, font } from '@app/styles';
import { AppHeaderImage, HorizontalLine } from '@app/components';
import { IMAGES } from '@app/constant';
import GlobalContext from '@app/context';

const MESSAGE =
  'Show this to the Emjay Carwash & Detailing attendant every time you avail our services to earn and redeem your rewards.';
const WASH_EARN_PROMO_MESSAGE =
  'Keep your ride spotless and earn rewards! Every time you avail a wash service, you’ll earn 1 wash count based on your vehicle type and size. Once you collect 10 wash count, you can redeem a FREE wash service on your next visit. Stay fresh, stay rewarded!';
const EARN_POINTS_PROMO_MESSAGE =
  'Get more from every visit! Earn points from all services availed. Collect points and redeem them for free services or discounts on future promos. Unlock exclusive rewards and surprises every time you visit. Stay loyal, stay rewarded—earn every time!';
const QRCard = () => {
  const { user } = useContext(GlobalContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const CARD_WIDTH = 392 + 24;

  const onScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / CARD_WIDTH);
    setActiveIndex(index);
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
        <View style={styles.marginBottom35}>
          <HorizontalLine />
        </View>
        <View style={[styles.qrContainer, styles.marginBottom24]}>
          {user.id ? <QRCode value={user.id} /> : null}
        </View>
        <Text
          style={[
            styles.textContainer,
            styles.text16,
            styles.textRegular,
            styles.textGray,
            styles.marginBottom35,
          ]}
        >
          {MESSAGE}
        </Text>
        <View style={styles.marginBottom24}>
          <HorizontalLine />
        </View>
        <Text
          style={[
            styles.textPromo,
            styles.text20,
            styles.textBold,
            styles.textBlack,
            styles.marginBottom24,
          ]}
        >
          Exclusive Emjay Auto Spa Promos!
        </Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {/* First Card */}
          <View style={[styles.card, styles.cardBlue]}>
            <Image source={IMAGES.WASH_EARN_PROMO} style={styles.imagePromo} />
            <Text style={styles.title}>Wash & Earn Promo</Text>
            <Text style={styles.description}>{WASH_EARN_PROMO_MESSAGE}</Text>
          </View>
          {/* Second Card */}
          <View style={[styles.card, styles.cardGreen]}>
            <Image source={IMAGES.EARNING_POINTS_PROMO} style={styles.imagePromo} />
            <Text style={styles.title}>Earning Points Promo</Text>
            <Text style={styles.description}>{EARN_POINTS_PROMO_MESSAGE}</Text>
          </View>
        </ScrollView>

        {/* Indicator Circles */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, activeIndex === 0 && styles.activeIndicator]} />
          <View style={[styles.indicator, activeIndex === 1 && styles.activeIndicator]} />
        </View>
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
    marginBottom: 25,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 120,
    width: 120,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  marginBottom35: {
    marginBottom: 35,
  },
  marginBottom24: {
    marginBottom: 24,
  },
  textContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    textAlign: 'center',
  },
  textRegular: {
    ...font.regular,
  },
  textBold: {
    ...font.bold,
  },
  text16: {
    fontSize: 16,
    lineHeight: 16,
  },
  text20: {
    fontSize: 20,
    lineHeight: 20,
  },
  textGray: {
    color: '#696969',
  },
  textBlack: {
    color: color.black,
  },
  textPromo: {
    paddingHorizontal: 16,
  },
  card: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    marginHorizontal: 12,
    width: 320,
  },
  cardBlue: {
    backgroundColor: color.primary_pressed_state,
  },
  cardGreen: {
    backgroundColor: '#4BB543',
  },
  imagePromo: {
    width: 172,
    height: 120,
    resizeMode: 'cover',
  },
  scrollViewContainer: {
    paddingHorizontal: 12,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: color.primary,
  },
  title: {
    ...font.bold,
    fontSize: 20,
    lineHeight: 20,
    color: color.background,
  },
  description: {
    ...font.regular,
    fontSize: 12,
    lineHeight: 19,
    color: color.background,
    textAlign: 'center',
  },
});

export default QRCard;
