package io.dolby.sdk.reactnative.mapper

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.voxeet.sdk.models.Participant
import com.voxeet.sdk.models.ParticipantPermissions

/**
 * Provides methods that map [ParticipantPermissions] model to React Native models and vice versa
 */
class ParticipantPermissionMapper(
    private val participantMapper: ParticipantMapper,
    private val conferencePermissionMapper: ConferencePermissionMapper
) {

  fun fromRN(permissionsRN: ReadableArray, findParticipant: (String) -> Participant) =
      (0 until permissionsRN.size())
          .map(permissionsRN::getMap)
          .map { fromRN(permissionRN = it, findParticipant = findParticipant) }

  private fun fromRN(permissionRN: ReadableMap, findParticipant: (String) -> Participant): ParticipantPermissions {
    val participant = permissionRN.getMap(PARTICIPANT)?.let {
      participantMapper.participantIdFromRN(it)
          ?.let(findParticipant::invoke)
          ?: throw IllegalArgumentException("Conference should contain participantId")
    }
    val conferencePermissions = permissionRN.getArray(CONFERENCE_PERMISSIONS)?.let {
      conferencePermissionMapper.fromRN(it)
    }

    return ParticipantPermissions().apply {
      participant?.let { this.participant = it }
      conferencePermissions?.let { this.permissions = it }
    }
  }

  companion object {
    private const val PARTICIPANT = "participant"
    private const val CONFERENCE_PERMISSIONS = "permissions"
  }
}
