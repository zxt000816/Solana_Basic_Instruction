// import anchor and solana
const anchor = require("@project-serum/anchor");
const solanaWeb3 = require("@solana/web3.js");
const fs = require('fs');

// import transfer function
const {transfer} = require('./transfer.js');

// read addresses from a file
const addresses = fs.readFileSync('airdrop_wallet_addresses.txt', 'utf8').split("\n");

// connect to the cluster
const connection = new solanaWeb3.Connection("https://api.devnet.solana.com/", "confirmed");

// airdrop sol to a list of addresses
async function airdropSol() {
    // airdrop 24 sol to the addresses
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        try {
            for (let j = 0; j < 12; j++) {

                // when i and j are both 0, don't sleep
                if (i != 0 || j != 0) {
                    console.log("Sleeping for 10 seconds...");
                    await new Promise(r => setTimeout(r, 10000));
                }

                const airdropSignature = await connection.requestAirdrop(
                    new solanaWeb3.PublicKey(address),
                    2 * 1000000000
                );
                await connection.confirmTransaction(airdropSignature);
                console.log("Airdropped 2 SOL to " + address);
            }
        } catch (error) {
            console.log("Airdrop to " + address + " failed!\n");
        }
    }
}

async function main() {
    await airdropSol();
    await transfer();
}

main();