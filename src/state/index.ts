import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import reducer from "./reducer";
import storage from "redux-persist/lib/storage";
import { updateVersion } from "./global/actions";
import { useMemo } from "react";

let store;

const PERSISTED_KEYS: string[] = ["user", "transactions", "lists"];

const persistConfig = {
  key: "root2",
  whitelist: PERSISTED_KEYS,
  storage,
  version: 2,
  // stateReconciler: false,
};

const persistedReducer = persistReducer(persistConfig, reducer);

function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === "development",
    preloadedState,
  });
}

export const getOrCreateStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;

  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

store = getOrCreateStore();

// export function useStore(preloadedState) {
//   const store = useMemo(() => getOrCreateStore(preloadedState), [preloadedState])
//   return store
// }

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;

export const persistor = persistStore(store);
// {"transactions":"{}","user":"{\"userDarkMode\":true,\"matchesDarkMode\":false,\"timestamp\":1687594542377}","lists":"{\"lastInitializedDefaultListOfLists\":[\"https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json\",\"tokenlist.aave.eth\",\"defi.cmc.eth\",\"stablecoin.cmc.eth\",\"https://umaproject.org/uma.tokenlist.json\",\"https://yearn.science/static/tokenlist.json\",\"synths.snx.eth\",\"wrapped.tokensoft.eth\",\"https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json\",\"https://app.tryroll.com/tokens.json\",\"https://tokens.coingecko.com/uniswap/all.json\",\"t2crtokens.eth\",\"https://raw.githubusercontent.com/opynfinance/opyn-tokenlist/master/opyn-v1.tokenlist.json\",\"https://nftx.ethereumdb.com/v2/tokenlist/\",\"https://static.optimism.io/optimism.tokenlist.json\",\"https://www.gemini.com/uniswap/manifest.json\",\"https://list.dhedge.eth.link/\",\"https://app.array.io/tokenlists/default.json\",\"https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json\"],\"byUrl\":{\"https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"tokenlist.aave.eth\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"defi.cmc.eth\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"stablecoin.cmc.eth\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://umaproject.org/uma.tokenlist.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://yearn.science/static/tokenlist.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"synths.snx.eth\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"wrapped.tokensoft.eth\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://app.tryroll.com/tokens.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://tokens.coingecko.com/uniswap/all.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"t2crtokens.eth\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://raw.githubusercontent.com/opynfinance/opyn-tokenlist/master/opyn-v1.tokenlist.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://nftx.ethereumdb.com/v2/tokenlist/\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://static.optimism.io/optimism.tokenlist.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://www.gemini.com/uniswap/manifest.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://list.dhedge.eth.link/\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://app.array.io/tokenlists/default.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null},\"https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json\":{\"error\":null,\"current\":null,\"loadingRequestId\":null,\"pendingUpdate\":null}},\"activeListUrls\":[\"https://nftx.ethereumdb.com/v2/tokenlist/\",\"https://yearn.science/static/tokenlist.json\",\"https://www.gemini.com/uniswap/manifest.json\",\"https://app.array.io/tokenlists/default.json\"]}","_persist":"{\"version\":-1,\"rehydrated\":true}"}
