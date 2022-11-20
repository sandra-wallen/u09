import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "../reducers/user.reducer";
import schedulesSlice from "../reducers/schedule.reducer";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  throttle: 1000
}

const rootReducer = combineReducers({
  user: userSlice.reducer,
  schedules: schedulesSlice.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store);

export const resetStore = () => {
  persistor.pause();
  persistor.flush().then(() => {
    return persistor.purge();
  });
}

export type RootState = ReturnType<typeof rootReducer>;

