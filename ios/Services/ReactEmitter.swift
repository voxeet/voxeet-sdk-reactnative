public class ReactEmmiter: RCTEventEmitter {
	private(set) var supportedReactEvents: [ReactEvent]!
	private var hasListeners: Bool = false

	public override func supportedEvents() -> [String]! {
		return supportedReactEvents.map { $0.rawValue }
	}

	public override func startObserving() {
		hasListeners = true
	}

	public override func stopObserving() {
		hasListeners = false
	}

	public func sendEvent(withName: ReactEvent!, body: Any!) {
		guard hasListeners else { return }
		sendEvent(withName: withName.rawValue, body: body)
	}
}
