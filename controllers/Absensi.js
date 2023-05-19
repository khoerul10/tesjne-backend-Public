import { Op } from "sequelize";
import Absensi from "../models/AbsensiModel.js";
import User from "../models/UserModel.js";


export const getAbsensi = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Absensi.findAll({
                attributes:['uuid', 'date', 'time','keterangan'],
                include:[{
                    model: User,
                    attributes:['name', 'nik']
                }]
            });
        } else {
            response = await Absensi.findAll({
                attributes:['uuid', 'date', 'time','keterangan'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name', 'nik']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const getAbsensiById = async (req, res) => {
   try {
        const absensi = await Absensi.findOne({
            where:{
                uuid: req.params.id
            }
        })
        if(!absensi){
            return res.status(404).json({msg: "Data Tidak ditemukan"})
        }
        let response;
        if (req.role === "admin") {
            response = await Absensi.findOne({
                attributes:['uuid', 'date', 'time','keterangan'],
                where:{
                    id: absensi.id
                },
                include:[{
                    model: User,
                    attributes:['name', 'nik']
                }]
            });
        } else {
            response = await Absensi.findOne({
                attributes:['uuid', 'date', 'time','keterangan'],
                where:{
                    [Op.and]:[{id: absensi.id }, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name', 'nik']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const createAbsensi = async (req, res) => {
    const { date, time } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        const existingAbsensi = await Absensi.findOne({
            where: {
                userId: req.userId,
                date: today
            }
        });

        if (existingAbsensi) {
            return res.status(400).json({ msg: 'Sudah Absen hari ini' });
        }

        let keterangan = '';
        const jamMasuk = new Date(`${date}T09:00:00+07:00`);
        const waktuAbsensi = new Date(`${date}T${time}:00+07:00`);

        if (waktuAbsensi <= jamMasuk) {
            keterangan = 'Hadir';
        } else {
            keterangan = 'Terlambat';
        }
        // if (date !== today || time === '12:00') 
        if (date !== today || time === '19:20') {
            date = today;
            time = '-';
            keterangan = 'Tidak Hadir';
        }

        await Absensi.create({
            date: date,
            time: time,
            keterangan: keterangan,
            userId: req.userId
        });

        res.status(201).json({ msg: 'Absensi Success' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const updateAbsensiById = async (req, res) => {
    const { date, time } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        const absensi = await Absensi.findOne({
            where:{
                uuid: req.params.id
            }
        });

        if (!absensi) {
            return res.status(404).json({ msg: "Data Tidak Ditemukan" });
        }

        let keterangan = '';
        const jamMasuk = new Date(`${date}T09:00:00+07:00`);
        const waktuAbsensi = new Date(`${date}T${time}:00+07:00`);

        if (waktuAbsensi <= jamMasuk) {
            keterangan = 'Hadir';
        } else {
            keterangan = 'Terlambat';
        }

        if (date !== today) {
            keterangan = 'Tidak Hadir';
        }

        await Absensi.update(
            {
                date: date,
                time: time,
                keterangan: keterangan
            },
            {
                where:{
                    id: absensi.id
                }
            }
        );

        res.status(200).json({ msg: 'Absensi Updated Successfully' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

  
export const deleteAbsensi = async (req, res) => {
    try {
      const absensi = await Absensi.findOne({
        where: { 
          uuid: req.params.id,
        }
      });
  
      if (!absensi) {
        return res.status(404).json({ msg: 'Data Tidak Ditemukan' });
      }
  
      await Absensi.destroy({ where: { id: absensi.id } });
  
      res.status(200).json({ msg: 'Delete Berhasil' });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  
 
