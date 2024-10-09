module my_addrx::DigitalWillSystem {
    use std::coin::{transfer};
    use std::aptos_coin::AptosCoin;
    use std::signer;
    use std::vector;
    use std::string::String;

    const ERR_WILL_NOT_FOUND: u64 = 1;
    const ERR_UNAUTHORIZED: u64 = 2;
    const ERR_NO_WILLS: u64 = 3;
    const ERR_WILL_ALREADY_EXECUTED: u64 = 4;
    const ERR_INVALID_PERCENTAGE: u64 = 5;
    const ERR_ALREADY_INITIALIZED: u64 = 6;

    const Global_Will_List: address = @sys_addrx;

    // Struct representing a beneficiary of the will
    struct Beneficiary has key, store, copy, drop {
        beneficiary_address: address,
        percentage: u64,  // Percentage of assets they should receive (out of 100)
    }

    // Struct representing a will
    struct Will has key, store, copy, drop {
        id: u64,
        testator: address,  // Address of the person creating the will
        total_assets: u64,  // Total APT tokens allocated for the will
        is_executed: bool,  // Marks if the will has been executed
        beneficiaries: vector<Beneficiary>,  // List of beneficiaries and their percentage shares
    }

    // Struct representing the global collection of wills
    struct GlobalWillCollection has key, store, copy, drop {
        wills: vector<Will>,
        last_will_id: u64,
    }

    // Initialize the global will system (only called once)
    public entry fun init_will_system(account: &signer) {
        let global_address = Global_Will_List;

        if (exists<GlobalWillCollection>(global_address)) {
            abort(ERR_ALREADY_INITIALIZED)
        };

        let will_collection = GlobalWillCollection {
            wills: vector::empty<Will>(),
            last_will_id: 1000,
        };

        move_to(account, will_collection);
    }

    // Create a new will
    public entry fun create_will(
        account: &signer,
        beneficiary_addresses: vector<address>,
        beneficiary_percentages: vector<u64>,
        total_assets: u64
    ) acquires GlobalWillCollection {
        let testator_address = signer::address_of(account);
        let global_address = Global_Will_List;

        assert!(exists<GlobalWillCollection>(global_address), ERR_NO_WILLS);

        // Ensure that total percentages sum up to 100
        let total_percentage = sum_percentages(&beneficiary_percentages);
        assert!(total_percentage == 100, ERR_INVALID_PERCENTAGE);

        let collection_ref = borrow_global_mut<GlobalWillCollection>(global_address);

        let will_id = collection_ref.last_will_id + 1;

        // Construct the list of Beneficiary structs
        let beneficiaries = create_beneficiaries(beneficiary_addresses, beneficiary_percentages);

        let new_will = Will {
            id: will_id,
            testator: testator_address,
            total_assets: total_assets,
            is_executed: false,
            beneficiaries: beneficiaries,
        };

        vector::push_back(&mut collection_ref.wills, new_will);
        collection_ref.last_will_id = will_id;
    }

    // Update an existing will (same logic as create, but updates an existing one)
    public entry fun update_will(
        account: &signer,
        will_id: u64,
        beneficiary_addresses: vector<address>,
        beneficiary_percentages: vector<u64>,
        total_assets: u64
    ) acquires GlobalWillCollection {
        let testator_address = signer::address_of(account);
        let global_address = Global_Will_List;

        assert!(exists<GlobalWillCollection>(global_address), ERR_NO_WILLS);

        // Ensure that total percentages sum up to 100
        let total_percentage = sum_percentages(&beneficiary_percentages);
        assert!(total_percentage == 100, ERR_INVALID_PERCENTAGE);

        let collection_ref = borrow_global_mut<GlobalWillCollection>(global_address);
        let wills_len = vector::length(&collection_ref.wills);
        let i = 0;

        while (i < wills_len) {
            let will_ref = vector::borrow_mut(&mut collection_ref.wills, i);
            if (will_ref.id == will_id) {
                // Ensure only the testator can update their will
                assert!(will_ref.testator == testator_address, ERR_UNAUTHORIZED);

                // Update the list of beneficiaries
                let beneficiaries = create_beneficiaries(beneficiary_addresses, beneficiary_percentages);
                will_ref.beneficiaries = beneficiaries;
                will_ref.total_assets = total_assets;
                return
            };
            i = i + 1;
        };
        abort(ERR_WILL_NOT_FOUND)
    }

    // Revoke an existing will
    public entry fun revoke_will(
        account: &signer,
        will_id: u64
    ) acquires GlobalWillCollection {
        let testator_address = signer::address_of(account);
        let global_address = Global_Will_List;

        assert!(exists<GlobalWillCollection>(global_address), ERR_NO_WILLS);

        let collection_ref = borrow_global_mut<GlobalWillCollection>(global_address);
        let wills_len = vector::length(&collection_ref.wills);
        let i = 0;

        while (i < wills_len) {
            let will_ref = vector::borrow_mut(&mut collection_ref.wills, i);
            if (will_ref.id == will_id) {
                // Ensure only the testator can revoke their will
                assert!(will_ref.testator == testator_address, ERR_UNAUTHORIZED);

                // Remove the will from the list
                vector::remove(&mut collection_ref.wills, i);
                return
            };
            i = i + 1;
        };
        abort(ERR_WILL_NOT_FOUND)
    }

    // Execute the will (after death verification)
    public entry fun execute_will(
        account: &signer,
        will_id: u64
    ) acquires GlobalWillCollection {
        let executor = signer::address_of(account);
        let global_address = Global_Will_List;

        assert!(exists<GlobalWillCollection>(global_address), ERR_NO_WILLS);

        let collection_ref = borrow_global_mut<GlobalWillCollection>(global_address);
        let wills_len = vector::length(&collection_ref.wills);
        let i = 0;

        while (i < wills_len) {
            let will_ref = vector::borrow_mut(&mut collection_ref.wills, i);
            if (will_ref.id == will_id) {
                // Ensure the will hasn't already been executed
                assert!(!will_ref.is_executed, ERR_WILL_ALREADY_EXECUTED);

                // Execute the asset distribution to beneficiaries
                let beneficiaries_len = vector::length(&will_ref.beneficiaries);
                let j = 0;
                while (j < beneficiaries_len) {
                    let beneficiary_ref = vector::borrow(&will_ref.beneficiaries, j);
                    let amount = (will_ref.total_assets * beneficiary_ref.percentage) / 100;

                    // Transfer the calculated amount to the beneficiary
                    transfer<AptosCoin>(account, beneficiary_ref.beneficiary_address, amount);
                    j = j + 1;
                };

                // Mark the will as executed
                will_ref.is_executed = true;
                return
            };
            i = i + 1;
        };
        abort(ERR_WILL_NOT_FOUND)
    }

    // Helper function to calculate the total percentage in the will
    fun sum_percentages(beneficiary_percentages: &vector<u64>): u64 {
        let total_percentage = 0;
        let len = vector::length(beneficiary_percentages);
        let i = 0;
        while (i < len) {
            let percentage = vector::borrow(beneficiary_percentages, i);
            total_percentage = total_percentage + *percentage;
            i = i + 1;
        };
        total_percentage
    }

    // Helper function to create beneficiaries
    fun create_beneficiaries(
        addresses: vector<address>,
        percentages: vector<u64>
    ): vector<Beneficiary> {
        let beneficiaries = vector::empty<Beneficiary>();
        let len = vector::length(&addresses);
        let i = 0;
        while (i < len) {
            let beneficiary_address = vector::borrow(&addresses, i);
            let percentage = vector::borrow(&percentages, i);

            let new_beneficiary = Beneficiary {
                beneficiary_address: *beneficiary_address,
                percentage: *percentage,
            };

            vector::push_back(&mut beneficiaries, new_beneficiary);
            i = i + 1;
        };
        beneficiaries
    }

    // View all wills created
    #[view]
    public fun view_all_wills(): vector<Will> acquires GlobalWillCollection {
        let global_address = Global_Will_List;
        assert!(exists<GlobalWillCollection>(global_address), ERR_NO_WILLS);

        let collection_ref = borrow_global<GlobalWillCollection>(global_address);
        collection_ref.wills
    }

    // View a specific will by ID
    #[view]
    public fun view_will_by_id(will_id: u64): Will acquires GlobalWillCollection {
        let global_address = Global_Will_List;
        assert!(exists<GlobalWillCollection>(global_address), ERR_NO_WILLS);

        let collection_ref = borrow_global<GlobalWillCollection>(global_address);
        let wills_len = vector::length(&collection_ref.wills);
        let i = 0;
        while (i < wills_len) {
            let will_ref = vector::borrow(&collection_ref.wills, i);
            if (will_ref.id == will_id) {
                return *will_ref
            };
            i = i + 1;
        };
        abort(ERR_WILL_NOT_FOUND)
    }

    // View all wills by a specific testator (owner)
    #[view]
    public fun view_wills_by_testator(testator: address): vector<Will> acquires GlobalWillCollection {
        let global_address = Global_Will_List;
        assert!(exists<GlobalWillCollection>(global_address), ERR_NO_WILLS);

        let collection_ref = borrow_global<GlobalWillCollection>(global_address);
        let result = vector::empty<Will>();

        let wills_len = vector::length(&collection_ref.wills);
        let i = 0;
        while (i < wills_len) {
            let will_ref = vector::borrow(&collection_ref.wills, i);
            if (will_ref.testator == testator) {
                vector::push_back(&mut result, *will_ref);
            };
            i = i + 1;
        };
        result
    }
}
