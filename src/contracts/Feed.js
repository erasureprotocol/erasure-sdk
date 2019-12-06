import { ethers } from "ethers";
import CryptoIPFS from "@erasure/crypto-ipfs";

import IPFS from "../utils/IPFS";
import Ethers from "../utils/Ethers";
import Contract from "../utils/Contract";

import contract from "../../artifacts/Feed.json";

class Feed {
  /**
   * Feed
   *
   * @constructor
   * @param {Object} config - configuration for Feed
   * @param {Object} [config.registry] - for testing purposes
   */
  constructor(opts) {
    const contractName = "Feed";

    this.contract = new Contract({
      abi: contract.abi,
      contractName,
      ...opts
    });
  }

  /**
   * Updates the address of the contract
   *
   * @param {string} address - address of the new contract instance
   */
  setAddress(address) {
    this.contract.setContract(address);
  }

  /**
   * Submits a new post to the feed
   *
   * @param {Object} metadata - post metadata
   * @returns {Promise} ipfsHash, txHash and address of new feed
   */
  async submitHash(proofHash) {
    // submits the new post hash
    const tx = await this.contract.contract.submitHash(proofHash);
    return await tx.wait();
  }

  async getPosts() {
    const provider = Ethers.getProvider();

    let results = await provider.getLogs({
      address: this.contract.address,
      topics: [ethers.utils.id("HashSubmitted(bytes32)")],
      fromBlock: 0
    });

    let posts = [];
    if (results && results.length > 1) {
      // First proofHash is that of feed creation.
      // so we can ignore it.
      results = results.slice(1);

      for (const result of results) {
        posts.push({
          proofHash: result.data,
          ipfsMultihash: IPFS.sha256ToHash(result.data)
        });
      }
    }

    return posts;
  }
}

export default Feed;
