#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2), {
  alias: {b:'branch'}
});


require('../index')(argv).then(()=>{
  process.exit(0);
})