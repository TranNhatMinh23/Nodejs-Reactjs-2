const Entertainer = require('../models/entertainers');
const Customer = require('../models/customers');
const GigBill = require('../models/gig_bills');
const { systemLogger } = require('../utils/log');
const moment = require('moment');

const dataAnalytics = async (filter) => {
    const { fromDate, toDate } = filter;
    let query = {};
    let fromDateHour = new Date(fromDate);
    fromDateHour.setHours(00, 00, 00, 00)
    let toDateHour = new Date(toDate);
    toDateHour.setHours(23, 59, 59, 00)
    if (fromDate && toDate) {
        query['createdAt'] = { $gte: fromDateHour, $lte: toDateHour }
    }
    console.log({ query })
    try {
        const talents = await Entertainer.find(query)
            .select('plan_id publish_status publish_status_updated_at submit_progress_bar submit_progress_bar_updated_at user_id createdAt')
            .populate({
                path: "plan_id",
                select: "name",
            })
            .populate({
                path: "act_type_id",
                select: "categoryName"
            })
            .populate({
                path: "user_id",
                select: "status status_updated_at first_name last_name email phone activated_at"
            })
            .lean();
        const totalTalents = talents.length;
        const talentsLive = talents.filter(t => t.publish_status.trim() === 'accepted' && t.submit_progress_bar);
        const numOfTalentsLive = talentsLive.length;
        const numOfTalentsLiveLegend = talentsLive.filter(t => t.plan_id.name.trim() === 'Legend').length;
        const numOfTalentsLiveSuperstar = talentsLive.filter(t => t.plan_id.name.trim() === 'Superstar').length;

        const talentsRequested = talents.filter(t => t.publish_status.trim() === 'default' && t.submit_progress_bar);
        const numOfTalentsRequested = talentsRequested.length;
        const numOfTalentsRequestedLegend = talentsRequested.filter(t => t.plan_id.name.trim() === 'Legend').length;
        const numOfTalentsRequestedSuperstar = talentsRequested.filter(t => t.plan_id.name.trim() === 'Superstar').length;

        const talentsActive = talents.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'active' && !t.submit_progress_bar
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsBlocked = talents.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'blocked' || t.publish_status.trim() === 'rejected'
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const numOfMusicalAct = talentsLive.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'musical act').length;
        const numOfEntertainer = talentsLive.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'entertainer').length;
        const numOfPhotographer = talentsLive.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'photographer / videographer').length;
        const numOfMakeupAirtist = talentsLive.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'make up artist').length;

        const talentsNow = await Entertainer.find()
            .select('plan_id publish_status publish_status_updated_at submit_progress_bar submit_progress_bar_updated_at user_id createdAt')
            .populate({
                path: "plan_id",
                select: "name",
            })
            .populate({
                path: "act_type_id",
                select: "categoryName"
            })
            .populate({
                path: "user_id",
                select: "status status_updated_at first_name last_name email phone activated_at"
            })
            .lean();

        const talentsToday = talentsNow.filter(t => t.createdAt && moment(t.createdAt).isSame(Date.now(), 'day'));
        const totalTalentsToday = talentsToday.length;
        const talentsLiveToday = talentsNow.filter(t => t.publish_status.trim() === 'accepted' && t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(Date.now(), 'day'));
        const numOfTalentsLiveToday = talentsLiveToday.length;
        const numOfTalentsLiveLegendToday = talentsLiveToday.filter(t => t.plan_id.name.trim() === 'Legend').length;
        const numOfTalentsLiveSuperstarToday = talentsLiveToday.filter(t => t.plan_id.name.trim() === 'Superstar').length;

        const talentsRequestedToday = talentsNow.filter(t => t.submit_progress_bar_updated_at && moment(t.submit_progress_bar_updated_at).isSame(Date.now(), 'day') && t.publish_status.trim() === 'default' && t.submit_progress_bar);
        const numOfTalentsRequestedToday = talentsRequestedToday.length;
        const numOfTalentsRequestedLegendToday = talentsRequestedToday.filter(t => t.plan_id.name.trim() === 'Legend').length;
        const numOfTalentsRequestedSuperstarToday = talentsRequestedToday.filter(t => t.plan_id.name.trim() === 'Superstar').length;

        const talentsActiveToday = talentsNow.filter(t => {
            if (t.user_id && t.user_id.status) return t.user_id.status === 'active' && t.user_id.status_updated_at && moment(t.user_id.status_updated_at).isSame(Date.now(), 'day')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id or status`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsBlockedToday = talentsNow.filter(t => {
            if (t.user_id && t.user_id.status) return (t.user_id.status === 'blocked' && t.user_id.status_updated_at && moment(t.user_id.status_updated_at).isSame(Date.now(), 'day')) || (t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(Date.now(), 'day') && t.publish_status.trim() === 'rejected')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id or status`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const numOfMusicalActToday = talentsLiveToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'musical act').length;
        const numOfEntertainerToday = talentsLiveToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'entertainer').length;
        const numOfPhotographerToday = talentsLiveToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'photographer / videographer').length;
        const numOfMakeupAirtistToday = talentsLiveToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'make up artist').length;

        // ===== CUSTOMER =====
        const customers = await Customer.find(query)
            .populate({
                path: "user_id",
                select: "status last_login_at"
            })
            .lean();
        const totalCustomers = customers.length;
        const customersActive = customers.filter(c => {
            if (c.user_id) return c.user_id.status === 'active' && c.user_id.last_login_at > new Date(moment().subtract(30, 'days'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Customer ${c._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length;

        // numOfGigs is equal to numOfGigBills
        const gigbills = await GigBill.find(query)
            .populate({
                path: 'gig_id',
                select: 'status'
            })
            .lean();
        const badStatus = ['declined', 'cancelled', 'canceled_by_customer', 'canceled_by_talent', 'error'];
        const OKgigbills = gigbills.filter(b => {
            if (b.gig_id) return !badStatus.includes(b.gig_id.status)
            else {
                systemLogger.info(`[ADMIN ANALYTICS], GigBill ${b._id} has invalid gig_id`)
                GigBill.findByIdAndDelete(b._id).exec()
            }
        });
        const totalGigBills = OKgigbills.length;
        let GMV = 0;
        let takeRate = 0;
        let referPay = 0;
        if (totalGigBills > 0) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            GMV = OKgigbills.map(b => b.customer_will_pay).reduce(reducer).toFixed(2);
            takeRate = OKgigbills.map(b => b.customer_will_pay - b.entertainer_will_receive).reduce(reducer).toFixed(2);
            referPay = OKgigbills.map(b => b.refer_pay).reduce(reducer).toFixed(2);
        }

        return {
            entertainer: {
                totalTalents,
                numOfTalentsLive,
                numOfTalentsLiveLegend,
                numOfTalentsLiveSuperstar,
                numOfTalentsRequested,
                numOfTalentsRequestedLegend,
                numOfTalentsRequestedSuperstar,
                talentsActive,
                talentsBlocked,
                numOfMusicalAct,
                numOfEntertainer,
                numOfPhotographer,
                numOfMakeupAirtist,
                totalTalentsToday,
                numOfTalentsLiveToday,
                numOfTalentsLiveLegendToday,
                numOfTalentsLiveSuperstarToday,
                numOfTalentsRequestedToday,
                numOfTalentsRequestedLegendToday,
                numOfTalentsRequestedSuperstarToday,
                talentsActiveToday,
                talentsBlockedToday,
                numOfMusicalActToday,
                numOfEntertainerToday,
                numOfPhotographerToday,
                numOfMakeupAirtistToday,
            },
            customer: {
                totalCustomers,
                customersActive,
                totalGigBills,
                GMV,
                takeRate,
                referPay,
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const downloadAnalytics = async () => {
    try {
        const talents = await Entertainer.find()
            .select('views plan_id publish_status publish_status_updated_at submit_progress_bar submit_progress_bar_updated_at user_id createdAt conversations')
            .populate({
                path: "plan_id",
                select: "name",
            })
            .populate({
                path: "act_type_id",
                select: "categoryName"
            })
            .populate({
                path: "gigbills",
                // select: "_id"
            })
            .populate({
                path: "conversations",
                select: "_id"
            })
            .populate({
                path: "user_id",
                select: "status status_updated_at first_name last_name email phone activated_at histories messages last_login_at",
                populate: {
                    path: "histories",
                    model: "Historie",
                    select: 'type amount'
                },
                // populate: {
                //     path: "messages",
                //     model: "Message",
                //     select: '_id'
                // }
            })
            .lean();
        const totalTalents = talents.length.toString();
        const talentsLive = talents.filter(t => t.publish_status.trim() === 'accepted' && t.submit_progress_bar);
        const numOfTalentsLive = talentsLive.length.toString();
        const numOfTalentsLiveLegend = talentsLive.filter(t => t.plan_id.name.trim() === 'Legend').length.toString();
        const numOfTalentsLiveSuperstar = talentsLive.filter(t => t.plan_id.name.trim() === 'Superstar').length.toString();

        const talentsRequested = talents.filter(t => t.publish_status.trim() === 'default' && t.submit_progress_bar);
        const numOfTalentsRequested = talentsRequested.length.toString();
        // const numOfTalentsRequestedLegend = talentsRequested.filter(t => t.plan_id.name.trim() === 'Legend').length.toString();
        // const numOfTalentsRequestedSuperstar = talentsRequested.filter(t => t.plan_id.name.trim() === 'Superstar').length.toString();

        const talentsActiveList = talents.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'active' && !t.submit_progress_bar
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        })

        const talentsActive = talentsActiveList.length.toString();

        const talentsActiveLastWeek = talents.filter(t => {
            if (t.user_id) return t.user_id.status === 'active' && t.user_id.last_login_at >= new Date(moment().subtract(7, 'days'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length.toString();

        const talentsActiveLastTwoWeeks = talents.filter(t => {
            if (t.user_id) return t.user_id.status === 'active' && t.user_id.last_login_at >= new Date(moment().subtract(14, 'days'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length.toString();

        const talentsActiveMoreThanTwoWeeks = talents.filter(t => {
            if (t.user_id) return t.user_id.status === 'active' && t.user_id.last_login_at < new Date(moment().subtract(14, 'days'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length.toString();

        const talentsBlockedList = talents.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'blocked' || t.publish_status.trim() === 'rejected'
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        })

        const talentsBlocked = talentsBlockedList.length.toString();

        const numOfMusicalAct = talents.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'musical act').length.toString();
        const numOfEntertainer = talents.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'entertainer').length.toString();
        const numOfPhotographer = talents.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'photographer / videographer').length.toString();
        const numOfMakeupAirtist = talents.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'make up artist').length.toString();

        const talentsToday = talents.filter(t => t.createdAt && moment(t.createdAt).isSame(Date.now(), 'day'));
        // const totalTalentsToday = talentsToday.length.toString();
        const talentsLiveToday = talents.filter(t => t.publish_status.trim() === 'accepted' && t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(Date.now(), 'day'));
        const numOfTalentsLiveToday = talentsLiveToday.length.toString();
        const numOfTalentsLiveLegendToday = talentsLiveToday.filter(t => t.plan_id.name.trim() === 'Legend').length.toString();
        const numOfTalentsLiveSuperstarToday = talentsLiveToday.filter(t => t.plan_id.name.trim() === 'Superstar').length.toString();

        const talentsRequestedToday = talents.filter(t => t.submit_progress_bar_updated_at && moment(t.submit_progress_bar_updated_at).isSame(Date.now(), 'day') && t.publish_status.trim() === 'default' && t.submit_progress_bar);
        const numOfTalentsRequestedToday = talentsRequestedToday.length.toString();
        const numOfTalentsRequestedLegendToday = talentsRequestedToday.filter(t => t.plan_id.name.trim() === 'Legend').length.toString();
        const numOfTalentsRequestedSuperstarToday = talentsRequestedToday.filter(t => t.plan_id.name.trim() === 'Superstar').length.toString();

        const talentsActiveTodayList = talents.filter(t => {
            if (t.user_id && t.user_id.status) return t.user_id.status === 'active' && t.user_id.status_updated_at && moment(t.user_id.status_updated_at).isSame(Date.now(), 'day')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id or status`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        });
        const talentsActiveToday = talentsActiveTodayList.length.toString();

        const talentsBlockedTodayList = talents.filter(t => {
            if (t.user_id && t.user_id.status) return (t.user_id.status === 'blocked' && t.user_id.status_updated_at && moment(t.user_id.status_updated_at).isSame(Date.now(), 'day')) || (t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(Date.now(), 'day') && t.publish_status.trim() === 'rejected')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id or status`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        });

        const talentsBlockedToday = talentsBlockedTodayList.length.toString();

        const numOfMusicalActToday = talentsToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'musical act').length.toString();
        const numOfEntertainerToday = talentsToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'entertainer').length.toString();
        const numOfPhotographerToday = talentsToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'photographer / videographer').length.toString();
        const numOfMakeupAirtistToday = talentsToday.filter(t => t.act_type_id.categoryName.trim().toLowerCase() === 'make up artist').length.toString();


        await Promise.all(talents.map(t => {
            return new Promise((rs, rj) => {
                t['numOfGigs'] = t.gigbills.length.toString();
                t['valueOfGigs'] = '0';
                t['commission'] = '0';
                t['trustsupport'] = '0';
                t['monthly'] = '0';
                let value = 0;
                let commiss = 0;
                let trust = 0;
                let monthly = 0;
                const reducer = (accumulator, currentValue) => accumulator + currentValue;

                if (t.user_id && t.user_id.histories && t.user_id.histories.length > 0) {
                    monthly = t.user_id.histories.map(h => h.amount).reduce(reducer).toFixed(2);
                    t['monthly'] = monthly.toString();
                }
                if (t.gigbills.length > 0) {
                    value = t.gigbills.map(h => h.entertainer_will_receive).reduce(reducer).toFixed(2);
                    commiss = t.gigbills.map(h => h.entertainer_commission_fee).reduce(reducer).toFixed(2);
                    trust = t.gigbills.map(h => h.entertainer_trust_and_support_fee).reduce(reducer).toFixed(2);
                    t['valueOfGigs'] = value.toString();
                    t['commission'] = commiss.toString();
                    t['trustsupport'] = trust.toString();
                    // rs();
                }
                rs()
            })
        }))


        // ===== CUSTOMER =====
        const customers = await Customer.find()
            .populate({
                path: "user_id",
                select: "status last_login_at first_name last_name email phone"
            })
            .populate({
                path: "gigbills",
                model: "GigBill",
                options: { sort: { 'createdAt': -1 } },
                populate: {
                    path: "gig_id",
                    model: "Gig",
                    select: "status"
                }
            })
            .lean();
        const totalCustomers = customers.length.toString();

        const customersActiveToday = customers.filter(c => {
            if (c.user_id) return c.user_id.status === 'active' && c.createdAt && moment(c.createdAt).isSame(Date.now(), 'day')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Customer ${c._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length.toString();

        const customersActiveList = customers.filter(c => {
            if (c.user_id) return c.user_id.status === 'active'
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Customer ${c._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        });
        const customersActive = customersActiveList.length.toString();

        const customersActiveLastWeek = customers.filter(c => {
            if (c.user_id) return c.user_id.status === 'active' && c.user_id.last_login_at >= new Date(moment().subtract(7, 'days'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Customer ${c._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length.toString();
        const customersActiveLastTwoWeeks = customers.filter(c => {
            if (c.user_id) return c.user_id.status === 'active' && c.user_id.last_login_at >= new Date(moment().subtract(14, 'days'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Customer ${c._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length.toString();
        const customersActiveMoreThanTwoWeeks = customers.filter(c => {
            if (c.user_id) return c.user_id.status === 'active' && c.user_id.last_login_at < new Date(moment().subtract(14, 'days'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Customer ${c._id} has invalid user_id`)
                Customer.findByIdAndDelete(c._id).exec()
            }
        }).length.toString();

        // numOfGigs is equal to numOfGigBills
        const gigbills = await GigBill.find()
            .populate({
                path: 'gig_id',
                select: 'status'
            })
            .lean();
        const badStatus = ['declined', 'cancelled', 'canceled_by_customer', 'canceled_by_talent', 'error'];
        // const OKgigbills = gigbills.filter(b => !badStatus.includes(b.gig_id.status));
        const OKgigbills = gigbills.filter(b => {
            if (b.gig_id) return !badStatus.includes(b.gig_id.status)
            else {
                systemLogger.info(`[ADMIN ANALYTICS], GigBill ${b._id} has invalid gig_id`)
                GigBill.findByIdAndDelete(b._id).exec()
            }
        });
        const gigbillsTodayList = OKgigbills.filter(b => b.createdAt && moment(b.createdAt).isSame(Date.now(), 'day'));
        const gigbillsToday = gigbillsTodayList.length.toString();
        const totalGigBills = OKgigbills.length.toString();
        let GMV = 0;
        let GMVToday = 0;
        let takeRate = 0;
        let takeRateToday = 0;
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        if (totalGigBills > 0) {
            GMV = OKgigbills.map(b => b.customer_will_pay).reduce(reducer).toFixed(2);
            takeRate = OKgigbills.map(b => b.customer_will_pay - b.entertainer_will_receive).reduce(reducer).toFixed(2);
        }
        if (gigbillsToday > 0) {
            GMVToday = gigbillsTodayList.map(b => b.customer_will_pay).reduce(reducer).toFixed(2);
            takeRateToday = gigbillsTodayList.map(b => b.customer_will_pay - b.entertainer_will_receive).reduce(reducer).toFixed(2);
        }

        await Promise.all(customersActiveList.map(t => {
            return new Promise((rs, rj) => {
                t['numOfGigs'] = t.gigbills.length.toString();
                t['cancelByCustomer'] = t.gigbills.filter(b => b.gig_id.status === 'canceled_by_customer').length.toString();
                t['cancelByTalent'] = t.gigbills.filter(b => b.gig_id.status === 'canceled_by_talent').length.toString();
                t['lastBooking'] = t.gigbills.length > 0 && t.gigbills[0].createdAt;
                t['valueOfGigs'] = '0';
                t['takeRate'] = '0';
                t['trustsupport'] = '0';
                let value = 0;
                let takeRate = 0;
                let trust = 0;
                // const reducer = (accumulator, currentValue) => accumulator + currentValue;
                if (t.gigbills.length > 0) {
                    value = t.gigbills.map(h => h.entertainer_will_receive).reduce(reducer).toFixed(2);
                    takeRate = t.gigbills.map(h => h.entertainer_commission_fee + h.customer_trust_and_support_fee + h.entertainer_trust_and_support_fee).reduce(reducer).toFixed(2);
                    trust = t.gigbills.map(h => h.entertainer_trust_and_support_fee).reduce(reducer).toFixed(2);
                    t['valueOfGigs'] = value.toString();
                    t['takeRate'] = takeRate.toString();
                    t['trustsupport'] = trust.toString();
                    // rs();
                }
                rs()
            })
        }))

        return {
            entertainer: {
                totalTalents,
                talentsLive,
                numOfTalentsLive,
                numOfTalentsLiveLegend,
                numOfTalentsLiveSuperstar,
                talentsRequested,
                numOfTalentsRequested,
                // numOfTalentsRequestedLegend,
                // numOfTalentsRequestedSuperstar,
                talentsActive,
                talentsActiveList,
                talentsActiveLastWeek,
                talentsActiveLastTwoWeeks,
                talentsActiveMoreThanTwoWeeks,
                talentsBlocked,
                talentsBlockedList,
                numOfMusicalAct,
                numOfEntertainer,
                numOfPhotographer,
                numOfMakeupAirtist,
                // totalTalentsToday,
                talentsLiveToday,
                numOfTalentsLiveToday,
                numOfTalentsLiveLegendToday,
                numOfTalentsLiveSuperstarToday,
                talentsRequestedToday,
                numOfTalentsRequestedToday,
                talentsActiveTodayList,
                numOfTalentsRequestedLegendToday,
                numOfTalentsRequestedSuperstarToday,
                talentsActiveToday,
                talentsBlockedToday,
                talentsBlockedTodayList,
                numOfMusicalActToday,
                numOfEntertainerToday,
                numOfPhotographerToday,
                numOfMakeupAirtistToday,
                talents,
                talentsToday
            },
            customer: {
                customersActiveList,
                totalCustomers,
                customersActive,
                customersActiveLastWeek,
                customersActiveLastTwoWeeks,
                customersActiveMoreThanTwoWeeks,
                customersActiveToday,
                totalGigBills,
                gigbillsToday,
                GMVToday: GMVToday.toString(),
                GMV: GMV.toString(),
                takeRateToday: takeRateToday.toString(),
                takeRate: takeRate.toString(),
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const summaryTalents = async (filter) => {
    const { fromDate, toDate } = filter;
    let query = {};
    let fromDateHour = new Date(fromDate);
    fromDateHour.setHours(00, 00, 00, 00)
    let toDateHour = new Date(toDate);
    toDateHour.setHours(23, 59, 59, 00)
    if (fromDate && toDate) {
        query['createdAt'] = { $gte: fromDateHour, $lte: toDateHour }
    }
    console.log({ query })
    try {
        const talents = await Entertainer.find(query)
            .select('views plan_id publish_status publish_status_updated_at submit_progress_bar submit_progress_bar_updated_at user_id createdAt conversations ranking act_name')
            .populate({
                path: "plan_id",
                select: "name",
            })
            .populate({
                path: "act_type_id",
                select: "categoryName"
            })
            .populate({
                path: "gigbills",
                // select: "_id"
            })
            .populate({
                path: "conversations",
                select: "_id"
            })
            .populate({
                path: "user_id",
                select: "status status_updated_at first_name last_name email phone activated_at histories messages last_login_at",
                populate: {
                    path: "histories",
                    model: "Historie",
                    select: 'type amount'
                },
            })
            .sort({ ranking: 1 })
        const talentsNow = await Entertainer.find()
            .select('views plan_id publish_status publish_status_updated_at submit_progress_bar submit_progress_bar_updated_at user_id createdAt conversations ranking')
            .populate({
                path: "plan_id",
                select: "name",
            })
            .populate({
                path: "act_type_id",
                select: "categoryName"
            })
            .populate({
                path: "gigbills",
                // select: "_id"
            })
            .populate({
                path: "conversations",
                select: "_id"
            })
            .populate({
                path: "user_id",
                select: "status status_updated_at first_name last_name email phone activated_at histories messages last_login_at",
                populate: {
                    path: "histories",
                    model: "Historie",
                    select: 'type amount'
                },
            }).lean()

        // TOTAL
        const totalTalents = talents.length;
        const talentsLive = talents.filter(t => t.publish_status.trim() === 'accepted' && t.submit_progress_bar).length;
        const talentsRequested = talents.filter(t => t.publish_status.trim() === 'default' && t.submit_progress_bar).length;
        const talentsActive = talents.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'active' && !t.submit_progress_bar
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;
        const talentsBlocked = talents.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'blocked' || t.publish_status.trim() === 'rejected'
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        // CURRENT WEEK
        // a week: from Sunday to Friday
        const currentweekFriday = moment().subtract(0, 'weeks').endOf('week');
        const talentsActiveCurrentWeek = talentsNow.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'active' && !t.submit_progress_bar && t.createdAt && moment(t.createdAt).isSame(currentweekFriday, 'week')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsBlockedCurrentWeek = talentsNow.filter(t => {
            if (t.user_id) return (t.user_id.status === 'blocked' && t.user_id.status_updated_at && moment(t.user_id.status_updated_at).isSame(currentweekFriday, 'week')) || (t.publish_status.trim() === 'rejected' && t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(currentweekFriday, 'week'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id or status`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsRequestedCurrentWeek = talentsNow.filter(t => t.publish_status.trim() === 'default' && t.submit_progress_bar && t.submit_progress_bar_updated_at && moment(t.submit_progress_bar_updated_at).isSame(currentweekFriday, 'week')).length;

        const talentsLiveCurrentWeek = talentsNow.filter(t => t.publish_status.trim() === 'accepted' && t.submit_progress_bar && t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(currentweekFriday, 'week')).length;
        const totalTalentsCurrentWeek = talentsActiveCurrentWeek + talentsBlockedCurrentWeek + talentsRequestedCurrentWeek + talentsLiveCurrentWeek

        // LAST WEEK
        // a week: from Sunday to Friday
        const lastweekFriday = moment().subtract(1, 'weeks').endOf('week');
        const talentsActiveLastWeek = talentsNow.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'active' && !t.submit_progress_bar && t.createdAt && moment(t.createdAt).isSame(lastweekFriday, 'week')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsBlockedLastWeek = talentsNow.filter(t => {
            if (t.user_id) return (t.user_id.status === 'blocked' && t.user_id.status_updated_at && moment(t.user_id.status_updated_at).isSame(lastweekFriday, 'week')) || (t.publish_status.trim() === 'rejected' && t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(lastweekFriday, 'week'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id or status`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsRequestedLastWeek = talentsNow.filter(t => t.publish_status.trim() === 'default' && t.submit_progress_bar && t.submit_progress_bar_updated_at && moment(t.submit_progress_bar_updated_at).isSame(lastweekFriday, 'week')).length;

        const talentsLiveLastWeek = talentsNow.filter(t => t.publish_status.trim() === 'accepted' && t.submit_progress_bar && t.publish_status_updated_at && moment(t.publish_status_updated_at).isSame(lastweekFriday, 'week')).length;
        const totalTalentsLastWeek = talentsActiveLastWeek + talentsBlockedLastWeek + talentsRequestedLastWeek + talentsLiveLastWeek

        // PREVIOUS
        // a week: from Sunday to Friday
        // const lastweekFriday = moment().subtract(1, 'weeks').endOf('week');
        const talentsActivePrevious = talentsNow.filter(t => {
            if (t.user_id) return t.user_id.status.trim() === 'active' && !t.submit_progress_bar && t.createdAt && moment(t.createdAt).isBefore(lastweekFriday, 'week')
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsBlockedPrevious = talentsNow.filter(t => {
            if (t.user_id) return (t.user_id.status === 'blocked' && t.user_id.status_updated_at && moment(t.user_id.status_updated_at).isBefore(lastweekFriday, 'week')) || (t.publish_status.trim() === 'rejected' && t.publish_status_updated_at && moment(t.publish_status_updated_at).isBefore(lastweekFriday, 'week'))
            else {
                systemLogger.info(`[ADMIN ANALYTICS], Talent ${t._id} has invalid user_id or status`)
                Entertainer.findByIdAndDelete(t._id).exec()
            }
        }).length;

        const talentsRequestedPrevious = talentsNow.filter(t => t.publish_status.trim() === 'default' && t.submit_progress_bar && t.submit_progress_bar_updated_at && moment(t.submit_progress_bar_updated_at).isBefore(lastweekFriday, 'week')).length;

        const talentsLivePrevious = talentsNow.filter(t => t.publish_status.trim() === 'accepted' && t.submit_progress_bar && t.publish_status_updated_at && moment(t.publish_status_updated_at).isBefore(lastweekFriday, 'week')).length;
        const totalTalentsPrevious = talentsActivePrevious + talentsBlockedPrevious + talentsRequestedPrevious + talentsLivePrevious

        return {
            talents,
            total: {
                total: totalTalents,
                live: talentsLive,
                requested: talentsRequested,
                active: talentsActive,
                blocked: talentsBlocked
            },
            current: {
                total: totalTalentsCurrentWeek,
                active: talentsActiveCurrentWeek,
                blocked: talentsBlockedCurrentWeek,
                requested: talentsRequestedCurrentWeek,
                live: talentsLiveCurrentWeek
            },
            last: {
                total: totalTalentsLastWeek,
                active: talentsActiveLastWeek,
                blocked: talentsBlockedLastWeek,
                requested: talentsRequestedLastWeek,
                live: talentsLiveLastWeek
            },
            previous: {
                total: totalTalentsPrevious,
                active: talentsActivePrevious,
                blocked: talentsBlockedPrevious,
                requested: talentsRequestedPrevious,
                live: talentsLivePrevious
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    dataAnalytics,
    downloadAnalytics,
    summaryTalents
};
