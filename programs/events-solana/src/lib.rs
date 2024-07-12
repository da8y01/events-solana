use anchor_lang::prelude::*;

declare_id!("Bes8gPHw26kmAFXD3dcgZPtmKMmqody3Qzt73mZ8p5ez");

#[program]
pub mod events_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
