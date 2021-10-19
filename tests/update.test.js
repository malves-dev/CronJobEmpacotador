/**
 * http://usejsdoc.org/
 */
const CronJobManager = require('../src/lib/crontab_manager');

let cronTab = new CronJobManager();

describe('Atualiza trabalhos do gerenciador', () => {
  const manager = new CronJobManager();
  const job = 'Trabalho Um';
  const dataCorrente = new Date();
  // const testDate = new Date('2021-09-29T10:00:00-0300');
  const cronTab = '* */2 * * * *';
  
  // Adciona um trabalho no gerenciador
  manager.add(job, dataCorrente, () => {
    console.log(`Cria ${job} com agenda de data atual!`)
  });

  describe(`Atualiza o trabalho '${job}' agendado para: ${dataCorrente}`, () => {
    test(`Deve atualizar o '${job}' para crontab: '${cronTab}'`, async () => {
      manager.update(job, cronTab);
      const esperado = /\* \*\/2 \* \* \* \*/g;

      expect(esperado.test(`${manager}`)).toEqual(true);
    });
  });
});
