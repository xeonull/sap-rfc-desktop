import { container } from "./container.config.js";
import { TOKENS } from "./types.js";
// import { IRFCService } from "@/types/Service.interface";

export const NodeRFCWebService = container.get(TOKENS.RFC_SERVICE);