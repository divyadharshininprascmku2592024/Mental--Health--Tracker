import React, { useState, useEffect } from 'react';
import { Smile, Plus, Edit2, Trash2, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import MoodChart from '../components/MoodChart';
import { fetchMoods, createMood, updateMood, deleteMood } from '../services/api';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 'Happy',
    moodRating: 8,
    stressLevel: 3,
    anxietyLevel: 2,
    note: ''
  });

  const loadMoods = async () => {
    setLoading(true);
    try {
      const res = await fetchMoods();
      setMoods(res || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch mood records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoods();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mood: 'Happy',
      moodRating: 8,
      stressLevel: 3,
      anxietyLevel: 2,
      note: ''
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      date: item.date || new Date().toISOString().split('T')[0],
      mood: item.mood || 'Happy',
      moodRating: item.moodRating || 5,
      stressLevel: item.stressLevel || 5,
      anxietyLevel: item.anxietyLevel || 5,
      note: item.note || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingId) {
        await updateMood(editingId, formData);
        showNotification('Mood record updated successfully!');
      } else {
        await createMood(formData);
        showNotification('New mood record added successfully!');
      }
      setShowModal(false);
      loadMoods();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving mood record.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mood log?')) {
      try {
        await deleteMood(id);
        showNotification('Mood record deleted.');
        loadMoods();
      } catch (err) {
        setErrorMsg('Failed to delete record.');
      }
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Filtered List
  const filteredMoods = moods.filter((item) => {
    const matchesSearch = item.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.mood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? item.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const getMoodBadgeClass = (m) => {
    switch (m) {
      case 'Very Happy': return 'badge-vhappy';
      case 'Happy': return 'badge-happy';
      case 'Neutral': return 'badge-neutral';
      case 'Sad': return 'badge-sad';
      case 'Very Sad': return 'badge-vsad';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="mood-tracker-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mood Tracker</h1>
          <p className="page-subtitle">Log your daily emotions, stress level, and anxiety indicators.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Record Today's Mood
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

      {/* Mood History Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title"><Smile size={18} className="text-emerald" /> Mood Trend Visualization</h3>
        </div>
        <MoodChart data={moods} />
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar mb-4">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes or mood state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="date-filter-wrapper">
          <Filter size={16} className="filter-icon" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-control"
          />
          {filterDate && (
            <button className="btn btn-outline btn-sm" onClick={() => setFilterDate('')}>Clear</button>
          )}
        </div>
      </div>

      {/* Mood History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Mood Logs History ({filteredMoods.length})</h3>
        </div>
        {loading ? (
          <p className="p-3 text-muted">Loading mood logs...</p>
        ) : filteredMoods.length === 0 ? (
          <div className="empty-state">
            <Smile className="empty-icon" />
            <p>No mood logs recorded matching your filter.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mood State</th>
                  <th>Mood Rating</th>
                  <th>Stress Level</th>
                  <th>Anxiety Level</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMoods.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.date}</strong></td>
                    <td>
                      <span className={`badge ${getMoodBadgeClass(item.mood)}`}>
                        {item.mood}
                      </span>
                    </td>
                    <td>{item.moodRating}/10</td>
                    <td>{item.stressLevel}/10</td>
                    <td>{item.anxietyLevel}/10</td>
                    <td className="note-col">{item.note || '—'}</td>
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
            <h2>{editingId ? 'Edit Mood Log' : 'Record Daily Mood'}</h2>
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
                <label className="form-label">Select Mood</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="form-select"
                >
                  <option value="Very Happy">Very Happy 😊</option>
                  <option value="Happy">Happy 🙂</option>
                  <option value="Neutral">Neutral 😐</option>
                  <option value="Sad">Sad 😔</option>
                  <option value="Very Sad">Very Sad 😢</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mood Rating (1 - 10)</label>
                <div className="range-slider">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.moodRating}
                    onChange={(e) => setFormData({ ...formData, moodRating: Number(e.target.value) })}
                  />
                  <span className="range-value">{formData.moodRating}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Stress Level (1 - 10)</label>
                <div className="range-slider">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stressLevel}
                    onChange={(e) => setFormData({ ...formData, stressLevel: Number(e.target.value) })}
                  />
                  <span className="range-value">{formData.stressLevel}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Anxiety Level (1 - 10)</label>
                <div className="range-slider">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.anxietyLevel}
                    onChange={(e) => setFormData({ ...formData, anxietyLevel: Number(e.target.value) })}
                  />
                  <span className="range-value">{formData.anxietyLevel}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Optional Note</label>
                <textarea
                  rows="3"
                  placeholder="How was your day? Any specific triggers or positive events?"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="form-control"
                />
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

      <style>{`
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .filter-bar {
          display: flex;
          gap: 1rem;
        }
        .search-input-wrapper, .date-filter-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-input-wrapper { flex: 1; }
        .search-icon, .filter-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
        }
        .search-input-wrapper input { padding-left: 2.2rem; }
        .date-filter-wrapper input { padding-left: 2.2rem; }
        .note-col { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .action-btns { display: flex; gap: 0.4rem; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
        .mt-3 { margin-top: 1rem; }

        @media (max-width: 768px) {
          .filter-bar { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default MoodTracker;
