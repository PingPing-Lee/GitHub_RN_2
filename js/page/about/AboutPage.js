import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

import shareData from '../../res/data/share.json';
import configData from '../../res/data/config';
import GlobalStyles from '../../res/styles/GlobalStyles';

import ViewUtil from '../../util/ViewUtil';
import ShareUtil from '../../util/ShareUtil';
import { MORE_MENU } from '../../util/MORE_MENU';
import NavigationUtil from '../../navigator/NavigationUtil';

import ImageCrop from '../../../ImageCrop';

import BackPressComponent from '../../component/BackPressComponent';
import AboutPageContent from './AboutPageContent';

export const FLAG_ABOUT = { flag_about: 'about', flag_about_me: 'about_me' };

const window = Dimensions.get('window');
const THEME_COLOR = '#678';
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 300;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? GlobalStyles.nav_bar_height_ios + 20
    : GlobalStyles.nav_bar_height_android;
const ASPECT_X = '200';
const ASPECT_Y = '100';

export default class AbouPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.route.params;
    this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });
    this.state = {
      result: '',
      aspectX: '200',
      aspectY: '100',
    };
  }
  onSelectCrop = () => {
    let aspectX, aspectY;
    let x = aspectX ? aspectX : ASPECT_X;
    let y = aspectY ? aspectY : ASPECT_Y;
    ImageCrop.selectWithCrop(parseInt(x), parseInt(y))
      .then(result => {
        this.setState({ result: result.imageUrl ? result.imageUrl : result });
      })
      .catch(e => {
        this.setState({ result: e });
      });
  };

  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }

  onShare() {
    let shareApp;
    const { flagAbout } = this.props;
    if (flagAbout === FLAG_ABOUT.flag_about_me) {
      shareApp = shareData.share_app;
    } else {
      shareApp = shareData.share_blog;
    }

    ShareUtil.shareboard(
      shareApp.content,
      shareApp.imgUrl,
      shareApp.url,
      shareApp.title,
      [0, 1, 2, 3, 4, 5, 6],
      (code, message) => {
        console.log('result:' + code + message);
      }
    );
    //第三方登录
    // ShareUtil.auth(0,e=>{
    //     console.log("result:" + e);
    // })
  }

  onClick(menu) {
    console.log('menu', menu, NavigationUtil);
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        params = this.props.route.params;
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://ping_muzi@163.com';
        Linking.canOpenURL(url)
          .then(support => {
            // debugger;
            if (!support) {
              console.log("Can't handle url: " + url);
            } else {
              Linking.openURL(url);
            }
          })
          .catch(e => {
            console.error('An error occurred', e);
          });
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }

  getParallaxRenderConfig() {
    const { params } = this.props.route;
    const { userInfo } = params;
    const { result } = this.state;
    let config = {};
    let avatar =
      typeof userInfo.avatar === 'string' ? { uri: result || userInfo.avatar } : userInfo.avatar;
    console.log(avatar, ':avatar，this.state:', this.state);
    config.renderBackground = () => (
      <View key="background">
        <Image
          source={{
            uri: configData.app.backgroundImg,
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

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }
  _item(data, isShow, key) {
    return ViewUtil.getSettingItem(
      () => {
        this.setState({
          [key]: !this.state[key],
        });
      },
      data.name,
      THEME_COLOR,
      Ionicons,
      data.icon,
      isShow ? 'ios-arrow-up' : 'ios-arrow-down'
    );
  }

  /**
   * 显示列表数据
   * @param dic
   * @param isShowAccount
   */
  renderItems(dic, isShowAccount) {
    if (!dic) {
      return null;
    }
    let views = [];
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, THEME_COLOR)}
          <View style={GlobalStyles.line} />
        </View>
      );
    }
    return views;
  }

  renderContent() {
    return (
      <View>
        {this._item(configData.aboutMe.Blog, this.state.showBlog, 'showBlog')}
        <View style={GlobalStyles.line} />
        {this.state.showBlog ? this.renderItems(configData.aboutMe.Blog.items) : null}
        {this._item(configData.aboutMe.Contact, this.state.showContact, 'showContact')}
        <View style={GlobalStyles.line} />
        {this.state.showContact ? this.renderItems(configData.aboutMe.Contact.items, true) : null}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.Feedback)}
      </View>
    );
  }

  render() {
    const renderConfig = this.getParallaxRenderConfig();
    return (
      <ParallaxScrollView
        backgroundColor={THEME_COLOR}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...renderConfig}
      >
        <AboutPageContent />
      </ParallaxScrollView>
    );
  }
}
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
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
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
  root: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 40,
  },
});
