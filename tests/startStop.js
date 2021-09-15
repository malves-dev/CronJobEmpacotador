/**
 * http://usejsdoc.org/
 */
const CronJobManager = require('../src/lib/crontab_manager');

exports.test = () => {
    let jobManager = new CronJobManager('newJob', '* * * * * *', 
        () =>  {
            console.log('Marcação...');
        }, 
        {
            onComplete: () => {
            console.log('Iniciar/parar o teste com sucesso');
        }
    });
    
    jobManager.start('newJob');

    console.assert(`${jobManager}`.search('Running'), `Não foi possível encontrar um estado em execução para o trabalho iniciado: ${jobManager}`);

    jobManager.stop('newJob');
};

