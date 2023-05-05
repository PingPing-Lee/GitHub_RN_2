import ProjectModel from '../../model/ProjectModel';
import Utils from '../../util/Utils';

/**
 * 处理下拉刷新的数据
 * @param {*} dispatch
 * @param {*} storeName
 * @param {*} data
 * @param favoriteDao
 * @param params 其他参数
 */
export const handleData = (type, dispatch, storeName, data, pageSize, favoriteDao, params) => {
  let fixItems = [];
  if (data && data.data && data.data.items) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  } else {
    fixItems = data;
  }
  //第一次要加载的数据
  let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
  _projectModels(showItems, favoriteDao, projectModels => {
    console.log('call back', projectModels);
    dispatch({
      type,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1,
      ...params
    });
  });
};

/**
 * 通过本地的收藏状态包装Item
 * @param showItems
 * @param favoriteDao
 * @param callback
 * @returns {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    //获取收藏的key
    keys = await favoriteDao.getFavoriteKeys();
  } catch (e) {
    console.log(e);
  }
  let projectModels = [];
  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
  }
  if (typeof callback === 'function') {
    callback(projectModels);
  }
}
