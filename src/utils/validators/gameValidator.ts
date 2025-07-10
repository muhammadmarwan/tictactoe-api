import { body, param } from "express-validator";

export const startGameValidator = [
  body("startPlayer")
    .notEmpty()
    .withMessage("startPlayer is required.")
    .isIn(["user", "computer"])
    .withMessage("startPlayer must be either 'user' or 'computer'."),
];

export const makeMoveValidator = [
  body("gameSessionId")
    .notEmpty()
    .withMessage("gameSessionId is required."),
  body("moveRow")
    .notEmpty()
    .withMessage("moveRow is required.")
    .isInt({ min: 0, max: 2 })
    .withMessage("moveRow must be an integer between 0 and 2."),
  body("moveCol")
    .notEmpty()
    .withMessage("moveCol is required.")
    .isInt({ min: 0, max: 2 })
    .withMessage("moveCol must be an integer between 0 and 2."),
  body("turn")
    .notEmpty()
    .withMessage("turn is required.")
    .isIn(["user", "computer"])
    .withMessage("turn must be either 'user' or 'computer'."),
];

export const getGameStateValidator = [
  param("gameSessionId")
    .notEmpty()
    .withMessage("gameSessionId parameter is required."),
];
