const path = require('path');

const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialDir: path.resolve('./helper'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./helper'),
    extName: '.handlebars',
};

module.exports = handlebarOptions;