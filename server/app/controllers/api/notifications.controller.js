const { notificationService } = require("../../services");

const getUserNotifications = (req, res) => {
    notificationService.getUserNotifications(req.params.user_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
};
const readAllNotification = (req, res) => {
    notificationService.readAllNotification(req.params.user_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
};
const readNotificationByConversation = (req, res) => {
    notificationService.readNotificationByConversation(req.params.user_id, req.params.conver_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
};
const addNotification = (req, res) => {
    notificationService.addNotification(req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const getNotificationDetails = (req, res) => {
    notificationService.getNotificationDetails(req.params.id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const onReadNotification = (req, res) => {
    notificationService.onReadNotification(req.params.id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

module.exports = {
    getUserNotifications,
    addNotification,
    getNotificationDetails,
    onReadNotification,
    readAllNotification,
    readNotificationByConversation
};
