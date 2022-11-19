import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import userSlice from "../reducers/user.reducer";
import { rootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../reusable/useAxios";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { callbackAxios } = useAxios();

  const userState = useSelector((store: rootState) => store.userSlice)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    if (userState._id) {
      navigate('/profile');
    }
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    setState(event.target.value);
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (callbackAxios !== undefined) {
      const res = await callbackAxios('post', 'http://localhost:8000/login', { email, password });

      if (res.success) {
        dispatch(userSlice.actions.setId(res.user._id));
          dispatch(userSlice.actions.setEmail(res.user.email));
          dispatch(userSlice.actions.setName(res.user.name));

          localStorage.setItem('user', JSON.stringify({
            _id: res.user._id,
            email: res.user.email,
            name: res.user.name
          }));
      } else if (res.error) {
        console.log(res.error); // Do something else here
      }
    }
  } 

  return (
    <div className="container-sm w-50 p-3 bg-light text-dark">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email address</label>
          <input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" value={email} onChange={(event) => handleInputChange(event, setEmail)} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input type="password" className="form-control" id="passwordInput" value={password} onChange={(event) => handleInputChange(event, setPassword)} />
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