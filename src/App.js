import React, { useState } from 'react';
import KitchenView from './KitchenView'; //  Siguraduhing tama ang filename at path
import './App.css';

const App = () => {
  // INITIAL STATE: Listahan ng orders na may Dine-in/Take-out info
  const [orders, setOrders] = useState([
    { 
      orderId: 'ORD-101', 
      table: '99', 
      items: [
        { name: '1pc Porkchop Meal', checked: false },
        { name: 'Coke Zero', checked: false }
      ], 
      status: 'queue', 
      type: 'Dine-in', 
      time: '02:55 PM' 
    },
    { 
      orderId: 'ORD-102', 
      table: '', 
      items: [
        { name: 'Cheeseburger', checked: false },
        { name: 'Fries', checked: false }
      ], 
      status: 'queue',
      type: 'Take-out',
      time: '03:10 PM' 
    },
    { 
      orderId: 'ORD-103', 
      table: ' ', 
      items: [
        { name: 'Cheeseburger', checked: false },
        { name: 'Fries', checked: false },
        { name: 'Iced Tea', checked: false }
      ], 
      status: 'queue',
      type: 'Take-out',
      time: '06:10 PM' 
    },
    { 
      orderId: 'ORD-104', 
      table: '', 
      items: [
        { name: 'ChikenBurger', checked: false },
        { name: 'Sunday', checked: false },
        { name: 'Iced Coffee', checked: false }
      ], 
      status: 'queue',
      type: 'Take-out',
      time: '06:10 PM' 
    }
  ]);

  const updateStatus = (id, nextStatus) => {
     // [ADDED COMMENT] Logic para sa paglipat ng status
     setOrders(prev => prev.map(o => o.orderId === id ? { ...o, status: nextStatus } : o));
  };

  return (
    <div className="kitchen-wrapper">
      <header className="view-title">
        <h1>FAMILYFOOD - KITCHEN CONTROL SYSTEM</h1>
      </header>

      {/*  Dito natin ilalagay ang KitchenView component */}
      {/* Ipinapasa ang kailangang 'props' para gumana ang file */}
      <KitchenView 
        orders={orders} 
        setOrders={setOrders} 
        onUpdateStatus={updateStatus} 
      />
    </div>
  );
};

export default App;
