var extend = require('raptor-util').extend;
var tryRequire = require('raptor-util').tryRequire;

extend(exports, {
    isPromise: function(promise) {
        return promise != null && typeof promise.then === 'function';
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
        
        if (!exports.isPromise(p)) {
            var promises = tryRequire('../../');
            if (promises) {
                p = promises.resolved(p);    
            }
        }

        return p.then(resolvedCallback, rejectedCallback);
    }
});