import pool from "../server.js";

// Create a travel log
export const createTravelLog = async (req, res) => {
  const { title, description, start_date, end_date, post_date, tags } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO travel_travel_logs (title, description, start_date, end_date, post_date, tags) VALUES (?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        start_date,
        end_date,
        post_date,
        JSON.stringify(tags)
      ]
    );
    res.status(201).json({ message: "Travel log created!", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating travel log" });
  }
};

// Get all travel logs
export const getTravelLogs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM travel_travel_logs");

    rows.forEach(row => {
      try {
        row.tags = JSON.parse(row.tags);
      } catch (e) {
        row.tags = [];
      }
    });

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching travel logs" });
  }
};

// Update a travel log
export const updateTravelLog = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, post_date, tags } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE travel_travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ? WHERE id = ?",
      [
        title,
        description,
        start_date,
        end_date,
        post_date,
        JSON.stringify(tags),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Travel log not found" });
    }

    res.json({ message: "Travel log updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating travel log" });
  }
};

// Delete a travel log
export const deleteTravelLog = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM travel_travel_logs WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Travel log not found" });
    }

    res.json({ message: "Travel log deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting travel log" });
  }
};
