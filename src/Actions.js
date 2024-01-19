/**
 * @description Actions that can be performed on the server. Made available as an enum incase the API changes.
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
  ListVPS: "vs",

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
   * Action to get Server Bandwidth information.
   * @type {string}
   */
  GetServerBandwidth: "bandwidth",

  /**
   *  Action to get VPS Bandwidth information.
   *  @type {string}
   */

  GetPlans: "plans",
};
