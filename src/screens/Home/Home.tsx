import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { color, font } from '@app/styles';
import { ERR_NETWORK, IMAGES } from '@app/constant';
import { ScreenStatusProps } from '../../types/services/types';
import { getWashPoints } from '@app/services';
import GlobalContext from '@app/context';
import { ErrorModal, LoadingAnimation } from '@app/components';

const Home = () => {
  const { user } = useContext(GlobalContext);
  const isFocused = useIsFocused();
  const [count, setCount] = useState({
    car: [
      {
        size: 'sm',
        count: 0,
      },
      {
        size: 'md',
        count: 20,
      },
      {
        size: 'lg',
        count: 10,
      },
      {
        size: 'xl',
        count: 0,
      },
      {
        size: 'xxl',
        count: 0,
      },
    ],
    motorcycle: [
      {
        size: 'sm',
        count: 0,
      },
      {
        size: 'md',
        count: 0,
      },
      {
        size: 'lg',
        count: 0,
      },
      {
        size: 'xl',
        count: 0,
      },
    ],
  });
  const [options, setOptions] = useState<{ key: keyof typeof count; count: number }[]>([
    { key: 'car', count: 40 },
    { key: 'motorcycle', count: 10 },
  ]);
  const [points, setPoints] = useState(0);
  const [selected, setSelected] = useState<keyof typeof count>('car');
  const [screenStatus, setScreenStatus] = useState<ScreenStatusProps>({
    isLoading: false,
    hasError: false,
    type: 'error',
  });

  const fetchTransaction = async () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
    const response = await getWashPoints(user.accessToken, user.id);

    if (response.success && response.data) {
      const { moto_wash_service_count, car_wash_service_count } = response.data.customer;
      setPoints(response.data.customer.points);
      setCount({
        car: car_wash_service_count,
        motorcycle: moto_wash_service_count,
      });
      const carTotalCount = car_wash_service_count.reduce((sum, item) => sum + item.count, 0);
      const motorcycleTotalCount = moto_wash_service_count.reduce(
        (sum, item) => sum + item.count,
        0,
      );

      setOptions([
        {
          key: 'car',
          count: carTotalCount,
        },
        {
          key: 'motorcycle',
          count: motorcycleTotalCount,
        },
      ]);
      setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });
    } else {
      setScreenStatus({
        isLoading: false,
        type: response.error === ERR_NETWORK ? 'connection' : 'error',
        hasError: true,
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const getSelected = () => {
    const value = options.find((option) => option.key === selected);

    return value?.count;
  };

  const onCancel = () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <LoadingAnimation isLoading={screenStatus.isLoading} type="modal" />
      <ErrorModal
        type={screenStatus.type}
        isVisible={screenStatus.hasError}
        onCancel={onCancel}
        onRetry={fetchTransaction}
      />
      <View style={styles.heading}>
        <View style={styles.greetingContainer}>
          <Text
            style={styles.greeting}
          >{`Hello, ${user.first_name} ${user.last_name}! \u{1F44B}`}</Text>
          <Text style={styles.subHeader}>What service do you need today?</Text>
        </View>
        <Image source={IMAGES.AVATAR_BOY} style={styles.avatar} resizeMode="contain" />
      </View>
      <View style={styles.pointsContainer}>
        <View style={styles.content}>
          <Text style={styles.points}>{`${points.toLocaleString()} Points`}</Text>
          <Text style={styles.label}>
            Earn more points by availing services to unlock free rewards!
          </Text>
        </View>
        <Image source={IMAGES.POINTS} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.washContainer}>
        <Text style={styles.title}>Wash Service Count</Text>
        <View style={styles.optionContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[styles.option, option.key !== selected && styles.optionInactive]}
              disabled={option.key === selected}
              onPress={() => setSelected(option.key)}
            >
              <Text
                style={[styles.optionText, option.key !== selected && styles.optionTextInactive]}
              >
                {option.key.charAt(0).toUpperCase() + option.key.slice(1)}
              </Text>
              <View style={[styles.count, option.key !== selected && styles.countInactive]}>
                <Text style={styles.countText}>{option.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.countContainer}>
          <Image
            source={selected === 'car' ? IMAGES.CAR : IMAGES.MOTORCYCLE}
            resizeMode="contain"
            style={styles.imageType}
          />
          <View style={styles.countContent}>
            <Text style={styles.countTitle}>{`${
              selected.charAt(0).toUpperCase() + selected.slice(1)
            } Wash Service`}</Text>
            <View style={styles.countView}>
              <Text style={styles.countLabel}>Total Wash Count:</Text>
              <Text style={styles.countValue}>{getSelected()}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
              style={styles.scrollView}
            >
              {count[selected].map((item) => (
                <View
                  key={item.size}
                  style={[styles.size, item.count < 10 && styles.optionInactive]}
                >
                  <Text style={[styles.countText, item.count < 10 && styles.optionTextInactive]}>
                    {item.size.toUpperCase()}
                  </Text>
                  <View style={[styles.sizeCount, item.count < 10 && styles.countInactive]}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2EF',
    paddingTop: 20,
    paddingBottom: 10,
  },
  avatar: {
    height: 60,
    width: 60,
    backgroundColor: '#46A6FF',
    borderRadius: 90,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  greetingContainer: {
    gap: 5,
    flex: 1,
  },
  greeting: {
    ...font.regular,
    fontSize: 24,
    color: '#050303',
  },
  subHeader: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 20,
    color: '#888888',
  },
  pointsContainer: {
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: color.primary,
    marginVertical: 24,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    ...font.bold,
    fontSize: 20,
    lineHeight: 20,
    color: '#050303',
  },
  label: {
    ...font.regular,
    fontSize: 16,
    color: '#888888',
  },
  title: {
    ...font.bold,
    fontSize: 20,
    lineHeight: 20,
    color: '#050303',
  },
  image: {
    width: 120,
    height: 100,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  washContainer: {
    marginHorizontal: 24,
    gap: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.primary,
  },
  optionInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888888',
  },
  optionText: {
    ...font.bold,
    fontSize: 16,
    color: color.background,
  },
  optionTextInactive: {
    ...font.regular,
    color: '#888888',
  },
  count: {
    backgroundColor: '#4BB543',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countInactive: {
    backgroundColor: '#888888',
  },
  countText: {
    ...font.regular,
    fontSize: 12,
    color: color.background,
  },
  size: {
    backgroundColor: color.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#4BB543',
  },
  countContainer: {
    borderWidth: 1,
    borderColor: color.primary,
    borderRadius: 20,
    paddingVertical: 16,
    paddingLeft: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  imageType: {
    position: 'absolute',
    right: -8,
    height: '100%',
    alignSelf: 'center',
  },
  countContent: {
    flex: 1,
    gap: 8,
  },
  countTitle: {
    ...font.bold,
    fontSize: 20,
    lineHeight: 20,
    color: color.black,
  },
  countLabel: {
    ...font.regular,
    fontSize: 12,
    color: '#888888',
  },
  countValue: {
    ...font.regular,
    fontSize: 20,
    color: color.primary,
  },
  countView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scrollView: {
    width: '68%',
  },
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default Home;
