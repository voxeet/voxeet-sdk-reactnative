/// Extension of Dictionary class to simplify getting id from the react model.
internal extension Dictionary where Key == String, Value == Any {

	/// Provides the object's id
	var identifier: String? {
		self["id"] as? String
	}
    
    /// Provides the participant for permission object
    var participant: [String:Any]? {
        self["participant"] as? [String:Any]
    }
    
    /// Provides the permissions for permission object
    var permissions: [NSNumber]? {
        self["permissions"] as? [NSNumber]
    }
    
    /// Provides the audioProcessing for send object
    var audioProcessing: NSNumber? {
        self.send?["audioProcessing"] as? NSNumber
    }
    
    /// Provides the send for processing object
    private var send: [String:Any]? {
        self["send"] as? [String:Any]
    }
}
