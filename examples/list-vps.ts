import { VirtualizorApiError, createVirtualizorClient, formatIps } from 'virtualizorjs';

const client = createVirtualizorClient({
    host: process.env.VIRTUALIZOR_HOST ?? "your-virtualizor-host.com",
    apiKey: process.env.VIRTUALIZOR_API_KEY ?? "your-api-key",
    apiPass: process.env.VIRTUALIZOR_API_PASS ?? "your-api-pass",
});

async function main() {
    try {
    const vpsList = await client.vps.list();

    console.log('VPS Instances:');
    for (const [vpsid, vps] of Object.entries(vpsList)) {
      console.log(`  ${vpsid}: ${vps.hostname}`);
      console.log(`    OS: ${vps.os_name}`);
      console.log(`    Bandwidth: ${vps.bandwidth}`);
      console.log(`    IPs: ${formatIps(vps.ips)} `);
    }
    } catch (error) {
        if (error instanceof VirtualizorApiError) {
            console.log(`Caught VirtualizorApiError: Code ${error.code}, Message: "${error.message}"`);
        }
    }
}

main();
