import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

const main = async () => {
  const args = process.argv;
  const contractAddress = args[2];
  const addressToDelegate = args[3];

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic.length <= 0) {
    throw new Error("Missing seed phrase");
  }

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const signer = wallet.connect(provider);

  const contract = new Ballot__factory(signer);
  const deployedContract = contract.attach(contractAddress);

  const delegateTx = await deployedContract.delegate(addressToDelegate);
  console.log("delegateTX", delegateTx);

  const delegateTxReceipt = await delegateTx.wait();
  console.log("delegateTxReceipt", delegateTxReceipt);

  const voterStuctForDelegate = await deployedContract.voters(
    addressToDelegate
  );
  console.log(voterStuctForDelegate);
};
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
