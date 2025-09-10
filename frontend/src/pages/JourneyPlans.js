import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../TravelLogs.css'; // Import the new CSS!

const JourneyPlans = () => {
  const [journeys, setJourneys] = useState([]);
  const [newJourney, setNewJourney] = useState({
    id: null,
    name: '',
    locations: '',
    start_date: '',
    end_date: '',
    activities: '',
    description: ''
  });

  const API_URL = 'http://localhost:5000/journey-plans';

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const cleanedJourneys = data.map(journey => ({
      ...journey,
      locations: Array.isArray(journey.locations)
        ? journey.locations
        : typeof journey.locations === "string"
        ? (() => {
            try {
              return JSON.parse(journey.locations);
            } catch {
              // fallback: split by commas if not valid JSON
              return journey.locations.split(",").map(l => l.trim());
            }
          })()
        : [],
      activities: Array.isArray(journey.activities)
        ? journey.activities
        : typeof journey.activities === "string"
        ? (() => {
            try {
              return JSON.parse(journey.activities);
            } catch {
              return journey.activities.split(",").map(a => a.trim());
            }
          })()
        : [],
    }));

    setJourneys(cleanedJourneys);
  } catch (error) {
    console.error("Error fetching journey plans:", error);
  }
};


  const handleInputChange = (e) => {
    setNewJourney({ ...newJourney, [e.target.name]: e.target.value });
  };

  const addOrEditJourney = async () => {
    const { id, name, locations, start_date, end_date, activities, description } = newJourney;

    if (!name || !locations || !start_date || !end_date || !activities || !description) {
      alert('Please fill all fields.');
      return;
    }

    const payload = {
      name,
      locations: JSON.stringify(locations.split(',').map(l => l.trim())),
      start_date,
      end_date,
      activities: JSON.stringify(activities.split(',').map(a => a.trim())),
      description
    };

    try {
      if (id === null) {
        await axios.post(API_URL, payload);
      } else {
        await axios.put(`${API_URL}/${id}`, payload);
      }

      fetchJourneys();
      setNewJourney({
        id: null,
        name: '',
        locations: '',
        start_date: '',
        end_date: '',
        activities: '',
        description: ''
      });
    } catch (err) {
      console.error('Error saving journey plan:', err);
    }
  };

  const editJourney = (journey) => {
    // Convert dates to yyyy-mm-dd format for the date input fields
    const formatDateForInput = (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };
  
    // Ensure locations and activities are arrays before calling join
    const locations = Array.isArray(journey.locations) ? journey.locations : [];
    const activities = Array.isArray(journey.activities) ? journey.activities : [];
  
    setNewJourney({
      id: journey.id,
      name: journey.name,
      locations: locations.join(', '),
      start_date: formatDateForInput(journey.start_date),
      end_date: formatDateForInput(journey.end_date),
      activities: activities.join(', '),
      description: journey.description
    });
  };
  
  

  const deleteJourney = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchJourneys();
    } catch (err) {
      console.error('Error deleting journey:', err);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);  // Formats to '21 Apr 2025'
  };

  return (
    <div className="journey-plans-container">
      <h2 className="section-title">Journey Plans</h2>
  
      {/* Table Section */}
      <div className="table-wrapper">
        <table className="journey-plans-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Locations</th>
              <th>Start</th>
              <th>End</th>
              <th>Activities</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {journeys.map(journey => (
              <tr key={journey.id}>
                <td>{journey.name}</td>
                <td>{journey.locations.join(', ')}</td>
                <td>📅 {formatDate(journey.start_date)}</td>
                <td>✈️ {formatDate(journey.end_date)}</td>
                <td>{journey.activities.join(', ')}</td>
                <td>{journey.description}</td>
                <td>
                  <button className="edit-btn" onClick={() => editJourney(journey)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteJourney(journey.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Form Section */}
      <div className="form-wrapper">
        <h3>{newJourney.id ? 'Edit Journey' : 'Add New Journey'}</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Journey Name"
            value={newJourney.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="locations"
            placeholder="Locations (comma separated)"
            value={newJourney.locations}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="start_date"
            value={newJourney.start_date}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="end_date"
            value={newJourney.end_date}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="activities"
            placeholder="Activities (comma separated)"
            value={newJourney.activities}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newJourney.description}
            onChange={handleInputChange}
          />
          <button className="submit-btn" onClick={addOrEditJourney}>
            {newJourney.id ? 'Save Changes' : 'Add Journey'}
          </button>
        </div>
      </div>
    </div>
  );
  };
  
  export default JourneyPlans;
  