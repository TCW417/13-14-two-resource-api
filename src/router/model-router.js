import { Router } from 'express';
import HttpErrors from 'http-errors';
import modelFinder from '../lib/middleware/model-middleware';
import logger from '../lib/logger';

const modelRouter = new Router();

modelRouter.param('model', modelFinder);

modelRouter.post('/api/read/:model', (request, response, next) => {
  const Model = request.model;
  Model.init()
    .then(() => {
      logger.log(logger.INFO, `MODEL-ROUTER, BEFORE SAVING A NEW ${request.params.model}: ${JSON.stringify(request.body)}`);
      return new Model(request.body).save();
    })
    .then((newResource) => {
      logger.log(logger.INFO, `MODEL-ROUTER AFTER SAVING A NEW ${request.params.model}: ${JSON.stringify(newResource)}`);
      return response.status(201).json(newResource);
    })
    .catch(next);
});

modelRouter.get('/api/read/:model', (request, response, next) => {
  const Model = request.model;
  Model.init()
    .then(() => {
      return Model.find();
    })
    .then((foundModel) => {
  //     console.log('>>>>> GET foundModel obj');
  // console.log(JSON.stringify(foundModel, null, 2));
  // console.log('>>>>>>>>>> DONE >>>>>>>>>');
      logger.log(logger.INFO, `MODEL-ROUTER: RETURNING ALL FROM ${request.params.model}`);
      return response.status(200).json(foundModel);
    })
    .catch(next);
});

modelRouter.get('/api/read/:model/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, `No ${request.model} id entered`));
  }
  const Model = request.model;
  Model.init()
    .then(() => {
      return Model.findOne({ _id: request.params.id });
    })
    .then((foundModel) => {
      logger.log(logger.INFO, `MODEL-ROUTER: FOUND THE MODEL ${JSON.stringify(foundModel)}`);
      return response.status(200).json(foundModel);
    })
    .catch(next);
  return undefined;
});

modelRouter.put('/api/read/:model/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, `No ${request.model} id entered`));
  }
  const Model = request.model;
  Model.init()
    .then(() => {
      return Model.findOneAndUpdate({ _id: request.body._id }, request.body);
    })
    .then((foundModel) => {
      logger.log(logger.INFO, `MODEL-ROUTER: FOUND THE MODEL ${JSON.stringify(foundModel)}`);
      return response.json(foundModel);
    })
    .catch(next);
  return undefined;
});

modelRouter.delete('/api/read/:model/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, `No ${request.model} id entered`));
  }
  let routeComplete = false;
  if (request.params.id === '__DELETE') {
    routeComplete = true;
    const Model = request.model;
    Model.init()
      .then(() => {
        return Model.remove();
      })
      .then(() => {
        return response.sendStatus(200);
      })
      .catch((err) => {
        return next(err);
      });
  }
  if (!routeComplete) {
    const Model = request.model;
    Model.init()
      .then(() => {
        return Model.findById(request.params.id);
      })
      .then((resource) => {
        if (!resource) { // findBy return null --> book not found 
          return next(new HttpErrors(404, `Attempt to delete non-existant ${request.model}`));
        }
        return resource.remove();
      })
      .then(() => {
        return response.sendStatus(200);
      })
      .catch(next);
  }
  return undefined;
});

export default modelRouter;
