import { Server } from "socket.io";
import express from "express";
import http from "http";
import { fileURLToPath } from "url";
import path, { dirname} from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server); 

app.get('/', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const file = path.join(__dirname + "/main.html");
    res.sendFile(file);
});

app.use(express.static('public'));

// Handle client's connection
io.on(`connection`, (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on(`disconnect`, () => {
        console.log(`User disconnected: ${socket.id}`);
    });
    socket.on('userJoins', username => {
        io.emit('addUserJoin', username);
    });
    socket.on('sendMessage', (username, message, color) => {
        io.emit('broadcastMessage', username, message, color);
    });
});

server.listen(3000, () => {
    console.log(`Server is now running on port 3000.`)
});