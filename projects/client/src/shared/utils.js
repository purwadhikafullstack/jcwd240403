function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getRange(prices) {
  // console.log(prices);
  let minValue = Math.min(...prices);
  let maxValue = Math.max(...prices);
  if (minValue == maxValue) {
    return new Intl.NumberFormat().format(minValue);
  } else {
    if (minValue && maxValue) {
      return `${new Intl.NumberFormat().format(
        minValue
      )} - ${new Intl.NumberFormat().format(maxValue)}`;
    } else {
      maxValue > minValue
        ? new Intl.NumberFormat().format(maxValue)
        : new Intl.NumberFormat().format(minValue);
    }
  }
}

function getMinimumPrice(prices, useFormat = true) {
  let minValue = Math.min(...prices);
  return useFormat ? new Intl.NumberFormat().format(minValue) : minValue;
}
function getMaximumPrice(prices) {
  let maxValue = Math.max(...prices);
  return new Intl.NumberFormat().format(maxValue);
}

const formatToIDR = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export { classNames, getRange, getMaximumPrice, getMinimumPrice, formatToIDR };
