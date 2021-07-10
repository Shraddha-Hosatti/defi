const RequestFactory = artifacts.require("RequestFactory");
const Governance = artifacts.require("Governance");
const P2PPlatform = artifacts.require("P2PPlatform");
const P2PToken = artifacts.require("P2PToken");

contract("P2PPlatform", accounts => {
    beforeEach(async () => {
        _amount = 100;
        _paybackAmount = 200;
        _purpose = "test";
        _requestFactory = await RequestFactory.new()
        _governance = await Governance.new(1)
        _p2pPlatform = await P2PPlatform.new(_requestFactory.address, _governance.address)
        _p2pToken = await P2PToken.new(10000000, "P2PToken", 0, "P2PT")
        _colletralTimeStamp = 123
        _colletral = 2000000000 // Make this 0 to fail test case
    });

    it("Ask", async () => {
        try {
            result = await _p2pPlatform.ask(
                    _amount,
                    _paybackAmount,
                    _purpose,
                    _p2pToken.address,
                    _colletralTimeStamp,
                    {
                        value : _colletral
                    }
                );
            
        } catch (error) {
        	console.error("error", error)
            assert(false,"Failed");
        }
    });
});