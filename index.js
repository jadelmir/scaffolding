#!/usr/bin/env node

const prog = require("caporal")
const createCMD = require('./lib/create')
const createNewPage = require('./lib/newPage')
prog
    .version('1.0.0')
    .command('create','create a new application')
    .argument('<template>','template to use')
    .option('--variant <variant>','Which <variant> of the template is going to be created')
    .action(createCMD)
    .command('newPage','create a new page')
    .argument('template','template to use')
    .action(createNewPage)

prog.parse(process.argv);
