import Box from "../utils/3Box";
import Ethers from "../utils/Ethers";

/**
 * Reward a user
 *
 * @param {Object} config - configuration for reward
 * @param {string} config.rewardAmount - amount to be rewarded
 * @param {string} config.griefingAddress - contract address of the griefing agreement
 * @returns {Promise} transaction receipts of staking
 */
const Reward = async function({ rewardAmount, griefingAddress }) {
  try {
    let griefingData = await Box.get(Box.DATASTORE_GRIEFINGS);
    if (griefingData === null || griefingData[griefingAddress] === undefined) {
      throw new Error(`Unable to find griefing: ${griefingAddress}`);
    }

    const { griefingType } = griefingData[griefingAddress];
    if (griefingType === "countdown") {
      this.griefing = this.countdownGriefing;
      this.griefingFactory = this.countdownGriefingFactory;
    } else {
      this.griefing = this.simpleGriefing;
      this.griefingFactory = this.simpleGriefingFactory;
    }

    let currentStake = griefingData[griefingAddress].currentStake;
    currentStake = Ethers.parseEther(currentStake);
    rewardAmount = Ethers.parseEther(rewardAmount);

    this.griefing.setAddress(griefingAddress);
    const stake = await this.griefing.increaseStake(currentStake, rewardAmount);

    griefingData[griefingAddress].currentStake = Ethers.formatEther(
      currentStake.add(rewardAmount)
    ).toString();

    await Box.set(Box.DATASTORE_GRIEFINGS, griefingData);

    return stake;
  } catch (err) {
    throw err;
  }
};

export default Reward;
