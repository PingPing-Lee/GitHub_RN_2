#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <UMCommon/MobClick.h>
#import <UMShare/UMShare.h>
#import <UMCommon/UMConfigure.h>
#import "RNSplashScreen.h"  // here
#import "RNUMConfigure.h"
#import "Constants.h"

@implementation AppDelegate
    

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [self initUmeng];

  self.moduleName = @"GitHub_RN_2";
  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];  // here
  return result;
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
//   self.initialProps = @{};
//   return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url];
  if (!result) {
    // 其他如支付等SDK的回调
  }
  return result;
}
-(void)initUmeng{
  //UMeng 统计
  [UMConfigure setLogEnabled:YES];
  [RNUMConfigure initWithAppkey:UM_AppKey channel:UM_ChannelId];
}

@end
