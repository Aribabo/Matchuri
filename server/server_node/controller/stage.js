import * as stageRepository from '../data/stage.js';
import { config } from '../config.js';

// 스테이지 정보 출력
export async function stageInfo(req, res) {
    try{
        const stages = await stageRepository.findAll()
        if(stages){
            return res.status(201).json(stages)
        }
    }catch(error){
        console.log(error);
    }
}

// 스테이지 정보 한개 출력
export async function stageOne(req, res) {
    const {N} = req.body
    try{
        const stage = await stageRepository.findByN(N)
        if(stage){
            return res.status(201).json(stage)
        }
    }catch(error){
        console.log(error);
    }
}