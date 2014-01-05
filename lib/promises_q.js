
var q = require('q');


var extend = require('raptor-util').extend;

extend(require('./promises'), {
    defer: function() {
        return q.defer();
    },

    all: function(array) {
        return q.all(array || []);
    },

    enableLongStacks: function() {
        global.raptorPromisesLongStacks = true; // We make this a global so that it applies to all Q modules
        q.longStackSupport = true;
    }
});

if (global.raptorPromisesLongStacks) {
    q.longStackSupport = true;
}