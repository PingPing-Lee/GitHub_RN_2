/**
 * 获取与当前页面有关的数据
 * @returns {*}
 * @private
 */
export function getStore(data: any, key = '') {
  let store = data[key];
  if (!store) {
    store = {
      items: [],
      isLoading: false,
      projectModels: [], //要显示的数据
      hideLoadingMore: true, //默认隐藏加载更多
    };
  }
  return store;
}
