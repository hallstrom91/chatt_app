const express = require("express");
const path = require("path");
const dotenv = require("dotenv/config");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:3306",
    "http://localhost:5173",
    "https://chatify-api.up.railway.app",
    "https://o4507696238821376.ingest.de.sentry.io",
    "https://i.pravatar.cc/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://chatify-api.up.railway.app",
        "https://o4507696238821376.ingest.de.sentry.io",
        "https://api.imgbb.com/",
      ],
      imgSrc: [
        "'self'",
        "https://i.pravatar.cc/",
        "https://i.ibb.co",
        "data:",
        "blob:",
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
    },
  })
);

app.use(express.static(path.join(__dirname, "dist")));
app.use(cors(corsOptions));
app.use(express.json());

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log("server is live");
});
