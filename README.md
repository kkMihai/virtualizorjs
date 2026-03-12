# VirtualizorJS

[![npm version](https://img.shields.io/npm/v/virtualizorjs)](https://www.npmjs.com/package/virtualizorjs)
[![CI Status](https://img.shields.io/github/actions/workflow/status/kkMihai/virtualizorjs/ci.yml?branch=main)](https://github.com/kkMihai/virtualizorjs/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **TypeScript-first** SDK for the [Virtualizor](https://www.virtualizor.com/) server management API. Manage VPS instances, users, and plans with a clean, namespaced interface and zero production dependencies.

## Features

- ✅ **TypeScript-first**: Full type safety and IDE autocomplete
- ✅ **Namespaced API**: Logical organization (`client.vps.*`, `client.users.*`, `client.plans.*`, `client.tasks.*`)
- ✅ **SHA-256 Authentication**: Secure API communication
- ✅ **Zero Production Dependencies**: Lightweight and fast
- ✅ **Async Task Polling**: Built-in support for long-running operations
- ✅ **Self-signed SSL Ready**: Pre-configured for Virtualizor's typical certificate setup
- ✅ **Dual Output**: Outputs both CommonJS and ESM modules

## Installation

**npm:**
```bash
npm install virtualizorjs
```

**bun:**
```bash
bun add virtualizorjs
```

## Quick Start

### Create a Client

```typescript
import { createVirtualizorClient } from 'virtualizorjs';

const client = createVirtualizorClient({
  host: 'virtualizor.example.com',
  apiKey: 'your-api-key',
  apiPass: 'your-api-pass',
  // Optional: port (default 4085), https (default true), 
  // rejectUnauthorized (default false), timeout (default 30000ms)
  // 4085 for Https, 4084 for Http
});
```

### List All VPS

```typescript
const vpsList = await client.vps.list();

for (const [vpsId, vps] of Object.entries(vpsList)) {
  console.log(`${vpsId}: ${vps.hostname} (${vps.status})`);
}
```

### Start a VPS and Wait for Completion

Many Virtualizor operations are asynchronous. Use `client.tasks.wait()` to poll for completion:

```typescript
const result = await client.vps.start('123');
const task = await client.tasks.wait(result.taskid!);

console.log(`VPS started! Task status: ${task.status}`);
```

## Error Handling

All SDK errors are instances of `VirtualizorApiError`. Catch and inspect them:

```typescript
import { VirtualizorApiError } from 'virtualizorjs';

try {
  await client.vps.start('invalid-id');
} catch (err) {
  if (err instanceof VirtualizorApiError) {
    console.error(`API Error [${err.code}]: ${err.message}`);
  } else {
    console.error('Unexpected error:', err);
  }
}
```

## API Reference

### VPS Management

| Method | Parameters | Returns | Notes |
|--------|-----------|---------|-------|
| `list()` | — | `Record<string, VPS>` | List all VPS |
| `get(vpsId)` | `vpsId: string` | `VPS` | Get a single VPS |
| `create(params)` | `CreateVPSParams` | `AsyncTaskResult` | Async |
| `delete(vpsId)` | `vpsId: string` | `AsyncTaskResult` | Async |
| `start(vpsId)` | `vpsId: string` | `AsyncTaskResult` | Async |
| `stop(vpsId)` | `vpsId: string` | `AsyncTaskResult` | Async |
| `restart(vpsId)` | `vpsId: string` | `AsyncTaskResult` | Async |
| `poweroff(vpsId)` | `vpsId: string` | `AsyncTaskResult` | Async |
| `suspend(vpsId)` | `vpsId: string` | `AsyncTaskResult` | Async |
| `unsuspend(vpsId)` | `vpsId: string` | `AsyncTaskResult` | Async |
| `rebuild(vpsId, params)` | `vpsId: string, RebuildVPSParams` | `AsyncTaskResult` | Async |
| `clone(vpsId, params)` | `vpsId: string, CloneVPSParams` | `AsyncTaskResult` | Async |
| `migrate(vpsId, params)` | `vpsId: string, MigrateVPSParams` | `AsyncTaskResult` | Async |
| `status(vpsId)` | `vpsId: string` | `unknown` | Current status snapshot |
| `vnc(vpsId)` | `vpsId: string` | `VNCInfo` | Get VNC connection details |
| `stats(vpsId)` | `vpsId: string` | `VPSStatsResponse` | Get resource usage statistics |

### User Management

| Method | Parameters | Returns | Notes |
|--------|-----------|---------|-------|
| `list()` | — | `Record<string, User>` | List all users |
| `create(params)` | `CreateUserParams` | `AsyncTaskResult` | Async |
| `delete(uid)` | `uid: string` | `AsyncTaskResult` | Async |
| `suspend(uid)` | `uid: string` | `AsyncTaskResult` | Async |
| `unsuspend(uid)` | `uid: string` | `AsyncTaskResult` | Async |

### Plan Management

| Method | Parameters | Returns | Notes |
|--------|-----------|---------|-------|
| `list()` | — | `Record<string, Plan>` | List all plans |
| `create(params)` | `CreatePlanParams` | `AsyncTaskResult` | Async |
| `delete(planId)` | `planId: string` | `AsyncTaskResult` | Async |

### Task Polling

| Method | Parameters | Returns | Notes |
|--------|-----------|---------|-------|
| `get(taskId)` | `taskId: string` | `Task \| undefined` | Get task status once |
| `wait(taskId, options?)` | `taskId: string, { pollIntervalMs?, timeoutMs? }?` | `Promise<Task>` | Poll until complete or timeout |

## Task Polling Pattern

Many API calls return `AsyncTaskResult` with a `taskid` field. Poll for completion:

```typescript
// Example: Create a VPS and wait for it to be ready
const createResult = await client.vps.create({
  hostname: 'my-vps.example.com',
  // ... other params
});

const completedTask = await client.tasks.wait(createResult.taskid!, {
  pollIntervalMs: 5000,  // Check every 5 seconds (default: 2000ms)
  timeoutMs: 300000,     // Give up after 5 minutes (default: 120000ms)
});

if (completedTask.status === '1' || completedTask.status === 'done') {
  console.log('VPS creation completed successfully');
}
```

## Configuration

When creating a client, the following options are available:

```typescript
interface VirtualizorConfig {
  host: string;                      // Virtualizor server hostname or IP
  apiKey: string;                    // API key from Virtualizor panel
  apiPass: string;                   // API password from Virtualizor panel
  port?: number;                     // Server port (default: 4085)
  https?: boolean;                   // Use HTTPS (default: true)
  rejectUnauthorized?: boolean;      // Reject self-signed certs (default: false)
  timeout?: number;                  // Request timeout in ms (default: 30000)
}
```

### Self-Signed SSL Certificates

Virtualizor typically uses self-signed SSL certificates. The SDK handles this by default with `rejectUnauthorized: false`. If you need to enforce certificate validation, set `rejectUnauthorized: true` and ensure your Virtualizor instance has a valid certificate.

## TypeScript Types

All resources are fully typed. Import types as needed:

```typescript
import type {
  VPS,
  CreateVPSParams,
  RebuildVPSParams,
  CloneVPSParams,
  MigrateVPSParams,
  User,
  CreateUserParams,
  Plan,
  CreatePlanParams,
  Task,
  AsyncTaskResult,
} from 'virtualizorjs';
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to help.

## Security

Please report security vulnerabilities to the maintainers privately. See [SECURITY.md](./SECURITY.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

**Author**: [kkMihai](https://github.com/kkMihai)  
**Package**: [npm/virtualizorjs](https://www.npmjs.com/package/virtualizorjs)  
**Repository**: [github.com/kkMihai/virtualizorjs](https://github.com/kkMihai/virtualizorjs)
