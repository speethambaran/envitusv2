let io: { sockets: { emit: (event: any, values: any) => void; }; } | null = null;

/**
 * Create socket connection
 *
 * @param
 */
export const socketConnection = (server: import("http").Server | import("https").Server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: process.env.FRONT_END_APP_ADDR,
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    console.log("Made socket connection");
}

/**
 * Emit messages
 *
 * @param
 */
export const socketEmit = (event: any, values: any) => {
    if (io) {
        io.sockets.emit(event, values);
    }
}