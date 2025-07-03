use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, PanicOnDefault, AccountId, Promise, PromiseOrValue};
use near_sdk::collections::{UnorderedMap};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Listing {
    pub cid: String,
    pub owner: AccountId,
    pub price_per_day: u128,
    pub is_rented: bool,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    listings: UnorderedMap<u64, Listing>,
    next_id: u64,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            listings: UnorderedMap::new(b"l".to_vec()),
            next_id: 0,
        }
    }

    /// List a car for rent by providing a Filecoin CID and price (in yoctoNEAR per day).
    pub fn list_car(&mut self, cid: String, price_per_day: u128) -> u64 {
        let owner = env::predecessor_account_id();
        let listing = Listing {
            cid: cid.clone(),
            owner: owner.clone(),
            price_per_day,
            is_rented: false,
        };
        let id = self.next_id;
        self.listings.insert(&id, &listing);
        self.next_id += 1;
        env::log_str(&format!("event:CarListed {{ id: {}, owner: {} }}", id, owner));
        id
    }

    /// Start rental for an existing listing by attaching the correct deposit.
    #[payable]
    pub fn start_rental(&mut self, listing_id: u64) {
        let mut listing = self.listings.get(&listing_id).expect("Listing not found");
        assert!(!listing.is_rented, "Already rented");
        let deposit = env::attached_deposit();
        assert!(deposit >= listing.price_per_day, "Insufficient deposit");

        listing.is_rented = true;
        self.listings.insert(&listing_id, &listing);

        // funds stay in contract until rental complete
        env::log_str(&format!("event:RentalStarted {{ id: {}, renter: {} }}", listing_id, env::predecessor_account_id()));
    }

    /// Mark rental as complete; owner can withdraw funds.
    pub fn complete_rental(&mut self, listing_id: u64) {
        let mut listing = self.listings.get(&listing_id).expect("Listing not found");
        assert!(listing.is_rented, "Rental not in progress");
        assert_eq!(env::predecessor_account_id(), listing.owner, "Only owner can complete");

        listing.is_rented = false;
        self.listings.insert(&listing_id, &listing);

        // transfer deposit to owner
        Promise::new(listing.owner.clone()).transfer(listing.price_per_day);
        env::log_str(&format!("event:RentalCompleted {{ id: {} }}", listing_id));
    }

    /// View a listing's details
    pub fn get_listing(&self, listing_id: u64) -> Option<Listing> {
        self.listings.get(&listing_id)
    }
}
