# VirtualizorJS

Since there is no SDK's for Node.js for the Virtualizor API, I decided to create one, and one that is actually easy to use and useful with **0 Dependencies** keeping it `Lightweight` and `Fast`.

VirtualizorJS simplifies the management of Virtualizor servers with a streamlined and developer-friendly API for Node.js. Perform actions such as creating, starting, stopping, and restarting virtual servers effortlessly. Ideal for seamless integration into your Node.js applications, providing a powerful toolkit for Virtualizor server management.


[![GitHub stars](https://img.shields.io/github/stars/kkMihai/virtualizorjs.svg?style=social&label=Star&maxAge=2592000)](https://github.com/kkMihai/virtualizorjs)

[![Npm package version](https://badgen.net/npm/v/virtualizorjs)](https://npmjs.com/package/virtualizorjs) [![Maintenance](https://img.shields.io/badge/Maintained%3F-No-red.svg)](https://github.com/kkMihai/virtualizorjs/graphs/commit-activity)

## Important
 - This library is still in development and there is more to add but for now it's stable and ready to use, all the methods have been tested and work as expected.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [API Documentation](#api-documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm i virtualizorjs@latest
```

## Usage

```javascript

const VirtualizorClient = require('virtualizorjs');

// Initialize VirtualizorClient
const { ListVPS } = new VirtualizorClient({
  host: '< IP or Hostname of Virtualizor Server >',
  port: 4085, // or 4085 for SSL
  adminapikey: "< Your API KEY >",
  adminapipass: "< Your API PASS >",
});

// Using const client = new VirtualizorClient({ ... }) is also valid, but you will have to use client.ListVPS() instead of ListVPS() which just looks ugly.
// Example: Get a list of all VPSs
ListVPS().then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});
```

# Event Handling Usage

VirtualizorJS uses the [EventEmitter](https://nodejs.org/api/events.html) class to handle events. You can attach **`Event Listeners`** to different events provided by the VirtualizorClient.

- Note: To use **`Event Listeners`** we need to define the **`VirtualizorClient`** as a `const` named preferably **`Client`** and then use **`Client.on()`** to attach **`Event Listeners`** to different events.

```javascript
const VirtualizorClient = require('virtualizorjs'); 

const Client = new VirtualizorClient({
  host: '< IP or Hostname of Virtualizor Server >',
  port: 4085,
  adminapikey: "< Your API KEY >",
  adminapipass: "< Your API PASS >",
});

//Get the methods you need
const { StartVPS } = Client;

// - Event Types - :
// 1. vpsCreated
// 2. vpsStarted
// 3. vpsStopped
// 4. vpsRestarted

// Event listener for when a virtual server is created
Client.on('vpsCreated', (response) => {
  console.log(`Virtual Server Created! Details:`, response);
});

// Event listener for when a virtual server is started
Client.on('vpsStarted', (response) => {
  console.log(`Virtual Server Started! Details:`, response);
});

// Event listener for when a virtual server is stopped
Client.on('vpsStopped', (response) => {
  console.log(`Virtual Server Stopped! Details:`, response);
});

// Event listener for when a virtual server is restarted
Client.on('vpsRestarted', (response) => {
  console.log(`Virtual Server Restarted! Details:`, response);
});
```

## ❓ What's the point of using **`Event Listeners`**?
 - **`Event Listeners`** are useful when you want to perform an action when a certain event occurs without modifying the source code of the **`VirtualizorJS`** library to avoid breaking changes.
 - For example, you can use **`Event Listeners`** to send a notification to your `users` when a event is triggered.
 - You can also use **`Event Listeners`** to perform an action when a event is triggered.

## Examples

- [Get VPS's List](/examples/listvps.js)
- [Create VPS](/examples/createvps.js)
- [Using Event Handling](/examples/eventhandling.js)


## Documentation

- Check the [Wiki](https://github.com/kkMihai/virtualizorjs/wiki) for detailed documentation.
- If you use frameworks such as [Next.js](https://nextjs.org/) make sure to use it only Server-Side for security reasons.

## Roadmap
  - [ ] Add Proxmox KVM Support
  - [ ] Add Virtualization Types enums

## Contributing

- Feel free to contribute by opening issues or submitting pull requests. See [CONTRIBUTING](/CONTRIBUTING.md) for details.

## License

- This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
