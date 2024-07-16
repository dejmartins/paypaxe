import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { createUserSessionHandler, getUserSessionsHandler } from "../controller/session.controller";
import { createSessionSchema } from "../schema/session.schema";
import requireUser from "../../../shared/middlewares/requireUser";

const router = Router();

router.post('/sessions', validate(createSessionSchema), createUserSessionHandler);
router.get('/sessions', requireUser, getUserSessionsHandler);

export default router;