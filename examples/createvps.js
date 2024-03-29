const VirtualizorClient = require("virtualizorjs");

const { CreateVPS } = new VirtualizorClient({
  host: "< IP or Hostname of Virtualizor Server >",
  port: 4085, // Default port for Virtualizor API
  adminapikey: "< Your API KEY >",
  adminapipass: "< Your API PASS >",
});

async function exampleUsage() {
  try {
     const vps = await CreateVPS({
      virtualizationType: "kvm",
      nodeSelection: "node1",
      userEmail: "user@example.com",
      userPassword: "password",
      serverHostname: "serverhostname",
      rootPassword: "password",
      osId: "222",
      ipAddress: "188.0.0.0",
      storageSpace: "10", // GB
      serverRam: "1024", // MB
      bandwidthLimit: "1000", // GB | 0 for unlimited
      cpuCores: "1",
    });

    console.log(vps); // Output: { time_taken: 0.022, ... }
  } catch (error) {
    console.error("Error:", error);
  }
}

exampleUsage();
