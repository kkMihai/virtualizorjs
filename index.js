const VirtualizorClient = require('./src/VirtualizorClient'); 

// We define the "on" method as "eventOn" to avoid confusion with the EventEmitter's "on" method.

// The "eventOn" method is used to attach event listeners to different events provided by the VirtualizorClient.
const { on: eventOn } = new VirtualizorClient({
  host: '< IP or Hostname of Virtualizor Server >',
  port: 4083,
  key: "< Your API KEY >",
  pass: "< Your API PASS >",
});

// - Event Types :
// 1. vpsCreated
// 2. vpsStarted
// 3. vpsStopped
// 4. vpsRestarted


// Event listener for when a virtual server is created
eventOn('vpsCreated', (response) => {
  console.log(`Virtual Server Created! Details:`, response);
});

// Event listener for when a virtual server is started
eventOn('vpsStarted', (response) => {
  console.log(`Virtual Server Started! Details:`, response);
});

// Event listener for when a virtual server is stopped
eventOn('vpsStopped', (response) => {
  console.log(`Virtual Server Stopped! Details:`, response);
});

// Event listener for when a virtual server is restarted
eventOn('vpsRestarted', (response) => {
  console.log(`Virtual Server Restarted! Details:`, response);
});