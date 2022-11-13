import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const localStorageUser: string | null = localStorage.getItem('user');

const initialState = {
  _id: localStorageUser !== null ? JSON.parse(localStorageUser)._id : '',
  email: localStorageUser !== null ? JSON.parse(localStorageUser).email : '',
  name: localStorageUser !== null ? JSON.parse(localStorageUser).name : ''
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
    }
  }
})

export default userSlice;