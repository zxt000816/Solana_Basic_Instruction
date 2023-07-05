const { utils } = require("@project-serum/anchor");
const solanaWeb3 = require("@solana/web3.js");
const bs58 = require("bs58");

const keypair = solanaWeb3.Keypair.generate();

console.log(keypair.publicKey.toString());
console.log(bs58.encode(keypair.secretKey));

