
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');


describe('Git Open', ()=>{
  let main, getRemotes, open;

  beforeEach(()=>{
    open = sinon.stub();
    getRemotes = sinon.stub().resolves();
    sinon.stub(console, 'log');

    const simpleGit = ()=>({getRemotes});

    main = proxyquire('../../index', {
      'simple-git/promise': simpleGit,
      open
    })
  });

  afterEach(()=>{
    console.log.restore();
  });

  it('should fail gracefully and notify the user', () => {
    getRemotes.resolves();
    return main().then(()=>{
      expect(console.log.args[0][0]).to.equal('Could not determine remote UI URL');
    });
  });

  it('should open the URL if its found', () => {
    getRemotes.resolves([{name:'origin', refs:{fetch:'Sweet URL'}}]);
    return main().then(()=>{
      expect(console.log.args[0][0]).to.equal('Opening Sweet URL...');
    });
  });

  it('should handle ssh cloned urls', () => {
    getRemotes.resolves([{name:'origin', refs:{fetch:'git@SweetURL.com:withUser'}}]);
    return main().then(()=>{
      expect(console.log.args[0][0]).to.equal('Opening https://SweetURL.com/withUser...');
    });
  });

});