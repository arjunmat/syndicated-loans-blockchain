var SyndicatedLoans = artifacts.require("SyndicatedLoans")

module.exports = function(deployer) {
  deployer.deploy(SyndicatedLoans)
}