const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const users = require("./users");

const JWT_SECRET = crypto.randomBytes(64).toString();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // TODO fetch from env
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

// PRE: valid username
function setTokenCookie(res, username) {
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "30m" });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    })
    .json({
      ok: true,
    });
}

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const err = await users.register(username, password);
  if (err !== undefined) {
    // TODO better status code?
    return res.status(401).json({
      error: true,
      reason: err,
    });
  }

  setTokenCookie(res, username);
  return;
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const isValidPassword = await users.login(username, password);

  if (!isValidPassword) {
    res.status(401).json({
      error: true,
      reason: "unauthorized",
    });
    return;
  }

  setTokenCookie(res, username);
  return;
});

function privateRouteMiddleware(req, res, next) {
  try {
    // not sure I'm supposed to write that here
    res.locals.auth = jwt.verify(req.cookies.token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({
      error: true,
      reason: "unauthorized",
    });
  }
}

app.get("/counter", privateRouteMiddleware, async (req, res) => {
  const counter = await users.getCounter(res.locals.auth.username);
  res.send({
    counter,
  });
});

app.post("/counter/increment", privateRouteMiddleware, async (req, res) => {
  await users.incrementCounter(res.locals.auth.username);
  res.send({ ok: true });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
