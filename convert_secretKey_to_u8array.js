const { utils } = require("@project-serum/anchor");
const solanaWeb3 = require("@solana/web3.js");

const secretUnit8Array = solanaWeb3.Keypair.fromSecretKey(
    utils.bytes.bs58.decode("4vx8VMkGD6MFszBPR2L7JEtZHwR39dSSE8BGru2cERcR")
);

console.log(secretUnit8Array.secretKey);