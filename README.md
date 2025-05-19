# 🗳️ Decentralised Voting System (dVoting)

A decentralized, blockchain-based voting platform built on the Ethereum network for secure, transparent, and tamper-proof elections.

> Originally developed as a final year project by students of KIIT, this system aims to modernize and democratize the election process using Ethereum smart contracts and Web3 technologies.

---

## 📌 Features

- 🛠️ Admin-driven election creation & control
- 🗂️ Voter registration & manual verification
- ✅ Secure, transparent vote casting via Ethereum blockchain
- 📊 Real-time results with immutable records
- 🔐 MetaMask authentication and smart contract governance
- 🌐 Local development with Ganache + Truffle

---

## ⚙️ Tech Stack

- **Smart Contracts:** Solidity, Truffle
- **Blockchain Environment:** Ganache CLI
- **Frontend:** React.js, Web3.js, HTML, CSS
- **Wallet Integration:** MetaMask
- **Backend Runtime:** Node.js

---

## 🚀 Getting Started

### 📦 Requirements

- [Node.js](https://nodejs.org)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache CLI](https://github.com/trufflesuite/ganache-cli)
- [MetaMask Extension](https://metamask.io/)

### 🔧 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/dVoting.git
cd dVoting

# Run local Ethereum blockchain
ganache-cli
```

> Keep `ganache-cli` running in its own terminal.

#### Configure MetaMask:

- Network: `http://127.0.0.1:8545`
- Chain ID: `1337`
- Import accounts from Ganache using private keys

```bash
# Deploy contracts to the local blockchain
truffle migrate
# (use --reset for re-deployments)
```

#### Start the frontend:

```bash
cd client
npm install
npm start
```

> On installation errors (especially on Windows), you may need [Microsoft Visual C++ Redistributables](https://aka.ms/vs/17/release/vc_redist.x64.exe)

---

## 🧪 Testing & Validation

- Smart contract unit testing with Truffle
- End-to-end system testing with mock voters/admins
- Validates voter uniqueness and vote immutability
- Security-tested against double voting and unauthorized access

---

## 🗃️ Project Structure

```bash
dVoting/
├── contracts/        # Solidity smart contracts
├── migrations/       # Truffle deployment scripts
├── client/           # Frontend application
├── test/             # Contract tests
├── truffle-config.js # Truffle configuration
└── README.md
```

## 🧩 Future Enhancements

- [ ] OTP/Email verification for voter registration
- [ ] Automatic voter verification via third-party services
- [ ] Exportable election reports with charts
- [ ] GUI and UX workflow improvements
- [ ] Multi-election support per smart contract deployment

---

## 📜 License

This project is for educational and demonstration purposes. Contact authors for licensing or reuse.
