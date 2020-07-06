"use strict";
exports.__esModule = true;
var isLocal = function (module) { return module.match(/^(\/|\.\/|\.\.\/)/); };
var addTs = function (module, ext) { return "" + module + cleanExt(ext); };
var cleanExt = function (ext) { return ext.match(/^\./) ? ext : "." + ext; };
var cleanExts = function (exts) { return (Array.isArray(exts) ? exts : [exts]).map(cleanExt); };
var hasExt = function (mod, exts) {
    var m = mod.split('.');
    var last = m[m.length - 1];
    var addDot = "." + last;
    return (exts.indexOf(addDot) !== -1);
};
function plugin(babel, options) {
    var exts = (options === null || options === void 0 ? void 0 : options.extensions) ? cleanExts(options.extensions) : ['.ts', '.js'];
    var ext = (options === null || options === void 0 ? void 0 : options.extension) ? cleanExt(options.extension) : '.ts';
    return {
        visitor: {
            ImportDeclaration: function (path) {
                var p = path.node.source.value;
                if (isLocal(p) && !hasExt(p, exts)) {
                    path.node.source.value = addTs(path.node.source.value, ext);
                }
            }
        }
    };
}
exports["default"] = plugin;
