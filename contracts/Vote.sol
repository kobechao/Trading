pragma solidity >=0.4.22 <0.8.0;

import "./Trade.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Vote {

    using SafeMath for uint;

    uint private confirmation;
    uint private currentConfirmation;

    Trade trade;

    event CastedByPerson(address indexed _voter);

    constructor(uint _confirmations, address tradeAddr) public {
        confirmation = _confirmations;
        trade = Trade(tradeAddr);
    }

    modifier onlyForTrade() {
        require(msg.sender == address(trade), "Invalide trade address");
        _;
    }

    function checkConfirmationStatus() public view returns (bool) {
        return confirmation.sub(currentConfirmation) == 0;
    }

    function castVote() onlyForTrade() external returns (bool) {
        require(currentConfirmation < confirmation, "Already finished confirmation");
        
        emit CastedByPerson(msg.sender);
        currentConfirmation = currentConfirmation.add(1);
        
        return checkConfirmationStatus();
    }


}