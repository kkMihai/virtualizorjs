import { createVirtualizorClient, VirtualizorApiError } from 'virtualizorjs';

const client = createVirtualizorClient({
    host: process.env.VIRTUALIZOR_HOST ?? "your-virtualizor-host.com",
    apiKey: process.env.VIRTUALIZOR_API_KEY ?? "your-api-key",
    apiPass: process.env.VIRTUALIZOR_API_PASS ?? "your-api-pass",
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
