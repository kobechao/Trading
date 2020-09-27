pragma solidity >=0.4.22 <0.8.0;

import "./Vote.sol";
import "./TradeFactory.sol";

contract Trade {

    Vote vote;
    Trade trade; 

    enum State {
        OPENED, CREATED, CLOSED
    }

    State state;
    TradeFactory factory;

    event NewVoteIsMaked(address indexed _maker, uint _confirmations);

    constructor(address _factoryAddr) public {
        state = State.OPENED;
        factory = TradeFactory(_factoryAddr);
    }

    modifier InState(State _state) {
        require(state == _state, "Not in correct state");
        _;
    }
    function init(uint _confirmation) InState(State.OPENED) external returns (bool) {

        vote = new Vote(_confirmation, address(this));

        emit NewVoteIsMaked(msg.sender, _confirmation);
        state = State.CREATED;
        return true;
    }

    function castVote() InState(State.CREATED) external {
        if (vote.castVote()) {
            state = State.CLOSED;
            /** @todo automatic generate next trade or not
             * 
             * factory.createTrade();
             * 
             */  
        } else {
            return;
        }
    }

    function checkState() public view returns (State) {
        return state;
    }

    function getVoteContract() public view returns (address) {
        return address(vote);
    }


}