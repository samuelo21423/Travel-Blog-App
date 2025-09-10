import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../TravelLogs.css'; // Import the new CSS!

const TravelLogs = () => {
  const [travelLogs, setTravelLogs] = useState([]);
  const [newTravelLog, setNewTravelLog] = useState({
    id: null,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    postDate: '',
    tags: [],
  });

  const API_URL = 'http://localhost:5000/travel-logs';

  useEffect(() => {
    fetchTravelLogs();
  }, []);

  const fetchTravelLogs = async () => {
    try {
      const response = await axios.get(API_URL);
      const cleanedLogs = response.data.map(log => ({
        ...log,
        startDate: new Date(log.start_date).toISOString(),
        endDate: new Date(log.end_date).toISOString(),
        postDate: new Date(log.post_date).toISOString(),
        tags: Array.isArray(log.tags)
          ? log.tags
          : typeof log.tags === 'string'
          ? JSON.parse(log.tags)
          : [],
      }));
      setTravelLogs(cleanedLogs);
    } catch (error) {
      console.error("Error fetching travel logs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setNewTravelLog({
        ...newTravelLog,
        [name]: value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      });
    } else {
      setNewTravelLog({ ...newTravelLog, [name]: value });
    }
  };

  const addOrEditTravelLog = () => {
    const { title, description, startDate, endDate, postDate } = newTravelLog;
    if (!title || !description || !startDate || !endDate || !postDate) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      post_date: postDate,
      tags: JSON.stringify(newTravelLog.tags),
    };

    if (newTravelLog.id === null) {
      axios.post(API_URL, payload)
        .then(response => {
          setTravelLogs([...travelLogs, { ...newTravelLog, id: response.data.id }]);
          resetForm();
        })
        .catch(error => console.error("Error adding travel log:", error));
    } else {
      axios.put(`${API_URL}/${newTravelLog.id}`, payload)
        .then(() => {
          setTravelLogs(travelLogs.map(log => log.id === newTravelLog.id ? newTravelLog : log));
          resetForm();
        })
        .catch(error => console.error("Error updating travel log:", error));
    }
  };

  const deleteTravelLog = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTravelLogs(travelLogs.filter(log => log.id !== id));
      })
      .catch(error => console.error("Error deleting travel log:", error));
  };

  const editTravelLog = (id) => {
    const logToEdit = travelLogs.find(log => log.id === id);
    setNewTravelLog({
      ...logToEdit,
      startDate: formatDateForInput(logToEdit.startDate),
      endDate: formatDateForInput(logToEdit.endDate),
      postDate: formatDateForInput(logToEdit.postDate),
    });
  };

  const resetForm = () => {
    setNewTravelLog({
      id: null,
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      postDate: '',
      tags: [],
    });
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <div className="travel-logs-container">
      <h2 className="section-title">Travel Logs</h2>

      {/* Table Section */}
      <div className="table-wrapper">
        <table className="travel-logs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
              <th>Post</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {travelLogs.map(log => (
              <tr key={log.id}>
                <td>{log.title}</td>
                <td>{log.description}</td>
                <td>📅 {formatDate(log.startDate)}</td>
                <td>✈️ {formatDate(log.endDate)}</td>
                <td>📝 {formatDate(log.postDate)}</td>
                <td>{Array.isArray(log.tags) ? log.tags.join(', ') : ''}</td>
                <td>
                  <button className="edit-btn" onClick={() => editTravelLog(log.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteTravelLog(log.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Section */}
      <div className="form-wrapper">
        <h3>{newTravelLog.id ? 'Edit Travel Log' : 'Add New Travel Log'}</h3>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newTravelLog.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newTravelLog.description}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="startDate"
            value={newTravelLog.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            value={newTravelLog.endDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="postDate"
            value={newTravelLog.postDate}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={newTravelLog.tags.join(', ')}
            onChange={handleInputChange}
          />
          <button className="submit-btn" onClick={addOrEditTravelLog}>
            {newTravelLog.id ? 'Save Changes' : 'Add Travel Log'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelLogs;
