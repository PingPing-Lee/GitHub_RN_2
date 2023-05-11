/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './js/App';
import { name as appName } from './app.json';

LogBox.ignoreLogs(['ViewPropTypes will be removed', 'ColorPropType will be removed']);

AppRegistry.registerComponent(appName, () => App);
