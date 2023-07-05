const anchor = require("@project-serum/anchor");
const solanaWeb3 = require("@solana/web3.js");

const connection = new solanaWeb3.Connection("https://api.devnet.solana.com/", "confirmed");

// check if the account exists
async function checkAccount(accountPubkey) {
    const accountInfo = await connection.getAccountInfo(accountPubkey)
    const isExist = accountInfo !== null

    return isExist;
}

// check if the account is empty
const account = new solanaWeb3.PublicKey("E2jZ85tSmtYRuTRGTaFXPp4XhKWrYeeRKsgAQn916mgT")

checkAccount(account).then((isExist) => {
    console.log(isExist)
});
