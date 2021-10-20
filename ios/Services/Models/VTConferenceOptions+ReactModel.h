///
/// Extension of VTConferenceOptions class to support react model.
///
@import VoxeetSDK;

@interface VTConferenceOptions (ReactModel)
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

@end
