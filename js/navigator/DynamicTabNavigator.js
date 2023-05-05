/* eslint-disable react/no-unstable-nested-components */
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EventBus from 'react-native-event-bus';

import EventTypes from '../util/EventTypes';

import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';

const Tab = createBottomTabNavigator();
const TABS = {
  // 在这里配置页面的路由
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      headerShown: false,
      tabBarIcon: ({ color, focused }) => (
        <MaterialIcons name={'whatshot'} size={26} style={{ color: color }} />
      ),
    },
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      headerShown: false,
      tabBarIcon: ({ color, focused }) => (
        <Ionicons name={'md-trending-up'} size={26} style={{ color: color }} />
      ),
    },
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      headerShown: false,
      tabBarIcon: ({ color, focused }) => (
        <MaterialIcons name={'favorite'} size={26} style={{ color: color }} />
      ),
    },
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      headerShown: false,
      tabBarIcon: ({ color, focused }) => (
        <Entypo name={'user'} size={26} style={{ color: color }} />
      ),
    },
  },
};
class DynamicTabNavigator extends Component {
  /**
   * 从navigationState解析导航跳转
   * @param {*} navigationState
   */
  fireEvent(navigationState) {
    const { index, history, routeNames } = navigationState;
    let fromIndex = -1;
    if (history.length === 1) {
      fromIndex = this.toNavIndex;
    } else {
      let key = history[history.length - 2].key;
      for (let i = 0; i < routeNames.length; i++) {
        if (key.startsWith(routeNames[i])) {
          fromIndex = i;
          break;
        }
      }
    }
    EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
      //发送底部tab切换的事件
      from: fromIndex,
      to: index,
    });
    //记录上一次的位置
    this.toNavIndex = index;
  }
  _tabNavigator() {
    const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
    // 根据需要定制显示的tab
    const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
    // PopularPage.navigationOptions.tabBarLabel = '最热1'; // 动态改变Tab属性
    const themeColor = this.props.theme.themeColor || this.props.theme;
    return (
      <Tab.Navigator
        tabBar={props => {
          this.fireEvent(props.state);
          return <BottomTabBar {...props} />;
        }}
      >
        {Object.entries(tabs).map(item => {
          return (
            <Tab.Screen
              key={item[0]}
              name={item[0]}
              component={item[1].screen}
              options={{ ...item[1].navigationOptions, tabBarActiveTintColor: themeColor }}
            />
          );
        })}
      </Tab.Navigator>
    );
  }
  render() {
    const TabView = this._tabNavigator();
    return TabView;
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme,
});
export default connect(mapStateToProps)(DynamicTabNavigator);
