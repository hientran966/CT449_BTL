const { ObjectId } = require("mongodb");
const { create } = require("../controllers/book.controller");

class BookService {
    constructor(client) {
        this.Book = client.db().collection("SACH");
    }

    extractBookData(payload) {
        const book = {
            TENSACH: payload.TENSACH,
            DONGIA: payload.DONGIA,
            SOQUYEN: payload.SOQUYEN,
            NAMXUATBAN: payload.NAMXUATBAN,
            MANXB: payload.MANXB,
            TACGIA: payload.TACGIA,
        };

        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );

        return book;
    }

    async create(payload) {
        const book = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate (
            book,
            { $set: book },
            {returnDocument: "after", upsert: true}
        );
        
        return result;
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }

    async findByName(TENSACH) {
        return await this.find({
            TENSACH: {$regrex: new RegExp(new RegExp(TENSACH)), $options: "i"},
        });
    }
    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result;
    }

    async delete(id) {
        return await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }

}


module.exports = BookService;