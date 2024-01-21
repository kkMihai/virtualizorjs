## Event Handling in VirtualizorClient

### Overview

The `VirtualizorClient` class extends the `EventEmitter` class in Node.js, allowing you to handle various events that occur during the interaction with the Virtualizor API.

### Methods

#### `on(event, callback)`
- **Description**: Attaches an event listener to the `VirtualizorClient` instance.
- **Parameters**:
  - `event` - The event to listen to.
  - `callback` - The callback function to execute when the event is triggered.

##### Syntax

```javascript
const Client = new VirtualizorClient(options)
```

### Events

#### `vpsCreated`

- **Description**: Triggered when a new virtual server is successfully created.
- **Example**:

```javascript
Client.on('vpsCreated', (response) => {
  console.log(`Virtual Server Created! Details:`, response);
});
```

#### `vpsStarted`

- **Description**: Triggered when a virtual server is successfully started.
- **Example**:

```javascript
Client.on('vpsStarted', (response) => {
  console.log(`Virtual Server Started! Details:`, response);
});
```

#### `vpsStopped`

- **Description**: Triggered when a virtual server is successfully stopped.
- **Example**:

```javascript
Client.on('vpsStopped', (response) => {
  console.log(`Virtual Server Stopped! Details:`, response);
});
```

#### `vpsRestarted`

- **Description**: Triggered when a virtual server is successfully restarted.
- **Example**:

```javascript
Client.on('vpsRestarted', (response) => {
  console.log(`Virtual Server Restarted! Details:`, response);
});
```

### Usage

1. Import the `VirtualizorClient` class.
2. Create an instance named `Client` with the necessary configuration (host, port, API key, API pass).
3. If you need to perform specific actions, destructure the required methods from the `Client` instance.
4. Attach event listeners to the `Client` instance using the `on` method (`Client.on('event', callback)`).
