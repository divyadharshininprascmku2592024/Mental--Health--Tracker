import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, Calendar, Smile, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchJournals, createJournal, updateJournal, deleteJournal } from '../services/api';

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    mood: 'Happy'
  });

  const loadJournals = async () => {
    setLoading(true);
    try {
      const res = await fetchJournals();
      setJournals(res || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch journal entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      content: '',
      mood: 'Happy'
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      date: item.date || new Date().toISOString().split('T')[0],
      title: item.title || '',
      content: item.content || '',
      mood: item.mood || 'Happy'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingId) {
        await updateJournal(editingId, formData);
        showNotification('Journal entry updated!');
      } else {
        await createJournal(formData);
        showNotification('New journal entry created!');
      }
      setShowModal(false);
      loadJournals();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving journal entry.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this journal entry permanently?')) {
      try {
        await deleteJournal(id);
        showNotification('Journal entry deleted.');
        loadJournals();
      } catch (err) {
        setErrorMsg('Failed to delete entry.');
      }
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const filteredJournals = journals.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? j.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="journal-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Reflection Journal</h1>
          <p className="page-subtitle">Express thoughts, manage emotions, and record your personal reflections.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> New Journal Entry
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

      {/* Filter and Search Bar */}
      <div className="filter-bar mb-4">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search journal title or contents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="date-filter-wrapper">
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

      {/* Journal Cards List */}
      {loading ? (
        <p className="text-muted">Loading journal entries...</p>
      ) : filteredJournals.length === 0 ? (
        <div className="card empty-state">
          <BookOpen className="empty-icon" />
          <h3>No Journal Entries Found</h3>
          <p>Your journal is currently empty. Start by logging your thoughts for today!</p>
          <button className="btn btn-primary btn-sm mt-3" onClick={openAddModal}>
            <Plus size={14} /> Create First Entry
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredJournals.map((item) => (
            <div key={item._id} className="card journal-card">
              <div className="journal-card-header">
                <div className="journal-meta">
                  <span className="journal-date"><Calendar size={14} /> {item.date}</span>
                  <span className="badge badge-happy"><Smile size={12} /> {item.mood}</span>
                </div>
                <div className="action-btns">
                  <button className="btn btn-outline btn-sm" onClick={() => openEditModal(item)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="journal-card-title">{item.title}</h3>
              <p className="journal-card-content">{item.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Journal Entry' : 'Create Journal Entry'}</h2>
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
                <label className="form-label">Journal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starting a New Sprint, Evening Walk Reflection"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Associated Mood</label>
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
                <label className="form-label">Journal Content</label>
                <textarea
                  rows="6"
                  required
                  placeholder="Write your thoughts, feelings, and reflections here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .journal-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
        }
        .journal-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .journal-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .journal-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .journal-card-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #fff;
        }
        .journal-card-content {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.6;
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
};

export default Journal;
