import chalk from 'chalk';

const { log } = console;

log(chalk`\n{blue ▲}{cyan {bold ⑊}} {blue {inverse  info }}`);
log(chalk`\n{blue ▲}{cyan {bold ⑊}} {red {inverse  error }}`);
log(chalk`\n{blue ▲}{cyan {bold ⑊}} {yellow {inverse  warn }}`);
