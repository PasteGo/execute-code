(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(root);
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.Clipboard = factory(root);
    }
}) (typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    if (typeof define === "function" && define.amd){
        root = window;
    }

    function encodeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function setCodeResult(output, result, isHtml, isError) {
        var $r = output;
        $r.removeClass('output-alert-danger');
        if (isError) {
            $r.addClass('output-alert-danger');
        }
        if (isHtml) {
            $r.html(result);
        } else {
            var ss = result.split('\n');
            var htm = _.map(ss, function (s) {
                return encodeHtml(s).replace(/ /g, '&nbsp;');
            }).join('<br>');
            $r.html(htm);
        }
    }

    function showCodeResult(output, result, isHtml) {
        setCodeResult(output, result, isHtml);
    }

    function showCodeError(output, result, isHtml) {
        setCodeResult(output, result, isHtml, true);
    }

    function execute_javascript(code, output) {
        (function () {
            var
                buffer = '',
                _log = function (s) {
                    console.log(s);
                    buffer = buffer + s + '\n';
                },
                _warn = function (s) {
                    console.warn(s);
                    buffer = buffer + s + '\n';
                },
                _error = function (s) {
                    console.error(s);
                    buffer = buffer + s + '\n';
                },
                _console = {
                    trace: _log,
                    debug: _log,
                    log: _log,
                    info: _log,
                    warn: _warn,
                    error: _error
                };
            try {
                eval('(function() {\n var console = _console; \n' + code + '\n})();');
                if (!buffer) {
                    buffer = '(no output)';
                }
                showCodeResult(output, buffer);
            } catch (e) {
                buffer = buffer + String(e);
                showCodeError(output, buffer);
            }
        })();
    }
    
    return {
        execute_javascript: execute_javascript
    };
});



