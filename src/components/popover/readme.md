# ui-popover



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                         | Type                                                                                                                                                                 | Default |
| ----------- | ----------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `opened`    | `opened`    | Indicates whether the popover should be open or not | `boolean`                                                                                                                                                            | `false` |
| `placement` | `placement` | Placement of the popover                            | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `"top"` |


## Events

| Event    | Description                    | Type               |
| -------- | ------------------------------ | ------------------ |
| `uiHide` | Fired when the popover closes. | `CustomEvent<any>` |
| `uiShow` | Fired when the popover opens.  | `CustomEvent<any>` |


## Methods

### `hide() => Promise<void>`

Close the popover

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Open the popover

#### Returns

Type: `Promise<void>`



### `updatePlacement() => Promise<void>`

Recalculate the optimal popover placemnt

#### Returns

Type: `Promise<void>`




## Slots

| Slot          | Description                                                |
| ------------- | ---------------------------------------------------------- |
| `"(default)"` | Elements in the default slot open the popover when clicked |
| `"overlay"`   | Content of the popover layer                               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
