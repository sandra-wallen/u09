import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, batch } from 'react-redux'
import userSlice from "../reducers/user.reducer";
import type { rootState } from '../App';
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userState = useSelector((store: rootState) => store.userSlice)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    if (userState._id !== '') {
      navigate('/profile');
    }
  })

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      console.log(email, password)

      fetch('http://localhost:8000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      })
        .then(res => res.json())
        .then((data) => {
          dispatch(userSlice.actions.setId(data.user._id));
          dispatch(userSlice.actions.setEmail(data.user.email));
          dispatch(userSlice.actions.setName(data.user.name));

          localStorage.setItem('user', JSON.stringify({
            _id: data.user._id,
            email: data.user.email,
            name: data.user.name
          }))
        })
        .then((data) => {
          setTimeout(() => console.log(userState), 5000)
        })
    } catch (error) {
      console.log(error)
    }
  } 

  return (
    <div className="container-sm w-50 p-3 bg-light text-dark">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email address</label>
          <input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" value={email} onChange={handleEmailChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input type="password" className="form-control" id="passwordInput" value={password} onChange={handlePasswordChange} />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Login;