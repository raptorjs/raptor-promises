var extend = require('raptor-util').extend;
var _global = typeof global === 'undefined' ? window : global;
var impl;

function getImpl() {

    return impl || (impl = require(exports.defaultImpl));
}

extend(exports, {
    defaultImpl: 'q',

    defer: function() {
        return getImpl().defer();
    },

    all: function(array) {
        return getImpl().all(array || []);
    },

    enableLongStacks: function() {
        _global.raptorPromisesLongStacks = true; // We make this a global so that it applies to all Q modules
        getImpl().longStackSupport = true;
    },

    resolved: function() {
        var impl = getImpl();
        return impl.apply(impl, arguments);
    },

    toString: function () {
        return '[raptor-promises ' + __filename + ']';
    }
});

if (_global.raptorPromisesLongStacks) {
    exports.enableLongStacks();
}