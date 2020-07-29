const express = require('express');
const webSocket = require('ws');
const http = require('http');
const port = 4030;
const server = http.createServer(express);
const wss = new webSocket.Server({ server })
const uuid = require('uuid');
const { url } = require('inspector');

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
    run: server.listen(port, () => {
        console.log('websocket server is running :)');
    })
} 

module.exports = {socketServer: socketServer};