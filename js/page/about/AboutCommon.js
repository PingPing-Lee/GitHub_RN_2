import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import BackPressComponent from '../../component/BackPressComponent';
import NavigationUtil from '../../navigator/NavigationUtil';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';

import ImageCrop from '../../../ImageCrop';

const THEME_COLOR = '#678';
export const FLAG_ABOUT = { flag_about: 'about', flag_about_me: 'about_me' };

export default class AboutCommon extends Component {
  constructor(props, updateState) {
    super(props);
    this.updateState = updateState;
    this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });
    this.state = {
      result: '',
    };
  }

  async componentDidMount() {
    console.log('123323123', 123321);

    this.backPress.componentDidMount();
    fetch('https://github.com/PingPing-Leeio/GitHubPopular/json/github_app_config.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network Error');
      })
      .then(config => {
        if (config) {
          this.updateState({
            data: config,
          });
        }
      })
      .catch(e => {
        console(e);
      });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(123, nextProps, prevState, this);
    // if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
    //   return {
    //     keys: CustomKeyPage._keys(nextProps, null, prevState),
    //   };
    // }
    return nextProps;
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  // 选择头像
  onSelectCrop = () => {
    console.log('ImageCrop', ImageCrop);
    ImageCrop.selectWithCrop(parseInt(200), parseInt(200))
      .then(result => {
        const temp = result.imageUrl ? result.imageUrl : result;
        let avatar = Platform.OS === 'android' ? 'file:///' + temp : temp;
        console.log('result', result, avatar);
        this.setState({ result: avatar }, () => console.log(this));
      })
      .catch(e => {
        this.setState({ result: e });
      });
  };

  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }

  onShare() {}

  getParallaxRenderConfig(params) {
    console.log('getParallaxRenderConfig', this);
    const { userInfo } = this.props;
    const { result } = this.state;
    let config = {};
    let avatar =
      typeof userInfo.avatar === 'string' ? { uri: result || userInfo.avatar } : userInfo.avatar;
    console.log(avatar, ':avatar，this.state:', this.state);
    config.renderBackground = () => (
      <View key="background">
        <Image
          source={{
            uri: params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            backgroundColor: 'rgba(0,0,0,.4)',
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
      </View>
    );
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <TouchableOpacity onPress={() => this.onSelectCrop()}>
          <Image style={styles.avatar} source={avatar} />
        </TouchableOpacity>
        <Text style={styles.sectionSpeakerText}>{userInfo.userName}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{userInfo.userName}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    );
    return config;
  }

  render(contentView, params) {
    console.log(contentView, params, '123323133131');
    const renderConfig = this.getParallaxRenderConfig(params);
    const { result } = this.state;
    let imgUrl = Platform.OS === 'android' ? 'file:///' + result : result;
    let imageView =
      result === '' ? null : <Image style={{ height: 200, width: 200 }} source={{ uri: imgUrl }} />;
    return (
      <ParallaxScrollView
        backgroundColor={THEME_COLOR}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...renderConfig}
      >
        {contentView}
        {imageView}
      </ParallaxScrollView>
    );
  }
}
const window = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 300;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? GlobalStyles.nav_bar_height_ios + 20
    : GlobalStyles.nav_bar_height_android;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: 300,
    justifyContent: 'flex-end',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 80,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
  },
});
