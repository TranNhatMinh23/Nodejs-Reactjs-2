const {entertainer_typeService} = require("../../services");

const getAllEntertainerTypes = (req, res) => {
    entertainer_typeService.getAllEntertainerTypes()
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

module.exports = {
    getAllEntertainerTypes       
}