#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(DolbyIoIAPISessionServiceModule, RNSessionServiceModule, NSObject)

RCT_EXTERN_METHOD(open:(NSDictionary *)userInfo
				  resolver:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(close:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(getParticipant:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject);

@end

