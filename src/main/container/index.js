import { container } from "./container.config.js";
import { TOKENS } from "./types.js";

export const rfcWebService = container.get(TOKENS.RFC_SERVICE);