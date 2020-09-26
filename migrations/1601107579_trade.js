const TradeFactory = artifacts.require("TradeFactory");


module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(TradeFactory);

};
