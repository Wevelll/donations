// SPDX-License-Identifier: UNLICENSED

import "hardhat/console.sol";
pragma solidity ^0.8.0;

contract Donations {
	event Donation(address indexed _from, uint _time, string _message);

	address owner;
	uint private balance;
	mapping(address => uint) public totalDonated;

// Looks like it can be tracked with event filtering
	mapping(address => donation[]) public donations;

	struct donation {
		uint amount;
		uint time;
		string message;
	}

	modifier onlyOwner {
		require(msg.sender == owner, "You are not the owner!");
		_;
	}

	modifier hasBalance {
		require(balance > 0, "Not enough balance");
		_;
	}

	modifier hasValue {
		require(msg.value > 0, "Send some ETH!");
		_;
	}

	constructor() {
		owner = msg.sender;
	}

	receive() external payable hasValue {
		_donate(msg.value, block.number, msg.sender, "");
	}

	function donate(string memory message) external payable hasValue {
		_donate(msg.value, block.number, msg.sender, message);
	}

	function _donate(uint _amount, uint _time, address _from, string memory _message) internal {
		totalDonated[_from] += _amount;
		donations[_from].push(donation(_amount, _time, _message));
		balance += _amount;
		emit Donation(_from, _time, _message);
	}

	function withdraw(address payable to, uint amount) external payable onlyOwner hasBalance {
		require(balance >= amount, "Not enough ETH available!");
		_pay(to, amount);
	}

	function _pay(address _to, uint _amount) internal {
		balance -= _amount;
		(bool success, ) = _to.call{value: _amount}("");
		require(success, "Transfer failed!");
	}

	function getBalance() view external onlyOwner returns (uint) {
		return balance;
	}
}
