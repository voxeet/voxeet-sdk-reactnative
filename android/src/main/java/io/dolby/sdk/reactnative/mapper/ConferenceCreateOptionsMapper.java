package io.dolby.sdk.reactnative.mapper;

import com.facebook.react.bridge.ReadableMap;
import com.voxeet.sdk.json.internal.MetadataHolder;
import com.voxeet.sdk.json.internal.ParamsHolder;
import com.voxeet.sdk.services.builders.ConferenceCreateOptions;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import io.dolby.sdk.reactnative.utils.RNCollectionExtractor;

/**
 * Provides a method that maps React Native model to {@link ConferenceCreateOptions} model.
 */
public class ConferenceCreateOptionsMapper {

    public static String CONFERENCE_CREATE_OPTIONS_ALIAS = "alias";
    public static String CONFERENCE_CREATE_OPTIONS_PARAMS = "params";
    public static String CONFERENCE_CREATE_OPTIONS_PARAMS_VIDEO_CODEC = "videoCodec";
    public static String CONFERENCE_CREATE_OPTIONS_PARAMS_TTL = "ttl";
    public static String CONFERENCE_CREATE_OPTIONS_PARAMS_RTCP_MODE = "rtcpMode";
    public static String CONFERENCE_CREATE_OPTIONS_PARAMS_LIVE_RECORDING = "liveRecording";
    public static String CONFERENCE_CREATE_OPTIONS_PARAMS_DOLBY_VOICE = "dolbyVoice";

    @NotNull
    private final RNCollectionExtractor rnCollectionExtractor;

    public ConferenceCreateOptionsMapper(
            @NotNull RNCollectionExtractor rnCollectionExtractor
    ) {
        this.rnCollectionExtractor = rnCollectionExtractor;
    }

    /**
     * Creates a {@link ConferenceCreateOptions} based on provided {@code options}.
     *
     * @param options options to set (conference alias, params)
     * @return {@link ConferenceCreateOptions}
     */
    public ConferenceCreateOptions toConferenceCreateOptions(@Nullable ReadableMap options) {
        MetadataHolder metadataHolder = new MetadataHolder();
        ParamsHolder paramsHolder = toConferenceParamsHolder(options);

        ConferenceCreateOptions.Builder createOptionsBuilder = new ConferenceCreateOptions.Builder()
                .setMetadataHolder(metadataHolder)
                .setParamsHolder(paramsHolder);

        if (options != null) {
            createOptionsBuilder.setConferenceAlias(toConferenceAlias(options));
        }
        return createOptionsBuilder.build();
    }

    @Nullable
    public String toConferenceAlias(@NotNull ReadableMap options) {
        return rnCollectionExtractor.getString(options, CONFERENCE_CREATE_OPTIONS_ALIAS);
    }

    @NotNull
    public ParamsHolder toConferenceParamsHolder(@Nullable ReadableMap options) {
        ParamsHolder paramsHolder = new ParamsHolder();
        if (options == null) {
            return paramsHolder;
        }

        ReadableMap params = rnCollectionExtractor.getMap(options, CONFERENCE_CREATE_OPTIONS_PARAMS);
        if (params == null) {
            return paramsHolder;
        }

        if (rnCollectionExtractor.hasKey(params, CONFERENCE_CREATE_OPTIONS_PARAMS_VIDEO_CODEC)) {
            String videoCodec = rnCollectionExtractor.getString(params, CONFERENCE_CREATE_OPTIONS_PARAMS_VIDEO_CODEC);
            if (videoCodec != null) {
                paramsHolder.setVideoCodec(videoCodec);
            }
        }

        if (rnCollectionExtractor.hasKey(params, CONFERENCE_CREATE_OPTIONS_PARAMS_TTL)) {
            paramsHolder.putValue(
                    CONFERENCE_CREATE_OPTIONS_PARAMS_TTL,
                    rnCollectionExtractor.getInteger(params, CONFERENCE_CREATE_OPTIONS_PARAMS_TTL)
            );
        }

        if (rnCollectionExtractor.hasKey(params, CONFERENCE_CREATE_OPTIONS_PARAMS_RTCP_MODE)) {
            paramsHolder.putValue(
                    CONFERENCE_CREATE_OPTIONS_PARAMS_RTCP_MODE,
                    rnCollectionExtractor.getString(params, CONFERENCE_CREATE_OPTIONS_PARAMS_RTCP_MODE)
            );
        }

        if (rnCollectionExtractor.hasKey(params, CONFERENCE_CREATE_OPTIONS_PARAMS_LIVE_RECORDING)) {
            paramsHolder.putValue(
                    CONFERENCE_CREATE_OPTIONS_PARAMS_LIVE_RECORDING,
                    rnCollectionExtractor.getBoolean(params, CONFERENCE_CREATE_OPTIONS_PARAMS_LIVE_RECORDING)
            );
        }

        if (rnCollectionExtractor.hasKey(params, CONFERENCE_CREATE_OPTIONS_PARAMS_DOLBY_VOICE)) {
            paramsHolder.setDolbyVoice(
                    rnCollectionExtractor.getBoolean(params, CONFERENCE_CREATE_OPTIONS_PARAMS_DOLBY_VOICE)
            );
        }
        return paramsHolder;
    }
}
