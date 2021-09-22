package io.dolby.sdk.reactnative.mapper;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.voxeet.sdk.json.ParticipantInfo;
import com.voxeet.sdk.models.Participant;
import com.voxeet.sdk.models.v1.ConferenceParticipantStatus;
import com.voxeet.sdk.utils.Opt;

public class ParticipantMapper {

    public final static String PARTICIPANT_NAME = "name";
    public final static String PARTICIPANT_EXTERNAL_ID = "externalId";
    public final static String PARTICIPANT_AVATAR_URL = "avatarUrl";

    @NonNull
    public ParticipantInfo toParticipantInfo(ReadableMap map) {
        return new ParticipantInfo(
                map.getString(PARTICIPANT_NAME),
                map.getString(PARTICIPANT_EXTERNAL_ID),
                map.getString(PARTICIPANT_AVATAR_URL)
        );
    }
}
