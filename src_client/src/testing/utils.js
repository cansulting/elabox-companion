import React from "react"
import { render } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import App from "../App"

const BASE_URL = "http://" + window.location.hostname + ":3001"
const handlers = [
  rest.get(`${BASE_URL}/getOnion`,(req,res,ctx)=>{
    return res(ctx.json({
      "onion": "2puhles2lyireofz66k3jg47eiul2yoozckg7kljcmqzuoru3w6u4lyd.onion"
    }))
  }),
  rest.post( `${BASE_URL}/resyncMainchain`,(req,res,ctx)=>{
    return res(ctx.json({success:true}))
  }),
  rest.post( `${BASE_URL}/resyncEID`,(req,res,ctx)=>{
    return res(ctx.json({success:true}))
  }),  
  rest.post( `${BASE_URL}/resyncESC`,(req,res,ctx)=>{
    return res(ctx.json({success:true}))
  }),    
  rest.post(`${BASE_URL}/restartMainchain`,(req,res,ctx)=>{
    return res(ctx.json({success:true}))
  }),
  rest.post(`${BASE_URL}/restartEID`,(req,res,ctx)=>{
    return res(ctx.json({success:true}))
  }),
  rest.post(`${BASE_URL}/restartESC`,(req,res,ctx)=>{
    return res(ctx.json({success:true}))
  }),  
  rest.post(`${BASE_URL}/restartCarrier`,(req,res,ctx)=>{
    return res(ctx.json({success:true}))
  }),
  rest.post(`${BASE_URL}/restartFeeds`,(req, res,ctx) => {
    return res(ctx.status(200),ctx.json({success:true}))
  }),
  rest.post(`${BASE_URL}/sendSupportEmail`,(req,res,ctx)=>{
    return res(ctx.json({ok:true}))
  }),
  rest.get(`${BASE_URL}/download_package`, (req, res, ctx) => {
    return res(ctx.text(true))
  }),
  rest.post(`${BASE_URL}/version_info`, (req, res, ctx) => {
  return res(
      ctx.json({
        env: "debug",
      })
    )
  }),
  rest.post(`${BASE_URL}/login`, (req, res, ctx) => {
    return res(
      ctx.json({
        ok: true,
        address: "EPtbyXKqsT9TXZ1Hu1SdFRihW52wBQXr7u",
      })
    )
  }),
  rest.get(`${BASE_URL}/checkInstallation`, (req, res, ctx) => {
    return res(ctx.json({ configed: "true" }))
  }),
  rest.get(`${BASE_URL}/check_new_updates`, (req, res, ctx) => {
    return res(
      ctx.json({
        current: 3,
        latest: 1,
        new_update: true,
        count: 1,
      })
    )
  }),
  rest.get(`${BASE_URL}/feeds`, (req, res, ctx) => {
    return res(
      ctx.json({
        isRunning: true,
      })
    )
  }),
  rest.get(`${BASE_URL}/carrier`, (req, res, ctx) => {
    return res(
      ctx.json({
        isRunning: true,
        carrierIP: "203.189.118.100",
      })
    )
  }),
  rest.get(`${BASE_URL}/esc`, (req, res, ctx) => {
    return res(
      ctx.json({
        blockCount: 446493,
        blockSizes: [
          1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565,
        ],
        nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        isRunning: true,
        servicesRunning: true,
        latestblock: {
          blockTime: 1609931043,
          blockHash:
            "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
          miner: 12,
        },
      })
    )
  }),
  rest.get(`${BASE_URL}/ela`, (req, res, ctx) => {
    return res(
      ctx.json({
        blockCount: 446493,
        blockSizes: [
          1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565,
        ],
        nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        isRunning: true,
        servicesRunning: true,
        latestblock: {
          blockTime: 1609931043,
          blockHash:
            "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
          miner: 12,
        },
      })
    )
  }),
  rest.get(`${BASE_URL}/eid`, (req, res, ctx) => {
    return res(
      ctx.json({
        blockCount: 446493,
        blockSizes: [
          1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565,
        ],
        nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        isRunning: true,
        servicesRunning: true,
        latestblock: {
          blockTime: 1609931043,
          blockHash:
            "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
          miner: 12,
        },
      })
    )
  }),
]
const server = setupServer(...handlers)
const renderApp = () => {
  window.HTMLCanvasElement.prototype.getContext = () => {}  
  return render(<App />)
}
const renderAsFragment=(component)=>{
  const {asFragment}=render(<component/>)
  return asFragment
}
const clearLocalStorage= () =>{
  window.localStorage.removeItem("address")        
  window.localStorage.removeItem("logedin")        
  window.localStorage.removeItem("islogein")                
}
export { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment }
