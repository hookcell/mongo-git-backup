# mongo-git-backup [![npm version](https://badge.fury.io/js/mongo-git-backup.svg)](https://badge.fury.io/js/mongo-git-backup)

The tool exports text dump (via mongoexport) of given MongoDB database to given Git repository and restores it back (via mongoimport). Please read MIT License agreement before use.

### Pros
- Github and Bitbucket are safe places to store data and history of data changes.
- You don't need to pay for a storage if you're able to create private repos (on Bitbucket they're free).
- You can make as many backups as you can and as often as you want since Git stores diffs instead of storing everything.
- Git GUI clients (including web UI) allow to nicely show diffs between two versions (two commits) of data.

### Cons
- Likely, it isn't good for big databases.

## Install
```
npm install -g mongo-git-backup
```

To run the tool on boot you need to install [pm2](https://github.com/Unitech/pm2).
```
npm install -g pm2
```

## CLI

### `mongo-git-backup export` options

- `--db` - DB name you want to export (required)
- `--repo` - a Git repository where you want to store backups (required)
- `--host` - DB host (optional, `localhost` by default)
- `--port` - DB port (optional, `27017` by default)
- `--branch` - a branch of the Git repository (optional, `master` by default)
- `--gitUserName` - Git user name (optional)
- `--gitUserEmail` - Git user email (optional)
- `--daemonize` - daemonize export via pm2
- `--interval` - an interval of backups in seconds (works when daemonized, `300` by default)
- `--undaemonize` - deletes pm2 process and removes given export settings from the list of mongo-git-backup instances

Example:
```
mongo-git-backup export --db=test --repo=git@github.com:finom/mongo-git-backup.git --branch=test --daemonize
```

To run the tool on startup:

- Daemonize it first.
- Check is `mongo-git-backup` run by typing `pm2 ls` in terminal.
- Run `pm2 save` to save process list.
- Run `pm2 startup` to resurrect the saved process list on startup.

See [PM2 documentation](http://pm2.keymetrics.io/docs/usage/startup/) for more info.

### `mongo-git-backup import` options

- `--db` - DB name you want to restore (required)
- `--repo` - a Git repository where backup is stored (required)
- `--branch` - a branch of the Git repository (optional, `master` by default)
- `--checkout` - switches to a specified commit or git tag (optional)

Example:
```
mongo-git-backup import --db=test --repo=git@github.com:finom/mongo-git-backup.git --branch=test --checkout=tags/foo
```
Tip: add this command to NPM scripts to run it easier.



### API

There are two functions exported: `exportToGit` and `importFromGit`. Both functions return promise. The list of arguments is the same as for CLI.

```js
const { exportToGit, importFromGit } = require('mongo-git-backup');

const options = {
    db: 'test',
    repo: 'git@github.com:finom/mongo-git-backup.git',
    branch: 'test'
}

exportToGit(options).then(() => importFromGit(options));
```

## Common issues

### The daemon doesn't work when I log out from my server

To solve this issue you'll need to use https with generated Github token instead of ssh for repository address.

The token can be generated at settings page:

![](http://i.imgur.com/AXT4cYd.png)

The format is the following: `https://TOKEN@github.com/USERNAME/REPONAME.git` instead of `git@github.com:USERNAME/REPONAME.git`. If you know how to fix the issue let me know.

Example:
```
mongo-git-backup import --db=test --repo=https://000000000000000000000@github.com/finom/mongo-git-backup.git --branch=test --checkout=tags/foo
```
