import { Router } from 'express';
import prisma from '../database/db';

const notificationsRouter = Router();

notificationsRouter.get('/', async (req, res) => {
  await  prisma.notifications.findMany()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });

});

export default notificationsRouter;
