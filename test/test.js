const { expect } = require("chai");
//const { ethers } = require("hardhat");

describe("Donations contract", function () {
    let owner;
    let d1;
    let d2;
    let d3;
    let d0;
    let Donations;
    let donations;
	let pE = ethers.utils.parseEther;

	before(async function () {
            Donations = await ethers.getContractFactory("Donations");
            [owner, d1, d2, d3, d0] = await ethers.getSigners();
            donations = await Donations.deploy();
	});

    describe("Deployment", function () {
        it("Balance of the new contract is 0", async function () {
			expect(await donations.getBalance()).to.be.equal(0);
        });

		it("Should get contract balance only by owner", async function () {
				await expect(donations.connect(d0).getBalance()).to.be.reverted;
		});
    });

    describe("Donations", function () {
        it("Should donate 6 ETH in total from 3 accounts", async function () {
                await donations.connect(d1).donate("bonk", {value: pE("1.00")});

				await donations.connect(d2).donate("lakag matataag!", {value: pE("2.00")});
                await d2.sendTransaction({
                    to: donations.address,
                    value: pE("2.00")
                    });

                await donations.connect(d3).donate("pogchamp", {value: pE("3.00")});
        });

		it("Should revert 0 ETH donation", async function () {
			    await expect(donations.connect(d0).donate({value: pE("0.00")})).to.be.reverted;
        });

		it("Should get total donations by address", async function () {
				expect( await donations.totalDonated(d1.address)).to.be.equal(pE("1.00"));
				expect( await donations.totalDonated(d2.address)).to.be.equal(pE("4.00"));
				expect( await donations.totalDonated(d3.address)).to.be.equal(pE("3.00"));
				expect( await donations.totalDonated(d0.address)).to.be.equal(pE("0.00"));

				expect((await donations.donations(d2.address, 0))["amount"]).to.be.equal(pE("2.00"));
		});
    });

    describe("Withdrawals", function () {
		it("Should withdraw all to some address", async function () {
			amount = donations.getBalance();
			await donations.withdraw(owner.address, amount);
		});

		it("Should allow withdraw only to owner", async function () {
			await expect(donations.connect(d1).withdraw(d2.address)).to.be.reverted;
		});
    });
});


