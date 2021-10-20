package io.dolby.sdk.reactnative.services

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.voxeet.promise.solve.ThenVoid
import com.voxeet.sdk.services.CommandService
import com.voxeet.sdk.services.ConferenceService

/**
 * The [RNCommandServiceModule] allows the application to send [.send] text messages to all other participants of
 * a specific conference.
 *
 * @constructor
 * Creates a bridge wrapper for [CommandService].
 *
 * @param conferenceService [ConferenceService] from Android SDK
 * @param commandService    [CommandService] from Android SDK
 * @param reactContext      react context
 */
class RNCommandServiceModule(
  reactContext: ReactApplicationContext,
  private val conferenceService: ConferenceService,
  private val commandService: CommandService
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "DolbyIoIAPICommandServiceModule"
  }

  /**
   * Sends the message to the conference. The message must be in the form of a string or a representation of strings (json or
   * base64).
   *
   * @param message content of the message (any possible string)
   * @param promise returns true if message was send, false otherwise
   */
  @ReactMethod
  fun send(message: String, promise: Promise) {
    val conferenceId = conferenceService.conferenceId
    if (conferenceId == null) {
      promise.reject(Exception("Couldn't find the conference"))
      return
    }
    commandService.send(conferenceId, message)
      .then(ThenVoid { value: Boolean? -> promise.resolve(value) })
      .error { throwable: Throwable? -> promise.reject(throwable) }
  }
}
