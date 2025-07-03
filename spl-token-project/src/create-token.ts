import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
  } from '@solana/web3.js';
  import {
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
  } from '@solana/spl-token';
  import {
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  } from '@metaplex-foundation/mpl-token-metadata';
  import { loadKeypair, createConnection, uploadMetadata } from './utils';
  
  const metadataJson = {
    "name": "GOJO",
    "symbol": "GJJK",
    "description": "between heaven and earth i alone am the honored one",
    "image": "https://i.imgur.com/xVkdSQD.png",
    "attributes": [
      {
        "trait_type": "Type",
        "value": "Jujutsu Kaisen Token"
      },
      {
        "trait_type": "Creator",
        "value": "Six Eyes User"
      },
      {
        "trait_type": "Power",
        "value": "Limitless"
      }
    ],
    "properties": {
      "files": [
        {
          "uri": "https://i.imgur.com/xVkdSQD.png",
          "type": "image/png"
        }
      ]
    }
  };
  
  async function createGojoTokenWithMetadata() {
    try {
      const connection = createConnection();
      const payer = loadKeypair('./Turbin3-wallet.json');
      
      console.log('🚀 Creating GOJO SPL Token with Metadata');
      console.log('Payer:', payer.publicKey.toString());
      
      const mintKeypair = Keypair.generate();
      console.log('🎯 GOJO Mint address:', mintKeypair.publicKey.toString());
      
      const decimals = 6; 
      const mintAmount = 1000 * Math.pow(10, decimals); 
      
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        payer.publicKey
      );
      
      const metadataUri = await uploadMetadata(metadataJson);
      console.log('📊 Metadata URI:', metadataUri);
      
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      
      console.log('📝 Metadata PDA:', metadataPDA.toString());
      console.log('💰 Your GOJO token account:', associatedTokenAddress.toString());
      
      const transaction = new Transaction();
      
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          payer.publicKey, 
          payer.publicKey  
        )
      );
      
    
      transaction.add(
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPDA,
            mint: mintKeypair.publicKey,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: metadataJson.name,
                symbol: metadataJson.symbol,
                uri: metadataUri,
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        )
      );
      
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer.publicKey,           
          associatedTokenAddress,    
          payer.publicKey,           
          mintKeypair.publicKey     
        )
      );
      
      transaction.add(
        createMintToInstruction(
          mintKeypair.publicKey,     
          associatedTokenAddress,    
          payer.publicKey,          
          mintAmount                
        )
      );
      
      console.log('📤 Sending transaction...');
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer, mintKeypair]
      );
      
      console.log('✅ SUCCESS! GOJO Token Created with Metadata!');
      console.log('🔗 Transaction signature:', signature);
      console.log('🎯 GOJO Mint address:', mintKeypair.publicKey.toString());
      console.log('💰 Your GOJO token account:', associatedTokenAddress.toString());
      console.log('📝 Metadata account:', metadataPDA.toString());
      console.log(`🚀 Minted ${mintAmount / Math.pow(10, decimals)} ${metadataJson.symbol} tokens`);
      console.log(`🌐 Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      console.log('');
      console.log('🔥 "Between heaven and earth, I alone am the honored one!" 🔥');
      console.log('👁️ Six Eyes activated! Your GOJO tokens are ready! 👁️');
      
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }
  
  createGojoTokenWithMetadata();