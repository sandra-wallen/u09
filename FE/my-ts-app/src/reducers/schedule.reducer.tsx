import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const localStorageSchedules: string | null = localStorage.getItem('schedules');

const initialState = {
  schedules: localStorageSchedules !== null ? JSON.parse(localStorageSchedules) : [Object],
}

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setSchedules: (store, action) => {
      store.schedules = action.payload;
    },
    clearState: (store) => {
      store.schedules = [];
    },
    updateSchedules: (store, action) => {
      store.schedules = [...store.schedules, action.payload];
    },
    deleteSchedule: (store, action) => {
      store.schedules = action.payload;
    }
  }
})

export default schedulesSlice;