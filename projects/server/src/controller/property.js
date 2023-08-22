const { dirname } = require("path");
const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");

module.exports = {
  async getAllMyProp(req, res) {
    try {
      const userId = req.user.id;
      const result = await db.Property.findAll({
        where: { user_id: userId, deletedAt: null },
        include: [
          {
            model: db.Location,
            attributes: ["id", "city"],
          },
          {
            model: db.Category_area,
            attributes: ["id", "name"],
          },
          {
            model: db.Property_type,
            attributes: ["id", "name"],
          },
          {
            model: db.Picture,
            attributes: ["id", "property_id", "img"],
          },
        ],
      });
      if (result.length === 0) {
        return res.status(200).send({
          message: "You dont list any property yet",
        });
      }
      res.status(200).send({
        message: "Success get all my property",
        data: result,
      });
    } catch (error) {
      console.log("getall", error);
      res.status(500).send({
        message: "Something wrong on server",
      });
    }
  },

  async getOneMyProp(req, res) {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;

      const result = await db.Property.findOne({
        where: { id: id, user_id: userId, deletedAt: null },
        include: [
          {
            model: db.Location,
            attributes: ["id", "city"],
          },
          {
            model: db.Category_area,
            attributes: ["id", "name"],
          },
          {
            model: db.Property_type,
            attributes: ["id", "name"],
          },
          {
            model: db.Picture,
            attributes: ["id", "property_id", "img"],
          },
        ],
      });

      if (!result) {
        return res.status(200).send({
          message: "Property not found",
        });
      }
      res.status(200).send({
        message: "Success get your property",
        data: result,
      });
    } catch (error) {}
  },

  async addProperty(req, res) {
    try {
      const userId = req.user.id;
      console.log(userId);
      const { name, locationId, propTypeId, catAreaId, description } = req.body;

      const newProperty = await db.Property.create({
        user_id: userId,
        property_type_id: Number(propTypeId),
        location_id: Number(locationId),
        category_area_id: Number(catAreaId),
        name: name,
        description: description,
        is_active: true,
      });

      res.status(200).send({
        message: "Success creating property",
        data: newProperty,
      });
    } catch (error) {
      console.log("addprop", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async addPropPhotos(req, res) {
    try {
      const userId = req.user.id;
      const { propId } = req.body;
      const property = await db.Property.findOne({
        where: { id: propId, user_id: userId },
      });
      if (!property) {
        return res.status(400).send({ message: "No property found" });
      }

      let images = req.files.map((file) => ({
        img: setFromFileNameToDBValue(file.filename),
        property_id: propId,
      }));
      console.log(images);
      const result = await db.Picture.bulkCreate(images);

      res.status(200).send({
        message: "Adding photos to property success",
        data: result,
      });
    } catch (error) {
      console.log("addphotos", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async editProperty(req, res) {
    try {
      const userId = req.user.id;
      const id = Number(req.params.id);
      const { name, locationId, propTypeId, catAreaId, description } = req.body;

      const result = await db.Property.findOne({
        where: { user_id: userId, id: id },
      });
      if (!result) {
        return res.status(400).send({ message: "Property doesnt exist" });
      }

      const editProp = await db.Property.update(
        {
          name: name,
          location_id: locationId,
          property_type_id: propTypeId,
          category_area_id: catAreaId,
          description: description,
        },
        { where: { user_id: userId, id: id } }
      );

      const edited = await db.Property.findOne({
        where: { id: id, user_id: userId },
      });

      res.status(200).send({
        message: "Success update property",
        data: edited,
      });
    } catch (error) {
      console.log("editprop", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async editPropPhotos(req, res) {
    try {
      const propId = req.params.id;
      const imageIds = req.body.imageIds.split(",").map((id) => Number(id));
      console.log("EDITPHOTO", imageIds);

      if (req.files.length !== imageIds.length) {
        return res
          .status(400)
          .send({ message: "Number of images and image IDs mismatch." });
      }

      const updatedImages = [];

      for (let i = 0; i < req.files.length; i++) {
        const imageId = imageIds[i];
        const imageRecord = await db.Picture.findOne({
          where: {
            id: imageId,
            property_id: propId,
          },
        });
        console.log("imageRecord", imageRecord);

        if (!imageRecord) {
          return res.status(400).send({
            message: "Photo not found",
          });
        }

        const oldImage = imageRecord.getDataValue("img");
        // console.log("OLD IMAGE PATH", oldImage);
        const oldImageFile = getFilenameFromDbValue(oldImage);
        // console.log("OLD IMAGE", oldImageFile);
        const coba = getAbsolutePathPublicFile(oldImageFile);
        console.log("COBA", coba);
        imageRecord.img = setFromFileNameToDBValue(req.files[i].filename);

        if (imageRecord) {
          fs.unlinkSync(getAbsolutePathPublicFile(oldImageFile));
        }

        await imageRecord.save();
        updatedImages.push(imageRecord);
      }

      res.status(200).send({
        message: `${updatedImages.length} images updated successfully.`,
        data: updatedImages,
      });
    } catch (error) {
      console.error("bulk-edit-images", error);
      res.status(500).send({
        message: "Something went wrong on the server.",
        error,
      });
    }
  },

  async deleteProperty(req, res) {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;
      const property = await db.Property.findOne({
        where: { id: id, user_id: userId, deletedAt: null },
      });

      if (!property) {
        return res.status(200).send({
          message: "Property not found",
        });
      }

      const deleteNow = await db.Property.destroy({
        where: { id: id, user_id: userId },
      });

      await db.Room.destroy({
        where: { property_id: id },
      });

      res.status(200).send({
        message: "Success delete property",
        deleted: property,
      });
    } catch (error) {
      console.log("deleteprop", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },
};