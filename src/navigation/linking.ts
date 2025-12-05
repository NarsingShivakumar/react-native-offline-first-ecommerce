import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { DEEP_LINK_CONFIG } from '../utils/constants';

/**
 * Deep linking configuration
 * Handles:
 * - shopmasterpro://product/1
 * - https://shopmasterpro.com/product/1
 */

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    `${DEEP_LINK_CONFIG.SCHEME}://`,
    `https://${DEEP_LINK_CONFIG.HOST}`,
  ],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Products: 'products',
          Cart: 'cart',
          Profile: 'profile',
        },
      },
      ProductDetail: {
        path: 'product/:productId',
        parse: {
          productId: (productId: string) => Number(productId),
        },
      },
    },
  },
};

export default linking;
