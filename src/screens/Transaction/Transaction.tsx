import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { format, subMonths } from 'date-fns';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { ScreenStatusProps, TransactionItem } from '../../types/services/types';
import { WaterDropIcon } from '@app/icons';
import {
  AppHeaderImage,
  EmptyState,
  ErrorModal,
  HorizontalLine,
  LoadingAnimation,
  ServiceTransactionItem,
} from '@app/components';
import GlobalContext from '@app/context';
import { color, font } from '@app/styles';
import { ERR_NETWORK, IMAGES } from '@app/constant';
import { formattedNumber } from '@app/helpers';
import { getTransactionsRequest } from '@app/services';
import { NavigationProp } from '../../types/navigation/types';

const renderSeparator = () => <View style={styles.separator} />;

const Transaction = () => {
  const { user } = useContext(GlobalContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp>();
  const [screenStatus, setScreenStatus] = useState<ScreenStatusProps>({
    isLoading: false,
    hasError: false,
    type: 'error',
  });
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const fetchTransactions = async () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
    const response = await getTransactionsRequest(
      user.accessToken,
      user.refreshToken,
      {
        start: format(subMonths(new Date(), 2), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
      },
      user.id,
    );

    if (response.success && response.data) {
      setTransactions(response.data.transactions);
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
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onCancel = () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <LoadingAnimation isLoading={screenStatus.isLoading} type="modal" />
      <ErrorModal
        type={screenStatus.type}
        isVisible={screenStatus.hasError}
        onCancel={onCancel}
        onRetry={fetchTransactions}
      />
      <AppHeaderImage
        title={`${user.first_name} ${user.last_name}`}
        subtitle="What would you like to do?"
        imageSource={user.gender === 'MALE' ? IMAGES.AVATAR_BOY : IMAGES.AVATAR_GIRL}
      />
      <HorizontalLine />
      <View style={styles.heading}>
        <Text style={styles.label}>Services availed in the past 2 months</Text>
      </View>

      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.list}
        data={transactions}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TransactionDetails', {
                transactionId: item.transaction_id,
                transactionServiceId: item.transaction_availed_service_id,
              });
            }}
          >
            <ServiceTransactionItem
              icon={<WaterDropIcon />}
              serviceName={item.service_name}
              price={formattedNumber(item.price)}
              date={format(new Date(item.date), 'dd MMM, hh:mm a')}
            />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={
          <EmptyState
            title="No services availed yet"
            description="You haven't availed any car wash services yet. Start availing our services to see your activity here."
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
    marginBottom: 15,
    paddingHorizontal: 25,
  },
  label: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#696969',
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
  },
  separator: {
    marginTop: 24,
  },
});

export default Transaction;
