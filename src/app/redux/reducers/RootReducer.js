import { combineReducers } from 'redux';
import EcommerceReducer from './EcommerceReducer';
import NavigationReducer from './NavigationReducer';
import NotificationReducer from './NotificationReducer';
import StorefrontReducer from './StorefrontReducer';

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
  storefront: StorefrontReducer
});

export default RootReducer;
