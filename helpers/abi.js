// Helpers for exporting ABIs

// Uniswap V3
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json")

// Pancakeswap V3
// We use a custom ABI here as Pancakeswap V3 pools has a different swap event emitted
const IPancakeswapV3Pool = [
  {
    "anonymous": false, "inputs":
      [
        { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
        { "indexed": false, "internalType": "int256", "name": "amount0", "type": "int256" },
        { "indexed": false, "internalType": "int256", "name": "amount1", "type": "int256" },
        { "indexed": false, "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
        { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" },
        { "indexed": false, "internalType": "int24", "name": "tick", "type": "int24" },
        { "indexed": false, "internalType": "uint128", "name": "protocolFeesToken0", "type": "uint128" },
        { "indexed": false, "internalType": "uint128", "name": "protocolFeesToken1", "type": "uint128" }
      ],
    "name": "Swap", "type": "event"
  },
  {
    "inputs": [], "name": "slot0", "outputs":
      [
        { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
        { "internalType": "int24", "name": "tick", "type": "int24" },
        { "internalType": "uint16", "name": "observationIndex", "type": "uint16" },
        { "internalType": "uint16", "name": "observationCardinality", "type": "uint16" },
        { "internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16" },
        { "internalType": "uint32", "name": "feeProtocol", "type": "uint32" },
        { "internalType": "bool", "name": "unlocked", "type": "bool" }
      ],
    "stateMutability": "view", "type": "function"
  }
]

module.exports = {
  IUniswapV3Pool: IUniswapV3Pool.abi,
  IPancakeswapV3Pool
}