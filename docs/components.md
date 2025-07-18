# Components


### ConnectButton

Button that updates based on transport state. 

**Optional props**

| Prop | Type | Description |
|------|------|-------------|
| `onConnect` | `() => void` | Handler method for connecting to session |
| `onDisconnect` | `() => void` | Handler method for disconnecting from session |
| `onClick` | `() => void` | Generic click handler |
| `className` | `string` | ClassName passed through to button component |
| `size` | `ButtonSize` | Size of button component (`default` \| `sm` \| `lg` \| `xl`) |
| `stateContent` | `ConnectButtonStateContent` | Modify button variant, className or child content based on current state |

**Example:**

```tsx
<ConnectButton 
    size="lg"
    onConnect={() => console.log("connecting");}
    onConnect={() => console.log("disconnecting");}
    stateContent={{
        disconnected: {
            variant: "outline",
            children: "Join the session",
            className: "font-bold"
        }
    }}
/>
```


### UserAudioControl

...

### UserVideoControl

...


...

## Helpers

### AudioClientHelper

...