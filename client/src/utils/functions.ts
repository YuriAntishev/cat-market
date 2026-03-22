import { catMarketPricesItems, catMarketPricesItem } from "../App";

/**
 * Группирует элементы по указанному свойству
 */
export const groupBy = (arr: catMarketPricesItems[], property: string) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  const flattened = arr.flatMap((item) => item || []);
  
  if (flattened.length === 0) {
    return [];
  }

  const grouped = flattened.reduce<Record<string, catMarketPricesItem[]>>(
    (acc, cur) => {
      const key = cur[property as keyof catMarketPricesItem] as string;
      if (!key) return acc;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(cur);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([breed, items]) => ({
    breed,
    purchasePrices: items
      .map(({ buy }) => buy)
      .filter((price): price is number => price !== undefined && price !== null),
    salesPrices: items
      .map(({ sell }) => sell)
      .filter((price): price is number => price !== undefined && price !== null),
  }));
};

/**
 * Результат поиска максимальной прибыли
 */
interface MaxProfitResult {
  maximumProfit: number;
  dayOfSale: number;
  dayOfPurchase: number;
}

/**
 * Вычисляет максимальную прибыль при покупке и продаже
 * @returns объект с максимальной прибылью или null, если прибыль невозможна
 */
export const maxProfit = (
  buyArray: number[],
  sellArray: number[]
): MaxProfitResult | null => {
  // Валидация
  if (!buyArray?.length || !sellArray?.length) {
    return null;
  }

  const n = Math.min(buyArray.length, sellArray.length);
  
  if (n < 2) {
    return null;
  }

  let maxProfitValue = 0;
  let minBuyPrice = buyArray[0];
  let minBuyIndex = 0;
  let maxProfitDayOfSale = 0;

  for (let i = 1; i < n; i++) {
    const currentProfit = sellArray[i] - minBuyPrice;
    
    if (currentProfit > maxProfitValue) {
      maxProfitValue = currentProfit;
      maxProfitDayOfSale = i;
    }
    
    if (buyArray[i - 1] < minBuyPrice) {
      minBuyPrice = buyArray[i - 1];
      minBuyIndex = i - 1;
    }
  }

  if (maxProfitValue <= 0) {
    return null;
  }

  return {
    maximumProfit: maxProfitValue,
    dayOfSale: maxProfitDayOfSale + 1,
    dayOfPurchase: minBuyIndex + 1,
  };
};