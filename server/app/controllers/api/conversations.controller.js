const { conversationService } = require("../../services");

const getAllUserConversations = (req, res) => {
    conversationService.getAllUserConversations(req.params.key, req.params.value)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const getConversationDetail = (req, res) => {
    conversationService.getConversationDetail(req.params.id, req.query.page)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getConversationDetailByCusAndTalent = (req, res) => {
    conversationService.getConversationByCustomerAndEntertainer(req.params.cusId, req.params.talentId)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const addConversation = (req, res) => {
    conversationService.add(req.body)
        .then(res.sendData)
        .catch(res.sendError);
}

const editConversation = (req, res) => {
    conversationService.edit(req.params.id, req.body)
        .then(res.sendData)
        .catch(res.sendError);
}

const delConversation = (req, res) => {
    conversationService.del(req.params.id)
        .then(res.sendData)
        .catch(res.sendError);
}

module.exports = {
    getAllUserConversations,
    getConversationDetail,
    getConversationDetailByCusAndTalent,
    addConversation,
    editConversation,
    delConversation
};
