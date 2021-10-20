import Foundation

internal enum ModuleError: Error {

	case noCurrentParticipant
	case notRecording
	case noConferenceId
}

internal extension ModuleError {

	var errorDescription: String? {
		switch self {
		case .noCurrentParticipant:
			return "No current session user."
		case .notRecording:
			return "The SDK does not record a conference."
		case .noConferenceId:
			return "Conference should contain conferenceId."
		}
	}
}

internal extension ModuleError {

	func send(with reject: RCTPromiseRejectBlock) {
		reject(String(describing: self), errorDescription, nil)
	}
}
