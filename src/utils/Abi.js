import { ethers } from "ethers";

const Abi = {
  /**
   * This function reflects the usage of abi.encodeWithSelector in Solidity.
   * It prepends the selector to the ABI-encoded values.
   *
   * @param {string} fnName
   * @param {Array<string>} abiTypes
   * @param {Array<any>} abiValues
   */
  abiEncodeWithSelector: (fnName, abiTypes, abiValues) => {
    const abiEncoder = new ethers.utils.AbiCoder();
    const initData = abiEncoder.encode(abiTypes, abiValues);
    const selector = Abi.createSelector(fnName, abiTypes);

    const encoded = selector + initData.slice(2);
    return encoded;
  },

  /**
   * This function reflects the usage of abi.abiDecodeWithSelector in Solidity.
   * It prepends the selector to the ABI-encoded values.
   *
   * @param {string} fnName
   * @param {Array<string>} abiTypes
   * @param {string} callData
   */
  abiDecodeWithSelector: (fnName, abiTypes, callData) => {
    const selector = Abi.createSelector(fnName, abiTypes);
    const data = callData.replace(selector.substr(2), "");

    const abiEncoder = new ethers.utils.AbiCoder();
    return abiEncoder.decode(abiTypes, data);
  },

  /**
   * createSelector
   *
   * @param {string} fnName
   * @param {Array<string>} abiTypes
   */
  createSelector: (fnName, abiTypes) => {
    const joinedTypes = abiTypes.join(",");
    const fnSignature = `${fnName}(${joinedTypes})`;

    const selector = ethers.utils.hexDataSlice(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fnSignature)),
      0,
      4
    );
    return selector;
  }
};

export default Abi;
