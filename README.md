Empacotador CronJob
===================

Um empacotador node-cron que gerencia muitos jobs de uma vez. 
Isso foi construído baseado no [cron] (https://www.npmjs.com/package/cron-job-manager).

Instalação
=============
```bash
npm install cronjob-empacotador
```
Testando
===========
```bash
npm test cronjob-empacotador
```
Qualquer assertion que falhe deve gerar um erro não detectado.

Sinopse
============
```javascript
const CronJobEmpacotador = require('cronjob-empacotador');
  
// Cria um gerenciador, para um novo trabalho.
const manager = new CronJobEmpacotador('trabalho_um','0 30 * * * *', () => { 
  console.log("Realizando o trabalho um...");
};

// Outro Trabalho
manager.add('trabalho_dois', '0 40 * * * *', () => { 
  console.log('Realizando o trabalho dois......')
});

// Inicia o trabalho
manager.start('trabalho_um');

// Para o trabalho
manager.stop('trabalho_um');

// Verifica se trabalho existe
manager.exists('trabalho_um') //true

// Atualiza um trabalho
manger.update('trabalho_um', "0 */2 * * * *", () => {
  console.log("Agora executando este trabalho a cada dois minutos, usando esta função..."
});

console.log(`Os trabalhos atuais são: ${manager}`);
```
Criar um gerenciamento
===
Criar um objeto objeto de gerenciamento é fácil, você pode criar um com argumentos que se tornam uma nova tarefa ou apenas criar um para adicionar tarefas posteriormente:
```javascript
const manager1 = new CronJobManager('nome_trabalho', '30 * * * * *', taskFunction,
  {
    start: true,   
    onComplete: taskCompleteFunction, 
    timeZone:"Australia/Sydney"
  });
  
const manager2 = new CronJobManager();

// Execute o trabalho neste momento nesta data.
const dateToRun = new Date('2020-08-03T17:35:43-0400') 

const manager3 = new CronJob('um_temporizador', dateToRun, () => { 
  console.log('Escute com atenção.. Direi isso apenas uma vez!') 
}, options);
```
O objeto de opções finais é opcional, essas são opções passadas para node-cron e incluem o seguinte:
  * start: true/false
  * onComplete: function - é executado quando o trabalho é interrompido
  

Adicionando trabalhos
===
Trabalhos são adicionados com argumentos semelhantes aos anteriores com a função *add*:
```javascript
manager.add('nome_trabalho','* 30 * * * *', taskFunction)
```
Neste caso, com o objeto de opções finais deixado de fora dos argumentos, o trabalho será criado com os padrões de node-cron, isso significa que o trabalho não será iniciado até que você diga para ele, não haverá função de conclusão e o fuso horário será o padrão para o que você tiver definido para usar o processo node.js.

Se a chave que você está usando já existe no gerenciador, essa chave será sobrescrita, o trabalho original será interrompido e este ocupará o seu lugar. Um aviso será impresso no log quando isso acontecer.

No lugar de uma expressão cron, você pode usar um objeto JS Date.

Inicicar trabalhos
===
Para iniciar um trabalho, você pode usar a função *start*
```javasctipt
manager.start('nome_trabalho')
```

Parando Trabalhos
===
Parar é só usar a função *stop*
```javascript
manager.stop('nome_trabalho')
```

Parando todos os trabalhos
===
Para parar todos os trabalhos no gerenciador, use a função *stopAll*
```javascript
manager.stopAll()
```
Quaisquer argumentos são ignorados.

Atualizando trabalhos
===
Você pode querer alterar a tarefa de qualquer trabalho durante a execução. Você pode fazer isso usando o função*update*
```javascript
manager.update('nome_trabalho', '0 15 3,5,9,14,18,20 * * *', () => {// Faça isso neste novo cronograma});
manager.update('nome_trabalho', () => { // Faça isso ao invés});
manager.update('nome_trabalho', '0 15 3,5,9,14,18,20 * * *') // Em vez disso, faça-o nesta programação.
```
O trabalho antigo na programação anterior será interrompido, alterado e reiniciado se estava em execução quando você chamou a função *update*. Se você estiver apenas alterando a função, o trabalho continuará a usar o esquema atual. Se você estiver apenas alterando a programação, o trabalho continuará a usar a função atual.

Apagando trabalhos
===
Você pode excluir qualquer trabalho interrompido ou em execução usando a função *deleteJob*
```javascript
manager.deleteJob('nome_trabalho')
```
O trabalho será interrompido e, em seguida, removido do gerenciador, qualquer tentativa de alterar a *chave* após a exclusão resultará em uma mensagem de erro no log, uma vez que ele não existe mais.

Vendo trabalhos
===
Se quiser ver quais tarefas que configurou, basta passar seu gerente como uma string. Ele exibirá uma lista formatada de jobs e seus crontabs, e se eles têm uma função a ser executada.
```javascript
console.log(`trabalhos atuais: ${manager}`)
```
Se precisar de mais detalhes ou quiser passar a string para outro lugar, você pode usar a função *listCrons*
```javascript
const jobs = manager.listCrons();
doSomethingWithJobList(jobs);
````

Verificando trabalhos existentes
===
Para verificar se existe um trabalho com uma chave específica, use a função *exists*
```javascript
if (manager.exists('nome_trabalho')) { 
  console.log("nome_trabalho existe");
}
```
