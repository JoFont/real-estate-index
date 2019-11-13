const ora = require('ora');
const chalk = require("chalk");

let task;


exports.startTask = (msg, data) => {
    if(data) {
        task = ora({
            text: `${chalk.cyan(msg)} ${chalk.cyan.bold(data)}`,
            hideCursor: false
        }).start();
    } else {
        task = ora(chalk.cyan(msg)).start();
    }
    
}

exports.taskSuccess = (msg, data, msgPrefix) => {
    task.frame();
    task.stopAndPersist({
        symbol: '✔️ ',
        text: `${chalk.green(msg)} ${chalk.green.bold(data)}`,
        prefixText: `${chalk.yellow(msgPrefix ? msgPrefix : "")}`,
    });
}

exports.taskFailed = (msg) => {
    task.stopAndPersist({
        symbol: '❌ ',
        text: msg,
    });
}