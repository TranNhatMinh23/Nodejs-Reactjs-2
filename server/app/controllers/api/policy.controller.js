const { policyService } = require("../../services");

const getAllPolicy = (req, res) => {

    policyService.getAllPolicy()
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
};

const getPolicyDetail = (req, res) => {
    policyService.getPolicyDetail(req.params.id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
};

module.exports = {
    getAllPolicy,
    getPolicyDetail,
};
