import Foundation
import VoxeetSDK

@objc(RNCommandServiceModule)
public class CommandServiceModule: ReactEmmiter {
	override var supportedReactEvents: [ReactEvent]! {
		[ .messageReceived ]
	}

	/// Sends a message to all conference participants.
	/// - Parameters:
	///   - message: message to send
	///   - resolve: returns on success
	///   - reject: returns error on failure
	@objc(send:resolver:rejecter:)
	public func send(
		message: String,
		resolve: @escaping RCTPromiseResolveBlock,
		reject: @escaping RCTPromiseRejectBlock
	) {
		VoxeetSDK.shared.command.send(message: message) { error in
			guard let error = error else {
				resolve(NSNull())
				return
			}
			error.send(with: reject)
		}
	}

	public override func startObserving() {
		super.startObserving()
		VoxeetSDK.shared.command.delegate = self;
	}

	public override func stopObserving() {
		super.stopObserving()
		VoxeetSDK.shared.command.delegate = nil;
	}

	public override func supportedEvents() -> [String]! {
		super.supportedEvents()
	}
}

extension CommandServiceModule: VTCommandDelegate {
	public func received(participant: VTParticipant, message: String) {
		sendEvent(
			withName: .messageReceived,
			body: [
				Keys.message: message,
				Keys.participant: participant.toReactModel()
			].mapKeysToRawValue()
		)
	}

	private enum Keys: String {
		case message, participant
	}
}
