pragma solidity >=0.4.22 <0.8.0;

import "./Trade.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// contract TradeFactory is CloneFactory, Ownable {

//     address template = address(0xc0ffee);

//     address public tradeTestAddr;
//     constructor() public {}

//     function createTrade() external {
//         address newTrade = createClone(template);
//         Trade(newTrade).init(2);
//         tradeTestAddr = tradeTestAddr;
//     }
// }

contract TradeFactory is Ownable {

    address public tradeTestAddr;
    constructor() public {}

    function createTrade() external {
        Trade trade = new Trade();
        trade.init(2);
        tradeTestAddr = address(trade);
    }
}