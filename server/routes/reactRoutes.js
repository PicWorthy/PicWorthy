
/*
 * Routes must be added here so that the server
 * serves up the REact app when these routes are visited
 *
 * Alternatively, one could do a app.get('*',  express.static(`${__dirname}/../client/dist`))
 * after the app.use(reactrouter) so that any get request not handled by the router sends back
 * the react app.
 *
 */


const reactRoutes = [
  '/',
  'trending',
  '/locations',
  '/upload',
  '/userpage',
  '/likes',
  '/superAwesomeLandingPage',
  '/friendpage/*'
];


module.exports = reactRoutes;
