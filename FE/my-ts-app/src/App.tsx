import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';

import './App.css';

import Header from './components/header.component';
import LandingPage from './pages/landing.page';
import userSlice from './reducers/user.reducer';
import Profile from './pages/profile.page';

const reducer = combineReducers({
  userSlice: userSlice.reducer,
})

export type rootState = ReturnType<typeof reducer>

const store = configureStore({ reducer })

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Provider store={store}>
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Provider>
        </BrowserRouter>
    </div>
  );
}

export default App;