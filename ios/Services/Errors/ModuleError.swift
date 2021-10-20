import Foundation

internal enum ModuleError: Error {

	case noCurrentParticipant
	case notRecording
}

internal extension ModuleError {

	var errorDescription: String? {
		switch self {
		case .noCurrentParticipant:
			return "No current session user."
		case .notRecording:
			return "The SDK does not record a conference."
		}
	}
}

internal extension ModuleError {

	func send(with reject: RCTPromiseRejectBlock) {
		reject(String(describing: self), errorDescription, nil)
	}
}
