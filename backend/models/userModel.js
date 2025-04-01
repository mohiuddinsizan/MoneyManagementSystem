import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Optional profile image (URL of the image)
    profileImage: { type: String, default: "" },

    // Money the user owes (array of objects)
    debts: [
      {
        name: String, // Name of the person user owes money to
        amount: { type: Number, required: true, min: 0 },
        timestamp: { type: Date, default: Date.now }, // Timestamp of when the debt was created
      }
    ],

    // Money others owe the user (array of objects)
    owedByOthers: [
      {
        name: String, // Name of the person who owes the user
        amount: { type: Number, required: true, min: 0 },
        timestamp: { type: Date, default: Date.now }, // Timestamp of when the credit was created
      }
    ],

    // Transaction History (array of objects)
    transactionHistory: [
      {
        type: { type: String, enum: ['debt', 'credit'], required: true },
        name: String, // Name of the person involved
        amount: { type: Number, required: true, min: 0 },
        timestamp: { type: Date, default: Date.now },
      }
    ]
  },
  { timestamps: true }
);

// Calculate total debt
userSchema.methods.getTotalDebt = function () {
  return this.debts.reduce((total, debt) => total + debt.amount, 0);
};

// Calculate total amount owed by others
userSchema.methods.getTotalOwed = function () {
  return this.owedByOthers.reduce((total, entry) => total + entry.amount, 0);
};

// Add a transaction to history
userSchema.methods.addTransactionToHistory = function (type, name, amount) {
  if (this.transactionHistory.length >= 100) {
    this.transactionHistory.shift(); // Remove the oldest transaction if we exceed 100
  }
  this.transactionHistory.push({ type, name, amount, timestamp: Date.now() });
  return this.save();
};

const User = mongoose.model("User", userSchema);
export default User;
