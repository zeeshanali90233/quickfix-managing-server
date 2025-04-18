import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
});
