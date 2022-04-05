
const config = require("./config")
const getBalance= async address =>{
    const data={
        "method":"getreceivedbyaddress",
        "params":{"address": address  }
      }
      const headers={
        "Content-Type":"application/json"
      }
       await axios.post(config.ELA_RPC_URL,data,{headers}).then(response=>{
        const { data } = response
        balance=parseFloat(data.result)
        return balance
      })
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
      const {data} = await axios.post(config.ELA_RPC_URL,{
        method: "getrawtransaction",
        params: {txid:transaction.txid,verbose:true}
      },{headers})
      transactionsWithCreatedTime.push({
        Txid:transaction.txid,
        amount:transaction.amount,
        CreateTime:data.result.time,
        Type:transaction.type,
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