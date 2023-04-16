const { contactService } = require("../../services");

const addContact = (req, res) => {
    contactService.creatContact(req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

module.exports = {
    addContact
};
