const menuModel = require("../models/index").menu;
const Op = require("sequelize").Op;
const path = require("path");
const fs = require("fs");

const {
  validateRequiredFields,
  checkDuplicates,
} = require("../middleware/validation");

exports.getAllMenu = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await menuModel.findAndCountAll({
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    response.status(200).json({
      success: true,
      data: rows,
      total_pages: totalPages,
      current_page: page,
      message: "All menus have been loaded",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getOneMenu = async (request, response) => {
  try {
    const id_menu = request.params.id_menu;
    const menu = await menuModel.findByPk(id_menu);
    if (!menu) {
      return response.status(404).json({ message: "menu not found" });
    }
    response
      .status(200)
      .json({ success: true, data: menu, message: "menu has been loaded" });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateMenu = async (request, response) => {
  try {
    const models = [menuModel];
    const fields = ["nama_menu"];

    checkDuplicates(models, fields)(request, response, async () => {
      const { id_menu } = request.params;
      const { nama_menu, jenis, deskripsi, harga } = request.body;
      const selectedMenu = await menuModel.findOne({ where: { id_menu } });

      if (!selectedMenu) {
        return response.json({ message: "Menu not found" });
      }

      let menu = { nama_menu, jenis, deskripsi, harga };

      if (request.file) {
        const oldGambarMenu = selectedMenu.gambar;

        const pathGambar = path.join(
          __dirname,
          "../images/menu",
          oldGambarMenu
        );

        if (fs.existsSync(pathGambar)) {
          fs.unlinkSync(pathGambar);
        }

        menu.gambar = request.file.filename;
      }

      const result = await menuModel.update(menu, {
        where: { id_menu: request.params.id_menu },
      });

      if (result) {
        return response.json({
          success: true,
          message: "Data menu has been updated",
        });
      } else {
        return response.json({ message: "Failed to update data" });
      }
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.addMenu = async (request, response, next) => {
  try {
    const models = [menuModel];
    const fields = ["nama_menu"];

    request.requiredFields = ["nama_menu", "jenis", "deskripsi", "harga"];

    checkDuplicates(models, fields)(request, response, () => {
      validateRequiredFields(request, response, async () => {
        const { nama_menu, jenis, deskripsi, harga } = request.body;
        const gambar = request.file.filename;

        if (!gambar) {
          return response
            .status(400)
            .json({ message: "Missing required fields gambar" });
        }

        const menu = await menuModel.create({
          nama_menu,
          jenis,
          deskripsi,
          gambar,
          harga,
        });

        response.status(201).json({
          success: true,
          data: { menu },
          message: "menu has been added",
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

exports.deleteMenu = async (req, res) => {
  try {
    const { id_menu } = req.params;

    const selectedMenu = await menuModel.findByPk(id_menu);

    if (!selectedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const pathGambar = path.join(
      __dirname,
      "../images/menu",
      selectedMenu.gambar
    );

    console.log(pathGambar);

    if (fs.existsSync(pathGambar)) {
      fs.unlinkSync(pathGambar);
    }

    await menuModel.destroy({
      where: { id_menu },
    });

    res.status(200).json({
      success: true,
      data: selectedMenu,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getMenuByName = async (request, response) => {
  try {
    const { q: name } = request.query;

    const filteredMenu = await menuModel.findAll({
      where: {
        nama_menu: { [Op.like]: `%${name}%` },
      },
    });

    return response.status(200).json({ success: true, data: filteredMenu });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.filterByCategory = async (req, res) => {
  try {
    const { jenis } = req.params;
    const menus = await menuModel.findAll({
      where: {
        jenis: {
          [Op.eq]: jenis,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    if (!menus) {
      return response.status(404).json({ message: "Jenis menu not found" });
    }
    return res.status(200).json({
      success: true,
      data: menus,
      message: "Jenis menus have been loaded",
    });
  } catch (error) {
        response.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
  }
};
