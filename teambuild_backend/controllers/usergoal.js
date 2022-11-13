const {
  model: { Goal, GoalComponent },
} = require("../models");
const goalcomponent = require("../models/goalcomponent");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
  truncate: async (req, res) => {
    const goalId = req.body.goalId;
    if (goalId) {
      Goal.destroy({
        where: {
          goalId: goalId,
        },
      })
        // .then(() => {
        //   Goal.destroy({
        //     where: {
        //       goalId: goalId,
        //     },
        //   }).then((response) => {
        //     return response;
        //   });
        // })
        .then(() => {
          res.status(200).json({
            status: "goal deleted",
          });
        });
    } else {
      res.status(400).json({
        status: "Invalid Goal",
      });
    }
  },

  goalcomponentmatch: async (req, res) => {
    const userId = req.userData.userId;
    // const userId = req.body.userId;
    if (userId) {
      const matchedUserId = req.body.matchedUserId;
      const goalComponentId = req.body.goalComponentId;
      GoalComponent.update(
        {
          matchedUserId,
        },
        {
          where: {
            goalComponentId: goalComponentId,
          },
        }
      ).then((response) => {
        res.status(200).json({ status: "Goal Matched updated" });
      });
    } else {
      res.status(400).json({ status: "Wrong userId" });
    }
  },

  goalcomponentmatchremoval: async (req, res) => {
    const userId = req.userData.userId;
    // const userId = req.body.userId;
    if (userId) {
      //   const matchedUserId = req.body.matchedUserId;
      const goalComponentId = req.body.goalComponentId;
      GoalComponent.update(
        {
          matchedUserId: null,
        },
        {
          where: {
            goalComponentId: goalComponentId,
          },
        }
      ).then((response) => {
        res.status(200).json({ status: "Goal Matched removed" });
      });
    } else {
      res.status(400).json({ status: "Wrong userId" });
    }
  },
};
