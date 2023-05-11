import { saveBoarding, saveUserInfo } from '../../util/BoardingUtil';
import Constants from './Constants';
import { post } from './HiNet';

import NavigationUtil from '../../navigator/NavigationUtil';

/**
 * 登陆模块相关网络服务
 */
export default class LoginDao {
  private static instance: LoginDao;
  private constructor() {}
  public static getInstance(): LoginDao {
    if (!LoginDao.instance) {
      LoginDao.instance = new LoginDao();
    }
    return LoginDao.instance;
  }
  /**
   * 登陆相关
   * @param userName 用户名
   * @param password 密码
   * @returns Promise
   */
  login(userName: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const {
        login: { api },
      } = Constants;
      const formData = new FormData();
      formData.append('userName', userName);
      formData.append('password', password);
      post(api)(formData)()
        .then((result: any) => {
          const { code, data, msg, extra = {} } = result;
          if (code === 0) {
            saveBoarding(data);
            resolve(data || msg);
            // 保存用户的信息
            saveUserInfo(JSON.stringify(extra));
          } else {
            reject(result);
          }
        })
        .catch(err => {
          console.log('login login login err', err);
          reject({ code: -1, msg: '哎呀出错了' });
        });
    });
  }
  /**
   * 注册
   * @param userName 用户名
   * @param password 密码
   * @param imoocId 慕课网ID
   * @param orderId 课程订单号
   * @returns Promise
   */
  register(userName: string, password: string, imoocId: string, orderId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const {
        login: { api },
      } = Constants;
      const formData = new FormData();
      formData.append('userName', userName);
      formData.append('password', password);
      formData.append('imoocId', imoocId);
      formData.append('orderId', orderId);
      post(api)(formData)()
        .then((result: any) => {
          const { code, data, msg } = result;
          if (code === 0) {
            saveBoarding(data);
            resolve(data || msg);
          } else {
            reject(result);
          }
        })
        .catch(err => {
          console.log(err);
          reject({ code: -1, msg: '哎呀出错了' });
        });
    });
  }

  /**
   * 退出登陆
   */
  logOut() {
    saveBoarding('');
    NavigationUtil.login();
  }
}
