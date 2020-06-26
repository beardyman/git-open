const open = require('open');
const git = require('simple-git');


function getURL() {
  console.log(git.getRemote(true));
}


function main(args) {
  getURL();
}

main();