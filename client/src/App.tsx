/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
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

import "./App.css";

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

interface catMarketMaxProfitItem {
  maximumProfit: number;
  dayOfPurchase: number;
  dayOfSale: number;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const [currentMarket, setCurrentMarket] = useState<string | undefined>();

  const catMarketList = useSelector(selectCatMatketsList);
  const catMarketPrices: catMarketPricesItems[] = useSelector(
    selectCatMatketPrices
  );

  const catMarketPricesGroupedArray =
    catMarketPrices && groupBy(catMarketPrices, "breed");

  const resultMessage = catMarketPricesGroupedArray?.map(
    ({
      breed,
      purchasePrices,
      salesPrices,
    }: catMarketPricesGroupedArrayItem) => {
      const { maximumProfit, dayOfPurchase, dayOfSale } = maxProfit(
        purchasePrices,
        salesPrices
      ) as catMarketMaxProfitItem;

      return maximumProfit > 0 ? (
        <div style={{ marginLeft: "20px" }}>
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
      ) : (
        <div style={{ marginLeft: "20px" }}>
          <br />
          Breed: {breed}
          <br />
          There is no way to make a profit
          <div style={{ height: "20px" }} />
        </div>
      );
    }
  );

  useEffect(() => {
    if (catMarketList) {
      setCurrentMarket(catMarketList[0]);
    }
  }, [dispatch, JSON.stringify(catMarketList)]);

  useEffect(() => {
    dispatch(getCatMatkets());
  }, [dispatch]);

  useEffect(() => {
    if (currentMarket) {
      dispatch(getCatMatketPrices(currentMarket));
    }
  }, [dispatch, currentMarket]);

  return (
    <>
      <Tabs
        onChange={(key) => {
          setCurrentMarket(key);
        }}
        centered
        items={catMarketList?.map((i: string, id: number) => {
          return {
            label: i,
            key: i,
            children: (
              <MarketMember key={id} catMarketPrices={catMarketPrices} />
            ),
          };
        })}
      />
      {resultMessage}
    </>
  );
}

export default App;
