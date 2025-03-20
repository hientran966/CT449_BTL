const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const { create } = require("../controllers/staff.controller");

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
        };

        if (payload.Password) {
            const saltRounds = 10;
            staff.Password = await bcrypt.hash(payload.Password, saltRounds);
        }

        Object.keys(staff).forEach(
            (key) => staff[key] === undefined && delete staff[key]
        );

        return staff;
    }

    async create(payload) {
        const staff = await this.extractStaffData(payload);
        const result = await this.Staff.findOneAndUpdate (
            staff,
            { $set: staff },
            {returnDocument: "after", upsert: true}
        );
        
        return result;
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

    async comparePassword(inputPassword, storedHash) {
        return await bcrypt.compare(inputPassword, storedHash);
    }
    
}


module.exports = StaffService;