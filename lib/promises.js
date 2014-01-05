
var resolvedPromise = null;
var extend = require('raptor-util').extend;

extend(exports, {
    isPromise: function(promise) {
        return promise != null && typeof promise.then === 'function';
    },

    resolved: function() {
        if (!resolvedPromise) {
            var deferred = this.defer();
            deferred.resolve();
            resolvedPromise = deferred.promise;
        }
        return resolvedPromise;
    },

    makePromise: function(val) {
        if (this.isPromise(val)) {
            return val;
        }
        else {
            var deferred = this.defer();
            deferred.resolve(val);    
            return deferred.promise;
        }
    },

    valueOfPromise: function(p) {
        if (p && typeof p.inspect === 'function') {
            var inspected = p.inspect();
            if (inspected.state === 'fulfilled') {
                return inspected.value;
            }
            else {
                return undefined;
            }
        }
        else {
            return p;
        }
    },

    immediateThen: function(p, resolvedCallback, rejectedCallback) {
        var result;

        if (p && typeof p.inspect === 'function') {
            var inspected = p.inspect();
            if (inspected.state === 'fulfilled') {
                result = resolvedCallback(inspected.value);
                return this.makePromise(result); // Make sure it is a promise
            }
            else if (inspected.state === 'rejected') {
                result = rejectedCallback(inspected.reason);
                return this.makePromise(result); // Make sure it is a promise
            }
        }

        // Fall-through for the pending state or lack of "inspect"
        return this.makePromise(p)
            .then(resolvedCallback, rejectedCallback);
    },

    toString: function () {
        return '[raptor-promises]';
    },

    enableLongStacks: function() {
        // no-op
    }
});

require('./promises_q');