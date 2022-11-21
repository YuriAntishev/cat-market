import { catMarketPricesItems, catMarketPricesItem } from "../App";

export const groupBy = (arr: catMarketPricesItems[], property: string) => {
  return Object.entries(
    arr
      ?.map((i: catMarketPricesItems) => {
        return i?.map((item: catMarketPricesItem) => {
          return item;
        });
      })
      .flat()
      .reduce((acc: any, cur: any) => {
        acc[cur[property]] = [...(acc[cur[property]] || []), cur];
        return acc;
      }, {})
  ).map(([key, value]: any) => ({
    breed: key,
    purchasePrices: value?.map(({ buy }: { buy: number }) => buy),
    salesPrices: value?.map(({ sell }: { sell: number }) => sell),
  }));
};

const findPairs = (
  arr1: number[],
  arr2: number[],
  n: number,
  m: number,
  x: number
) => {
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++)
      if (
        arr1[i] - arr2[j] === x &&
        arr1.indexOf(arr1[i]) > arr2.indexOf(arr2[j])
      ) {
          return {
            maximumProfit: x,
            dayOfSale: arr1.indexOf(arr1[i]) + 1,
            dayOfPurchase: arr2.indexOf(arr2[j]) + 1,
          };
      }
};

export const maxProfit = (buyArray: number[], sellArray: number[]) => {
  let maxProfit = 0;
  let minA = buyArray[0];
  maxProfit = sellArray[1] - buyArray[0];

  for (let i = 1; i < sellArray.length; i++) {
    minA = Math.min(buyArray[i - 1], minA);
    maxProfit = Math.max(sellArray[i] - minA, maxProfit);
  }

  return findPairs(
    sellArray,
    buyArray,
    sellArray.length,
    buyArray.length,
    maxProfit
  );
};
