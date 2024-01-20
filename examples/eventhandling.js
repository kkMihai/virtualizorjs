const VirtualizorClient = require('virtualizorjs'); 

const { on: eventOn } = new VirtualizorClient({
  host: '< IP or Hostname of Virtualizor Server >',
  port: 4085,
  adminapikey: "< Your API KEY >",
  adminapipass: "< Your API PASS >",
});

// Event listener for when a virtual server is created
eventOn('vpsCreated', (response) => {
  console.log(`Virtual Server Created! Details:`, response);
  // Output: Virtual Server Created! Details: { ...virtualizorResponse }
});

// Event listener for when a virtual server is started
eventOn('vpsStarted', (response) => {
  console.log(`Virtual Server Started! Details:`, response);
  // Output: Virtual Server Started! Details: { ...virtualizorResponse }
});

// Event listener for when a virtual server is stopped
eventOn('vpsStopped', (response) => {
  console.log(`Virtual Server Stopped! Details:`, response);
    // Output: Virtual Server Stopped! Details: { ...virtualizorResponse }
});

// Event listener for when a virtual server is restarted
eventOn('vpsRestarted', (response) => {
  console.log(`Virtual Server Restarted! Details:`, response);
    // Output: Virtual Server Restarted! Details: { ...virtualizorResponse }
});