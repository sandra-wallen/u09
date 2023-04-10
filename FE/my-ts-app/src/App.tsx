import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";

import Header from "./components/header.component";
import LandingPage from "./pages/landing.page";
import Profile from "./pages/profile.page";
import ScheduleList from "./pages/scheduleList.page";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

import EditSchedule from "./components/schedule/editSchedule.component";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Header />
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route
                                    path="/schedule-list"
                                    element={<ScheduleList />}
                                />
                                <Route
                                    path="/edit-schedule/:scheduleId"
                                    element={<EditSchedule />}
                                />
                            </Routes>
                        </LocalizationProvider>
                    </PersistGate>
                </Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;
