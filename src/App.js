import React, { useState } from 'react';
import './App.css';

//note: demo data 
const App = () => {
  const [orders, setOrders] = useState([
    { 
      orderId: 'ORD-202', 
      table: '5', 
      items: [
        { name: '1pc Porkchop', checked: false },
        { name: '1pc Rice', checked: false }
      ], 
      status: 'queue', 
      time: '10:30 AM' 
    },
    { 
      orderId: 'ORD-205', 
      table: '2', 
      items: [
        { name: 'Burger', checked: false },
        { name: 'Fries', checked: false }
      ], 
      status: 'queue',
      time: '10:45 AM' 
    }
  ]);

  const statusList = ['queue', 'pending', 'preparing', 'ready', 'serve'];

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

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, targetStatus) => {
    const id = e.dataTransfer.getData("id");
    const draggedOrder = orders.find(o => o.orderId === id);
    if (!draggedOrder) return;

    const currentIndex = statusList.indexOf(draggedOrder.status);
    const targetIndex = statusList.indexOf(targetStatus);

    // Rule: Next status only
    if (targetIndex === currentIndex + 1) {
      // Kung papuntang PREPARING, dapat checked lahat
      if (targetStatus === 'preparing') {
        const allChecked = draggedOrder.items.every(item => item.checked);
        if (!allChecked) return; // Walang alert, silent block lang
      }

      setOrders(prev => prev.map(o => 
        o.orderId === id ? { ...o, status: targetStatus } : o
      ));
    }
  };

  const handleServe = (id) => {
    setOrders(prev => prev.map(o => 
      o.orderId === id ? { ...o, status: 'serve' } : o
    ));
  };

  return (
    <div className="kitchen-wrapper">
      <h1 className="view-title">KITCHEN CONTROL SYSTEM</h1>
      
      <div id="dashboard">
        {/* 1. QUEUE */}
        <div id="queue" className="status" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'queue')}>
          <div className="status-header">QUEUE</div>
          <div className="card-container">
            {orders.filter(o => o.status === 'queue').map(o => (
              <div key={o.orderId} className="order-card ready-to-move" draggable onDragStart={(e) => onDragStart(e, o.orderId)}>
                <strong>#{o.orderId}</strong>
                <p>Table {o.table}</p>
                <small>Drag to Pick</small>
              </div>
            ))}
          </div>
        </div>

        {/* 2. PENDING */}
        <div id="pending" className="status" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'pending')}>
          <div className="status-header">PENDING</div>
          <div className="card-container">
            {orders.filter(o => o.status === 'pending').map(o => {
              const allChecked = o.items.every(item => item.checked);
              return (
                <div 
                  key={o.orderId} 
                  className={`order-card ${allChecked ? 'ready-to-move' : 'is-locked'}`}
                  draggable={allChecked} 
                  onDragStart={(e) => allChecked ? onDragStart(e, o.orderId) : e.preventDefault()}
                >
                  <div className="card-top"><strong>T-{o.table}</strong> <span>{o.time}</span></div>
                  <div className="checklist">
                    {o.items.map((item, idx) => (
                      <label key={idx} className="check-item">
                        <input type="checkbox" checked={item.checked} onChange={() => toggleItemCheck(o.orderId, item.name)} />
                        <span className={item.checked ? 'strikethrough' : ''}>{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. PREPARING */}
        <div id="preparing" className="status" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'preparing')}>
          <div className="status-header">PREPARING</div>
          <div className="card-container">
            {orders.filter(o => o.status === 'preparing').map(o => (
              <div key={o.orderId} className="order-card ready-to-move" draggable onDragStart={(e) => onDragStart(e, o.orderId)}>
                <div className="card-top"><strong>T-{o.table}</strong></div>
                <p className="cooking-text">NOW COOKING...</p>
                <ul className="items-static">
                  {o.items.map((item, i) => <li key={i}>{item.name}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 4. READY */}
        <div id="ready" className="status" onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'ready')}>
          <div className="status-header">READY</div>
          <div className="card-container">
            {orders.filter(o => o.status === 'ready').map(o => (
              <div key={o.orderId} className="order-card ready-card">
                <strong>T-{o.table} READY</strong>
                <button className="serve-btn" onClick={() => handleServe(o.orderId)}>SERVE</button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. NOW SERVING */}
        <div id="serve" className="status">
          <div className="status-header">NOW SERVING</div>
          <div className="card-container">
            {orders.filter(o => o.status === 'serve').map(o => (
              <div key={o.orderId} className="now-serving-container">
                <div className="now-serving-box">
                  <h2 className="order-number-display">#{o.orderId}</h2>
                  <p className="pickup-text">PICKUP AT COUNTER</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;