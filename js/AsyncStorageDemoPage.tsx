import React, { useState } from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
} from 'react-native';
const KEY = 'devio.org';
export default (props: any) => {
  const [text, onChangeText] = useState('');
  const [storageText, setStorageText] = useState('');

  const onSave = async () => {
    try {
      AsyncStorage.setItem(KEY, text);
    } catch (error) {
      console.log(error);
    }
  };
  const onGet = async () => {
    try {
      const res = await AsyncStorage.getItem(KEY);
      setStorageText(res || '');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.root}>
      <TextInput onChangeText={onChangeText} value={text} style={styles.inputStyle} />
      <Button title="Save" onPress={onSave} />
      <Button title="Get" onPress={onGet} />
      <Text>{storageText}</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inputStyle: {
    height: 40,
    margin: 16,
    borderWidth: 1,
    padding: 12,
  },
});
