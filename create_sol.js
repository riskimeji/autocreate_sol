const { Keypair } = require("@solana/web3.js");
const bip39 = require("bip39");
const { derivePath } = require("ed25519-hd-key");
const bs58 = require("bs58");
const fs = require("fs");

const walletCount = 100;

function createWallet() {
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derivationPath = "m/44'/501'/0'/0'";
  const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  return {
    mnemonic: mnemonic,
    address: keypair.publicKey.toBase58(),
    privateKey: bs58.default.encode(keypair.secretKey),
  };
}

const wallets = [];

for (let i = 0; i < walletCount; i++) {
  const wallet = createWallet();
  wallets.push(wallet);
  console.log(`Wallet ${i + 1} created: ${wallet.address}`);
}

const output_file = "output.txt";
const walletData = wallets.map(
  (wallet) => `${wallet.mnemonic} | ${wallet.address} | ${wallet.privateKey}`
);

fs.writeFileSync(output_file, walletData.join("\n"), "utf-8");

console.log(`Created ${walletCount} Successfully`);
