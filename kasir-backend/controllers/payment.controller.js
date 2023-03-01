const transaksi = require("../models/transaksi");
const meja = require("../models/meja");
const transaksiModel = require("../models/index").transaksi;
const mejaModel = require("../models/index").meja;
const Op = require("sequelize").Op;

exports.createPayment = async (request, response) => {
  let transaksiID = request.params.id;

  transaksiModel
    .findOne({ where: { id_transaksi: transaksiID } })
    .then(async (transaksi) => {
      if (!transaksi) {
        return response.json({
          success: false,
          message: "Transaction not found",
        });
      }

      let mejaID= transaksi.id_meja
      mejaModel
        .update({ status: "tersedia" }, { where: { id_meja: mejaID } })
        .then(async (result) => {
          transaksiModel
            .update({ status: "lunas" }, { where: { id_transaksi: transaksiID } })
            .then((result) => {
              return response.json({
                success: true,
                message: "Payment success and table/transaction status updated",
              });
            })
            .catch((error) => {
              return response.json({
                success: false,
                message: error.message,
              });
            });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
  }