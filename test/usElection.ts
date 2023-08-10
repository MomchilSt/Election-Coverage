import { USElection__factory } from './../typechain-types/factories/Election.sol/USElection__factory';
import { USElection } from './../typechain-types/Election.sol/USElection';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('USElection', function () {
  let usElectionFactory;
  let usElection: USElection;

  before(async () => {
    usElectionFactory = await ethers.getContractFactory('USElection');

    usElection = await usElectionFactory.deploy();

    await usElection.deployed();
  });

  it('Should return the current leader before submit any election results', async function () {
    expect(await usElection.currentLeader()).to.equal(0); // NOBODY
  });

  it('Should return the election status', async function () {
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });

  it('Should submit state results and get current leader', async function () {
    const stateResults = ['California', 1000, 900, 32];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(1); // BIDEN
  });

  it('Should throw when try to submit already submitted state results', async function () {
    const stateResults = ['California', 1000, 900, 32];
    const [owner, addr1] = await ethers.getSigners();

    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      'This state result was already submitted!'
    );
  });

  it('Should submit state results and get current leader', async function () {
    const stateResults = ['Ohaio', 800, 1200, 33];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
  });

  //TODO: ADD YOUR TESTS
  // -------------------

  it('Should throw when we try to submit state with zero seats', async function () {
    const stateResults = ['Texas', 37, 31, 0];

    expect(usElection.submitStateResult(stateResults)).to.be.rejectedWith(
      'States must have at least 1 seat'
    );
  });

  it('Should throw when we try to submit state results with a tie', async function () {
    const stateResults = ['New York', 3, 3, 35];

    expect(usElection.submitStateResult(stateResults)).to.be.rejectedWith(
      'There cannot be a tie'
    );
  });

  it('Should end the elections, get leader and election status', async function () {
    const endElectionTx = await usElection.endElection();

    await endElectionTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP

    expect(await usElection.electionEnded()).to.equal(true); // Ended
  });

  it('Should throw when not owner try to submit state results', async function () {
    const stateResults = ['California', 33, 35, 32];
    const [owner, address] = await ethers.getSigners();

    expect(
      usElection.connect(address).submitStateResult(stateResults)
    ).to.be.rejectedWith('Not invoked by the owner');
  });

  it('Should throw when anyone else then owner try to end the election', async function () {
    const [owner, address] = await ethers.getSigners();

    expect(usElection.connect(address).endElection()).to.be.rejectedWith(
      'Not invoked by the owner'
    );
  });

  it('Should throw when trying to end election that is already ended', async function () {
    const [owner, address] = await ethers.getSigners();

    expect(usElection.endElection()).to.be.rejectedWith(
      'The election has ended already'
    );
  });

  it('Should throw when trying to submit state results after the election has ended', async function () {
    const stateResults = ['Florida', 333, 666, 13];

    expect(usElection.submitStateResult(stateResults)).to.be.rejectedWith(
      'The election has ended already'
    );
  });
});
``;
