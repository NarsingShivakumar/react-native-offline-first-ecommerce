// src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Type-Safe Navigation
 * Interview: Why TypeScript for navigation?
 * Answer: Type safety for params, autocomplete, compile-time errors
 */

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { productId: number };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: { productId: number };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
