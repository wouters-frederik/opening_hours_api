var register = function(Handlebars) {
    var helpers = {
        inc: function(value, options) {
            return parseInt(value) + 1;
        },
        isSelected: function(p1, p2) {
            return parseInt(p1) === parseInt(p2) ? 'selected' : '';
        },
        isChecked: function(p1) {
            return (p1 == 'true' || p1 == 1 || p1 == true) ? 'checked' : '';
        },
        compareEntityChannel: function(e1, e2, c1,c2) {
            return (parseInt(e1) === parseInt(e2) && parseInt(c1) === parseInt(c2)) ? 'selected' : '';
        },
        formatTime: function(p1, format) {
            return p1.toString(format);
        },
        toJSON : function(object) {
            return JSON.stringify(object);
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