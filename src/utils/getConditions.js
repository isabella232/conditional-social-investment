import Web3 from "web3";
import ethers from "ethers";

/*
 * 1. Check for injected web3 (mist/metamask)
 * 2. If metamask/mist create a new web3 instance and pass on result
 * 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
 * 4. Get user account from metamask
 * 5. Get user balance
 */

let getConditions = new Promise(function(resolve, reject) {
  // Check for injected web3 (mist/metamask)
  var web3js = window.web3;
  if (typeof web3js !== "undefined") {
    var provider = new Web3(web3js.currentProvider);
    console.log(provider);
    resolve({
      // web3() {
      //   return web3;
      // }
    });
  } else {
    // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) // GANACHE FALLBACK
    // reject(new Error("Unable to connect to Metamask"));
  }
});
// .then(result => {
//   return new Promise(function(resolve, reject) {
//     // Retrieve network ID
//     result.web3().version.getNetwork((err, networkId) => {
//       if (err) {
//         // If we can't find a networkId keep result the same and reject the promise
//         reject(new Error("Unable to retrieve network ID"));
//       } else {
//         // Assign the networkId property to our result and resolve promise
//         result = Object.assign({}, result, { networkId });
//         resolve(result);
//       }
//     });
//   });
// });

export default getConditions;
