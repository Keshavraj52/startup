const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection failed:", error));

// ✅ Define Admin Schema
const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bloodBankName: String,
  location: String,
  contact: String,
});
//// bloodbank management

// ✅ Define Blood Component Schema
const bloodComponentSchema = new mongoose.Schema({
  name: String,
  units: Number,
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
});

const BloodComponent = mongoose.model("BloodComponent", bloodComponentSchema);

// ✅ Middleware for JWT Authentication
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied! No token provided." });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token!" });
  }
}

// ✅ Admin Routes for Blood Component Management
app.post("/admin/components", authenticateToken, async (req, res) => {
  if (req.user.userType !== "admin") return res.status(403).json({ error: "Access Denied!" });

  try {
    const component = new BloodComponent(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/admin/components/:id", authenticateToken, async (req, res) => {
  if (req.user.userType !== "admin") return res.status(403).json({ error: "Access Denied!" });

  try {
    const component = await BloodComponent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(component);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/admin/components/:id", authenticateToken, async (req, res) => {
  if (req.user.userType !== "admin") return res.status(403).json({ error: "Access Denied!" });

  try {
    await BloodComponent.findByIdAndDelete(req.params.id);
    res.json({ message: "Component deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ User Route to View Available Blood Components
app.get("/components/:bloodBankId", authenticateToken, async (req, res) => {
  try {
    const components = await BloodComponent.find({ bloodBankId: req.params.bloodBankId });
    res.json(components);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



///
const Admin = mongoose.model("Admin", AdminSchema);

// ✅ Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
});

const User = mongoose.model("User", UserSchema);

// ✅ Middleware for JWT Authentication
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied! No token provided." });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token!" });
  }
}

// ✅ Admin Signup Route
app.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password, bloodBankName, location, contact } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ error: "Admin already registered" });

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
    const admin = new Admin({ name, email, password: hashedPassword, bloodBankName, location, contact });
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering admin" });
  }
});

// ✅ Admin Login Route
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid email or password" });

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) return res.status(401).json({ error: "Invalid email or password" });

    // Generate JWT token for authentication
    const token = jwt.sign({ id: admin._id, userType: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      userType: "admin",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        bloodBankName: admin.bloodBankName,
        location: admin.location,
        contact: admin.contact,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// ✅ User Signup Route
app.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// ✅ User Login Route
app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: "Invalid email or password" });

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user._id, userType: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      userType: "user",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// ✅ Protected Admin Dashboard Route (Requires Authentication)
app.get("/admin/dashboard", authenticateToken, async (req, res) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ error: "Access Denied! Not an admin." });
  }

  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      bloodBankName: admin.bloodBankName,
      location: admin.location,
      contact: admin.contact,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
});

// ✅ Get Blood Banks Route (For users to see available blood banks)
app.get("/bloodbanks", async (req, res) => {
  try {
    const bloodBanks = await Admin.find({}, "bloodBankName location contact");
    res.json(bloodBanks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching blood banks" });
  }
});

// ✅ Logout Route (Frontend should just remove the token)
app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
