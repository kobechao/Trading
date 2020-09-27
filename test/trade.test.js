
const Trade = artifacts.require("Trade");
const Vote = artifacts.require("Vote");
const TradeFactory = artifacts.require("TradeFactory");

const truffleAssert = require('truffle-assertions');

contract("Trade", function (accounts) {

  let tradeInstance, voteInstance, factory;

  const TEST_STATE = {
    OPENED: 0,
    CREATED: 1,
    CLOSED: 2,
  }

  const TEST_CONFIRMATION = 2;

  before(async () => {
    factory = await TradeFactory.deployed();
    tradeInstance = await Trade.new(factory.address);
  })

  it("(Trade) should have correct initial state after deployment", async function () {
    const state = await tradeInstance.checkState();
    assert.equal(state, TEST_STATE.OPENED, "State should be OPENED.");

    const addr = await tradeInstance.getVoteContract();
    assert.deepEqual(addr, "0x0000000000000000000000000000000000000000", "Wrong initial address of vote contract");
    assert.equal(addr.toString().length, 42, "Wrong length of initial vote address");
  });

  it("(Trade) should successfully initialize for trade contract", async function () {
    await tradeInstance.init(TEST_CONFIRMATION);

    const state = await tradeInstance.checkState();
    assert.equal(state, TEST_STATE.CREATED, "State should be CREATED.");

    const addr = await tradeInstance.getVoteContract();
    assert.notDeepEqual(addr, "0x0000000000000000000000000000000000000000", "Wrong initial address of vote contract");
    assert.equal(addr.toString().length, 42, "Wrong length of initial vote address");

    voteInstance = await Vote.at(addr);
  });

  it("(Trade) should successfully cast", async function () {

    for (let i = 0; i < TEST_CONFIRMATION; i++) {
      await tradeInstance.castVote();
    }

    const state = await tradeInstance.checkState();
    assert.equal(state, TEST_STATE.CLOSED, "State should be CLOSED.");
  });

  it("(Trade) should not be casted after finishing confirmations", async function () {

    truffleAssert.fails(
      tradeInstance.castVote(),
      truffleAssert.ErrorType.REVERT,
      "Not in correct state",
      "Should fail cast after all approved",
    )

    const state = await tradeInstance.checkState();
    assert.equal(state, TEST_STATE.CLOSED, "State should be CLOSED.");
  });

  it("(Trade) should successfully get next trade contract address", async function () {
    const nextTradeAddress = await factory.getLastTrade();
    assert.notDeepEqual(nextTradeAddress, "0x0000000000000000000000000000000000000000", "Wrong next trade address");
  });

  it("(Trade) should have correct status of next trade contract", async function () {

    const nextTradeAddress = await factory.getLastTrade();
    const tradeData = await factory.getTradeData(nextTradeAddress);
    assert.equal(tradeData[0], 0, "Incorrect index");
    assert.deepEqual(tradeData[1], tradeInstance.address, "Incorrect createdBy");
    assert.isTrue(tradeData[2], "Incorrect registered");

    const nextTrade = await Trade.at(nextTradeAddress);

    const state = await nextTrade.checkState();
    assert.equal(state, TEST_STATE.CREATED, "State should be CREATED.");

    const confirmation = await nextTrade.confirmation();
    assert.equal(confirmation, TEST_CONFIRMATION, "Confirmation is not equal.");

    const voteAddr = await nextTrade.getVoteContract();
    assert.notDeepEqual(voteAddr, "0x0000000000000000000000000000000000000000", "Wrong initial address of vote contract");
  });

  // Vote
  it("(Vote) should not be casted by address that is not trade", async function () {

    truffleAssert.fails(
      voteInstance.castVote(),
      truffleAssert.ErrorType.REVERT,
      "Invalide trade address",
      "Should not be called by address that is not trade",
    )
  });

  it("(Vote) should have correct status after all approved", async function () {

    const statusAfterApproved = await voteInstance.checkConfirmationStatus();
    assert.isTrue(statusAfterApproved, "Vote status should be true after all approved");
  });
});
