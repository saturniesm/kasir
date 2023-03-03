const mejaModel = require("../models/index").meja;

const Op = require("sequelize").Op;

exports.getAllMeja = async (request, response) => {

  let meja = await mejaModel.findAll();
  return response.json({
    success: true,
    data: meja,
    message: "All meja have been loaded",
  });
};

exports.getOneMeja = async (request, response) => {
  try {
    let meja = await mejaModel.findAll({
      where: {
        id_meja: request.params.id_meja,
      },
    });
    response.json({
      success: true,
      data: meja,
      message: "One meja has been loaded",
    });
  } catch (err) {
    console.log(err);
  }
};


exports.findMeja = async (request, response) => {
  let keyword = request.body.keyword;

  let meja = await mejaModel.findAll({
    where: {
      [Op.or]: [{ status: { [Op.substring]: keyword } }],
    },
  });
  return response.json({
    success: true,
    data: meja,
    message: "All meja have been loaded",
  });
};

exports.addMeja = (request, response) => {

  let newMeja = {
    nomor_meja: request.body.nomor_meja,
    status: request.body.status,
  };

  mejaModel
    .create(newMeja)
    .then((result) => {
      return response.json({
        success: true,
        data: result,
        message: "New meja has been inserted",
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.updateMeja = (request, response) => {
  // prepare data that has been changed
  let dataMeja = {
    nomor_meja: request.body.nomor_meja,
    status: request.body.status,
  };

  // define id meja that will be update
  let idMeja = request.params.id_meja;

  // execute update data based on defined id member
  mejaModel
    .update(dataMeja, { where: { id_meja: idMeja } })
    .then((result) => {
      // if update's process success
      return response.json({
        success: true,
        data: dataMeja,
        message: "Data meja has been updated",
      });
    })
    .catch((error) => {
      // if update's process fail
      return response.json({
        success: false,
        message: error.message,
      });
    });
};


exports.deleteMeja = (request, response) => {
  let idMeja = request.params.id_meja;

  mejaModel
    .destroy({ where: { id_meja: idMeja } })
    .then((result) => {
      return response.json({
        success: true,
        message: "Data meja has been updated",
      });
    })
    .catch((error) => {
      // if update's process fail
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
