import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';

import configData from '../../res/data/config';
import GlobalStyles from '../../res/styles/GlobalStyles';

import ViewUtil from '../../util/ViewUtil';
import { MORE_MENU } from '../../util/MORE_MENU';
import NavigationUtil from '../../navigator/NavigationUtil';

import ImageCrop from '../../../ImageCrop';

const THEME_COLOR = '#678';
const ASPECT_X = '200';
const ASPECT_Y = '100';

export default class AboutPageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      aspectX: '200',
      aspectY: '200',
    };
  }
  // 选择图片
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

  onClick(tab) {
    console.log('tab', tab);
    if (!tab) {
      return;
    }
    if (tab.url) {
      NavigationUtil.goPage(
        {
          title: tab.title,
          url: tab.url,
        },
        'WebViewPage'
      );
      return;
    }
    if (tab.account && tab.account.indexOf('@') > -1) {
      let url = 'mailto://' + tab.account;
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
      return;
    }
    if (tab.account) {
      Clipboard.setString(tab.account);
      this.toast.show(tab.title + tab.account + '已复制到剪切板。');
    }
  }

  onFeedbackClick(menu) {
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
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onFeedbackClick(menu), menu, THEME_COLOR);
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
      let title = isShowAccount ? dic[i].title + '：' + dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, THEME_COLOR)}
          <View style={GlobalStyles.line} />
        </View>
      );
    }
    return views;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          {/* 我在这里 */}
          {this._item(configData.aboutMe.Blog, this.state.showBlog, 'showBlog')}
          <View style={GlobalStyles.line} />
          {this.state.showBlog ? this.renderItems(configData.aboutMe.Blog.items) : null}
          {/* 联系方式 */}
          {this._item(configData.aboutMe.Contact, this.state.showContact, 'showContact')}
          <View style={GlobalStyles.line} />
          {this.state.showContact ? this.renderItems(configData.aboutMe.Contact.items, true) : null}
          <View style={GlobalStyles.line} />
          {/* 反馈 */}
          {ViewUtil.getMenuItem(
            () => this.onFeedbackClick(MORE_MENU.Feedback),
            MORE_MENU.Feedback,
            THEME_COLOR
          )}
        </View>
        <Toast ref={toast => (this.toast = toast)} position={'bottom'} />
      </View>
    );
  }
}
