const detail_transaksi = require("../models/detail_transaksi");
const transaksi = require("../models/transaksi");
const transaksiModel = require("../models/index").transaksi;
const detailTransaksiModel = require("../models/index").detail_transaksi;
const mejaModel = require("../models/index").meja;
const Op = require("sequelize").Op;

exports.addTransaksi = async (request, response) => {
  let newData = {
    tgl_transaksi: request.body.tgl_transaksi,
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };

  // insert ke tabel transaksi
  transaksiModel
    .create(newData)
    .then((result) => {
      // mengambil id terakhir dari transaksi
      let transaksiID = result.id_transaksi;
      // menyimpan detail_transaksi dari request ini dalam bentuk array
      let detailTransaksi = request.body.detail_transaksi;

      // insert transaksiID ke tiap item di detail_transaksi
      // (1 transaksi bisa memiliki beberapa detail_transaksi)
      for (let i = 0; i < detailTransaksi.length; i++) {
        detailTransaksi[i].id_transaksi = transaksiID;
      }
      console.log(detailTransaksi);
      // insert semua detail_transaksi
      // (termasuk id_transaksi yang diambil dari
      // result.id ke setiap detail_transaksi yang berkaitan)

      // TODO gimana biar id_transaksi bisa masuk ke detail_transaksi

      detailTransaksiModel
        .bulkCreate(detailTransaksi)
        .then((result) => {
          return response.json({
            success: true,
            message:
              "New transaction and transaction details has been inserted",
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
};

exports.updateTransaksi = async (request, response) => {
  let newData = {
    tgl_transaksi: request.body.tgl_transaksi,
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };

  let transaksiID = request.params.id;

  transaksiModel
    .update(newData, { where: { id_transaksi: transaksiID } })
    .then(async (result) => {
      await detailTransaksiModel.destroy({
        where: { id_transaksi: transaksiID },
      });

      let detailTransaksi = request.body.detail_transaksi;

      for (let i = 0; i < detailTransaksi.length; i++) {
        detailTransaksi[i].id_transaksi = transaksiID;
      }
      console.log(detailTransaksi);

      detailTransaksiModel
        .bulkCreate(detailTransaksi)
        .then((result) => {
          return response.json({
            success: true,
            message: "New transaction has been updated",
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
};

exports.deleteTransaksi = async (request, response) => {
  let transaksiID = request.params.id;

  detailTransaksiModel
    .destroy({ where: { id_transaksi: transaksiID } })
    .then((result) => {
      transaksiModel
        .destroy({ where: { id_transaksi: transaksiID } })
        .then((result) => {
          return response.json({
            success: true,
            message: ` transaction has deleted`,
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
};

//TODO kurang pembayaran transaksi dimana meja akan diubah dari status tersedia menjadi tidak tersedia atau sebaliknya
exports.createPayment = async (request, response) => {
  const params = {
    id_transaksi: request.params.id_transaksi,
  };
  const transaksinya = await transaksiModel.findOne({ attributes: ["id_meja"], where : params });
  let mejaID = transaksinya.id_meja;
  console.log("Ini Error apa", mejaID);
  mejaModel
    .update({ status: "tersedia" }, { where: { id_meja: mejaID } })
    .then(async (result) => {
      transaksiModel
        .update({ status: "lunas" }, { where: params })
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
};

exports.findOneTransaksi = async (req, res) => {
  try {
    const params = {
      id_transaksi: req.params.id_transaksi,
    };

    const result = await transaksiModel.findOne({ attributes: ["id_meja"], where : params });
    return res.json({
      success: true,
      data: result,
      code: 200,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      code: 500,
    });
  }
};
