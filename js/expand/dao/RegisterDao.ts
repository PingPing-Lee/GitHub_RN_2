import { saveBoarding } from '../../util/BoardingUtil';
import Constants from './Constants';
import { post } from './HiNet';

/**
 * 登陆模块相关网络服务
 */
export default class RegisterDao {
  private static instance: RegisterDao;
  private constructor() {}
  public static getInstance(): RegisterDao {
    if (!RegisterDao.instance) {
      RegisterDao.instance = new RegisterDao();
    }
    return RegisterDao.instance;
  }
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
}
