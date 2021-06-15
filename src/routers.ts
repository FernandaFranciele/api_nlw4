import { Router} from 'express';
import { Usercontroller } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendEmailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router();

const userController = new Usercontroller();
const surveysController = new SurveyController();
const sendMailController = new SendEmailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post('/sendEmail', sendMailController.execute);

router.get('/answers/:value', answerController.execute);

router.get('/nps/:survey_id', npsController.execute);



export {router}