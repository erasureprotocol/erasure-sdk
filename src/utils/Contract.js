import { ethers } from "ethers";

import Ethers from "./Ethers";

import config from "../config.json";
import contracts from "../contracts.json";

class Contract {
  /**
   * Contract
   *
   * @constructor
   * @param {Object} config - configuration for Contract
   * @param {Object} config.abi - contract abi
   * @param {string} config.network - eth network string
   * @param {Object} [config.contractName] - new contract address
   */
  constructor({ network, contractName, abi }) {
    this.wallet = Ethers.getWallet();
    this.provider = Ethers.getProvider();

    this.address = Contract.getAddress(contractName, network);

    this.setContract(abi, this.address);
  }

  /**
   * Creates a new web3 contract object
   *
   * @param {Object} abi - contract abi
   * @param {string} address - contract address
   * @returns {Object} this object
   */
  setContract(abi, address) {
    this.address = address;
    this.contract = new ethers.Contract(this.address, abi, this.wallet);
    return this;
  }

  /**
   * Retrieves the contract json artifact
   *
   * @param {string} contract - contract address
   * @param {string} network - eth network
   * @returns {Object} contract json artifact
   */
  static getAddress(contract, network) {
    try {
      return contracts[config.erasure.contract.version][network][contract];
    } catch (err) {
      throw new Error(`Contract address not found: ${contract}, ${network}`);
    }
  }
}

export default Contract;
