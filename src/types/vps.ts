import type { VirtType, VirtualizorResponse } from './common.js';

export interface VPSData {
  os_type?: number | string;
  rtc?: number | string;
  unprivileged?: number | string;
  vnc_auto_port?: number | string;
  nested_virt?: number | string;
  vga_vram?: number | string;
  discard?: number | string;
  vlan_tag?: number | string;
  enable_guest_agent?: number | string;
  ssd_emulation?: number | string;
  machine_type?: number | string;
  bios?: string;
  enable_tpm?: number | string;
  disable_password?: string;
  ssh_options?: string;
  added_keys?: unknown[];
  io_uring?: number | string;
  min_ram?: number | string;
  vga?: number | string;
  vga_memory?: number | string;
  cpu_flags?: number | string;
  scsi_controller?: number | string;
  demo?: string | null;
  enable_cpu_threshold?: number | string;
  cpu_threshold?: number | string;
  cpu_threshold_time?: number | string;
  disable_guest_agent?: number | string;
  disable_autostart?: number | string;
  iothread?: number | string;
  nesting?: number | string;
  suspended_time?: number | string;
  multiqueue?: number | string;
  freeze_fs_on_backup?: number | string;
  enable_ver_scaling?: number | string;
  ver_max_ram?: string | number;
  ver_ram_threshold?: string | number;
  ver_ram_inc_by?: string | number;
  ver_max_cpu?: string | number;
  ver_cpu_threshold?: string | number;
  ver_cpu_inc_by?: string | number;
  random_ipv6?: number | string;
  encrypted_pass?: number | string;
  vm_admin_name?: string;
  crypted_pass?: string | null;
  crypted_salt?: string | null;
  custom_ipv6_on_edit?: number | string;
  docker_info?: unknown | null;
}

export interface VPS {
  vpsid: string;
  vps_name?: string;
  uuid?: string;
  serid?: string | number;
  time?: string | number;
  edittime?: string | number;
  virt?: VirtType | string;
  uid?: string | number;
  plid?: string | number;
  hostname: string;
  osid?: string | number;
  os_name: string;
  iso?: string;
  sec_iso?: string;
  boot?: string;
  space?: string | number;
  inodes?: string | number;
  ram: string;
  burst?: string | number;
  swap?: string | number;
  cpu?: string | number;
  cores?: string | number;
  cpupin?: string | number;
  cpu_percent?: string | number;
  bandwidth: string;
  network_speed?: string | number;
  upload_speed?: string | number;
  io?: string | number;
  ubc?: string;
  acpi?: string | number;
  apic?: string | number;
  pae?: string | number;
  shadow?: string | number;
  vnc?: string | number;
  vncport?: string | number;
  vnc_passwd?: string;
  hvm?: string | number;
  suspended?: string | number;
  suspend_reason?: string | null;
  nw_suspended?: string | null;
  rescue?: string | number;
  band_suspend?: string | number;
  tuntap?: string | number;
  ppp?: string | number;
  ploop?: string | number;
  dns_nameserver?: string;
  osreinstall_limit?: string | number;
  preferences?: unknown | null;
  nic_type?: string;
  vif_type?: string;
  virtio?: string | number;
  pv_on_hvm?: string | number;
  disks?: unknown | null;
  kvm_cache?: string | number;
  io_mode?: string | number;
  cpu_mode?: string;
  total_iops_sec?: string | number;
  read_bytes_sec?: string | number;
  write_bytes_sec?: string | number;
  kvm_vga?: string | number;
  acceleration?: string | number;
  vnc_keymap?: string;
  routing?: string | number;
  mg?: string;
  used_bandwidth?: string | number;
  cached_disk?: unknown;
  webuzo?: string | number;
  disable_ebtables?: string | number;
  install_xentools?: string | number;
  admin_managed?: string | number;
  rdp?: string | number;
  topology_sockets?: string | number;
  topology_cores?: string | number;
  topology_threads?: string | number;
  mac?: string;
  notes?: string | null;
  disable_nw_config?: string | number;
  locked?: string;
  openvz_features?: string;
  speed_cap?: string;
  numa?: string | number;
  bpid?: string | number;
  bserid?: string | number;
  timezone?: string | null;
  ha?: string | number;
  load_balancer?: string | number;
  data?: VPSData;
  fwid?: string | number;
  admin_fwid?: string | number;
  current_resource?: unknown | null;
  plan_expiry?: string | number;
  machine_status?: string | number;
  tags?: string | null;
  server_name?: string;
  email?: string;
  pid?: string | number;
  type?: string | number;
  os_distro?: string;
  stid?: number[];
  ips?: Record<string, string>;
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
  [key: string]: unknown;
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
  [key: string]: unknown;
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

// virtualizor api is so shit omfg
