#import "NitroConvert.h"
#import <React/RCTConvert.h>

@implementation NitroConvert
+ (UIColor *)uiColor:(id)json {
    return [RCTConvert UIColor:json];
}
@end
