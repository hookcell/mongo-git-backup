#!/usr/bin/env node
const { argv } = require('yargs');
const pkg = require('./package');
const { exportToGit, importFromGit } = require('./');

const {
    _: [type],
    version,
    host,
    port,
    db,
    repo,
    branch,
    tmpDir,
    gitUserName,
    gitUserEmail,
    daemonize,
    undaemonize,
    interval,
    checkout,
} = argv;

const options = {
    host,
    port,
    db,
    repo,
    branch,
    tmpDir,
    gitUserName,
    gitUserEmail,
    daemonize,
    undaemonize,
    interval,
    checkout,
};

if (version) {
    console.log(pkg.version);
} else {
    if (!db) {
        throw Error('--db parameter is required');
    }

    if (!repo) {
        throw Error('--repo parameter is required');
    }

    if (type === 'export') {
        exportToGit(options);
    } else if (type === 'import') {
        importFromGit(options);
    } else {
        throw Error(`Bad type parameter "${type}"`);
    }
}
