const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

class AuthService {
    constructor(client) {
        this.Auth = client.db().collection("TaiKhoan");
    }

    extractAuthData(payload) {
        const auth = {
            TenDangNhap: payload.TenDangNhap,
            Password: payload.Password,
            isStaff: payload.isStaff,
        };

        Object.keys(auth).forEach(
            (key) => auth[key] === undefined && delete auth[key]
        );

        return auth;
    }

    async create(payload) {
        const existingAuth = await this.Auth.findOne({ TenDangNhap: payload.TenDangNhap });
        if (existingAuth) {
            throw new Error("Tài khoản đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(payload.Password, 10);
        const auth = {
            TenDangNhap: payload.TenDangNhap,
            Password: hashedPassword,
            isStaff: payload.isStaff || false,
        };

        const result = await this.Auth.insertOne(auth);
        return result;
    }

    async find(filter) {
        const cursor = await this.Auth.find(filter);
        return await cursor.toArray();
    }

    async findByName(TEN_DANG_NHAP) {
        return await this.find({
            TenDangNhap: { $regex: new RegExp(TEN_DANG_NHAP, "i") },
        });
    }

    async findById(id) {
        return await this.Auth.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractAuthData(payload);
        const result = await this.Auth.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        return await this.Auth.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async deleteAll() {
        const result = await this.Auth.deleteMany({});
        return result.deletedCount;
    }

    async comparePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    async login(TenDangNhap, Password) {
        const auth = await this.Auth.findOne({ TenDangNhap: TenDangNhap });
        if (!auth || !(await this.comparePassword(Password, auth.Password))) {
            throw new Error("Invalid credentials");
        }
        return auth;
    }
}

module.exports = AuthService;
