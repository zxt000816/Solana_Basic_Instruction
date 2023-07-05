const { utils } = require("@project-serum/anchor");
const solanaWeb3 = require("@solana/web3.js");
const bs58 = require("bs58");
const anchor = require("@project-serum/anchor");

require('dotenv').config()

const provider = anchor.AnchorProvider.env();
const AICON_WALLET = provider.wallet.payer;

console.log(AICON_WALLET.secretKey);
console.log(bs58.encode(AICON_WALLET.secretKey))