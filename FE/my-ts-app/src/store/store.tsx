import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "../reducers/user.reducer";
import schedulesSlice from "../reducers/schedule.reducer";

const key: string = "user";

function loadState() {
  try {
    const serializedState = localStorage.getItem(key);

    if (!serializedState) {
      return undefined;
    } else {
      return JSON.parse(serializedState);
    }
  } catch (error) {
    return undefined;
  }
}

async function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {

  }
}

const reducer = combineReducers({
  userSlice: userSlice.reducer,
  schedulesSlice: schedulesSlice.reducer
});

export const store = configureStore({
  reducer: reducer,
  //preloadedState: loadState()
});

// store.subscribe(() => {
//   saveState(store.getState());
// })

export type rootState = ReturnType<typeof reducer>;
