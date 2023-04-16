const { entertainerCalendarService } = require("../../services");

module.exports = {
    getGoogleCalendarAuthUrl: (req, res) => {
        const redirect_uri = req.query.redirect_uri || "https://talenttown.com";
        let authUrl = entertainerCalendarService.getGoogleCalendarAuthUrl({ redirect_uri })
        res.sendData({ authUrl });
    },

    /**
     * body: code, redirect_uri
     */
    postGoogleCalendarAccessToken: (req, res) => {
        entertainerCalendarService.setGoogleCalendarToken({
            entertainer_id: req.params.entertainer_id,
            code: req.body.code,
            redirect_uri: req.body.redirect_uri,
        }).then(data => {
            res.sendData({
                google_calendar_token: data.google_calendar_token,
            })
        }).catch(err => {
            res.sendError(err.message);
        })
    },

    getGoogleCalendarEvents: (req, res) => {
        entertainerCalendarService.getGoogleCalendarEvents({
            entertainer_id: req.params.entertainer_id
        }).then(data => {
            res.sendData(data);

        }).catch(err => {
            res.sendError(err.message)
        })
    },

    getGigEvents: (req, res) => {
        entertainerCalendarService.getGigEvents(req.params.entertainer_id)
            .then(res.sendData)
            .catch(err => res.sendError(err.message));
    }
}