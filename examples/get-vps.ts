import { createVirtualizorClient, VirtualizorApiError } from 'virtualizorjs';

const client = createVirtualizorClient({
  host: 'your-server.example.com',
  apiKey: 'your-api-key',
  apiPass: 'your-api-pass',
});

async function main() {
  try {
    const vps = await client.vps.get(
      "2"
    );

    console.log(`  ID: ${vps.vpsid}`);
    console.log(`  Hostname: ${vps.hostname}`);
    console.log(`  OS: ${vps.os_name}`);
    console.log(`  Bandwidth: ${vps.bandwidth}`);

    // `ips` can be returned in multiple shapes by the API: an array of strings,
    // an object map (e.g. {"2": "192.168.47.130"}), a single string, or undefined.
    const rawIps = vps?.ips as unknown;
    let ipsStr = '';
    if (Array.isArray(rawIps)) {
      ipsStr = (rawIps as string[]).join(', ');
    } else if (rawIps && typeof rawIps === 'object') {
      ipsStr = Object.values(rawIps as Record<string, string>).join(', ');
    } else if (typeof rawIps === 'string') {
      ipsStr = rawIps;
    }

    console.log(`  Ips: ${ipsStr}`);
  } catch (error) {
    if (error instanceof VirtualizorApiError) {
      console.error(`API Error [${error.code}]: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main();
