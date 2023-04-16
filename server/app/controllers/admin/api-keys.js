const {
    envApiKeys
} = require("../../utils")

const { apiKeyService } = require("../../services")

const get = (req, res) => {
    const { name } = req.query
    if (name) {
        res.json({
            data: envApiKeys.getEnvApiKey(name)
        })
    } else {
        res.json({
            data: envApiKeys.getEnvApiKeys()
        })
    }
}

const create = (req, res) => {
    const { name, plaintext } = req.query
    if (name && plaintext) {
        apiKeyService.addApiKey({ name, plaintext }).then(data => {
            res.json(data)
        }).catch(err => {
            res.json({
                status: 400,
                error: err.message
            })
        })
    } else {
        res.json({
            status: 400,
            error: 'missing field'
        })
    }
}

const del = (req, res) => {
    const { name } = req.query
    if (name) {
        apiKeyService.delApiKey(name).then(data => {
            res.json(data)
        }).catch(err => {
            res.json({
                status: 400,
                error: err.message
            })
        })
    } else {
        res.json({
            status: 400,
            error: 'missing field'
        })
    }
}

module.exports = {
    get,
    create,
    del
};
