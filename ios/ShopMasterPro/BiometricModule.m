// ios/ShopMasterPro/BiometricModule.m
#import "BiometricModule.h"
#import <LocalAuthentication/LocalAuthentication.h>

/**
 * Biometric Authentication Native Module (iOS)
 * 
 * Interview: Key differences iOS vs Android native modules?
 * Answer:
 * - iOS: RCTBridgeModule protocol, RCT_EXPORT_METHOD macro
 * - Android: ReactContextBaseJavaModule, @ReactMethod annotation
 * - iOS: Objective-C/Swift, Android: Java/Kotlin
 */

@implementation BiometricModule

RCT_EXPORT_MODULE();

/**
 * Check if biometric authentication is available
 */
RCT_EXPORT_METHOD(isAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    
    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
        resolve(@YES);
    } else {
        if (error) {
            reject(@"ERROR", error.localizedDescription, error);
        } else {
            reject(@"NOT_AVAILABLE", @"Biometric authentication not available", nil);
        }
    }
}

/**
 * Authenticate user with biometrics
 */
RCT_EXPORT_METHOD(authenticate:(NSString *)title
                  subtitle:(NSString *)subtitle
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    
    NSString *reason = [NSString stringWithFormat:@"%@\n%@", title, subtitle];
    
    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
        [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
                localizedReason:reason
                          reply:^(BOOL success, NSError *error) {
            if (success) {
                resolve(@YES);
            } else {
                reject(@"AUTH_FAILED", error.localizedDescription, error);
            }
        }];
    } else {
        reject(@"NOT_AVAILABLE", error.localizedDescription, error);
    }
}

@end
