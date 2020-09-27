pragma solidity >=0.4.22 <0.8.0;

/** @todo Implement EIP 1167 minimum proxy contract for factory or not
 *
    import "@optionality.io/clone-factory/contracts/CloneFactory.sol";

    contract TradeFactory is CloneFactory, Ownable {

        address template = address(0xc0ffee);

        address public tradeTestAddr;
        constructor() public {}

        function createTrade() external {
            address newTrade = createClone(template);
            Trade(newTrade).init(2);
            tradeTestAddr = tradeTestAddr;
        }
    }
 *
 */

import "./Trade.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TradeFactory is Ownable {

    address public lastTradeContractAddress;
    constructor() public {}

    function createTrade(uint _confirmation) external returns (address) {
        Trade trade = new Trade(address(this));
        trade.init(_confirmation);
        lastTradeContractAddress = address(trade);

        return lastTradeContractAddress;
    }
}