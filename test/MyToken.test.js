const Token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path:"../.env"});

contract("Token Test", async (accounts) => {

    var [accountDeployer, recipient, anotherAccount] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("All tokens should be in my account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        // let balance = await instance.balanceOf(accounts[0]);
        // assert.equal(balance.valueOf(), initialSupply.valueOf(), "The value is not the same");
        return expect(instance.balanceOf(accountDeployer)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("Is possible to send tokents between accounts", async () => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(accountDeployer)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(accountDeployer)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));

    });

    it("Is no possible to send more tokens than available in total", async () => {
        let instance = this.myToken;
        let balanceOfDeployer = await instance.balanceOf(accountDeployer);

        expect(instance.transfer(recipient, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;

       return  expect(instance.balanceOf(accountDeployer)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });
});