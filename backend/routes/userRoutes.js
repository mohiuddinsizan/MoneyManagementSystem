import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Correct import

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-image", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("Uploading image...");

    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploading to Cloudinary...");
    
    // Use a Promise wrapper to handle Cloudinary upload_stream
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures", resource_type: "image" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      });
    };

    // Wait for the upload to finish
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    console.log("Cloudinary Upload Successful:", cloudinaryResult.secure_url);

    // Update user profile with the new image URL
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: cloudinaryResult.secure_url },
      { new: true }
    );

    res.json({ profileImage: user.profileImage });

  } catch (error) {
    console.error("Server Error in /upload-image:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Route to get the last 100 transactions
router.get("/transaction-history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get the last 100 transactions (they are stored in `transactionHistory`)
    const transactionHistory = user.transactionHistory.reverse().slice(0, 100); // Reverse to get most recent first

    res.json({
      transactionHistory
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Register User
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with empty debts and owedByOthers
    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      debts: [], 
      owedByOthers: [] 
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
  
  
// Add a debt to the user's record
router.post("/add-debt", authMiddleware, async (req, res) => {
  try {
    const { name, amount } = req.body;
    
    // Validate the input
    if (!name || !amount) {
      return res.status(400).json({ message: "Name and amount are required" });
    }

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the debt to the user's debts array
    user.debts.push({ name, amount });

    // Log the transaction in transactionHistory
    await user.addTransactionToHistory("debt", name, amount);

    // Save the updated user document
    await user.save();

    res.json({ message: "Debt added successfully", debts: user.debts });
  } catch (err) {
    console.error("Error in add-debt:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add an owed amount to the user's record
router.post("/add-owed", authMiddleware, async (req, res) => {
  try {
    const { name, amount } = req.body;
    
    // Validate the input
    if (!name || !amount) {
      return res.status(400).json({ message: "Name and amount are required" });
    }

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the owed amount to the user's owedByOthers array
    user.owedByOthers.push({ name, amount });

    // Log the transaction in transactionHistory
    await user.addTransactionToHistory("credit", name, amount);

    // Save the updated user document
    await user.save();

    res.json({ message: "Owed amount added successfully", owedByOthers: user.owedByOthers });
  } catch (err) {
    console.error("Error in add-owed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

  

  // Update a debt entry
router.put("/update-debt/:id", authMiddleware, async (req, res) => {
    try {
      const { name, amount } = req.body;
      const userId = req.user.id;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const debt = user.debts.id(req.params.id);
      if (!debt) return res.status(404).json({ message: "Debt not found" });
  
      // Update the fields
      debt.name = name;
      debt.amount = amount;
      await user.save();
  
      res.json({ message: "Debt updated successfully", debt });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  // Update an owed entry
  router.put("/update-owed/:id", authMiddleware, async (req, res) => {
    try {
      const { name, amount } = req.body;
      const userId = req.user.id;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const owed = user.owedByOthers.id(req.params.id);
      if (!owed) return res.status(404).json({ message: "Owed amount not found" });
  
      owed.name = name;
      owed.amount = amount;
      await user.save();
  
      res.json({ message: "Owed amount updated successfully", owed });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  // Delete a debt
  router.delete("/delete-debt/:id", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.debts = user.debts.filter((debt) => debt._id.toString() !== req.params.id);
      await user.save();
  
      res.json({ message: "Debt deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  // Delete an owed entry
  router.delete("/delete-owed/:id", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.owedByOthers = user.owedByOthers.filter((owed) => owed._id.toString() !== req.params.id);
      await user.save();
  
      res.json({ message: "Owed entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  

// Login User
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });

    res.json({ 
      token, 
      username: user.username,
      profileImage: user.profileImage || "",
      debts: user.debts,
      owedByOthers: user.owedByOthers
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Calculate total debt and total owed amount
    const totalDebt = user.debts.reduce((sum, debt) => sum + debt.amount, 0);
    const totalOwed = user.owedByOthers.reduce((sum, entry) => sum + entry.amount, 0);

    res.json({
      username: user.username,
      profileImage: user.profileImage || "",
      totalDebt,
      totalOwed,
      debts: user.debts,
      owedByOthers: user.owedByOthers
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
