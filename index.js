const bip39 = require('bip39');
const ethers = require('ethers');
const bitcoin = require('bitcoinjs-lib');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { Keypair } = require('@solana/web3.js');
const { derivePath } = require('ed25519-hd-key');
const bs58 = require('bs58').default;

const bip32 = BIP32Factory(ecc);

const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0";
const SOL_DERIVATION_PATH = "m/44'/501'/0'/0'";
const BTC_DERIVATION_PATH = "m/44'/0'/0'/0/0";

function deriveEthereum(seed){
    const rootNode = ethers.HDNodeWallet.fromSeed(seed);
    const ethNode = rootNode.derivePath(ETH_DERIVATION_PATH);

    console.log("\n--- Ethereum ---");
    console.log("Dervative path:    ",ETH_DERIVATION_PATH);
    console.log("Private Key:       ",ethNode.privateKey);
    console.log("Public Key:        ",ethNode.publicKey);
    console.log("Address:           ",ethNode.address);
}

function deriveBitcoin(seed) {
    const rootNode = bip32.fromSeed(seed);
    const btcNode = rootNode.derivePath(BTC_DERIVATION_PATH);
    const btcAddress = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(btcNode.publicKey),
    }).address;

    const publicKey = Array.from(btcNode.publicKey).map(byte => byte.toString(16).padStart(2, '0')).join('');

    console.log("\n--- Bitcoin ---");
    console.log("Dervative path:    ",BTC_DERIVATION_PATH);
    console.log("Private Key (WIF): ",btcNode.toWIF());
    console.log("Public key:        ",publicKey);
    console.log("Address:           ",btcAddress);
}

function deriveSolana(seed){
    const solanaDerivedSeed = derivePath(SOL_DERIVATION_PATH,seed).key;
    const solanaKeyPair = Keypair.fromSeed(solanaDerivedSeed);
    const solanaAddress = solanaKeyPair.publicKey.toBase58();

    const solanaPrivateKey = bs58.encode(solanaKeyPair.secretKey);

    console.log("\n--- Solana ---");
    console.log("Derivation Path: ",SOL_DERIVATION_PATH);
    console.log("Private Key (Base58): ",solanaPrivateKey);
    console.log("Public Key/Address: ",solanaAddress);

}

async function main() {
    const mnemonic = bip39.generateMnemonic();
    console.log("========================================");
    console.log("Mnemonic :- ", mnemonic);
    console.log("========================================");

    const seed = await bip39.mnemonicToSeed(mnemonic);
    deriveEthereum(seed);
    deriveSolana(seed);
    deriveBitcoin(seed);

    console.log("========================================");
    console.log("Wallet Generation completed");
}

main();