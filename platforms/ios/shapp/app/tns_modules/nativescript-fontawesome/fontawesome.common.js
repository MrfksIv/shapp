"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var nativescript_fonticon_1 = require("nativescript-fonticon");
var Common = (function () {
    function Common() {
    }
    Common.init = function () {
        try {
            var resources = application.getResources();
            if (typeof resources['fontawesome'] === 'undefined') {
                nativescript_fonticon_1.TNSFontIcon.debug = false;
                nativescript_fonticon_1.TNSFontIcon.paths = {
                    'fa': 'tns_modules/nativescript-fontawesome/font-awesome.css'
                };
                nativescript_fonticon_1.TNSFontIcon.loadCss();
                resources['fontawesome'] = nativescript_fonticon_1.fonticon;
            }
            application.setResources(resources);
        }
        catch (e) {
            console.log(e);
        }
    };
    return Common;
}());
exports.Common = Common;
//# sourceMappingURL=fontawesome.common.js.map