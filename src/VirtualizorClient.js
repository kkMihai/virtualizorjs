const https = require("https");
const { URLSearchParams } = require("url");
const EventEmitter = require("events");

/**
 * @description - This class contains some the actions supported by Virtualizor API
 * @class Actions
 * @static
 * @readonly
 * @memberof VirtualizorClient
 * @enum {string}
 */

const Actions = require("./actions");

/**
 * @class VirtualizorClient
 * @description - This class is used to make http requests to Virtualizor API
 * @version 1.0.0-beta
 * @author kkMihai <kkmihai@duck.com>
 * @param {Object} optionsv - Options for VirtualizorClient
 * @param {String} options.host - Hostname of the Virtualizor server (IP or domain)
 * @param {String} options.port - Port of the Virtualizor server (default: 4083)
 * @param {String} options.key - API key
 * @param {String} options.pass - API password
 * @param {Boolean} options.isRawResponse - If true, the response will be the raw response from the API, Recommended to set this to false
 * @returns {VirtualizorClient} VirtualizorClient
 */

class VirtualizorClient extends EventEmitter {
  constructor({ host, port, key, pass, isRawResponse = false }) {
    super();
    this.host = host;
    this.port = port;
    this.key = key;
    this.pass = pass;
    this.isRawResponse = isRawResponse

    /**
     * @description - Bind Methods
     * @memberof VirtualizorClient
     */
    this.CreateVPS = this.CreateVPS.bind(this);
    this.GetVPS = this.GetVPS.bind(this);
    this.ListVPS = this.ListVPS.bind(this);
    this.StartVPS = this.StartVPS.bind(this);
    this.StopVPS = this.StopVPS.bind(this);
    this.RestartVPS = this.RestartVPS.bind(this);
    this.GetVPSRam = this.GetVPSRam.bind(this);
    this.GetVPSCPU = this.GetVPSCPU.bind(this);
    this.GetVPSDisk = this.GetVPSDisk.bind(this);
    this.GetServerBandwidth = this.GetServerBandwidth.bind(this);
    this.GetPlans = this.GetPlans.bind(this);
  }

  /**
   * @description - This method is used to build query string and should not be used externally
   * @param {Object} params
   * @returns {String} query string
   * @memberof VirtualizorClient
   * @private
   */
  buildQueryString(params) {
    params.api = "json";
    const queryParams = new URLSearchParams(params);
    return `?${queryParams.toString()}`;
  }

  /**
   * @description - This method is used to make http/s request and should not be used externally
   * @param {String} path
   * @param {String} method
   * @param {String} postData
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   * @private
   */
  makeHttpRequest(path, method = "GET", postData) {
    const options = {
      host: this.host,
      port: this.port,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      agent: new https.Agent({ rejectUnauthorized: false }),
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (postData) {
        req.write(postData);
      }

      req.end();
    });
  }

  /**
   * @description - This method is used to create a new virtual server
   * @param {Object} params - Parameters for creating a new virtual server
   * @param {Object | String} params.storageSpace - Format { Size: Number, st_uuid: String }
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async CreateVPS({
    virtualizationType,
    nodeSelection,
    userEmail,
    userPassword,
    serverHostname,
    rootPassword,
    osId,
    ipAddress,
    storageSpace,
    serverRam,
    bandwidthLimit,
    cpuCores,
  }) {
    /**
     * @description - This method is used to handle storage space parameter, This in GB
     * @param {Array|Number} space
     * @returns {Number | Promise} Promise
     * @memberof VirtualizorClient
     * @private
     */

    function handleDiskSpace(space) {
      if (Array.isArray(space)) {
        return space.reduce((acc, curr) => acc + curr, 0);
      }
      return space;
    }

    const queryParams = {
      action: Actions.AddVPS,
      virt: virtualizationType,
      node_select: nodeSelection,
      user_email: userEmail,
      user_pass: userPassword,
      hostname: serverHostname,
      root_pass: rootPassword,
      os_id: osId,
      ips: ipAddress,
      space: handleDiskSpace(storageSpace),
      ram: serverRam,
      bandwidth: bandwidthLimit,
      cores: cpuCores,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const response = await this.makeHttpRequest(path, "POST");
      this.emit("vpsCreated", response);
      return Promise.resolve({
        message: response.done && response.done.msg,
        data: response,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @description - This method is used to get information about a virtual server
   * @param {String} id - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async GetVPS(id) {
    const queryParams = {
      act: Actions.VPSManage,
      changeserid: id,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path);
      let resData = res;

      if (!this.isRawResponse) {
        resData = {
          ip: res.info.ip,
          hostname: res.info.hostname,
          status: res.info.status,
          os: res.info.vps.os_name,
          cores: res.info.vps.cores,
          ram: res.info.vps.ram,
          space: res.info.vps.space,
          bandwidth: {
            limit: res.info.bandwidth.limit,
            used: res.info.bandwidth.used,
            free: res.info.bandwidth.free,
          },
          datacenter: res.info.server_name,
        };
      }

      return Promise.resolve(resData);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
 * @description - This method is used to list all virtual servers
 * @returns {Promise} Promise
 * @param {Number} [vpsid] - Search using id
 * @param {String} [vpsname] - Search using vid
 * @param {String} [vpsip] - Results will be returned on the basis of the ip
 * @param {String} [vpshostname] - VPS is searched on the basis of the hostname passed
 * @param {String} [vpsstatus] - VPS is searched on the basis of the status of the vps
 *   (type 's' for suspended, type 'u' for unsuspended)
 * @param {String} [vstype] - VPS is searched on the basis of the type of virtualization,
 *   refer below table for valid values
 * @param {String} [speedcap] - VPS is searched on the basis of the type of speed cap
 *   (type 1 for enabled, 2 for disabled)
 * @param {String} [user] - Search for the vps according to the user
 * @param {String} [vsgid] - Search for the vps according to the server group
 * @param {String} [vserid] - VPS is searched on the basis of the server
 * @param {String} [plid] - VPS is searched on the basis of plan that it has been assigned
 * @param {String} [bpid] - VPS is searched on the basis of backup plan that it has been assigned
 * @param {Number} [reslen] - Number of records to be returned, default is 50
 * @param {Number} [page] - Page number, each page show 50 records
 * @memberof VirtualizorClient
 */
async ListVPS(
  vpsid,
  vpsname,
  vpsip,
  vpshostname,
  vpsstatus,
  vstype,
  speedcap,
  user,
  vsgid,
  vserid,
  plid,
  bpid,
  reslen,
  page
) {
  const queryParams = {
    act: Actions.ListVPS,
    key: this.key,
    pass: this.pass,
    vpsid,
    vpsname,
    vpsip,
    vpshostname,
    vpsstatus,
    vstype,
    speedcap,
    user,
    vsgid,
    vserid,
    plid,
    bpid,
    reslen,
    page,
  };

  const path = `/index.php${this.buildQueryString(queryParams)}`;

  try {
    const res = await this.makeHttpRequest(path, "POST");
    let resData = res;

    if (!this.isRawResponse && res.data) {
      resData = Object.keys(res.data).reduce((acc, key) => {
        const vps = res.data.vs[key];

        if (vps && vps.vpsid && vps.hostname && vps.os_name) {
          acc.push({
            id: vps.vpsid,
            name: vps.vps_name,
            hostname: vps.hostname,
            os: vps.os_name,
            cores: vps.cores,
            ram: vps.ram,
            space: vps.space,
            bandwidth: vps.bandwidth,
            serverName: vps.server_name,
            status: vps.status,
            ip: vps.ips,
          });
        }

        return acc;
      }, []);
    }

    return Promise.resolve(resData);
  } catch (err) {
    return Promise.reject(err);
  }
}


  /**
   * @description - This method is used to start a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async StartVPS(vpsId) {
    const queryParams = {
      act: Actions.StartVPS,
      vpsid: vpsId,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}&action=vs`;

    try {
      const res = await this.makeHttpRequest(path);
      this.emit("vpsStarted", res);
      return Promise.resolve({
        message: res.done && res.done.msg,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to stop a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async StopVPS(vpsId) {
    const queryParams = {
      act: Actions.StopVPS,
      vpsid: vpsId,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}&action=vs`;

    try {
      const res = await this.makeHttpRequest(path);
      this.emit("vpsStopped", res);
      return Promise.resolve({
        message: res.done && res.done.msg,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to restart a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async RestartVPS(vpsId) {
    const queryParams = {
      act: Actions.RestartVPS,
      vpsid: vpsId,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}&action=vs`;

    try {
      const res = await this.makeHttpRequest(path);
      this.emit("vpsRestarted", res);
      return Promise.resolve({
        message: res.done && res.done.msg,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to get RAM information of a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async GetVPSRam(vpsId) {
    const queryParams = {
      act: Actions.GetVPSRam,
      changeserid: vpsId,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path);
      return Promise.resolve({
        ram: res.ram,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to get CPU information of a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async GetVPSCPU(vpsId) {
    const queryParams = {
      act: Actions.GetVPSCPU,
      changeserid: vpsId,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path);
      return Promise.resolve({
        cpu: res.cpu,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to get disk information of a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async GetVPSDisk(vpsId) {
    const queryParams = {
      act: Actions.GetVPSDisk,
      changeserid: vpsId,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path);
      return Promise.resolve({
        disk: res.disk,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to get bandwidth information of a virtual server
   * @param {String} month - Month for which bandwidth information is required (YYYY-MM)
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async GetServerBandwidth(month) {
    const queryParams = {
      act: Actions.GetServerBandwidth,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path, "GET", `show=${month}`);
      return Promise.resolve({
        bandwidth: res.bandwidth,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async GetPlans() {
    const queryParams = {
      act: Actions.GetPlans,
      key: this.key,
      pass: this.pass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path);
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = VirtualizorClient;
