
package io.dolby.sdk.reactnative.services;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.voxeet.sdk.models.Conference;
import com.voxeet.sdk.models.Participant;
import com.voxeet.sdk.services.ConferenceService;
import com.voxeet.sdk.services.builders.ConferenceCreateOptions;
import com.voxeet.sdk.services.builders.ConferenceJoinOptions;
import com.voxeet.sdk.services.conference.information.ConferenceStatus;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONArray;

import java.util.Map;

import io.dolby.sdk.reactnative.mapper.ConferenceCreateOptionsMapper;
import io.dolby.sdk.reactnative.mapper.ConferenceJoinOptionsMapper;
import io.dolby.sdk.reactnative.mapper.ConferenceMapper;
import io.dolby.sdk.reactnative.mapper.ParticipantMapper;
import kotlin.jvm.functions.Function1;

/**
 * The {@link RNConferenceServiceModule} allows the application to manage the conference life cycle
 * and interact with the conference.
 * <ol>
 * <b>Typical application APIs workflow:</b>
 *
 * <li>The application creates ({@link #create(ReadableMap, Promise)}) a conference.</li>
 *
 * <li>The application uses the {@link #fetch(String, Promise)} method to obtain the conference object.</li>
 *
 * <li>The application can choose to either:
 * <ul>
 * <li>{@link #join(ReadableMap, ReadableMap, Promise)} a conference</li>
 * <li>Replay a conference</li> TODO DEXA-42 link to replay
 * </ul>
 * </li>
 * TODO DEXA-37 link to start/stopAudio
 * <li>The application can start and stop sending the local participant's audio streams to the conference.
 * The application can also start and stop sending the remote participants' audio streams to the local participant.</li>
 * TODO DEXA-37 link to start/stopVideo
 * <li>The application can start and stop sending the local participant's video streams to the conference.
 * The application can also start and stop sending the remote participants' video streams to the local participant.</li>
 *
 * <li>During a conference, the application can:
 * <ul>
 * TODO DEXA-39 link to setMaxVideoForwarding
 * <li>Customize the number of the received video streams and prioritize the selected participants' video streams.</li>
 * <li>Mute the local or remote participant</li> TODO DEXA-39 link to mute
 * <li>Check if the local participant {@link #isMuted(Promise)}</li>
 * <li>Check which participant {@link #isSpeaking(ReadableMap, Promise)}</li>
 * <li>Check the audio level of a specific participant ({@link #getAudioLevel(ReadableMap, Promise)})</li>
 * <li>Get information about the conference, such as Conference object ({@link #current(Promise)}),
 * conference status ({@link #getStatus(ReadableMap, Promise)})</li>
 * <li>Get information about conference participants, such as the participant instance
 * ({@link #getParticipant(String, Promise)}), audio level of a participant ({@link #getAudioLevel(ReadableMap, Promise)})
 * and list of participants ({@link #getParticipants(ReadableMap, Promise)}).</li>
 * <li>Check the standard WebRTC statistics for the application ({@link #getLocalStats(Promise)}).</li>
 * <li>{@link #kick(ReadableMap, Promise)} a participant from a conference.</li>
 * <li>Update the participant's permissions.</li> TODO DEXA-39 link to update permissions
 * </ul>
 * </li>
 * <li>The application calls the {@link #leave(Promise)} method to leave a conference.</li>
 * </ol>
 * The application can interact with the service through these events:
 * TODO DEXA-73, DEXA-75 and more: add javadoc about events
 */
public class RNConferenceServiceModule extends ReactContextBaseJavaModule {

    private static final String TAG = RNConferenceServiceModule.class.getSimpleName();

    @NotNull
    private final ConferenceService conferenceService;
    @NotNull
    private final ConferenceMapper conferenceMapper;
    @NotNull
    private final ConferenceCreateOptionsMapper conferenceCreateOptionsMapper;
    @NotNull
    private final ConferenceJoinOptionsMapper conferenceJoinOptionsMapper;
    @NotNull
    private final ParticipantMapper participantMapper;

    /**
     * Creates a bridge wrapper for {@link ConferenceService}.
     *
     * @param conferenceService             {@link ConferenceService} from Android SDK
     * @param reactContext                  react context
     * @param conferenceMapper              mapper for a {@link Conference} and {@link Conference}-related models
     * @param conferenceCreateOptionsMapper mapper for a {@link ConferenceCreateOptions} model
     * @param conferenceJoinOptionsMapper   mapper for a {@link ConferenceJoinOptions} model
     */
    public RNConferenceServiceModule(
            @NotNull ConferenceService conferenceService,
            @NotNull ReactApplicationContext reactContext,
            @NotNull ConferenceMapper conferenceMapper,
            @NotNull ConferenceCreateOptionsMapper conferenceCreateOptionsMapper,
            @NotNull ConferenceJoinOptionsMapper conferenceJoinOptionsMapper,
            @NotNull ParticipantMapper participantMapper
    ) {
        super(reactContext);

        this.conferenceService = conferenceService;
        this.conferenceMapper = conferenceMapper;
        this.conferenceCreateOptionsMapper = conferenceCreateOptionsMapper;
        this.conferenceJoinOptionsMapper = conferenceJoinOptionsMapper;
        this.participantMapper = participantMapper;
    }

    @NotNull
    @Override
    public String getName() {
        return "DolbyIoIAPIConferenceService";
    }

    /**
     * <p>
     * Creates the conference based on information from the {@code options}.
     * </p>
     * <p>
     * Note that some parameters of the conference (returned as a {@code promise}), won't be
     * available (like dolbyVoice or ttl that are normally placed in
     * {@link Conference#getMetadata()}). {@link #join(ReadableMap, ReadableMap, Promise)} call
     * returns a conference object that contains that data. Also, if you call
     * {@link #fetch(String, Promise)} after {@link #join(ReadableMap, ReadableMap, Promise)} then
     * it also contains that data (if not, {@link Conference#getMetadata()} returns null).
     * </p>
     *
     * @param optionsMap information holder where the ID, parameters, and metadata can be passed
     * @param promise    returns a created conference
     */
    @ReactMethod
    public void create(@Nullable ReadableMap optionsMap, @NotNull final Promise promise) {
        ConferenceCreateOptions createOptions = conferenceCreateOptionsMapper.toConferenceCreateOptions(optionsMap);

        conferenceService.create(createOptions)
                .then(conference -> {
                    promise.resolve(conferenceMapper.toMap(conference));
                }).error(promise::reject);
    }

    /**
     * Provides a Conference object that allows joining a conference.
     *
     * @param conferenceId the conference ID
     * @param promise      returns a conference with the given {@code conferenceId} or the current
     *                     conference if {@code conferenceId} is null
     */
    @ReactMethod
    public void fetch(@Nullable String conferenceId, @NotNull Promise promise) {
        com.voxeet.promise.Promise<Conference> conferencePromise;
        if (conferenceId != null) {
            conferencePromise = conferenceService.fetchConference(conferenceId);
        } else {
            conferencePromise = com.voxeet.promise.Promise.resolve(conferenceService.getConference());
        }

        conferencePromise
                .then(conference -> {
                    if (conference != null) {
                        promise.resolve(conferenceMapper.toMap(conference));
                    } else {
                        promise.reject(new Throwable("Couldn't find the conference"));
                    }
                }).error(promise::reject);
    }

    // TODO Note: remember to manually grant permissions to CAMERA and MICROPHONE.
    //  That mechanism will be added in DEXA-140.

    /**
     * <p>
     * Joins the conference based on information from the {@code options}.
     * </p>
     * <p>
     * <ul>
     * The possible exception in the rejection:
     * <li>ServerErrorException</li>
     * <li>InConferenceException</li>
     * <li>MediaEngineException</li>
     * <li>ParticipantAddedErrorEventException</li>
     * <li>IllegalArgumentException</li>
     * </ul>
     * </p>
     *
     * @param conferenceMap a conference to join
     * @param optionsMap    the holder of the options to join
     * @param promise       returns a joined conference
     */
    @ReactMethod
    public void join(
            @NotNull ReadableMap conferenceMap,
            @Nullable ReadableMap optionsMap,
            Promise promise
    ) {
        try {
            ConferenceJoinOptions joinOptions = toConferenceJoinOptions(conferenceMap, optionsMap);

            conferenceService.join(joinOptions)
                    .then(resultConference -> {
                        promise.resolve(conferenceMapper.toMap(resultConference));
                    }).error(promise::reject);
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get conference join options", throwable);
            promise.reject(throwable);
        }
    }

    /**
     * Allows the conference owner, or a participant with adequate permissions, to kick another
     * participant from the conference by revoking the conference access token. The kicked
     * participant cannot join the conference again.
     *
     * @param participantMap the participant who needs to be kicked from the conference
     * @param promise        returns null
     */
    @ReactMethod
    public void kick(@NotNull ReadableMap participantMap, @NotNull Promise promise) {
        invokeOntoParticipant(participantMap, promise, conferenceService::kick);
    }

    /**
     * Leaves the current conference.
     *
     * @param promise returns null
     */
    @ReactMethod
    public void leave(@NotNull Promise promise) {
        conferenceService.leave()
                .then(result -> {
                    promise.resolve(null);
                }).error(promise::reject);
    }

    /**
     * Gets the current Conference object.
     *
     * @param promise returns the current conference
     */
    @ReactMethod
    public void current(@NotNull Promise promise) {
        Conference conference = conferenceService.getConference();
        if (conference != null) {
            promise.resolve(conferenceMapper.toMap(conference));
        } else {
            promise.reject(new Throwable("Missing current conference"));
        }
    }

    /**
     * <p>
     * Gets the participant's audio level. The audio level value ranges from 0.0 to 1.0.
     * </p>
     * <p>
     * Note: When the local participant is muted, the audioLevel value is set to a non-zero value,
     * and isSpeaking is set to true if the audioLevel is greater than 0.05. This implementation
     * allows adding a warning message to notify the local participant that their audio is not sent
     * to a conference.
     * </p>
     *
     * @param participantMap this method gets audioLevel of a participant provided here
     * @param promise        returns the value between 0 and 1
     */
    @ReactMethod
    public void getAudioLevel(@NotNull ReadableMap participantMap, @NotNull Promise promise) {
        //invokeOntoParticipantOnUiThread(participantMap, promise, conferenceService::audioLevel);
        getLocalStats(promise);
    }

    /**
     * Provides the maximum number of video streams that may be transmitted to the local participant.
     *
     * @param promise returns the max video forwarded value for the current conference
     */
    @ReactMethod
    public void getMaxVideoForwarding(@NotNull Promise promise) {
        Integer maxVideoForwarding = conferenceService.getMaxVideoForwarding();
        if (maxVideoForwarding != null) {
            promise.resolve(maxVideoForwarding);
        } else {
            promise.reject(new Throwable("Can't get max video forwarding"));
        }
    }

    /**
     * Provides the instance of the desired participant.
     *
     * @param participantId participant id
     * @param promise       returns the instance of the participant. The null value informs that the
     *                      conference or the participant does not exist in the current time session.
     */
    @ReactMethod
    public void getParticipant(@NotNull String participantId, @NotNull Promise promise) {
        Participant participant = conferenceService.findParticipantById(participantId);
        if (participant != null) {
            promise.resolve(participantMapper.toMap(participant));
        } else {
            promise.reject(new Throwable("Couldn't get the participant"));
        }
    }

    /**
     * Gets information about conference participants.
     *
     * @param conferenceMap this method gets participants from a conference provided here
     * @param promise       returns the direct reference to the array of participants
     */
    @ReactMethod
    public void getParticipants(@NotNull ReadableMap conferenceMap, @NotNull Promise promise) {
        invokeOntoConference(conferenceMap, promise,
                conference -> participantMapper.toParticipantsArray(conference.getParticipants())
        );
    }

    /**
     * Provides the current conference status.
     *
     * @param conferenceMap this method gets status of a conference provided here
     * @param promise       returns the valid {@link ConferenceStatus} for a manipulation
     */
    @ReactMethod
    public void getStatus(@NotNull ReadableMap conferenceMap, @NotNull Promise promise) {
        invokeOntoConference(conferenceMap, promise,
                conference -> conferenceMapper.toString(conference.getState())
        );
    }

    /**
     * <p>
     * Informs whether the local participant is muted.
     * </p>
     * <p>Note: This API is no longer supported for remote participants.
     * </p>
     *
     * @param promise returns boolean - information if the local participant is muted. Returns
     *                false if the participant is not muted or is not present at the conference.
     *                Returns true if the participant is muted.
     */
    @ReactMethod
    public void isMuted(Promise promise) {
        promise.resolve(conferenceService.isMuted());
    }

    /**
     * Indicates whether the current participant is speaking.
     *
     * @param participantMap this method gets speaking status of a participant provided here
     * @param promise        returns a boolean indicating whether the current participant is speaking.
     */
    @ReactMethod
    public void isSpeaking(@NotNull ReadableMap participantMap, @NotNull Promise promise) {
        invokeOntoParticipantOnUiThread(participantMap, promise, conferenceService::isSpeaking);
    }

    /**
     * Provides standard WebRTC statistics for the application to implement its own quality
     * monitoring mechanisms.
     *
     * @param promise returns The WebRTC Stat Matrix
     */
    @ReactMethod
    public void getLocalStats(@NotNull Promise promise) {
        Map<String, JSONArray> localStats = conferenceService.localStats();
        promise.resolve(conferenceMapper.toMap(localStats));
    }

    /**
     * Creates a {@link ConferenceJoinOptions} based on provided {@code options} for a given
     * {@code conference}. Throws {@link IllegalArgumentException} if conference id is invalid.
     *
     * @param conferenceMap a conference to join
     * @param optionsMap    the holder of the options to join
     * @return {@link ConferenceJoinOptions}
     */
    @NotNull
    private ConferenceJoinOptions toConferenceJoinOptions(
            @NotNull ReadableMap conferenceMap,
            @Nullable ReadableMap optionsMap
    ) {
        Conference conference = toConference(conferenceMap);
        return conferenceJoinOptionsMapper.toConferenceJoinOptions(conference, optionsMap);
    }

    /**
     * Gets {@link Participant} based on a React Native participant model. Throws
     * {@link IllegalArgumentException} if participant id is invalid.
     *
     * @param participantMap a React Native participant model
     * @return {@link Participant}
     */
    @NotNull
    private Participant toParticipant(@NotNull ReadableMap participantMap) throws Throwable {
        String participantId = participantMapper.toParticipantId(participantMap);
        if (participantId == null) {
            throw new IllegalArgumentException("Conference should contain participantId");
        }

        Participant foundParticipant = conferenceService.findParticipantById(participantId);
        if (foundParticipant == null) {
            throw new Throwable("Couldn't find the participant");
        }
        return foundParticipant;
    }

    /**
     * Gets {@link Conference} based on a React Native conference model. Throws
     * {@link IllegalArgumentException} if conference id is invalid.
     *
     * @param conferenceMap a React Native conference model
     * @return {@link Conference}
     */
    @NotNull
    private Conference toConference(@NotNull ReadableMap conferenceMap) {
        String conferenceId = conferenceMapper.toConferenceId(conferenceMap);
        if (conferenceId == null) {
            throw new IllegalArgumentException("Conference should contain conferenceId");
        }
        return conferenceService.getConference(conferenceId);
    }

    /**
     * Resolves the promise with the result of the given {@code function} and provides the
     * {@link Conference} object.
     *
     * @param conferenceMap a React Native conference model
     * @param promise       returns a {@code function}'s result
     * @param function      called with a {@link Conference}
     * @param <Out>         return type of a {@code function}
     */
    private <Out> void invokeOntoConference(
            @NotNull ReadableMap conferenceMap,
            @NotNull Promise promise,
            @NotNull Function1<Conference, Out> function
    ) {
        try {
            Conference conference = toConference(conferenceMap);
            promise.resolve(function.invoke(conference));
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get conference", throwable);
            promise.reject(throwable);
        }
    }

    /**
     * Resolves the promise with the result of the given {@code function} and provides the
     * {@link Participant} object.
     *
     * @param participantMap a React Native conference model
     * @param promise        returns a {@code function}'s result
     * @param function       called with a {@link Participant}
     * @param <Out>          return type of a {@code function}
     */
    private <Out> void invokeOntoParticipant(
            @NotNull ReadableMap participantMap,
            @NotNull Promise promise,
            @NotNull Function1<Participant, Out> function
    ) {
        try {
            Participant participant = toParticipant(participantMap);
            promise.resolve(function.invoke(participant));
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get participant", throwable);
            promise.reject(throwable);
        }
    }

    /**
     * It does the same as {@link #invokeOntoParticipant(ReadableMap, Promise, Function1)}, but
     * can be used for methods that need to be called on the UI thread (like
     * {@link #getAudioLevel(ReadableMap, Promise)}).
     *
     * @param participantMap a React Native conference model
     * @param promise        returns a {@code function}'s result
     * @param function       called with a {@link Participant}
     * @param <Out>          return type of a {@code function}
     */
    private <Out> void invokeOntoParticipantOnUiThread(
            @NotNull ReadableMap participantMap,
            @NotNull Promise promise,
            @NotNull Function1<Participant, Out> function
    ) {
        try {
            Participant foundParticipant = toParticipant(participantMap);
            com.voxeet.promise.Promise<Out> voxeetPromise = new com.voxeet.promise.Promise<>(solver ->
                    solver.resolve(function.invoke(foundParticipant))
            );

            voxeetPromise
                    .then(promise::resolve)
                    .error(promise::reject);
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get participant", throwable);
            promise.reject(throwable);
        }
    }
}
