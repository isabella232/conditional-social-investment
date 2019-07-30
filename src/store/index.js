import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getConditions from '../utils/getConditions'

Vue.use(Vuex)

const store = new Vuex.Store({
 strict: true,
 state,
 mutations: {
   registerWeb3Instance (state, payload) {
     console.log('registerWeb3instance Mutation being executed', payload)
     let result = payload
     let providerCopy = state.provider
     providerCopy.coinbase = result.coinbase
     providerCopy.networkId = result.networkId
     providerCopy.balance = parseInt(result.balance, 10)
     providerCopy.isInjected = result.injectedWeb3
     providerCopy.web3Instance = result.web3
     state.provider = providerCopy
   }
 },
 actions: {
   registerWeb3 ({commit}) {
      console.log('registerWeb3 Action being executed')
      getConditions.then(result => {
        console.log('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
      }).catch(e => {
        console.log('error in action registerWeb3', e)
      })
    },
 }
})

export default store
