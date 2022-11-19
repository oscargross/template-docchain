const { expect } = require("chai");
const { ethers } = require("hardhat");
const SBT = require('../artifacts/contracts/Docchain.sol/SBT.json');

describe("Docchain", function () {
  let deployer;
  let company1;
  let company2;
  let client1Company1;
  let client2Company1;
  let collectionCenter;
  let collection1;
  let collection2;
  let sbtContract1;
  const address0 = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {

    [deployer, company1, company2, client1Company1, client2Company1] = await ethers.getSigners();
    const Collection = await ethers.getContractFactory("Collection")
    collectionCenter = await Collection.deploy();
    await collectionCenter.deployed()
    await collectionCenter.connect(company1).createNewCollection("Company1")
    await collectionCenter.connect(company2).createNewCollection("Company2")
  });

  it("Should create collections", async function () {

    expect(await collectionCenter.connect(deployer).getOwner()).to.equal(deployer.address)
    expect(await collectionCenter.getFee()).to.equal(0);
    await collectionCenter.connect(deployer).updateFee(1)
    expect(await collectionCenter.getFee()).to.equal(1);
    // expect(await collectionCenter.connect(company1).updateFee(1)).to.throw()
    collection1 = await collectionCenter.getCollectionsOfOwner(company1.address);
    collection2 = await collectionCenter.getCollectionsOfOwner(company2.address);
    expect(await collectionCenter.ownerOfCollection(collection1[0])).to.equal(company1.address)
    expect(await collectionCenter.ownerOfCollection(collection2[0])).to.equal(company2.address)

    expect(await collectionCenter.collectionsNames(collection1[0])).to.equal('Company1')
    expect(await collectionCenter.collectionsNames(collection2[0])).to.equal('Company2')
  })

  it("Should issueSBT", async function () {
    // const balanceDeployer = await deployer.getBalance()

    sbtContract1 = new ethers.Contract(collection1[0], SBT.abi, company1.provider)

    await sbtContract1.connect(company1).issueDegree("FirstDegree 1", client1Company1.address, { value: "100000000000000000000" })
    await sbtContract1.connect(company1).issueDegree("FirstDegree 2", client2Company1.address, { value: "100000000000000000000" })

    expect((await sbtContract1.personToDegree(client1Company1.address)).owner).to.equal(deployer.address)
    expect((await sbtContract1.personToDegree(client1Company1.address)).tokenURI).to.equal("FirstDegree 1")
    expect(ethers.BigNumber.from((await sbtContract1.personToDegree(client1Company1.address)).tokenId).toString()).to.equal("1")

    expect((await sbtContract1.personToDegree(client2Company1.address)).owner).to.equal(deployer.address)
    expect((await sbtContract1.personToDegree(client2Company1.address)).tokenURI).to.equal("FirstDegree 2")
    expect(ethers.BigNumber.from((await sbtContract1.personToDegree(client2Company1.address)).tokenId).toString()).to.equal("2")
  })

  it("Should sign and claimSBT client 1", async function () {

    const msgHash1 = await sbtContract1.getMessageHash(client1Company1.address, 1, 'FirstDegree 1')
    const signature1 = await client1Company1.signMessage(ethers.utils.arrayify(msgHash1))
    await sbtContract1.connect(deployer).claimDegree(msgHash1, signature1, { gasLimit: 5000000 })

    expect((await sbtContract1.personToDegree(client1Company1.address)).owner).to.equal(address0)
    expect((await sbtContract1.personToDegree(client1Company1.address)).tokenURI).to.equal("")
    expect(ethers.BigNumber.from((await sbtContract1.personToDegree(client1Company1.address)).tokenId).toString()).to.equal("0")

    expect(await sbtContract1.tokenURI(1)).to.equal('FirstDegree 1')
    expect(await sbtContract1.ownerOf(1)).to.equal(client1Company1.address)
    expect(await sbtContract1.balanceOf(client1Company1.address)).to.equal('1')
    expect((await sbtContract1.connect(company1).getListOwners())[0]).to.equal(client1Company1.address)
  })

  it("Should sign and claimSBT client 2", async function () {

    const msgHash2 = await sbtContract1.getMessageHash(client1Company1.address, 2, 'FirstDegree 2')
    const signature2 = await client2Company1.signMessage(ethers.utils.arrayify(msgHash2))
    await sbtContract1.connect(deployer).claimDegree(msgHash2, signature2, { gasLimit: 5000000 })

    expect((await sbtContract1.personToDegree(client2Company1.address)).owner).to.equal(address0)
    expect((await sbtContract1.personToDegree(client2Company1.address)).tokenURI).to.equal("")
    expect(ethers.BigNumber.from((await sbtContract1.personToDegree(client2Company1.address)).tokenId).toString()).to.equal("0")

    expect(await sbtContract1.tokenURI(2)).to.equal('FirstDegree 2')
    expect(await sbtContract1.ownerOf(2)).to.equal(client2Company1.address)
    expect(await sbtContract1.balanceOf(client2Company1.address)).to.equal('1')
    expect((await sbtContract1.connect(company1).getListOwners())[1]).to.equal(client2Company1.address)
  })

  it("Should burn SBT of client1", async function () {

    await sbtContract1.connect(client1Company1).burnSBT(1)
    // await sbtContract1.tokenURI(1).catch(err => expect(err).throw() )
    // await sbtContract1.ownerOf(1).catch(err => expect(err).throw() )
    expect(await sbtContract1.balanceOf(client1Company1.address)).to.equal('0')
    expect((await sbtContract1.connect(company1).getListOwners())[0]).to.equal(address0)
  })

  it("Should mint Own SBT", async function () {

    await sbtContract1.connect(company1).mintOwnSBT("FirstDegree 3")
    expect(await sbtContract1.tokenURI(3)).to.equal('FirstDegree 3')
    expect(await sbtContract1.ownerOf(3)).to.equal(company1.address)
    expect(await sbtContract1.balanceOf(company1.address)).to.equal('1')
    expect((await sbtContract1.connect(company1).getListOwners())[2]).to.equal(company1.address)
  })
  // ethers.Wallet('').sig
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  // async function deployOneYearLockFixture() {
  //   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  //   const ONE_GWEI = 1_000_000_000;

  //   const lockedAmount = ONE_GWEI;
  //   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  //   // Contracts are deployed using the first signer/account by default
  //   const [owner, otherAccount] = await ethers.getSigners();

  //   const Lock = await ethers.getContractFactory("Lock");
  //   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  //   return { lock, unlockTime, lockedAmount, owner, otherAccount };
  // }

  // describe("Deployment", function () {
  //   it("Should set the right unlockTime", async function () {
  //     const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

  //     expect(await lock.unlockTime()).to.equal(unlockTime);
  //   });

  //   it("Should set the right owner", async function () {
  //     const { lock, owner } = await loadFixture(deployOneYearLockFixture);

  //     expect(await lock.owner()).to.equal(owner.address);
  //   });

  //   it("Should receive and store the funds to lock", async function () {
  //     const { lock, lockedAmount } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  // expect(await ethers.provider.getBalance(lock.address)).to.equal(
  //       lockedAmount
  //     );
  //   });

  //   it("Should fail if the unlockTime is not in the future", async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest();
  //     const Lock = await ethers.getContractFactory("Lock");
  //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //       "Unlock time should be in the future"
  //     );
  //   });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
