import socketIOClient from 'socket.io-client';

const serverAddress = 'https://flow.immagine.ai/';

export { serverAddress };

// https://docs.flowiseai.com/how-to-use#streaming
const socket = socketIOClient(serverAddress, {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: -1
});

socket.on('connect', () => {
    console.log(`[agi.fm] [socket] Connected on the Id: ${socket.id}`);
});

socket.on('start', () => {
    console.log('[agi.fm] [socket] start');
});

socket.on('token', (token) => {
    console.log('[agi.fm] [socket] token:', token);
});


socket.on('end', () => {
    console.log('[agi.fm] [socket] end');
});

socket.connect();

export function getSocket() {
    return socket;
};