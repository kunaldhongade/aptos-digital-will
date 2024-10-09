# Digital Will System - Smart Contract

The **Digital Will System** is a decentralized solution that allows users to create, update, revoke, and execute digital wills using smart contracts on the **Aptos Blockchain**. Each will specifies beneficiaries and their respective shares of the assets, and the assets are distributed upon execution.

## Features

- **Create Will**: Users can create a will specifying beneficiaries and their percentage of the total assets.
- **Update Will**: Users can update an existing will to modify beneficiaries or asset allocation.
- **Revoke Will**: A will can be revoked by the testator at any time.
- **Execute Will**: Upon death verification, the will can be executed, and the specified assets will be distributed to the beneficiaries.
- **View Wills**: Functionality to view all wills, wills by specific testators, or a particular will by its ID.

## Key Data Structures

- **`Beneficiary`**: Represents a beneficiary of the will with an address and a percentage of the assets.
- **`Will`**: Contains details of the will including the testator's address, total assets, a list of beneficiaries, and a flag indicating whether the will has been executed.
- **`GlobalWillCollection`**: Stores all the wills created and manages the global collection.

## Error Codes

- **`ERR_WILL_NOT_FOUND` (1)**: Triggered if the requested will does not exist.
- **`ERR_UNAUTHORIZED` (2)**: Raised if an unauthorized user tries to modify or execute a will.
- **`ERR_NO_WILLS` (3)**: Raised when no wills are found in the system.
- **`ERR_WILL_ALREADY_EXECUTED` (4)**: Triggered if an attempt is made to execute a will that has already been executed.
- **`ERR_INVALID_PERCENTAGE` (5)**: Raised if the total percentage of beneficiaries doesn't sum to 100%.
- **`ERR_ALREADY_INITIALIZED` (6)**: Raised if the global will system is already initialized.

## Functions

### 1. `init_will_system`

Initializes the global will system. This function is only called once to set up the global structure.

```move
public entry fun init_will_system(account: &signer)
```

### 2. `create_will`

Creates a new will by specifying the list of beneficiaries and the allocation percentages. The total assets are transferred from the user's account.

```move
public entry fun create_will(
    account: &signer,
    beneficiary_addresses: vector<address>,
    beneficiary_percentages: vector<u64>,
    total_assets: u64
)
```

### 3. `update_will`

Allows the testator to update an existing will by changing beneficiaries, their percentages, or the total assets.

```move
public entry fun update_will(
    account: &signer,
    will_id: u64,
    beneficiary_addresses: vector<address>,
    beneficiary_percentages: vector<u64>,
    total_assets: u64
)
```

### 4. `revoke_will`

Revokes an existing will, effectively removing it from the global collection.

```move
public entry fun revoke_will(
    account: &signer,
    will_id: u64
)
```

### 5. `execute_will`

Executes the will and transfers the specified assets to the beneficiaries. This function can only be called if the will has not been executed yet.

```move
public entry fun execute_will(
    account: &signer,
    will_id: u64
)
```

### 6. `view_all_wills`

Allows viewing all the wills created on the platform.

```move
public fun view_all_wills(): vector<Will>
```

### 7. `view_will_by_id`

Returns details of a specific will by its ID.

```move
public fun view_will_by_id(will_id: u64): Will
```

### 8. `view_wills_by_testator`

Retrieves all wills created by a specific testator.

```move
public fun view_wills_by_testator(testator: address): vector<Will>
```

## Helper Functions

- **`sum_percentages`**: Calculates the total percentage assigned to all beneficiaries to ensure it sums to 100.
- **`create_beneficiaries`**: Helper function to create a list of beneficiaries from the given addresses and percentages.

## Setup and Deployment

1. **Initialize the Will System**: Call `init_will_system()` to set up the global storage for all wills.
2. **Create Will**: Use the `create_will()` function to create new wills with beneficiaries and asset allocation.
3. **Update or Revoke**: Wills can be updated or revoked at any time by the testator using the respective functions.
4. **Execute Will**: Upon death or verified trigger, the will can be executed, and assets will be distributed.

## Conclusion

The **Digital Will System** ensures a secure and transparent way to manage digital assets after death. It leverages smart contracts to automate the distribution of assets based on predefined conditions, ensuring that beneficiaries receive their rightful share.
