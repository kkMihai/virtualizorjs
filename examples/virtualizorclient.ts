import { createVirtualizorClient } from 'virtualizorjs';

export const client = createVirtualizorClient({
  host: 'your-server.example.com',
  apiKey: 'your-api-key',
  apiPass: 'your-api-pass',
});
