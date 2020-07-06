"use strict";
exports.__esModule = true;
exports.removeExt = exports.addTs = exports.isLocal = void 0;
exports.isLocal = function (module) { return module.match(/^(\/|\.\/|\.\.\/)/); };
exports.addTs = function (module) { return module + ".ts"; };
exports.removeExt = function (mod) {
    var m = mod.split('.');
    m.pop();
    return m.join('.');
};
var cleanExt = function (ext) { return ext.match(/^\./) ? ext : "." + ext; };
var cleanExts = function (exts) { return (Array.isArray(exts) ? exts : [exts]).map(cleanExt); };
var hasExt = function (mod, exts) {
    var m = mod.split('.');
    var last = m[m.length - 1];
    var addDot = "." + last;
    return (exts.indexOf(addDot) !== -1);
};
function plugin(babel, options) {
    var e = (options === null || options === void 0 ? void 0 : options.extensions) ? cleanExts(options.extensions) : ['.ts', '.js'];
    return {
        visitor: {
            ImportDeclaration: function (path) {
                var p = path.node.source.value;
                if (exports.isLocal(p) && hasExt(p, e)) {
                    path.node.source.value = exports.removeExt(path.node.source.value);
                }
            }
        }
    };
}
exports["default"] = plugin;
