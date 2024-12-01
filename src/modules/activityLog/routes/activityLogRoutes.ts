import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { getActivityLogsSchema } from "../schema/activityLog.schema";
import { getActivityLogsHandler } from "../controller/activityLog.controller";

const router = Router();

router.get(
    "/activity-logs/:entityId",
    validate(getActivityLogsSchema),
    getActivityLogsHandler
);

export default router;