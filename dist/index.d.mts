interface VirtualizorError {
    code: number;
    msg: string;
}
interface VirtualizorResponse {
    title?: string;
    timenow?: number;
    time_taken?: string;
    error?: VirtualizorError[];
}
interface AsyncTaskResult extends VirtualizorResponse {
    done?: 1;
    taskid?: string;
}
type VirtType = 'kvm' | 'xen' | 'openvz' | 'lxc' | 'proxmox' | 'virtuozzo' | 'xcp' | 'hyperv';

interface VirtualizorConfig {
    host: string;
    apiKey: string;
    apiPass?: string;
    port?: number;
    https?: boolean;
    rejectUnauthorized?: boolean;
    timeout?: number;
}
interface ResolvedConfig {
    host: string;
    apiKey: string;
    apiPass: string;
    port: number;
    https: boolean;
    rejectUnauthorized: boolean;
    timeout: number;
}

declare class VirtualizorApiError extends Error {
    readonly code: number;
    constructor(message: string, code: number);
}
type Params = Record<string, string | number | undefined>;
declare class HttpClient {
    private readonly config;
    constructor(config: ResolvedConfig);
    parseResponse<T extends VirtualizorResponse>(data: T): T;
    request<T extends VirtualizorResponse>(act: string, queryParams?: Params, bodyParams?: Params): Promise<T>;
    private rawRequest;
}

interface Plan {
    pid: string;
    plan_name: string;
    disk: string;
    ram: string;
    bandwidth: string;
    cpu: string;
    virt?: string;
}
interface CreatePlanParams {
    plan_name: string;
    disk: number;
    ram: number;
    bandwidth: number;
    cpu: number;
    virt?: string;
}

declare class PlansResource {
    private readonly http;
    constructor(http: HttpClient);
    list(): Promise<Record<string, Plan>>;
    create(params: CreatePlanParams): Promise<AsyncTaskResult>;
    delete(planId: string): Promise<AsyncTaskResult>;
}

interface Task {
    id: string;
    action: string;
    status: string;
    vpsid?: string;
    data?: unknown;
}

declare class TasksResource {
    private readonly http;
    constructor(http: HttpClient);
    get(taskId: string): Promise<Task | undefined>;
    wait(taskId: string, options?: {
        pollIntervalMs?: number;
        timeoutMs?: number;
    }): Promise<Task>;
}

interface User {
    uid: string;
    email: string;
    fname?: string;
    lname?: string;
    status: string;
    type: string;
}
interface CreateUserParams {
    email: string;
    password: string;
    fname?: string;
    lname?: string;
    acttype?: number;
}

declare class UsersResource {
    private readonly http;
    constructor(http: HttpClient);
    list(): Promise<Record<string, User>>;
    create(params: CreateUserParams): Promise<AsyncTaskResult>;
    delete(uid: string): Promise<AsyncTaskResult>;
    suspend(uid: string): Promise<AsyncTaskResult>;
    unsuspend(uid: string): Promise<AsyncTaskResult>;
}

interface VPS {
    vpsid: string;
    hostname: string;
    status: string;
    ram: string;
    hdd: string;
    bandwidth: string;
    os_name: string;
    ip: string;
    serid?: string;
    virt?: VirtType;
    cpu?: string;
}
interface CreateVPSParams {
    hostname: string;
    rootpass: string;
    osid: number;
    plid?: number;
    user_email?: string;
    ips?: number;
    ips_int?: number;
    space?: number;
    ram?: number;
    burst?: number;
    bandwidth?: number;
    cpu?: number;
    cpu_percent?: number;
    virt?: VirtType;
    serid?: number;
    node_select?: 0 | 1;
    recipe?: number;
    sshkey?: string;
    nopassword?: 0 | 1;
}
interface RebuildVPSParams {
    osid: number;
    rootpass: string;
}
interface CloneVPSParams {
    hostname: string;
    rootpass: string;
}
interface MigrateVPSParams {
    serid: number;
    online?: 0 | 1;
}
interface VPSStatsResponse extends VirtualizorResponse {
    cpu?: unknown;
    ram?: unknown;
    disk?: unknown;
    bandwidth?: unknown;
    time_taken?: string;
}
interface VNCInfo extends VirtualizorResponse {
    novnc?: string;
    [key: string]: unknown;
}

declare class VpsResource {
    private readonly http;
    constructor(http: HttpClient);
    list(): Promise<Record<string, VPS>>;
    get(vpsId: string): Promise<VPS>;
    create(params: CreateVPSParams): Promise<AsyncTaskResult>;
    delete(vpsId: string): Promise<AsyncTaskResult>;
    start(vpsId: string): Promise<AsyncTaskResult>;
    stop(vpsId: string): Promise<AsyncTaskResult>;
    restart(vpsId: string): Promise<AsyncTaskResult>;
    poweroff(vpsId: string): Promise<AsyncTaskResult>;
    suspend(vpsId: string): Promise<AsyncTaskResult>;
    unsuspend(vpsId: string): Promise<AsyncTaskResult>;
    rebuild(vpsId: string, params: RebuildVPSParams): Promise<AsyncTaskResult>;
    clone(vpsId: string, params: CloneVPSParams): Promise<AsyncTaskResult>;
    migrate(vpsId: string, params: MigrateVPSParams): Promise<AsyncTaskResult>;
    status(vpsId: string): Promise<unknown>;
    vnc(vpsId: string): Promise<VNCInfo>;
    stats(vpsId: string): Promise<VPSStatsResponse>;
}

declare class VirtualizorClient {
    readonly vps: VpsResource;
    readonly users: UsersResource;
    readonly plans: PlansResource;
    readonly tasks: TasksResource;
    constructor(config: VirtualizorConfig);
}
declare function createVirtualizorClient(config: VirtualizorConfig): VirtualizorClient;

export { type AsyncTaskResult, type CloneVPSParams, type CreatePlanParams, type CreateUserParams, type CreateVPSParams, type MigrateVPSParams, type Plan, type RebuildVPSParams, type Task, type User, type VPS, type VirtType, VirtualizorApiError, VirtualizorClient, type VirtualizorConfig, createVirtualizorClient };
