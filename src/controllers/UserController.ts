import { request, Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UserRepository';
import * as yup from 'yup';

class UserController {
  async create(request: Request, res: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Nome obrigatório'),
      email: yup.string().email().required('Email incorreto')
    })
    
    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch(err) {
      return res.status(400).json({ error: err });
    }

    const usersRepository = getCustomRepository(UsersRepository)

    const userAlreadyExists = await usersRepository.findOne({
      email
    })

    if(userAlreadyExists) {
      return res.status(400).json({
        error: "User already exists!"
      })
    }

    const user = usersRepository.create({
      name, email
    })
    
    await usersRepository.save(user);
    return res.status(201).json(user);
  }

  async show(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository)

    const all = await usersRepository.find();

    return response.json(all);
  }
}

export { UserController };
