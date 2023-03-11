const { Op } = require("sequelize");
const mejaModel = require("../models/index").meja;

const {
  validateRequiredFields,
  checkDuplicates,
} = require("../middleware/validation");

exports.getAllMeja = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await mejaModel.findAndCountAll({
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    response.status(200).json({
      success: true,
      data: rows,
      total_pages: totalPages,
      current_page: page,
      message: "All mejas have been loaded",
    });
  } catch (error) {
    response.status(500).json({ message: "Server error" });
  }
};

exports.getOneMeja = async (request, response) => {
  try {
    const id_meja = request.params.id_meja;
    const meja = await mejaModel.findByPk(id_meja);
    if (!meja) {
      return response.status(404).json({ message: "Meja not found" });
    }
    response
      .status(200)
      .json({ success: true, data: meja, message: "Meja has been loaded" });
  } catch (error) {
    response.status(500).json({ message: "Server error" });
  }
};

exports.addMeja = async (request, response, next) => {
  try {
    const models = [mejaModel];
    const fields = ["nomor_meja"];

    request.requiredFields = ["nomor_meja", "status"];

    checkDuplicates(models, fields)(request, response, () => {
      validateRequiredFields(request, response, async () => {
        const { nomor_meja, status } = request.body;

        const meja = await mejaModel.create({
          nomor_meja,
          status,
        });

        response.status(201).json({
          success: true,
          data: { meja },
          message: "Meja has been added",
        });
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

exports.updateMeja = async (request, response, next) => {
  try {
    const models = [mejaModel];
    const fields = ["nomor_meja"];

    checkDuplicates(models, fields)(request, response, async () => {
      const { nomor_meja, status } = request.body;
      const idMeja = request.params.id_meja;

      const updatedMeja = await mejaModel.findByPk(idMeja);
      if (!updatedMeja) {
        return response.status(404).json({
          success: false,
          message: "Meja not found",
        });
      }

      await updatedMeja.update({ nomor_meja, status });

      response.status(201).json({
        success: true,
        data: { updatedMeja },
        message: "Meja has been added",
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

exports.deleteMeja = async (request, response) => {
  const idMeja = request.params.id_meja;

  try {
    const meja = await mejaModel.findByPk(idMeja);
    if (!meja) {
      return response.status(404).json({
        success: false,
        message: "Meja not found",
      });
    }

    await meja.destroy();

    return response.status(200).json({
      success: true,
      message: "Meja deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateStatusMeja = async (request, response) => {
  const { nomor_meja, status } = request.body;

  try {
    const meja = await mejaModel.findOne({ where: { nomor_meja: nomor_meja } });

    if (!meja) {
      return response.status(404).json({
        success: false,
        message: "Meja not found",
      });
    }

    if (status !== "tersedia" && status !== "tidak_tersedia") {
      return response.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    meja.status = status;
    await meja.save();

    return response.status(200).json({
      success: true,
      message: `Meja ${nomor_meja} status updated to ${status}`,
      data: meja,
    });
  } catch (err) {
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getAvailableMeja = async (request, response) => {
  try {
    const availableMeja = await mejaModel.findAll({
      where: {
        status: {
          [Op.eq]: "tersedia",
        },
      },
      attributes: { exclude: ["id_meja"] },
    });
    return response.status(200).json({
      success: true,
      data: availableMeja,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getStatusMeja = async (request, response) => {
  const { nomor_meja } = request.body;
  try {
    const statusMeja = await mejaModel.findOne({
      where: {
        nomor_meja: nomor_meja,
      },
      attributes: { exclude: ["id_meja"] },
    });
    return response.status(200).json({
      success: true,
      data: statusMeja,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

