const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config({ path: "./config.env" });
const path = require("path");
const errorHandler = require("./src/app/middleware/errorHandler");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 5000;

// Socket Config
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
global._io = io;

app.use(cors());

app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//connect to DB
const db = require("./src/config/dbConnection");
db.connect();

//Json
app.use(bodyParser.json());

// cookies Parser
app.use(cookieParser());

const userRouter = require("./src/routes/UserRouter");
const authRouter = require("./src/routes/AuthRouter");
const plantRouter = require("./src/routes/PlantRouter");
const genusRouter = require("./src/routes/GenusRouter");
const plantTypeRouter = require("./src/routes/PlantTypeRouter");
const voucherRouter = require("./src/routes/VoucherRouter");
const deliveryMethodRouter = require("./src/routes/DeliveryMethodRouter");
const deliveryInformationRouter = require("./src/routes/DeliveryInformationRouter");

//static folder path
app.use(express.static(path.resolve(__dirname, "public")));

// routers
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/plants", plantRouter);
app.use("/api/genus", genusRouter);
app.use("/api/plant-types", plantTypeRouter);
app.use("/api/vouchers", voucherRouter);
app.use("/api/delivery-methods", deliveryMethodRouter);
app.use("/api/delivery-information", deliveryInformationRouter);

// Global error handler
app.use(errorHandler);

// Swagger configuration
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Plant API Documentation",
    version: "1.0.0",
    description: "API documentation for managing Plants",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development server",
    },
    {
      url: "https://everfresh-server.onrender.com",
      description: "Production server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/routes/AuthRouter.js",
    "./src/routes/UserRouter.js",
    "./src/routes/PlantRouter.js",
    "./src/routes/GenusRouter.js",
    "./src/routes/PlantTypeRouter.js",
    "./src/routes/VoucherRouter.js",
    "./src/routes/DeliveryMethodRouter.js",
    "./src/routes/DeliveryInformationRouter.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

httpServer.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
