import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, DeviceInfo, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';

import FavoriteDao from '../expand/dao/FavoriteDao';

import { BackPressComponent, NavigationBar, SafeAreaViewPlus } from '../component';

const TRENDING_URL = 'https://github.com/';

export default class Index extends Component {
  constructor(props) {
    super(props);
    //fix this.params = this.props.route.params;
    console.log('this.props.route', this.props);
    this.params = this.props.route.params;
    const { projectModel, flag } = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite,
    };
    this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress() {
    this.onBack();
    return true;
  }

  onBack() {
    //高版本react-native-webview 在Android上存在webView.goBack()没有回调onNavigationStateChange的bug
    //在此bug 未修复之前可以直接通过NavigationUtil.goBack(this.props.navigation) 返回上一页来规避
    if (this.state.canGoBack && Platform.OS === 'ios') {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }
  onFavoriteButtonClick() {
    const { projectModel, callback } = this.params;
    const isFavorite = (projectModel.isFavorite = !projectModel.isFavorite);
    callback(isFavorite); // 更新Item的收藏状态
    this.setState({
      isFavorite: isFavorite,
    });
    let key = projectModel.item.fullName
      ? projectModel.item.fullName
      : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }
  renderRightButton() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => this.onFavoriteButtonClick()}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{ color: 'white', marginRight: 10 }}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {})}
      </View>
    );
  }
  renderNavigationBar = () => {
    console.log('this.params', this.params);
    const { theme } = this.params;
    const { title } = this.state;
    const titleLayoutStyle = title.length > 20 ? { paddingRight: 30 } : null;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    return (
      <NavigationBar
        statusBar={statusBar}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        titleLayoutStyle={titleLayoutStyle}
        title={title}
        style={theme.styles.navBar}
        rightButton={this.renderRightButton()}
      />
    );
  };

  render() {
    return (
      <SafeAreaViewPlus style={styles.container}>
        {this.renderNavigationBar()}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: this.state.url }}
        />
      </SafeAreaViewPlus>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
  },
});
