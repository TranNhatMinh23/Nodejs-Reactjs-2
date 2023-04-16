import { combineReducers } from "redux";

import session from './session';
import register from './register';
import entertainer_types from './entertainer_types';
import plans from './plans';
import loading from './loading';
import auth from './auth';
import coming_soon from './coming_soon';
import packages_extras from './packages_extras';
import booking from './booking';
import search from './search';
import entertainer_category from './entertainer_category';
import my_gigs from './my_gigs';
import complete_booking from "./complete_booking";
import payment_methods from './payment_methods';
import gig from "./gig";
import how_it_work from "./how_it_work";
import my_booking from './my_booking';
import calendars from './calendars';
import header_notification from './header_notification';
import messages from './messages';
import policy from './policy';
import progress_profiles from './progress_profiles';
import cancellation_policy from './cancellation_policy';
import payments from './payments';
import notice_response from './notice_response';
import bank_accounts from './bank_accounts';
import toggle_menu from './toggle_menu';
import reasons from './reasons';
import payment_history from './payment_history';
import issues from './issues';
import overview from './overview';

export default combineReducers({
  session,
  register,
  entertainer_types,
  plans,
  loading,
  auth,
  coming_soon,
  packages_extras,
  booking,
  search,
  entertainer_category,
  my_gigs,
  complete_booking,
  payment_methods,
  gig,
  how_it_work,
  my_booking,
  calendars,
  header_notification,
  messages,
  policy,
  progress_profiles,
  cancellation_policy,
  payments,
  notice_response,
  bank_accounts,
  toggle_menu,
  reasons,
  payment_history,
  issues,
  overview
});
