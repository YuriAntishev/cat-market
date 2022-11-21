import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";
import axios from "axios";

const initialState: {
  catMarketLoading: boolean;
  catMarketList: any;
  catMarketPrices: any;
} = {
  catMarketLoading: false,
  catMarketList: null,
  catMarketPrices: null,
};

export const catMarketSlice = createSlice({
  name: "catMarket",
  initialState,
  reducers: {
    catMarketRequest: (state) => {
      state.catMarketLoading = true;
    },
    catMarketSuccess: (state, action) => {
      state.catMarketLoading = false;
      state.catMarketList = action.payload;
    },
    catMarketPricesSuccess: (state, action) => {
      state.catMarketLoading = false;
      state.catMarketPrices = action.payload;
    },
    catMarketFailure: (state, action) => {
      state.catMarketLoading = false;
    },
  },
});

export const getCatMatkets = (): AppThunk => async (dispatch) => {
  dispatch(catMarketRequest());
  try {
    const { data } = await axios.get(`http://localhost:7421/cat-markets`);
    dispatch(catMarketSuccess(data));
  } catch (error) {
    return error;
  }
};

export const getCatMatketPrices =
  (marketName: string): AppThunk =>
  async (dispatch) => {
    dispatch(catMarketRequest());
    try {
      const { data } = await axios.get(
        `http://localhost:7421/cat-market/${marketName}`
      );
      dispatch(catMarketPricesSuccess(data));
    } catch (error) {
      return error;
    }
  };

export const { catMarketRequest, catMarketSuccess, catMarketPricesSuccess, catMarketFailure } =
  catMarketSlice.actions;

export const selectCatMatketsList = (state: RootState) =>
  state.catMarket.catMarketList;

export const selectCatMatketPrices = (state: RootState) =>
  state.catMarket.catMarketPrices;

export default catMarketSlice.reducer;
