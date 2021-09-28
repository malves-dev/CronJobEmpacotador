const CronJobManager = require('../src/lib/crontab_manager');

describe('Cria um gerenciador para trabalhos', () => {
  const manager = new CronJobManager();
  const jobs = ['Trabalho Um', 'Trabalho Dois' ];
  let date = new Date();

  describe(`Cria o trabalho '${jobs[0]}'`, () => {
    date.setSeconds(date.getSeconds() + 1);
    test(`Deve criar gerenciador para o '${jobs[0]}'. 
          Vai realizar o trabalho em: ${date.toLocaleString()}`, async () => {
      manager.add(jobs[0], date, () => {
        // Trabalho que será realizado
      });
      
      expect(manager.exists(jobs[0])).toEqual(true);
    });
  });

  describe(`Cria o trabalho '${jobs[1]}'`, () => {
    date.setSeconds(date.getSeconds() + 2);
    test(`Deve criar gerenciador para o '${jobs[1]}'. 
          Vai realizar o trabalho em: ${date.toLocaleString()}`, async () => {
      manager.add(jobs[1], date, () => {
        // Trabalho que será realizado
      });

      expect(manager.exists(jobs[1])).toEqual(true);
    });
  });
});