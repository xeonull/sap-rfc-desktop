import { container } from "./container.config.js";
import { TYPES } from "./types.js";
// import { IRFCService } from "@/types/Service.interface";

export const NodeRFCWebService = container.resolve(TYPES.RFC_SERVICE);
