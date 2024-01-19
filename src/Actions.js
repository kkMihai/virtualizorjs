/**
 * Enum representing various actions for Virtualizor API.
 * @enum {string}
 * @readonly
 */
module.exports = {
  /**
   * Action to add a new virtual private server (VPS).
   * @type {string}
   */
  AddVPS: "addvs",

  /**
   * Action to manage a VPS.
   * @type {string}
   */
  VPSManage: "vpsmanage",

  /**
   * Action to list all VPS.
   * @type {string}
   */
  ListVPS: "listvs",

  /**
   * Action to start a VPS.
   * @type {string}
   */
  StartVPS: "start",

  /**
   * Action to stop a VPS.
   * @type {string}
   */
  StopVPS: "stop",

  /**
   * Action to restart a VPS.
   * @type {string}
   */
  RestartVPS: "restart",

  /**
   * Action to get VPS RAM information.
   * @type {string}
   */
  GetVPSRam: "ram",

  /**
   * Action to get VPS CPU information.
   * @type {string}
   */
  GetVPSCPU: "cpu",

  /**
   * Action to get VPS disk information.
   * @type {string}
   */
  GetVPSDisk: "disk",

  /**
   * Action to get VPS bandwidth information.
   * @type {string}
   */
  GetVPSBandwidth: "bandwidth",

  GetPlans: "plans",
};
