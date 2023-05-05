import { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../redux/action';
import NavigationUtil from '../navigator/NavigationUtil';
import { getBoarding } from '../util/BoardingUtil';
import SplashScreen from 'react-native-splash-screen';

class WelcomePage extends Component {
  componentDidMount() {
    this.props.onThemeInit();
    this.doLaunch();
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return null;
  }

  async doLaunch() {
    const boarding = await getBoarding();
    const { navigation } = this.props;
    this.timer = setTimeout(() => {
      SplashScreen.hide();
      if (boarding) {
        NavigationUtil.resetToHomePage({
          navigation,
        });
      } else {
        NavigationUtil.login({
          navigation,
        });
      }
    }, 200);
  }
}

const mapDispatchToProps = (dispatch) => ({
  onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);
