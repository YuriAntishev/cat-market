import {
  configureStore,
  ThunkAction,
  combineReducers,
  Reducer,
  AnyAction,
  Action,
} from "@reduxjs/toolkit";
import catMarketReducer from "./slices/catMarketSlice";

const combinedReducer = combineReducers({
  catMarket: catMarketReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
