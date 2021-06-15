import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class Usercontroller{
    async create(request: Request, response: Response){
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
        });

        // if(!(await schema.isValid(request.body))){
        //     return response.status(400).json({error: "Validation falied!"});
        // }

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (erro) {
            throw new AppError(erro);             
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userExist = await usersRepository.findOne({
            email
        });

        if(userExist){
            throw new AppError('User already exists!'); 
        }
               
        const user = usersRepository.create({
            name, email        
        })

        await usersRepository.save(user);
        response.status(201).json(user);
    }
}

export { Usercontroller };
