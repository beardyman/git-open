
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');


describe('Git Open', ()=>{
  let main, git, open;

  beforeEach(()=>{
    open = sinon.stub();
    sinon.stub(console, 'log');

    git = {
      getRemotes: sinon.stub().resolves(),
      branch: sinon.stub().resolves()
    }

    main = proxyquire('../../index', {
      'simple-git/promise': ()=>git,
      open
    })
  });

  afterEach(()=>{
    console.log.restore();
  });

  it('should fail gracefully and notify the user', () => {
    git.getRemotes.resolves();
    return main({}).then(()=>{
      expect(console.log.args[0][0]).to.equal('Could not determine remote UI URL');
    });
  });

  it('should open the URL if its found', () => {
    git.getRemotes.resolves([{name:'origin', refs:{fetch:'Sweet URL'}}]);
    return main({}).then(()=>{
      expect(console.log.args[0][0]).to.equal('Opening Sweet URL...');
    });
  });

  it('should handle ssh cloned urls', () => {
    git.getRemotes.resolves([{name:'origin', refs:{fetch:'git@SweetURL.com:withUser'}}]);
    return main({}).then(()=>{
      expect(console.log.args[0][0]).to.equal('Opening https://SweetURL.com/withUser...');
    });
  });

  it('should handle the branch flag parameter', () => {
    git.getRemotes.resolves([{name:'origin', refs:{fetch:'Sweet URL'}}]);
    git.branch.resolves({current:'branchy'})
    return main({b:true}).then(()=>{
      expect(console.log.args[0][0]).to.equal('Opening Sweet URL/tree/branchy...');
    });
  });

  it('should handle the branch flag parameter on an ssh clone', () => {
    git.getRemotes.resolves([{name:'origin', refs:{fetch:'git@SweetURL.com:withUser'}}]);
    git.branch.resolves({current:'branchy'})
    return main({b:true}).then(()=>{
      expect(console.log.args[0][0]).to.equal('Opening https://SweetURL.com/withUser/tree/branchy...');
    });
  });

});