import React, { useState, useEffect } from 'react';
import { Moon, Plus, Edit2, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import SleepChart from '../components/SleepChart';
import { fetchSleepRecords, createSleepRecord, updateSleepRecord, deleteSleepRecord } from '../services/api';

const SleepTracker = () => {
  const [sleeps, setSleeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sleepTime: '22:30',
    wakeTime: '07:00',
    totalHours: 8.5,
    quality: 'Good'
  });

  const loadSleeps = async () => {
    setLoading(true);
    try {
      const res = await fetchSleepRecords();
      setSleeps(res || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch sleep records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSleeps();
  }, []);

  // Auto calculate total hours when bedtime or wake-up time changes
  const handleTimeChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    if (updated.sleepTime && updated.wakeTime) {
      const [sH, sM] = updated.sleepTime.split(':').map(Number);
      const [wH, wM] = updated.wakeTime.split(':').map(Number);
      let sMinutes = sH * 60 + sM;
      let wMinutes = wH * 60 + wM;
      if (wMinutes <= sMinutes) {
        wMinutes += 24 * 60; // Next morning
      }
      const diffHrs = ((wMinutes - sMinutes) / 60).toFixed(1);
      updated.totalHours = Number(diffHrs);
    }
    setFormData(updated);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      sleepTime: '22:30',
      wakeTime: '07:00',
      totalHours: 8.5,
      quality: 'Good'
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      date: item.date || new Date().toISOString().split('T')[0],
      sleepTime: item.sleepTime || '22:30',
      wakeTime: item.wakeTime || '07:00',
      totalHours: item.totalHours || 8.0,
      quality: item.quality || 'Good'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingId) {
        await updateSleepRecord(editingId, formData);
        showNotification('Sleep record updated!');
      } else {
        await createSleepRecord(formData);
        showNotification('New sleep log added!');
      }
      setShowModal(false);
      loadSleeps();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving sleep log.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sleep record?')) {
      try {
        await deleteSleepRecord(id);
        showNotification('Sleep log deleted.');
        loadSleeps();
      } catch (err) {
        setErrorMsg('Failed to delete sleep record.');
      }
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const getQualityBadgeClass = (q) => {
    switch (q) {
      case 'Excellent': return 'badge-excellent';
      case 'Good': return 'badge-good';
      case 'Average': return 'badge-average';
      case 'Poor': return 'badge-poor';
      default: return 'badge-good';
    }
  };

  return (
    <div className="sleep-tracker-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sleep Tracker</h1>
          <p className="page-subtitle">Monitor bedtime schedules, duration, and sleep quality indicators.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Log Sleep Record
        </button>
      </div>

      {notification && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sleep Trend Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title"><Moon size={18} className="text-blue" /> Sleep Duration Trend (Hours)</h3>
        </div>
        <SleepChart data={sleeps} />
      </div>

      {/* History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Sleep History Log ({sleeps.length})</h3>
        </div>
        {loading ? (
          <p className="p-3 text-muted">Loading sleep logs...</p>
        ) : sleeps.length === 0 ? (
          <div className="empty-state">
            <Moon className="empty-icon" />
            <p>No sleep entries recorded yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bedtime</th>
                  <th>Wake-up Time</th>
                  <th>Total Duration</th>
                  <th>Quality</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sleeps.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.date}</strong></td>
                    <td><Clock size={13} /> {item.sleepTime}</td>
                    <td><Clock size={13} /> {item.wakeTime}</td>
                    <td><strong>{item.totalHours} hrs</strong></td>
                    <td>
                      <span className={`badge ${getQualityBadgeClass(item.quality)}`}>
                        {item.quality}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-outline btn-sm" onClick={() => openEditModal(item)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Sleep Log' : 'Record Sleep'}</h2>
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Bedtime (Sleep Time)</label>
                  <input
                    type="time"
                    required
                    value={formData.sleepTime}
                    onChange={(e) => handleTimeChange('sleepTime', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Wake-up Time</label>
                  <input
                    type="time"
                    required
                    value={formData.wakeTime}
                    onChange={(e) => handleTimeChange('wakeTime', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Calculated Sleep Hours</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.totalHours}
                  onChange={(e) => setFormData({ ...formData, totalHours: Number(e.target.value) })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sleep Quality</label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  className="form-select"
                >
                  <option value="Excellent">Excellent 🌟</option>
                  <option value="Good">Good 😊</option>
                  <option value="Average">Average 😐</option>
                  <option value="Poor">Poor 😫</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepTracker;
