import type { VirtType } from './common.js';

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
  osid: number;
  rootpass: string;
}

export interface CloneVPSParams {
  hostname: string;
  rootpass: string;
}

export interface MigrateVPSParams {
  serid: number;
  online?: 0 | 1;
}

export interface VPSStatsResponse {
  cpu?: unknown;
  ram?: unknown;
  disk?: unknown;
  bandwidth?: unknown;
  time_taken?: string;
}

export interface VNCInfo {
  novnc?: string;
  [key: string]: unknown;
}
