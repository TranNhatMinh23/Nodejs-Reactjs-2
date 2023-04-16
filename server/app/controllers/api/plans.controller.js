const { planService } = require("../../services");
const { historyService } = require("../../services");
const { updateUserStuff } = require("../../services").userService;

const getAllPlans = (req, res) => {
  planService.getAllPlans()
    .then(data => {
      res.sendData(data);
    })
    .catch(err => {
      res.sendError(err.message);
    })
};

const purchasePlan = (req, res) => {
  // payinMethod: DIRECT_PAYIN || WEB_PAYIN
  // payinSuccess: false || true
  planService.purchasePlan(req.user.user_id._id, req.body, req.headers.origin)
    .then(data => {
      if (data.subscribe_status === 'SUCCESS') {
        if (data.plan && data.plan.monthy_price > 0) {
          historyService.addHistory(req.user.user_id._id, {
            type: 'SUBSCRIPTION',
            description: 'Monthly Subscription',
            amount: data.plan.monthy_price
          })
            .then(_ => {
              res.sendData("Successful");
            })
            .catch(err => {
              res.sendError(err.message);
            })
        } else {
          res.sendData("Successfully subscribed");
        }
      } else {
        res.sendData(data)
      }
    })
    .catch(err => {
      res.sendError(err.message);
    })
}

const deletePlan = (req, res) => {
  planService.deletePlan(req.body)
    .then(data => {
      res.sendData(data);
    })
    .catch(err => {
      res.sendError(err.message);
    })
}

const setPlanForTalent = async (req, res) => {
  try {
    let plan_id = req.user.user_id.stuff_info.pending_plan_id;
    let user_id = req.user.user_id._id;
    if (plan_id) {
      let entertainer_id = req.user._id;
      await planService.setPlanForTalent(entertainer_id, plan_id)
        .then(async data => {
          await updateUserStuff(user_id, "pending_plan_id", plan_id, true);
          res.sendData(data);
        })
        .catch(err => {
          res.sendError(err.message);
        })
    } else {
      res.sendError({ message: "Pending plan does not exist !" });
    }
  } catch (err) {
    res.sendError({ message: err.message });
  }
}

module.exports = {
  getAllPlans,
  purchasePlan,
  deletePlan,
  setPlanForTalent
};
