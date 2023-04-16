const ProgressProfile = require("../../models/progress_profiles");
var mammoth = require("mammoth");
const moment = require("moment");
const { progressBarAlias }  = require("../../utils/constants");

createProgressProfile = async (req, res) => {
    if (req.method === "GET") {
      let response = {
        progressBarAlias,
        moment,
        titlePage: "New ProgressProfile",
        notification: {}
      };
  
      return res.render("admin/progress-profile/create", response);
    }
  
    if (req.method === "POST") {
      try {
        let data = req.body;
        if (data.alias == "") {
          return  res.status(500).send({ error: 'Alias name required!' });
        }   

        if (data.enable_after_all) {
          let getEnableAfter = await ProgressProfile.find({enable_after_all: true}).exec();
          if (getEnableAfter && getEnableAfter.length >= 1 ) {
            return  res.status(500).send({ error: 'Already have enable after all!' });
          }
        }

        const _file = req.file ? req.file.filename  : null;
        if (_file !==  null) {
          data.uncompleted_icon = _file;
        }
          let progress_profile = new ProgressProfile(data);
          progress_profile.save();
  
        let response = {
          progressBarAlias,
          moment,
          titlePage: "New Progress Bar",
          notification: {
            status: "success"
          }
        };
    
        return res.render("admin/progress-profile/create", response);
      } catch (err) {
        let response = {
          progressBarAlias,
          moment,
          titlePage: "New Progress Bar",
          notification: {
            status: "error"
          }
        };
    
        return res.render("admin/progress-profile/create", response);
      }
    }
  };
  
  allProgressProfile = async (req, res) => {
    try {
      let progress_profiles = await ProgressProfile.find().exec();
  
      let response = {
        notification: {},
        titlePage: "Manager Progress Bar",
        moment,
        progress_profiles
      };
  
      return res.render("admin/progress-profile/index", response);
    } catch (err) {
      console.log(err);
    }
  };
  
  // delete multi reocords
  deleteProgressProfileRecords = async (req, res) => {
    try {
      let data = req.body;
  
      let list_del = data._arr;
      list_del.map(async val => {
        const progress_profile = await ProgressProfile.deleteOne({ _id: val }, (err, result) => {
          if (err) return res.status(400).json({ status: "error" });
          console.log(result);
        }).exec();
      });
      return res.status(200).json({ status: "success" });
    } catch (err) {
      return res.status(400).json({ status: "error" });
    }
  };
  
  detailProgressProfile = async (req, res) => {
    const _id = req.params.id;
  
    if (req.method === "GET") {
      let progress_profile = await ProgressProfile.findById(_id).exec();
  
      let response = {
        progressBarAlias,
        moment,
        titlePage: "Progress Bar Detail",
        notification: {},
        progress_profile
      };
  
      return res.render("admin/progress-profile/detail", response);
    }
  
    if (req.method === "POST") {
      try {

      let data = req.body;
      if (data.alias == "") {
        return  res.status(500).send({ error: 'Alias name required!' });
      }

      let checkEnableAfter = await ProgressProfile.find({_id: data._id, enable_after_all: true}).exec();

      if (data.enable_after_all && checkEnableAfter.length <= 0) {
        let getEnableAfter = await ProgressProfile.find({ enable_after_all: true}).exec();
        if (getEnableAfter && getEnableAfter.length >= 1) {
          return  res.status(500).send({ error: 'Already have enable after all!' });
        }
      }

      const _file = req.file ? req.file.filename  : null;
      if (_file !==  null) {
        data.uncompleted_icon = _file;
      }

      data.enable_after_all = data.enable_after_all ? data.enable_after_all : false;
    
        let progress_profileUp = await ProgressProfile.findOneAndUpdate({ _id }, data ).exec();
        if (progress_profileUp) {
          let progress_profile = await ProgressProfile.findOne({ _id }).exec();
          
          let response = {
            progressBarAlias,
            moment,
            titlePage: "Progress Bar Detail",
            notification: {
              status: "success"
            },
            progress_profile
          };
      
          return res.render("admin/progress-profile/detail", response);
        }
      } catch (err) {
        let progress_profile = await ProgressProfile.findOne({ _id }).exec();
          let response = {
            progressBarAlias,
            moment,
            titlePage: "Progress Bar Detail",
            notification: {
              status: "error"
            },
            progress_profile
          };
      
          return res.render("admin/progress-profile/detail", response);
      }
    }
  };
  
  module.exports = {
    createProgressProfile,
    allProgressProfile,
    deleteProgressProfileRecords,
    detailProgressProfile
  };