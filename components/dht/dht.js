const { PeerRPCClient, PeerRPCServer } = require("grenache-nodejs-http");

const Link = require("grenache-nodejs-link");

const CMD_STATUS = {
  OK: "OK",
  FAILED: "FAILED",
};

const BASE_REPLAY = {
  status: CMD_STATUS.OK,
  error: null,
};

class DhtRpc {
  constructor() {
    this.link = new Link({
      grape: "http://127.0.0.1:30001",
    });

    this.link.start();
  }

  newClientPeer() {
    const peer = new PeerRPCClient(this.link, {});
    peer.init();

    return peer;
  }

  newRpcServer() {
    const peer = new PeerRPCServer(this.link, {
      timeout: 300000,
    });

    return peer;
  }

  newRpcService() {
    const port = 1024 + Math.floor(Math.random() * 1000);
    const service = this.newRpcServer().transport("server");
    service.listen(port);

    return service;
  }
}

module.exports = { DhtRpc, CMD_STATUS, BASE_REPLAY };
