pragma solidity ^0.4.18;

contract SyndicatedLoans {
  
  event AddedLoan(uint loanID);

  struct Collateral {
    bytes32 uid;
    uint loanID;
  }

  struct Loan {
    uint amount;
    string banks;
    bool doesExist;
  }

  uint numCollaterals;
  uint numLoans;

  mapping (uint => Collateral) collaterals;
  mapping (uint => Loan) loans;

  function addLoan(uint _amount, string _banks) public {
    // loanID is the return variable
    uint loanID = numLoans++;
    // Create new Loan Struct with amount and banks and saves it to storage.
    loans[loanID] = Loan(_amount, _banks, true);
    emit AddedLoan(loanID);
  }

  function attach(bytes32 uid, uint loanID) public {
    // checks if the struct exists for that candidate
    if (loans[loanID].doesExist == true) {
      uint collateralID = numCollaterals++; //collateralID is the return variable
      collaterals[collateralID] = Collateral(uid,loanID);
    }
  }

  function getNumOfLoans() public view returns(uint) {
    return numLoans;
  }

  function getLoanInfo(uint _loanID) public view returns(uint, uint, string, bytes32) {
    
    bytes32 collateral;
    
    for (uint i = 0; i < numCollaterals; i++) {
        if(collaterals[i].loanID == _loanID)
            collateral = collaterals[i].uid;
    }

    return (_loanID,loans[_loanID].amount,loans[_loanID].banks,collateral);
  }

}