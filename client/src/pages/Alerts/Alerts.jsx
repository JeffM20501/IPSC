import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Alerts.css';
import {
  AiOutlineExclamationCircle,
  AiOutlineWarning,
  AiOutlineInfoCircle
} from 'react-icons/ai';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { products } = useOutletContext();

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/alerts');
        if (!res.ok) throw new Error('Failed to fetch alerts');

        const data = await res.json();
        const alertsWithNames = data.data.map(alert => {
          const product = products.find(p => p.id === alert.product_id);
          return {
            ...alert,
            product_name: product ? product.name : null,
            type: alert.message.split(':')[0]  // Extract CRITICAL/WARNING/INFO
          };
        });

        setAlerts(alertsWithNames);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchAlerts();
  }, [products]);

  const acknowledgeAlert = async (id) => {
    try {
      const res = await fetch(`/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });

      if (!res.ok) throw new Error('Failed to update alert');

      const updatedAlert = await res.json();
      setAlerts(prev =>
        prev.map(a => (a.id === updatedAlert.data.id ? { ...a, status: 'read' } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAlert = async (id) => {
    try {
      const res = await fetch(`/alerts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete alert');

      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => (a.status === 'read') - (b.status === 'read'));

  const filteredAlerts = sortedAlerts.filter(alert => {
    const matchFilter = filter === 'all' || alert.type.toLowerCase() === filter;
    const matchSearch =
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.product_name && alert.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'CRITICAL': return <AiOutlineExclamationCircle color="#cc0000" size={22} />;
      case 'WARNING': return <AiOutlineWarning color="#ff9900" size={22} />;
      case 'INFO': return <AiOutlineInfoCircle color="#0077cc" size={22} />;
      default: return null;
    }
  };

  if (loading) return <p>Loading alerts...</p>;

  return (
    <div className="alerts-container">
      <h2 className="alerts-header">System Alerts & Notifications</h2>

      <input
        type="text"
        placeholder="Search alerts..."
        className="alerts-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="alert-filters">
        {['all', 'critical', 'warning', 'info'].map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="alerts-grid">
        {filteredAlerts.length === 0 && <p>No alerts found.</p>}
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`alert-card ${alert.type.toLowerCase()} ${alert.status === 'read' ? 'acknowledged fade-out' : ''}`}
          >
            <div className="alert-top">
              <h3>
                <span className="alert-icon">{getIcon(alert.type)}</span>
                {alert.message}
              </h3>
              {alert.product_name && <span className="product-name">({alert.product_name})</span>}
            </div>
            <p className="time">{alert.created_at ? new Date(alert.created_at).toLocaleString() : ''}</p>
            <div className="alert-actions">
              {alert.status !== 'read' && (
                <button onClick={() => acknowledgeAlert(alert.id)}>Acknowledge</button>
              )}
              <button className="delete" onClick={() => deleteAlert(alert.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
