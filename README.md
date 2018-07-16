# Syndicated Loans

The app allows you to create a loan that is syndicated between selected banks. Once the loan is created, you can attach a collateral to the loan and store the transaction on the blockchain.

  - Type some Markdown on the left
  - See HTML in the right
  - Magic

### Setting it up
Execute the following commands in sequence to get up and running:

```sh
npm install - g truffle
git clone https://github.com/arjunmat/syndicated-loans-blockchain
cd syndicated-loans-blockchain
npm install
```

In a new Terminal, start Truffle.

```sh
truffle develop
```

In the Truffle terminal, compile and migrate the contract.

```sh
compile
migrate
```

In a new tab, run the web app.

```sh
npm run dev
```