const { ObjectId } = require("mongodb");
const { create } = require("../controllers/reader.controller");
const MongoDB = require("../utils/mongodb.util"); 
const AuthService = require("../services/auth.service");

class ReaderService {
    constructor(client) {
        this.Reader = client.db().collection("DOCGIA");
    }

    extractReaderData(payload) {
        const reader = {
            HOLOT: payload.HOLOT,
            TEN: payload.TEN,
            NGAYSINH: payload.NGAYSINH,
            PHAI: payload.PHAI,
            DIACHI: payload.DIACHI,
            DIENTHOAI: payload.DIENTHOAI,
            TaiKhoan: payload.TaiKhoan,
        };

        Object.keys(reader).forEach(
            (key) => reader[key] === undefined && delete reader[key]
        );

        return reader;
    }

    async create(payload) {
        const authService = new AuthService(MongoDB.client);
        const username = payload.TenDangNhap || `user_${Date.now()}`;
        const auth = await authService.create({
            TenDangNhap: username,
            Password: payload.Password || "defaultPassword",
        });
        
        payload.TaiKhoan = auth._id;
        delete payload.Password;
        const reader = await this.extractReaderData(payload);
        return await this.Reader.findOneAndUpdate(
            reader,
            { $set: reader },
            { returnDocument: "after", upsert: true }
        );
    }

    async find(filter) {
        const cursor = await this.Reader.find(filter);
        return await cursor.toArray();
    }

    async findByName(TEN) {
        return await this.find({
            TEN: {$regrex: new RegExp(new RegExp(TEN)), $options: "i"},
        });
    }
    async findById(id) {
        return await this.Reader.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async findByAccountId(accountId) {
        return await this.Reader.findOne({ TaiKhoan: ObjectId.isValid(accountId) ? new ObjectId(accountId) : null });
    }    

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractReaderData(payload);
        const result = await this.Reader.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result;
    }

    async delete(id) {
        return await this.Reader.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll(){
        const result = await this.Reader.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = ReaderService;