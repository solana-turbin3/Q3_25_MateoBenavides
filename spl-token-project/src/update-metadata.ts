import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createUpdateMetadataAccountV2Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata';
import { loadKeypair, createConnection } from './utils';

async function updateGojoMetadata() {
  try {
    const connection = createConnection();
    const payer = loadKeypair('./Turbin3-wallet.json');
    
    console.log('🔄 Updating GOJO metadata with GitHub Gist...');
    console.log('Wallet:', payer.publicKey.toString());
    
    const mintAddress = new PublicKey('A932WUS18J3CHkDQ6tTqJJbxj9SP9QHf5QRsApFCMpFX');
    console.log('🎯 GOJO Mint:', mintAddress.toString());
    
    const realMetadataUri = 'https://gist.githubusercontent.com/AtlasHODL/672ed62b3e51b797242256bf0064e779/raw/gojo-metadata.json';
    console.log('📊 Clean metadata URI:', realMetadataUri);
    
    
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    
    console.log('📝 Metadata PDA:', metadataPDA.toString());
    
    const transaction = new Transaction();
    
    transaction.add(
      createUpdateMetadataAccountV2Instruction(
        {
          metadata: metadataPDA,
          updateAuthority: payer.publicKey,
        },
        {
          updateMetadataAccountArgsV2: {
            data: {
              name: 'GOJO',
              symbol: 'GJJK',
              uri: realMetadataUri,
              sellerFeeBasisPoints: 0,
              creators: null,
              collection: null,
              uses: null,
            },
            updateAuthority: payer.publicKey,
            primarySaleHappened: false,
            isMutable: true,
          },
        }
      )
    );
    
    console.log('📤 Sending metadata update transaction...');
    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    
    console.log('✅ SUCCESS! GOJO metadata updated with clean GitHub Gist URL!');
    console.log('🔗 Transaction signature:', signature);
    console.log('🌐 Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    console.log('');
    console.log('🔥 "Between heaven and earth, I alone am the honored one!" 🔥');
    console.log('👁️ Your GOJO tokens should now display the Gojo image perfectly! 👁️');
    console.log('');
    console.log('💡 GitHub Gist provides clean, flat JSON that wallets can read properly.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateGojoMetadata();