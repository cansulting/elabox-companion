
const config = require("./config")
const axios = require("axios")
const getBalance= async address =>{
  const data={
      "method":"getreceivedbyaddress",
      "params":{"address": address  }
    }
    const headers={
      "Content-Type":"application/json"
    }
    const {data:balanceResponse} = await axios.post(config.ELA_RPC_URL,data,{headers})
    balance = parseFloat(balanceResponse.result)
    return balance       
}
const transactions= async address =>{
  const headers={
    "Content-Type":"application/json"
  }    
  const {data} = await axios.post(config.ELA_RPC_URL,{
      method:"listunspent",
      params:{addresses: [address],utxotype:"normal"}    
    },{headers});
  const transactions=data.result
  const transactionsWithCreatedTime=[]
  if(transactions){
    for (const transaction of transactions) {
      console.log(transaction)
      const {data} = await axios.post(config.ELA_RPC_URL,{
        method: "getrawtransaction",
        params: {txid:transaction.txid,utxotype:"normal",verbose:true}
      },{headers})
      transactionsWithCreatedTime.push({
        Txid:transaction.txid,
        amount:transaction.amount,
        CreateTime:data.result.time,
        Type:transaction.txtype,
        Status: transaction.confirmations > 0 ? "confirmed":"unconfirmed"
      })      
    }
  }
  return transactionsWithCreatedTime
}
module.exports={
    getBalance,
    transactions
}