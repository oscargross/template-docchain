// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";


interface IERC721Modified is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    // event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     bytes calldata data
    // ) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    // function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator  ` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    // function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    // function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    // function isApprovedForAll(address owner, address operator) external view returns (bool);
}

interface IERC721Metadata is IERC721Modified {
    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

contract ERC721Modified is
    Context,
    ERC165,
    IERC721Modified,
    IERC721Metadata
{
    using Address for address;
    using Strings for uint256;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    address[] private _listOwners;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721Modified: mint to the zero address");
        require(!_exists(tokenId), "ERC721Modified: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;
        _listOwners.push(to);
        emit Transfer(address(0), to, tokenId);

        _afterTokenTransfer(address(0), to, tokenId);
    }

    function _getListOwners() internal view returns (address[] memory) {
        return _listOwners;
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ERC721Modified.ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];
        delete _listOwners[tokenId - 1];
        emit Transfer(owner, address(0), tokenId);

        _afterTokenTransfer(owner, address(0), tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC721Modified).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner)
        public
        view
        virtual
        override
        returns (uint256)
    {
        require(
            owner != address(0),
            "ERC721Modified: balance query for the zero address"
        );
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        address owner = _owners[tokenId];
        require(
            owner != address(0),
            "ERC721Modified: owner query for nonexistent token"
        );
        return owner;
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev See {IERC721-approve}.
     */
    // function approve(address to, uint256 tokenId) public virtual override {
    //     address owner = ERC721.ownerOf(tokenId);
    //     require(to != owner, "ERC721: approval to current owner");

    //     require(
    //         _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
    //         "ERC721: approve caller is not owner nor approved for all"
    //     );

    //     _approve(to, tokenId);
    // }

    /**
     * @dev See {IERC721-getApproved}.
     */
    // function getApproved(uint256 tokenId) public view virtual override returns (address) {
    //     require(_exists(tokenId), "ERC721: approved query for nonexistent token");

    //     return _tokenApprovals[tokenId];
    // }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    // function setApprovalForAll(address operator, bool approved) public virtual override {
    //     _setApprovalForAll(_msgSender(), operator, approved);
    // }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    // function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
    //     return _operatorApprovals[owner][operator];
    // }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) public virtual override {
    //     //solhint-disable-next-line max-line-length
    //     require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

    //     _transfer(from, to, tokenId);
    // }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) public virtual override {
    //     safeTransferFrom(from, to, tokenId, "");
    // }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     bytes memory _data
    // ) public virtual override {
    //     require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    //     _safeTransfer(from, to, tokenId, _data);
    // }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    // function _safeTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     bytes memory _data
    // ) internal virtual {
    //     _transfer(from, to, tokenId);
    //     require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    // }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    // function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
    //     require(_exists(tokenId), "ERC721: operator query for nonexistent token");
    //     address owner = ERC721.ownerOf(tokenId);
    //     return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    // }

    /**
     * @dev Safely mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    // function _safeMint(address to, uint256 tokenId) internal virtual {
    //     _safeMint(to, tokenId, "");
    // }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    // function _safeMint(
    //     address to,
    //     uint256 tokenId,
    //     bytes memory _data
    // ) internal virtual {
    //     _mint(to, tokenId);
    //     require(
    //         _checkOnERC721Received(address(0), to, tokenId, _data),
    //         "ERC721: transfer to non ERC721Receiver implementer"
    //     );
    // }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    // function _transfer(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) internal virtual {
    //     require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
    //     require(to != address(0), "ERC721: transfer to the zero address");

    //     _beforeTokenTransfer(from, to, tokenId);

    //     // Clear approvals from the previous owner
    //     // _approve(address(0), tokenId);

    //     _balances[from] -= 1;
    //     _balances[to] += 1;
    //     _owners[tokenId] = to;

    //     emit Transfer(from, to, tokenId);

    //     _afterTokenTransfer(from, to, tokenId);
    // }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits a {Approval} event.
     */
    // function _approve(address to, uint256 tokenId) internal virtual {
    //     _tokenApprovals[tokenId] = to;
    //     emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    // }

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Emits a {ApprovalForAll} event.
     */
    // function _setApprovalForAll(
    //     address owner,
    //     address operator,
    //     bool approved
    // ) internal virtual {
    //     require(owner != operator, "ERC721: approve to caller");
    //     _operatorApprovals[owner][operator] = approved;
    //     emit ApprovalForAll(owner, operator, approved);
    // }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (to.isContract()) {
            try
                IERC721Receiver(to).onERC721Received(
                    _msgSender(),
                    from,
                    tokenId,
                    _data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert(
                        "ERC721Modified: transfer to non ERC721Receiver implementer"
                    );
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {}
}

abstract contract ERC721URIStorageModified is ERC721Modified {
    using Strings for uint256;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorageModified: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721URIStorageModified: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}

contract Collection {
    address private owner;
    uint256 private fee;

    mapping(address => address) public ownerOfCollection;
    mapping(address => address[]) private collectionsOfOwner;
    mapping(address => string) public collectionsNames;

    constructor() {
        owner = msg.sender;
    }

    function createNewCollection(string memory name)
        external
        returns (address)
    {
        address newCollection = address(new SBT(address(this)));
        collectionsOfOwner[msg.sender].push(newCollection);
        ownerOfCollection[newCollection] = msg.sender;
        collectionsNames[newCollection] = name;
        return newCollection;
    }

    function getCollectionsOfOwner(address _owner)
        external
        view
        returns (address[] memory)
    {
        return collectionsOfOwner[_owner];
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function getFee() external view returns (uint256) {
        return fee;
    }

    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

contract SBT is ERC721URIStorageModified {
    using Address for address;
    using Strings for uint256;
    address private collection;
    address private owner;
    uint256 private fee;
    struct NewToken {
        address owner;
        string tokenURI;
        uint256 tokenId;
    }
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => NewToken) public personToDegree;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _collection) ERC721Modified("Docchain", "SBT") {
        collection = _collection;
        owner = tx.origin; //msg.sender;
    }

    function issueDegree(string memory _tokenURI, address _graduate)
        external
        payable
        onlyOwner
        returns (uint256)
    {
        Collection(collection).getOwner();
        require(
            msg.value > Collection(collection).getFee(),
            "Value not enough"
        );
        payable(Collection(collection).getOwner()).transfer(msg.value);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        NewToken memory newToken;
        newToken.owner = Collection(collection).getOwner();
        newToken.tokenURI = _tokenURI;
        newToken.tokenId = newItemId;
        personToDegree[_graduate] = newToken;
        return newItemId;
    }

    function burnSBT(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only owner of token can burn SBT"
        );
        _burn(tokenId);
    }

    function mintOwnSBT(string memory tokenURI)
        external
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function getListOwners()
        external
        view
        onlyOwner
        returns (address[] memory)
    {
        return _getListOwners();
    }

    function claimDegree(bytes32 _messageHash, bytes memory _signature) public {
        bytes32 _ethSignedMessageHash = getEthSignedMessageHash(_messageHash);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        address newOwner = ecrecover(_ethSignedMessageHash, v, r, s);
        NewToken memory newToken = personToDegree[newOwner];
        require(
            newToken.owner == msg.sender,
            "only the intermediate owner can mint SBT"
        );
        _mint(newOwner, newToken.tokenId);
        _setTokenURI(newToken.tokenId, newToken.tokenURI);
        delete personToDegree[newOwner];
    }

    // SIGNATURE
    function getMessageHash(
        address person,
        uint256 tokenId,
        string memory tokenURI
    ) public view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(person, tokenId, tokenURI, address(this))
            );
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");
        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
