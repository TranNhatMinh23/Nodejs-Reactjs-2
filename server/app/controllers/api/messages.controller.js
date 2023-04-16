const { messageService } = require("../../services");

const add = (req, res) => {
  messageService.add(req.body)
  .then(data => {
    res.sendData(data);
  })
  .catch(err => {
    res.sendError(err.message);
  })
};

const get = (req, res) => {
  messageService.get(req.params.id)
  .then(data => {
    res.sendData(data);
  })
  .catch(err => {
    res.sendError(err.message);
  })
};

module.exports = {
  add,
  get
};
