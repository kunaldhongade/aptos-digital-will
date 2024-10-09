# Digital Will System - Frontend

This is the frontend for the **Digital Will System** built on the **Aptos Blockchain**. The platform enables users to create, update, revoke, and execute digital wills, with beneficiaries receiving allocated assets after execution. All transactions are securely processed through smart contracts on the Aptos blockchain.

## Key Features

- **Create a Will**: Users can create a will by specifying beneficiaries and asset percentages.
- **Update Will**: Users can modify existing wills, adjusting beneficiaries and assets as needed.
- **Revoke Will**: Users can revoke an existing will, removing it from the system.
- **Execute Will**: Wills are executed after the user's death, transferring assets to beneficiaries.
- **View Wills**: Users can view all wills or specific wills based on testator or will ID.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** extension (e.g., Petra Wallet) for blockchain interactions

## Setup Instructions

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
cd digital-will-system
```

### 2. Install Dependencies

Install the necessary dependencies for the project using **npm** or **yarn**:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Configure Environment Variables

You need to configure the environment variables for the frontend to interact with the Aptos blockchain. Create a `.env` file in the project root and add the following variables:

```bash
PROJECT_NAME=DigitalWillSystem
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x<your_contract_address>
```

Replace `<your_contract_address>` with the actual address of your deployed smart contract.

### 4. Run the Development Server

Start the development server by running:

```bash
npm run dev
```

or

```bash
yarn run dev
```

The app will be available at `http://localhost:5173`.

## How to Use the Platform

### 1. Connect Wallet

Upon opening the application, you'll be prompted to connect your Aptos wallet (e.g., Petra Wallet). This allows you to interact with the blockchain and perform operations like creating, updating, or executing wills.

### 2. Create a Will

To create a will:

- Navigate to the **Create Will** page.
- Provide the list of beneficiaries, their respective asset percentages, and the total asset amount.
- Submit the form to store your will on the blockchain.

### 3. Update a Will

To update an existing will:

- Go to the **Update Will** section.
- Select the will you want to update by providing its ID.
- Adjust the beneficiaries, percentages, or total assets as required, then submit the form.

### 4. Revoke a Will

To revoke a will:

- Navigate to the **Revoke Will** page.
- Enter the ID of the will to be revoked.
- Confirm the revocation, and the will will be removed from the system.

### 5. Execute a Will

To execute a will:

- As the executor, go to the **Execute Will** page.
- Provide the ID of the will you want to execute.
- Upon execution, the assets will be automatically distributed to the beneficiaries based on the will's terms.

### 6. View Wills

- Browse all wills via the **View Wills** section.
- View specific wills by testator or will ID.

## Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm test`**: Runs unit tests.

## Dependencies

The project uses the following key dependencies:

- **React**: UI library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for type-safe development.
- **Aptos SDK**: JavaScript/TypeScript SDK to interact with the Aptos blockchain.
- **Ant Design / Tailwind CSS**: For responsive UI design and layout.
- **Petra Wallet Adapter**: To connect and interact with the Aptos wallet.

## Conclusion

This frontend provides a decentralized way to manage digital wills, allowing users to create, update, revoke, and execute wills with secure and transparent asset distribution using the Aptos blockchain. The platform ensures that beneficiaries receive their designated assets according to the testator's wishes.
