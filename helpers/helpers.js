const ethers = require("ethers")
const Big = require('big.js')

/**
 * This file could be used for adding functions you
 * may need to call multiple times or as a way to
 * abstract logic from bot.js. Feel free to add
 * in your own functions you desire here!
 */

const { IUniswapV3Pool, IPancakeswapV3Pool } = require('./abi')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

async function getTokenAndContract(_token0Address, _token1Address, _provider) {
  const token0Contract = new ethers.Contract(_token0Address, IERC20.abi, _provider)
  const token1Contract = new ethers.Contract(_token1Address, IERC20.abi, _provider)

  const token0 = {
    contract: token0Contract,
    address: _token0Address,
    symbol: await token0Contract.symbol(),
    decimals: await token0Contract.decimals(),
  }

  const token1 = {
    contract: token1Contract,
    address: _token1Address,
    symbol: await token1Contract.symbol(),
    decimals: await token1Contract.decimals(),
  }

  return { token0, token1 }
}

async function getPoolAddress(_factory, _token0, _token1, _fee) {
  const poolAddress = await _factory.getPool(_token0, _token1, _fee)
  return poolAddress
}

async function getPoolContract(_exchange, _token0, _token1, _fee, _provider) {
  const poolAddress = await getPoolAddress(_exchange.factory, _token0, _token1, _fee)
  const poolABI = _exchange.name === "Uniswap V3" ? IUniswapV3Pool : IPancakeswapV3Pool
  const pool = new ethers.Contract(poolAddress, poolABI, _provider)
  return pool
}

async function getPoolLiquidity(_factory, _token0, _token1, _fee, _provider) {
  const poolAddress = await getPoolAddress(_factory, _token0.address, _token1.address, _fee)

  const token0Balance = await _token0.contract.balanceOf(poolAddress)
  const token1Balance = await _token1.contract.balanceOf(poolAddress)

  return [token0Balance, token1Balance]
}

async function calculatePrice(_pool, _token0, _token1) {
  // Understanding Uniswap V3 prices
  // --> https://blog.uniswap.org/uniswap-v3-math-primer

  // Get sqrtPriceX96...
  const [sqrtPriceX96] = await _pool.slot0()

  // Get decimalDifference if there is a difference...
  const decimalDifference = Number(Big(_token0.decimals - _token1.decimals).abs())
  const conversion = Big(10).pow(decimalDifference)

  // Calculate rate and price...
  const rate = Big((Big(sqrtPriceX96).div(Big(2 ** 96))) ** Big(2))
  const price = Big(rate).div(Big(conversion)).toString()

  if (price == 0) {
    return Big(rate).mul(Big(conversion)).toString()
  } else {
    return price
  }
}

async function calculateDifference(_uPrice, _sPrice) {
  return (((_uPrice - _sPrice) / _sPrice) * 100).toFixed(2)
}

module.exports = {
  getTokenAndContract,
  getPoolAddress,
  getPoolContract,
  getPoolLiquidity,
  calculatePrice,
  calculateDifference,
}