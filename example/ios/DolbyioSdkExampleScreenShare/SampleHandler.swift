import ReplayKit
import VoxeetScreenShareKit

class SampleHandler: RPBroadcastSampleHandler {
  private var screenShareService: VoxeetScreenShareKit?

  override func broadcastStarted(withSetupInfo setupInfo: [String : NSObject]?) {
    screenShareService = VoxeetScreenShareKit(appGroup: "group.io.dolby.reactnative.example")
    screenShareService?.delegate = self
    screenShareService?.broadcastStarted(withSetupInfo: setupInfo)
  }

  override func broadcastPaused() {
    screenShareService?.broadcastPaused()
  }

  override func broadcastResumed() {
    screenShareService?.broadcastResumed()
  }

  override func broadcastFinished() {
    screenShareService?.broadcastFinished()
  }

  override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
    screenShareService?.processSampleBuffer(sampleBuffer, with: sampleBufferType)
  }
}

// MARK: - VoxeetScreenShareKitDelegate
extension SampleHandler: VoxeetScreenShareKitDelegate {

  func finishBroadcastWithError(error: Error) {
    self.finishBroadcastWithError(error)
  }
}
