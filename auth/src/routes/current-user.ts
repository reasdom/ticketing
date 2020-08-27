import express from "express";

import { currentUser } from "@lcmtickets/common";
// import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

// requireAuth
router.get("/api/users/currentuser", currentUser, (req, res) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRoute };
