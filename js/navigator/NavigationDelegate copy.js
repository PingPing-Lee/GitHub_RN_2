import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default class tabNav extends Component {
  render() {
    console.log('NavigationDelegate render', this.props);

    const { Com, keysData, theme, extra } = this.props;
    const tabsData = _genTabs({ Com, keysData, theme, extra });
    return (
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          tabBarItemStyle: styles.tabStyle,
          tabBarScrollEnabled: true,
          tabBarInactiveTintColor: 'white', // 非激活状态下颜色
          tabBarActiveTintColor: 'white', // 激活状态下颜色
          tabBarStyle: {
            backgroundColor: theme.themeColor, //TabBar的背景色
          },
          tabBarIndicatorStyle: styles.indicatorStyle, //标签指示器样式
          tabBarLabelStyle: styles.labelStyle, //文本的样式
        }}
      >
        {Object.entries(tabsData).map(item => {
          return (
            <Tab.Screen
              key={item[0]}
              name={item[0]}
              // component={item[1].screen}
              options={item[1].navigationOptions}
            >
              {item[1].screen}
            </Tab.Screen>
          );
        })}
      </Tab.Navigator>
    );
  }
}

function _genTabs({ Com, keysData, theme, extra = {} }) {
  const tabs = {};
  keysData.forEach((item, index) => {
    if (item.checked) {
      tabs[`tab${index}`] = {
        screen: props => <Com {...props} {...extra} tabLabel={item.name} theme={theme} />,
        navigationOptions: {
          title: item.name,
        },
      };
    }
  });
  return tabs;
}

const styles = StyleSheet.create({
  tabStyle: {
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#FFF',
  },
  labelStyle: {
    textTransform: 'none', // 取消大小写
    fontSize: 13,
    margin: 0,
  },
});
