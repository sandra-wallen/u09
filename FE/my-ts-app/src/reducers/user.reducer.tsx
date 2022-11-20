import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  email: '',
  name: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setId: (store, action: PayloadAction<string>) => {
      store._id = action.payload;
    },
    setEmail: (store, action: PayloadAction<string>) => {
      store.email = action.payload;
    },
    setName: (store, action: PayloadAction<string>) => {
      store.name = action.payload;
    },
    clearState: (store) => {
      store._id = '';
      store.email = '';
      store.name = '';
    },
  }
})

export default userSlice;