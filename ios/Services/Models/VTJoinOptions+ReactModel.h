///
/// Extension of VTJoinOptions class to support react model.
///
@import VoxeetSDK;

@interface VTJoinOptions (ReactModel)
///
/// Creates instance of the class from react model.
///
/// \param dictionary react model
///
+ (instancetype _Nullable)createWithDictionary:(NSDictionary * _Nullable)dictionary;
///
/// Generates react model of the class.
///
/// \return NSDictionary
///
- (NSDictionary * _Nonnull)reactDescription;
///
/// Updates object with options from react.
///
/// \param options options from react.
///
- (void)updateWithOptions:(NSDictionary * _Nullable)options;

@end
