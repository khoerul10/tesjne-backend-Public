import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ['uuid', 'name', 'nik', 'role']
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ['uuid', 'name', 'nik', 'role'],
      where: {
        uuid: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, nik, password, confPassword, role } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  }

  try {
    // Check if the nik already exists
    const existingUser = await User.findOne({
      where: {
        nik: nik
      }
    });

    if (existingUser) {
      return res.status(400).json({ msg: "NIK Sudah Terdaftar" });
    }

    const hashPassword = await argon2.hash(password);

    await User.create({
      name: name,
      nik: nik,
      password: hashPassword,
      role: role
    });

    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id
    }
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const { name, nik, password, confPassword, role } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
  }

  try {
    // Check if the new nik already exists
    if (nik !== user.nik) {
      const existingUser = await User.findOne({
        where: {
          nik: nik
        }
      });

      if (existingUser) {
        return res.status(400).json({ msg: "NIK Sudah Terdaftar" });
      }
    }

    let hashPassword;
    if (password === "" || password === null) {
      hashPassword = user.password;
    } else {
      hashPassword = await argon2.hash(password);
    }

    await User.update(
      {
        name: name,
        nik: nik,
        password: hashPassword,
        role: role
      },
      {
        where: {
          id: user.id
        }
      }
    );

    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.id
        }
      });
  
      if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }
  
      await User.destroy({
        where: {
          id: user.id
        }
      });
  
      res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
  