// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract ConsentContract {
    
    // Define the consent registry
    mapping(address => mapping(address => bool)) consentRegistry;
    
    // Define the give consent function
    function giveConsent(address thirdParty) public {
        consentRegistry[msg.sender][thirdParty] = true;
    }
    
    // Define the revoke consent function
    function revokeConsent(address thirdParty) public {
        consentRegistry[msg.sender][thirdParty] = false;
    }
    
    // Define the verify consent function
    function verifyConsent(address user, address thirdParty) public view returns(bool) {
        return consentRegistry[user][thirdParty];
    }
}
