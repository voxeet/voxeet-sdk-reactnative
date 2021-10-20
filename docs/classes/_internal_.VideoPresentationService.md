[@dolbyio/react-native-iapi-sdk](../README.md) / [Exports](../modules.md) / [%3Cinternal%3E](../modules/_internal_.md) / VideoPresentationService

# Class: VideoPresentationService

[<internal>](../modules/_internal_.md).VideoPresentationService

## Table of contents

### Constructors

- [constructor](_internal_.VideoPresentationService.md#constructor)

### Methods

- [onVideoPresentationChange](_internal_.VideoPresentationService.md#onvideopresentationchange)
- [pause](_internal_.VideoPresentationService.md#pause)
- [play](_internal_.VideoPresentationService.md#play)
- [seek](_internal_.VideoPresentationService.md#seek)
- [start](_internal_.VideoPresentationService.md#start)
- [stop](_internal_.VideoPresentationService.md#stop)

## Constructors

### constructor

• **new VideoPresentationService**()

## Methods

### onVideoPresentationChange

▸ **onVideoPresentationChange**(`handler`): [`UnsubscribeFunction`](../modules/_internal_.md#unsubscribefunction)

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | (`data`: [`VideoPresentationEventType`](../interfaces/_internal_.VideoPresentationEventType.md), `type?`: [`paused`](../modules/_internal_.md#paused) \| [`started`](../modules/_internal_.md#started)) => `void` |

#### Returns

[`UnsubscribeFunction`](../modules/_internal_.md#unsubscribefunction)

___

### pause

▸ **pause**(`timestamp`): `void`

Pauses the video presentation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `timestamp` | `number` |

#### Returns

`void`

void

___

### play

▸ **play**(): `void`

Resumes the paused video presentation.

#### Returns

`void`

void

___

### seek

▸ **seek**(`timestamp`): `void`

Allows the presenter to navigate to the specific section of the shared video.

#### Parameters

| Name | Type |
| :------ | :------ |
| `timestamp` | `number` |

#### Returns

`void`

void

___

### start

▸ **start**(`url`): `void`

Pauses the video presentation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`void`

void

___

### stop

▸ **stop**(): `void`

Stops the video presentation.

#### Returns

`void`

void
