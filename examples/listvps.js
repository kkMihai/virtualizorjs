const VirtualizorClient = require("virtualizorjs");

const { ListVPS } = new VirtualizorClient({
  host: "< IP or Hostname of Virtualizor Server >",
  port: 4083, // Default port for Virtualizor API
  key: "< Your API KEY >",
  pass: "< Your API PASS >",
});

async function exampleUsage() {
  try {
    const vpsList = await ListVPS();
    console.log(vpsList);
    //Output:
    // {
    //   "37": {
    //     "vpsid": "37",
    //     "vps_name": "v1001",
    //     "uuid": "mark7ygoeqtfdf72",
    //     "serid": 0,
    //     "time": "1534260671",
    //     "edittime": "1534499180",
    //     "virt": "kvm",
    //     "uid": "55",
    //     "plid": "1",
    //     "hostname": "www.mydomainff.com",
    //     "osid": "270",
    //     "os_name": "centos-6.5-x86",
    //     "iso": "",
    //     "sec_iso": "",
    //     "boot": "cda",
    //     "space": "2",
    //     "inodes": "0",
    //     "ram": "128",
    //     "burst": "0",
    //     "swap": "128",
    //     "cpu": "1000",
    //     "cores": "1",
    //     "cpupin": "-1",
    //     "cpu_percent": "0.00",
    //     "bandwidth": "1",
    //     "network_speed": "0",
    //     "upload_speed": "-1",
    //     "io": "0",
    //     "ubc": "a:0:{}",
    //     "acpi": "1",
    //     "apic": "1",
    //     "pae": "1",
    //     "shadow": "0",
    //     "vnc": "1",
    //     "vncport": "5901",
    //     "vnc_passwd": "",
    //     "hvm": "0",
    //     "suspended": "0",
    //     "suspend_reason": null,
    //     "nw_suspended": null,
    //     "rescue": "0",
    //     "band_suspend": "0",
    //     "tuntap": "0",
    //     "ppp": "0",
    //     "ploop": "0",
    //     "dns_nameserver": "a:0:{}",
    //     "osreinstall_limit": "0",
    //     "preferences": null,
    //     "nic_type": "virtio",
    //     "vif_type": "",
    //     "virtio": "0",
    //     "pv_on_hvm": "0",
    //     "disks": null,
    //     "kvm_cache": "0",
    //     "io_mode": "0",
    //     "cpu_mode": "default",
    //     "total_iops_sec": "0",
    //     "read_bytes_sec": "0",
    //     "write_bytes_sec": "0",
    //     "kvm_vga": "0",
    //     "acceleration": "0",
    //     "vnc_keymap": "en-us",
    //     "routing": "0",
    //     "mg": "",
    //     "used_bandwidth": "0.01",
    //     "cached_disk": "a:2:{s:4:\"disk\";a:3:{s:4:\"Used\";i:776044;s:9:\"Available\";i:1190036;s:4:\"Use%\";d:39.469999999999998863131622783839702606201171875;}s:5:\"inode\";a:4:{s:6:\"Inodes\";i:122880;s:5:\"IUsed\";i:21323;s:5:\"IFree\";i:101557;s:4:\"Use%\";d:17.35000000000000142108547152020037174224853515625;}}",
    //     "webuzo": "0",
    //     "disable_ebtables": "0",
    //     "install_xentools": "0",
    //     "admin_managed": "0",
    //     "rdp": "0",
    //     "topology_sockets": "0",
    //     "topology_cores": "0",
    //     "topology_threads": "0",
    //     "mac": "00:16:3e:5f:cd:48",
    //     "notes": null,
    //     "disable_nw_config": "0",
    //     "locked": "",
    //     "openvz_features": "",
    //     "speed_cap": "",
    //     "numa": "0",
    //     "bpid": "0",
    //     "bserid": "0",
    //     "timezone": null,
    //     "usbdevice": "",
    //     "server_name": "localhost",
    //     "email": "tt@rrr.com",
    //     "pid": "0",
    //     "type": "0",
    //     "os_distro": "centos",
    //     "ips": {
    //       "2": "8.8.8.1"
    //     }
    //   }
    // }
  } catch (error) {
    console.error("Error:", error);
  }
}

exampleUsage();