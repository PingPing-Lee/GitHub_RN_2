import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button, Linking } from 'react-native';
export const Input = (props: any) => {
  const { label, placeholder, shortLine, secure, onChangeText } = props;
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={secure}
          // 取消大小写
          autoCapitalize="none"
          onChangeText={onChangeText}
          style={styles.inputStyle}
        />
      </View>
      <View style={[styles.line, { marginLeft: shortLine ? 20 : 0 }]} />
    </View>
  );
};

export const ConfirmButton = (props: any) => {
  const { title, onclick } = props;
  return (
    <TouchableOpacity style={styles.confirmLayout} onPress={onclick}>
      <Text style={styles.confirmTitle}>{title}</Text>
    </TouchableOpacity>
  );
};
export const Tips = (props: any) => {
  const { msg, helpUrl } = props;
  return (
    <View style={styles.tipsLayout}>
      <Text style={styles.tips}>{msg}</Text>
      {!!helpUrl && (
        <Button
          title="查看帮助"
          onPress={() => {
            Linking.openURL(helpUrl);
          }}
        />
      )}
    </View>
  );
};
export const Navbar = (props: any) => {
  const { title, rightTitle, onRightClick } = props;
  return (
    <View style={styles.navBar}>
      <View />
      <View style={styles.titleLayout}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onRightClick}>
        <Text style={styles.button}>{rightTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
  },
  line: {
    height: 0.5,
    backgroundColor: '#D0D4D4',
  },
  inputLabel: {
    marginLeft: 15,
    marginVertical: 18,
    fontSize: 16,
    width: 90,
  },
  inputStyle: {
    flex: 1,
    marginRight: 15,
  },
  confirmLayout: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    padding: 12,
    margin: 20,
    marginTop: 30,
    borderRadius: 5,
  },
  confirmTitle: {
    fontSize: 20,
    color: '#FFF',
  },
  tipsLayout: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tips: {
    fontSize: 14,
    color: 'red',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
  },
  titleLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: '#333',
  },
  button: {
    color: '#007AFF',
    paddingRight: 16,
    fontSize: 16,
  },
});
