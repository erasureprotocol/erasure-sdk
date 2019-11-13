import CryptoIPFS from "@erasure/crypto-ipfs";

import Web3 from "../utils/Web3";
import Contract from "../utils/Contract";

import contract from "../../artifacts/Feed_Factory.json";

class FeedFactory {
  constructor({ network, web3 }) {
    this.web3 = web3;
    this.network = network;
    this.contract = new Contract({ network, web3, contract });
  }

  async createExplicit(ipfsHash) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const operator = accounts[0];

      const postRegistry = Contract.getAddress("Erasure_Posts", this.network);
      if (!this.web3.utils.isAddress(postRegistry)) {
        throw new Error(`PostRegistry ${postRegistry} is not an address`);
      }

      // Convert the ipfs hash to multihash hex code.
      const feedStaticMetadata = CryptoIPFS.ipfs.hashToHex(ipfsHash);

      await this.contract.invokeFn(
        "createExplicit",
        true,
        operator,
        postRegistry,
        feedStaticMetadata
      );
    } catch (err) {
      throw err;
    }
  }
}

export default FeedFactory;