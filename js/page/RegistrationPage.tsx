import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Input, ConfirmButton, Tips, Navbar } from '../component/Login';
import LoginDao from '../expand/dao/LoginDao';
import NavigationUtil from '../navigator/NavigationUtil';

export default (props: any) => {
  const { navigation } = props;

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [imoocId, setImoocId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [msg, setMsg] = useState('');
  const [helpUrl, setHelpUrl] = useState('https://www.baidu.com/');

  const onRegister = () => {
    console.log(userName, password, imoocId, orderId);
    if (!userName || !password || !imoocId || !orderId) {
      setMsg('输入框不能为空');
      return;
    }
    setHelpUrl('');
    setMsg('');
    LoginDao.getInstance()
      .register(userName, password, imoocId, orderId)
      .then((res: any) => {
        setMsg('注册成功');
      })
      .catch((e: any) => {
        // const {code, data: {helpUrl=''} = {}, msg} = e;
        setMsg(e.msg);
        setHelpUrl(e.data.helpUrl);
      });
  };
  return (
    <SafeAreaView style={styles.root}>
      <Navbar
        title="注册"
        rightTitle="登录"
        onRightClick={() => {
          //todo 跳转到登录
          NavigationUtil.login({ navigation });
        }}
      />
      <View style={styles.line} />
      <View style={styles.content}>
        <Input
          label="用户名"
          placeholder="请输入用户名"
          shortLine={true}
          onChangeText={(text: string) => setUserName(text)}
        />
        <Input
          label="密码"
          placeholder="请输入密码"
          secure={true}
          onChangeText={(text: string) => setPassword(text)}
        />
        <Input
          label="慕课网ID"
          placeholder="请输入你的慕课网用户ID"
          onChangeText={(text: string) => setImoocId(text)}
        />
        <Input
          label="课程订单号"
          placeholder="请输入课程订单号"
          onChangeText={(text: string) => setOrderId(text)}
        />
        <ConfirmButton title="注册" onclick={onRegister} />
        <Tips msg={msg} helpUrl={helpUrl} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    backgroundColor: '#F1F5F6',
    flexGrow: 1,
  },
  line: {
    height: 0.5,
    backgroundColor: '#D0D4D4',
  },
});
