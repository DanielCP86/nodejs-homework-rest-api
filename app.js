const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const createError = require("http-errors");

const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof createError.HttpError) {
    // Afișează mesajul de eroare
    console.log("Mesaj de eroare:", err.message);

    // Afișează stack trace-ul erorii
    console.log("Stack trace:", err.stack);

    // Afișează tipul de eroare
    console.log("Tip de eroare:", err.name);
    res.status(err.status).json({ message: err.message });
  } else {
    // Afișează mesajul de eroare
    console.log("Mesaj de eroare:", err.message);

    // Afișează stack trace-ul erorii
    console.log("Stack trace:", err.stack);

    // Afișează tipul de eroare
    console.log("Tip de eroare:", err.name);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
