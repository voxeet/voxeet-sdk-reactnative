package io.dolby.sdk.reactnative.services

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.voxeet.sdk.services.SessionService
import com.voxeet.sdk.services.presentation.file.FilePresentation
import io.dolby.sdk.FilePresentationService
import io.dolby.sdk.reactnative.eventemitters.RNFilePresentationEventEmitter
import io.dolby.sdk.reactnative.mapper.FilePresentationMapper
import io.dolby.sdk.reactnative.utils.Promises
import io.dolby.sdk.reactnative.utils.Promises.forward
import io.dolby.sdk.reactnative.utils.Promises.thenNestedPromise
import io.dolby.sdk.reactnative.utils.Promises.thenPromise
import io.dolby.sdk.reactnative.utils.Promises.thenValue
import io.dolby.sdk.reactnative.utils.ReactPromise
import io.dolby.sdk.reactnative.utils.RnCollections.copy
import java.io.File

/**
 * The [RNFilePresentationServiceModule] allows presenting files during a conference.
 * The Dolby.io Communications APIs service converts the user-provided file into multiple pages, as images, accessible through the image method.
 *
 * **The file presentation workflow:**
 * 1. The presenter calls the [convert] method to upload and convert a file.
 * 2. The presenter calls the [start] method to start presenting the file.
 * 3. The presenter and the viewers receive the started event that informs that the file presentation starts.
 * Receiving the started event should trigger calling the image method to download the converted file and display the proper page of the file
 * by retrieving the individual images.
 * 4. The application is responsible for coordinating the page flip between the local and the presented files. The presenter calls the update method to inform the service to send the updated page number to the participants.
 * 5. The presenter and viewers receive the updated event with the current page number.
 * Receiving the updated event should trigger calling the image method to display the proper page of the file by retrieving the individual images.
 * 6. The presenter may call the thumbnail method to obtain thumbnail images of the file
 * and implement a carousel control for the presenting user to flip pages locally.
 * 7. The presenter calls the stop method to end the file presentation.
 * 8. The presenter and the viewers receive the stopped event to inform about the end of the file presentation.
 *
 * The current accessor allows the participants to receive information about the current state of the file presentation.
 *
 * @param reactContext            react context
 * @param sessionService          [SessionService] from Android SDK
 * @param filePresentationService [FilePresentationService] from Android SDK
 * @param filePresentationMapper  mapper for [FilePresentation] model and [File] creation
 */
class RNFilePresentationServiceModule(
  reactContext: ReactApplicationContext,
  private val eventEmitter: RNFilePresentationEventEmitter,
  private val sessionService: SessionService,
  private val filePresentationService: FilePresentationService,
  private val filePresentationMapper: FilePresentationMapper
) : RNEventEmitterModule(reactContext, eventEmitter) {

  override fun getName(): String = "DolbyIoIAPIFilePresentationService"

  /**
   * Converts the user-provided file into multiple pages, as images, that can be shared during the file presentation.
   * The file is uploaded as FormData.
   *
   * Supported file formats are:
   * - doc/docx (Microsoft Word)
   * - ppt/pptx
   * - pdf
   *
   * After conversion, the files are broken into individual images with maximum resolution capped at 2560x1600.
   *
   * Only the converted files can be shared during conferences.
   *
   * @param fileRN map with url to file. This should be a content:// URI for a document provided by a DocumentProvider
   * that must be accessed with a ContentResolver.
   * @param promise returns converted file information
   */
  @ReactMethod
  fun convert(fileRN: ReadableMap, promise: ReactPromise) {
    Promises.promise({ filePresentationMapper.fileFromRN(fileRN) })
      .thenNestedPromise { file ->
        filePresentationService.convertFile(file).thenValue { file to it }
      }
      .thenValue { (file, filePresentation) ->
        val ownerId = requireNotNull(sessionService.participantId)
        val fileConvertedRN = filePresentationMapper.toRNFileConverted(ownerId, file.name, filePresentation)
        eventEmitter.onFileConverted(fileConvertedRN.copy())
        fileConvertedRN
      }
      .forward(promise)
  }

  /**
   * Starts a file presentation. The Dolby.io Communications APIs allow presenting only the converted files.
   *
   * @param fileConvertedRN previously converted file information
   * @param promise return null
   */
  @ReactMethod
  fun start(fileConvertedRN: ReadableMap, promise: ReactPromise) {
    Promises.promise({ filePresentationMapper.fileConvertedFromRN(fileConvertedRN) })
      .thenPromise(filePresentationService::start)
      .forward(promise, ignoreReturnType = true)
  }

  /**
   * Every emitter module must implement this method in place, otherwise JS cannot receive event
   */
  @ReactMethod
  override fun addListener(eventName: String) = super.addListener(eventName)


  /**
   * Every emitter module must implement this method in place, otherwise JS cannot receive event
   */
  @ReactMethod
  override fun removeListeners(count: Int) = super.removeListeners(count)
}
