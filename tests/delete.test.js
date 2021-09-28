const CronJobManager = require('../src/lib/crontab_manager');

describe('Apaga trabalhos do gerenciador', () => {
  const manager = new CronJobManager();
  const jobs = ['Trabalho Um', 'Trabalho Dois' ];
  const cronTab = '1 * * * * *';

  describe(`Apaga o trabalho '${jobs[0]}'`, () => {
    test(`Deve apagar o '${jobs[0]}'`, async () => {
      manager.add(jobs[0], cronTab, () => {
        // Trabalho que será realizado
      });

      manager.deleteJob(jobs[0]);

      expect(manager.exists(jobs[0])).toEqual(false);
    });
  });

  describe(`Apaga o trabalho '${jobs[1]}'`, () => {

    test(`Deve apagar o '${jobs[1]}'`, async () => {
      manager.add(jobs[1], cronTab, () => {
        // Trabalho que será realizado
      });

      manager.deleteJob(jobs[1]);

      expect(manager.exists(jobs[1])).toEqual(false);
    });
  });
});