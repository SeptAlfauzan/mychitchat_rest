const express = require('express');
const webSocket = require('ws');
let server = require('http').createServer();
let app = require('./app');
require('dotenv').config();

let wss = new webSocket.Server({

    server: server
  });
server.on('request', app);

wss.on('connection', (ws, req) =>{
    ws.on('message', (data)=>{
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === webSocket.OPEN) {
                client.send(data);
                console.log(data);
            }
        })
    })


})

const socketServer = {
    run: server.listen(process.env.PORT || 4000, () => {
        console.log('websocket server is running :)');
    })
} 

module.exports = {socketServer: socketServer};