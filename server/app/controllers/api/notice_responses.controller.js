const { noticeResponseService } = require("../../services");

const getNoticeResponses = (req, res) => {
    noticeResponseService.getNoticeResponses()
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

module.exports = {
    getNoticeResponses,
};
