import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, Plus, Edit2, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import ActivityChart from '../components/ActivityChart';
import { fetchActivities, createActivity, updateActivity, deleteActivity } from '../services/api';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activityName: '',
    category: 'Exercise',
    duration: 30,
    description: ''
  });

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await fetchActivities();
      setActivities(res || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch activity records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      activityName: '',
      category: 'Exercise',
      duration: 30,
      description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      date: item.date || new Date().toISOString().split('T')[0],
      activityName: item.activityName || '',
      category: item.category || 'Exercise',
      duration: item.duration || 30,
      description: item.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingId) {
        await updateActivity(editingId, formData);
        showNotification('Activity record updated!');
      } else {
        await createActivity(formData);
        showNotification('New activity logged!');
      }
      setShowModal(false);
      loadActivities();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving activity.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity entry?')) {
      try {
        await deleteActivity(id);
        showNotification('Activity deleted.');
        loadActivities();
      } catch (err) {
        setErrorMsg('Failed to delete activity.');
      }
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Exercise': return 'badge-happy';
      case 'Meditation': return 'badge-vhappy';
      case 'Walking': return 'badge-good';
      case 'Reading': return 'badge-neutral';
      case 'Yoga': return 'badge-vhappy';
      case 'Hobby': return 'badge-good';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="activities-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Activity Tracker</h1>
          <p className="page-subtitle">Log physical exercise, meditation routines, reading, and wellness habits.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Activity
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

      {/* Category Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title"><ActivityIcon size={18} className="text-teal" /> Activity Duration by Category (Minutes)</h3>
        </div>
        <ActivityChart data={activities} />
      </div>

      {/* Activities Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Activity Logs ({activities.length})</h3>
        </div>
        {loading ? (
          <p className="p-3 text-muted">Loading activities...</p>
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <ActivityIcon className="empty-icon" />
            <p>No activity logs recorded yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity Name</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.date}</strong></td>
                    <td>{item.activityName}</td>
                    <td>
                      <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td><Clock size={13} /> {item.duration} mins</td>
                    <td className="note-col">{item.description || '—'}</td>
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
            <h2>{editingId ? 'Edit Activity' : 'Record Activity'}</h2>
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

              <div className="form-group">
                <label className="form-label">Activity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Jog, Guided Meditation, Novel Reading"
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Exercise">Exercise 🏃</option>
                    <option value="Meditation">Meditation 🧘</option>
                    <option value="Walking">Walking 🚶</option>
                    <option value="Reading">Reading 📖</option>
                    <option value="Yoga">Yoga 🧘‍♀️</option>
                    <option value="Hobby">Hobby 🎸</option>
                    <option value="Other">Other 🌟</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Notes</label>
                <textarea
                  rows="3"
                  placeholder="Details about the activity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
