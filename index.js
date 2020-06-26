const open = require('open');
const _ = require('lodash');
const git = require('simple-git/promise')();

async function getURL() {
  const remotes = await git.getRemotes(true);
  return _.get(_.find(remotes, {name: 'origin'}), 'refs.fetch');
}


async function main(args) {
  const url = await getURL();
  if (url) {
    console.log(`Opening ${url}`);
    open(url);
  } else {
    console.log(`Could not determine remote UI URL`);
  }
}

module.exports = main;