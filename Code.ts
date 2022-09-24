// @ts-ignore
import * as Cheerio from 'cheerio';
import MyEnv from './MyEnv';

const NITOK_SITE_ORIGIN = 'https://www.okinawa-ct.ac.jp';
const NITOK_YEARLY_SCHEDULE_URL = 'https://www.okinawa-ct.ac.jp/detail.jsp?id=73493&menuid=14402&funcid=1';
const NITOK_WEEKLY_SCHEDULE_URL = 'https://www.okinawa-ct.ac.jp/detail.jsp?id=75448&menuid=15310&funcid=1';

const main = () => {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    let $: Cheerio.CheerioAPI;

    const oldYearlySchedulePdfUrl = sheet.getRange('A1').getValue();

    const yearlyScheduleContents = UrlFetchApp.fetch(NITOK_YEARLY_SCHEDULE_URL).getContentText();
    $ = Cheerio.load(yearlyScheduleContents);
    const yearlySchedulePdfUrl = NITOK_SITE_ORIGIN + $('#aja_contents_detail > p:nth-child(2) > a').first().attr('href');

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
    const weeklySchedulePdfUrl = NITOK_SITE_ORIGIN + $('#aja_contents_detail > p > a:nth-child(2)').last().attr('href');

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
