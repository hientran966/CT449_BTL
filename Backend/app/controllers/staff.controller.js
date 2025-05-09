const ApiError = require("../api-error");
const StaffService = require("../services/staff.service");
const AuthService = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body.HoTenNV) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.error(error);
        return next(
            new ApiError(500, "An error occurred while creating the staff")
        );
    } 
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const staffService = new StaffService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await staffService.findByName(name);
        } else {
            documents = await staffService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the staff")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Staff not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retieving staff with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be emty"));
    }

    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Staff not found"));
        }
        return res.send({message: "Staff was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating staff with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Staff not found"));
        }
        return res.send({message: "Staff was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete staff with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const deletedCount = await staffService.deleteAll();
        return res.send({
            message: `${deletedCount} staffs was deleted successfully`
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all staffs")
        );
    }
};

exports.login = async (req, res, next) => {
    try {
        const authService = new AuthService(MongoDB.client);
        const auth = await authService.login(req.body.TenDangNhap, req.body.Password);
        res.send(auth);
    } catch (error) {
        next(new ApiError(401, "Login failed"));
    }
};