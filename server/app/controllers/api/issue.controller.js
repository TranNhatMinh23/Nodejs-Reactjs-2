const { issueService } = require("../../services");

const getAllIssue = (req, res) => {
  issueService.getAllIssue()
  .then(data => {
    res.sendData(data);
  })
  .catch(err => {
    res.sendError(err.message);
  })
};

module.exports = {
  getAllIssue
};
