/**
 * crontabmanager.js - post callbacks to cronjobs
 * - create, update, delete cronjobs via the net
 * please see https://github.com/ncb000gt/node-cron and http://crontab.org/ for crontab info
 * Synopsis:
 *  var CronTabManager = require('crontab_manager'),
 *  myCronTabManager = new CronTab(key, '* 2/2 13-16 * *', function, options  ) // or
 *  myCronTabManager = new CronTab()
 * in the first form, a new job is created on key 'key' with onTick set to 'function', cronTime is set to '* 2/2 13-16 * *', and options can include stuff like start, onComplete, and timeZone
 * the second form just a new manager is created to which you can add jobs. Remember jobs do not start automatically, you have to set options to {start: true} or call start() after the job is created.
 *
 * Other methods include:
 *  myCronTabManager.update(key, newCronString) //or
 *  myCronTabManager.upadte(key, tabOrfunction) // or
 *  myCronTabManager.update(key, tab,function)
 *  myCronTabManager.stop(key)
 *  myCronTabManager.start(key)
 *  myCronTabManager.deleteJob(key)
 *  myCronTabManager.add(key, cronString, function, options)
 *
 * currently you cannot set context for any job.
 */

 const CronJob = require('cron').CronJob;

/**
 * 
 * @param {*} key 
 * @param {*} tab 
 * @param {*} task 
 * @param {*} options 
 */
function CrontabManager (key, tab, task, options) {
   this.jobs = {};
   if (key && tab && task) {
     this.add(key, tab, task, options);
   }
 }
 
 /**
  * 
  * @param {*} job 
  * @param {*} tab 
  * @param {*} task 
  * @param {*} options 
  */
 CrontabManager.prototype.add = function (job, tab, task, options) {
   if ((typeof tab === 'string' || tab instanceof Date) && typeof job === 'string' && task instanceof Function) {
     options = combineOptions(tab, task, options);
     try {
       if (this.jobs[job]) {
         this.deleteJob(job);
       }
       this.jobs[job] = new CronJob(options);
     } catch (error) {
       const msg = `Crontab '${tab}' possivelmente não é válido, o trabalho: '${job}' não foi iniciado. ${error.message}`;
       console.error(msg);
       throw { message: msg };
     }
   } else {
     const msg = `Não pode adicionar o trabalho: '${job}', argumentos inválidos.`;
     console.error(msg);
     throw { message: msg };
   }
 }
 
 /** Atualiza o trabalho */
 CrontabManager.prototype.update = function () {
   if (arguments.length === 2) {
     if (typeof arguments[1] === 'string' || arguments[1] instanceof Date) {
       updateTab.call(this, arguments[0], arguments[1]);
     } else if (arguments[1] instanceof Function) {
       updateTask.call(this, arguments[0], arguments[1]);
     }
   } else if (arguments.length === 3) {
     updateTab.call(this, arguments[0], arguments[1])
     updateTask.call(this, arguments[0], arguments[2])
   } else {
     const msg = `Número incorreto de argumentos passados: '${arguments[0]}', para a atualização.`;
     console.error(msg);
     throw { message: msg };
   }
 }
 
 /**
  * 
  * @param {*} job 
  */
 CrontabManager.prototype.deleteJob = function (job) {
   try {
     this.jobs[job].stop();
     delete this.jobs[job];
   } catch (error) {
     const msg = `Erro ao tentar apagar o trabalho: '${job}'. ${error.message}`;
     console.error(msg);
     throw { message: msg };
   }
 }
 
 /**
  * 
  */
 CrontabManager.prototype.deleteAll = function () {
   for (job in this.jobs) {
     try {
       this.jobs[job].stop();
       delete this.jobs[job];
     } catch (error) {
      const msg = `Erro ao tentar apagar trabalho: '${job}' ${error.message}`;
      console.error(msg);
      throw { message: msg };
     }
   }
 }
 
 /**
  * 
  * @param {*} job 
  */
 CrontabManager.prototype.start = function (job) {
   try {
     if (this.jobs[job].running) {
      throw { message: `Trabalho já em execução.` };
     } else {
       this.jobs[job].start();
     }
   } catch (error) {
    const msg = `Erro ao iniciar trabalho: '${job}'. ${error.message}`;
    console.error(msg);
    throw { message: msg };
   }
 }
 
 CrontabManager.prototype.startAll = function () {
   for (job in this.jobs) {
     try {
       this.jobs[job].start();
     } catch (error) {
      const msg = `Erro ao iniciar trabalho : '${job}'. ${error.message}`;
      console.error(msg);
      throw { message: msg };
     }
   }
 }
 
 /**
  * 
  * @param {*} job 
  */
 CrontabManager.prototype.stop = function (job) {
  try {
    if (!this.jobs[job].running) {
      throw  { message: `Trabalho já está parado.` };
    } else {
      this.jobs[job].stop();
    }
  } catch (error) {
    const msg = `Erro ao parar trabalho: '${job}'. ${error.message}`;
    console.error(msg);
    throw { message: msg };
  }
}
 
 CrontabManager.prototype.stopAll = function () {
   for (job in this.jobs) {
     try {
       this.jobs[job].stop()
     } catch (error) {
       const msg = `Erro ao parar trabalho: '${job}'. ${error.message}`;
       console.error(msg);
       throw { message: msg };
     }
   }
 }
 
 CrontabManager.prototype.toString = function () {
   let manString = "{\n";
   for (jobKey in this.jobs) {
     manString += `'${jobKey}': ${this.jobs[jobKey].cronTime.source}: ${this.jobs[jobKey]._callbacks[0]}: ${this.jobs[jobKey].running ? "Running" : "Stopped"}`
   }
   manString += "\n}";
   return manString;
 }
 
 CrontabManager.prototype.listCrons = function () {
   let manString = "{\n";
   for (jobKey in this.jobs) {
     manString += `'${jobKey}': ${this.jobs[jobKey].cronTime.source} status: ${this.jobs[jobKey].running ? "Running" : "Stopped"} \n`;
   }
   manString += "\n}";
   return manString;
 }
 
 /**
  * 
  * @param {*} job 
  * @returns true/false
  */
 CrontabManager.prototype.exists = function (job) {
   if (this.jobs[job]) {
     return true;
   }
   return false;
 }
 
 /**
  * 
  * @param {*} job 
  * @returns 
  */
 CrontabManager.prototype.fireOnTick = function (job) {
   if (this.jobs[job]) {
     return this.jobs[job].fireOnTick()
   }
 }
 
 /**
  * 
  * @param {*} tab 
  * @param {*} task 
  * @param {*} options 
  * @returns 
  */
 function combineOptions(tab, task, options) {
   let newOpts = {};
   newOpts.cronTime = tab;
   newOpts.onTick = task
   if (options instanceof Object) {
     // Pode sobrescrever... por favor, tome cuidado.
     for (optionKey in options) {
       newOpts[optionKey] = options[optionKey];
     }
   }
   return newOpts;
 }
 
 /**
  * 
  * @param {*} job 
  * @param {*} cronstring 
  */
 function updateTab(job, cronstring) {
   try {
     const running = this.jobs[job].running;
     this.jobs[job].stop()
     if (typeof cronstring === 'string' || cronstring instanceof Date) {
       this.jobs[job] = new CronJob(cronstring, this.jobs[job]._callbacks[0], this.jobs[job].onComplete, running, this.jobs[job].zone)
     } else {
       throw { message: `A definição crontrab passada não é uma string ou um objeto Date! '${job}' foi interrompido e não atualizado.` };
     }
   } catch (error) {
     const msg = `Erro ao atualizar o crontab do trabalho: '${job}'. ${error.message}`;
     console.error(msg);
     throw { message: msg };
   }
 }
 
 /**
  * 
  * @param {*} job 
  * @param {*} task 
  */
 function updateTask(job, task) {
   try {
     var running = this.jobs[job].running;
     this.jobs[job].stop()
     if (!(task instanceof Function)) {
       throw { message: `Não é possível atualizar com algo que não seja uma função: ${typeof(task)}.` };
     }
     this.jobs[job] = new CronJob(this.jobs[job].cronTime.source, task, this.jobs[job].onComplete, running, this.jobs[job].zone)
   } catch (error) {
     const msg = `Erro ao atualizar tarefa: ${job} - ${error.message}`;
     console.error(msg);
     throw { message: msg };
   }
 }
 
 module.exports = CrontabManager;
 