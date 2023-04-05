// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (access/Ownable.sol)
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT_Ais is ERC721Enumerable, Ownable {
    using Strings for uint256;
    uint256 maxLimit = 80;
    uint256 price = 0.00001 ether;

    mapping(address => uint256[]) listNFTAndAddress;

    string baseURI = "ipfs://QmWtBBvaBtgPBMPaM6pHaxAsc6duDVxqLe9tByAsUgzEFU/";

    constructor() ERC721("Aesthetic", "Ais") {}

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function changeBaseURI(string memory _newBaseURIMetadata) public onlyOwner {
        baseURI = _newBaseURIMetadata;
    }

    function safeMint(address _to) public payable {
        uint256[] storage listNFT = listNFTAndAddress[_to];
        uint256 _currentLimit = totalSupply();
        require(_currentLimit < maxLimit, "You limited");
        require(price == msg.value, "You should add valid amount");
        _safeMint(_to, _currentLimit);
        listNFT.push(_currentLimit);
        listNFTAndAddress[_to] = listNFT;
    }

    function withDraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getMaxLimit() public view returns (uint256) {
        return maxLimit;
    }

    function getListNFT(address _user) public view returns (uint256[] memory) {
        return listNFTAndAddress[_user];
    }
}
