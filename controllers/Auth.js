import User from "../models/UserModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        nik: req.body.nik
      }
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const match = await argon2.verify(user.password, req.body.password);

    if (!match) {
      return res.status(400).json({ msg: "Wrong Password" });
    }

    req.session.userId = user.uuid;
    const { uuid, name, nik, role } = user;

    res.status(200).json({ uuid, name, nik, role });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    const user = await User.findOne({
      attributes: ['uuid', 'name', 'nik', 'role'],
      where: {
        uuid: req.session.userId
      }
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ msg: "Tidak dapat logout" });
    }

    res.status(200).json({ msg: "Anda telah logout" });
  });
};
