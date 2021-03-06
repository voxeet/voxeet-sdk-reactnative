package io.dolby.sdk.comms.reactnative.mapper

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.voxeet.sdk.models.Participant
import com.voxeet.sdk.services.presentation.PresentationState
import com.voxeet.sdk.services.presentation.video.VideoPresentation

/**
 * Provides methods that map [VideoPresentation] to React Native model
 */
class VideoPresentationMapper(
  private val participantMapper: ParticipantMapper
) {

  fun toRN(videoPresentation: VideoPresentation, participant: Participant): ReadableMap? = with(videoPresentation) {
    Arguments.createMap().apply {
      putMap(OWNER, participantMapper.toRN(participant))
      putString(URL, url)
      putDouble(TIMESTAMP, lastSeekTimestamp.toDouble())
    }
  }

  fun stateToRN(state: PresentationState?) = when (state) {
    PresentationState.STARTED,
    PresentationState.PLAY -> "playing"
    PresentationState.PAUSED -> "paused"
    PresentationState.STOP -> "stopped"
    else -> null
  }

  companion object {
    private const val OWNER = "owner"
    private const val URL = "url"
    private const val TIMESTAMP = "timestamp"
  }
}
