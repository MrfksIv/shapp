"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SnackBar = (function () {
    function SnackBar() {
        this._snackbar = null;
        this._isDismissedManual = false;
    }
    SnackBar.prototype.simple = function (snackText) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var timeout = 3;
            try {
                _this._snackbar = SSSnackbar.snackbarWithMessageActionTextDurationActionBlockDismissalBlock(snackText, null, timeout, function (args) {
                    _this._snackbar.dismiss();
                    resolve({
                        command: "Dismiss",
                        reason: "Manual",
                        event: args
                    });
                }, function (args) {
                    resolve({
                        command: "Dismiss",
                        reason: "Timeout",
                        event: args
                    });
                });
                _this._snackbar.show();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    SnackBar.prototype.action = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!options.hideDelay)
                    options.hideDelay = 3000;
                _this._snackbar = SSSnackbar.snackbarWithMessageActionTextDurationActionBlockDismissalBlock(options.snackText, options.actionText, options.hideDelay / 1000, function (args) {
                    resolve({
                        command: "Action",
                        event: args
                    });
                }, function (args) {
                    var reason = _this._isDismissedManual ? "Manual" : "Timeout";
                    _this._isDismissedManual = false;
                    resolve({
                        command: "Dismiss",
                        reason: reason,
                        event: args
                    });
                });
                _this._snackbar.show();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    SnackBar.prototype.dismiss = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._snackbar !== null && _this._snackbar != "undefined") {
                try {
                    _this._isDismissedManual = true;
                    _this._snackbar.dismiss();
                    setTimeout(function () {
                        resolve({
                            action: "Dismiss",
                            reason: "Manual"
                        });
                    }, 200);
                }
                catch (ex) {
                    reject(ex);
                }
            }
            else {
                resolve({
                    action: "None",
                    message: "No actionbar to dismiss"
                });
            }
        });
    };
    return SnackBar;
}());
exports.SnackBar = SnackBar;
//# sourceMappingURL=snackbar.js.map