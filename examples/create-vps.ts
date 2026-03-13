import { createVirtualizorClient, VirtualizorApiError } from 'virtualizorjs';

const client = createVirtualizorClient({
  host: 'your-server.example.com',
  apiKey: 'your-api-key',
  apiPass: 'your-api-pass',
});

async function main() {
    try {
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
            console.log(`Caught VirtualizorApiError: Code ${error.code}, Message: "${error.message}"`);
        }
    }
}

main();
