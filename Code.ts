// @ts-ignore
import * as Cheerio from 'cheerio';
import MyEnv from './MyEnv';

const NITOK_SITE_ORIGIN = 'https://www.okinawa-ct.ac.jp';
const NITOK_YEARLY_SCHEDULE_URL = 'https://www.okinawa-ct.ac.jp/campus_life/class/annualev/';
const NITOK_WEEKLY_SCHEDULE_URL = 'https://www.okinawa-ct.ac.jp/campus_life/class/schedule/';

const main = () => {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    let $: Cheerio.CheerioAPI;

    const oldYearlySchedulePdfUrl = sheet.getRange('A1').getValue();

    const yearlyScheduleContents = UrlFetchApp.fetch(NITOK_YEARLY_SCHEDULE_URL).getContentText();
    $ = Cheerio.load(yearlyScheduleContents);
    const yearlySchedulePdfUrl = NITOK_SITE_ORIGIN + $('#alpha > div > p > a').first().attr('href');

    if (oldYearlySchedulePdfUrl != yearlySchedulePdfUrl) {
        Logger.log(`New Yearly Schedule URL: ${yearlySchedulePdfUrl}`);

        UrlFetchApp.fetch(MyEnv.discordWebhookUrl, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify({
                content: `年間行事予定表が更新されました\n${yearlySchedulePdfUrl}`
            })
        });

        sheet.getRange('A1').setValue(yearlySchedulePdfUrl);
    }

    const oldWeeklySchedulePdfUrl = sheet.getRange('B1').getValue();
    const weeklyScheduleContents = UrlFetchApp.fetch(NITOK_WEEKLY_SCHEDULE_URL).getContentText();
    $ = Cheerio.load(weeklyScheduleContents);
    const weeklySchedulePdfUrl = NITOK_SITE_ORIGIN + $('ul.alpha_contents > li.item:nth-child(2) > p > a').first().attr('href');

    if (oldWeeklySchedulePdfUrl != weeklySchedulePdfUrl) {
        Logger.log(`New Weekly Schedule URL: ${weeklySchedulePdfUrl}`);

        UrlFetchApp.fetch(MyEnv.discordWebhookUrl, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify({
                content: `週の時間割が更新されました\n${weeklySchedulePdfUrl}`
            })
        });

        sheet.getRange('B1').setValue(weeklySchedulePdfUrl);
    }
};
