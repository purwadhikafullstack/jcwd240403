function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getRange(prices) {
  let minValue = Math.min(...prices);
  let maxValue = Math.max(...prices);
  if (minValue == maxValue) {
    return new Intl.NumberFormat().format(minValue);
  } else {
    return `${new Intl.NumberFormat().format(
      minValue
    )} - ${new Intl.NumberFormat().format(maxValue)}`;
  }
}

function getMinimumPrice(prices) {
  let minValue = Math.min(...prices);
  return new Intl.NumberFormat().format(minValue);
}
function getMaximumPrice(prices) {
  let maxValue = Math.max(...prices);
  return new Intl.NumberFormat().format(maxValue);
}

export { classNames, getRange, getMaximumPrice, getMinimumPrice };
