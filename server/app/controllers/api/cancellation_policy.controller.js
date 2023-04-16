const { cancellationPolicyService } = require("../../services");

const getAllCancellationPolicies = (req, res) => {
    cancellationPolicyService.getAllCancellationPolicies()
  .then(data => {
    res.sendData(data);
  })
  .catch(err => {
    res.sendError(err.message);
  })
};

const getDetail = (req, res) => {
  cancellationPolicyService.getDetail(req.params.id)
.then(data => {
  res.sendData(data);
})
.catch(err => {
  res.sendError(err.message);
})
};

const setCancellationPolicy = (req, res) => {
    cancellationPolicyService.setCancellationPolicy(req.body, res.userDevice)
  .then(data => {
    res.sendData(data);
  })
  .catch(err => {
    res.sendError(err.message);
  })
}
module.exports = {
  getAllCancellationPolicies,
  setCancellationPolicy,
  getDetail
};
