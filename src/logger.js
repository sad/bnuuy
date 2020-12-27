/* eslint-disable no-console */
const chalk = require('chalk');

module.exports = {
  chalk() {
    return chalk;
  },

  prefix(char = '*') {
    return chalk.bold.cyan(`[${char}]`);
  },

  log(msg, pre = this.prefix('i')) {
    console.log(`${chalk.gray(+new Date())} ${pre} ${msg}`);
  },

  success(msg, pre = this.prefix()) {
    console.log(`${chalk.gray(+new Date())} ${pre} ${chalk.green(msg)}`);
  },

  error(msg, pre = this.prefix('!')) {
    console.log(`${chalk.gray(+new Date())} ${pre} ${chalk.bold.red(msg)}`);
  },
};
