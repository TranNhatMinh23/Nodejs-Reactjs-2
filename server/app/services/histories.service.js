const History = require("../models/histories");

const getUserHistories = (user_id, filter) => {
    return new Promise((resolve, reject) => {
        let query = { user_id: user_id };
        let pageIndex = Number(filter.page) - 1 || 0;
        let perPage = Number(filter.limit) || 100;
        let type = filter.type || null;
        // let fromDate = filter.fromDate || new Date("2019-05-25 00:00");
        let fromDate = filter.fromDate || null;
        // let toDate = filter.toDate || new Date("2019-05-29 23:59");
        let toDate = filter.toDate || null;
        if (type) {
            query['type'] = type.toUpperCase();
        }
        if (fromDate && toDate) {
            query['createdAt'] = { $gte: fromDate, $lte: toDate }
        }
        console.log(query)
        History.find(query)
            .lean()
            .skip(pageIndex * perPage)
            .limit(perPage)
            .sort('-createdAt')
            .then(doc => {
                if (doc == null) throw new Error("Histories not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const addHistory = (user_id, body) => {
    return new Promise((resolve, reject) => {
        let h = new History({
            ...body,
            user_id: user_id
        });
        h.save((err, doc) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(doc);
            }
        })
    })
}

module.exports = {
    getUserHistories,
    addHistory
}