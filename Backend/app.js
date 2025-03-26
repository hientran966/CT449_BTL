const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const bookRouter = require("./app/routes/book.route");
const publisherRouter = require("./app/routes/publisher.route");
const readerRouter = require("./app/routes/reader.route");
const staffRouter = require("./app/routes/staff.route");
const borrowBookRouter = require("./app/routes/borrow_book.route")

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to book application."});
});
app.use("/api/books", bookRouter);
app.use("/api/publishers", publisherRouter);
app.use("/api/readers", readerRouter);
app.use("/api/staffs", staffRouter);
app.use("/api/borrow", borrowBookRouter);
app.use("/api/auth", require("./app/routes/auth.route"));

//handle 404
app.use((req, res, next) => {
    //
    return next(new ApiError(404, "Resource not found"));
});

//error handling
app.use((err, req, res, next) => {
    //
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;