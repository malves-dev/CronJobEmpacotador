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

function CrontabManager(key, tab, task, options) {
  this.jobs = {};
  if (key && tab && task) {
    this.add(key, tab, task, options);
  }
}

CrontabManager.prototype.add = function (key, tab, task, options) {
  if ((typeof tab === 'string' || tab instanceof Date) && typeof key === 'string' && task instanceof Function) {
    options = combineOptions(tab, task, options);
    try {
      if (this.jobs[key]) {
        this.deleteJob(key);
        console.warn(`${key} já existia e foi excluído do gerenciador...`);
      }
      this.jobs[key] = new CronJob(options);
    } catch (fooBaredByUser) {
      const err = `crontab: ${tab} possivelmente não é válido, trabalho ${key} não foi iniciado...${fooBaredByUser.message}`;
      throw new Error(err);
    }
  } else {
    console.warn(`Não pode adicionar: ${key} argumentos impróprios`);
  }
}

CrontabManager.prototype.update = function () {
  if (arguments.length === 2) {
    // console.log("arguments are 2 units long." )
    // console.log(arguments)
    if (typeof arguments[1] === 'string' || arguments[1] instanceof Date) {
      updateTab.call(this, arguments[0], arguments[1]);
    } else if (arguments[1] instanceof Function) {
      updateTask.call(this, arguments[0], arguments[1]);
    }
  } else if (arguments.length === 3) {
    updateTab.call(this, arguments[0], arguments[1])
    updateTask.call(this, arguments[0], arguments[2])
  } else {
    const err = `Número incorreto de argumentos passados, para a atualização. ${arguments[0]}`;
    throw new Error(err);
  }
}

CrontabManager.prototype.deleteJob = function (key) {
  try {
    this.jobs[key].stop();
    delete this.jobs[key];
  } catch (err) {
    const error = `Erro ao tentar parar o trabalho: ${key}: ${err}`;
    throw new Error(error);
  }
}

CrontabManager.prototype.deleteAll = function () {
  for (jobKey in this.jobs) {
    try {
      this.jobs[jobKey].stop();
      delete this.jobs[jobKey];
    } catch (err) {
    }
  }
}

CrontabManager.prototype.start = function (key) {
  try {
    if (this.jobs[key].running) {
      console.warn(`${key} job already running`);
    } else {
      this.jobs[key].start();
    }
  } catch (err) {
    const error = `Não conseguiu iniciar o trabalho: ${key}: ${err}`;
    console.error(error);
    throw new Error(error);
  }
}

CrontabManager.prototype.startAll = function () {
  for (jobKey in this.jobs) {
    try {
      this.jobs[jobKey].start()
    } catch (err) {
    }
  }
}

CrontabManager.prototype.stop = function (key) {
  try {
    if (!this.jobs[key].running) {
      console.warn(`${key} trabalho já parado`);
    } else {
      this.jobs[key].stop();
    }
  } catch (err) {
    const error = `Não consegui parar o trabalho: ${key}: ${err}`;
    console.error(error);
    throw new Error(error);
  }
}

CrontabManager.prototype.stopAll = function () {
  for (jobKey in this.jobs) {
    try {
      this.jobs[jobKey].stop()
    } catch (err) {

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

CrontabManager.prototype.exists = function (tabKey) {
  if (this.jobs[tabKey]) {
    return true;
  }
  return false;
}

CrontabManager.prototype.fireOnTick = function (tabKey) {
  if (this.jobs[tabKey]) {
    return this.jobs[tabKey].fireOnTick()
  }
}

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

function updateTab(key, cronstring) {
  try {
    var running = this.jobs[key].running;
    this.jobs[key].stop()
    if (typeof cronstring === 'string' || cronstring instanceof Date) {
      this.jobs[key] = new CronJob(cronstring, this.jobs[key]._callbacks[0], this.jobs[key].onComplete, running, this.jobs[key].zone)
    } else {
      throw new Error(`A definição cron passada não era uma string ou um objeto Date! ${key} foi interrompido e não atualizado`);
    }
  } catch (tabErr) {
    const err = `Erro ao atualizar a guia: ${key} - ${tabErr.message}`
    throw new Error(err);
  }
}

function updateTask(key, task) {
  try {
    var running = this.jobs[key].running;
    this.jobs[key].stop()
    if (!(task instanceof Function)) {
      const err= `Não é possível atualizar com algo que não seja uma função: ${typeof(task)}`
      console.error(err);
      throw new Error(err);
    }
    this.jobs[key] = new CronJob(this.jobs[key].cronTime.source, task, this.jobs[key].onComplete, running, this.jobs[key].zone)
  } catch (tabErr) {
    const err = `Erro ao atualizar tarefa: ${key} - ${tabErr.message}`;
    console.error(err);
    throw new Error(err);
  }
}

module.exports = CrontabManager;
