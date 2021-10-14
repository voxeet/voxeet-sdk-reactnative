
package io.dolby.sdk.reactnative;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.voxeet.VoxeetSDK;

import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import io.dolby.sdk.reactnative.mapper.ConferenceCreateOptionsMapper;
import io.dolby.sdk.reactnative.mapper.ConferenceJoinOptionsMapper;
import io.dolby.sdk.reactnative.mapper.ConferenceMapper;
import io.dolby.sdk.reactnative.mapper.ParticipantMapper;
import io.dolby.sdk.reactnative.mapper.RecordingMapper;
import io.dolby.sdk.reactnative.services.RNCommandServiceModule;
import io.dolby.sdk.reactnative.services.RNConferenceServiceModule;
import io.dolby.sdk.reactnative.services.RNDolbyioIAPISdkModule;
import io.dolby.sdk.reactnative.services.RNRecordingServiceModule;
import io.dolby.sdk.reactnative.services.RNSessionServiceModule;
import io.dolby.sdk.reactnative.utils.RNCollectionExtractor;

public class RNDolbyioIAPISdkPackage implements ReactPackage {

    @NotNull
    @Override
    public List<NativeModule> createNativeModules(@NotNull ReactApplicationContext reactContext) {
        RNCollectionExtractor rnCollectionExtractor = new RNCollectionExtractor();
        ParticipantMapper participantMapper = new ParticipantMapper(rnCollectionExtractor);

        return Arrays.asList(
                new RNDolbyioIAPISdkModule(reactContext),
                new RNSessionServiceModule(
                        VoxeetSDK.session(),
                        reactContext,
                        participantMapper
                ),
                new RNConferenceServiceModule(
                        reactContext,
                        VoxeetSDK.conference(),
                        new ConferenceMapper(participantMapper, rnCollectionExtractor),
                        new ConferenceCreateOptionsMapper(rnCollectionExtractor),
                        new ConferenceJoinOptionsMapper(rnCollectionExtractor),
                        participantMapper
                ),
                new RNCommandServiceModule(
                        VoxeetSDK.conference(),
                        VoxeetSDK.command(),
                        reactContext
                ),
                new RNRecordingServiceModule(
                        VoxeetSDK.conference(),
                        VoxeetSDK.recording(),
                        reactContext,
                        new RecordingMapper()
                )
        );
    }

    @NotNull
    @Override
    public List<ViewManager> createViewManagers(@NotNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
