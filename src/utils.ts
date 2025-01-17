import { getCurrencyData, TCurrencyData } from "./currencies";

/* ======== Amount rounding ========= */

export function getRoundedAmount(
  amount: number,
  decimals: number,
  isRoundMiddle = false // Rounds with rounding instead of ceil
) {
  const factor = Math.pow(10, decimals);
  const multipliedAmount = amount * factor;

  return isRoundMiddle
    ? Math.round(multipliedAmount) / factor
    : Math.ceil(multipliedAmount) / factor;
}

export type TCurrencyRoundOptions = {
  isRoundMiddle?: boolean; // Default behavior is Math.ceil, isRoundMiddle rounds with Math.round
  isDecimalsStandard?: boolean; // Default behavior is to use compact decimals, isDecimalsStandard uses standard decimals
};

export function getRoundedAmountOnCurrency(
  amount: number,
  currencyData?: TCurrencyData,
  options?: TCurrencyRoundOptions
): number {
  if (!currencyData) return amount;

  const { decimals, decimalsCompact } = currencyData;
  const { isRoundMiddle, isDecimalsStandard } = options || {};

  const decimalsFinal = isDecimalsStandard ? decimals : decimalsCompact;

  return getRoundedAmount(amount, decimalsFinal, isRoundMiddle);
}

/* ======== Amount formatting ========= */

export function getFormattedAmount(
  amount: number,
  digitGrouping: 2 | 3, // Digit grouping - 2 or 3, for formatting
  fixedDecimals?: number // Adds 0s decimal padding or truncate extra decimal points
) {
  let amountStr = amount.toString();
  let [integerPart, decimalPart] = amountStr.split(".");

  if (digitGrouping === 2) {
    let lastThreeDigits = integerPart.slice(-3);
    let rest = integerPart.slice(0, -3);
    if (rest !== "") {
      rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      integerPart = rest + "," + lastThreeDigits;
    }
  } else {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (fixedDecimals && fixedDecimals > 0) {
    if (decimalPart?.length > fixedDecimals) {
      decimalPart = decimalPart.substring(0, fixedDecimals);
    } else if (!decimalPart || decimalPart.length < fixedDecimals) {
      decimalPart =
        (decimalPart || "") +
        Array(fixedDecimals - (decimalPart?.length || 0) + 1).join("0");
    }
  }

  return decimalPart ? integerPart + "." + decimalPart : integerPart;
}

export type TCurrencyFormatOptions = TCurrencyRoundOptions & {
  avoidRound?: boolean; // avoids rounding amount
  avoidFixedDecimals?: boolean; // default behavior is to have fixed decimals
};

export function getFormattedAmountOnCurrency(
  amount: number,
  currencyData?: TCurrencyData,
  options?: TCurrencyFormatOptions
): string {
  if (!currencyData) return amount.toString();

  const { decimals, decimalsCompact, digitGrouping } = currencyData;
  const { isRoundMiddle, isDecimalsStandard, avoidRound, avoidFixedDecimals } =
    options || {};

  const decimalsFinal = isDecimalsStandard ? decimals : decimalsCompact;

  amount = avoidRound
    ? amount
    : getRoundedAmount(amount, decimalsFinal, isRoundMiddle);

  return getFormattedAmount(
    amount,
    digitGrouping,
    avoidFixedDecimals ? undefined : decimalsFinal
  );
}

/* ======== Amount display ======== */

export type TCurrencyDisplayOptions = TCurrencyFormatOptions & {
  avoidFormat?: boolean; // Default behavior is to format amount
  isSymbolStandard?: boolean; // Default behavior is to use preferred symbol, isSymbolStandard uses standard symbol
  isSymbolNative?: boolean; // Default behavior is to use preferred symbol, isSymbolNative uses native symbol
  separator?: string; // Default separator is space between symbol and amount, can be changed to any string
};

export function getDisplayAmountOnCurrency(
  amount: number,
  currencyData?: TCurrencyData,
  options?: TCurrencyDisplayOptions
): string {
  if (!currencyData) return amount.toString();

  const {
    decimals,
    decimalsCompact,
    digitGrouping,
    symbolPreferred,
    symbolNative,
    symbol,
  } = currencyData;
  const {
    avoidRound,
    isRoundMiddle,
    isDecimalsStandard,
    avoidFormat,
    avoidFixedDecimals,
    isSymbolNative,
    isSymbolStandard,
    separator,
  } = options || {};

  const decimalsFinal = isDecimalsStandard ? decimals : decimalsCompact;

  amount = avoidRound
    ? amount
    : getRoundedAmount(amount, decimalsFinal, isRoundMiddle);

  const formattedAmount = avoidFormat
    ? amount
    : getFormattedAmount(
        amount,
        digitGrouping,
        avoidFixedDecimals ? undefined : decimalsFinal
      );

  return (
    (isSymbolStandard
      ? symbol
      : isSymbolNative
      ? symbolNative
      : symbolPreferred) +
    (separator !== undefined ? separator : " ") +
    formattedAmount
  );
}

export async function getDisplayAmountOnCurrencyCode(
  amount: number,
  currencyCode: string,
  options?: TCurrencyDisplayOptions
): Promise<string> {
  const currencyData = await getCurrencyData(currencyCode);
  return getDisplayAmountOnCurrency(amount, currencyData, options);
}
