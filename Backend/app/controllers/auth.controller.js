const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const AuthService = require("../services/auth.service");

exports.create = async (req, res, next) => {
    if (!req.body.TenDangNhap) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const authService = new AuthService(MongoDB.client);
        const document = await authService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.error(error);
        return next(
            new ApiError(500, "An error occurred while creating the account")
        );
    } 
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const authService = new AuthService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await authService.findByName(name);
        } else {
            documents = await authService.find({});
        }
    } catch (error) {
        console.error(error);
        return next(
            new ApiError(500, "An error occurred while retrieving the account")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const authService = new AuthService(MongoDB.client);
        const document = await authService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Account not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retieving account with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be emty"));
    }

    try {
        const authService = new AuthService(MongoDB.client);
        const document = await authService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Account not found"));
        }
        return res.send({message: "Account was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating account with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const authService = new AuthService(MongoDB.client);
        const document = await authService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Account not found"));
        }
        return res.send({message: "Account was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete account with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const authService = new AuthService(MongoDB.client);
        const deletedCount = await authService.deleteAll();
        return res.send({
            message: `${deletedCount} accounts was deleted successfully`
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all accounts")
        );
    }
};

exports.login = async (req, res, next) => {
    try {
        const authService = new AuthService(MongoDB.client);
        const account = await authService.login(req.body.TenDangNhap, req.body.Password);
        res.send(account);
    } catch (error) {
        console.error("Login error:", error);
        next(new ApiError(401, "Login failed"));
    }
};
