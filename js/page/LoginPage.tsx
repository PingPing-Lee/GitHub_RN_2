import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Input, ConfirmButton, Tips, Navbar } from '../component/Login';
import LoginDao from '../expand/dao/LoginDao';
import NavigationUtil from '../navigator/NavigationUtil';

export default (props: any) => {
  const { navigation } = props;
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [helpUrl, setHelpUrl] = useState('https://www.baidu.com/');

  const onLogin = () => {
    console.log(userName, password);
    if (!userName || !password) {
      setMsg('用户名或密码不能为空');
      return;
    }
    setHelpUrl('');
    setMsg('');
    LoginDao.getInstance()
      .login(userName, password)
      .then((res: any) => {
        setMsg('登陆成功');
        NavigationUtil.resetToHomePage({ navigation });
      })
      .catch((e: any) => {
        // const {code, data: {helpUrl=''} = {}, msg} = e;
        setMsg(e.msg);
        setHelpUrl(e?.data?.helpUrl);
      });
  };
  return (
    <SafeAreaView style={styles.root}>
      <Navbar
        title="登陆"
        rightTitle="注册"
        onRightClick={() => {
          NavigationUtil.registration({ navigation });
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
        <ConfirmButton title="登陆" onclick={onLogin} />
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
