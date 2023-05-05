import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { isIPhoneX } from '../util/isIPhoneX';

interface StatusBarShapeProps {
  //设置状态栏所接受的属性
  barStyle: 'light-content' | 'default';
  hidden: boolean;
  backgroundColor: string;
}
interface IProps {
  style: any;
  title: string;
  titleView: Element;
  titleLayoutStyle: any;
  hide: boolean;
  statusBar: StatusBarShapeProps;
  rightButton: Element;
  leftButton: Element;
  content: Element;
}

const NAV_BAR_HEIGHT_IOS = isIPhoneX ? 44 : 44; //导航栏在iOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50; //导航栏在Android中的高度
// const STATUS_BAR_HEIGHT = Platform.OS !== 'ios' ? 0 : 20; //状态栏的高度
const STATUS_BAR_HEIGHT = Platform.OS !== 'ios' || isIPhoneX ? 0 : 20; //状态栏的高度
const NAV_BAR_HEIGHT = Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID;

export const NAVIGATION_BAR_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;
export default class NavigationBar extends Component<IProps | any> {
  render() {
    let statusBar = !this.props.statusBar?.hidden ? (
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar} />
      </View>
    ) : null;

    let titleView = this.props.titleView ? (
      this.props.titleView
    ) : (
      <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>
        {this.props.title}
      </Text>
    );

    let renderContent = () => {
      const { hide, content } = this.props;
      if (hide) {
        return null;
      }
      if (React.isValidElement(content)) {
        return content;
      }
      return (
        <View style={styles.navBar}>
          {this.getButtonElement(this.props.leftButton)}
          <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
            {titleView}
          </View>
          {this.getButtonElement(this.props.rightButton)}
        </View>
      );
    };
    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {renderContent()}
      </View>
    );
  }

  getButtonElement(data) {
    return <View style={styles.navBarButton}>{data ? data : null}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    // paddingTop: isIPhoneX ? 30 : 0,
  },
  navBarButton: {
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: NAV_BAR_HEIGHT,
  },
  navBarTitleContainer: {
    // lignItems: 'center',
    // justifyContent: 'center',
    // position: 'absolute',
    // left: 40,
    // right: 40,
    // top: 0,
    // bottom: 0,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
});
