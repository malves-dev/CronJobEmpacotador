/**
 * 
 */
const
CronJobManager = require('../lib/crontab_manager');
exports.test = () => {
    let dateForDateTesting, crontab1 = new CronJobManager();
    
    console.assert(crontab1 instanceof CronJobManager, "O construtor Vanilla não foi bem sucedido");
    
    // Crontab básico
    let crontab1 = new CronJobManager('key1', '* * * * * *', () => {});
    console.assert(crontab1 instanceof CronJobManager && crontab1.exists('key1'), "Construtor básico com crontab não funcionou...");
    
    // Opções adicionais foram aprovadas e inicia o trabalho
    crontab1 = new CronJobManager('key2', "* * * * * *", 
                () => {console.log("Construtor de guia de string...")}, 
                {
                start: true, 
                onComplete: () => {
                    console.log("Ok... você pode parar agora!")}
     });
    
    console.assert(crontab1 instanceof CronJobManager && crontab1.exists('key2') && /Running/.test(crontab1.listCrons), 
                   "Não foi possível encontrar um trabalho em execução quando {start: true} foi aprovado");
    setTimeout(() => {
        crontab1.stop('key2');
        
    }, 3000);
    
    // Passe uma data para o construtor
    dateForDateTesting = new Date();
    dateForDateTesting.setSeconds(dateForDateTesting.getSeconds() + 1);
    crontab2 = new CronJobManager('key3', dateForDateTesting, 
               () => {console.log("Construtor de data...")}, 
               {
                 start: true, 
                 onComplete: () => {
                     console.log("Trabalho de construtor de data interrompido...")
                     }
                }
    );
}
