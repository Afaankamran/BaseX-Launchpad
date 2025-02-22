import Big from "big.js"
import { BigNumber } from "ethers"

export function BNtoDecimal(
    value: Big | BigNumber,
    maximumPrecision: number,
    maximumNonZero?: number,
    minimumPrecision?: number
) {
    const fullNumber = (
        value instanceof Big
            ? value
            : Big(value.toString()).div(Big(10).pow(maximumPrecision))
    ).toFixed(maximumPrecision)
    const maxPrecision = maximumNonZero || 6
    const minPrecision = minimumPrecision || 0

    let [integer, decimal] = fullNumber.split('.')
    decimal = decimal || ''
    const precision = Math.max(0, maxPrecision + 1 - integer.length)
    const firstNonZero = decimal.length - decimal.replace(/^0+/, '').length

    integer = integer.replace(/(\d)(?=(\d{3})+\b)/g, '$1\u00a0')
    decimal = decimal
        .substring(0, precision ? firstNonZero + precision : 0)
        .replace(/0+$/, '')
        .padEnd(precision ? minPrecision : 0, '0')

    return `${integer}${decimal.length > 0 ? '.' : ''}${decimal}`
}