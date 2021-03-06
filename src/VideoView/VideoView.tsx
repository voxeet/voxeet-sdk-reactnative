import React, { PureComponent } from 'react';
import {
  View,
  ViewStyle,
  UIManager,
  findNodeHandle,
  Platform,
  StyleSheet,
  LogBox,
} from 'react-native';

import type { MediaStream, Participant } from '../services/conference/models';
import NativeEvents from '../utils/NativeEvents';
import type { UnregisterListener } from '../utils/types';
import COMVideoView from './COMVideoView';
import { VideoViewEventNames } from './events';

LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
]);

type Props = typeof VideoView.defaultProps & {
  isMirror?: boolean;
  scaleType?: 'fit' | 'fill';
  style?: ViewStyle;
};

type State = {
  mediaStream?: MediaStream;
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
});

export default class VideoView extends PureComponent<Props, State> {
  static defaultProps = {
    isMirror: false,
    scaleType: 'fit',
  };

  state: State = {
    mediaStream: undefined,
  };

  private _nativeEvents =
    Platform.OS === 'android' ? new NativeEvents(COMVideoView) : null;
  private _onEventUnsubscribe?: UnregisterListener = undefined;
  private _videoView: React.Component | null;
  private _videoViewHandler: null | number;
  private static _dispatchId: number = 1;
  private static _dispatchMap: Map<number, { resolve: any; reject: any }> =
    new Map();

  constructor(props: Props) {
    super(props);
    this._videoViewHandler = null;
    this._videoView = null;
  }

  componentDidMount() {
    if (this._nativeEvents) {
      this._onEventUnsubscribe = this._nativeEvents.addListener(
        VideoViewEventNames.CommandCallback,
        this._onEvent
      );
    }
  }

  componentWillUnmount() {
    this.detach();
    if (
      this._onEventUnsubscribe &&
      typeof this._onEventUnsubscribe === 'function'
    ) {
      this._onEventUnsubscribe();
    }
  }

  private _dispatchCommand = async (command: number, params: any[] = []) => {
    const dispatchId: number = VideoView._dispatchId++;

    UIManager.dispatchViewManagerCommand(this._videoViewHandler, command, [
      dispatchId,
      ...params,
    ]);

    return await new Promise((resolve, reject) => {
      VideoView._dispatchMap.set(dispatchId, { resolve, reject });
    });
  };

  private _onCommandEvent = ({ nativeEvent }: any) => {
    if (!nativeEvent) return;

    this._onEvent(nativeEvent);
  };
  private _onEvent = (event: any) => {
    if (!event) return;

    const { requestId, error } = event;
    const promise = VideoView._dispatchMap.get(requestId);
    VideoView._dispatchMap.delete(requestId);

    if (!promise) return;

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(event.result);
    }
  };

  private _setRefs = (ref?: any) => {
    if (ref) {
      this._videoView = ref;
      this._videoViewHandler = findNodeHandle(this._videoView);
    } else {
      this._videoView = null;
      this._videoViewHandler = null;
    }
  };

  public attach = async (
    participant: Participant,
    mediaStream: MediaStream
  ): Promise<boolean> => {
    const res = !!(await this._dispatchCommand(
      Platform.select({
        // @ts-ignore
        android: UIManager.COMVideoView.Commands.attach.toString(),
        // @ts-ignore
        ios: UIManager.COMVideoView.Commands.attach,
      }),
      [participant.id, mediaStream.id]
    ));
    this.setState({
      mediaStream,
    });
    return res;
  };

  public detach = async (): Promise<boolean> => {
    const res = !!(await this._dispatchCommand(
      Platform.select({
        // @ts-ignore
        android: UIManager.COMVideoView.Commands.detach.toString(),
        // @ts-ignore
        ios: UIManager.COMVideoView.Commands.detach,
      })
    ));
    this.setState({
      mediaStream: undefined,
    });
    return res;
  };

  public isAttached = async (): Promise<boolean> => {
    return !!(await this._dispatchCommand(
      Platform.select({
        // @ts-ignore
        android: UIManager.COMVideoView.Commands.isAttached.toString(),
        // @ts-ignore
        ios: UIManager.COMVideoView.Commands.isAttached,
      })
    ));
  };

  public isScreenShare = async (): Promise<boolean> => {
    return Promise.resolve(
      !!(
        this.state.mediaStream && this.state.mediaStream.type === 'SCREEN_SHARE'
      )
    );
  };

  render() {
    return (
      <View style={[styles.wrapper, this.props.style]} pointerEvents="none">
        <COMVideoView
          style={styles.video}
          isMirror={this.props.isMirror}
          scaleType={this.props.scaleType}
          onCommandEvent={
            Platform.OS === 'ios' ? this._onCommandEvent : undefined
          }
          ref={this._setRefs}
          pointerEvents="none"
        />
      </View>
    );
  }
}
