const VirtualizorClient = require('./src/VirtualizorClient'); 

const { ListVPS } = new VirtualizorClient({
  host: '185.16.39.103',
  port: 4083,
  key: "mUm60qJWSxAS7yMlO95e2jv3SHdQCykV",
  pass: 'OZFsgt6HcJom1aKZduIxnau4jj17bbY6',
});

async function exampleUsage() {
  try {
    const vpsList = await GetPlans();
    console.log(vpsList.time_taken);

  } catch (error) {
    console.error('Error:', error);
  }
}

exampleUsage();
