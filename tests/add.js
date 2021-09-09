const CronJobManager = require('../src/lib/crontab_manager');
exports.test = () => {
    try {
        const manager = new CronJobManager();
        
        let date = new Date();
        date.setSeconds(date.getSeconds() + 1);
        
        console.log('Vai logar em:', date);
        
        manager.add('jobid', date, () => {
          console.log('Adcionou jobit');
        })
        
        manager.start('jobid');
        manager.add('newJob', date, () => {console.log("Adicionou um segundo trabalho...")})
        
        console.assert(manager.exists('newJob') && manager.exists('jobid'), `Um trabalho adicionado está faltando: ${manager}`)
    } catch (e) {
        console.assert(false, `O teste de adição falhou...${e}`);
        console.error(e);
    }
}
