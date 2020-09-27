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
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TradeFactory is Ownable {
    using SafeMath for uint256;

    // address public lastTradeContractAddress;

    struct TradeIndex {
        uint256 index;
        address createdBy;
        bool registered;
    }

    mapping(address => TradeIndex) private isInstantiation;
    address[] public tradeList;

    constructor() public {}

    function createTrade(uint256 _confirmation) external {
        Trade trade = new Trade(address(this));
        trade.init(_confirmation);

        // lastTradeContractAddress = address(trade);

        registerTrade(address(trade));

        // return lastTradeContractAddress;
    }

    function registerTrade(address _instance) internal returns (bool) {
        tradeList.push(_instance);

        isInstantiation[_instance] = TradeIndex({
            index: tradeList.length.sub(1),
            createdBy: msg.sender,
            registered: true
        });
        return true;
    }

    function getTradeData(address _instance)
        public
        view
        returns (
            uint256,
            address,
            bool
        )
    {
        TradeIndex memory tradeIndex = isInstantiation[_instance];
        return (tradeIndex.index, tradeIndex.createdBy, tradeIndex.registered);
    }

    function getTradeByIndex(uint256 _index) public view returns (address) {
        return tradeList[_index];
    }

    function getLastTrade() public view returns (address) {
        return tradeList[tradeList.length.sub(1)];
    }
}
