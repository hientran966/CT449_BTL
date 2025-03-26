const { ObjectId } = require("mongodb");
const { create } = require("../controllers/borrow_book.controller");

class BorrowBookService {
    constructor(client) {
        this.BorrowBook = client.db().collection("THEODOIMUONSACH");
    }

    extractBorrowBookData(payload) {
        const borrowBook = {
            MADOCGIA: payload.MADOCGIA,
            MASACH: payload.MASACH,
            NGAYMUON: payload.NGAYMUON,
            NGAYTRA: payload.NGAYTRA,
            TRANGTHAI: payload.TRANGTHAI || "Chưa Duyệt",
        };

        Object.keys(borrowBook).forEach(
            (key) => borrowBook[key] === undefined && delete borrowBook[key]
        );

        return borrowBook;
    }

    async create(payload) {
        const borrowBook = this.extractBorrowBookData(payload);
        const result = await this.BorrowBook.findOneAndUpdate (
            borrowBook,
            { $set: borrowBook },
            {returnDocument: "after", upsert: true}
        );
        
        return result;
    }

    async find(filter) {
        const cursor = await this.BorrowBook.find(filter);
        return await cursor.toArray();
    }

    async findByName(MASACH) {
        return await this.find({
            MASACH: {$regrex: new RegExp(new RegExp(MASACH)), $options: "i"},
        });
    }
    async findById(id) {
        return await this.BorrowBook.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBorrowBookData(payload);
        const result = await this.BorrowBook.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result;
    }

    async delete(id) {
        return await this.BorrowBook.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.BorrowBook.deleteMany({});
        return result.deletedCount;
    }

}


module.exports = BorrowBookService;