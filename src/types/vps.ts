import type { VirtType, VirtualizorResponse } from './common.js';

export interface VPS {
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

export interface ListVPSParams {
  user?: string | number;
  vpsid?: string | number;
  vpsname?: string;
  vpsip?: string;
  vpshostname?: string;
  vsstatus?: string;
  vstype?: VirtType;
  serid?: number;
  plid?: number;
  bpid?: number;
}

export interface CreateVPSParams {
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

export interface RebuildVPSParams {
  /** OS template ID to rebuild with */
  osid: number;
  /** New root password for the VPS */
  newpass: string;
  /** Must be set to 1 to confirm the rebuild */
  conf: 1;
  /** Format primary disk (0 = no, 1 = yes); defaults to 0 */
  format_primary?: 0 | 1;
  /** Send rebuild notification email (0 = no, 1 = yes) */
  eu_send_rebuild_email?: 0 | 1;
  /** Recipe ID to apply post-rebuild */
  recipe?: number;
  /** SSH key to inject */
  sshkey?: string;
}

export interface CloneVPSParams {
  /** Hostname for the new cloned VPS */
  hostname: string;
  /** Root password for the new cloned VPS */
  rootpass: string;
  /** Source server ID (server where the VPS lives) */
  from_server: number;
  /** Destination server ID (server to clone into) */
  to_server: number;
}

export interface MigrateVPSParams {
  /** Destination server ID */
  serid: number;
  /** Source server IP address */
  from_ip: string;
  /** Source server API/root password */
  from_pass: string;
  /** 0 = ignore VDF conflicts, 1 = error on conflict */
  ignore_if_vdfconflict?: 0 | 1;
  /** 0 = use gzip compression, 1 = disable gzip */
  disable_gzip?: 0 | 1;
  /** 0 = offline migration, 1 = live migration */
  online?: 0 | 1;
}

export interface VPSStatsResponse extends VirtualizorResponse {
  vs_stats?: unknown;
  vs_bandwidth?: unknown;
  time_taken?: string;
}

export interface VNCInfo extends VirtualizorResponse {
  novnc?: string;
  [key: string]: unknown;
}
