import { VirtualizorApiError, createVirtualizorClient, formatIps } from 'virtualizorjs';

const client = createVirtualizorClient({
    host: '192.168.47.132',
    apiKey: 'sYGohFtyUOsosDVBjMqtTBKK3udU0GK0',
    apiPass: 'Zxoco6fgbyJTBG9HsS5YTH4VydRRoTiw',
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
