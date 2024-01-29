// import socketIOClient from 'socket.io-client';

const serverDomain = 'pixelschat.com';
const serverAddress = `https://bots.${serverDomain}/`;

export { serverAddress, serverDomain };

/*

// https://docs.flowiseai.com/how-to-use#streaming
const socket = socketIOClient(serverAddress, {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: -1
});

socket.on('connect', () => {
    console.log(`[immagine.ai] [socket] Connected on the Id: ${socket.id}`);
});

socket.on('start', () => {
    console.log('[immagine.ai] [socket] start');
});

socket.on('token', (token) => {
    console.log('[immagine.ai] [socket] token:', token);
});


socket.on('end', () => {
    console.log('[immagine.ai] [socket] end');
});

socket.connect();

export function getSocket() {
    return socket;
};

*/
