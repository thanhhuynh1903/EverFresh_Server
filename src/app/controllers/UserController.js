const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment/moment");
const RoleEnum = require("../../enum/RoleEnum");

//@desc Register New user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    const userEmailAvailable = await User.findOne({ email });
    if (userEmailAvailable) {
      res.status(400);
      throw new Error("User has already registered with Email!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: RoleEnum.CUSTOMER,
    });
    if (!user) {
      res.status(400);
      throw new Error("User data is not Valid!");
    }
    const accessToken = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          roleName: user.role,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          roleName: user.role,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all users
//@route GET /api/users
//@access private
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error(
        "Chỉ có Admin có quyền truy xuất thông tin tất cả tài khoản"
      );
    }
    let users = await User.find().exec();
    if (!users) {
      res.status(400);
      throw new Error(
        "Có lỗi xảy ra khi Admin truy xuất thông tin tất cả tài khoản"
      );
    }
    users = users.filter((user) => user.role_id.roleName !== RoleEnum.ADMIN);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all users
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get user
//@route GET /api/users/:id
//@access private
const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    const userEmail = user.email;
    if (
      !(req.user.email === userEmail || req.user.roleName === RoleEnum.ADMIN)
    ) {
      res.status(403);
      throw new Error("You don't have permission to get user's profile");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(res.statusCode).send(error.message || "Internal Server Error");
  }
});

//@desc Update user
//@route PUT /api/users/:id
//@access private
const updateUsers = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }

    if (req.user.email !== user.email) {
      res.status(403);
      throw new Error("You don't have permission to update user's profile");
    }

    const { name, avatar_url, dob, country } = req.body;
    const updateFields = {
      name: name !== undefined ? name : user.name,
      avatar_url: avatar_url !== undefined ? avatar_url : user.avatar_url,
      dob: dob !== undefined ? dob : user.dob,
      country: country !== undefined ? country : user.country,
    };

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
      }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private
const deleteUsers = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("You don't have permission to update user's profile");
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc User change password
//@route GET /api/users/checkOldPassword/:id
//@access private
const checkOldPassword = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      res.status(401);
      throw new Error("Old password is incorrect");
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc User change password
//@route GET /api/users/changePassword/:id
//@access private
const changePassword = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not Found!");
    }
    if (req.user.id !== id) {
      res.status(403);
      throw new Error("You don't have permission to change other password!");
    }
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Password and confirm password are different!");
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      res.status(500);
      throw new Error(
        "Something when wrong in hashPassword of changePassword function!"
      );
    }
    const updatePassword = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    if (!updatePassword) {
      res.status(500);
      throw new Error("Something when wrong in changePassword");
    }
    res.status(200).json(updatePassword);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const statisticsAccountByStatus = asyncHandler(async (req, res) => {
  try {
    let accounts = await User.find();
    if (!accounts || accounts.length === 0) {
      return null;
    }
    accounts = accounts.filter(
      (account) => account.role_id.roleName !== RoleEnum.ADMIN
    );
    const tmpCountData = {
      Active: 0,
      InActive: 0,
    };

    accounts.forEach((account) => {
      if (account.status) {
        tmpCountData["Active"] = tmpCountData["Active"] + 1;
      } else {
        tmpCountData["InActive"] = tmpCountData["InActive"] + 1;
      }
    });

    const result = Object.keys(tmpCountData).map((key) => ({
      key,
      value: tmpCountData[key],
    }));
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const searchAccountByEmail = asyncHandler(async (req, res, next) => {
  try {
    const searchEmail = req.query.searchEmail;
    if (!searchEmail || searchEmail === undefined) {
      res.status(400);
      throw new Error("Không được để trống thông tin yêu cầu");
    }
    let users = await User.find({
      email: { $regex: searchEmail, $options: "i" },
    });
    if (!users) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tìm kiếm tài khoản theo email");
    }
    users = users.filter((user) => user.role_id.roleName !== RoleEnum.ADMIN);
    // Send the results as a JSON response to the client
    res.json(users);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const banAccountByAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { account_id } = req.params;
    const user = await User.findById(account_id).exec();
    if (!user) {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản!");
    }
    if (user.role_id.roleName === RoleEnum.ADMIN) {
      res.status(400);
      throw new Error("Không thể khóa tài khoản admin");
    }
    user.status = false;
    const result = await user.save();
    if (!result) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi khóa tài khoản");
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUsers,
  deleteUsers,
  currentUser,
  checkOldPassword,
  changePassword,
  statisticsAccountByStatus,
  searchAccountByEmail,
  banAccountByAdmin,
};
