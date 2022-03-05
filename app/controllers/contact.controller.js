const mogoose = require("mongoose");
const { BadRequestError } = require("../errors");
const handlePromise = require("../helpers/promise.helper");
const Contact = require("../models/contact.model");

/*exports.create = (req, res) => {
    res.send({ message: "create handler" });
};

exports.findAll = (req, res) => {
    res.send({ message: "findAll handler" });
};

exports.findOne = (req, res) => {
    res.send({ message: "findOne handler" });
};

exports.update = (req, res) => {
    res.send({ message: "update handler" });
};

exports.delete = (req, res) => {
    res.send({ message: "delete handler" });
};

exports.findAllFavorite = (req, res) => {
    res.send({ message: "findAllFavorite handler" });
};

exports.deleteAll = (req, res) => {
    res.send({ message: "deleteAll handler" });
};
*/
exports.create = async (req, res, next) => {
    if(!req.body.name) {
        return next(new BadRequestError(400, "Name can not be empty"));
    }
    
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: req.body.favorite === true,
    });

    try {
        const document = await contact.save();
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500,
                "An error occured while creating the contact"
            )
        );
    }
};

//Cài đặt handler findAll:
exports.findAll = async (req, res, next) => {
    const condition = {  };
        const { name } = req.query;
        if (name) {
            condition.name = { $regex: new RegExp(name), $options: "i" };
        }
        try {
            const documents = await Contact.find(condition);
            return res.send(documents);
        } catch (error) {
            return next(
                new BadRequestError(500, 
                    "An error occurred while creating the contact"
            )
        );
    }
};

//Cài đặt handler findOne:
exports.findOne = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mogoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOne(condition);
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500, 
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};


//Cài đặt handler update
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new BadRequestError(404, 
            "Data to update can not empty"));
    }
    const { id } = req.params;
    const condition = {
        _id: id && mogoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOneAndUpdate(condition, req.body, {
            new: true,
        });
    if (!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }

    return res.send({ message: "Contact was updated successfilly", });
    } catch (error) {
        return next(
            new BadRequestError(500, 
                `Error updating contact with id=${req.params.id}`
            )
        );
    }
};


//Cài đặt handler delete:
exports.delete = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mogoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOneAndDelete(condition);
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully", });

    } catch (error) {
        return next(
            new BadRequestError(500, 
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

//Cài đặt handler findAllFavorite:
exports.findAllFavorite = async (req, res, next) => {
    try {
        const documents = await Contact.find({ favorite: true, });
        return res.send(documents);
    } catch (error) {
        return next(
            new BadRequestError(500, 
                "An error occured while retrieving favorite contacts"
            )
        );
    }
};
    

//Cài đặt handler deleteAll:
exports.deleteAll = async (req, res, next) => {
    try {
        const data = await Contact.deleteMany({});
        return res.send({
            message: `${data.deletedCount} contacts were deleted successfully`,
        }); 
    } catch (error) {
        return next(new BadRequestError(
            500, 
            "An error occured while retrieving favorite contacts"
            )
        );
    }
};
