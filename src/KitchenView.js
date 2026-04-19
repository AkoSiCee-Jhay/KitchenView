import React, { useState } from 'react';
import './App.css';

const App = () => {
  // INITIAL STATE: Listahan ng orders na may Dine-in/Take-out info
  const [orders, setOrders] = useState([
    { 
      orderId: 'ORD-101', 
      table: '5', 
      items: [
        { name: '1pc Porkchop Meal', checked: false },
        { name: 'Iced Tea', checked: false }
      ], 
      status: 'queue', 
      type: 'Dine-in', 
      time: '02:55 PM' 
    },
    { 
      orderId: 'ORD-102', 
      table: '2', 
      items: [
        { name: 'Cheeseburger', checked: false },
        { name: 'Fries', checked: false }
      ], 
      status: 'queue',
      type: 'Take-out',
      time: '03:10 PM' 
    }
  ]);

  //  Pagkakasunod-sunod ng proseso
  const statusList = ['queue', 'pending', 'preparing', 'ready', 'serve'];

  //  Pinapalitan ang status ng mga pagkain
  const toggleItemCheck = (orderId, itemName) => {
    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        const updatedItems = order.items.map(item => 
          item.name === itemName ? { ...item, checked: !item.checked } : item
        );
        return { ...order, items: updatedItems };
      }
      return order;
    }));
  };

  // DRAG AND DROP HANDLERS
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, targetStatus) => {
    const id = e.dataTransfer.getData("id");
    const order = orders.find(o => o.orderId === id);
    if (!order) return;

    const currentIndex = statusList.indexOf(order.status);
    const targetIndex = statusList.indexOf(targetStatus);

    // RULE: Next status only. Bawal lumaktaw ng column.
    if (targetIndex === currentIndex + 1) {
      // RULE: Bawal mapunta sa Preparing kung hindi pa checked lahat sa Pending
      if (targetStatus === 'preparing' && !order.items.every(item => item.checked)) return;
      
      setOrders(prev => prev.map(o => 
        o.orderId === id ? { ...o, status: targetStatus } : o
      ));
    }
  };

  // SERVE BUTTON
  const handleServe = (id) => {
    setOrders(prev => prev.map(o => o.orderId === id ? { ...o, status: 'serve' } : o));
  };

  return (
    <div className="kitchen-wrapper">
      <header className="view-title">
        <h1>FAMILYFOOD - KITCHEN CONTROL SYSTEM</h1>
      </header>
      
      <div id="dashboard">
        {statusList.map((status) => (
          <div 
            key={status} 
            id={status} 
            className="status-column" 
            onDragOver={onDragOver} 
            onDrop={(e) => onDrop(e, status)}
          >
            <div className="status-header">{status.toUpperCase()}</div>
            <div className="card-container">
              {orders.filter(o => o.status === status).map(o => {
                // UI LOGIC: Sine-set kung "locked" ang card base sa checklist
                const allChecked = o.items.every(item => item.checked);
                const isLocked = status === 'pending' && !allChecked;

                return (
                  <div 
                    key={o.orderId} 
                    className={`order-card ${isLocked ? 'is-locked' : 'is-ready'}`}
                    draggable={!isLocked && status !== 'serve'}
                    onDragStart={(e) => onDragStart(e, o.orderId)}
                  >
                    <div className="card-top">
                      <span className={`type-tag ${o.type.toLowerCase().replace(' ', '-')}`}>
                        {o.type.toUpperCase()}
                      </span>
                      <strong>T-{o.table}</strong>
                    </div>

                    
                    {status === 'pending' ? (
                      <div className="checklist">
                        {o.items.map((item, idx) => (
                          <label key={idx} className="check-item">
                            <input 
                              type="checkbox" 
                              checked={item.checked} 
                              onChange={() => toggleItemCheck(o.orderId, item.name)} 
                            />
                            <span className={item.checked ? 'strikethrough' : ''}>{item.name}</span>
                          </label>
                        ))}
                      </div>
                    ) : status === 'serve' ? (
                        <div className="now-serving-box">
                          <h2 className="order-number-display">#{o.orderId}</h2>
                          <p className="pickup-text">PICKUP AT COUNTER</p>
                        </div>
                    ) : (
                      <ul className="items-static">
                        {o.items.map((item, i) => (
                          <li key={i} className={item.checked ? 'item-done' : ''}>{item.name}</li>
                        ))}
                      </ul>
                    )}

                    {status === 'ready' && (
                      <button className="serve-btn" onClick={() => handleServe(o.orderId)}>
                        SERVE ORDER
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
