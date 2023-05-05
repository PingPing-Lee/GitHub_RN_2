import { combineReducers } from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';
import favorite from './favorite';
import language from './language';
import search from './search';

/**
 * 1.合并reducer，通过combineReducers将多个reducer合并成一个根reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const index = combineReducers({
  theme,
  popular,
  trending,
  favorite,
  language,
  search,
});

export default index;
