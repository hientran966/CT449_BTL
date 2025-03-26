const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const { create } = require("../controllers/staff.controller");
const MongoDB = require("../utils/mongodb.util"); 
const AuthService = require("../services/auth.service");

class StaffService {
    constructor(client) {
        this.Staff = client.db().collection("NhanVien");
    }

    async extractStaffData(payload) {
        const staff = {
            HoTenNV: payload.HoTenNV,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
            TaiKhoan: payload.TaiKhoan,
        };
        Object.keys(staff).forEach(
            (key) => staff[key] === undefined && delete staff[key]
        );

        return staff;
    }

    async create(payload) {
        const authService = new AuthService(MongoDB.client);
        const username = payload.TenDangNhap || `user_${Date.now()}`;
        const auth = await authService.create({
            TenDangNhap: username,
            Password: payload.Password || "defaultPassword",
            isStaff: true,
        });
        
        payload.TaiKhoan = auth._id;
        delete payload.Password;
        const staff = await this.extractStaffData(payload);
        return await this.Staff.findOneAndUpdate(
            staff,
            { $set: staff },
            { returnDocument: "after", upsert: true }
        );
    }

    async find(filter) {
        const cursor = await this.Staff.find(filter, { projection: { Password: 0 } });
        return await cursor.toArray();
    }

    async findByName(HoTenNV) {
        return await this.find({
            HoTenNV: {$regrex: new RegExp(new RegExp(HoTenNV)), $options: "i"},
        });
    }
    async findById(id) {
        return await this.Staff.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = await this.extractStaffData(payload);
        const result = await this.Staff.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result;
    }

    async delete(id) {
        return await this.Staff.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.Staff.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = StaffService;