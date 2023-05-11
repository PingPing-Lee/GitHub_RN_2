import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import Toast from 'react-native-easy-toast';
import EventBus from 'react-native-event-bus';
import Ionicons from 'react-native-vector-icons/Ionicons';

import actions from '../redux/action';

import { tabNav } from '../navigator/NavigationDelegate';
import NavigationUtil from '../navigator/NavigationUtil';

import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

import EventTypes from '../util/EventTypes';
import { getStore } from '../util/StoreUtil';
import FavoriteUtil from '../util/FavoriteUtil';
import AnalyticsUtil from '../util/AnalyticsUtil';

import { PopularItem, NavigationBar } from '../component';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component {
  constructor(props) {
    super(props);
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }
  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     console.log('getDerivedStateFromProps', nextProps, prevState);
  //     // if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
  //     //   return {
  //     //     keys: CustomKeyPage._keys(nextProps, null, prevState),
  //     //   };
  //     // }
  //     return null;
  //   }
  renderRightButton() {
    const { theme } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          //新版本友盟SDK 时间统计方法由 track -> onEvent
          AnalyticsUtil.onEvent('SearchButtonClick');
          console.log(12323);
          NavigationUtil.goPage({ theme }, 'SearchPage');
        }}
      >
        <View style={{ padding: 5, marginRight: 8 }}>
          <Ionicons
            name={'ios-search'}
            size={24}
            style={{
              marginRight: 8,
              alignSelf: 'center',
              color: 'white',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    console.log('this.props', this.props);
    const { theme: { themeColor } = {}, keys, theme } = this.props;
    // if (this.themeColor !== themeColor) {
    //   //当主题变更的时候需要以新的主题色来创建TabNavigator
    //   this.themeColor = themeColor;
    //   this.TabNavigator = null;
    // }
    let statusBar = {
      backgroundColor: themeColor,
      barStyle: 'light-content',
    };

    let navigationBar = (
      <NavigationBar
        title={'最热'}
        statusBar={statusBar}
        style={theme.styles.navBar} //修改标题栏主题色
        rightButton={this.renderRightButton()}
      />
    );

    //通过复用TabNavigator来防止导航器频繁的创建，提升渲染效率
    this.TabNavigator = keys.length
      ? tabNav({
          Component: PopularTabPage,
          //fix theme: { themeColor: themeColor }
          theme,
          keys,
        })
      : null;
    console.log('PopularPage render', this.TabNavigator, this.props);
    return (
      <View style={[styles.container, { backgroundColor: themeColor }]}>
        {navigationBar}
        {this.TabNavigator}
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  theme: state.theme.theme,
  keys: state.language.keys,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);

const pageSize = 10; //设为常量，防止修改
// tabContent
class PopularTab extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
    this.state = {};
  }
  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(
      EventTypes.favorite_changed_popular,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      })
    );
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        if (data.to === 0 && this.isFavoriteChanged) {
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
    const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props;
    const store = this.getCurrStore();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
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
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }
  }
  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }
  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  getCurrStore() {
    const { popular } = this.props;
    return getStore(popular, this.storeName);
  }
  renderIndicator() {
    const { hideLoadingMore } = this.getCurrStore();
    return hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  renderItem({ item }) {
    const { theme } = this.props;
    return (
      <View style={styles.itemContainer}>
        <PopularItem
          theme={theme}
          projectModel={item}
          onSelect={callback => {
            NavigationUtil.goPage(
              {
                theme,
                projectModel: item,
                flag: FLAG_STORAGE.flag_popular,
                callback,
              },
              'DetailPage'
            );
          }}
          onFavorite={(item, isFavorite) =>
            FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)
          }
        />
      </View>
    );
  }
  render() {
    const { theme: { themeColor } = {} } = this.props;
    let storeData = this.getCurrStore();
    return (
      <View style={styles.container}>
        <FlatList
          data={storeData.projectModels}
          keyExtractor={item => `${item.item.id}`}
          renderItem={item => this.renderItem(item)}
          refreshControl={
            <RefreshControl
              title="loading"
              titleColor={themeColor}
              tintColor={themeColor}
              colors={themeColor}
              refreshing={storeData.isLoading}
              onRefresh={() => this.loadData()}
            />
          }
          ListFooterComponent={() => this.renderIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              console.log('---onEndReached----', this.canLoadMore);
              if (this.canLoadMore) {
                this.canLoadMore = false;
                // fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollEnd={() => {
            console.log('---onMomentumScrollEnd -----', this.canLoadMore);
            this.canLoadMore = true;
          }}
        />
        <Toast ref="toast" position={'center'} />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  popular: state.popular,
});
// 将dispatch映射给 onRefreshPopular，然后注入到组件的props中
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, size, dao) =>
    dispatch(actions.onRefreshPopular(storeName, url, size, dao)),
  onLoadMorePopular: (storeName, pageIndex, size, items, dao, callBack) =>
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, size, items, dao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, size, items, dao) =>
    dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, size, items, dao)),
});
// 包装 component，注入 dispatch到PopularTab
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 10,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
