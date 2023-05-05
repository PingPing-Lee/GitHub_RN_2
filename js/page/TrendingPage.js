import { connect } from 'react-redux';
import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import Toast from 'react-native-easy-toast';
import EventBus from 'react-native-event-bus';

import actions from '../redux/action';

import ArrayUtil from '../util/ArrayUtil';
import EventTypes from '../util/EventTypes';
import { getStore } from '../util/StoreUtil';
import FavoriteUtil from '../util/FavoriteUtil';
import NavigationUtil from '../navigator/NavigationUtil';

import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

import { TrendingItem, NavigationBar } from '../component';
import { tabNav } from '../navigator/NavigationDelegate';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
const URL = 'https://github.com/trending/';
const pageSize = 10; //设为常量，防止修改

class TrendingPage extends Component {
  constructor(props) {
    super(props);
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys = [];
  }
  _tabNav() {
    const { theme, keys } = this.props;
    //注意：主题发生变化需要重新渲染top tab
    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, keys)) {
      //优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
      this.theme = theme;
      this.preKeys = keys;
      this.tabNav = tabNav({
        Component: TrendingTabPage,
        keys,
        theme,
      });
    }
    return this.tabNav;
  }
  render() {
    const { theme: { themeColor } = {}, theme, keys } = this.props;
    // const themeColor = theme.themeColor || theme;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar title={'趋势'} statusBar={statusBar} style={theme.styles.navBar} />
    );
    const TabNavigator = keys.length ? this._tabNav() : null;
    return (
      <View style={[styles.container, { backgroundColor: themeColor }]}>
        {navigationBar}
        {TabNavigator}
      </View>
    );
  }
}
const mapTrendingStateToProps = state => ({
  theme: state.theme.theme,
  keys: state.language.languages,
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);

class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(
      EventTypes.favoriteChanged_trending,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      })
    );
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        if (data.to === 1 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      })
    );
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(loadMore, refreshFavorite) {
    const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props;
    const store = this.getCurrStore();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
        callback => {
          this.refs.toast.show('没有更多了');
        }
      );
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
      this.isFavoriteChanged = false;
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
    }
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  getCurrStore() {
    const { trending } = this.props;
    return getStore(trending, this.storeName);
  }

  genFetchUrl(key) {
    return URL + key + '?since=daily';
  }

  renderItem({ item }) {
    const { theme } = this.props;
    return (
      <TrendingItem
        theme={theme}
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage(
            theme,
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_trending,
              callback,
            },
            'DetailPage'
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)
        }
      />
    );
  }

  genIndicator() {
    return this.getCurrStore().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }

  render() {
    let store = this.getCurrStore();
    const { theme: { themeColor } = {} } = this.props;
    console.log('storeData this.props', this.props);
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.fullName}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              colors={themeColor}
              tintColor={themeColor}
              titleColor={themeColor}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) {
                //fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----');
          }}
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  trending: state.trending,
});
const mapDispatchToProps = dispatch => ({
  //将 dispatch(onRefreshPopular(storeName, url))绑定到props
  onRefreshTrending: (storeName, url, size, dao) =>
    dispatch(actions.onRefreshTrending(storeName, url, size, dao)),
  onLoadMoreTrending: (storeName, pageIndex, size, items, dao, callBack) =>
    dispatch(actions.onLoadMoreTrending(storeName, pageIndex, size, items, dao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, size, items, dao) =>
    dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, size, items, dao)),
});
//注意：connect只是个function，并不应定非要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
