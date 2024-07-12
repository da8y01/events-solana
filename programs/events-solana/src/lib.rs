use { anchor_lang::prelude::*, crate::instructions::*} ;

mod collections;
mod instructions;

declare_id!("Bes8gPHw26kmAFXD3dcgZPtmKMmqody3Qzt73mZ8p5ez");

#[program]
pub mod events_solana {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        name: String,
        ticket_price: u64,
    ) -> Result<()> {
        instructions::create_event::handle(ctx, name, ticket_price)
    }
}
