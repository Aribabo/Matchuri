import express from "express";
import * as stageController from '../controller/stage.js'

const router = express.Router();

// 스테이지 전체 출력
router.get('/all', stageController.stageInfo);
router.post('/one', stageController.stageOne);

export default router;