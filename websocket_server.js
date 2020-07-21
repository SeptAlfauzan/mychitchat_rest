const express = require('express');
const webSocket = require('ws');
const http = require('http');
const port = 6969   ;
const server = http.createServer(express);
const wss = new webSocket.Server({ server })

wss.on('connection', (ws) =>{
    ws.on('message', (data)=>{
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === webSocket.OPEN) {
                client.send(data);
                console.log('work');
            }
        })
    })
})

server.listen(port, () => {
    console.log('server ok');
})