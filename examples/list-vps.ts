import { createVirtualizorClient, VirtualizorApiError } from 'virtualizorjs';

const client = createVirtualizorClient({
  host: 'your-server.example.com',
  apiKey: 'your-api-key',
  apiPass: 'your-api-pass',
});

async function main() {
  try {
    const vpsList = await client.vps.list();

    console.log('VPS Instances:');
    Object.entries(vpsList).forEach(([vpsid, vps]) => {
      console.log(`  ${vpsid}: ${vps.hostname}`);
    });
  } catch (error) {
    if (error instanceof VirtualizorApiError) {
      console.error(`API Error [${error.code}]: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main();
