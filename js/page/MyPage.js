import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import actions from '../redux/action';
import GlobalStyles from '../res/styles/GlobalStyles';

import ViewUtil from '../util/ViewUtil';
import { MORE_MENU } from '../util/MORE_MENU';
import NavigationUtil from '../navigator/NavigationUtil';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import { getUserInfo } from '../util/BoardingUtil';

import LoginDao from '../expand/dao/LoginDao';

import { NavigationBar } from '../component';

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
  }
  async componentDidMount() {
    const userInfo = await getUserInfo();
    console.log('userInfo', userInfo);
    this.setState({ userInfo: JSON.parse(userInfo) });
  }
  onLogOut() {
    console.log('LoginDao', LoginDao)
    LoginDao.getInstance().logOut();
  }
  onClick(menu) {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        params.userInfo = this.state.userInfo;
        break;
      case MORE_MENU.Custom_Theme:
        const { onShowCustomThemeView } = this.props;
        onShowCustomThemeView(true);
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage';
        RouteName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.LogOut:
        this.onLogOut();
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }
  getItem(menu) {
    const { theme: { themeColor } = {} } = this.props;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, themeColor);
  }

  render() {
    const { userInfo } = this.state;
    console.log('userInfo', userInfo)
    const { theme } = this.props;
    const { themeColor } = theme;
    let statusBar = {
      backgroundColor: themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar title={'我的'} statusBar={statusBar} style={theme.styles.navBar} />
    );
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity style={styles.item} onPress={() => this.onClick(MORE_MENU.About)}>
            <View style={styles.about_left}>
              {/* <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{ marginRight: 10, color: themeColor }}
              /> */}
              <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
              <Text>{userInfo.userName}</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: themeColor,
              }}
            />
          </TouchableOpacity>
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {/* {this.getItem(MORE_MENU.About_Author)} */}
          {this.getItem(MORE_MENU.LogOut)}
          <View style={GlobalStyles.line} />
          {/*反馈*/}
          {/* {this.getItem(MORE_MENU.Feedback)} */}
          {/* <View style={GlobalStyles.line} /> */}

        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: show => dispatch(actions.onShowCustomThemeView(show)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
});
