const open = require('open');
const _ = require('lodash');
const git = require('simple-git/promise')();


/**
 * Attempts to get the remote URL of the origin
 * @returns {Promise<*>}
 */
async function getURL(branchFlag = false) {
  const remotes = await git.getRemotes(true);
  let remoteUrl = _.get(_.find(remotes, {name: 'origin'}), 'refs.fetch');

  // handle ssh clones
  if (_.startsWith(remoteUrl, 'git@')) {
    remoteUrl = _.replace(remoteUrl, ':', '/'); // replaces `:` before username
    remoteUrl = _.replace(remoteUrl, 'git@', 'https://');
  }

  if(branchFlag) {
    const currentBranch = await git.branch();
    remoteUrl = `${_.replace(remoteUrl, '.git', '')}/tree/${currentBranch.current}`;
  }

  return remoteUrl;
}

/**
 * Main execution script
 * @returns {Promise<void>}
 */
async function main(args) {
  const url = await getURL(args.b);
  if (url) {
    console.log(`Opening ${url}...`);
    open(url);
  } else {
    console.log(`Could not determine remote UI URL`);
  }
}

module.exports = main;