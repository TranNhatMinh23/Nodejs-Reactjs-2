const NoticeResponse = require("../models/notice_responses");

const getNoticeResponses = () => {
    return new Promise((resolve, reject) => {
        NoticeResponse.find()
            .then(doc => {
                if (doc == null) throw new Error("NoticeResponses not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    getNoticeResponses,
}