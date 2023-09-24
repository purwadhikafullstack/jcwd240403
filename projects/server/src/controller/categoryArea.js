const { compareSync } = require("bcryptjs");
const db = require("../models");
const { where } = require("sequelize");

const getAllCatArea = async (req, res) => {
  try {
    const result = await db.Category_area.findAll({
      where: { is_deleted: false },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).send({
      message: "Success get all category area",
      data: result,
    });
  } catch (error) {
    console.log("getallcatarea", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const addCatArea = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const { categoryArea } = req.body;

    const [result, created] = await db.Category_area.findOrCreate({
      where: { name: categoryArea },
      defaults: { user_id: userId, is_deleted: false },
      transaction,
    });

    // If it's not newly created, check if it was previously deleted. if it was previously deleted then update it.
    if (!created && result.is_deleted) {
      await result.update(
        {
          user_id: userId,
          is_deleted: false,
        },
        { transaction }
      );

      await transaction.commit();
      return res.status(200).send({
        message: "Successfully created category.",
        data: result,
        condition: created,
      });
    }

    // If it's not newly created and not deleted, then it's an existing entry.
    if (!created) {
      return res.status(200).send({
        message: "The category area already exists.",
        data: result,
        condition: created,
      });
    }

    // If it was newly created.
    await transaction.commit();
    return res.status(201).send({
      message: "Success add new category area.",
      data: result,
      condition: created,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("errAddCatArea", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const getAllMyCatArea = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.Category_area.findAll({
      where: { user_id: userId, is_deleted: false },
    });

    if (result.length === 0) {
      return res.status(200).send({
        message: "You dont have any category area created.",
      });
    }

    res.status(200).send({
      message: "Success get all my category area.",
      data: result,
    });
  } catch (error) {
    console.log("getallmine", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const getOneMyCatArea = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const result = await db.Category_area.findOne({
      where: { id: id, user_id: userId, is_deleted: false },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!result) {
      return res.status(400).send({
        message: "Category area not found.",
      });
    }
    res.status(200).send({
      message: "Success get category area.",
      data: result,
    });
  } catch (error) {
    console.log("myOneCatArea", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const editMyCatArea = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { newName } = req.body;
    const result = await db.Category_area.findOne({
      where: { id: id, user_id: userId, is_deleted: false },
    });

    if (!result) {
      return res.status(400).send({
        message: "Category area not found.",
      });
    }

    await db.Category_area.update(
      { name: newName },
      { where: { id: id }, transaction }
    );

    await transaction.commit();

    const updatedCatArea = await db.Category_area.findOne({
      where: { id: id, user_id: userId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.status(201).send({
      message: "Success update category area.",
      data: updatedCatArea,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("editcatarea", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const deleteMyPropertyType = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const catArea = await db.Category_area.findOne({
      where: { id: id, user_id: userId, is_deleted: false },
    });

    if (!catArea) {
      return res.status(400).send({
        message: "Category area not found.",
      });
    }

    catArea.is_deleted = true;
    await catArea.save({ transaction });

    await transaction.commit();
    return res.status(200).send({
      message: "Category area successfuly deleted.",
    });
  } catch (error) {
    await transaction.rollback();
    console.log("deletecatarea", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

module.exports = {
  getAllCatArea,
  addCatArea,
  getAllMyCatArea,
  getOneMyCatArea,
  editMyCatArea,
  deleteMyPropertyType,
};
