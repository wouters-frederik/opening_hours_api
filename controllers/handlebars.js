var register = function(Handlebars) {
    var helpers = {
        inc: function(value, options) {
            return parseInt(value) + 1;
        },
        isSelected: function(p1, p2) {
            return parseInt(p1) === parseInt(p2) ? 'selected' : '';
        },
        formatTime: function(p1, format) {
            return p1.toString(format);
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);