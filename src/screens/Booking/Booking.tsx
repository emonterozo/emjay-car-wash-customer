import { View, Text, StyleSheet, StatusBar, Image, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

import { color, font } from '@app/styles';
import {
  AppHeader,
  Button,
  CalendarPickerTrigger,
  ConfirmationModal,
  ErrorModal,
  LoadingAnimation,
  Toast,
} from '@app/components';
import {
  BookingAction,
  Booking as BookingType,
  ScreenStatusProps,
  Slot,
  UserBooking,
} from '../../types/services/types';
import GlobalContext from '@app/context';
import { NavigationProp } from '../../types/navigation/types';
import { ERR_NETWORK, IMAGES } from '@app/constant';
import { getBookingRequest, getBookingsRequest, updateBookingRequest } from '@app/services';
import { DateConfig } from '../../components/CalendarPicker/CalendarPicker';

const Booking = () => {
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation<NavigationProp>();
  const [screenStatus, setScreenStatus] = useState<ScreenStatusProps>({
    isLoading: false,
    hasError: false,
    type: 'error',
  });
  const [userBooking, setUserBooking] = useState<UserBooking | null>(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'error',
  });
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [datesConfig, setDatesConfig] = useState<DateConfig[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);

  const fetchBookings = async () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
    const response = await getBookingsRequest(user.accessToken, user.refreshToken);
    if (response.success && response.data) {
      setUserBooking(response.data.user_booking);
      setBookings(response.data.bookings);
      const dates = response.data.bookings.map((booking) => ({
        date: format(new Date(booking.date), 'yyyy-MM-dd'),
        is_open: booking.is_open,
      }));
      setDatesConfig(dates);
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
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBooking = async (action: BookingAction) => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
    const response = await updateBookingRequest(
      user.accessToken,
      user.refreshToken,
      format(new Date(action === 'UNBOOKED' ? userBooking?.date! : selectedDate!), 'yyyy-MM-dd'),
      action === 'UNBOOKED' ? userBooking?.slots[0]._id! : selectedSlot!,
      action,
    );
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });
    if (response.success) {
      setUserBooking(null);
      setToast({
        isVisible: true,
        message:
          action === 'UNBOOKED'
            ? 'Booking cancelled successfully.'
            : 'Booking submitted successfully.',
        type: 'success',
      });
      setSelectedDate(undefined);
      setSelectedSlot(undefined);
      setSlots([]);
      fetchBookings();

      return;
    }

    if (!response.success) {
      let message = 'Something went wrong. Please try again.';

      if (response.errors && response.errors.length > 0) {
        message = response.errors[0].message;
        setToast({
          isVisible: true,
          message: message,
          type: 'error',
        });
      }
    }
  };

  const onCancel = () => {
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });
    navigation.goBack();
  };

  const handleConfirmationPress = (action: 'yes' | 'no') => {
    setIsConfirmationVisible(false);
    if (action === 'yes') {
      updateBooking('UNBOOKED');
    }
  };

  const onToastClose = () => setToast({ isVisible: false, message: '', type: 'error' });

  const getFirstOpeningDate = () => {
    if (bookings.length === 0) {
      return new Date();
    }
    if (selectedDate) {
      return new Date(selectedDate);
    }
    const firstBookingDate = bookings.filter((booking) => booking.is_open)[0].date;
    return new Date(firstBookingDate);
  };

  const onSelectedDate = async (date: Date) => {
    const currentSelected = selectedDate;
    const formattedDate = format(date, 'yyyy-MM-dd');
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: true });
    const response = await getBookingRequest(
      user.accessToken,
      user.refreshToken,
      `${formattedDate}`,
    );
    setScreenStatus({ ...screenStatus, hasError: false, isLoading: false });
    if (response.success && response.data) {
      setSelectedDate(formattedDate);
      setSlots(response.data.booking.slots);
    } else {
      setSelectedDate(currentSelected);
      setToast({
        isVisible: true,
        message: `Something went wrong fetching slots for ${format(
          date,
          'MMMM dd, yyyy',
        )}. Please try again.`,
        type: 'error',
      });
    }
  };

  const isNoAddress = () => {
    return user.address === null || user.barangay === null || user.city === null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.background} barStyle="dark-content" />
      <LoadingAnimation isLoading={screenStatus.isLoading} type="modal" />
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        duration={3000}
        type={toast.type as 'error' | 'success' | 'info'}
        onClose={onToastClose}
      />
      <ErrorModal
        type={screenStatus.type}
        isVisible={screenStatus.hasError}
        onCancel={onCancel}
        onRetry={fetchBookings}
      />
      <ConfirmationModal
        type="CancelBooking"
        isVisible={isConfirmationVisible}
        onNo={() => handleConfirmationPress('no')}
        onYes={() => handleConfirmationPress('yes')}
      />
      <AppHeader title="Book Service" />
      <View style={styles.heading}>
        <Text style={[styles.text16, styles.textDarkerGrey]}>
          {userBooking ? 'Upcoming Booked Service' : 'Start by Scheduling a Service'}
        </Text>
      </View>
      {isNoAddress() && (
        <View style={styles.contentUpdate}>
          <Text style={[styles.text16, styles.textDarkerGrey]}>
            Please update your address first so our team can locate you for the car service booking.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.updateButton, pressed && styles.buttonPressed]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            {({ pressed }) => (
              <Text style={[styles.buttonUpdateText, pressed && { color: color.primary }]}>
                Click to Update Address
              </Text>
            )}
          </Pressable>
        </View>
      )}
      {!isNoAddress() && bookings.length > 0 && !userBooking && (
        <View style={styles.booking}>
          <CalendarPickerTrigger
            date={getFirstOpeningDate()}
            label="Choose Date"
            placeholder="Select Date"
            value={selectedDate ? format(new Date(selectedDate), 'MMMM dd, yyyy') : undefined}
            onSelectedDate={onSelectedDate}
            minDate={new Date(bookings[0].date)}
            maxDate={new Date(bookings[bookings.length - 1].date)}
            disabledCalendarChange={true}
            datesConfig={datesConfig}
          />
          <View>
            {slots.length > 0 && <Text style={styles.label}>Choose Time Slot</Text>}
            <View style={styles.slotContainer}>
              {slots.map((slot) => (
                <Pressable
                  key={slot._id}
                  style={[
                    styles.slot,
                    slot.customer_id && styles.optionSelectedContainer,
                    slot._id === selectedSlot && {
                      backgroundColor: color.primary_pressed_state,
                    },
                  ]}
                  onPress={() => setSelectedSlot(slot._id)}
                  disabled={slot.customer_id !== null}
                >
                  <Text
                    style={[styles.slotText, slot.customer_id && styles.optionSelectedText]}
                  >{`${slot.start_time} - ${slot.end_time}`}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          {selectedSlot && (
            <Button
              title="Submit Booking"
              variant="primary"
              buttonStyle={styles.submit}
              textStyle={styles.textStyle}
              onPress={() => updateBooking('BOOKED')}
              flex={0}
            />
          )}
        </View>
      )}
      {userBooking && (
        <View style={styles.card}>
          <Image style={styles.cover} source={IMAGES.EM_JAY} resizeMode="cover" />
          <View style={styles.content}>
            <Text style={styles.name}>
              {format(new Date(userBooking.date), 'EEE, MMM dd, yyyy')}
            </Text>
            <Text
              style={styles.description}
            >{`Time Slot: ${userBooking.slots[0].start_time} - ${userBooking.slots[0].end_time}`}</Text>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={() => setIsConfirmationVisible(true)}
            >
              {({ pressed }) => (
                <Text style={[styles.buttonText, pressed && { color: color.primary }]}>
                  Cancel Booking
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
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
  textDarkerGrey: {
    color: '#696969',
  },
  card: {
    backgroundColor: color.background,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 25,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1F93E1',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#F3F2EF',
  },
  name: {
    ...font.regular,
    fontSize: 24,
    lineHeight: 24,
    color: '#000000',
  },
  description: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#888888',
  },
  content: {
    paddingHorizontal: 16,
    gap: 24,
    marginTop: 16,
  },
  buttonPressed: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: color.primary,
  },
  slot: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: color.primary,
    alignItems: 'center',
  },
  slotText: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: color.secondary,
  },
  label: {
    ...font.regular,
    fontSize: 16,
    lineHeight: 16,
    color: '#050303',
  },
  submit: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 28,
  },
  textStyle: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
  },
  booking: {
    marginHorizontal: 25,
    marginTop: 25,
    gap: 16,
  },
  slotContainer: {
    gap: 16,
    marginTop: 8,
  },
  optionSelectedContainer: {
    backgroundColor: '#D9D9D9',
  },
  optionSelectedText: { color: '#888888' },
  cover: {
    width: '100%',
    height: 200,
  },
  updateButton: {
    backgroundColor: '#1F93E1',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
    height: 50,
  },
  buttonUpdateText: {
    ...font.regular,
    fontSize: 20,
    lineHeight: 20,
    color: '#F3F2EF',
  },
  contentUpdate: {
    marginTop: 10,
    marginHorizontal: 25,
    gap: 10,
  },
});

export default Booking;
