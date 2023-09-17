const db = require("../models");

const review = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
    const { booking_id } = req.params;
    const { comment } = req.body;
    const checkReview = await db.Review.findOne({
      where: {
        booking_id: booking_id,
      },
      include: [
        {
          model: db.Booking,
          where: {
            user_id: user_id,
          },
        },
      ],
    });
    if (checkReview) {
      const updateReview = await db.Review.update(
        {
          comment: comment,
        },
        {
          where: {
            booking_id: booking_id,
          },
        }
      );
      if (updateReview) {
        return res.send({
          status: true,
          message: "Review Has Sent",
        });
      } else {
        return res.send({
          status: false,
          message: "Sending Review Failed",
        });
      }
    } else {
      const giveReview = await db.Review.create({
        booking_id: booking_id,
        comment: comment,
      });
      if (giveReview) {
        return res.send({
          status: true,
          message: "Review Has Sent",
        });
      } else {
        return res.send({
          status: false,
          message: "Sending Review Failed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const getReview = async (req, res) => {
  try {
    const { property_id } = req.params;
    const reviews = await db.Review.findAll({
      include: [
        {
          model: db.Booking,
          include: [
            {
              model: db.User,
              include: [
                {
                  model: db.Profile,
                },
              ],
            },
            {
              model: db.Room,
              include: [
                {
                  model: db.Property,
                  where: {
                    id: property_id,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    return res.send({
      status: true,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

module.exports = {
  review,
  getReview,
};
