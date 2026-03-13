import { createVirtualizorClient, VirtualizorApiError } from 'virtualizorjs';

const client = createVirtualizorClient({
  host: 'your-server.example.com',
  apiKey: 'your-api-key',
  apiPass: 'your-api-pass',
});

async function main() {
    try  {
    const result = await client.vps.start('1');

    const taskId = result.taskid;
    if (!taskId) {
      console.log('No task ID returned');
      return;
    }

    console.log(`Task ID: ${taskId}`);
    console.log('Polling with custom intervals (500ms poll, 30s timeout)...');

    const taskResult = await client.tasks.wait(taskId, {
      pollIntervalMs: 500,
      timeoutMs: 30000,
    });

    console.log('VPS start task completed:', taskResult);
    } catch (error) {
        if (error instanceof VirtualizorApiError) {
            console.log(`Caught VirtualizorApiError: Code ${error.code}, Message: "${error.message}"`);
        }
    }
}

main();
