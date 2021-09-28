const CronJobManager = require('../src/lib/crontab_manager');

describe('Inicia e Para trabalhos do gerenciador', () => {
  const manager = new CronJobManager();
  const jobs = ['Trabalho Um', 'Trabalho Dois' ];
  const cronTab1 = '* */2 * * * *';
  const cronTab2 = '* */10 * * * *';

  describe(`Inicia o trabalho '${jobs[0]}' para agenda: '${cronTab1}'`, () => {
    test(`Deve iniciar o '${jobs[0]}'`, async () => {
      manager.add(jobs[0], cronTab1, () => {
        // Trabalho que será realizado
      });

      manager.start(jobs[0]);
      const esperado = /Running/g;

      expect(esperado.test(`${manager}`)).toEqual(true);
    });
  });


  describe(`Inicia o trabalho '${jobs[1]}'`, () => {
    test(`Deve iniciar o '${jobs[1]}' para agenda: '${cronTab2}'`, async () => {
      manager.add(jobs[1], cronTab2, () => {
        // Trabalho que será realizado
      });

      manager.start(jobs[1]);
      const esperado = /Running/g;

      expect(esperado.test(`${manager}`)).toEqual(true);
    });
  });

});