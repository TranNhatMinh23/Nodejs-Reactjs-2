const mongoose = require("mongoose");
const ProgressProfile = mongoose.model("ProgressProfile");
const Entertainer = mongoose.model("Entertainer");
const { systemLogger } = require('../utils/log');

const getAllProgressProfile = () => {
    return new Promise((resolve, reject) => {
        ProgressProfile.find({ status: "Active" }).then(doc => {
            if (doc == null) throw new Error("ProgressProfile not found !");
            resolve(doc);
        })
            .catch(err => {
                reject(err);
            })
    })
}

const getCompletedSteps = async (id) => {
    return new Promise((resolve, reject) => {
        Entertainer.findById(id).select('completed_steps').lean()
            .then(doc => {
                if (doc == null) throw new Error("ProgressProfile not found !");
                resolve(doc.completed_steps);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const setCompletedStep = async (body) => {
    const entertainer = await Entertainer.findById(body.id).select('completed_steps user_id').populate("user_id");
    if (entertainer == null) throw new Error("Entertainer not found !");
    const allSteps = await ProgressProfile.find({ status: "Active" });
    // console.log(entertainer.completed_steps.length, allSteps.length)
    const pgProfile = await ProgressProfile.findOne({ alias: body.alias }).select('_id').lean();

    if (pgProfile && entertainer.completed_steps.length < allSteps.length && entertainer.completed_steps.indexOf(pgProfile._id) == -1) {
        entertainer.completed_steps.push(pgProfile._id)
        await entertainer.save();
    }

    return new Promise((resolve, reject) => {
        ProgressProfile.findOne({ alias: body.alias }).then(doc => {
            if (doc == null) throw new Error("ProgressProfile not found !");
            resolve(doc);
        })
            .catch(err => {
                reject(err);
            })
    })
}

const submitCompletedSteps = (body) => {
    return new Promise(async (resolve, reject) => {
        if (body.id) {
            try {
                const entertainer = await Entertainer.findById(body.id);
                entertainer.submit_progress_bar = true;
                entertainer.submit_progress_bar_updated_at = new Date();
                await entertainer.save();
                systemLogger.info(`[SUCCESS] - Talent ${body.id} submitted profile.`)
                resolve(true)
            } catch (error) {
                systemLogger.error(`[ERROR] - Talent ${body.id} submitted profile, ${error.message || 'error'}`)
                reject(error)
            }
        } else {
            systemLogger.error(`Invalid entertainer._id when submit profile: ${body.id}`)
            reject({ message: `Invalid entertainer._id when submit profile: ${body.id}` })
        }
    })
}

const getProgressProfileDetail = (id) => {
    return new Promise((resolve, reject) => {
        ProgressProfile.findById(id)
            .then(doc => {
                if (doc == null) throw new Error("ProgressProfile not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    getAllProgressProfile,
    getProgressProfileDetail,
    getCompletedSteps,
    setCompletedStep,
    submitCompletedSteps,
}