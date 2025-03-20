const ApiError = require("../api-error");
const BorrowBookService = require("../services/borrow_book.service");
const ReaderService = require("../services/reader.service");
const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    const readerService = new ReaderService(MongoDB.client);
    const bookService = new BookService(MongoDB.client);

    // Check if MADOCGIA exists
    const readerExists = await readerService.findById(req.body.MADOCGIA);
    if (!readerExists) {
        return next(new ApiError(400, "Reader id does not exist"));
    }

    // Check if MASACH exists
    const bookExists = await bookService.findById(req.body.MASACH);
    if (!bookExists) {
        return next(new ApiError(400, "Book id does not exist"));
    }

    if (!req.body.MADOCGIA || typeof req.body.MADOCGIA !== 'string') {
        return next(new ApiError(400, "Reader id must be a non-empty string"));
    }
    if (!req.body.MASACH || typeof req.body.MASACH !== 'string') {
        return next(new ApiError(400, "Book id must be a non-empty string"));
    }
    if (!req.body.NGAYMUON || isNaN(new Date(req.body.NGAYMUON))) {
        return next(new ApiError(400, "Borrow date must be a valid date"));
    }
    if (req.body.NGAYTRA && new Date(req.body.NGAYTRA) <= new Date(req.body.NGAYMUON)) {
        return next(new ApiError(400, "Return date must be after borrow date"));
    }

    try {
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating data")
        );
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
    const readerService = new ReaderService(MongoDB.client);
    const bookService = new BookService(MongoDB.client);

    // Check if MADOCGIA exists
    const readerExists = await readerService.findById(req.body.MADOCGIA);
    if (!readerExists) {
        return next(new ApiError(400, "Reader id does not exist"));
    }

    // Check if MASACH exists
    const bookExists = await bookService.findById(req.body.MASACH);
    if (!bookExists) {
        return next(new ApiError(400, "Book id does not exist"));
    }
    
    if (Object.keys(req.body).length === 0 || typeof req.body.MADOCGIA !== 'string' || typeof req.body.MASACH !== 'string') {
        return next(new ApiError(400, "Data to update must include valid Reader id and Book id as non-empty strings"));
    }
    if (req.body.NGAYMUON && isNaN(new Date(req.body.NGAYMUON))) {
        return next(new ApiError(400, "Borrow date must be a valid date"));
    }
    if (req.body.NGAYTRA && new Date(req.body.NGAYTRA) <= new Date(req.body.NGAYMUON)) {
        return next(new ApiError(400, "Return date must be after borrow date"));
    }

    try {
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Data not found"));
        }
        return res.send({message: "Data was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating data with id=${req.params.id}`)
        );
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
