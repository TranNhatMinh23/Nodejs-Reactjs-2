const geolib = require("geolib");
const postcode = require('postcode-validator');
const request = require('request');

const GG_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY

const getDistance = (req, res) => {
    const { start_lat, start_long, end_lat, end_long } = req.params;
    request.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${end_lat},${end_long}&mode=driving&origins=${start_lat},${start_long}&key=${GG_MAP_API_KEY}`,
        function (err, httpResponse, body) {
            console.log(body)
            try {
                const data = JSON.parse(body);
                if (data.status === 'OK') {
                    res.sendData(geolib.convertDistance(data.rows[0].elements[0].distance.value, 'mi'));
                }
            } catch (error) {
                res.sendError(error.message);
            }
        })
};

const validateUKPostcode = (req, res) => {
    if (postcode.validate(req.params.postcode, "UK")) {
        res.sendData(true);
    } else {
        res.sendError({ message: "Invalid UK postcode!" });
    }
};

module.exports = {
    getDistance,
    validateUKPostcode
};
