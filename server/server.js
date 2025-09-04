const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = 'your-secret-key'; // Change in production

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mutualfundportal');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Simple auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Proposal model (basic)
const proposalSchema = new mongoose.Schema({
  title: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});
const Proposal = mongoose.model('Proposal', proposalSchema);

// Protected stats endpoint
app.get('/stats', authenticateToken, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const proposalsCount = await Proposal.countDocuments();
    res.json({ users: usersCount, proposals: proposalsCount });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed admin user on startup
async function ensureAdminUser() {
  try {
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      const hashed = await bcrypt.hash('jigar@mpf', 10);
      await User.create({
        name: 'Administrator',
        mobile: '0000000000',
        email: 'admin@example.com',
        username: 'admin',
        password: hashed,
      });
      console.log('Seeded admin user');
    }
  } catch (e) {
    console.error('Failed seeding admin user:', e.message);
  }
}

// Register route
app.post('/register', async (req, res) => {
  const { name, mobile, email, username, password } = req.body;
  if (!name || !mobile || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, mobile, email, username, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: { id: newUser._id, name, mobile, email, username }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: { id: user._id, name: user.name, mobile: user.mobile, email: user.email, username: user.username }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, async () => {
  await ensureAdminUser();
  console.log(`Server running on port ${PORT}`);
});