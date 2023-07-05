const anchor = require("@project-serum/anchor");
const solanaWeb3 = require("@solana/web3.js");
const { 
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    Account,
    getMint,
    getAccount
} = require("@solana/spl-token");

const connection = new solanaWeb3.Connection("https://api.devnet.solana.com/", "confirmed");
// const connection = new solanaWeb3.Connection("http://localhost:8899", "confirmed");

const fromWallet = solanaWeb3.Keypair.generate();
const toWallet = new solanaWeb3.PublicKey("4vx8VMkGD6MFszBPR2L7JEtZHwR39dSSE8BGru2cERcR");

let mint, fromTokenAccount, toTokenAccount;

function print(name, data) {
    console.log("************************************************************************************************");
    console.log(`${name}: \n${data}`);
    console.log("************************************************************************************************\n");
}

async function createToken() {
    
    const fromAirDropSignature = await connection.requestAirdrop(fromWallet.publicKey, solanaWeb3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirDropSignature);

    print("fromWallet", fromWallet.publicKey.toBase58())
    
    // create token mint
    mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9
    );
    
    print("create token mint", mint.toBase58());

    // create associated token account
    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );
    print("fromTokenAccount", fromTokenAccount.address.toBase58());
}

async function mintToken() {
    // mint token
    const signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        10000000000, // 10 tokens
    );
    await connection.confirmTransaction(signature);
    print("mint token", signature);
}

async function checkBalance() {
    // check balance
    const mintInfo = await getMint(connection, mint);
    print("mintInfo supply", mintInfo.supply);

    // check balance
    const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
    print("tokenAccountInfo amount", tokenAccountInfo.amount);
}


async function transferToken() {
    
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet
    );
    print("toTokenAccount", toTokenAccount.address.toBase58());

    // transfer token
    const signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1000000000, // 1 tokens
    );
    await connection.confirmTransaction(signature);
    print("Finished transfer", signature);
}
async function main() {
    await createToken();
    await mintToken();
    await checkBalance();
    await transferToken();
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    }
);

