const { historyService } = require("../../services");

const getUserHistories = (req, res) => {
    historyService.getUserHistories(req.user.user_id._id, req.query)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const addHistory = (req, res) => {
    historyService.addHistory(req.user.user_id._id, req.body)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

module.exports = {
    getUserHistories,
    addHistory,
};
