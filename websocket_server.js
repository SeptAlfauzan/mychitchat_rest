const express = require('express');
const WebSocket = require('ws').Server;
const http = require('http');
const port = 4030;
const server = http.createServer();
const app = require('./app');
// const wss = new webSocket.Server({ server })

const wss = new WebSocket({
    server: server
})

// mount app on server
server.on('request', app)

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

// const socketServer = {
//     run: server.listen(port, () => {
//         console.log('websocket server is running :)');
//     })
// } 

// module.exports = {socketServer: socketServer};

server.listen(process.env.PORT, () => {
    console.log('websocket server is running :)');
})