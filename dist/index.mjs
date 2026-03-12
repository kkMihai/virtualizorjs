import http from 'http';
import https from 'https';
import crypto from 'crypto';

// src/http.ts
function generateSignature(apiKey, apiPass, params) {
  const sorted = Object.keys(params).filter((k) => params[k] !== void 0).sort().map((k) => `${k}${params[k]}`).join("");
  return crypto.createHash("sha256").update(apiKey + apiPass + sorted).digest("hex");
}
function buildQueryString(params, apiKey, apiPass) {
  const clean = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== void 0) {
      clean[key] = value;
    }
  }
  const sig = generateSignature(apiKey, apiPass, clean);
  const urlParams = new URLSearchParams();
  urlParams.set("api", "json");
  urlParams.set("api_key", apiKey);
  urlParams.set("api_sig", sig);
  for (const [key, value] of Object.entries(clean)) {
    urlParams.set(key, String(value));
  }
  return `?${urlParams.toString()}`;
}

// src/http.ts
var VirtualizorApiError = class extends Error {
  code;
  constructor(message, code) {
    super(message);
    this.name = "VirtualizorApiError";
    this.code = code;
  }
};
var HttpClient = class {
  constructor(config) {
    this.config = config;
  }
  parseResponse(data) {
    if (data.error && data.error.length > 0) {
      const first = data.error[0];
      if (first) {
        throw new VirtualizorApiError(first.msg, first.code);
      }
    }
    return data;
  }
  async request(act, queryParams = {}, bodyParams = {}) {
    const allQueryParams = { act, ...queryParams };
    const qs = buildQueryString(allQueryParams, this.config.apiKey, this.config.apiPass);
    const path = `/index.php${qs}`;
    const bodyString = Object.entries(bodyParams).filter(([, v]) => v !== void 0).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
    const data = await this.rawRequest(path, bodyString || void 0);
    return this.parseResponse(data);
  }
  rawRequest(path, body) {
    const transport = this.config.https ? https : http;
    const options = {
      host: this.config.host,
      port: this.config.port,
      path,
      method: body ? "POST" : "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...body ? { "Content-Length": Buffer.byteLength(body) } : {}
      },
      ...this.config.https ? { agent: new https.Agent({ rejectUnauthorized: this.config.rejectUnauthorized }) } : {}
    };
    return new Promise((resolve, reject) => {
      const req = transport.request(options, (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk.toString();
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            reject(new Error(`Failed to parse response: ${raw.slice(0, 200)}`));
          }
        });
      });
      req.setTimeout(this.config.timeout, () => {
        req.destroy(new Error(`Request timed out after ${this.config.timeout}ms`));
      });
      req.on("error", reject);
      if (body) {
        req.write(body);
      }
      req.end();
    });
  }
};

// src/resources/plans.ts
var PlansResource = class {
  constructor(http2) {
    this.http = http2;
  }
  async list() {
    const res = await this.http.request("plans", {}, {});
    return res.plans;
  }
  async create(params) {
    return this.http.request("addplan", {}, params);
  }
  async delete(planId) {
    return this.http.request("deleteplan", {}, { plid: planId });
  }
};

// src/resources/tasks.ts
var TasksResource = class {
  constructor(http2) {
    this.http = http2;
  }
  async get(taskId) {
    const res = await this.http.request("tasks", { taskid: taskId }, {});
    return res.tasks[taskId];
  }
  async wait(taskId, options = {}) {
    const { pollIntervalMs = 2e3, timeoutMs = 12e4 } = options;
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const task = await this.get(taskId);
      if (!task) throw new Error(`Task ${taskId} not found`);
      if (task.status === "1" || task.status === "done") return task;
      if (task.status === "error" || task.status === "-1") {
        throw new Error(`Task ${taskId} failed`);
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }
    throw new Error(`Task ${taskId} timed out after ${timeoutMs}ms`);
  }
};

// src/resources/users.ts
var UsersResource = class {
  constructor(http2) {
    this.http = http2;
  }
  async list() {
    const res = await this.http.request("users", {}, {});
    return res.users;
  }
  async create(params) {
    return this.http.request("adduser", {}, params);
  }
  async delete(uid) {
    return this.http.request("deleteuser", {}, { uid });
  }
  async suspend(uid) {
    return this.http.request("usersuspend", {}, { uid });
  }
  async unsuspend(uid) {
    return this.http.request("userunsuspend", {}, { uid });
  }
};

// src/resources/vps.ts
var VpsResource = class {
  constructor(http2) {
    this.http = http2;
  }
  async list() {
    const res = await this.http.request("listvs", {}, {});
    return res.vs;
  }
  async get(vpsId) {
    const res = await this.http.request("vs", { vpsid: vpsId }, {});
    const vps = res.vs[vpsId];
    if (!vps) throw new Error(`VPS ${vpsId} not found in response`);
    return vps;
  }
  async create(params) {
    return this.http.request("addvs", {}, params);
  }
  async delete(vpsId) {
    return this.http.request("deletevs", {}, { vpsid: vpsId });
  }
  async start(vpsId) {
    return this.http.request("vs", { vpsid: vpsId }, { action: "start" });
  }
  async stop(vpsId) {
    return this.http.request("vs", { vpsid: vpsId }, { action: "stop" });
  }
  async restart(vpsId) {
    return this.http.request("vs", { vpsid: vpsId }, { action: "restart" });
  }
  async poweroff(vpsId) {
    return this.http.request("vs", { vpsid: vpsId }, { action: "poweroff" });
  }
  async suspend(vpsId) {
    return this.http.request("suspendvs", {}, { vpsid: vpsId });
  }
  async unsuspend(vpsId) {
    return this.http.request("unsuspendvs", {}, { vpsid: vpsId });
  }
  async rebuild(vpsId, params) {
    return this.http.request("rebuild", {}, { vpsid: vpsId, ...params });
  }
  async clone(vpsId, params) {
    return this.http.request("clone", {}, { vpsid: vpsId, ...params });
  }
  async migrate(vpsId, params) {
    return this.http.request("migrate", {}, { vpsid: vpsId, ...params });
  }
  async status(vpsId) {
    return this.http.request("vstatus", { vpsid: vpsId }, {});
  }
  async vnc(vpsId) {
    return this.http.request("vnc", { vpsid: vpsId }, {});
  }
  async stats(vpsId) {
    return this.http.request("vpsstatistics", { vpsid: vpsId }, {});
  }
};

// src/client.ts
var VirtualizorClient = class {
  vps;
  users;
  plans;
  tasks;
  constructor(config) {
    const resolved = {
      host: config.host,
      apiKey: config.apiKey,
      apiPass: config.apiPass ?? "",
      port: config.port ?? 4085,
      https: config.https ?? true,
      rejectUnauthorized: config.rejectUnauthorized ?? false,
      timeout: config.timeout ?? 3e4
    };
    const http2 = new HttpClient(resolved);
    this.vps = new VpsResource(http2);
    this.users = new UsersResource(http2);
    this.plans = new PlansResource(http2);
    this.tasks = new TasksResource(http2);
  }
};
function createVirtualizorClient(config) {
  return new VirtualizorClient(config);
}

export { VirtualizorApiError, VirtualizorClient, createVirtualizorClient };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map