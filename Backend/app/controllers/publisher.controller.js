const ApiError = require("../api-error");
const PublisherService = require("../services/publisher.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body.TENNXB) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the Publisher")
        );
    } 
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const publisherService = new PublisherService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await publisherService.findByName(name);
        } else {
            documents = await publisherService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the Publisher")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retieving Publisher with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be emty"));
    }

    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send({message: "Publisher was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating Publisher with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send({message: "Publisher was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete Publisher with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const deletedCount = await publisherService.deleteAll();
        return res.send({
            message: `${deletedCount} Publishers was deleted successfully`
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all Publishers")
        );
    }
};
