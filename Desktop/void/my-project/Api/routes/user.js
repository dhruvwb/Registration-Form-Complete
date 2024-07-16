const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.get("/api/test", () => {
  console.log("Test");
});

router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    password: CryptoJS.AES.encrypt(req.body.password, "Pass"),
    classs: req.body.classs,
    gender: req.body.gender,
    age: req.body.age,
    pinCode: req.body.pinCode,
    state: req.body.state,
    city: req.body.city,
    startDate: req.body.date,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    console.log(savedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    // .body -> when user takes input...
    // .user -> when we want data from the database...
    const user = await User.findOne({ name: req.body.name });
    !user && res.status(401).json("Wrong Credentials");
    const hashedPassword = CryptoJS.AES.decrypt(user.password, "Pass");

    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    Originalpassword != req.body.password &&
      res.status(401).json("Wrong Credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      "Pass",
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  // If user changes the password then the password should be Encytpted
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      "Pass"
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All User

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get User Stats

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const LastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: LastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
