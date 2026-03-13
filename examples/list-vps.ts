import { VirtualizorApiError } from 'virtualizorjs';
import { formatIps } from '../src';
import { client } from './virtualizorclient';

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
      console.error(`API Error [${error.code}]: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main();
