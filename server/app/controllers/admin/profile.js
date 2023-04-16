const mongoose = require("mongoose");
const User = mongoose.model("User");
const Entertainer = mongoose.model("Entertainer");
const moment = require("moment");
// const passwordHash = require("password-hash");
const bcrypt = require("bcryptjs");

viewProfile = async (req, res) => {
  try {
    const _id = req.user._id;

    let user = await User.findById(_id).exec();
    if (!user) throw new Error("User not found!");

    let _data = {
      titlePage: "Profile",
      user,
      moment,
      notification: {}
    };
    return res.render("admin/profile/index", _data);
  } catch (err) {
    return res.redirect("/admin/login");
  }
};

upadteProfile = async (req, res) => {
  try {
    const _id = req.user._id;
    const _data = req.body;

    console.log(_data);

    // console.log("****************")
    // console.log(req.body)
    // console.log("****************")

    // let user = await User.findOne({ _id }).exec();
    // let social = user.social;

    // console.log(social)
    // console.log("---------------------")

    if (_data.password == "") {
      delete _data.password;
      delete _data.re_password;
    } else {
      // const hashedPassword = passwordHash.generate(_data.password);
      _data.password = bcrypt.hashSync(_data.password, 10);
      delete _data.re_password;
    }

    // if(_data.facebook) {
    //   let fb = user.social.filter(el => {
    //     return el.name == "facebook";
    //   });
    //   console.log(fb);

    // }

    // if(_data.facebook != "") {
    //   let fb = await User.update(
    //     { _id, social.$.name: "facebook" },
    //     {
    //       $set
    //     }
    //   )
    // }

    // for(let i = 0; i < social.length; i++){
    //   let _obj = social[i];
    //   console.log("++++++++++++++++++++++++")
    //   console.log(_obj)
    //   if(social.name == "facebook"){
    //     _obj.link = req.body.facebook;
    //     console.log("facebook");
    //     console.log(_obj);
    //     social[i] = _obj;
    //     console.log(social[i]);
    //   }
    //   if(social.name == "youtube"){
    //     _obj.link = req.body.youtube;
    //     console.log("youtube");
    //     console.log(_obj);
    //     social[i] = _obj;
    //     console.log(social[i]);
    //   }
    //   if(social.name == "linkedin"){
    //     _obj.link = req.body.linkedin;
    //     console.log("linkedin");
    //     console.log(_obj);
    //     social[i] = _obj;
    //     console.log(social[i]);
    //   }
    //   if(social.name == "twitter"){
    //     _obj.link = req.body.twitter;
    //     console.log("twitter");
    //     console.log(_obj);
    //     social[i] = _obj;
    //     console.log(social[i]);
    //   }
    //   if(social.name == "instagram"){
    //     _obj.link = req.body.instagram;
    //     console.log("instagram");
    //     console.log(_obj);
    //     social[i] = _obj;
    //     console.log(social[i]);
    //   }
    // }

    let user = await User.findOneAndUpdate(
      { _id },
      { $set: _data },
      (err, response) => {
        console.log(response);
        if (err) throw err;
      }
    ).exec();

    let result = {
      titlePage: "Profile",
      user,
      moment,
      notification: {
        status: "success",
        action: "update-info",
        msg: "Successfully updated"
      }
    };

    return res.render("admin/profile/index", result);
  } catch (err) {
    let result = {
      titlePage: "Profile",
      moment,
      notification: {
        status: "error",
        action: "update-info",
        msg: "Updated Profile error!"
      }
    };

    return res.render("admin/profile/index", result);
  }
};

// change avatar
changeAvatar = async (req, res) => {
  try {
    const _id = req.user._id;
    const _file = req.file;
    const avatar = `/uploads/${_file.filename}`;
    let user = await User.findOneAndUpdate(
      { _id },
      { $set: { avatar } },
      (err, response) => {
        console.log(response);
        if (err) throw err;
      }
    );

    let result = {
      titlePage: "Profile",
      user,
      moment,
      notification: {
        status: "success",
        action: "change-avatar",
        msg: "Successfully updated"
      }
    };

    (await user.avatar) && (req.session.URL_AVATAR = user.avatar);
    (await user.avatar) && (req.app.locals.URL_AVATAR = user.avatar);

    return res.render("admin/profile/index", result);

    // return res.redirect("/admin/profile");
  } catch (err) {
    let result = {
      titlePage: "Profile",
      moment,
      notification: {
        status: "error",
        action: "change-avatar",
        msg: "Successfully updated"
      }
    };

    return res.render("admin/profile/index", result);
  }
};

// logout account
logoutAccount = (req, res) => {
  req.session.token = null;

  return res.redirect("/admin/login");
};

module.exports = {
  viewProfile,
  upadteProfile,
  changeAvatar,
  logoutAccount
};
