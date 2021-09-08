/**
 * 
 */
let tests = {
   'add' : './add',
   'constructor': './constructor' ,
   'job deletion': './delete',
   'update job': './update',
   'start': './startStop'
};

for (test in tests) {
    let currentTest = require(tests[test]);
    if (currentTest.test instanceof Function) {
        console.log(`Rodando test: ${test}`)
        currentTest.test.call(currentTest.context ? currentTest.context : this); // Passar um contexto
    }
}
