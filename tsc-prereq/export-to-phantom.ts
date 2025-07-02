import bs58 from "bs58";
import wallet from "./Turbin3-wallet.json";

const secretKey = Uint8Array.from(wallet);
const base58 = bs58.encode(secretKey);

console.log("🔐 Import this base58 private key into Phantom:");
console.log(base58);