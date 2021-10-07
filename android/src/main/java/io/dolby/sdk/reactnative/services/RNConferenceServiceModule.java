
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

import java.util.List;

import io.dolby.sdk.reactnative.mapper.ConferenceCreateOptionsMapper;
import io.dolby.sdk.reactnative.mapper.ConferenceJoinOptionsMapper;
import io.dolby.sdk.reactnative.mapper.ConferenceMapper;
import io.dolby.sdk.reactnative.mapper.ParticipantMapper;

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
    public void fetch(@Nullable String conferenceId, Promise promise) {
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
    public void kick(@NotNull ReadableMap participantMap, Promise promise) {
        try {
            Participant foundParticipant = toParticipant(participantMap);

            conferenceService.kick(foundParticipant)
                    .then(result -> {
                        promise.resolve(null);
                    })
                    .error(promise::reject);
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get participant", throwable);
            promise.reject(throwable);
        }
    }

    /**
     * Leaves the current conference.
     *
     * @param promise returns null
     */
    @ReactMethod
    public void leave(Promise promise) {
        conferenceService.leave()
                .then(result -> {
                    promise.resolve(null);
                }).error(promise::reject);
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
    public void getAudioLevel(@NotNull ReadableMap participantMap, Promise promise) {
        try {
            Participant foundParticipant = toParticipant(participantMap);
            double audioLevel = conferenceService.audioLevel(foundParticipant);
            promise.resolve(audioLevel);
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get participant", throwable);
            promise.reject(throwable);
        }
    }

    /**
     * Provides the maximum number of video streams that may be transmitted to the local participant.
     *
     * @param promise returns the max video forwarded value for the current conference
     */
    @ReactMethod
    public void getMaxVideoForwarding(Promise promise) {
        Integer maxVideoForwarding = conferenceService.getMaxVideoForwarding();
        if (maxVideoForwarding != null) {
            promise.resolve(maxVideoForwarding);
        } else {
            promise.reject(new Throwable("Max video forwarding value is not available"));
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
    public void getParticipant(@NotNull String participantId, Promise promise) {
        Participant participant = conferenceService.findParticipantById(participantId);
        if (participant != null) {
            promise.resolve(participant);
        } else {
            promise.reject(new Throwable("Couldn't find the participant"));
        }
    }

    /**
     * Gets information about conference participants.
     *
     * @param conferenceMap this method gets participants from a conference provided here
     * @param promise       returns the direct reference to the array of participants
     */
    @ReactMethod
    public void getParticipants(@NotNull ReadableMap conferenceMap, Promise promise) {
        try {
            List<Participant> participants = toConference(conferenceMap).getParticipants();
            promise.resolve(participantMapper.toParticipantsArray(participants));
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get conference", throwable);
            promise.reject(throwable);
        }
    }

    /**
     * Provides the current conference status.
     *
     * @param conferenceMap this method gets status of a conference provided here
     * @param promise       returns the valid {@link ConferenceStatus} for a manipulation
     */
    @ReactMethod
    public void getStatus(@NotNull ReadableMap conferenceMap, Promise promise) {
        try {
            String conferenceId = toConferenceId(conferenceMap);
            ConferenceStatus status = conferenceService.getConference(conferenceId).getState();
            promise.resolve(conferenceMapper.toString(status));
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get conferenceId", throwable);
            promise.reject(throwable);
        }
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
    public void isSpeaking(@NotNull ReadableMap participantMap, Promise promise) {
        try {
            Participant foundParticipant = toParticipant(participantMap);
            boolean isSpeaking = conferenceService.isSpeaking(foundParticipant);
            promise.resolve(isSpeaking);
        } catch (Throwable throwable) {
            Log.w(TAG, "Can't get participant", throwable);
            promise.reject(throwable);
        }
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
        String conferenceId = toConferenceId(conferenceMap);
        Conference foundConference = conferenceService.getConference(conferenceId);
        return conferenceJoinOptionsMapper.toConferenceJoinOptions(foundConference, optionsMap);
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
        String conferenceId = toConferenceId(conferenceMap);
        return conferenceService.getConference(conferenceId);
    }

    /**
     * Gets conference id based on a React Native conference model. Throws
     * {@link IllegalArgumentException} if conference id is invalid.
     *
     * @param conferenceMap a React Native conference model
     * @return conference id
     */
    @NotNull
    private String toConferenceId(@NotNull ReadableMap conferenceMap) {
        String conferenceId = conferenceMapper.toConferenceId(conferenceMap);
        if (conferenceId == null) {
            throw new IllegalArgumentException("Conference should contain conferenceId");
        }
        return conferenceId;
    }
}
