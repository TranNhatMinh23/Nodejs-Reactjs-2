const { adminService } = require("../../services");
// Require library
const xl = require('excel4node');
const moment = require('moment');

const dataAnalytics = (req, res) => {
    adminService.dataAnalytics(req.query)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const downloadAnalytics = (req, res) => {
    adminService.downloadAnalytics(req.query)
        .then(data => {
            // Create a new instance of a Workbook class
            const wb = new xl.Workbook({
                jszip: {
                    compression: 'DEFLATE',
                },
                defaultFont: {
                    size: 12,
                    name: 'Calibri',
                    color: '#3d3b3b',
                },
                dateFormat: 'd/m/yy hh:mm:ss',
            });
            // Create a reusable style
            const style = wb.createStyle({
                font: {
                    color: '#3d3b3b',
                    size: 12,
                },
                alignment: { // §18.8.1
                    horizontal: 'left',
                    justifyLastLine: true,
                    shrinkToFit: true,
                    vertical: 'center',
                    wrapText: true
                },
                border: { // §18.8.4 border (Border)
                    left: {
                        style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                        color: 'black' // HTML style hex value
                    },
                    right: {
                        style: 'thin',
                        color: 'black'
                    },
                    top: {
                        style: 'thin',
                        color: 'black'
                    },
                    bottom: {
                        style: 'thin',
                        color: 'black'
                    },
                    diagonal: {
                        style: 'thin',
                        color: 'black'
                    },
                    diagonalDown: true,
                    diagonalUp: true,
                    outline: true
                },
            });

            const blueBg = wb.createStyle({
                font: {
                    color: 'white'
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#0095ff',
                    fgColor: '#0095ff',
                },
                alignment: { // §18.8.1
                    horizontal: 'center',
                    justifyLastLine: true,
                    shrinkToFit: true,
                    vertical: 'center',
                    wrapText: true
                },

                border: { // §18.8.4 border (Border)
                    left: {
                        style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                        color: 'black' // HTML style hex value
                    },
                    right: {
                        style: 'thin',
                        color: 'black'
                    },
                    top: {
                        style: 'thin',
                        color: 'black'
                    },
                    bottom: {
                        style: 'thin',
                        color: 'black'
                    },
                    diagonal: {
                        style: 'thin',
                        color: 'black'
                    },
                },
            });

            const greenBg = wb.createStyle({
                font: {
                    color: 'white'
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#276e09',
                    fgColor: '#276e09',
                },
                alignment: { // §18.8.1
                    horizontal: 'center',
                    justifyLastLine: true,
                    shrinkToFit: true,
                    vertical: 'center',
                    wrapText: true
                },

                border: { // §18.8.4 border (Border)
                    left: {
                        style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                        color: 'black' // HTML style hex value
                    },
                    right: {
                        style: 'thin',
                        color: 'black'
                    },
                    top: {
                        style: 'thin',
                        color: 'black'
                    },
                    bottom: {
                        style: 'thin',
                        color: 'black'
                    },
                    diagonal: {
                        style: 'thin',
                        color: 'black'
                    },
                    // diagonalDown: true,
                    // diagonalUp: true,
                    // outline: true
                },
            });

            // ========== TALENT TODAY ============
            // ========== TALENT TODAY ============
            // ========== TALENT TODAY ============
            const talentTodaySheet = wb.addWorksheet('Talent Today');

            talentTodaySheet.column(2).setWidth(30);
            talentTodaySheet.column(6).setWidth(15);
            talentTodaySheet.column(7).setWidth(15);
            talentTodaySheet.column(8).setWidth(35);
            talentTodaySheet.column(9).setWidth(20);
            talentTodaySheet.column(10).setWidth(15);
            talentTodaySheet.column(13).setWidth(15);

            talentTodaySheet.cell(2, 2, 2, 3, true)
                .string("Daily Summary")
                .style(blueBg);

            talentTodaySheet.cell(3, 2)
                .string('Date')
                .style(style);
            talentTodaySheet.cell(3, 3)
                .string(moment(new Date()).format('DD-MM-YYYY'))
                .style(style);

            talentTodaySheet.cell(4, 2)
                .string('Time report generated')
                .style(style);
            talentTodaySheet.cell(4, 3)
                .string(moment(new Date()).format('HH:mm'))
                .style(style);

            talentTodaySheet.cell(5, 2)
                .string('Active today')
                .style(style);
            talentTodaySheet.cell(5, 3)
                .string(data.entertainer.talentsActiveToday || 'n.a')
                .style(style);

            talentTodaySheet.cell(6, 2)
                .string('Blocked and Rejected today')
                .style(style);

            talentTodaySheet.cell(6, 3)
                .string(data.entertainer.talentsBlockedToday || 'n.a')
                .style(style);

            talentTodaySheet.cell(7, 2)
                .string('Requested today')
                .style(style);
            talentTodaySheet.cell(7, 3)
                .string(data.entertainer.numOfTalentsRequestedToday || 'n.a')
                .style(style);

            talentTodaySheet.cell(8, 2)
                .string('Live today')
                .style(style);
            talentTodaySheet.cell(8, 3)
                .string(data.entertainer.numOfTalentsLiveToday || 'n.a')
                .style(style);

            // ACTIVE TODAY
            let curRowTableActive = 10;
            talentTodaySheet.cell(curRowTableActive, 5, curRowTableActive, 14, true).string("Active Today").style(greenBg);
            talentTodaySheet.cell(curRowTableActive + 1, 5)
                .string('Number')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 6)
                .string('First Name')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 7)
                .string('Last Name')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 8)
                .string('Email')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 10)
                .string('Category')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 11)
                .string('Subscription')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 12)
                .string('Date Active')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 13)
                .string('Date Requested')
                .style(style);
            talentTodaySheet.cell(curRowTableActive + 1, 14)
                .string('Date Live')
                .style(style);

            curRowTableActive += 2;
            data.entertainer.talentsActiveTodayList.forEach((talent, key) => {
                try {
                    talentTodaySheet.cell(curRowTableActive + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 12)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 13)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableActive + key, 14)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableActive += data.entertainer.talentsActiveTodayList.length;

            // BLOCKED AND REJECTED TODAY
            let curRowTableBlock = curRowTableActive + 1;
            talentTodaySheet.cell(curRowTableBlock, 5, curRowTableBlock, 14, true).string("Blocked and Rejected Today").style(greenBg);
            talentTodaySheet.cell(curRowTableBlock + 1, 5)
                .string('Number')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 6)
                .string('First Name')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 7)
                .string('Last Name')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 8)
                .string('Email')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 10)
                .string('Category')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 11)
                .string('Subscription')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 12)
                .string('Date Active')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 13)
                .string('Date Requested')
                .style(style);
            talentTodaySheet.cell(curRowTableBlock + 1, 14)
                .string('Date Live')
                .style(style);

            curRowTableBlock += 2;
            data.entertainer.talentsBlockedTodayList.forEach((talent, key) => {
                try {
                    talentTodaySheet.cell(curRowTableBlock + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 12)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 13)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableBlock + key, 14)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableBlock += data.entertainer.talentsBlockedTodayList.length;

            // REQUESTED TODAY
            let curRowTableRequest = curRowTableBlock + 1;
            talentTodaySheet.cell(curRowTableRequest, 5, curRowTableRequest, 14, true).string("Requested Today").style(greenBg);
            talentTodaySheet.cell(curRowTableRequest + 1, 5)
                .string('Number')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 6)
                .string('First Name')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 7)
                .string('Last Name')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 8)
                .string('Email')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 10)
                .string('Category')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 11)
                .string('Subscription')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 12)
                .string('Date Active')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 13)
                .string('Date Requested')
                .style(style);
            talentTodaySheet.cell(curRowTableRequest + 1, 14)
                .string('Date Live')
                .style(style);

            curRowTableRequest += 2;
            data.entertainer.talentsRequestedToday.forEach((talent, key) => {
                try {
                    talentTodaySheet.cell(curRowTableRequest + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 12)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 13)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableRequest + key, 14)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableRequest += data.entertainer.talentsRequestedToday.length;

            // LIVE TODAY
            let curRowTableLive = curRowTableRequest + 1;
            talentTodaySheet.cell(curRowTableLive, 5, curRowTableLive, 14, true).string("Live Today").style(greenBg);
            talentTodaySheet.cell(curRowTableLive + 1, 5)
                .string('Number')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 6)
                .string('First Name')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 7)
                .string('Last Name')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 8)
                .string('Email')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 10)
                .string('Category')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 11)
                .string('Subscription')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 12)
                .string('Date Active')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 13)
                .string('Date Requested')
                .style(style);
            talentTodaySheet.cell(curRowTableLive + 1, 14)
                .string('Date Live')
                .style(style);

            curRowTableLive += 2;
            data.entertainer.talentsLiveToday.forEach((talent, key) => {
                try {
                    talentTodaySheet.cell(curRowTableLive + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 12)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 13)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTodaySheet.cell(curRowTableLive + key, 14)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableLive += data.entertainer.talentsLiveToday.length;


            // ========== TALENT TOTAL ============
            // ========== TALENT TOTAL ============
            // ========== TALENT TOTAL ============
            const talentTotalSheet = wb.addWorksheet('Talent Total');

            talentTotalSheet.column(2).setWidth(30);
            talentTotalSheet.column(6).setWidth(15);
            talentTotalSheet.column(7).setWidth(15);
            talentTotalSheet.column(8).setWidth(35);
            talentTotalSheet.column(9).setWidth(20);
            talentTotalSheet.column(10).setWidth(15);
            talentTotalSheet.column(13).setWidth(15);
            talentTotalSheet.column(14).setWidth(20);
            talentTotalSheet.column(15).setWidth(20);
            talentTotalSheet.column(16).setWidth(20);
            talentTotalSheet.column(17).setWidth(20);
            talentTotalSheet.column(21).setWidth(15);

            talentTotalSheet.cell(2, 2, 2, 3, true)
                .string("Total Summary")
                .style(blueBg);

            talentTotalSheet.cell(3, 2)
                .string('Date')
                .style(style);
            talentTotalSheet.cell(3, 3)
                .string(moment(new Date()).format('DD-MM-YYYY'))
                .style(style);

            talentTotalSheet.cell(4, 2)
                .string('Time report generated')
                .style(style);
            talentTotalSheet.cell(4, 3)
                .string(moment(new Date()).format('HH:mm'))
                .style(style);

            talentTotalSheet.cell(5, 2)
                .string('Total Active')
                .style(style);
            talentTotalSheet.cell(5, 3)
                .string(data.entertainer.talentsActive || 'n.a')
                .style(style);

            talentTotalSheet.cell(6, 2)
                .string('Total Blocked and Rejected')
                .style(style);

            talentTotalSheet.cell(6, 3)
                .string(data.entertainer.talentsBlocked || 'n.a')
                .style(style);

            talentTotalSheet.cell(7, 2)
                .string('Total Requested')
                .style(style);
            talentTotalSheet.cell(7, 3)
                .string(data.entertainer.numOfTalentsRequested || 'n.a')
                .style(style);

            talentTotalSheet.cell(8, 2)
                .string('Total Live')
                .style(style);
            talentTotalSheet.cell(8, 3)
                .string(data.entertainer.numOfTalentsLive || 'n.a')
                .style(style);

            talentTotalSheet.cell(9, 2)
                .string('           Total Superstar')
                .style(style);
            talentTotalSheet.cell(9, 3)
                .string(data.entertainer.numOfTalentsLiveSuperstar || 'n.a')
                .style(style);

            talentTotalSheet.cell(10, 2)
                .string('           Total Legend')
                .style(style);
            talentTotalSheet.cell(10, 3)
                .string(data.entertainer.numOfTalentsLiveLegend || 'n.a')
                .style(style);

            talentTotalSheet.cell(11, 2)
                .string('Active within last week')
                .style(style);
            talentTotalSheet.cell(11, 3)
                .string(data.entertainer.talentsActiveLastWeek || 'n.a')
                .style(style);

            talentTotalSheet.cell(12, 2)
                .string('Active within last two weeks')
                .style(style);
            talentTotalSheet.cell(12, 3)
                .string(data.entertainer.talentsActiveLastTwoWeeks || 'n.a')
                .style(style);

            talentTotalSheet.cell(13, 2)
                .string('Active more than two weeks ago')
                .style(style);
            talentTotalSheet.cell(13, 3)
                .string(data.entertainer.talentsActiveMoreThanTwoWeeks || 'n.a')
                .style(style);

            // ACTIVE TOTAL
            let curRowTableActiveTotal = 15;
            talentTotalSheet.cell(curRowTableActiveTotal, 5, curRowTableActiveTotal, 23, true).string("Total active").style(greenBg);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 5)
                .string('Number')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 6)
                .string('First Name')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 7)
                .string('Last Name')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 8)
                .string('Email')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 10)
                .string('Category')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 11)
                .string('Subscription')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 12)
                .string('No of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 13)
                .string('Total value of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 14)
                .string('Talent Town commission')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 15)
                .string('Talent Town Trust & Support')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 16)
                .string('Talent Town Monthly (total)')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 17)
                .string('No of referred friends')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 18)
                .string('Profile views')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 19)
                .string('No of DMs')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 20)
                .string('Date Active')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 21)
                .string('Date Requested')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 22)
                .string('Date Live')
                .style(style);
            talentTotalSheet.cell(curRowTableActiveTotal + 1, 23)
                .string('Last Active')
                .style(style);

            curRowTableActiveTotal += 2;
            data.entertainer.talentsActiveList.forEach((talent, key) => {
                try {
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 12)
                        .string(talent.numOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 13)
                        .string(talent.valueOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 14)
                        .string(talent.commission || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 15)
                        .string(talent.trustsupport || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 16)
                        .string(talent.monthly || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 17)
                        .string('n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 18)
                        .string(talent.views && talent.views.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 19)
                        .string(talent.conversations.length.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 20)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 21)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 22)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableActiveTotal + key, 23)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableActiveTotal += data.entertainer.talentsActiveList.length;

            // BLOCKED AND REJECTED TOTAL
            let curRowTableBlockTotal = curRowTableActiveTotal + 1;
            talentTotalSheet.cell(curRowTableBlockTotal, 5, curRowTableBlockTotal, 23, true).string("Total blocked & rejected").style(greenBg);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 5)
                .string('Number')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 6)
                .string('First Name')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 7)
                .string('Last Name')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 8)
                .string('Email')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 10)
                .string('Category')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 11)
                .string('Subscription')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 12)
                .string('No of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 13)
                .string('Total value of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 14)
                .string('Talent Town commission')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 15)
                .string('Talent Town Trust & Support')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 16)
                .string('Talent Town Monthly (total)')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 17)
                .string('No of referred friends')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 18)
                .string('Profile views')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 19)
                .string('No of DMs')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 20)
                .string('Date Active')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 21)
                .string('Date Requested')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 22)
                .string('Date Live')
                .style(style);
            talentTotalSheet.cell(curRowTableBlockTotal + 1, 23)
                .string('Last Active')
                .style(style);

            curRowTableBlockTotal += 2;
            data.entertainer.talentsBlockedList.forEach((talent, key) => {
                try {
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 12)
                        .string(talent.numOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 13)
                        .string(talent.valueOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 14)
                        .string(talent.commission || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 15)
                        .string(talent.trustsupport || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 16)
                        .string(talent.monthly || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 17)
                        .string('n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 18)
                        .string(talent.views && talent.views.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 19)
                        .string(talent.conversations.length.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 20)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 21)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 22)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableBlockTotal + key, 23)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableBlockTotal += data.entertainer.talentsBlockedList.length;

            // REQUESTED TOTAL
            let curRowTableRequestTotal = curRowTableBlockTotal + 1;
            talentTotalSheet.cell(curRowTableRequestTotal, 5, curRowTableRequestTotal, 23, true).string('Total requested').style(greenBg);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 5)
                .string('Number')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 6)
                .string('First Name')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 7)
                .string('Last Name')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 8)
                .string('Email')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 10)
                .string('Category')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 11)
                .string('Subscription')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 12)
                .string('No of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 13)
                .string('Total value of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 14)
                .string('Talent Town commission')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 15)
                .string('Talent Town Trust & Support')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 16)
                .string('Talent Town Monthly (total)')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 17)
                .string('No of referred friends')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 18)
                .string('Profile views')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 19)
                .string('No of DMs')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 20)
                .string('Date Active')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 21)
                .string('Date Requested')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 22)
                .string('Date Live')
                .style(style);
            talentTotalSheet.cell(curRowTableRequestTotal + 1, 23)
                .string('Last Active')
                .style(style);

            curRowTableRequestTotal += 2;
            data.entertainer.talentsRequested.forEach((talent, key) => {
                try {
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 12)
                        .string(talent.numOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 13)
                        .string(talent.valueOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 14)
                        .string(talent.commission || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 15)
                        .string(talent.trustsupport || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 16)
                        .string(talent.monthly || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 17)
                        .string('n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 18)
                        .string(talent.views && talent.views.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 19)
                        .string(talent.conversations.length.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 20)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 21)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 22)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableRequestTotal + key, 23)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableRequestTotal += data.entertainer.talentsRequested.length;

            // LIVE TOTAL
            let curRowTableLiveTotal = curRowTableRequestTotal + 1;
            talentTotalSheet.cell(curRowTableLiveTotal, 5, curRowTableLiveTotal, 23, true).string("Total live").style(greenBg);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 5)
                .string('Number')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 6)
                .string('First Name')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 7)
                .string('Last Name')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 8)
                .string('Email')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 9)
                .string('Phone Number')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 10)
                .string('Category')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 11)
                .string('Subscription')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 12)
                .string('No of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 13)
                .string('Total value of gigs')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 14)
                .string('Talent Town commission')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 15)
                .string('Talent Town Trust & Support')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 16)
                .string('Talent Town Monthly (total)')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 17)
                .string('No of referred friends')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 18)
                .string('Profile views')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 19)
                .string('No of DMs')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 20)
                .string('Date Active')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 21)
                .string('Date Requested')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 22)
                .string('Date Live')
                .style(style);
            talentTotalSheet.cell(curRowTableLiveTotal + 1, 23)
                .string('Last Active')
                .style(style);

            curRowTableLiveTotal += 2;
            data.entertainer.talentsLive.forEach((talent, key) => {
                try {
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 5)
                        .number(key + 1)
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 6)
                        .string(talent.user_id.first_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 7)
                        .string(talent.user_id.last_name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 8)
                        .string(talent.user_id.email || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 9)
                        .string(talent.user_id.phone || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 10)
                        .string(talent.act_type_id.categoryName || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 11)
                        .string(talent.plan_id && talent.plan_id.name || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 12)
                        .string(talent.numOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 13)
                        .string(talent.valueOfGigs || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 14)
                        .string(talent.commission || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 15)
                        .string(talent.trustsupport || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 16)
                        .string(talent.monthly || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 17)
                        .string('n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 18)
                        .string(talent.views && talent.views.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 19)
                        .string(talent.conversations.length.toString() || 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 20)
                        .string(talent.user_id.activated_at ? moment(talent.user_id.activated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 21)
                        .string(talent.submit_progress_bar_updated_at ? moment(talent.submit_progress_bar_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 22)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    talentTotalSheet.cell(curRowTableLiveTotal + key, 23)
                        .string(talent.publish_status === 'accepted' && talent.publish_status_updated_at ? moment(talent.publish_status_updated_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableLiveTotal += data.entertainer.talentsLive.length;


            // ========== CUSTOMER ============
            // ========== CUSTOMER ============
            // ========== CUSTOMER ============
            const customerSheet = wb.addWorksheet('Customer');

            // SUMARY
            customerSheet.column(2).setWidth(30);
            customerSheet.column(6).setWidth(15);
            customerSheet.column(7).setWidth(15);
            customerSheet.column(8).setWidth(35);
            customerSheet.column(9).setWidth(20);
            customerSheet.column(10).setWidth(20);
            customerSheet.column(11).setWidth(25);
            customerSheet.column(12).setWidth(20);
            customerSheet.column(13).setWidth(25);
            customerSheet.column(14).setWidth(20);
            customerSheet.column(15).setWidth(20);
            customerSheet.column(16).setWidth(20);
            customerSheet.column(17).setWidth(15);


            customerSheet.cell(2, 2, 2, 3, true)
                .string("Total Summary")
                .style(blueBg);

            customerSheet.cell(3, 2)
                .string('Date')
                .style(style);
            customerSheet.cell(3, 3)
                .string(moment(new Date()).format('DD-MM-YYYY'))
                .style(style);

            customerSheet.cell(4, 2)
                .string('Time report generated')
                .style(style);
            customerSheet.cell(4, 3)
                .string(moment(new Date()).format('HH:mm'))
                .style(style);

            customerSheet.cell(5, 2)
                .string('Total active (signed up) today')
                .style(style);
            customerSheet.cell(5, 3)
                .string(data.customer.customersActiveToday || 'n.a')
                .style(style);

            customerSheet.cell(6, 2)
                .string('Total active (signed up)')
                .style(style);
            customerSheet.cell(6, 3)
                .string(data.customer.customersActive || 'n.a')
                .style(style);

            customerSheet.cell(7, 2)
                .string('Total number of bookings (today)')
                .style(style);
            customerSheet.cell(7, 3)
                .string(data.customer.gigbillsToday || 'n.a')
                .style(style);

            customerSheet.cell(8, 2)
                .string('Total number of bookings')
                .style(style);
            customerSheet.cell(8, 3)
                .string(data.customer.totalGigBills || 'n.a')
                .style(style);

            customerSheet.cell(9, 2)
                .string('Total value of bookings (GMV) today')
                .style(style);
            customerSheet.cell(9, 3)
                .string(data.customer.GMVToday || 'n.a')
                .style(style);

            customerSheet.cell(10, 2)
                .string('Total value of bookings (GMV)')
                .style(style);
            customerSheet.cell(10, 3)
                .string(data.customer.GMV || 'n.a')
                .style(style);

            customerSheet.cell(11, 2)
                .string('Total revenue (take rate) today')
                .style(style);
            customerSheet.cell(11, 3)
                .string(data.customer.takeRateToday || 'n.a')
                .style(style);

            customerSheet.cell(12, 2)
                .string('Total revenue (take rate)')
                .style(style);
            customerSheet.cell(12, 3)
                .string(data.customer.takeRate || 'n.a')
                .style(style);

            customerSheet.cell(13, 2)
                .string('Active within last week')
                .style(style);
            customerSheet.cell(13, 3)
                .string(data.customer.customersActiveLastWeek || 'n.a')
                .style(style);

            customerSheet.cell(14, 2)
                .string('Active within last two weeks')
                .style(style);
            customerSheet.cell(14, 3)
                .string(data.customer.customersActiveLastTwoWeeks || 'n.a')
                .style(style);

            customerSheet.cell(15, 2)
                .string('Active more than two weeks ago')
                .style(style);
            customerSheet.cell(15, 3)
                .string(data.customer.customersActiveMoreThanTwoWeeks || 'n.a')
                .style(style);

            // ACTIVE TOTAL
            let curRowTableActiveCustomer = 17;
            customerSheet.cell(curRowTableActiveCustomer, 5, curRowTableActiveCustomer, 17, true).string("Total Active").style(greenBg);
            customerSheet.cell(curRowTableActiveCustomer + 1, 5)
                .string('Number')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 6)
                .string('First Name')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 7)
                .string('Last Name')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 8)
                .string('Email')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 9)
                .string('Phone Number')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 10)
                .string('Number of bookings')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 11)
                .string('Total value of bookings (GMV)')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 12)
                .string('Total revenue (take rate)')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 13)
                .string('Cancelled gigs (by customer)')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 14)
                .string('Cancelled gigs (by talent)')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 15)
                .string('Date Active (Sign up)')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 16)
                .string('Date of last booking')
                .style(style);
            customerSheet.cell(curRowTableActiveCustomer + 1, 17)
                .string('Date Last Active')
                .style(style);

            curRowTableActiveCustomer += 2;
            data.customer.customersActiveList.forEach((customer, key) => {
                try {
                    customerSheet.cell(curRowTableActiveCustomer + key, 5)
                        .number(key + 1)
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 6)
                        .string(customer.user_id.first_name || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 7)
                        .string(customer.user_id.last_name || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 8)
                        .string(customer.user_id.email || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 9)
                        .string(customer.user_id.phone || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 10)
                        .string(customer.numOfGigs || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 11)
                        .string(customer.valueOfGigs || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 12)
                        .string(customer.takeRate || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 13)
                        .string(customer.cancelByCustomer || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 14)
                        .string(customer.cancelByTalent || 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 15)
                        .string(customer.createdAt ? moment(customer.createdAt).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 16)
                        .string(customer.lastBooking ? moment(customer.lastBooking).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                    customerSheet.cell(curRowTableActiveCustomer + key, 17)
                        .string(customer.last_login_at ? moment(customer.last_login_at).format('DD-MM-YYYY') : 'n.a')
                        .style(style);
                } catch (error) {

                }
            })
            curRowTableActiveCustomer += data.customer.customersActiveList.length;//it should += data.entertainer.customersActiveToday.length

            const dateToday = moment(new Date()).format('DD-MM-YYYY');
            wb.write(`Talent Town-${dateToday}.xlsx`, res);
            // wb.writeToBuffer().then(function (buffer) {
            //     res.attachment(`Talent Town-${dateToday}.xlsx`);
            //     return res.sendData(buffer);
            // });
            // res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

const summaryTalents = (req, res) => {
    adminService.summaryTalents(req.query)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
};

module.exports = {
    dataAnalytics,
    downloadAnalytics,
    summaryTalents
};
