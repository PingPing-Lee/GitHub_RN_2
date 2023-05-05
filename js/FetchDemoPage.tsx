import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Constants from './expand/dao/Constants';
import { get, post } from './expand/dao/HiNet';
export default () => {
  const [msg, setMsg] = useState('');
  const doFetch = () => {
    // fetch(`https://api.devio.org/uapi/test/test?requestPrams=RNRN`)
    //   .then(res => res.json())
    //   .then(result => {
    //     setMsg(JSON.stringify(result));
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     setMsg(JSON.stringify(err));
    //   });
    // get(Constants.test.api)({requestPrams: 'RN'})
    //   .then(result => {
    //     setMsg(JSON.stringify(result));
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     setMsg(JSON.stringify(err));
    //   });

    const formData = new FormData();
    formData.append('requestPrams', 'POST-RN');
    post(Constants.test.api)(formData)()
      .then(result => {
        setMsg(JSON.stringify(result));
      })
      .catch(err => {
        console.log(err);
        setMsg(JSON.stringify(err));
      });
  };
  //  注册接口试试
  const doRegistration = () => {
    const formData = new FormData();
    formData.append('userName', '13588007875');
    formData.append('password', 'lp123456');
    formData.append('imoocId', '8024705');
    formData.append('orderId', '3982');
    formData.append('courseFlag', 'rn');
    post(Constants.registration.api)(formData)()
      .then(result => {
        setMsg(JSON.stringify(result));
      })
      .catch(err => {
        console.log(err);
        setMsg(JSON.stringify(err));
      });
  };
  // 登陆试试
  const doLogin = () => {
    const formData = new FormData();
    formData.append('userName', '13588007875');
    formData.append('password', 'lp123456');
    post(Constants.login.api)(formData)()
      .then(result => {
        setMsg(JSON.stringify(result));
      })
      .catch(err => {
        console.log(err);
        setMsg(JSON.stringify(err));
      });
  };
  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity onPress={doFetch}>
        <Text>加载</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={doRegistration}>
        <Text>注册试试</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={doLogin}>
        <Text>登陆试试</Text>
      </TouchableOpacity>
      <Text>{msg}</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
