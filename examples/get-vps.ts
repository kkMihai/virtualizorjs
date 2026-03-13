import {
  VirtualizorApiError,
  createVirtualizorClient,
  formatIps,
} from 'virtualizorjs';

const client = createVirtualizorClient({
  host: 'your-server.example.com',
  apiKey: 'your-api-key',
  apiPass: 'your-api-pass',
});

async function main() {
  try {
    const vps = await client.vps.get({ vpsid: '22' });
    const ipsStr = formatIps(vps.ips, { as: 'string' });

    console.log(`  ID: ${vps.vpsid}`);
    console.log(`  Hostname: ${vps.hostname}`);
    console.log(`  OS: ${vps.os_name}`);
    console.log(`  Bandwidth: ${vps.bandwidth}`);
    console.log(`  Ips: ${ipsStr}`);
  } catch (error) {
      if (error instanceof VirtualizorApiError) {
          console.log(`Caught VirtualizorApiError: Code ${error.code}, Message: "${error.message}"`);
      }
  }
}

main();
