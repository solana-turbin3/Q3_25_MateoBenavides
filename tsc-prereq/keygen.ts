import { Keypair } from "@solana/web3.js";

const kp = Keypair.generate();

console.log(`You've generated a new Solana wallet:\n${kp.publicKey.toBase58()}\n`);
console.log(`To save your wallet, copy and paste the following into a JSON file:\n`);
console.log(`[${kp.secretKey.toString()}]`);
