const { Sequelize } = require("sequelize");
const {
  model: { Goal },
} = require("../models");
const { USER } = require("../util/database");
const { Op } = require("sequelize");
const {
  model: { UserProfile },
} = require("../models");
const {
  model: { Skills },
} = require("../models");
const {
  model: { GoalComponent },
} = require("../models");
const {
  model: { UserDiscard },
} = require("../models");
const db = require("../models");
const {
  model: { User },
} = require("../models");
const { use } = require("../routes/signup");
const goalcomponent = require("../models/goalcomponent");

module.exports = {
  userMatch: async (req, res) => {
    const userId = req.userData.userId;
    // const userId=req.body.userId;
    //const skillset= req.body.goal;
    //console.log("type of userId is ", typeof userId);

    if (userId) {
      const locationFromUserProfile = await UserProfile.findOne({
        where: {
          userUserId: userId,
        },
      });
      //console.log(locationFromUserProfile.location);
      const skillsets = await GoalComponent.findAll({
        where: {
          goalGoalId: {
            [Op.in]: Sequelize.literal(`(
                        SELECT goalId
                        FROM goals 
                        WHERE
                            goals.userUserId = ${userId}
                           
                    )`),
          },
          matchedUserId: {
            [Op.eq]: null,
          },
        },
      });
      console.log(skillsets);
      // if(skillsets){
      //     console.log(skillsets.length)
      // }
      // if(skillsets.length==0)
      //     res.status(200).json({"Status":"No Goals to match"});
      // else{
      let goalComponentCondition = new Map();

      const goaltocomponent = await Goal.findAll({
        where: {
          userUserId: userId,
        },
      });

      let goalMap = new Map();
      for (let i = 0; i < goaltocomponent.length; i++) {
        if (goalMap[goaltocomponent[i].dataValues.goalId] == undefined)
          goalMap[goaltocomponent[i].dataValues.goalId] = [];
        goalMap[goaltocomponent[i].dataValues.goalId].push(
          goaltocomponent[i].dataValues.goal,
          goaltocomponent[i].dataValues.goalId
        );
      }

      //console.log(skillsets);
      const skills = [];
      const skillstemp = [];
      for (let i = 0; i < skillsets.length; i++) {
        skills[i] = "'" + skillsets[i].goalComponent + "'";
        skillstemp[i] = skillsets[i].goalComponent;
        //implement a list of pairs which stores [goalcomponent , locationPreference]
        if (goalComponentCondition[skillsets[i].goalComponent] == undefined) {
          goalComponentCondition[skillsets[i].goalComponent] = [];
        }
        let temp = [];
        temp.push(skillsets[i].locationPreference);
        temp.push(skillsets[i].experienceRequired);
        temp.push(skillsets[i].goalCompoonentId);
        goalComponentCondition[skillsets[i].goalComponent].push(
          // skillsets[i].locationPreference,
          // skillsets[i].experienceRequired,
          // skillsets[i].goalCompoonentId
          temp
        );
      }

      //console.log(goalComponentCondition, "103");

      let goalMapComponent = new Map();
      for (let i = 0; i < skillsets.length; i++) {
        if (goalMapComponent[skillsets[i].goalComponent] == undefined)
          goalMapComponent[skillsets[i].goalComponent] = [];
        goalMapComponent[skillsets[i].goalComponent].push(
          goalMap[skillsets[i].dataValues.goalGoalId]
        );
      }

      // console.log(goalMapComponent);

      const userProfileIds = await Skills.findAll({
        where: {
          skillset: {
            [Op.in]: skillstemp,
          },
          userUserId: {
            [Op.not]: userId,
          },
        },
      });
      var ids = skills.join(",");

      let dict = {};
      //console.log(userProfileIds);
      for (let i = 0; i < userProfileIds.length; i++) {
        if (dict[userProfileIds[i].userprofileUserProfileId] == undefined) {
          dict[userProfileIds[i].userprofileUserProfileId] = [];
        }
        let list = [];
        //let skill=[];
        let skill = { SkillMatched: userProfileIds[i].skillset };
        let goalMatched = {
          goalMatched: goalMapComponent[userProfileIds[i].skillset],
        };
        let experience = { experience: userProfileIds[i].experience };
        let skillSetId = { SkillSetId: userProfileIds[i].skillsetId };
        // list.push(goalMapComponent[userProfileIds[i].skillset]);
        // list.push(userProfileIds[i].experience);

        list.push(skill);
        list.push(goalMatched);
        list.push(experience);
        list.push(skillSetId);
        dict[userProfileIds[i].userprofileUserProfileId].push(
          //   skill,
          //   goalMatched,
          //   experience,
          //   skillSetId
          list
        );
      }

      // console.log(dict, "155");
      const validuserIds = [];
      for (let i = 0; i < userProfileIds.length; i++) {
        validuserIds[i] = userProfileIds[i].userprofileUserProfileId;
      }
      const matchedUser = await UserProfile.findAll({
        where: {
          userProfileId: {
            // [Op.in]: validuserIds
            [Op.in]: Sequelize.literal(`(
                        SELECT userprofileUserProfileId
                        FROM skills 
                        WHERE skills.skillset in  (${ids})           
                    )`),
          },
          // bind:{skills},
          userUserId: {
            [Op.not]: userId,
          },
        },
      });
      // console.log(matchedUser);
      //find the discarded skillsetId

      const userdiscards = await UserDiscard.findAll({
        where: {
          userUserId: userId,
        },
      });
      //console.log(userdiscards);
      const setOfDiscards = new Set();
      for (let i = 0; i < userdiscards.length; i++) {
        let temp =
          userdiscards[i].goalGoalId +
          "" +
          userdiscards[i].skillSkillsetId +
          "" +
          userdiscards[i].discardUserId;
        setOfDiscards.add(temp);
      }

      let matchedData = [];
      let discardedData = [];
      let user = "user";
      for (let i = 0; i < matchedUser.length; i++) {
        for (
          let index = 0;
          index < dict[matchedUser[i].dataValues.userProfileId].length;
          index++
        ) {
          let temp = [];
          temp = {
            user: matchedUser[i].dataValues,
            // skillset: dict[matchedUser[i].dataValues.userProfileId][index],
          };

          let new_temp = temp["user"];
          let size =
            dict[matchedUser[i].dataValues.userProfileId][index][1][
              "goalMatched"
            ].length;
          console.log(size, "217");
          for (let goalmatch = 0; goalmatch < size; goalmatch++) {
            //console.log(temp.user);
            temp = { user: new_temp };
            let new_List = [];
            let first_skill =
              dict[matchedUser[i].dataValues.userProfileId][index][0];
            let second_goal = {
              goalMatched:
                dict[matchedUser[i].dataValues.userProfileId][index][1][
                  "goalMatched"
                ][goalmatch],
            };
            console.log(second_goal, "227");
            let third_exp =
              dict[matchedUser[i].dataValues.userProfileId][index][2];
            let four_skillset =
              dict[matchedUser[i].dataValues.userProfileId][index][3];

            new_List.push(first_skill);
            new_List.push(second_goal);
            new_List.push(third_exp);
            new_List.push(four_skillset);

            temp["skillset"] = new_List;
            console.log(temp.skillset, "238");
            let skill = temp.skillset[0]["SkillMatched"];
            //console.log(skill);
            let mapSkill = goalComponentCondition[skill];

            // console.log(temp.user.firstName, " ", mapSkill, "201");
            // temp["goalCompoonentId"] = mapSkill[2];

            //console.log(temp.skillset[1]['goalMatched'][1]);
            let isDiscard =
              temp.skillset[1]["goalMatched"][1] +
              "" +
              temp.skillset[3]["SkillSetId"] +
              "" +
              temp.user.userUserId;
            //console.log(isDiscard);
            if (!setOfDiscards.has(isDiscard)) {
              //console.log(mapSkill[1], " ", temp.skillset[2]["experience"]);
              for (let ij = 0; ij < mapSkill.length; ij++) {
                temp["goalCompoonentId"] = mapSkill[ij][2];
                if (
                  mapSkill[ij][1] != null &&
                  mapSkill[ij][1] == temp.skillset[2]["experience"]
                ) {
                  //console.log(isDiscard, "isDicard");
                  if (
                    mapSkill[ij][0] == 1 &&
                    temp.user.location == locationFromUserProfile.location
                  ) {
                    console.log(
                      temp,
                      " ",
                      temp.skillset[1]["goalMatched"],
                      " ",
                      temp.user.firstName,
                      "242"
                    );
                    matchedData.push(temp);
                  } else if (mapSkill[ij][0] == 0) {
                    console.log(temp.user.firstName, "246");
                    matchedData.push(temp);
                  }
                } else if (
                  mapSkill[ij][1] == null &&
                  mapSkill[ij][0] != null &&
                  mapSkill[ij][0] != 1
                ) {
                  console.log(temp.user.firstName, "254");
                  matchedData.push(temp);
                } else if (
                  mapSkill[ij][1] == null &&
                  mapSkill[ij][0] == 1 &&
                  temp.user.location == locationFromUserProfile.location
                ) {
                  console.log(temp.user.firstName, "262");
                  matchedData.push(temp);
                }
              }
            } else {
              discardedData.push(temp);
            }
          }
        }
      }

      //console.log(matchedData);
      res
        .status(200)
        .json({ matchedData: matchedData, dicardedData: discardedData });
    } else {
      res.status(400).json({ status: "wrong user" });
    }
  },
};
