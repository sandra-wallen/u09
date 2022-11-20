import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import schedulesSlice from "../reducers/schedule.reducer";
import userSlice from "../reducers/user.reducer";
import { resetStore, RootState } from "../store/store";

const Navbar: React.FC = () => {

  const dispatch = useDispatch()

  const userState = useSelector((store: RootState) => store.user)

  const handleLogout = () => {
    dispatch(schedulesSlice.actions.clearState());
    dispatch(userSlice.actions.clearState());
    resetStore();
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">App name</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {userState._id ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link" aria-current="page">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/schedule-list" className="nav-link" aria-current="page">My schedules</Link>
                </li>
              </>
            )
            :
              <li className="nav-item">
                <Link to="/" className="nav-link" aria-current="page">Login</Link>
              </li>
            }
            
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          {userState._id && (
            <button className="btn btn-secondary mb-2 mb-lg-0 mx-2" type="button" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;