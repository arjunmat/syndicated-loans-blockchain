// import CSS. Webpack with deal with it
import "../css/style.css"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

// get build artifacts from compiled smart contract and create the truffle contract
import loansArtifacts from "../../build/contracts/SyndicatedLoans.json"
var LoansContract = contract(loansArtifacts)


window.App = {

  start: function () {
    LoansContract.setProvider(window.web3.currentProvider)
    LoansContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})

    LoansContract.deployed().then(function(instance) {

      App.showLoans();

    }).catch(function (err) {
      App.showError(err.message);
    })
  },

  showLoans: function () {

    LoansContract.deployed().then(function(instance) {

      instance.getNumOfLoans().then(function(numOfLoans){
        window.numOfLoans = numOfLoans;

        $('#loan-list').html('');

        if(window.numOfLoans) {
          for(let i=0; i< numOfLoans; i++) {
            $('#loan-list').append(`<tr onclick="App.viewLoanInfo(${i})"><td>Loan #${i+1}</td></tr>`);
          }
        }
        else
          $('#loan-list-help').show();

      })
    });
  },
  
  createLoan: function () {

    LoansContract.deployed().then(function(instance) {

      App.hideAlert();

      //get the selected banks as a string
      var banks = [];
      $('input[name=banks]:checked').each(function () {
        banks.push(this.value)
      });

      if(!banks.length) {
        App.showError('Select banks participating in the loan');
        return;
      }

      if($('#amount-input').val() == '') {
        App.showError('Enter loan amount');
        return;
      }

      instance.addLoan($('#amount-input').val(), web3.toHex(banks.join(", ")));

      $('#amount-input').val('');
      $('input[name=banks]:checkbox').prop('checked', false);
      $('#loan-form').hide();

      App.showLoans();

    }).catch(function (err) {
      App.showError(err.message);
    })
  },

  attachCollateral: function () {
    LoansContract.deployed().then(function(instance) {

      instance.attach(web3.toHex($('#collateral-reference').val()), $('#hidden-loan-id').val());

      App.viewLoanInfo($('#hidden-loan-id').val());

      $('#collateral-reference').val('');

    }).catch(function (err) {
      App.showError(err.message);
    })
  },

  viewLoanInfo: function (loanID) {
    
    $('#collateral-form').hide();
    $('#hidden-loan-id').val(loanID);

    LoansContract.deployed().then(function(instance) {
      instance.getLoanInfo(loanID).then(function (results) {

        $('#loan-details #loan-id').html(web3.toDecimal(results[0]) + 1);
        $('#loan-details #loan-amount').html(web3.toDecimal(results[1]));
        $('#loan-details #loan-banks').html(web3.toAscii(results[2]));
        $('#loan-details #loan-collateral').html(web3.toAscii(results[3]));

        if(web3.toDecimal(results[3]) == 0) {
          $('#loan-details #loan-collateral').html("<span class='help-text'>No collateral added</span>")
          $('#collateral-form').show();
        }
      })
    }).catch(function (err) {
      App.showError(err.message);
    })
  },

  showLoanForm: function () {
    $('#loan-form').show();
  },

  /* Helper functions */

  showError: function (error) {
    $('#error').removeClass('alert-success').removeClass('alert-danger').addClass('alert-danger').text(error).show();
  },

  showInfo: function (info) {
    $('#error').removeClass('alert-success').removeClass('alert-danger').addClass('alert-success').text(info).show();
  },

  hideAlert: function () {
    $('#error').hide();
  }
}

// When the page loads, we create a web3 instance and set a provider. We then set up the app
window.addEventListener("load", function() {
  // Is there an injected web3 instance?
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))
  }
  // initializing the App
  window.App.start()
})