import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client'; // Make sure this import is correct
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Added Navigate for redirection
import Login from './components/login/login.jsx';
import Signup from './components/signup/signup.jsx';
import RestaurantLogin from './components/login/restaurantLogin.jsx';
import RestaurantSignup from './components/signup/restaurantSignup.jsx';
import LandingPage from './components/landing/landingPage.jsx';
import UserDashboard from './components/dashboard/userDashboard.jsx';
import RestaurantDashboard from './components/dashboard/restaurantDashboard.jsx';
import MenuManagement from './components/restaurantManage/menuManagement.jsx';
import OrderManagement from './components/restaurantManage/orderManagement.jsx';
import Menu from './components/menu/menu.jsx';
import OrdersWithCategories from './components/dashboard/UserOrders.jsx';
import { PublicMenu } from './components/restaurantManage/qrCode.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/user/dashboard" element={<UserDashboard/>} />
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard/>} />
      <Route path="/restaurant/menu/manage" element={<MenuManagement/>} />
      <Route path="/restaurant/order/manage" element={<OrderManagement/>} />
      <Route path='/auth/user/login' element = {<Login />} />
      <Route path="/auth/user/signup" element={<Signup />} />
      <Route path="/auth/restaurant/signup" element={<RestaurantSignup />} />
      <Route path="/auth/restaurant/login" element={<RestaurantLogin />} />
      <Route path="/user/menu" element={<Menu/>} />
      <Route path="/user/orders" element={<OrdersWithCategories/>} />
      <Route path="/menu/public/:restaurantId" element={<PublicMenu/>} />
        {/* 
        
        <Route path='/api/shorten' element= {<ShortenUrl />} />
        <Route path='/dashboard' element = {<Dashboard /> } />
        <Route path='/update/:shortUrl' element= {<UpdateUrl />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);
