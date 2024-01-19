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
 * @author kkMihai <kkmihai@duck.com>
 * @param {String} host - Hostname of the Virtualizor server (IP or domain)
 * @param {String} port - Port of the Virtualizor server (default: 4083)
 * @param {String} adminapikey - API admin api key
 * @param {String} adminapipass - API admin api pass
 * @param {Boolean} isRawResponse - If true, the response will be the raw response from the API, Recommended to set this to false
 * @returns {VirtualizorClient} VirtualizorClient
 */

class VirtualizorClient extends EventEmitter {
  constructor({ host, port, adminapikey, adminapipass, isRawResponse = false }) {
    super();
    this.host = host;
    this.port = port;
    this.adminapikey = adminapikey;
    this.adminapipass = adminapipass;
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
    this.GetVPSBandwidth = this.GetVPSBandwidth.bind(this);
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
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });
    const queryParams = new URLSearchParams(params);
    return `?${queryParams.toString()}`;
  }

  /**
   * @description - This method is used to make http/s request and should not be used externally
   * @param {String} path - Path of the request
   * @param {String} method - Method of the request
   * @param {String} postData - This is used to send data in POST request in the form of query string
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   * @private
   */
  makeHttpRequest(path, method = "GET", postData) {
    const options = {
      host: this.host,
      port: this.port,
      protocol: "https:",
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      agent: new https.Agent({ rejectUnauthorized: false ,requestCert: false }),
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";
    
      console.log(data);


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
    userpassword,
    serverHostname,
    rootpassword,
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
      user_pass: userpassword,
      hostname: serverHostname,
      root_pass: rootpassword,
      os_id: osId,
      ips: ipAddress,
      space: handleDiskSpace(storageSpace),
      ram: serverRam,
      bandwidth: bandwidthLimit,
      cores: cpuCores,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
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
   * @Tested - Yes
   */
  async GetVPS(id) {
    const queryParams = {
      act: Actions.GetVPS,
      vpsid: id,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {

      if (!id) {
        return Promise.reject(new Error("vpsid is required"));
      }

      const res = await this.makeHttpRequest(path, "POST");
      let resData = res;

      if (!this.isRawResponse) {
        resData = res.vs[id];
      }

      return Promise.resolve(resData);

    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
 * @description - This method is used to list all virtual servers
 * @returns {Promise} Promise
 * @memberof VirtualizorClient
 * @Tested - Yes
 */
async ListVPS() {
  const queryParams = {
    act: Actions.GetVPS,
    adminapikey: this.adminapikey,
    adminapipass: this.adminapipass,
  };

  const path = `/index.php${this.buildQueryString(queryParams)}`;

  try {

    const res = await this.makeHttpRequest(path, "GET");
    let resData = res;

    if (!this.isRawResponse) {
      resData = res.vs
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
   * @Tested - Yes
   */
  async StartVPS(vpsId) {
    const queryParams = {
      action: Actions.StartVPS,
      vpsid: vpsId,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {

      if (!vpsId) {
        return Promise.reject(new Error("vpsid is required"));
      }

      const res = await this.makeHttpRequest(path, "GET", `act=vs`);
      this.emit("vpsStarted", res);

      return Promise.resolve({
        message: res.done && res.done_msg,
        error: res.error_msg || false
      })

    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to stop a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   * @Tested - Yes
   */
  async StopVPS(vpsId) {
    const queryParams = {
      action: Actions.StopVPS,
      vpsid: vpsId,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path, "GET", `act=vs`);
      this.emit("vpsStopped", res);
      return Promise.resolve({
        message: res.done && res.done_msg,
        error: res.error_msg || false,
      })
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
      action: Actions.RestartVPS,
      vpsid: vpsId,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path, "GET", `act=vs`);
      this.emit("vpsRestarted", res);
      return Promise.resolve({
        message: res.done && res.done_msg,
        error: res.error_msg || false
      })
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
      svs: vpsId,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
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
      svs: vpsId,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
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
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path);
      
      return Promise.resolve({
        info: res.disk,
        time_taken: res.time_taken,
      });


    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * @description - This method is used to get bandwidth information of a virtual server
   * @param {String} vpsId - ID of the virtual server
   * @param {String} month - Month for which bandwidth information is required (YYYY-MM)
   * @returns {Promise} Promise
   * @memberof VirtualizorClient
   */
  async GetVPSBandwidth({vpsId, month}) {
    const queryParams = {
      act: Actions.GetServerBandwidth,
      changeserid: vpsId,
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
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
      adminapikey: this.adminapikey,
      adminapipass: this.adminapipass,
    };

    const path = `/index.php${this.buildQueryString(queryParams)}`;

    try {
      const res = await this.makeHttpRequest(path);
      return Promise.resolve({
        plans: res.plans,
        time_taken: res.time_taken,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = VirtualizorClient;
