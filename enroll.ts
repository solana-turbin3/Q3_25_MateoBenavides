import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

const RPC_URL = "https://api.devnet.solana.com";
const PROGRAM_ID = IDL.address;
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const MINT_COLLECTION = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection(RPC_URL);
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });
const program: Program<Turbin3Prereq> = new Program(IDL, provider);


const [account_key] = PublicKey.findProgramAddressSync(
    [Buffer.from("prereqs"), keypair.publicKey.toBuffer()],
    program.programId
);


const [authority_key] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection"), MINT_COLLECTION.toBuffer()],
    program.programId
);


const mintTs = Keypair.generate();


console.log("Program ID from IDL:", PROGRAM_ID);
console.log("Program ID being used:", program.programId.toBase58());
console.log("Available methods:", Object.keys(program.methods));

// (async () => {
//     try {
//         const txhash = await program.methods
//             .initialize("AtlasHODL")
//             .accountsPartial({
//                 user: keypair.publicKey,
//                 account: account_key,
//                 system_program: SystemProgram.programId,
//             })
//             .signers([keypair])
//             .rpc();
//         console.log(`Success! Check out your TX here:
// https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
//     } catch (e) {
//         console.error(`Oops, something went wrong: ${e}`);
//     }
// })();


(async () => {
    try {
        const txhash = await (program.methods as any)
            .submitTs()
            .accountsPartial({
                user: keypair.publicKey,
                account: account_key,
                mint: mintTs.publicKey,
                collection: MINT_COLLECTION,
                authority: authority_key,
                mpl_core_program: MPL_CORE_PROGRAM_ID,
                system_program: SystemProgram.programId,
            })
            .signers([keypair, mintTs])
            .rpc();

        console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();