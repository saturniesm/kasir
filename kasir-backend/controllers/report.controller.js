const transaksiModel = require("../models/index").transaksi;
const detailTransaksiModel = require("../models/index").detail_transaksi;
const mejaModel = require("../models/index").meja;
const menuModel = require("../models/index").menu;
const userModel = require("../models/index").user;
const Op = require("sequelize").Op;
const sequelize = require("../sequelize");



exports.getTransaksiByKasir = async (request, response) => {
  try {
    const id_user = request.params.id_user;

    console.log(id_user);

    const getTransaksi = await transaksiModel.findAll({
      where: {
        id_user: id_user,
      },
      include: {
        model: detailTransaksiModel,
        as: "detail_transaksi",
      },
    });
    response.status(200).json({
      success: true,
      data: getTransaksi,
      message: `Transaction has been loaded.`,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getmostFavoriteProduct = async (request, response) => {
  try {
    const favoriteMenus = await detailTransaksiModel.findAll({
      attributes: [
        [sequelize.literal("menu.nama_menu"), "nama_menu"],
        [
          sequelize.fn("SUM", sequelize.col("detail_transaksi.qty")),
          "total_qty",
        ],
      ],
      include: [
        {
          model: menuModel,
          as: "menu",
          attributes: [],
        },
      ],
      group: ["menu.id_menu"],
      order: [[sequelize.literal("total_qty"), "DESC"]],
    });

    response.status(200).json({
      success: true,
      data: favoriteMenus,
      message: `Costumer's favorite menu has been loaded.`,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getListFavoriteProduct = async (request, response) => {
  try {
    const favoriteMenus = await detailTransaksiModel.findAll({
      attributes: [
        [sequelize.literal("menu.nama_menu"), "nama_menu"],
        [
          sequelize.fn("SUM", sequelize.col("detail_transaksi.qty")),
          "total_qty",
        ],
      ],
      include: [
        {
          model: menuModel,
          as: "menu",
          attributes: ["id_menu", "nama_menu"],
        },
      ],
      order: [[sequelize.literal("total_qty"), "DESC"]],
      group: ["menu.id_menu"],
    });

    response.status(200).json({
      success: true,
      data: favoriteMenus,
      message: `Costumer's favorite menus has been loaded.`,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.rangeDate = async (req, res) => {
  const startDate = new Date(req.query.start);
  const endDate = new Date(req.query.end);

  if (!startDate || !endDate) {
    return res.status(400).json({
      status: "error",
      message: "Please provide both start and end date.",
    });
  }

  if (startDate > endDate) {
    return res.status(400).json({
      status: "error",
      message: "Start date cannot be greater than end date.",
    });
  }

  try {
    const transactions = await transaksiModel.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Transactions retrieved successfully.",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getRevenue = async (request, response) => {
  const startDate = new Date(request.query.start);
  const endDate = new Date(request.query.end);

  if (!startDate || !endDate) {
    return response.status(400).json({
      status: "error",
      message: "Please provide both start and end date.",
    });
  }

  if (startDate > endDate) {
    return response.status(400).json({
      status: "error",
      message: "Start date cannot be greater than end date.",
    });
  }

  try {
    const totalRevenue = await transaksiModel.sum("total", {
      where: {
        tgl_transaksi: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    response.status(200).json({
      status: "success",
      data: totalRevenue,
      message: "Total revenue retrieved successfully.",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
