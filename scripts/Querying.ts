import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

const main = async () => {
  const args = process.argv;
  const contractAddress = args[2];

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
  console.log(`Successfully attached ${contractAddress}`);

  const winningProposal = await deployedContract.winningProposal();
  const winner = await deployedContract.winnerName();
  console.log(`The winner is ${winner} with the ${winningProposal} proposal`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
