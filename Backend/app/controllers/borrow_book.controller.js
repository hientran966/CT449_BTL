const ApiError = require("../api-error");
const BorrowBookService = require("../services/borrow_book.service");
const ReaderService = require("../services/reader.service");
const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    const readerService = new ReaderService(MongoDB.client);
    const bookService = new BookService(MongoDB.client);

    try {
        const readerExists = await readerService.findById(req.body.MADOCGIA);
        if (!readerExists) {
            return next(new ApiError(404, "Reader ID does not exist"));
        }
        const book = await bookService.findById(req.body.MASACH);
        console.log(book)
        if (!book) {
            return next(new ApiError(404, "Book ID does not exist"));
        }

        if (book.SOQUYEN <= 0) {
            return next(new ApiError(400, "Book is out of stock"));
        }

        if (!req.body.MADOCGIA || typeof req.body.MADOCGIA !== 'string') {
            return next(new ApiError(400, "Reader ID must be a non-empty string"));
        }
        if (!req.body.MASACH || typeof req.body.MASACH !== 'string') {
            return next(new ApiError(400, "Book ID must be a non-empty string"));
        }
        if (!req.body.NGAYMUON || isNaN(new Date(req.body.NGAYMUON))) {
            return next(new ApiError(400, "Borrow date must be a valid date"));
        }
        if (req.body.NGAYTRA && new Date(req.body.NGAYTRA) <= new Date(req.body.NGAYMUON)) {
            return next(new ApiError(400, "Return date must be after borrow date"));
        }

        const borrowBookService = new BorrowBookService(MongoDB.client);

        const document = await borrowBookService.create(req.body);

        await bookService.decreaseQuantity(book._id);

        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while creating data"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await borrowBookService.findByName(name);
        } else {
            documents = await borrowBookService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving data")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Data not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retieving data with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty"));
    }

    try {
        const borrowService = new BorrowBookService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        
        const borrow = await borrowService.findById(req.params.id);
        const book = await bookService.findById(borrow.MASACH);
        console.log(book);
        if (!borrow) {
            return next(new ApiError(404, "Borrow record not found"));
        }

        if (req.body.TRANGTHAI === "Đã Trả") {
            req.body.NGAYTRA = new Date().toISOString().split("T")[0];

            await bookService.increaseQuantity(book._id);
        }

        const updatedBorrow = await borrowService.update(req.params.id, req.body);
        if (!updatedBorrow) {
            return next(new ApiError(404, "Borrow record not found"));
        }

        return res.send({ message: "Borrow record was updated successfully" });
    } catch (error) {
        return next(new ApiError(500, `Error updating borrow record with id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Data not found"));
        }
        return res.send({message: "Data was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete data with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const deletedCount = await borrowBookService.deleteAll();
        return res.send({
            message: `${deletedCount} datas was deleted successfully`
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all datas")
        );
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.update(req.params.id, { TRANGTHAI: req.body.TRANGTHAI });

        if (!document) {
            return next(new ApiError(404, "Data not found"));
        }

        return res.send({ message: `Status updated to ${req.body.TRANGTHAI}` });
    } catch (error) {
        return next(new ApiError(500, `Error updating status for id=${req.params.id}`));
    }
};