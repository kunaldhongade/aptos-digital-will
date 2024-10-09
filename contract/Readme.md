# Lost and Found Registry Smart Contract

## Overview

The **LostAndFoundRegistry** smart contract is designed to facilitate a decentralized registry for lost items. It allows owners to register lost items, finders to submit found item claims, and owners to verify finders and reward them in the form of Aptos tokens (APT). The contract also maintains a registry of all items and finders' submissions, ensuring transparency and immutability.

### Key Functionalities:

- **Register Lost Items:** Owners can register lost items with details such as title, description, and reward.
- **Submit Found Items:** Finders can register their discovery of lost items with relevant descriptions.
- **Verify Finders:** Owners can verify a finder’s claim and transfer the promised reward if the claim is valid.
- **View Items and Finders:** Users can view all registered lost items and finders, as well as query specific items by their unique IDs.

---

## Table of Contents

1. [Initialization](#initialization)
2. [Key Functions](#key-functions)
3. [Views](#views)
4. [Error Codes](#error-codes)

---

## Initialization

Before the contract can be used, the registry must be initialized.

- **Function:** `init_registry(account: &signer)`
  - Initializes the global lost items registry. Can only be called once.
  - Moves the item registry to the system address, ensuring a global reference point.

---

## Key Functions

### 1. Register Lost Item

Owners can register lost items to the registry.

- **Function:** `register_lost_item(account: &signer, title: String, description: String, reward: u64)`
  - Registers a lost item with a unique ID.
  - `reward` specifies the amount (in APT) to reward a verified finder.

### 2. Register Found Item

Finders can register their claim of finding a lost item.

- **Function:** `register_found_item(account: &signer, unique_id: u64, description: String)`
  - Registers a finder’s submission for a specific item.
  - Multiple finders can submit claims for the same item.

### 3. Verify Finder

Owners can verify a finder’s claim and reward them for finding the item.

- **Function:** `verify_finder(account: &signer, unique_id: u64, finder_address: address)`
  - Only the owner of the item can verify and reward the finder.
  - Transfers the reward to the verified finder.
  - Marks the item as "claimed" and finalizes the process.

---

## Views

### 1. View All Items

View all lost items currently registered in the system.

- **Function:** `view_all_items()`
  - Returns a list of all lost items.

### 2. View Item by ID

Retrieve details of a specific lost item by its unique ID.

- **Function:** `view_item_by_id(unique_id: u64)`
  - Returns the details of the lost item with the given ID.

### 3. View Finders for an Item

Retrieve all finders who submitted claims for a specific item.

- **Function:** `view_finders_by_item(unique_id: u64)`
  - Returns a list of finders for the specified item.

### 4. View Items by Owner

Retrieve all items registered by a specific owner.

- **Function:** `view_items_by_owner(owner: address)`
  - Returns all items owned by the specified address.

### 5. View Items Found by a Finder

Retrieve all items a specific finder has registered as found.

- **Function:** `view_items_found_by_finder(finder: address)`
  - Returns all items found by the specified address.

---

## Error Codes

- **ERR_ITEM_NOT_FOUND (1):** The specified item does not exist.
- **ERR_ITEM_ALREADY_CLAIMED (2):** The item has already been claimed by a finder.
- **ERR_NOT_OWNER (3):** The caller is not the owner of the item.
- **ERR_NOT_FINDER (4):** The finder is not registered for this item.
- **ERR_NO_ACTIVE_ITEMS (5):** No active items are registered in the system.
- **ERR_ALREADY_VERIFIED (6):** The finder has already been verified.
- **ERR_ALREADY_INITIALIZED (7):** The registry has already been initialized.

---

## Conclusion

This smart contract enables a decentralized, transparent system for managing lost and found items, rewarding finders using Aptos tokens. It provides flexibility for item owners and finders to interact seamlessly, while ensuring accountability through verified claims and on-chain transactions.
