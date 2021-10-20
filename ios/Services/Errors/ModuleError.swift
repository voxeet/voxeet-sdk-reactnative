import Foundation

internal enum ModuleError: Error {

	case noCurrentParticipant
	case notRecording
    case noCurrentConference
    case noConferenceId
    case noConferenceStatus
    case noLocalStats
    case invalidOptions(String)
    case noConference(String)
    case noParticipant(String)
    case noParticipantId(String)
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
        case .noCurrentConference:
            return "Missing current conference."
        case .noConferenceStatus:
            return "Missing conference status."
        case .noLocalStats:
            return "Couldn't get any local stats."
        case let .invalidOptions(options):
            return "invalid options: \(options)"
        case let .noConference(id):
            return "Couldn't find the conference with id:\(id)."
        case let .noParticipant(participant):
            return "Couldn't find the participant: \(participant)"
        case let .noParticipantId(participantId):
            return "Couldn't find the participant with id: \(participantId)"
		}
	}
}

internal extension ModuleError {

	func send(with reject: RCTPromiseRejectBlock) {
		reject(String(describing: self), errorDescription, nil)
	}
}