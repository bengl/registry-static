/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License.
See LICENSE file.
*/
var path = require('path');
var os = require('os');
var log = require('davlog');
var fs = require('fs');
var yargs = require('yargs');

//hack in a default config. no need after https://github.com/chevex/yargs/pull/75
if (process.argv.indexOf('--config') === -1 && process.argv.indexOf('-c') === -1) {
    var defaultConfig = path.resolve(path.dirname(process.execPath), '../etc/registry-static/config.json');
    if (fs.existsSync(defaultConfig)) {
        process.argv.push('--config');
        process.argv.push(defaultConfig);
    }
}

var options = yargs(process.argv);

//override yargs' help
options.showHelp = function () {
    require('./help');
};

options = options
    .help('help')
    .alias('help', 'h')
    .string('user group log report registry index error tmp dir domain'.split(' '))
    .boolean('sync restart check tarballs clone clean version quiet'.split(' '))
    .config('config')
    .config('c')
    .alias('user', 'u')
    .alias('group', 'g')
    .alias('spawn', 's')
    .default('spawn', 20)
    .alias('limit', 'l')
    .default('limit', 10)
    .alias('dir', 'o')
    .alias('tmp', 't')
    .alias('domain', 'd')
    .alias('version', 'v')
    .default('registry', 'http://registry.npmjs.org/')
    .default('tmp', os.tmpdir())
    .default('index', path.join(__dirname, '../defaults', 'index.json'))
    .default('error', path.join(__dirname, '../defaults', '404.json'))
    .argv;

//This one isn't configurable.
options.seqFile = path.join(options.tmp, 'registry-static.seq');

if (options.user) {
    //Not wrapping this, if it throws, it throws..
    process.setuid(options.user);
}

if (options.group) {
    //Not wrapping this, if it throws, it throws..
    process.setgid(options.group);
}

if (!options.version && !options.help && !options.restart) {
    if (!options.domain && !options.check) {
        log.err('Domain rewrite url not provided, try --help');
        process.exit(250);
    }
    if (!options.dir) {
        log.err('Output directory not found, try --help');
        process.exit(250);
    }
} //otherwise we're not actually running, so don't bother with the checks

module.exports = options;
