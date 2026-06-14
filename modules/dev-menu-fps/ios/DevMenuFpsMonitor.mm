#import "DevMenuFpsMonitor.h"

#import <QuartzCore/CADisplayLink.h>

@interface DevMenuFpsCounter : NSObject

@property (nonatomic, assign, readonly) NSUInteger fps;

- (BOOL)onTick:(CFTimeInterval)timestamp;

@end

@implementation DevMenuFpsCounter {
  CFTimeInterval _prevTime;
  NSUInteger _frameCount;
  NSUInteger _fps;
}

- (instancetype)init
{
  if (self = [super init]) {
    _prevTime = -1;
    _frameCount = 0;
    _fps = 0;
  }
  return self;
}

- (BOOL)onTick:(CFTimeInterval)timestamp
{
  _frameCount++;

  if (_prevTime < 0) {
    _prevTime = timestamp;
    return NO;
  }

  if (timestamp - _prevTime >= 1) {
    _fps = (NSUInteger)lround((double)_frameCount / (timestamp - _prevTime));
    _prevTime = timestamp;
    _frameCount = 0;
    return YES;
  }

  return NO;
}

@end

@interface DevMenuFpsMonitor ()

@property (nonatomic, copy, nullable) DevMenuFpsUpdateBlock onUpdate;
@property (nonatomic, strong) DevMenuFpsCounter *uiCounter;
@property (nonatomic, strong, nullable) CADisplayLink *uiDisplayLink;

@end

@implementation DevMenuFpsMonitor

+ (instancetype)shared
{
  static DevMenuFpsMonitor *instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    instance = [[DevMenuFpsMonitor alloc] init];
  });
  return instance;
}

- (instancetype)init
{
  if (self = [super init]) {
    _uiCounter = [[DevMenuFpsCounter alloc] init];
  }
  return self;
}

- (void)startOnUpdate:(DevMenuFpsUpdateBlock)onUpdate
{
  [self stop];

  self.onUpdate = onUpdate;
  self.uiCounter = [[DevMenuFpsCounter alloc] init];

  self.uiDisplayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(uiThreadUpdate:)];
  [self.uiDisplayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)stop
{
  self.onUpdate = nil;
  [self.uiDisplayLink invalidate];
  self.uiDisplayLink = nil;
}

- (void)emitUpdate
{
  DevMenuFpsUpdateBlock onUpdate = self.onUpdate;
  if (onUpdate == nil) {
    return;
  }

  onUpdate(self.uiCounter.fps);
}

- (void)uiThreadUpdate:(CADisplayLink *)displayLink
{
  if ([self.uiCounter onTick:displayLink.timestamp]) {
    [self emitUpdate];
  }
}

@end
