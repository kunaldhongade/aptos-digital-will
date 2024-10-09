# Lost and Found Registry - Frontend

This is the frontend for the **Lost and Found Registry** built on the **Aptos Blockchain**. The platform enables users to register lost items, submit found item reports, and manage claims of lost property. All interactions are handled securely through smart contracts on the Aptos blockchain.

## Key Features

- **Register Lost Items**: Users can register their lost items with descriptions and set a reward for finders.
- **Submit Found Items**: Finders can submit found items with a description for verification.
- **Verify Finders**: Item owners can verify finders and transfer rewards for successfully returned items.
- **View Lost Items**: Users can browse all registered lost items.
- **View Found Item Submissions**: Owners can view submissions from finders for specific lost items.
- **Manage Claims**: Item owners can track the status of their lost items and verify claims.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** extension (e.g., Petra Wallet) for blockchain interactions

## Setup Instructions

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
cd lost-and-found-registry
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
PROJECT_NAME=LostAndFoundRegistry
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

Upon opening the application, you'll be prompted to connect your Aptos wallet (e.g., Petra Wallet). This allows you to interact with the blockchain and perform operations like registering lost items and verifying found submissions.

### 2. Register a Lost Item

To register a lost item:

- Navigate to the **Register Lost Item** page.
- Fill in the item's title, description, and reward amount.
- Submit the form to register your lost item on the blockchain.

### 3. Submit Found Item

Finders can submit found items by:

- Navigating to the **Submit Found Item** page.
- Selecting the lost item from the list and providing a description of the found item.
- Submitting the form to notify the owner of the found item.

### 4. Verify Finder and Transfer Reward

As the owner of a lost item:

- Go to the **My Items** section and select the item with a found submission.
- Review the finder's submission and verify if it's accurate.
- Upon verification, the platform will automatically transfer the reward to the finder using Aptos tokens (APT).

### 5. View Lost and Found Items

- Browse all registered lost items via the **View Lost Items** section.
- View all submissions for a specific lost item in the **Found Submissions** section.

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

This frontend allows users to easily interact with the **Lost and Found Registry**, providing a decentralized way to manage lost item registration, found item submissions, and reward distribution. With a secure and transparent system powered by the Aptos blockchain, users can seamlessly track and resolve lost-and-found claims.
