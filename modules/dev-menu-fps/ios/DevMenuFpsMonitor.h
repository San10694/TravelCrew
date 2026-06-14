#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^DevMenuFpsUpdateBlock)(NSUInteger uiFps);

@interface DevMenuFpsMonitor : NSObject

+ (instancetype)shared;

- (void)startOnUpdate:(DevMenuFpsUpdateBlock)onUpdate;
- (void)stop;

@end

NS_ASSUME_NONNULL_END
