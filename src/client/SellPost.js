import Box from "../utils/3Box";
import IPFS from "../utils/IPFS";
import Post from "../utils/Post";
import Crypto from "../utils/Crypto";
import Ethers from "../utils/Ethers";
import Griefing from "../utils/Griefing";

/**
 * Sell a post
 *
 * @param {string} ipfsHash - ipfs hash of what the unencrypted post will be
 * @returns {Promise} ipfs hash of the unencrypted post
 */
const SellPost = async function(griefingAddress) {
  try {
    const keypair = await Box.getKeyPair();
    if (keypair === null) {
      throw new Error("Unable to retrieve the keypair");
    }

    const data = await Griefing.getMetadata(griefingAddress);
    const { proofHash, operator, counterParty, griefingType } = data;

    const {
      nonce,
      encryptedSymmetricKey,
      encryptedPostIpfsHash
    } = await Post.getMetadata(proofHash);

    // Decrypt the content.
    const symmetricKey = Crypto.asymmetric.decrypt(
      encryptedSymmetricKey,
      nonce,
      keypair
    );

    // Retrieve the seller address.
    // Seller could be operator or counterParty.
    const account = await Ethers.getAccount();
    const seller = account === operator ? operator : counterParty;
    const buyer = account === operator ? counterParty : operator;

    // Retrieve the seller publicKey
    const buyerData = await this.erasureUsers.getUserData(buyer);
    const publicKey = Ethers.hexlify(buyerData);

    // construct the keypair: buyer publicKey, seller secretKey
    const newKeypair = {
      key: {
        publicKey: Uint8Array.from(Buffer.from(publicKey.substring(2), "hex")),
        secretKey: keypair.key.secretKey
      }
    };

    const encryptedSymKey = Crypto.asymmetric.encrypt(
      symmetricKey,
      nonce,
      newKeypair
    );

    // Submit the encryptedSymmetricKey to the griefing contract.
    this.setGriefing(griefingType, griefingAddress);
    await this.griefing.setMetadata({
      ...data,
      seller,
      buyer,
      encryptedPostIpfsHash,
      nonce: nonce.toString(),
      encryptedSymmetricKey: encryptedSymKey.toString()
    });
  } catch (err) {
    throw err;
  }
};

export default SellPost;