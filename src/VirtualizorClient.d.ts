declare module "virtualizorjs" {
  import { EventEmitter } from "events";

  interface StorageSpace {
    Size: number;
    st_uuid: string;
  }

  interface VirtualizorClientOptions {
    host: string;
    port: string;
    adminapikey: string;
    adminapipass: string;
    isRawResponse?: boolean;
  }

  interface CreateVPSParams {
    virtualizationType: string;
    nodeSelection: string;
    userEmail: string;
    userpassword: string;
    serverHostname: string;
    rootpassword: string;
    osId: string;
    ipAddress: string;
    storageSpace: StorageSpace | StorageSpace[];
    serverRam: string;
    bandwidthLimit: string;
    cpuCores: string;
  }

  interface VPSInfo {
    [vpsId: string]: {
      vpsid: string;
      vps_name: string;
      uuid: string;
      serid: number;
      time: string;
      edittime: string;
      virt: string;
      // more...
    };
  }

  interface DiskInfo {
    [path: string]: {
      limit: number;
      used: number;
      available: number;
      free: number;
      limit_gb: number;
      used_gb: number;
      actual_gb: number;
      free_gb: number;
      percent: number;
      percent_free: number;
    };
  }

  interface BandwidthInfo {
    limit: number;
    used: number;
    usage: { [key: string]: number };
    in: {
      usage: { [key: string]: number };
      used: number;
      limit: number;
      free: number;
      limit_gb: number;
      used_gb: number;
      free_gb: number;
      percent: number;
      percent_free: number;
    };
    out: {
      usage: { [key: string]: number };
      used: number;
      limit: number;
      free: number;
      limit_gb: number;
      used_gb: number;
      free_gb: number;
      percent: number;
      percent_free: number;
    };
    mdays: number[];
    limit_gb: number;
    free: number;
    free_gb: number;
    used_gb: number;
    percent: number;
    percent_free: number;
  }

  class VirtualizorClient extends EventEmitter {
    constructor(options: VirtualizorClientOptions);
    CreateVPS(params: CreateVPSParams): Promise<{ message: string; data: any }>;
    GetVPS(id: string): Promise<VPSInfo>;
    ListVPS(): Promise<any>;
    StartVPS(
      vpsId: string
    ): Promise<{ message: string; error: string | boolean }>;
    StopVPS(
      vpsId: string
    ): Promise<{ message: string; error: string | boolean }>;
    RestartVPS(
      vpsId: string
    ): Promise<{ message: string; error: string | boolean }>;
    GetVPSRam(vpsId: string): Promise<{ ram: any; time_taken: string }>;
    GetVPSCPU(vpsId: string): Promise<{ cpu: any; time_taken: string }>;
    GetVPSDisk(vpsId: string): Promise<{ info: DiskInfo; time_taken: string }>;
    GetVPSBandwidth(params: {
      vpsId: string;
      month: string;
    }): Promise<{ bandwidth: BandwidthInfo; time_taken: string }>;
    GetPlans(): Promise<{ plans: object; time_taken: string }>;
  }

  export = VirtualizorClient;
}
