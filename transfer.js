const anchor = require("@project-serum/anchor");
const solanaWeb3 = require("@solana/web3.js");
const exp = require("constants");
const fs = require('fs');

// transfer sol from wallet to another wallet
async function transfer() {

    // read addresses from a file
    let addresses = fs.readFileSync('transfer_wallet_addresses.txt', 'utf8').split("\n");

    console.log(addresses);
    // connect to the cluster
    const connection = new solanaWeb3.Connection("https://api.devnet.solana.com/", "confirmed");
    
    const main_wallet = solanaWeb3.Keypair.fromSecretKey(
        anchor.utils.bytes.bs58.decode("3xxmLjZ763zxCsk2jrtZer5v3p6Qevtmh5My7E31VVEfvt7CUooVTAFQ7J37LhKSzTLTn3HQWzHa1GEQP1EoFosG")
    );

    // balance before transfer
    const balance_before = await connection.getBalance(main_wallet.publicKey);
    
    let tranferred_amount = 0;
    for (let i = 0; i < addresses.length; i++) {
        const wallet = solanaWeb3.Keypair.fromSecretKey(
            anchor.utils.bytes.bs58.decode(addresses[i])
        );

        // get balance of wallet
        let balance = await connection.getBalance(wallet.publicKey);

        if (balance / solanaWeb3.LAMPORTS_PER_SOL > 1) {
            console.log("Balance of " + wallet.publicKey.toString() + ": " + balance/solanaWeb3.LAMPORTS_PER_SOL + " SOL");

            // calculate gas fee 
            const gas_fee = 0.00001 * balance + 0.001 * solanaWeb3.LAMPORTS_PER_SOL; // 0.001 for rent

            // calculate amount to transfer
            let amount = balance - gas_fee;

            // round down to the nearest integer
            amount = Math.ceil(amount);

            console.log("Amount to transfer: " + amount/solanaWeb3.LAMPORTS_PER_SOL + " SOL");

            // create transaction
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: main_wallet.publicKey,
                    lamports: amount,
                })
            );

            await solanaWeb3.sendAndConfirmTransaction(
                connection,
                transaction,
                [wallet]
            );

            tranferred_amount += amount;

            console.log("Transfer " + amount/solanaWeb3.LAMPORTS_PER_SOL + " SOL from " + wallet.publicKey.toString() + " to " + main_wallet.publicKey.toString());
            await new Promise(r => setTimeout(r, 1000));
        } else {
            console.log("Balance of " + wallet.publicKey.toString() + ": " + balance/solanaWeb3.LAMPORTS_PER_SOL + " SOL");
            console.log("Skip " + wallet.publicKey.toString() + ' because balance is less than 1 SOL!\n');
        }
    }

    // balance after transfer
    const balance_after = await connection.getBalance(main_wallet.publicKey);

    console.log("Balance before transfer: " + balance_before/solanaWeb3.LAMPORTS_PER_SOL + " SOL");
    console.log("Balance after transfer: " + balance_after/solanaWeb3.LAMPORTS_PER_SOL + " SOL");
    console.log("Total transferred amount: " + tranferred_amount/solanaWeb3.LAMPORTS_PER_SOL + " SOL");

}

// export transfer function
module.exports = {
    transfer
}