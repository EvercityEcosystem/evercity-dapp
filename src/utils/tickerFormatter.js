import { BOND_TICKER_LIMIT } from "../utils/env";

const formatTicker = ticker => {
  const postfixLength = BOND_TICKER_LIMIT - ticker.length;
  const postfix = postfixLength !== 0 ? `\u0000`.repeat(postfixLength) : "";

  return `${ticker}${postfix}`;
};

export default formatTicker;
