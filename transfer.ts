import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction
  } from "@solana/web3.js";
  import wallet from "./dev-wallet.json";
  
  const from = Keypair.fromSecretKey(new Uint8Array(wallet));
  const to = new PublicKey("RZpLfne8gCzFGLzeHz8ejUUp1Vj1vyBfn4Zk163uNQe");
  const connection = new Connection("https://api.devnet.solana.com");
  
  (async () => {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: LAMPORTS_PER_SOL / 10 // 0.1 SOL
        })
      );
  
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;
  
      transaction.feePayer = from.publicKey;
  
      const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
  
      console.log(`✅ Transfer successful! TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
      console.error("❌ Transfer failed:", e);
    }
  })();