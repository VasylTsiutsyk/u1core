import templateConfig from '../template.config.js';
import logger from './logger.js';

global.coffeeInterval;

export default function coffeeTime() {
  if (!global.coffeeInterval) {
    global.coffeeInterval = setInterval(() => {
      logger(templateConfig.coffee.text);
    }, templateConfig.coffee.interval * 60000);
  }
}
