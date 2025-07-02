import {
    Connection,
    Keypair,
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
      
      const balance = await connection.getBalance(from.publicKey);
      console.log(`💰 Current balance: ${balance} lamports`);
  
      
      const testTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: balance
        })
      );
      testTx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
      testTx.feePayer = from.publicKey;
  
      const fee = (await connection.getFeeForMessage(testTx.compileMessage(), "confirmed")).value || 0;
      console.log(`🧾 Estimated fee: ${fee} lamports`);
  
      
      const finalTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: balance - fee
        })
      );
      finalTx.recentBlockhash = testTx.recentBlockhash;
      finalTx.feePayer = from.publicKey;
  
      const signature = await sendAndConfirmTransaction(connection, finalTx, [from]);
  
      console.log(`✅ Wallet emptied! TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
      console.error("❌ Empty failed:", e);
    }
  })();