### `VirtualizorClient` Class

This class is used to make HTTP requests to the Virtualizor API. It provides methods for various actions supported by the API.

#### Constructor

##### `constructor(options)`

- **Description**: Initializes a new instance of the `VirtualizorClient` class.
- **Parameters**:
  - `options` (Object): Configuration options for the client.
    - `host` (String): The hostname of the Virtualizor server.
    - `port` (String): The port to use for the connection.
    - `key` (String): The API key for authentication.
    - `pass` (String): The API password for authentication.
    - `isRawResponse` (Boolean): Flag to indicate if raw API responses should be returned.

#### Methods

##### `CreateVPS(params)`

- **Description**: Creates a new virtual server.
- **Parameters**:
  - `params` (Object): Parameters for creating a new virtual server.
     - `virtualizationType` (String): Type of virtualization for the new virtual server (e.g., 'kvm').
    - `nodeSelection` (String): Node selection for placing the new virtual server.
    - `userEmail` (String): Email of the user associated with the new virtual server.
    - `userPassword` (String): Password for the user associated with the new virtual server.
    - `serverHostname` (String): Hostname for the new virtual server.
    - `rootPassword` (String): Root password for the new virtual server.
    - `osId` (String): ID of the operating system for the new virtual server.
    - `ipAddress` (String): IP address for the new virtual server.
    - `storageSpace` (String): Storage space allocated for the new virtual server.
    - `serverRam` (String): RAM allocated for the new virtual server.
    - `bandwidthLimit` (String): Bandwidth limit for the new virtual server.
    - `cpuCores` (String): Number of CPU cores allocated for the new virtual server.
    - **Returns**: A Promise that resolves with the API response.

##### `GetVPS(id)`

- **Description**: Retrieves information about a virtual server.
- **Parameters**:
  - `id` (String): ID of the virtual server.
- **Returns**: A Promise that resolves with information about the virtual server.

##### `ListVPS()`

- **Description**: This method is used to list all virtual servers based on various search criteria.
- **Parameters**:
  - `params` (Object): Parameters for searching virtual servers.
    - `{Number} [vpsid]`: Search using the VPS ID.
    - `{String} [vpsname]`: Search using the VPS name.
    - `{String} [vpsip]`: Results will be returned on the basis of the IP address.
    - `{String} [vpshostname]`: VPS is searched on the basis of the hostname passed.
    - `{String} [vpsstatus]`: VPS is searched on the basis of the status of the VPS (type 's' for suspended, type 'u' for unsuspended).
    - `{String} [vstype]`: VPS is searched on the basis of the type of virtualization.
    - `{String} [speedcap]`: VPS is searched on the basis of the speed cap (type 1 for enabled, 2 for disabled).
    - `{String} [user]`: Search for the VPS according to the user.
    - `{String} [vsgid]`: Search for the VPS according to the server group.
    - `{String} [vserid]`: VPS is searched on the basis of the server.
    - `{String} [plid]`: VPS is searched on the basis of the plan that it has been assigned.
    - `{String} [bpid]`: VPS is searched on the basis of the backup plan that it has been assigned.
    - `{Number} [reslen]`: Number of records to be returned, default is 50.
    - `{Number} [page]`: Page number, each page shows 50 records.
- **Returns**: A Promise that resolves with an array of virtual server details.

This example demonstrates how to use the `ListVPS` method with optional parameters to filter virtual servers based on specific criteria.
##### `StartVPS(vpsId)`

- **Description**: Starts a virtual server.
- **Parameters**:
  - `vpsId` (String): ID of the virtual server.
- **Returns**: A Promise that resolves with the API response.

##### `StopVPS(vpsId)`

- **Description**: Stops a virtual server.
- **Parameters**:
  - `vpsId` (String): ID of the virtual server.
- **Returns**: A Promise that resolves with the API response.

##### `RestartVPS(vpsId)`

- **Description**: Restarts a virtual server.
- **Parameters**:
  - `vpsId` (String): ID of the virtual server.
- **Returns**: A Promise that resolves with the API response.

##### `GetVPSRam(vpsId)`

- **Description**: Retrieves RAM information about a virtual server.
- **Parameters**:
  - `vpsId` (String): ID of the virtual server.
- **Returns**: A Promise that resolves with RAM information.

##### `GetVPSCPU(vpsId)`

- **Description**: Retrieves CPU information about a virtual server.
- **Parameters**:
  - `vpsId` (String): ID of the virtual server.
- **Returns**: A Promise that resolves with CPU information.

##### `GetVPSDisk(vpsId)`

- **Description**: Retrieves disk information about a virtual server.
- **Parameters**:
  - `vpsId` (String): ID of the virtual server.
- **Returns**: A Promise that resolves with disk information.

##### `GetVPSBandwidth(vpsId, month)`

- **Description**: Retrieves bandwidth information about a virtual server for a specific month.
- **Parameters**:
  - `vpsId` (String): ID of the virtual server.
  - `month` (String): Month for which bandwidth information is requested.
- **Returns**: A Promise that resolves with bandwidth information.

##### `GetPlans()`

- **Description**: Retrieves information about available plans.
- **Returns**: A Promise that resolves with information about available plans.

#### Events

##### `vpsCreated`

- **Description**: Event triggered when a virtual server is created.

##### `vpsStarted`

- **Description**: Event triggered when a virtual server is started.

##### `vpsStopped`

- **Description**: Event triggered when a virtual server is stopped.

##### `vpsRestarted`

- **Description**: Event triggered when a virtual server is restarted.

#### Private Methods

##### `buildQueryString(params)`

- **Description**: Builds a query string from the provided parameters.
- **Parameters**:
  - `params` (Object): Parameters to be included in the query string.
- **Returns**: A formatted query string.

##### `makeHttpRequest(path, method, postData)`

- **Description**: Makes an HTTP request to the Virtualizor API.
- **Parameters**:
  - `path` (String): The API endpoint path.
  - `method` (String): HTTP method (default is GET).
  - `postData` (String): Data to be included in the request body (for POST requests).
- **Returns**: A Promise that resolves with the API response.