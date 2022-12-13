import {Router as router} from 'express';
const customRouter = router();

customRouter.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

export default customRouter;
