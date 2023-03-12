const transaksiModel = require("../models/index").transaksi;
const detailTransaksiModel = require("../models/index").detail_transaksi;
const mejaModel = require("../models/index").meja;
const menuModel = require("../models/index").menu;
const userModel = require("../models/index").user;
const Op = require("sequelize").Op;
const { validateRequiredFields } = require("../middleware/validation");
const sequelize = require("../sequelize");

exports.createTransaksi = async (request, response) => {
  try {
    request.requiredFields = ["id_meja", "nama_pelanggan", "detail_transaksi"];

    validateRequiredFields(request, response, async () => {
      const { id_meja, nama_pelanggan, detail_transaksi } = request.body;
      const id_user = request.user.id_user;
      const status = "belum_bayar";

      const checkMeja = await mejaModel.findOne({
        where: { id_meja: id_meja, status: "tersedia" },
      });

      if (!checkMeja) {
        return response.status(404).json({
          success: false,
          message: "Meja is not available",
        });
      } else {
        const updateStatusMeja = await mejaModel.update(
          { status: "tidak_tersedia" },
          {
            where: { id_meja: id_meja },
          }
        );
      }

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
    const { id_transaksi } = request.params;

    const checkTransaksi = await transaksiModel.findByPk(id_transaksi);

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

exports.createPayment = async (request, response) => {
  try {
    const { id_transaksi } = request.params;

    const checkTransaksi = await transaksiModel.findByPk(id_transaksi);

    if (!checkTransaksi) {
      return response.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const id_meja = checkTransaksi.id_meja;

    const result = await sequelize.transaction(async (t) => {
      const transaksi = await transaksiModel.update(
        { status: "lunas" },
        {
          where: { id_transaksi: id_transaksi },
          transaction: t,
        }
      );

      const meja = await mejaModel.update(
        { status: "tersedia" },
        {
          where: { id_meja: id_meja },
          transaction: t,
        }
      );
      return transaksi;
    });

    return response.status(201).json({
      success: true,
      message: "Payment success and table transaction status updated",
    });
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Error occurred during payment and status update",
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
      include: [
        {
          model: detailTransaksiModel,
          as: "detail_transaksi",
          include: [
            {
              model: menuModel,
              attributes: ["id_menu", "nama_menu", "jenis", "deskripsi"],
            },
          ],
          attributes: ["id_detail_transaksi", "qty"],
        },
        {
          model: userModel,
          attributes: ["id_user", "nama_user", "role"],
        },
        {
          model: mejaModel,
          attributes: ["nomor_meja", "status"],
        },
      ],
      attributes: ["id_transaksi", "nama_pelanggan", "status", "total"],
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


// PRINT INVOICE :)))
// GET ONE TRANSAKSI
