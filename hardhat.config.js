require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config({path:__dirname+'/.env'});
require('solidity-coverage')

const contractAddr = "0xDfba6166f30f2B505848dC28729E842f7Adb328d";
const { API_URL, PRIVATE_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


task("balance", "Prints the donations contract balance", async (taskArgs) => {
	const Donations = await ethers.getContractFactory("Donations");
	const donations = await Donations.attach(
	contractAddr
		);

	console.log((await donations.getBalance()).toString());
});

/*
task("donations", "Prints account's donations")
	.addParam("address", "donater's address")
	.setAction(async (taskArgs) => {
		const Donations = await ethers.getContractFactory("Donations");
		const donations = await Donations.attach(
		contractAddr
			);
		console.log(await donations.donations(taskArgs.address, 0));
	});
*/
module.exports = {
	solidity: "0.8.0",
	networks: {
		rinkeby: {
			url: API_URL,
			accounts: [`0x${PRIVATE_KEY}`]
		}
	}
};
