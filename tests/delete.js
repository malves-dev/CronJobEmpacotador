/**
 * 
 */

var CronJobManager = require('../lib/crontab_manager');
exports.test = () => {
    let date = new Date();
    crontab1 = new CronJobManager('deleteMe', date, () =>{console.log("Me apague...")} );
    crontab1.deleteJob('deleteMe');
    console.assert(!crontab1.jobs.deleteMe, "O trabalho deleteMe não foi excluído! %s", crontab1);
}
