# VirtualizorJS

Since there is no SDK's for Node.js for the Virtualizor API, I decided to create one, and one that is actually easy to use and useful with **0 Dependencies** keeping it lightweight and fast.

VirtualizorJS simplifies the management of Virtualizor servers with a streamlined and developer-friendly API for Node.js. Perform actions such as creating, starting, stopping, and restarting virtual servers effortlessly. Ideal for seamless integration into your Node.js applications, providing a powerful toolkit for Virtualizor server management.

[![npm version](https://badge.fury.io/js/virtualizorjs.svg)](https://badge.fury.io/js/virtualizorjs)

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [API Documentation](#api-documentation)
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
const { ListVPS  } = new VirtualizorClient({
  host: '< IP or Hostname of Virtualizor Server >',
  port: 4083,
  key: "< Your API KEY >",
  pass: "< Your API PASS >",
});


// Example: Get a list of all VPSs
ListVPS().then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});

```

## Examples

- [Get VPS's List](/examples/listvps.js)
- [Create VPS](/examples/createvps.js)


## API Documentation

- Check the [Wiki](https://github.com/kkMihai/virtualizorjs/wiki/VirtualizorClient-Class) for detailed documentation.

## Contributing

- Feel free to contribute by opening issues or submitting pull requests. See [CONTRIBUTING.md](/CONTRIBUTING.md) for details.

## License

- This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.