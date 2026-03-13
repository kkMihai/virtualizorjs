import { VirtualizorApiError } from 'virtualizorjs';
import { client } from './virtualizorclient';

async function main() {
  try {
    console.log('Creating VPS...');
    const result = await client.vps.create({
      hostname: 'example-vps',
      rootpass: 'SecurePassword123!',
      osid: 1,
    });

    console.log(`VPS creation task initiated: ${result.taskid}`);

    if (result.taskid) {
      console.log('Waiting for task completion...');
      const taskResult = await client.tasks.wait(result.taskid, {
        pollIntervalMs: 2000,
        timeoutMs: 60000,
      });

      console.log('Task completed successfully:', taskResult);
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
