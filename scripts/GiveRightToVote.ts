import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

const main = async () => {
  const args = process.argv;
  const giveRightsToAddress = args[2];

  // get provider
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  // connect to wallet using seed phrase
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic.length <= 0)
    throw new Error("Missing environment: Mnemonic seed");

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const signer = wallet.connect(provider);

  // get the deployed contract
  const contract = new Ballot__factory(signer);
  console.log(`Attaching to ballot contract on address ${signer.address}`);
  const deployedContract = contract.attach(signer.address);
  console.log("Successfully attached");
  console.log(`Giving voting rights to address ${giveRightsToAddress}`);
  await deployedContract.giveRightToVote(giveRightsToAddress);
  console.log(`${giveRightsToAddress} can vote now`);
};

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
