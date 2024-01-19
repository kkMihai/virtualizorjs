const VirtualizorClient = require("virtualizorjs");

const { ListVPS } = new VirtualizorClient({
  host: "< IP or Hostname of Virtualizor Server >",
  port: 4083, // Default port for Virtualizor API
  key: "< Your API KEY >",
  pass: "< Your API PASS >",
});

async function exampleUsage() {
  try {
    const vpsList = await ListVPS();
    console.log(vpsList.time_taken);
    //Output: 0.022
  } catch (error) {
    console.error("Error:", error);
  }
}

exampleUsage();