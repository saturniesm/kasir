const transaksiModel = require("../models/index").transaksi;
const detailTransaksiModel = require("../models/index").detail_transaksi;
const mejaModel = require("../models/index").meja;
const menuModel = require("../models/index").menu;
const userModel = require("../models/index").user;
const Op = require("sequelize").Op;
const sequelize = require("../sequelize");


exports.getTransaksiByKasir = async (request, response) => {
  try {
    const id_user = request.user.id_user;
    const username = request.user.username;

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
      message: `Transaction from ${username} has been loaded.`,
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



exports.getDailyTransaksi = async (request, response) => {
  try {
    const dailyTransactions = await transaksiModel.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [
            sequelize.literal(`DATE_TRUNC('day', NOW())`),
            sequelize.literal(
              `DATE_TRUNC('day', NOW()) + INTERVAL '1 day' - INTERVAL '1 second'`
            ),
          ],
        },
      },
    });

    response.status(200).json({
      success: true,
      data: dailyTransactions,
      message: `Daily transactions have been loaded.`,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getMonthlyTransaksi = async (request, response) => {
  try {
    const montlyTransactions = await transaksiModel.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [
            sequelize.literal(`DATE_TRUNC('month', NOW())`),
            sequelize.literal(
              `DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 second'`
            ),
          ],
        },
      },
    });

    response.status(200).json({
      success: true,
      data: montlyTransactions,
      message: `Monthly transactions have been loaded.`,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getYearlyTransaksi = async (request, response) => {
  try {
    const transactions = await transaksiModel.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [
            sequelize.literal(`DATE_TRUNC('year', NOW())`),
            sequelize.literal(
              `DATE_TRUNC('year', NOW()) + INTERVAL '1 year' - INTERVAL '1 second'`
            ),
          ],
        },
      },
    });

    response.status(200).json({
      success: true,
      data: transactions,
      message: `Yearly transactions have been loaded.`,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};