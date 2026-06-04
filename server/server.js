const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataFile = path.join(__dirname, 'data', 'tasks.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Helper function to read tasks
const readTasks = () => {
  const data = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(data);
};

// Helper function to write tasks
const writeTasks = (tasks) => {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
};

// IMPORTANT: We'll add API routes here in Phase 3

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});