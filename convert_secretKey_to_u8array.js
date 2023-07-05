const solanaWeb3 = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");

const secretUnit8Array = solanaWeb3.Keypair.fromSecretKey(
    anchor.utils.bytes.bs58.decode("SECRET_KEY")
);

console.log(secretUnit8Array.secretKey);