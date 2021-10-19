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

  fun fromNative(permissionsNative: ReadableArray, findParticipant: (String) -> Participant) =
      mutableListOf<ParticipantPermissions>().apply {
        for (i in 0 until permissionsNative.size()) {
          add(
              fromNative(
                  permissionNative = permissionsNative.getMap(i),
                  findParticipant = findParticipant
              )
          )
        }
      }

  private fun fromNative(permissionNative: ReadableMap, findParticipant: (String) -> Participant): ParticipantPermissions {
    val participant = permissionNative.getMap(PARTICIPANT)?.let {
      participantMapper.toParticipantId(it)
          ?.let(findParticipant::invoke)
          ?: throw IllegalArgumentException("Conference should contain participantId")
    }
    val conferencePermissions = permissionNative.getArray(CONFERENCE_PERMISSIONS)?.let {
      conferencePermissionMapper.decode(it)
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
