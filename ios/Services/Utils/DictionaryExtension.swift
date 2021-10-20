/// Extension of Dictionary class to simplify getting id from the react model.
internal extension Dictionary where Key == String, Value == Any {

	/// Provides the object's id
	var identifier: String? {
		self["id"] as? String
	}
}
