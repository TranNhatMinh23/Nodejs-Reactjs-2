const ApiKey = require('../models/api_keys')
const RSA = require('../utils/rsa')
const config = require('../../config')
const {
    envApiKeys
} = require('../utils')

const getApiKey = (name) => {
    return ApiKey.findOne({ name }).then(apiKey => {
        if (apiKey) {
            return apiKey
        }
        else return Promise.reject(new Error('Api Key not found'))
    })
}

const getApiKeys = () => ApiKey.find({})

const addApiKey = ({ name, plaintext }) => {
    return new Promise((resolve, reject) => {
        try {
            getApiKey(name)
                .then(_ => reject(new Error('Api Key has already existed')))
                .catch(_ => {
                    const apiKey = new ApiKey({
                        name,
                        encrypted: RSA.encryptStringWithRsaPublicKey(plaintext, config.PATH_PUBLIC_KEY)
                    })
                    apiKey.save().then(_ => {
                        envApiKeys.setEnvApiKey({
                            name,
                            decrypted: plaintext
                        })
                        resolve(_)
                    }).catch(reject)
                })
        } catch (err) {
            reject(err)
        }
    })
}

const delApiKey = (name) => {
    return new Promise((resolve, reject) => {
        try {
            ApiKey.deleteOne({
                name
            }).then(_ => {
                if (_.ok && _.deletedCount > 0) {
                    envApiKeys.delEnvApiKey(name)
                    resolve(_)
                }
                else reject(new Error("Api key not found"))
            }).catch(reject)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    getApiKey,
    getApiKeys,
    addApiKey,
    delApiKey
}