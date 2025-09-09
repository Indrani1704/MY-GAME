// app.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./app/config/db");
const routes = require("./app/routes/index");
const { errorHandler } = require("./app/middlewares/errorHandler");
const gameSocket = require("./app/sockets/gameSocket");

// Load environment variables
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));

// Routes
app.use("/", routes);

// Socket.IO
gameSocket(io);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
