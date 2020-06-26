const open = require('open');
const _ = require('lodash');
const git = require('simple-git/promise')();

async function getURL() {
  const remotes = await git.getRemotes(true);
  let remoteUrl = _.get(_.find(remotes, {name: 'origin'}), 'refs.fetch');

  // handle ssh clones
  if (_.startsWith(remoteUrl, 'git@')) {
    remoteUrl = _.replace(remoteUrl, ':', '/'); // replaces `:` before username
    remoteUrl = _.replace(remoteUrl, 'git@', 'https://');
  }

  return remoteUrl;
}


async function main() {
  const url = await getURL();
  if (url) {
    console.log(`Opening ${url}`);
    open(url);
  } else {
    console.log(`Could not determine remote UI URL`);
  }
}

module.exports = main;