import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';

export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

export function loadKeypair(filepath: string): Keypair {
  const secretKeyString = fs.readFileSync(filepath, 'utf8');
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

export function createConnection(): Connection {
  return new Connection(RPC_ENDPOINT, 'confirmed');
}

export async function uploadMetadata(metadata: any): Promise<string> {
  
  console.log('Metadata to be uploaded:', JSON.stringify(metadata, null, 2));
  
  return "https://arweave.net/placeholder-metadata-uri";
}