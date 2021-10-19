import Foundation

internal enum ModuleError: Error {

	case noCurrentParticipant
}

internal extension ModuleError {

	var errorDescription: String? {
		switch self {
		case .noCurrentParticipant:
			return "No current session user."
		}
	}
}

internal extension ModuleError {

	func send(with reject: RCTPromiseRejectBlock) {
		reject(String(describing: self), errorDescription, nil)
	}
}
