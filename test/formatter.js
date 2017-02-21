module.exports = function js (head, lines) {
    return '### ' + head + '\n```js\n' +
        lines.join('\n') +
    '\n```\nTest cases as below';
}
