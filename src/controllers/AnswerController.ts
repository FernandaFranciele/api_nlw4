import {Response, Request} from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class AnswerController{
    // http://localhost:3333/answers/2?u=515bc3ce-992f-4eb6-bbbe-d2ac8ff09e1d
    async execute(request: Request, response: Response){
        console.log(request.params);
        const { value } = request.params;
        const { u } = request.query;
       
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)            
        });
        
        if(!surveyUser){
            throw new AppError('Survey User does not exists!');           
        }

        surveyUser.value = Number(value);
        await surveysUsersRepository.save(surveyUser);
        return response.json(surveyUser);
    }
}

export { AnswerController }

