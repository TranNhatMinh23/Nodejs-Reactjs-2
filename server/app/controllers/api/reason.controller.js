const { reasonService } = require("../../services");

const getAllReasons = (req, res) => {
    reasonService.getAllReasons(req.query.type)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

module.exports = {
    getAllReasons,
};
