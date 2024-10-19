# 🚀 Digital Will System - Frontend

Welcome to the **Digital Will System** frontend, a decentralized application built on the **Aptos Blockchain**. This platform enables users to create, update, revoke, and execute digital wills, ensuring secure and transparent asset distribution to designated beneficiaries. All transactions are seamlessly managed through smart contracts deployed on the blockchain.

---

## 🔗 Links

- **Live Demo**: [Digital Will System](https://aptos-digital-will.vercel.app/)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0x7792db2bc2e3c11f4485060e1112fab7a9d88d971af5cc638a9a486d6fb7ca61/modules/code/DigitalWillSystem?network=testnet)

---

## ✨ Key Features

- **Create a Will**: Users can specify beneficiaries, asset percentages, and total assets.
- **Update a Will**: Modify existing wills to adjust beneficiaries or asset allocations.
- **Revoke a Will**: Remove wills from the system when they are no longer valid.
- **Execute a Will**: Upon the user’s death, the will is executed, distributing assets to beneficiaries.
- **View Wills**: Browse all wills or filter specific wills by testator or ID.
- **Wallet Integration**: Seamlessly connect with Aptos wallets like **Petra Wallet** for blockchain operations.

---

## 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** (e.g., Petra Wallet) for blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
cd digital-will-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following:

```bash
PROJECT_NAME=DigitalWillSystem
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x7792db2bc2e3c11f4485060e1112fab7a9d88d971af5cc638a9a486d6fb7ca61
```

Replace `<VITE_MODULE_ADDRESS>` with the actual address of your deployed smart contract.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

### 5. Deploy the Smart Contract

To deploy the smart contract:

1.  Install **Aptos CLI**.
2.  Update the **Move.toml** file with your wallet address:

    - Add you Wallet Address from Petra here

    ```bash
    sys_addrx = "0xca10b0176c34f9a8315589ff977645e04497814e9753d21f7d7e7c3d83aa7b57"
    ```

    - Add your Account addr here for Deployment

    ```bash
    my_addrx = "7792db2bc2e3c11f4485060e1112fab7a9d88d971af5cc638a9a486d6fb7ca61"
    ```

3.  Create your new Address for Deployment

    ```bash
    aptos init
    ```

4.  Compile and publish the contract:

    ```bash
    aptos move compile
    aptos move publish
    ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet

Connect your Aptos wallet (e.g., **Petra Wallet**) to create, update, or execute wills and manage assets securely.

### 2. Create a Will

1. Navigate to the **Create Will** page.
2. Add beneficiaries and their respective asset percentages.
3. Submit the form to store the will on the blockchain.

### 3. Update a Will

1. Go to the **Update Will** section.
2. Select the will by providing its ID.
3. Adjust beneficiaries or asset allocations and submit the update.

### 4. Revoke a Will

1. Navigate to the **Revoke Will** section.
2. Enter the ID of the will to be revoked.
3. Confirm the revocation, and the will is removed from the system.

### 5. Execute a Will

1. Go to the **Execute Will** page (for executors).
2. Provide the ID of the will to execute.
3. Upon execution, assets will be automatically transferred to the beneficiaries.

### 6. View Wills

1. Browse all wills in the **View Wills** section.
2. Filter wills by **testator** or **will ID** to view specific ones.

---

## 📊 Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the project for production.
- **`npm test`**: Run unit tests.

---

## 🔍 Dependencies

- **React**: Library for building UIs.
- **TypeScript**: Provides type-safe JavaScript for better development experience.
- **Aptos SDK**: JavaScript/TypeScript SDK for Aptos blockchain interactions.
- **Ant Design / Tailwind CSS**: For responsive UI components and styling.
- **Petra Wallet Adapter**: Connects Aptos wallets to the application.

---

## 📚 Available View Functions

- **View All Wills**: Displays a list of all active wills.
- **View Wills by Creator**: Lists wills created by a specific testator.
- **View Will by ID**: Displays a will’s details based on its ID.
- **View Beneficiary Allocations**: Shows asset percentages allocated to each beneficiary.

---

## 🛡 Security and Transparency

- **Smart Contracts**: Handle all will creation, updates, and asset distribution securely.
- **No Middlemen**: Assets are transferred directly to beneficiaries without intermediaries.
- **Blockchain Transparency**: Users can track all transactions and will execution statuses.

---

## 🌐 Common Issues and Solutions

1. **Wallet Connection Errors**: Ensure the wallet extension is installed and active.
2. **RPC Rate Limits**: Use **private RPC nodes** to avoid request limits on public nodes.
3. **Transaction Failures**: Verify that your wallet has sufficient balance and permissions.

---

## 🚀 Scaling and Deployment

If deploying to **Vercel**, you might encounter **RPC request limits**. Consider these solutions:

- Use **third-party RPC providers** (e.g., Alchemy, QuickNode) to avoid rate limits.
- Implement **request throttling** to manage API load.
- Use **WebSockets** for real-time updates and notifications.

---

## 🎉 Conclusion

The **Digital Will System** offers a decentralized way to manage wills with transparency and security. By leveraging **smart contracts** on the Aptos blockchain, users can ensure that their assets are distributed as per their wishes without intermediaries. The user-friendly interface simplifies will management and provides seamless interaction with the blockchain.
