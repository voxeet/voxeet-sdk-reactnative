import Foundation
import VoxeetSDK

@objc(RNConferenceServiceModule)
public class ConferenceServiceModule: NSObject {

	@objc(create:resolver:rejecter:)
	public func create(
		options: [String: Any]?,
		resolve: @escaping RCTPromiseResolveBlock,
		reject: @escaping RCTPromiseRejectBlock
	) {}
    
    @objc(fetch:resolver:rejecter:)
    public func fetch(
        conferenceId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(join:options:resolver:rejecter:)
    public func join(
        conference: [String: Any],
        options: [String: Any]?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(kick:resolver:rejecter:)
    public func kick(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(leave:rejecter:)
    public func leave(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(replay:replayOptions:mixingOptions:resolver:rejecter:)
    public func replay(
        conference: [String: Any],
        replayOptions: [String: Any]?,
        mixingOptions: [String: Any]?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(updatePermissions:resolver:rejecter:)
    public func updatePermissions(
        participantPermissions: [[String: Any]],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(startAudio:resolver:rejecter:)
    public func startAudio(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(startVideo:resolver:rejecter:)
    public func startVideo(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(stopAudio:resolver:rejecter:)
    public func stopAudio(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(stopVideo:resolver:rejecter:)
    public func stopVideo(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(current:rejecter:)
    public func current(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(getAudioLevel:resolver:rejecter:)
    public func getAudioLevel(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(getMaxVideoForwarding:rejecter:)
    public func getMaxVideoForwarding(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(getParticipant:resolver:rejecter:)
    public func getParticipant(
        participantId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(getParticipants:resolver:rejecter:)
    public func getParticipants(
        conference: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(getStatus:resolver:rejecter:)
    public func getStatus(
        conference: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(isMuted:rejecter:)
    public func isMuted(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(isSpeaking:resolver:rejecter:)
    public func isSpeaking(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(getLocalStats:rejecter:)
    public func getLocalStats(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(setAudioProcessing:resolver:rejecter:)
    public func setAudioProcessing(
        processingOptions: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(setMaxVideoForwarding:resolver:rejecter:)
    public func setMaxVideoForwarding(
        maxVideoForwarding: Int,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(muteOutput:resolver:rejecter:)
    public func muteOutput(
        isMuted: Bool,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
    
    @objc(mute:resolver:rejecter:)
    public func mute(
        isMuted: Bool,
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {}
}

