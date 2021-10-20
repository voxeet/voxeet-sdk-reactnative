import Foundation
import VoxeetSDK

@objc(RNConferenceServiceModule)
public class ConferenceServiceModule: NSObject {
    
    var current: VTConference? {
        VoxeetSDK.shared.conference.current
    }
    
    @objc(create:resolver:rejecter:)
    public func create(
        options: [String: Any]?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.create(options: VTConferenceOptions.create(with: options)) { conference in
            resolve(conference.reactDescription())
        } fail: { error in
            error.send(with: reject)
        }
    }
    
    @objc(fetch:resolver:rejecter:)
    public func fetch(
        conferenceId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.fetch(conferenceID: conferenceId) { conference in
            resolve(conference.reactDescription())
        }
    }
    
    @objc(join:options:resolver:rejecter:)
    public func join(
        conference: [String: Any],
        options: [String: Any]?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let conferenceId = conference.identifier else {
            ModuleError.noConferenceId.send(with: reject)
            return
        }
        VoxeetSDK.shared.conference.fetch(conferenceID: conferenceId) { conference in
            VoxeetSDK.shared.conference.join(conference: conference,
                                             options: VTJoinOptions.create(with: options)) { conference in
                resolve(conference.reactDescription())
            } fail: { error in
                error.send(with: reject)
            }
        }
    }
    
    @objc(kick:resolver:rejecter:)
    public func kick(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let participantObject = current?.findParticipant(participant) else {
            ModuleError.noParticipant(participant.description).send(with: reject)
            return
        }
        
        VoxeetSDK.shared.conference.kick(participant: participantObject) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(leave:rejecter:)
    public func leave(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.leave { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(replay:replayOptions:mixingOptions:resolver:rejecter:)
    public func replay(
        conference: [String: Any],
        replayOptions: [String: Any]?,
        mixingOptions: [String: Any]?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let conferenceId = conference.identifier else {
            ModuleError.noConferenceId.send(with: reject)
            return
        }
        VoxeetSDK.shared.conference.fetch(conferenceID: conferenceId) { conference in
            VoxeetSDK.shared.conference.replay(conference: conference,
                                               options: VTReplayOptions.create(with: replayOptions)) { error in
                guard let error = error else {
                    resolve(NSNull())
                    return
                }
                error.send(with: reject)
            }
        }
    }
    
    // MARK: - User Actions
    
    @objc(updatePermissions:resolver:rejecter:)
    public func updatePermissions(
        participantPermissions: [[String: Any]],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let permissions: [VTParticipantPermissions] = participantPermissions.compactMap {
            guard let participant = $0.participant,
                  let permissions = $0.permissions,
                  let conferenceParticipant = current?.findParticipant(participant) else {
                      return nil
                  }
            let conferencePermissions = permissions.compactMap { VTConferencePermission(rawValue: $0.intValue) }
            return VTParticipantPermissions(participant: conferenceParticipant,
                                            permissions: conferencePermissions)
        }
        VoxeetSDK.shared.conference.updatePermissions(participantPermissions: permissions) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(startAudio:resolver:rejecter:)
    public func startAudio(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.startAudio(participant: current?.findParticipant(participant)) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(startVideo:resolver:rejecter:)
    public func startVideo(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.startVideo(participant: current?.findParticipant(participant)) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(stopAudio:resolver:rejecter:)
    public func stopAudio(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.stopAudio(participant: current?.findParticipant(participant)) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(stopVideo:resolver:rejecter:)
    public func stopVideo(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.stopVideo(participant: current?.findParticipant(participant)) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    // MARK: - Getters
    
    @objc(current:rejecter:)
    public func current(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let conference = current else {
            ModuleError.noCurrentConference.send(with: reject)
            return
        }
        resolve(conference.reactDescription())
    }
    
    @objc(getAudioLevel:resolver:rejecter:)
    public func getAudioLevel(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let participantObject = current?.findParticipant(participant) else {
            ModuleError.noParticipant(participant.description).send(with: reject)
            return
        }
        resolve(NSNumber(value: VoxeetSDK.shared.conference.audioLevel(participant: participantObject)))
    }
    
    @objc(getMaxVideoForwarding:rejecter:)
    public func getMaxVideoForwarding(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        resolve(NSNumber(value: VoxeetSDK.shared.conference.maxVideoForwarding))
    }
    
    @objc(getParticipant:resolver:rejecter:)
    public func getParticipant(
        participantId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let participantObject = current?.findParticipant(withId: participantId) else {
            ModuleError.noParticipantId(participantId).send(with: reject)
            return
        }
        resolve(participantObject.reactDescription())
    }
    
    @objc(getParticipants:resolver:rejecter:)
    public func getParticipants(
        conference: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let conferenceId = conference.identifier else {
            ModuleError.noConferenceId.send(with: reject)
            return
        }
        
        VoxeetSDK.shared.conference.fetch(conferenceID: conferenceId) { conference in
            resolve(conference.participants.map { $0.reactDescription() })
        }
    }
    
    @objc(getStatus:resolver:rejecter:)
    public func getStatus(
        conference: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let conferenceId = conference.identifier else {
            ModuleError.noConferenceId.send(with: reject)
            return
        }
        
        VoxeetSDK.shared.conference.fetch(conferenceID: conferenceId) { conference in
            resolve(conference.status.reactDesctiption)
        }
    }
    
    @objc(isMuted:rejecter:)
    public func isMuted(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        resolve(NSNumber(value: VoxeetSDK.shared.conference.isMuted()))
    }
    
    @objc(isSpeaking:resolver:rejecter:)
    public func isSpeaking(
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let participantObject = current?.findParticipant(participant) else {
            ModuleError.noParticipant(participant.description).send(with: reject)
            return
        }
        resolve(NSNumber(value: VoxeetSDK.shared.conference.isSpeaking(participant: participantObject)))
    }
    
    @objc(getLocalStats:rejecter:)
    public func getLocalStats(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let localStats = VoxeetSDK.shared.conference.localStats() else {
            ModuleError.noLocalStats.send(with: reject)
            return
        }
        resolve(localStats)
    }
    
    // MARK: - Setters
    
    @objc(setAudioProcessing:resolver:rejecter:)
    public func setAudioProcessing(
        processingOptions: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let audioProcessing = processingOptions.audioProcessing else {
                  ModuleError.invalidOptions(processingOptions.description).send(with: reject)
                  return
              }
        VoxeetSDK.shared.conference.audioProcessing(enable: audioProcessing.boolValue)
        resolve(NSNull())
    }
    
    @objc(setMaxVideoForwarding:participants:resolver:rejecter:)
    public func setMaxVideoForwarding(
        maxVideoForwarding: Int,
        participants: [[String:Any]],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.videoForwarding(max: maxVideoForwarding,
                                                    participants: participants.compactMap { current?.findParticipant($0) }) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(muteOutput:resolver:rejecter:)
    public func muteOutput(
        isMuted: Bool,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        VoxeetSDK.shared.conference.muteOutput(isMuted) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
    
    @objc(mute:participant:resolver:rejecter:)
    public func mute(
        isMuted: Bool,
        participant: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let participantObject = current?.findParticipant(participant) else {
            ModuleError.noParticipant(participant.description).send(with: reject)
            return
        }
        VoxeetSDK.shared.conference.mute(participant: participantObject,
                                         isMuted: isMuted) { error in
            guard let error = error else {
                resolve(NSNull())
                return
            }
            error.send(with: reject)
        }
    }
}
