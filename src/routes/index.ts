import { Router } from "express";


const router = Router();

router.use(`/v1`, (req: any, res: any) => {
  return res.send("v1 api is not available yet!");
});

export default router;
