const transaksiModel = require("../models/index").transaksi;
const detailTransaksiModel = require("../models/index").detail_transaksi;
const mejaModel = require("../models/index").meja;
const menuModel = require("../models/index").menu;
const Op = require("sequelize").Op;
const { validateRequiredFields } = require("../middleware/validation");
const sequelize = require("../sequelize");

// STATUS MEJA AUTO TIDAK TERSEDIA
// CEK APAKAH MEJA TERSEDIA APA GAK
exports.createTransaksi = async (request, response) => {
  try {
    request.requiredFields = ["id_meja", "nama_pelanggan", "detail_transaksi"];

    validateRequiredFields(request, response, async () => {
      const { id_meja, nama_pelanggan, detail_transaksi } = request.body;
      const id_user = request.user.id_user;
      const status = "belum_bayar";

      const totalPrice = await Promise.all(
        detail_transaksi.map(async (detail) => {
          const menu = await menuModel.findOne({
            where: { id_menu: detail.id_menu },
          });
          return menu.harga * detail.qty;
        })
      ).then((prices) => prices.reduce((sum, price) => sum + price, 0));

      const transaksi = await transaksiModel.create(
        {
          id_user,
          id_meja,
          nama_pelanggan,
          status,
          total: totalPrice,
          detail_transaksi: detail_transaksi.map((detail) => ({ ...detail })),
        },
        {
          include: {
            model: detailTransaksiModel,
            as: "detail_transaksi",
          },
        }
      );

      response.status(201).json({
        success: true,
        data: transaksi,
        message: "Transaksi has been added",
      });
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateTransaksi = async (request, response) => {
  try {
    request.requiredFields = ["id_meja", "nama_pelanggan", "detail_transaksi"];
    validateRequiredFields(request, response, async () => {
      const { id_meja, nama_pelanggan, status, detail_transaksi } =
        request.body;
      const { id_transaksi } = request.params;
      const id_user = request.user.id_user;

      const checkTransaksi = await transaksiModel.findByPk(id_transaksi, {
        include: {
          model: detailTransaksiModel,
          as: "detail_transaksi",
        },
      });

      if (!checkTransaksi) {
        return response.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }

      const totalPrice = await Promise.all(
        detail_transaksi.map(async (detail) => {
          const menu = await menuModel.findOne({
            where: { id_menu: detail.id_menu },
          });
          return menu.harga * detail.qty;
        })
      ).then((prices) => prices.reduce((sum, price) => sum + price, 0));

      const transaksi = await transaksiModel.update(
        {
          id_user,
          id_meja,
          nama_pelanggan,
          status,
          total: totalPrice,
          detail_transaksi: detail_transaksi.map((detail) => ({ ...detail })),
        },
        {
          where: {
            id_transaksi: id_transaksi,
          },
          returning: true,
          include: {
            model: detailTransaksiModel,
            as: "detail_transaksi",
          },
        }
      );

      response.status(201).json({
        success: true,
        data: transaksi,
        message: "Transaksi has been updated",
      });
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteTransaksi = async (request, response) => {
  try {
    const id_transaksi = request.params.id;

    const checkTransaksi = await transaksiModel.findByPk(id_transaksi, {
      include: {
        model: detailTransaksiModel,
        as: "detail_transaksi",
      },
    });

    if (!checkTransaksi) {
      return response.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await detailTransaksiModel.destroy({
      where: { id_transaksi: id_transaksi },
    });
    await transaksiModel.destroy({ where: { id_transaksi: id_transaksi } });

    return response.json({
      success: true,
      message: `Transaction with ID ${id_transaksi} and its associated details have been deleted.`,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// MASI ERROR
exports.createPayment = async (request, response) => {
  try {
    const { id_transaksi } = request.params;

    const checkTransaksi = await transaksiModel.findByPk(id_transaksi, {
      include: {
        model: detailTransaksiModel,
        as: "detail_transaksi",
      },
    });

    if (!checkTransaksi) {
      return response.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const result = await sequelize.transaction(async (t) => {
      const transaksi = await transaksiModel.update(
        { status: "lunas" },
        {
          where: { id_transaksi: id_transaksi },
          returning: true,
          plain: true,
          include: [
            {
              model: mejaModel,
              as: "meja",
              where: { id_meja: sequelize.col("transaksi.id_meja") },
            },
          ],
          transaction: t,
        }
      );

      const meja = await mejaModel.update(
        { status: "tersedia" },
        {
          where: { id_meja: transaksi[0].meja.id_meja },
          transaction: t,
        }
      );

      return transaksi;
    });

    return response.json({
      success: true,
      message: "Payment success and table/transaction status updated",
    });
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Error occurred during payment and status update",
    });
  }
};

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

exports.getAllTransaksi = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await transaksiModel.findAndCountAll({
      offset,
      limit,
      include: {
        model: detailTransaksiModel,
        as: "detail_transaksi",
      },
    });

    const totalPages = Math.ceil(count / limit);

    response.status(200).json({
      success: true,
      data: rows,
      total_pages: totalPages,
      current_page: page,
      message: "All transaksis have been loaded",
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

// CHECK MARIA DB DATE
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

