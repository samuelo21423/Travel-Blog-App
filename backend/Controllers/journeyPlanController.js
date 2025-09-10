import pool from "../server.js";

// Create a journey plan
export const createJourneyPlan = async (req, res) => {
  const { name, locations, start_date, end_date, activities, description } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO travel_journey_plans (name, locations, start_date, end_date, activities, description) VALUES (?, ?, ?, ?, ?, ?)",
      [
        name,
        JSON.stringify(locations),
        start_date,
        end_date,
        JSON.stringify(activities),
        description
      ]
    );
    res.status(201).json({ message: "Journey plan created!", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating journey plan" });
  }
};

// Get all journey plans
export const getJourneyPlans = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM travel_journey_plans");

    rows.forEach(row => {
      try {
        row.locations = JSON.parse(row.locations);
        row.activities = JSON.parse(row.activities);
      } catch (e) {
        row.locations = [];
        row.activities = [];
      }
    });

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching journey plans" });
  }
};

// Update a journey plan
export const updateJourneyPlan = async (req, res) => {
  const { id } = req.params;
  const { name, locations, start_date, end_date, activities, description } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE travel_journey_plans SET name = ?, locations = ?, start_date = ?, end_date = ?, activities = ?, description = ? WHERE id = ?",
      [
        name,
        JSON.stringify(locations),
        start_date,
        end_date,
        JSON.stringify(activities),
        description,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Journey plan not found" });
    }

    res.json({ message: "Journey plan updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating journey plan" });
  }
};

// Delete a journey plan
export const deleteJourneyPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM travel_journey_plans WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Journey plan not found" });
    }

    res.json({ message: "Journey plan deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting journey plan" });
  }
};
