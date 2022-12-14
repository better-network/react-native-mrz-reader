#import <Foundation/Foundation.h>

#import <React/RCTViewManager.h>
#import <React/RCTUtils.h>

@interface RCT_EXTERN_REMAP_MODULE(MrzReaderView, MrzReaderViewManager, RCTViewManager)

// Module Functions
RCT_EXTERN_METHOD(getCameraPermissionStatus:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(requestCameraPermission:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
// Module properties
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onMrzResult, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(torch, NSString);
RCT_EXPORT_VIEW_PROPERTY(isScanning, BOOL);

@end
