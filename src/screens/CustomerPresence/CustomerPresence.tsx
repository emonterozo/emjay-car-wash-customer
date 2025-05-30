import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Text, Image, FlatList } from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { color, font } from '@app/styles';
import { AppHeader, EmptyState, ErrorModal, LoadingAnimation } from '@app/components';
import { CustomerQueue, ScreenStatusProps } from 'src/types/services/types';
import GlobalContext from '@app/context';
import { NavigationProp } from 'src/types/navigation/types';
import { ERR_NETWORK, IMAGES } from '@app/constant';
import { getCustomerQueue } from '@app/services';

const renderSeparator = () => <View style={styles.separator} />;

const CustomerPresence = () => {
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation<NavigationProp>();
  const [screenStatus, setScreenStatus] = useState<ScreenStatusProps>({
    isLoading: false,
    hasError: false,
    type: 'error',
  });
  const [customerQueue, setCustomerQueue] = useState<CustomerQueue[]>([]);
  const [queue, setQueue] = useState(0);

  const fetchCustomerQueue = async () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
    const response = await getCustomerQueue(user.accessToken, user.refreshToken);
    if (response.success && response.data) {
      setCustomerQueue(response.data.transactions);
      setQueue(response.data.queue);
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
    fetchCustomerQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancel = () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });
    navigation.goBack();
  };

  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const cardItem = ({ item }: { item: CustomerQueue }) => {
    // Parse the ISO date string into a Date object
    const parsedDate = new Date(item.date);
    // Format the date as "03 Mar"
    const formattedDate = format(parsedDate, 'dd MMM');
    // Format the time as "9:20 AM"
    const formattedTime = format(parsedDate, 'h:mm a');
    return (
      <View style={styles.card}>
        {/* First Row */}
        <View style={styles.firstRow}>
          <Image source={IMAGES.EM_JAY} style={styles.image} resizeMode="contain" />
          <View style={styles.textContainer}>
            <Text style={[styles.textRegular, styles.text24, styles.textBlack]}>
              {item.service_name}
            </Text>
            <Text style={[styles.textBold, styles.text16, styles.textDarkerGrey]}>
              Emjay Customer
            </Text>
            <Text style={[styles.textRegular, styles.text16, styles.textGrey]}>
              {item.description}
            </Text>
          </View>
        </View>

        {/* Second Row */}
        <View style={styles.secondRow}>
          {/* First Column - Date */}
          <View style={styles.column}>
            <Text style={[styles.textBold, styles.text16, styles.textDarkerGrey]}>Date</Text>
            <Text style={[styles.textRegular, styles.text16, styles.textGrey]}>
              {formattedDate}
            </Text>
          </View>

          {/* Second Column - Time */}
          <View style={styles.column}>
            <Text style={[styles.textBold, styles.text16, styles.textDarkerGrey]}>Time</Text>
            <Text style={[styles.textRegular, styles.text16, styles.textGrey]}>
              {formattedTime}
            </Text>
          </View>

          {/* Third Column - Status (Card-like View) */}
          <View style={styles.statusContainer}>
            <Text style={[styles.textRegular, styles.text16, styles.textWhite]}>
              {capitalize(item.status)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <LoadingAnimation isLoading={screenStatus.isLoading} type="modal" />
      <ErrorModal
        type={screenStatus.type}
        isVisible={screenStatus.hasError}
        onCancel={onCancel}
        onRetry={fetchCustomerQueue}
      />
      <AppHeader title="Services" />
      <View style={styles.heading}>
        <Text style={[styles.text16, styles.textDarkerGrey]}>Customers in Queue</Text>
        <View style={styles.counterCard}>
          <Text style={[styles.text16, styles.textWhite]}>{queue}</Text>
        </View>
      </View>
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.list}
        data={customerQueue}
        renderItem={cardItem}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={
          <EmptyState
            source={IMAGES.VEHICLE}
            title="Fresh lanes ahead!"
            description="No one's in line just yet—your car's next in queue for that fresh, clean shine."
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 25,
  },
  text16: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
  },
  text24: {
    fontSize: 24,
    lineHeight: 24,
  },
  textRegular: {
    ...font.regular,
  },
  textBold: {
    ...font.bold,
  },
  textWhite: {
    color: color.background,
  },
  textDarkerGrey: {
    color: '#696969',
  },
  textGrey: {
    color: '#888888',
  },
  textBlack: {
    color: color.black,
  },
  counterCard: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 10,
  },
  card: {
    backgroundColor: color.background,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 24,
  },
  separator: {
    marginTop: 24,
  },
  image: {
    height: 90,
    width: 108,
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#1F93E1',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    gap: 8,
  },
});

export default CustomerPresence;
