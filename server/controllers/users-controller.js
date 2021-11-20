import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";

import HttpError from "./../modals/http-error.js";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Youssif Hany",
    email: "test@test.com",
    password: "testtest1",
  },
  {
    id: "u2",
    name: "Jack Dorsi",
    email: "test@test.com",
    password: "testtest2",
  },
  {
    id: "u3",
    name: "Rose Michel",
    email: "test@test.compg",
    password: "testtest3",
  },
];

export const getAllUsers = (req, res) => {
  res.json({ users: DUMMY_USERS });
};
export const signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invaild inputs passed, please check your data.", 422);
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => user.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email already exists", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const identifterUser = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!identifterUser) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      401
    );
  }

  res.json({ message: "Logged in!" });
};
