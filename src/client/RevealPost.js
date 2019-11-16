import IPFS from "../utils/IPFS";
import Crypto from "../utils/Crypto";

const RevealPost = async function(ipfsHash) {
  try {
    // Get the encrypted ipfs hash from the post address
    const {
      nonce,
      encryptedSymmetricKey,
      encryptedPostIpfsHash
    } = this.datastore.post.posts[ipfsHash].metadata;

    // Download it from ipfs
    const encryptedPost = await IPFS.get(encryptedPostIpfsHash);

    // Decrypt the content.
    const symmetricKey = Crypto.asymmetric.decrypt(
      encryptedSymmetricKey,
      nonce,
      this.keystore.asymmetric.key
    );
    const post = Crypto.symmetric.decrypt(symmetricKey, encryptedPost);

    // Upload the decrypted data to ipfs.
    // Returns the IPFS hash.
    return await IPFS.add(post);
  } catch (err) {
    throw err;
  }
};

export default RevealPost;