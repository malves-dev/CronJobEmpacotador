/**
 * http://usejsdoc.org/
 */
const CronJobManager = require('../lib/crontab_manager'),
let cronTab = new CronJobManager();

exports.test = () => {
  let currDate = new Date();
  cronTab.add('updateTest', currDate, () => {
    console.log("atualizar Cron ... wooo!")
  });
    
  // Atualize a guia - string
  let tabString = '0 */2 * * * *';
  cronTab.update('updateTest', tabString);
  console.assert(/0 \*\/2 \* \* \* \*/.test(cronTab), `Não foi possível encontrar string crontab atualizada! ${cronTab}`);
  
  // Atualiza o guia Data;
  let testDate = new Date('2018-08-24T09:57:22-0400');
  cronTab.update('updateTest', testDate);
  console.assert(/Fri Aug 24 2018 09\:57\:22 GMT-0400/.test(cronTab), `Could not find updated Crontab date! ${cronTab}`);
  
  // Atualiza a tarefa
  let newFunc = function() {
    console.log("Agora você pode fazer um duplo wooo... wooo wooo ....");
  }
  
  cronTab.update('updateTest', newFunc);
  console.assert(`${cronTab}`.search("double wooo"), "Não consigo a tarefa de atualização ao atualizar apenas a tarefa!");
  
  // Atualize a guia e a tarefa - sabemos que a guia de atualização funciona. Só precisamos ter certeza de que a tarefa será atualizada
  cronTab.update('updateTest', testDate, () => {console.log("A New Task!")});
  
  console.assert(`${cronTab}`.search("A New Task!"), "Não foi possível encontrar a tarefa atualizada ao atualizar a guia e a tarefa!");
   
  
};
