const { progressProfileService } = require("../../services");
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

const getAllProgressProfile = (req, res) => {

    progressProfileService.getAllProgressProfile()
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const getProgressProfileDetail = (req, res) => {
    progressProfileService.getProgressProfileDetail(req.params.id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const getCompletedSteps = (req, res) => {
    progressProfileService.getCompletedSteps(req.params.id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const setCompletedStep = (req, res) => {
    // console.log("setCompletedStep")
    const lockKey = req.body.id;
    try {
        if (!lock.isBusy(lockKey)) {
            // console.log('111', lock.isBusy(lockKey))
            lock.acquire(lockKey, function (done) {
                // console.log('222', lock.isBusy(lockKey))
                progressProfileService.setCompletedStep(req.body)
                    .then(data => {
                        res.sendData(data);
                    })
                    .catch(err => {
                        res.sendError(err.message);
                    })
                done();
            }, function (err, ret) {
                // console.log('333', lock.isBusy(lockKey))
                err && console.error(err)
            });
        } else {
            console.log(`${lockKey} is now busy`)
            return res.status(422).send({ message: `${lockKey} is now busy` })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({ message: `Something went wrong. Please try again!` })
    }
};

const submitCompletedSteps = (req, res) => {
    progressProfileService.submitCompletedSteps(req.body)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};


module.exports = {
    getAllProgressProfile,
    getProgressProfileDetail,
    getCompletedSteps,
    setCompletedStep,
    submitCompletedSteps,
};
