const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("NFT token", function () {
  let Token, hardhatToken, price;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("NFT_Ais");
    hardhatToken = await Token.deploy();
    price = ethers.utils.parseEther("0.00001");
  });
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("msg value should equal to price", async function () {
    const [owner] = await ethers.getSigners();
    expect(
      await hardhatToken.safeMint(owner.address, {
        value: price,
      })
    ).to.be.revertedWith("Should have a valid price");
  });

  it("must not exceed the limit", async function () {
    const [owner] = await ethers.getSigners();
    await hardhatToken.safeMint(owner.address, {
      value: price,
    });
    expect(await hardhatToken.totalSupply()).to.lessThan(
      await hardhatToken.getMaxLimit()
    );
    console.log(
      "Total Supply : " + (await hardhatToken.totalSupply()).toString()
    );
  });

  it("check array", async function () {
    const [owner] = await ethers.getSigners();
    await hardhatToken.safeMint(owner.address, {
      value: price,
    });

    console.log(
      "NFT num: " + (await hardhatToken.getListNFT(owner.address)).toString()
    );
  });
});
