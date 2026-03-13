import {
  VirtualizorApiError,
  createVirtualizorClient,
  formatIps,
} from 'virtualizorjs';

const client = createVirtualizorClient({
  host: '192.168.47.132',
  apiKey: 'sYGohFtyUOsosDVBjMqtTBKK3udU0GK0',
  apiPass: 'Zxoco6fgbyJTBG9HsS5YTH4VydRRoTiw',
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
