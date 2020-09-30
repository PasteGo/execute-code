(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(root);
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.execute = factory(root);
    }
}(typeof global !== 'undefined' ? global : this.window || this.global, (root) => {
    if (typeof define === 'function' && define.amd) {
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
        const $r = output;
        $r.removeClass('output-alert-danger');
        if (isError) {
            $r.addClass('output-alert-danger');
        }
        if (isHtml) {
            $r.html(result);
        } else {
            const htm = result.split('\n').map((s) => encodeHtml(s).replace(/ /g, '&nbsp;')).join('<br>');
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
            let buffer = '';
            const _log = function (s) {
                console.log(s);
                buffer = `${buffer + s}\n`;
            };
            const _warn = function (s) {
                console.warn(s);
                buffer = `${buffer + s}\n`;
            };
            const _error = function (s) {
                console.error(s);
                buffer = `${buffer + s}\n`;
            };
            const _console = {
                trace: _log,
                debug: _log,
                log: _log,
                info: _log,
                warn: _warn,
                error: _error,
            };
            try {
                eval(`(function() {\n var console = _console; \n${code}\n})();`);
                if (!buffer) {
                    buffer = '(no output)';
                }
                showCodeResult(output, buffer);
            } catch (e) {
                buffer += String(e);
                showCodeError(output, buffer);
            }
        }());
    }

    return {
        javascript: execute_javascript,
    };
}));
