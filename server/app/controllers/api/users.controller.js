const { userService } = require("../../services");
const { jwtToken } = require("../../utils/func");

const path = require('path');
// require the image processor
const imageProcessor = path.resolve(__dirname, '../../../config/middleware/imageProcessor.js');
function compressImage(imageUrl) {
    // We need to spawn a child process so that we do not block 
    // the EventLoop with cpu intensive image manipulation 
    let childProcess = require('child_process').fork(imageProcessor);
    childProcess.on('message', function (message) {
        console.log(message);
    });
    childProcess.on('error', function (error) {
        console.error(error.stack)
    });
    childProcess.on('exit', function () {
        console.log('Avatar-uploading process exited');
    });
    childProcess.send(imageUrl);
}

const getUser = (req, res) => {
    let id = req.params.id;
    userService.getUser(id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendData(err.message, res.CODE.BAD_REQUEST);
        })
}

const updateUser = (req, res) => {
    let id = req.params.id;
    const avatarUploaded = req.file;
    if (avatarUploaded) {
        compressImage(avatarUploaded.path);
    }
    userService.updateUser(id, {
        ...req.body,
        file: avatarUploaded
    })
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const sendVerifyToken = (req, res) => {
    userService.sendVerifyToken(req.user.user_id._id, req.headers.origin)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getUserToken = (data) => {
    return jwtToken({ _id: data._id, user_id: { role: data.user_id.role, _id: data.user_id._id } });
}

const verifyEmail = (req, res) => {
    userService.verifyEmail(req.query.email, req.query.token)
        .then(entertainerData => {
            res.sendData({
                token: getUserToken(entertainerData)
            });
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const changePassword = (req, res) => {
    let id = req.params.id;
    let oldPass = req.body.old_pass;
    let newPass = req.body.new_pass;
    let newPassRetype = req.body.new_pass_retype;

    userService.changePassword(id, oldPass, newPass, newPassRetype)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const sendReferFriendMail = async (req, res) => {
    const { id, email } = req.body;

    await userService.sendMailReferFriend(id, email)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

module.exports = {
    getUser,
    updateUser,
    sendVerifyToken,
    verifyEmail,
    changePassword,
    sendReferFriendMail
}