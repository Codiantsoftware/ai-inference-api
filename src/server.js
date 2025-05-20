/**
 * @fileoverview Server entry point
 * @requires ./app
 * @requires ./config
 */

const app = require('./app');
const config = require('./config');
const { logger } = require('./utils');

const PORT = config.server.port;

app.listen(PORT, () => {
  logger.info(`Server running in ${config.server.env} mode on port ${PORT}`);
}); 