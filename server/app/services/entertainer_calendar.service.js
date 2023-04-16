const mongoose = require("mongoose");
const { GoogleCalendar } = require("../../google")

const Entertainer = mongoose.model("Entertainer");
const Gig = mongoose.model("Gig");

const isTTEvents = ev => {
    return ev.description.split(":")[0] === "Talent Town event"
}

module.exports = {
    getGoogleCalendarAuthUrl: ({ redirect_uri }) => {
        return GoogleCalendar({ redirect_uri }).generateAuthUrl();
    },

    setGoogleCalendarToken: ({ entertainer_id, code, redirect_uri }) => {
        return GoogleCalendar({ redirect_uri }).getToken(code).then(async token => {
            return Entertainer.findByIdAndUpdate(entertainer_id, {
                google_calendar_token: token
            }).then(doc => {
                if (doc) return Promise.resolve(doc);
                return Promise.reject(new Error("Entertainer not found!"))
            })
        })
    },

    getGoogleCalendarEvents: ({ entertainer_id }) => {
        return Entertainer.findById(entertainer_id).then(entertainer => {
            if (entertainer) {
                const token = entertainer.google_calendar_token;
                if (token && token.access_token) {
                    const googleCalendar = GoogleCalendar();
                    googleCalendar.setCredentials(token);

                    return googleCalendar.listEvents().then(events => {
                        return Promise.resolve(events.filter(isTTEvents).map(event => {
                            // return event;
                            return {
                                id: event.id,
                                created: event.created,
                                updated: event.updated,
                                start: event.start,
                                summary: event.summary,
                                description: event.description,
                                location: event.location,
                                start: event.start,
                                end: event.end,
                            }
                        }));
                    })
                } else return Promise.reject(new Error("Please connect with Google Calendar!"))
            } else {
                return Promise.reject(new Error("Entertainer not found!"))
            }
        })
    },

    getGigEvents: (entertainer_id) => {
        return new Promise((resolve, reject) => {
            Gig.find({
                entertainer_id
            })
            .then(data => {
                if (data == null) return reject("Entertainer not Found!");
                const events = data.map(gig => ({
                    gig_id: gig._id,
                    status: gig.status,
                    start: gig.start_time,
                    end: gig.end_time,
                    title: gig.title,
                    description: gig.description,
                    location: gig.location,
                }))
                resolve(events);
            })
        })
    }
}
