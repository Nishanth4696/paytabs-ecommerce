import './App.css';
import {createContext} from 'react';
import { API_URL } from './GlobalConstants';
import { useState, useEffect } from "react";
import {Navigate, Route, Routes} from "react-router-dom"



import UserLogin from './component/User/pages/UserLogin';
import UserRegister from './component/User/pages/UserRegister';
import UserResetpassword from './component/User/pages/UserResetpassword';
import UserForgotpassword from './component/User/pages/UserForgotpassword';
import { UserHome } from './component/User/UserHome';

import { UserPhoneList } from './component/User/UserPhoneList';
import { UserCart } from './component/User/UserCart';
import { UserMobileDetails } from './component/User/UserMobileDetails';




export const cartCtx = createContext();

export const currencyFormatter = (number)=> new Intl.NumberFormat('en-IN', {style: "currency", currency:'INR'}).format(number);

const initial_Cart= [];

function App() {
  const [usercart, setUserCart] = useState(initial_Cart); 
  const [admincart, setAdminCart] = useState(initial_Cart); 

  useEffect(()=>{
    fetch(`${API_URL}/cart/user`)
    .then((data) =>data.json())
    .then((latestCart) => setUserCart(latestCart))
  },[])

  useEffect(()=>{
    fetch(`${API_URL}/cart/admin`)
    .then((data) =>data.json())
    .then((latestCart) => setAdminCart(latestCart))
  },[])


  const updateCart = ({mobile, action})=> {

    

    fetch(`${API_URL}/cart/user?type=${action}`, 
      {
        method:'PUT',
        body:JSON.stringify(mobile),
        headers:{"Content-Type": "application/json"},  
      })
      .then((data) =>data.json())
      .then((latestCart) => setUserCart(latestCart))

      fetch(`${API_URL}/cart/admin?type=${action}`, 
      {
        method:'PUT',
        body:JSON.stringify(mobile),
        headers:{"Content-Type": "application/json"},  
      })
      .then((data) =>data.json())
      .then((latestCart) => setAdminCart(latestCart))
    }

    
    const usertotalQty = usercart.map((item) => item.qty).reduce((sum, qty) => sum + qty, 0)
    const admintotalQty = admincart.map((item) => item.qty).reduce((sum, qty) => sum + qty, 0)
  return(
    <div className='App'>
        <cartCtx.Provider value={[usercart,admincart, updateCart, setUserCart,setAdminCart,usertotalQty,admintotalQty ]} >
          
          <Routes>



            <Route path="/" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/forgotpassword" element={<UserForgotpassword/>} />
        <Route
          path="/resetpassword/:userId/:token"
          element={<UserResetpassword/>}
        />

        <Route path="/user"  element={<UserHome />}/>
        <Route path="/user/product"  element={<UserPhoneList />}/>
        <Route path="/user/cart"  element={<UserCart />}/>
        <Route path="/user/phonedetails/:id"  element={<UserMobileDetails />}/>
       
      </Routes>
           
            
        </cartCtx.Provider>
    </div>
  );

  
}







export default App;
