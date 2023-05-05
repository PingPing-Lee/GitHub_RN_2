import Types from '../../action/types';
import ThemeFactory, { ThemeFlags } from '../../../res/styles/ThemeFactory';

//定义state默认值，注意这里的数据结构取值的时候要保持一致
const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  onShowCustomThemeView: false,
};
/**
 * action处理函数，处理action返回state
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      };
    case Types.SHOW_THEME_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible,
      };
    default:
      return state;
  }
}
