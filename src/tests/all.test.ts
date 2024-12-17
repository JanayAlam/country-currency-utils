import {
  getAllCountryDetails,
  getAllCurrencyDetails,
  getCurrenciesData,
  getCurrencyData,
  getDisplayAmountOnCurrency,
  getFormattedAmount,
  getFormattedAmountOnCurrency,
  getRoundedAmount,
  getRoundedAmountOnCurrency,
} from "..";

/*
  Check all currencies listed under country
  exists in currencies map
*/
test("country to currency match", async () => {
  const allCountriesDetails = await getAllCountryDetails();
  const allCurrenciesDetails = await getAllCurrencyDetails();

  const leftOutCountryCodes: string[] = [];

  Object.keys(allCountriesDetails).forEach((countryCode) => {
    const countryDetails = allCountriesDetails[countryCode];
    if (!allCurrenciesDetails[countryDetails.currencyCode])
      leftOutCountryCodes.push(countryCode);
  });

  expect(leftOutCountryCodes.length).toBe(0);
});

/*
  Rounding amount test
*/
test("Test amount rounding", () => {
  expect(getRoundedAmount(1234, 2)).toBe(1234);
  expect(getRoundedAmount(1234.1, 2)).toBe(1234.1);
  expect(getRoundedAmount(1.125, 2)).toBe(1.13);
  expect(getRoundedAmount(1.123, 2)).toBe(1.13);
  expect(getRoundedAmount(1.126, 2)).toBe(1.13);
  expect(getRoundedAmount(1.126, 1)).toBe(1.2);
  expect(getRoundedAmount(1.126, 0)).toBe(2);

  expect(getRoundedAmount(1.125, 2, true)).toBe(1.13);
  expect(getRoundedAmount(1.123, 2, true)).toBe(1.12);
  expect(getRoundedAmount(1.126, 2, true)).toBe(1.13);
  expect(getRoundedAmount(1.126, 1, true)).toBe(1.1);
  expect(getRoundedAmount(1.15, 1, true)).toBe(1.2);
  expect(getRoundedAmount(1.12, 0, true)).toBe(1);
  expect(getRoundedAmount(1.56, 0, true)).toBe(2);
});

/*
  Rounding amount on currency test
*/
test("Test amount rounding on currency", async () => {
  const USDCurrencyDetails = await getCurrencyData("USD");
  const BDTCurrencyDetails = await getCurrencyData("BDT");

  expect(USDCurrencyDetails).toBeDefined();
  expect(BDTCurrencyDetails).toBeDefined();
  if (!USDCurrencyDetails || !BDTCurrencyDetails) return;

  // USD check
  expect(getRoundedAmountOnCurrency(1234, USDCurrencyDetails)).toBe(1234);
  expect(getRoundedAmountOnCurrency(1.123, USDCurrencyDetails)).toBe(1.13);
  expect(
    getRoundedAmountOnCurrency(1.123, USDCurrencyDetails, {
      isRoundMiddle: true,
    })
  ).toBe(1.12);
  expect(
    getRoundedAmountOnCurrency(1.123, USDCurrencyDetails, {
      isRoundMiddle: true,
      isDecimalsStandard: true,
    })
  ).toBe(1.12);

  // BDT check
  expect(getRoundedAmountOnCurrency(1234, BDTCurrencyDetails)).toBe(1234);
  expect(getRoundedAmountOnCurrency(1.123, BDTCurrencyDetails)).toBe(2);
  expect(
    getRoundedAmountOnCurrency(1.123, BDTCurrencyDetails, {
      isRoundMiddle: true,
    })
  ).toBe(1);
  expect(
    getRoundedAmountOnCurrency(1.123, BDTCurrencyDetails, {
      isRoundMiddle: true,
      isDecimalsStandard: true,
    })
  ).toBe(1.12);
  expect(
    getFormattedAmountOnCurrency(123456.7, BDTCurrencyDetails, {
      avoidRound: true,
    })
  ).toBe("1,23,456.7");
});

/*
  Formatting amount test
*/
test("Test amount formatting", () => {
  expect(getFormattedAmount(1234, 2, 0)).toBe("1,234");
  expect(getFormattedAmount(12345, 2, 0)).toBe("12,345");
  expect(getFormattedAmount(123456, 2, 0)).toBe("1,23,456");
  expect(getFormattedAmount(1234567, 2, 0)).toBe("12,34,567");
  expect(getFormattedAmount(123456789, 2, 0)).toBe("12,34,56,789");
  expect(getFormattedAmount(12345678912, 2, 0)).toBe("12,34,56,78,912");

  expect(getFormattedAmount(1234, 2, 2)).toBe("1,234.00");
  expect(getFormattedAmount(12345.1, 2, 2)).toBe("12,345.10");
  expect(getFormattedAmount(123456.12, 2, 2)).toBe("1,23,456.12");
  expect(getFormattedAmount(123456.1234, 2, 2)).toBe("1,23,456.12");
  expect(getFormattedAmount(123456.1299, 2, 2)).toBe("1,23,456.12");
  expect(getFormattedAmount(123456.1299123, 2, 3)).toBe("1,23,456.129");
  expect(getFormattedAmount(123456.1, 2, 5)).toBe("1,23,456.10000");

  expect(getFormattedAmount(1234, 3, 0)).toBe("1,234");
  expect(getFormattedAmount(12345, 3, 0)).toBe("12,345");
  expect(getFormattedAmount(123456, 3, 0)).toBe("123,456");
  expect(getFormattedAmount(1234567, 3, 0)).toBe("1,234,567");
  expect(getFormattedAmount(123456789, 3, 0)).toBe("123,456,789");
  expect(getFormattedAmount(12345678912, 3, 0)).toBe("12,345,678,912");

  expect(getFormattedAmount(1234, 3, 2)).toBe("1,234.00");
  expect(getFormattedAmount(12345.1, 3, 2)).toBe("12,345.10");
  expect(getFormattedAmount(123456.12, 3, 2)).toBe("123,456.12");
});

/*
  Formatting amount on currency test
*/
test("Test amount formatting on currency", async () => {
  const [USDCurrencyDetails, BDTCurrencyDetails] = await getCurrenciesData([
    "USD",
    "BDT",
  ]);

  expect(USDCurrencyDetails).toBeDefined();
  expect(BDTCurrencyDetails).toBeDefined();
  if (!USDCurrencyDetails || !BDTCurrencyDetails) return;

  // USD check
  expect(getFormattedAmountOnCurrency(1234, USDCurrencyDetails)).toBe(
    "1,234.00"
  );
  expect(getFormattedAmountOnCurrency(1234567, USDCurrencyDetails)).toBe(
    "1,234,567.00"
  );
  expect(getFormattedAmountOnCurrency(1234567, USDCurrencyDetails)).toBe(
    "1,234,567.00"
  );
  expect(
    getFormattedAmountOnCurrency(1234567, USDCurrencyDetails, {
      avoidFixedDecimals: true,
    })
  ).toBe("1,234,567");

  expect(getFormattedAmountOnCurrency(1.123, USDCurrencyDetails)).toBe("1.13");
  expect(
    getFormattedAmountOnCurrency(1.123, USDCurrencyDetails, {
      isRoundMiddle: true,
    })
  ).toBe("1.12");
  expect(
    getFormattedAmountOnCurrency(1.123, USDCurrencyDetails, {
      isRoundMiddle: true,
      isDecimalsStandard: true,
    })
  ).toBe("1.12");
  expect(
    getFormattedAmountOnCurrency(12345.123, USDCurrencyDetails, {
      isRoundMiddle: true,
      isDecimalsStandard: true,
      avoidFixedDecimals: true,
    })
  ).toBe("12,345.12");
  expect(
    getFormattedAmountOnCurrency(12345, USDCurrencyDetails, {
      isRoundMiddle: true,
      isDecimalsStandard: true,
      avoidFixedDecimals: true,
    })
  ).toBe("12,345");

  // BDT check
  expect(getFormattedAmountOnCurrency(1234, BDTCurrencyDetails)).toBe("1,234");
  expect(getFormattedAmountOnCurrency(1234567, BDTCurrencyDetails)).toBe(
    "12,34,567"
  );
  expect(
    getFormattedAmountOnCurrency(1234567, BDTCurrencyDetails, {
      isDecimalsStandard: true,
    })
  ).toBe("12,34,567.00");
  expect(
    getFormattedAmountOnCurrency(1234567, BDTCurrencyDetails, {
      isDecimalsStandard: true,
      avoidFixedDecimals: true,
    })
  ).toBe("12,34,567");
  expect(
    getFormattedAmountOnCurrency(123.1, BDTCurrencyDetails, {
      isDecimalsStandard: true,
      avoidFixedDecimals: true,
    })
  ).toBe("123.1");
  expect(getFormattedAmountOnCurrency(1.123, BDTCurrencyDetails)).toBe("2");
  expect(
    getFormattedAmountOnCurrency(1.123, BDTCurrencyDetails, {
      isRoundMiddle: true,
    })
  ).toBe("1");
  expect(
    getFormattedAmountOnCurrency(1.123, BDTCurrencyDetails, {
      isRoundMiddle: true,
      isDecimalsStandard: true,
    })
  ).toBe("1.12");
});

/*
  Display amount on currency
*/
test("Test amount display on currency", async () => {
  const USDCurrencyDetails = await getCurrencyData("USD");
  const BDTCurrencyDetails = await getCurrencyData("BDT");

  expect(USDCurrencyDetails).toBeDefined();
  expect(BDTCurrencyDetails).toBeDefined();
  if (!USDCurrencyDetails || !BDTCurrencyDetails) return;

  // USD
  expect(getDisplayAmountOnCurrency(1.123, USDCurrencyDetails)).toBe("$ 1.13");
  expect(getDisplayAmountOnCurrency(1234.12, USDCurrencyDetails)).toBe(
    "$ 1,234.12"
  );
  expect(
    getDisplayAmountOnCurrency(1234.12, USDCurrencyDetails, {
      avoidFormat: true,
    })
  ).toBe("$ 1234.12");
  expect(
    getDisplayAmountOnCurrency(1234.1234, USDCurrencyDetails, {
      avoidFormat: true,
      avoidRound: true,
    })
  ).toBe("$ 1234.1234");
  expect(getDisplayAmountOnCurrency(1234.1, USDCurrencyDetails)).toBe(
    "$ 1,234.10"
  );
  expect(
    getDisplayAmountOnCurrency(1234.1, USDCurrencyDetails, {
      avoidFixedDecimals: true,
    })
  ).toBe("$ 1,234.1");
  expect(
    getDisplayAmountOnCurrency(1234.1, USDCurrencyDetails, {
      avoidFormat: true,
      avoidFixedDecimals: true,
    })
  ).toBe("$ 1234.1");

  // BDT
  expect(getDisplayAmountOnCurrency(1.123, BDTCurrencyDetails)).toBe("Tk 2");
  expect(
    getDisplayAmountOnCurrency(1.123, BDTCurrencyDetails, {
      isDecimalsStandard: true,
    })
  ).toBe("Tk 1.13");
  expect(
    getDisplayAmountOnCurrency(1.123, BDTCurrencyDetails, {
      isSymbolNative: true,
    })
  ).toBe("Tk 2");
  expect(
    getDisplayAmountOnCurrency(1.123, BDTCurrencyDetails, {
      isSymbolStandard: true,
    })
  ).toBe("৳ 2");

  expect(
    getDisplayAmountOnCurrency(1123, BDTCurrencyDetails, {
      isSymbolStandard: true,
    })
  ).toBe("৳ 1,123");
  expect(
    getDisplayAmountOnCurrency(1123, BDTCurrencyDetails, { separator: "" })
  ).toBe("Tk1,123");
  expect(
    getDisplayAmountOnCurrency(1123, BDTCurrencyDetails, {
      separator: "-",
      avoidFormat: true,
    })
  ).toBe("Tk-1123");
});