import type { StackScreenProps } from '@react-navigation/stack';
import { TransactionServicesResponse, TransactionStatusType } from '../services/types';
import type { RouteProp } from '@react-navigation/native';

export type CarwashList = {
  icon: string;
  size: string;
  description: string;
};

export type AuthStackParamList = {
  Attendance: undefined;
  Consumables: undefined;
  Customers: undefined;
  CustomerDetails: { id: string };
  BottomTab: undefined;
  Employee: undefined;
  EmployeeDetails: { id: string };
  Expenses: undefined;
  Ongoing: undefined;
  Publish: undefined;
  Sales: undefined;
  Scan: undefined;
  Services: undefined;
  Settings: undefined;
  Transaction: undefined;
  AddOngoing: {
    customerId: string | null;
    contactNumber: string | null;
    freeWash: { type: string; size: string }[];
    transaction:
      | (Omit<TransactionServicesResponse['transaction'], 'availed_services' | 'contact_number'> & {
          availedServices: string[];
        })
      | undefined;
  };
  PreTransaction: { id: string };
  EmployeeForm:
    | { type: 'Add'; employee?: never }
    | {
        type: 'Update';
        employee: {
          id: string;
          firstName: string;
          lastName: string;
          birthDate: string;
          gender: string;
          contactNumber: string;
          employeeTitle: string;
          employeeStatus: string;
          dateStarted: string;
        };
      };
  AvailedServices: {
    customerId: string | null;
    transactionId: string;
    transactionStatus: TransactionStatusType;
    model: string;
    plateNumber: string;
  };
  AvailedServiceDetails: {
    transactionId: string;
    transactionStatus: TransactionStatusType;
    transactionServiceId: string;
  };
  AvailedServiceForm: {
    service: {
      transactionId: string;
      transactionServiceId: string;
      title: string;
      price: number;
      discount: number;
      deduction: number;
      companyEarnings: number;
      employeeShare: number;
      serviceCharge: boolean;
      status: string;
      paymentStatus: boolean;
      startDateTime: string | '';
      endDateTime: string | '';
      assignedEmployees: string[];
    };
  };
  TransactionDetails: { transactionId: string; transactionServiceId: string };
  TransactionComputation: { startDate: string; endDate: string };
  ConsumablesForm: undefined;
  ExpensesForm: undefined;
  Statistics: undefined;
};

export type UnAuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  RegistrationOtp: { user: string; username: string };
};

export type NavigationProp = StackScreenProps<AuthStackParamList>['navigation'];
export type UnAuthNavigationProp = StackScreenProps<UnAuthStackParamList>['navigation'];

export type RegistrationOtpRouteProp = RouteProp<UnAuthStackParamList, 'RegistrationOtp'>;
