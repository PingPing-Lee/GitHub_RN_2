import { NativeModules } from 'react-native';
console.log('NativeModules', NativeModules, NativeModules.UMShareModule);

module.exports = NativeModules.UMShareModule;
