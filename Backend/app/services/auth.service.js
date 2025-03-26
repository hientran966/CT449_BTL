const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

class AuthService {
    constructor(client) {
        this.Auth = client.db().collection("TaiKhoan");
    }

    extractAuthData(payload) {
        const auth = {
            TenDangNhap: payload.TenDangNhap,
            isStaff: payload.isStaff ?? false,
        };

        Object.keys(auth).forEach((key) => {
            if (auth[key] === undefined) delete auth[key];
        });

        return auth;
    }

    async create(payload) {
        const existingAuth = await this.Auth.findOne({ TenDangNhap: payload.TenDangNhap });
        if (existingAuth) throw new Error("Tài khoản đã tồn tại");

        const hashedPassword = await bcrypt.hash(payload.Password, 10);
        const auth = {
            ...this.extractAuthData(payload),
            Password: hashedPassword,
        };

        const result = await this.Auth.insertOne(auth);
        return { _id: result.insertedId, TenDangNhap: auth.TenDangNhap, isStaff: auth.isStaff };
    }

    async find(filter) {
        return await this.Auth.find(filter).toArray();
    }

    async findByName(TenDangNhap) {
        return await this.find({
            TenDangNhap: { $regex: new RegExp(TenDangNhap, "i") },
        });
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) return null;
        return await this.Auth.findOne({ _id: new ObjectId(id) });
    }

    async update(id, payload) {
        if (!ObjectId.isValid(id)) return null;

        const filter = { _id: new ObjectId(id) };
        const update = this.extractAuthData(payload);

        if (payload.Password) {
            update.Password = await bcrypt.hash(payload.Password, 10);
        }

        return await this.Auth.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) return null;
        return await this.Auth.findOneAndDelete({ _id: new ObjectId(id) });
    }

    async deleteAll() {
        const result = await this.Auth.deleteMany({});
        return result.deletedCount;
    }

    async comparePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    async login(TenDangNhap, Password) {
        const auth = await this.Auth.findOne({ TenDangNhap });
        if (!auth || !(await this.comparePassword(Password, auth.Password))) {
            throw new Error("Invalid credentials");
        }

        return { _id: auth._id, TenDangNhap: auth.TenDangNhap, isStaff: auth.isStaff };
    }
}

module.exports = AuthService;
