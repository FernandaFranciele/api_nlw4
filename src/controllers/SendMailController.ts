import { Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';
import {resolve} from 'path';
import { AppError } from '../errors/AppError';
 
class SendEmailController{

    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;
                
        const usersRepository = getCustomRepository(UsersRepository);        
        const surveyRepository = getCustomRepository(SurveysRepository);        
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
               
        const user = await usersRepository.findOne({email});

        if(!user){
            throw new AppError('User does not exist!');           
        }

        const survey = await surveyRepository.findOne({id: survey_id});

        if(!survey){
            throw new AppError('Survey does not exist!');             
        }

        //salva as inf. na tab surveys
        const surveyUser = await surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        })

        const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"]           
        });

        const variabbles = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }
        
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
               
        if(surveyUserAlreadyExist){
            variabbles.id = surveyUserAlreadyExist.id;            
           SendMailService.execute(email, survey.title,variabbles, npsPath);           
           return response.json(surveyUserAlreadyExist);
        }
     
        await surveysUsersRepository.save(surveyUser);
        variabbles.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variabbles, npsPath);

        return response.json(surveyUser);
// cfd8b47e-4253-43ed-b779-2c5c94489dda
    }
  
}
export {SendEmailController}