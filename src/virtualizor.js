const https = require('https');
const { URLSearchParams } = require('url');

class Virtualizor {
    constructor({
        api,
        key,
        secret,
        raw
    }) {
        this.api = api;
        this.key = key;
        this.secret = secret;
        this.raw = raw ? raw : false;
    }

    buildRequestParams(params) {
        const queryParams = new URLSearchParams(params);
        return `/${queryParams.toString()}`;
    }

    makeRequest(path, method = 'GET', postData = null) {
        const options = {
            hostname: this.api,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (postData) {
                req.write(postData);
            }

            req.end();
        });
    }

    async getvps(id) {
        const queryParams = {
            act: 'vpsmanage',
            svs: id,
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            let resData = res;

            if (!this.raw) {
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

    async listvps() {
        const queryParams = {
            act: 'listvs',
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            let resData = res;

            if (!this.raw && res.data.vs) {
                resData = Object.keys(res.data.vs).reduce((acc, key) => {
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

    async startVPS(vpsId) {
        const queryParams = {
            act: 'start',
            do: 1,
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
            svs: vpsId,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            return Promise.resolve({
                message: res.done && res.done.msg,
                time_taken: res.time_taken,
                vpsid: res.vpsid,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async stopVPS(vpsId) {
        const queryParams = {
            act: 'stop',
            do: 1,
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
            svs: vpsId,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            return Promise.resolve({
                message: res.done && res.done.msg,
                time_taken: res.time_taken,
                vpsid: res.vpsid,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async restartVPS(vpsId) {
        const queryParams = {
            act: 'restart',
            do: 1,
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
            svs: vpsId,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            return Promise.resolve({
                message: res.done && res.done.msg,
                time_taken: res.time_taken,
                vpsid: res.vpsid,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getVPSRam(vpsId) {
        const queryParams = {
            act: 'ram',
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
            svs: vpsId,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            return Promise.resolve({
                ram: res.ram,
                time_taken: res.time_taken,
                vpsid: res.vpsid,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getVPSCpu(vpsId) {
        const queryParams = {
            act: 'cpu',
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
            svs: vpsId,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            return Promise.resolve({
                cpu: res.cpu,
                time_taken: res.time_taken,
                vpsid: res.vpsid,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getVPSDisk(vpsId) {
        const queryParams = {
            act: 'disk',
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
            svs: vpsId,
        };

        const path = `/index

.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path);
            return Promise.resolve({
                disk: res.disk,
                time_taken: res.time_taken,
                vpsid: res.vpsid,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getVPSBandwidth(vpsId, month) {
        const queryParams = {
            act: 'bandwidth',
            api: 'json',
            apikey: this.key,
            apipass: this.secret,
            svs: vpsId,
        };

        const path = `/index.php${this.buildRequestParams(queryParams)}`;

        try {
            const res = await this.makeRequest(path, 'POST', `show=${month}`);
            return Promise.resolve({
                bandwidth: res.bandwidth,
                time_taken: res.time_taken,
                vpsid: res.vpsid,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = Virtualizor;
