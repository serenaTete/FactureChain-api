import {create, assign, meters, unassign} from "../controllers/meter.controller.js";
import {authMiddleware} from "../middlewares/auth.js";
import {roleMiddleware} from "../middlewares/role.middleware.js";

const router= express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
     create);
router.post(
    "/assign",
    authMiddleware,
    roleMiddleware("admin"),
     assign);

router.get("/:address",
    authMiddleware,
    meters);

router.post("/unassign",
            authMiddleware,
            roleMiddleWare("admin"),
           unassign);

export default router;