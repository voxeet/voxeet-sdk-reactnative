package io.dolby.sdk.reactnative.mapper

import com.voxeet.android.media.MediaEngine

/**
 * Provides methods that map media-related models to React Native models and vice versa
 */
class MediaMapper {

  fun fromRN(comfortNoiseLevelRN: String) = when (comfortNoiseLevelRN) {
    "DEFAULT" -> MediaEngine.ComfortNoiseLevel.DEFAULT
    "MEDIUM" -> MediaEngine.ComfortNoiseLevel.MEDIUM
    "LOW" -> MediaEngine.ComfortNoiseLevel.LOW
    "OFF" -> MediaEngine.ComfortNoiseLevel.OFF
    else -> null
  }

  fun toRN(comfortNoiseLevel: MediaEngine.ComfortNoiseLevel) = when (comfortNoiseLevel) {
    MediaEngine.ComfortNoiseLevel.DEFAULT -> "DEFAULT"
    MediaEngine.ComfortNoiseLevel.MEDIUM -> "MEDIUM"
    MediaEngine.ComfortNoiseLevel.LOW -> "LOW"
    MediaEngine.ComfortNoiseLevel.OFF -> "OFF"
  }
}
