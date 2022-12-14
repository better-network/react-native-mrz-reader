import React from 'react';
import {
  NativeMethods,
  NativeModules,
  NativeSyntheticEvent,
  requireNativeComponent,
} from 'react-native';
import { OnErrorEvent, tryParseNativeCameraError, isErrorWithCause } from '.';
import type { MrzReaderProps } from './MrzReaderProps';
import type { MrzResult } from './MrzResult';

type NativeMrzReaderProps = Omit<MrzReaderProps, 'onMrzResult' | 'onError'> & {
  torch?: 'on' | 'off';
  isScanning?: boolean;
  onMrzResult?: (event: NativeSyntheticEvent<MrzResult>) => void;
  onError?: (event: NativeSyntheticEvent<OnErrorEvent>) => void;
};
type RefType = React.Component<NativeMrzReaderProps> & Readonly<NativeMethods>;
export type CameraPermissionStatus =
  | 'authorized'
  | 'not-determined'
  | 'denied'
  | 'restricted';
export type CameraPermissionRequestResult = 'authorized' | 'denied';

const ComponentName = 'MrzReaderView';
const MrzReaderModule = NativeModules[ComponentName];

if (!MrzReaderModule)
  console.error(
    "Camera: Native Module 'CameraView' was null! Did you run pod install?"
  );

export class MrzReaderView extends React.PureComponent<MrzReaderProps> {
  private readonly ref: React.RefObject<RefType>;

  /** @internal */
  constructor(props: MrzReaderProps) {
    super(props);
    this.ref = React.createRef<RefType>();
    this.onError = this.onError.bind(this);
    this.onMrzResult = this.onMrzResult.bind(this);
  }

  /**
   * Gets the current Camera Permission Status. Check this before mounting the Camera to ensure
   * the user has permitted the app to use the camera.
   *
   * To actually prompt the user for camera permission, use {@linkcode MrzReaderView.requestCameraPermission | requestCameraPermission()}.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while getting the current permission status. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   */
  public static async getCameraPermissionStatus(): Promise<CameraPermissionStatus> {
    try {
      return await MrzReaderModule.getCameraPermissionStatus();
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Shows a "request permission" alert to the user, and resolves with the new camera permission status.
   *
   * If the user has previously blocked the app from using the camera, the alert will not be shown
   * and `"denied"` will be returned.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while requesting permission. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   */
  public static async requestCameraPermission(): Promise<CameraPermissionRequestResult> {
    try {
      return await MrzReaderModule.requestCameraPermission();
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }

  private onMrzResult(event: NativeSyntheticEvent<MrzResult>): void {
    if (this.props.onMrzResult != null)
      this.props.onMrzResult(event.nativeEvent);
  }

  private onError(event: NativeSyntheticEvent<OnErrorEvent>): void {
    if (this.props.onError != null) {
      const error = event.nativeEvent;
      const cause = isErrorWithCause(error.cause) ? error.cause : undefined;
      this.props.onError(
        // @ts-expect-error
        new CameraRuntimeError(error.code, error.message, cause)
      );
    }
  }

  /** @internal */
  public render(): React.ReactNode {
    const { ...props } = this.props;
    return (
      <NativeMrzReaderView
        {...props}
        ref={this.ref}
        onError={this.onError}
        onMrzResult={this.onMrzResult}
      />
    );
  }
}

const NativeMrzReaderView =
  requireNativeComponent<NativeMrzReaderProps>(ComponentName);
