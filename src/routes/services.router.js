import { Router } from "express";
import {validateBody} from "../middlewares/validate.js"
import {createServiceSchema, updateServiceSchema} from "../validations/service.validation.js"
import {
  getServices,
  getServicesById,
  createService,
  updateService,
  deleteService
} from "../controllers/services.controller.js"

const router = Router();

router.get("/", getServices);

router.get("/:sid", getServicesById);

router.post("/", validateBody(createServiceSchema), createService);

router.put("/:sid", validateBody(updateServiceSchema) , updateService);

router.delete("/:sid", deleteService);

export default router;
