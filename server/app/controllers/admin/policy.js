const Policy = require("../../models/policies");
var mammoth = require("mammoth");
const moment = require("moment");
const config = require("../../../config/index");

createPolicy = async (req, res) => {
    if (req.method === "GET") {
      let response = {
        moment,
        titlePage: "New Policy",
        notification: {}
      };
  
      return res.render("admin/policy/create", response);
    }
  
    if (req.method === "POST") {
      try {

         let data = req.body;
         const _file = req.file ? req.file.filename  : null;
         if (_file !==  null) {
          mammoth.convertToHtml({path: config.ROOT + `/assets/uploads/${_file}`})
           .then(function(result){
               let html = result.value; 
               data.content = html;
               let policy = new Policy(data);
               policy.save();
           })
          .done();
        } else {
          data.content = "";
          let policy = new Policy(data);
          policy.save();
        }
  
        let response = {
          moment,
          titlePage: "New Policy",
          notification: {
            status: "success"
          }
        };
    
        return res.render("admin/policy/create", response);
      } catch (err) {
        let response = {
          moment,
          titlePage: "New Policy",
          notification: {
            status: "error"
          }
        };
    
        return res.render("admin/policy/create", response);
      }
    }
  };
  
  allPolicy = async (req, res) => {
    try {
      let privacies = await Policy.find().exec();
  
      let response = {
        notification: {},
        titlePage: "Manager Policy",
        moment,
        privacies
      };
  
      return res.render("admin/policy/index", response);
    } catch (err) {
      console.log(err);
    }
  };
  
  // delete multi reocords
  deletePolicyRecords = async (req, res) => {
    try {
      let data = req.body;
  
      let list_del = data._arr;
      list_del.map(async val => {
        const policy = await Policy.deleteOne({ _id: val }, (err, result) => {
          if (err) return res.status(400).json({ status: "error" });
          // console.log(result);
        }).exec();
      });
      return res.status(200).json({ status: "success" });
    } catch (err) {
      return res.status(400).json({ status: "error" });
    }
  };
  
  detailPolicy = async (req, res) => {
    const _id = req.params.id;
  
    if (req.method === "GET") {
      let policy = await Policy.findById(_id).exec();
  
      let response = {
        moment,
        titlePage: "Policy Detail",
        notification: {},
        policy
      };
  
      return res.render("admin/policy/detail", response);
    }
  
    if (req.method === "POST") {
      try {
        let data = req.body;
     
        let policyUp = await Policy.findOneAndUpdate({ _id }, data ).exec();
        if (policyUp) {
          let policy = await Policy.findOne({ _id }).exec();
          
          let response = {
            moment,
            titlePage: "Policy Detail",
            notification: {
              status: "success"
            },
            policy
          };
      
          return res.render("admin/policy/detail", response);
        }
      } catch (err) {
        let policy = await Policy.findOne({ _id }).exec();
          let response = {
            moment,
            titlePage: "Policy Detail",
            notification: {
              status: "error"
            },
            policy
          };
      
          return res.render("admin/policy/detail", response);
      }
    }
  };
  
  module.exports = {
    createPolicy,
    allPolicy,
    deletePolicyRecords,
    detailPolicy
  };