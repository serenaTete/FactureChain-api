import {create, assign, meters, unassign} from "../controllers/meter.controller.js";

const router= express.Router();

router.post("/", create);
router.post("/assign", assign);

router.get("/:adress", meters);

router.post("/unassign", unassign);

export default router;