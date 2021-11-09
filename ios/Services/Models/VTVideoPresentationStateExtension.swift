import Foundation
import VoxeetSDK

extension VTVideoPresentationState: ReactModelValueMappable {

	typealias ReactModelValueType = String?

	func toReactModelValue() -> ReactModelValueType {
		switch self {
		case .stopped:
			return "stopped"
		case .playing:
			return "playing"
		case .paused:
			return "stopped"
		@unknown default:
			return nil
		}
	}
}
