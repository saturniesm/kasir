const menuModel = require("../models/index").menu;
const Op = require("sequelize").Op;
const path = require("path");
const fs = require("fs");
const upload = require(`./upload-cover`).single(`cover`);

// create function to get all menu
exports.getAllMenu = async (request, response) => {
  // call findAll() to get all data
  let menu = await menuModel.findAll();
  return response.json({
    success: true,
    data: menu,
    message: "All menus have been loaded",
  });
};

exports.getOneMenu = async (request, response) => {
  try {
    let menu = await menuModel.findAll({
      where: {
        id_menu: request.params.id_menu,
      },
    });
    response.json({
      success: true,
      data: menu,
      message: "One menu has been loaded",
    });
  } catch (err) {
    console.log(err);
  }
};

// create function for filter using keyword
exports.findMenu = async (request, response) => {
  // define keyword to find data
  let keyword = request.body.keyword;

  let menu = await menuModel.findAll({
    where: {
      [Op.or]: [
        { nama_menu: { [Op.substring]: keyword } },
        { jenis: { [Op.substring]: keyword } },
        { harga: { [Op.substring]: keyword } },
      ],
    },
  });
  return request.json({
    success: true,
    data: menu,
    message: "All menus have been loaded",
  });
};

exports.addMenu = (request, response) => {
  if (!request.file) {
    return response.json({ message: "nothing to upload" });
  }

  // prepare data from request
  let newMenu = {
    nama_menu: request.body.nama_menu,
    jenis: request.body.jenis,
    deskripsi: request.body.deskripsi,
    gambar: request.file.filename,
    harga: request.body.harga,
  };

  menuModel
    .create(newMenu)
    .then((result) => {
      // if insert's process success
      return response.json({
        success: true,
        data: result,
        message: "New menu has been inserted",
      });
    })

    .catch((error) => {
      // if insert's process failed
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

// create function to update menu
exports.updateMenu = async (request, response) => {
  // run upload function
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    let id_menu = request.params.id_menu;

    let menu = {
      nama_menu: request.body.nama_menu,
      jenis: request.body.jenis,
      deskripsi: request.body.deskripsi,
      harga: request.body.harga,
    };

    if (request.file) {
      const selectedMenu = await menuModal.findOne({
        where: { id_menu: id_menu },
      });

      const oldCoverMenu = selectedMenu.cover;

      const pathCover = path.join(__dirname, "../cover", oldCoverMenu);

      if (fs.existsSync(pathCover)) {
        fs.unlink(pathCover, (error) => console.log(error));
      }
      menu.cover = request.file.filename;
    }

    menuModel
      .update(menu, { where: { id_menu: id_menu } })
      .then((result) => {
        return response.json({
          success: true,
          message: "Data menu has been update",
        });
      })
      .catch((error) => {
        return response.json({});
      });
  });
};

exports.deleteMenu = async (request, response) => {
  const id_menu = request.params.id_menu;

  const menu = await menuModel.findOne({ where: { id_menu: id_menu } });
  const oldCoverMenu = menu.cover;
  const pathCover = path.join(__dirname, `../cover`, oldCoverMenu);
  if (fs.existsSync(pathCover)) {
    fs.unlink(pathCover, (error) => console.log(error));
  }

  menuModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        data: menu,
        message: `Data menu has been deleted`,
      });
    })
    .catch((error) => {
      /** if update's process fail */
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
