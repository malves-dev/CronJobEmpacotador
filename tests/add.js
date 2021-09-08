const CronJobManager = require('..');
exports.test = () => {
    try {
        const jobmanager = new CronJobManager();
        
        let date = new Date();
        date.setSeconds(date.getSeconds() + 1);
        
        console.log('Vai logar em:', date);
        
        jobmanager.add('jobid', date, () => {
          console.log('Adcionou jobit');
        })
        
        jobmanager.start('jobid');
        jobmanager.add('newJob', date, () => {console.log("Adicionou um segundo trabalho...")})
        
        console.assert(jobmanager.exists('newJob') && jobmanager.exists('jobid'), `Um trabalho adicionado está faltando: ${jobmanager}`)
    } catch (e) {
        console.assert(false, `O teste de adição falhou...${e}`);
        console.error(e);
    }
}
