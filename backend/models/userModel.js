const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    wallet_address: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerifier: {
      type: Boolean,
      required: true,
      default: false,
    },
    verifierInfo: {
      nin_number: { type: String },
      voter_card_id: { type: String },
      phone_number: { type: String },
      active_mail: { type: String },
      image: { type: String },
    },
    bio: {
      type: String,
    },
    carbon_credit_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    verifier_credit_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    totalFarmsVerified: {
      type: Number,
      default: 0,
    },
    totalVerifierCreditYield: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
