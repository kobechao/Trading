const TradeFactory = artifacts.require("TradeFactory");
const Trade = artifacts.require("Trade");
const Vote = artifacts.require("Vote");

contract("TradeFactory", function() {

  let factory;
  let tradeInstance, voteInstance;

  const TEST_STATE = {
    OPENED: 0,
    CREATED: 1,
    CLOSED: 2,
  }

  const TEST_CONFIRMATION = 2;

  before(async () => {
    factory = await TradeFactory.deployed();
  })

  it("(Factory) should have correct initial value of last trade contract address", async function() {
    const _lastTradeContractAddress = await factory.lastTradeContractAddress();
    assert.deepEqual(_lastTradeContractAddress, "0x0000000000000000000000000000000000000000", "Wrong initial address of last trade contract");
    assert.equal(_lastTradeContractAddress.toString().length, 42, "Wrong length of initial trade contract address");
  });

  it("(Factory) should successfully create a trade", async function() {
    await factory.createTrade(TEST_CONFIRMATION);

    const _lastTradeContractAddress = await factory.lastTradeContractAddress();
    assert.notDeepEqual(_lastTradeContractAddress, "0x0000000000000000000000000000000000000000", "Wrong initial address of last trade contract");
    assert.equal(_lastTradeContractAddress.toString().length, 42, "Wrong length of initial trade contract address");
    
    tradeInstance = await Trade.at(_lastTradeContractAddress)
  });

  it("(Factory) should have correct status after creation of a trade", async function() {

    const state = await tradeInstance.checkState();
    assert.equal(state, TEST_STATE.CREATED, "State should be CREATED.");
  
    const addr = await tradeInstance.getVoteContract();
    assert.notDeepEqual(addr, "0x0000000000000000000000000000000000000000", "Wrong initial address of vote contract ");
    assert.equal(addr.toString().length, 42, "Wrong length of initial vote address");
  
    voteInstance = await Vote.at(addr);
    
    const currentStatus = await voteInstance.checkConfirmationStatus();
    assert.isFalse(currentStatus, "Vote status should be false before all approved");
  });

});
