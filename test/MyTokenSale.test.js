const MyTokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path:"../.env"});

contract("MyTokenSale Test", async (accounts) => {

    var [accountDeployer, recipient, anotherAccount] = accounts;

    it("Should not have any tokens in my deployerAccounts", async () => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf(accountDeployer)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should be im the tokensale smart contract by default", async () => {
        let instance = await Token.deployed();
        let balanceOfTokenSmartContract = await instance.balanceOf(MyTokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSmartContract).to.be.a.bignumber.equal(totalSupply);

    });

    it("should be possible to buy tokens in my account", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let balanceBefore = tokenInstance.balanceOf(accountDeployer);
        expect(tokenSaleInstance.sendTransaction({from: accountDeployer, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(tokenInstance.balanceOf(accountDeployer)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
    });

});