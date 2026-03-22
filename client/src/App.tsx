/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import { AppDispatch } from "./app/store";
import {
  getCatMatkets,
  getCatMatketPrices,
  selectCatMatketsList,
  selectCatMatketPrices,
} from "./app/slices/catMarketSlice";
import MarketMember from "./components/MarketMember";
import { groupBy, maxProfit } from "./utils/functions";
import "destyle.css";

export interface catMarketPricesItem {
  breed: string;
  buy: number;
  sell: number;
}

export interface catMarketPricesItems extends Array<catMarketPricesItem> {}

interface catMarketPricesGroupedArrayItem {
  breed: string;
  purchasePrices: number[];
  salesPrices: number[];
}

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const [currentMarket, setCurrentMarket] = useState<string | undefined>();

  const catMarketList = useSelector(selectCatMatketsList);
  const catMarketPrices: catMarketPricesItems[] = useSelector(
    selectCatMatketPrices
  );

  // Группировка данных (мемоизированная)
  const groupedData = useMemo(() => {
    if (!catMarketPrices?.length) return [];
    return groupBy(catMarketPrices, "breed");
  }, [catMarketPrices]);

  // Формирование результата (мемоизированное с проверкой на null)
  const resultMessage = useMemo(() => {
    if (!groupedData.length) return null;

    return groupedData.map(
      ({ breed, purchasePrices, salesPrices }: catMarketPricesGroupedArrayItem) => {
        const profitResult = maxProfit(purchasePrices, salesPrices);

        // Если нет прибыльной сделки
        if (!profitResult) {
          return (
            <div style={{ marginLeft: "20px" }} key={breed}>
              <br />
              Breed: {breed}
              <br />
              There is no way to make a profit
              <div style={{ height: "20px" }} />
            </div>
          );
        }

        // Если есть прибыль
        const { maximumProfit, dayOfPurchase, dayOfSale } = profitResult;

        return (
          <div style={{ marginLeft: "20px" }} key={breed}>
            <br />
            Breed: {breed}
            <br />
            The highest possible profit for breed - {breed} is {maximumProfit}
            <br />
            To get it you need to buy it in {dayOfPurchase} day and sell it in{" "}
            {dayOfSale} day
            <br />
            <div style={{ height: "30px" }} />
          </div>
        );
      }
    );
  }, [groupedData]);

  // Обработчик смены таба
  const handleTabChange = useCallback((key: string) => {
    setCurrentMarket(key);
  }, []);

  // Элементы табов (мемоизированные)
  const tabItems = useMemo(() => {
    if (!catMarketList?.length) return [];

    return catMarketList.map((marketName: string, id: number) => ({
      label: marketName,
      key: marketName,
      children: (
        <MarketMember key={id} catMarketPrices={catMarketPrices} />
      ),
    }));
  }, [catMarketList, catMarketPrices]);

  // Загрузка списка рынков при монтировании
  useEffect(() => {
    dispatch(getCatMatkets());
  }, [dispatch]);

  // Установка текущего рынка при загрузке списка
  useEffect(() => {
    if (catMarketList?.length && !currentMarket) {
      setCurrentMarket(catMarketList[0]);
    }
  }, [catMarketList, currentMarket]);

  // Загрузка цен при смене рынка
  useEffect(() => {
    if (currentMarket) {
      dispatch(getCatMatketPrices(currentMarket));
    }
  }, [dispatch, currentMarket]);

  return (
    <>
      <Tabs
        onChange={handleTabChange}
        centered
        items={tabItems}
      />
      {resultMessage}
    </>
  );
}

export default App;