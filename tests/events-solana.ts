import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EventsSolana } from "../target/types/events_solana";
import { BN } from "bn.js";
import { createMint } from './utils';
import { PublicKey } from '@solana/web3.js';

describe("events-solana", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.EventsSolana as Program<EventsSolana>;

  // event accounts address
  let acceptedMint: PublicKey; // example: USDC

  // PDAs
  let eventPublicKey: PublicKey;
  let eventMint: PublicKey; // sponsorship token
  let treasuryVault: PublicKey;
  let gainVault: PublicKey;

  // all this should exists **before** calling our program instructions
  before(async () => {
    acceptedMint = await createMint(provider);

    // find event account PDA
    [eventPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("event", "utf-8"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // find event mint account PDA
    [eventMint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("event_mint", "utf-8"), eventPublicKey.toBuffer()],
      program.programId
    );

    // find treasury vault account PDA
    [treasuryVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("treasury_vault", "utf-8"), eventPublicKey.toBuffer()],
      program.programId
    );

    // find gain vault account PDA
    [gainVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("gain_vault", "utf-8"), eventPublicKey.toBuffer()],
      program.programId
    );
  });

  // TEST: Create an Event
  it("Creates a new Event", async () => {
    const name:string = "my_event";
    const ticketPrice = new BN(2); // 2 Accepted mint (USDC)

    const tx = await program.methods.createEvent(name, ticketPrice)
    .accounts({
      event: eventPublicKey,
      acceptedMint: acceptedMint, // example: USDC
      eventMint: eventMint, // sponsorship token
      treasuryVault: treasuryVault,
      gainVault: gainVault,
      authority: provider.wallet.publicKey, // event organizer
    })
    .rpc();

     // show new event info
     const eventAccount = await program.account.event.fetch(eventPublicKey);
     console.log("Event info: ", eventAccount);
  });
});
