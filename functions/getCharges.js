!(function(e, t) {
    for (var r in t) e[r] = t[r];
})(
    exports,
    (function(e) {
        var t = {};
        function r(s) {
            if (t[s]) return t[s].exports;
            var n = (t[s] = { i: s, l: !1, exports: {} });
            return e[s].call(n.exports, n, n.exports, r), (n.l = !0), n.exports;
        }
        return (
            (r.m = e),
            (r.c = t),
            (r.d = function(e, t, s) {
                r.o(e, t) ||
                    Object.defineProperty(e, t, { enumerable: !0, get: s });
            }),
            (r.r = function(e) {
                'undefined' != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, {
                        value: 'Module',
                    }),
                    Object.defineProperty(e, '__esModule', { value: !0 });
            }),
            (r.t = function(e, t) {
                if ((1 & t && (e = r(e)), 8 & t)) return e;
                if (4 & t && 'object' == typeof e && e && e.__esModule)
                    return e;
                var s = Object.create(null);
                if (
                    (r.r(s),
                    Object.defineProperty(s, 'default', {
                        enumerable: !0,
                        value: e,
                    }),
                    2 & t && 'string' != typeof e)
                )
                    for (var n in e)
                        r.d(
                            s,
                            n,
                            function(t) {
                                return e[t];
                            }.bind(null, n)
                        );
                return s;
            }),
            (r.n = function(e) {
                var t =
                    e && e.__esModule
                        ? function() {
                              return e.default;
                          }
                        : function() {
                              return e;
                          };
                return r.d(t, 'a', t), t;
            }),
            (r.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (r.p = ''),
            r((r.s = 83))
        );
    })([
        function(e, t, r) {
            'use strict';
            const s = r(14),
                n = r(15),
                i = r(16),
                o = r(1),
                {
                    StripeConnectionError: a,
                    StripeAuthenticationError: c,
                    StripePermissionError: u,
                    StripeRateLimitError: p,
                    StripeError: l,
                    StripeAPIError: d,
                } = r(2),
                h = new s.Agent({ keepAlive: !0 }),
                m = new n.Agent({ keepAlive: !0 });
            (f.extend = o.protoExtend),
                (f.method = r(8)),
                (f.BASIC_METHODS = r(22)),
                (f.MAX_BUFFERED_REQUEST_METRICS = 100);
            function f(e, t) {
                if (((this._stripe = e), t))
                    throw new Error(
                        'Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.'
                    );
                (this.basePath = o.makeURLInterpolator(
                    this.basePath || e.getApiField('basePath')
                )),
                    (this.resourcePath = this.path),
                    (this.path = o.makeURLInterpolator(this.path)),
                    this.includeBasic &&
                        this.includeBasic.forEach(function(e) {
                            this[e] = f.BASIC_METHODS[e];
                        }, this),
                    this.initialize(...arguments);
            }
            (f.prototype = {
                path: '',
                basePath: null,
                initialize() {},
                requestDataProcessor: null,
                validateRequest: null,
                createFullPath(e, t) {
                    return i
                        .join(
                            this.basePath(t),
                            this.path(t),
                            'function' == typeof e ? e(t) : e
                        )
                        .replace(/\\/g, '/');
                },
                createResourcePathWithSymbols(e) {
                    return `/${i
                        .join(this.resourcePath, e || '')
                        .replace(/\\/g, '/')}`;
                },
                wrapTimeout: o.callbackifyPromiseWithTimeout,
                _timeoutHandler(e, t, r) {
                    return () => {
                        const s = new TypeError('ETIMEDOUT');
                        (s.code = 'ETIMEDOUT'),
                            (t._isAborted = !0),
                            t.abort(),
                            r.call(
                                this,
                                new a({
                                    message: `Request aborted due to timeout being reached (${e}ms)`,
                                    detail: s,
                                }),
                                null
                            );
                    };
                },
                _responseHandler(e, t) {
                    return r => {
                        let s = '';
                        r.setEncoding('utf8'),
                            r.on('data', e => {
                                s += e;
                            }),
                            r.once('end', () => {
                                const n = r.headers || {};
                                r.requestId = n['request-id'];
                                const i = Date.now(),
                                    a = i - e._requestStart,
                                    h = o.removeNullish({
                                        api_version: n['stripe-version'],
                                        account: n['stripe-account'],
                                        idempotency_key: n['idempotency-key'],
                                        method: e._requestEvent.method,
                                        path: e._requestEvent.path,
                                        status: r.statusCode,
                                        request_id: r.requestId,
                                        elapsed: a,
                                        request_start_time: e._requestStart,
                                        request_end_time: i,
                                    });
                                this._stripe._emitter.emit('response', h);
                                try {
                                    if (((s = JSON.parse(s)), s.error)) {
                                        let e;
                                        return (
                                            'string' == typeof s.error &&
                                                (s.error = {
                                                    type: s.error,
                                                    message:
                                                        s.error_description,
                                                }),
                                            (s.error.headers = n),
                                            (s.error.statusCode = r.statusCode),
                                            (s.error.requestId = r.requestId),
                                            (e =
                                                401 === r.statusCode
                                                    ? new c(s.error)
                                                    : 403 === r.statusCode
                                                    ? new u(s.error)
                                                    : 429 === r.statusCode
                                                    ? new p(s.error)
                                                    : l.generate(s.error)),
                                            t.call(this, e, null)
                                        );
                                    }
                                } catch (e) {
                                    return t.call(
                                        this,
                                        new d({
                                            message:
                                                'Invalid JSON received from the Stripe API',
                                            response: s,
                                            exception: e,
                                            requestId: n['request-id'],
                                        }),
                                        null
                                    );
                                }
                                this._recordRequestMetrics(r.requestId, a),
                                    Object.defineProperty(s, 'lastResponse', {
                                        enumerable: !1,
                                        writable: !1,
                                        value: r,
                                    }),
                                    t.call(this, null, s);
                            });
                    };
                },
                _generateConnectionErrorMessage: e =>
                    `An error occurred with our connection to Stripe.${
                        e > 0 ? ` Request was retried ${e} times.` : ''
                    }`,
                _errorHandler(e, t, r) {
                    return s => {
                        e._isAborted ||
                            r.call(
                                this,
                                new a({
                                    message: this._generateConnectionErrorMessage(
                                        t
                                    ),
                                    detail: s,
                                }),
                                null
                            );
                    };
                },
                _shouldRetry: (e, t, r) =>
                    !(t >= r) &&
                    (!e ||
                        ((!e.headers ||
                            'false' !== e.headers['stripe-should-retry']) &&
                            (!(
                                !e.headers ||
                                'true' !== e.headers['stripe-should-retry']
                            ) ||
                                409 === e.statusCode ||
                                e.statusCode >= 500))),
                _getSleepTimeInMS(e, t = null) {
                    const r = this._stripe.getInitialNetworkRetryDelay(),
                        s = this._stripe.getMaxNetworkRetryDelay();
                    let n = Math.min(r * Math.pow(e - 1, 2), s);
                    return (
                        (n *= 0.5 * (1 + Math.random())),
                        (n = Math.max(r, n)),
                        Number.isInteger(t) && t <= 60 && (n = Math.max(n, t)),
                        1e3 * n
                    );
                },
                _getMaxNetworkRetries(e = {}) {
                    return e.maxNetworkRetries &&
                        Number.isInteger(e.maxNetworkRetries)
                        ? e.maxNetworkRetries
                        : this._stripe.getMaxNetworkRetries();
                },
                _defaultIdempotencyKey(e, t) {
                    const r = this._getMaxNetworkRetries(t);
                    return 'POST' === e && r > 0
                        ? `stripe-node-retry-${o.uuid4()}`
                        : null;
                },
                _makeHeaders(e, t, r, s, n, i, a) {
                    const c = {
                        Authorization: e
                            ? `Bearer ${e}`
                            : this._stripe.getApiField('auth'),
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': t,
                        'User-Agent': this._getUserAgentString(),
                        'X-Stripe-Client-User-Agent': s,
                        'X-Stripe-Client-Telemetry': this._getTelemetryHeader(),
                        'Stripe-Version': r,
                        'Idempotency-Key': this._defaultIdempotencyKey(n, a),
                    };
                    return Object.assign(
                        o.removeNullish(c),
                        o.normalizeHeaders(i)
                    );
                },
                _getUserAgentString() {
                    return `Stripe/v1 NodeBindings/${this._stripe.getConstant(
                        'PACKAGE_VERSION'
                    )} ${
                        this._stripe._appInfo
                            ? this._stripe.getAppInfoAsString()
                            : ''
                    }`.trim();
                },
                _getTelemetryHeader() {
                    if (
                        this._stripe.getTelemetryEnabled() &&
                        this._stripe._prevRequestMetrics.length > 0
                    ) {
                        const e = this._stripe._prevRequestMetrics.shift();
                        return JSON.stringify({ last_request_metrics: e });
                    }
                },
                _recordRequestMetrics(e, t) {
                    this._stripe.getTelemetryEnabled() &&
                        e &&
                        (this._stripe._prevRequestMetrics.length >
                        f.MAX_BUFFERED_REQUEST_METRICS
                            ? o.emitWarning(
                                  'Request metrics buffer is full, dropping telemetry message.'
                              )
                            : this._stripe._prevRequestMetrics.push({
                                  request_id: e,
                                  request_duration_ms: t,
                              }));
                },
                _request(e, t, r, i, a, c = {}, u) {
                    let p;
                    const l = (e, t, r, s, n) =>
                            setTimeout(
                                e,
                                this._getSleepTimeInMS(s, n),
                                t,
                                r,
                                s + 1
                            ),
                        d = (i, a, f) => {
                            const g =
                                    c.settings &&
                                    Number.isInteger(c.settings.timeout) &&
                                    c.settings.timeout >= 0
                                        ? c.settings.timeout
                                        : this._stripe.getApiField('timeout'),
                                y =
                                    'http' ==
                                    this._stripe.getApiField('protocol');
                            let x = this._stripe.getApiField('agent');
                            null == x && (x = y ? h : m);
                            const _ = (y ? s : n).request({
                                    host: t || this._stripe.getApiField('host'),
                                    port: this._stripe.getApiField('port'),
                                    path: r,
                                    method: e,
                                    agent: x,
                                    headers: a,
                                    ciphers:
                                        'DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5',
                                }),
                                v = Date.now(),
                                E = o.removeNullish({
                                    api_version: i,
                                    account: a['Stripe-Account'],
                                    idempotency_key: a['Idempotency-Key'],
                                    method: e,
                                    path: r,
                                    request_start_time: v,
                                }),
                                b = f || 0,
                                S = this._getMaxNetworkRetries(c.settings);
                            (_._requestEvent = E),
                                (_._requestStart = v),
                                this._stripe._emitter.emit('request', E),
                                _.setTimeout(g, this._timeoutHandler(g, _, u)),
                                _.once('response', e =>
                                    this._shouldRetry(e, b, S)
                                        ? l(
                                              d,
                                              i,
                                              a,
                                              b,
                                              ((e || {}).headers || {})[
                                                  'retry-after'
                                              ]
                                          )
                                        : this._responseHandler(_, u)(e)
                                ),
                                _.on('error', e =>
                                    this._shouldRetry(null, b, S)
                                        ? l(d, i, a, b, null)
                                        : this._errorHandler(_, b, u)(e)
                                ),
                                _.once('socket', e => {
                                    e.connecting
                                        ? e.once(
                                              y ? 'connect' : 'secureConnect',
                                              () => {
                                                  _.write(p), _.end();
                                              }
                                          )
                                        : (_.write(p), _.end());
                                });
                        },
                        f = (t, r) => {
                            if (t) return u(t);
                            (p = r),
                                this._stripe.getClientUserAgent(t => {
                                    const r = this._stripe.getApiField(
                                            'version'
                                        ),
                                        s = this._makeHeaders(
                                            a,
                                            p.length,
                                            r,
                                            t,
                                            e,
                                            c.headers,
                                            c.settings
                                        );
                                    d(r, s);
                                });
                        };
                    this.requestDataProcessor
                        ? this.requestDataProcessor(e, i, c.headers, f)
                        : f(null, o.stringifyRequestData(i || {}));
                },
            }),
                (e.exports = f);
        },
        function(e, t, r) {
            'use strict';
            const s = r(4).EventEmitter,
                n = r(17),
                i = r(7),
                o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
            let a = null;
            try {
                a = r(20).exec;
            } catch (e) {
                if ('MODULE_NOT_FOUND' !== e.code) throw e;
            }
            const c = [
                    'apiKey',
                    'idempotencyKey',
                    'stripeAccount',
                    'apiVersion',
                    'maxNetworkRetries',
                    'timeout',
                ],
                u = {
                    api_key: 'apiKey',
                    idempotency_key: 'idempotencyKey',
                    stripe_account: 'stripeAccount',
                    stripe_version: 'apiVersion',
                    stripeVersion: 'apiVersion',
                },
                p = Object.keys(u),
                l = (e.exports = {
                    isOptionsHash: e =>
                        e &&
                        'object' == typeof e &&
                        (c.some(t => o(e, t)) || p.some(t => o(e, t))),
                    stringifyRequestData: e =>
                        n
                            .stringify(e, {
                                serializeDate: e =>
                                    Math.floor(e.getTime() / 1e3),
                            })
                            .replace(/%5B/g, '[')
                            .replace(/%5D/g, ']'),
                    makeURLInterpolator: (() => {
                        const e = {
                            '\n': '\\n',
                            '"': '\\"',
                            '\u2028': '\\u2028',
                            '\u2029': '\\u2029',
                        };
                        return t => {
                            const r = t.replace(
                                /["\n\r\u2028\u2029]/g,
                                t => e[t]
                            );
                            return e =>
                                r.replace(/\{([\s\S]+?)\}/g, (t, r) =>
                                    encodeURIComponent(e[r] || '')
                                );
                        };
                    })(),
                    extractUrlParams: e => {
                        const t = e.match(/\{\w+\}/g);
                        return t ? t.map(e => e.replace(/[{}]/g, '')) : [];
                    },
                    getDataFromArgs(e) {
                        if (
                            !Array.isArray(e) ||
                            !e[0] ||
                            'object' != typeof e[0]
                        )
                            return {};
                        if (!l.isOptionsHash(e[0])) return e.shift();
                        const t = Object.keys(e[0]),
                            r = t.filter(e => c.includes(e));
                        return (
                            r.length > 0 &&
                                r.length !== t.length &&
                                d(
                                    `Options found in arguments (${r.join(
                                        ', '
                                    )}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`
                                ),
                            {}
                        );
                    },
                    getOptionsFromArgs: e => {
                        const t = { auth: null, headers: {}, settings: {} };
                        if (e.length > 0) {
                            const r = e[e.length - 1];
                            if ('string' == typeof r) t.auth = e.pop();
                            else if (l.isOptionsHash(r)) {
                                const r = e.pop(),
                                    s = Object.keys(r).filter(
                                        e => !c.includes(e)
                                    );
                                if (s.length) {
                                    s.filter(e => {
                                        if (!u[e]) return !0;
                                        const t = u[e];
                                        if (r[t])
                                            throw Error(
                                                `Both '${t}' and '${e}' were provided; please remove '${e}', which is deprecated.`
                                            );
                                        d(
                                            `'${e}' is deprecated; use '${t}' instead.`
                                        ),
                                            (r[t] = r[e]);
                                    }).length &&
                                        d(
                                            `Invalid options found (${s.join(
                                                ', '
                                            )}); ignoring.`
                                        );
                                }
                                r.apiKey && (t.auth = r.apiKey),
                                    r.idempotencyKey &&
                                        (t.headers['Idempotency-Key'] =
                                            r.idempotencyKey),
                                    r.stripeAccount &&
                                        (t.headers['Stripe-Account'] =
                                            r.stripeAccount),
                                    r.apiVersion &&
                                        (t.headers['Stripe-Version'] =
                                            r.apiVersion),
                                    Number.isInteger(r.maxNetworkRetries) &&
                                        (t.settings.maxNetworkRetries =
                                            r.maxNetworkRetries),
                                    Number.isInteger(r.timeout) &&
                                        (t.settings.timeout = r.timeout);
                            }
                        }
                        return t;
                    },
                    protoExtend(e) {
                        const t = this,
                            r = o(e, 'constructor')
                                ? e.constructor
                                : function(...e) {
                                      t.apply(this, e);
                                  };
                        return (
                            Object.assign(r, t),
                            (r.prototype = Object.create(t.prototype)),
                            Object.assign(r.prototype, e),
                            r
                        );
                    },
                    secureCompare: (e, t) => {
                        if (
                            ((e = Buffer.from(e)),
                            (t = Buffer.from(t)),
                            e.length !== t.length)
                        )
                            return !1;
                        if (i.timingSafeEqual) return i.timingSafeEqual(e, t);
                        const r = e.length;
                        let s = 0;
                        for (let n = 0; n < r; ++n) s |= e[n] ^ t[n];
                        return 0 === s;
                    },
                    removeNullish: e => {
                        if ('object' != typeof e)
                            throw new Error('Argument must be an object');
                        return Object.keys(e).reduce(
                            (t, r) => (null != e[r] && (t[r] = e[r]), t),
                            {}
                        );
                    },
                    normalizeHeaders: e =>
                        e && 'object' == typeof e
                            ? Object.keys(e).reduce(
                                  (t, r) => (
                                      (t[l.normalizeHeader(r)] = e[r]), t
                                  ),
                                  {}
                              )
                            : e,
                    normalizeHeader: e =>
                        e
                            .split('-')
                            .map(
                                e =>
                                    e.charAt(0).toUpperCase() +
                                    e.substr(1).toLowerCase()
                            )
                            .join('-'),
                    checkForStream: e =>
                        !(!e.file || !e.file.data) && e.file.data instanceof s,
                    callbackifyPromiseWithTimeout: (e, t) =>
                        t
                            ? e.then(
                                  e => {
                                      setTimeout(() => {
                                          t(null, e);
                                      }, 0);
                                  },
                                  e => {
                                      setTimeout(() => {
                                          t(e, null);
                                      }, 0);
                                  }
                              )
                            : e,
                    pascalToCamelCase: e =>
                        'OAuth' === e
                            ? 'oauth'
                            : e[0].toLowerCase() + e.substring(1),
                    emitWarning: d,
                    safeExec: (e, t) => {
                        if (null !== l._exec)
                            try {
                                l._exec(e, t);
                            } catch (e) {
                                t(e, null);
                            }
                        else t(new Error('exec not available'), null);
                    },
                    _exec: a,
                    isObject: e => {
                        const t = typeof e;
                        return ('function' === t || 'object' === t) && !!e;
                    },
                    flattenAndStringify: e => {
                        const t = {},
                            r = (e, s) => {
                                Object.keys(e).forEach(n => {
                                    const i = e[n],
                                        o = s ? `${s}[${n}]` : n;
                                    if (l.isObject(i)) {
                                        if (
                                            !Buffer.isBuffer(i) &&
                                            !i.hasOwnProperty('data')
                                        )
                                            return r(i, o);
                                        t[o] = i;
                                    } else t[o] = String(i);
                                });
                            };
                        return r(e), t;
                    },
                    uuid4: () =>
                        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                            /[xy]/g,
                            e => {
                                const t = (16 * Math.random()) | 0;
                                return ('x' === e ? t : (3 & t) | 8).toString(
                                    16
                                );
                            }
                        ),
                    validateInteger: (e, t, r) => {
                        if (!Number.isInteger(t)) {
                            if (void 0 !== r) return r;
                            throw new Error(`${e} must be an integer`);
                        }
                        return t;
                    },
                });
            function d(e) {
                return 'function' != typeof process.emitWarning
                    ? console.warn(`Stripe: ${e}`)
                    : process.emitWarning(e, 'Stripe');
            }
        },
        function(e, t, r) {
            'use strict';
            class s extends Error {
                constructor(e = {}) {
                    super(e.message),
                        (this.type = this.constructor.name),
                        (this.raw = e),
                        (this.rawType = e.type),
                        (this.code = e.code),
                        (this.param = e.param),
                        (this.detail = e.detail),
                        (this.headers = e.headers),
                        (this.requestId = e.requestId),
                        (this.statusCode = e.statusCode),
                        (this.message = e.message),
                        (this.charge = e.charge),
                        (this.decline_code = e.decline_code),
                        (this.payment_intent = e.payment_intent),
                        (this.payment_method = e.payment_method),
                        (this.setup_intent = e.setup_intent),
                        (this.source = e.source);
                }
                static generate(e) {
                    switch (e.type) {
                        case 'card_error':
                            return new n(e);
                        case 'invalid_request_error':
                            return new i(e);
                        case 'api_error':
                            return new o(e);
                        case 'idempotency_error':
                            return new a(e);
                        case 'invalid_grant':
                            return new c(e);
                        default:
                            return new GenericError('Generic', 'Unknown Error');
                    }
                }
            }
            class n extends s {}
            class i extends s {}
            class o extends s {}
            class a extends s {}
            class c extends s {}
            (e.exports.StripeError = s),
                (e.exports.StripeCardError = n),
                (e.exports.StripeInvalidRequestError = i),
                (e.exports.StripeAPIError = o),
                (e.exports.StripeAuthenticationError = class extends s {}),
                (e.exports.StripePermissionError = class extends s {}),
                (e.exports.StripeRateLimitError = class extends s {}),
                (e.exports.StripeConnectionError = class extends s {}),
                (e.exports.StripeSignatureVerificationError = class extends s {}),
                (e.exports.StripeIdempotencyError = a),
                (e.exports.StripeInvalidGrantError = c);
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: '',
                reject: n({
                    method: 'POST',
                    path: 'accounts/{account}/reject',
                }),
                create: n({ method: 'POST', path: 'accounts' }),
                del: n({ method: 'DELETE', path: 'accounts/{account}' }),
                list: n({
                    method: 'GET',
                    path: 'accounts',
                    methodType: 'list',
                }),
                retrieve(e) {
                    return 'string' == typeof e
                        ? n({ method: 'GET', path: 'accounts/{id}' }).apply(
                              this,
                              arguments
                          )
                        : (null == e && [].shift.apply(arguments),
                          n({ method: 'GET', path: 'account' }).apply(
                              this,
                              arguments
                          ));
                },
                update: n({ method: 'POST', path: 'accounts/{account}' }),
                listCapabilities: n({
                    method: 'GET',
                    path: 'accounts/{account}/capabilities',
                    methodType: 'list',
                }),
                retrieveCapability: n({
                    method: 'GET',
                    path: 'accounts/{account}/capabilities/{capability}',
                }),
                updateCapability: n({
                    method: 'POST',
                    path: 'accounts/{account}/capabilities/{capability}',
                }),
                createExternalAccount: n({
                    method: 'POST',
                    path: 'accounts/{account}/external_accounts',
                }),
                deleteExternalAccount: n({
                    method: 'DELETE',
                    path: 'accounts/{account}/external_accounts/{id}',
                }),
                listExternalAccounts: n({
                    method: 'GET',
                    path: 'accounts/{account}/external_accounts',
                    methodType: 'list',
                }),
                retrieveExternalAccount: n({
                    method: 'GET',
                    path: 'accounts/{account}/external_accounts/{id}',
                }),
                updateExternalAccount: n({
                    method: 'POST',
                    path: 'accounts/{account}/external_accounts/{id}',
                }),
                createLoginLink: n({
                    method: 'POST',
                    path: 'accounts/{account}/login_links',
                }),
                createPerson: n({
                    method: 'POST',
                    path: 'accounts/{account}/persons',
                }),
                deletePerson: n({
                    method: 'DELETE',
                    path: 'accounts/{account}/persons/{person}',
                }),
                listPersons: n({
                    method: 'GET',
                    path: 'accounts/{account}/persons',
                    methodType: 'list',
                }),
                retrievePerson: n({
                    method: 'GET',
                    path: 'accounts/{account}/persons/{person}',
                }),
                updatePerson: n({
                    method: 'POST',
                    path: 'accounts/{account}/persons/{person}',
                }),
            });
        },
        function(e, t) {
            e.exports = require('events');
        },
        function(e, t, r) {
            'use strict';
            var s = Object.prototype.hasOwnProperty,
                n = Array.isArray,
                i = (function() {
                    for (var e = [], t = 0; t < 256; ++t)
                        e.push(
                            '%' +
                                (
                                    (t < 16 ? '0' : '') + t.toString(16)
                                ).toUpperCase()
                        );
                    return e;
                })(),
                o = function(e, t) {
                    for (
                        var r = t && t.plainObjects ? Object.create(null) : {},
                            s = 0;
                        s < e.length;
                        ++s
                    )
                        void 0 !== e[s] && (r[s] = e[s]);
                    return r;
                };
            e.exports = {
                arrayToObject: o,
                assign: function(e, t) {
                    return Object.keys(t).reduce(function(e, r) {
                        return (e[r] = t[r]), e;
                    }, e);
                },
                combine: function(e, t) {
                    return [].concat(e, t);
                },
                compact: function(e) {
                    for (
                        var t = [{ obj: { o: e }, prop: 'o' }], r = [], s = 0;
                        s < t.length;
                        ++s
                    )
                        for (
                            var i = t[s],
                                o = i.obj[i.prop],
                                a = Object.keys(o),
                                c = 0;
                            c < a.length;
                            ++c
                        ) {
                            var u = a[c],
                                p = o[u];
                            'object' == typeof p &&
                                null !== p &&
                                -1 === r.indexOf(p) &&
                                (t.push({ obj: o, prop: u }), r.push(p));
                        }
                    return (
                        (function(e) {
                            for (; e.length > 1; ) {
                                var t = e.pop(),
                                    r = t.obj[t.prop];
                                if (n(r)) {
                                    for (var s = [], i = 0; i < r.length; ++i)
                                        void 0 !== r[i] && s.push(r[i]);
                                    t.obj[t.prop] = s;
                                }
                            }
                        })(t),
                        e
                    );
                },
                decode: function(e, t, r) {
                    var s = e.replace(/\+/g, ' ');
                    if ('iso-8859-1' === r)
                        return s.replace(/%[0-9a-f]{2}/gi, unescape);
                    try {
                        return decodeURIComponent(s);
                    } catch (e) {
                        return s;
                    }
                },
                encode: function(e, t, r) {
                    if (0 === e.length) return e;
                    var s = 'string' == typeof e ? e : String(e);
                    if ('iso-8859-1' === r)
                        return escape(s).replace(/%u[0-9a-f]{4}/gi, function(
                            e
                        ) {
                            return '%26%23' + parseInt(e.slice(2), 16) + '%3B';
                        });
                    for (var n = '', o = 0; o < s.length; ++o) {
                        var a = s.charCodeAt(o);
                        45 === a ||
                        46 === a ||
                        95 === a ||
                        126 === a ||
                        (a >= 48 && a <= 57) ||
                        (a >= 65 && a <= 90) ||
                        (a >= 97 && a <= 122)
                            ? (n += s.charAt(o))
                            : a < 128
                            ? (n += i[a])
                            : a < 2048
                            ? (n += i[192 | (a >> 6)] + i[128 | (63 & a)])
                            : a < 55296 || a >= 57344
                            ? (n +=
                                  i[224 | (a >> 12)] +
                                  i[128 | ((a >> 6) & 63)] +
                                  i[128 | (63 & a)])
                            : ((o += 1),
                              (a =
                                  65536 +
                                  (((1023 & a) << 10) |
                                      (1023 & s.charCodeAt(o)))),
                              (n +=
                                  i[240 | (a >> 18)] +
                                  i[128 | ((a >> 12) & 63)] +
                                  i[128 | ((a >> 6) & 63)] +
                                  i[128 | (63 & a)]));
                    }
                    return n;
                },
                isBuffer: function(e) {
                    return (
                        !(!e || 'object' != typeof e) &&
                        !!(
                            e.constructor &&
                            e.constructor.isBuffer &&
                            e.constructor.isBuffer(e)
                        )
                    );
                },
                isRegExp: function(e) {
                    return (
                        '[object RegExp]' === Object.prototype.toString.call(e)
                    );
                },
                merge: function e(t, r, i) {
                    if (!r) return t;
                    if ('object' != typeof r) {
                        if (n(t)) t.push(r);
                        else {
                            if (!t || 'object' != typeof t) return [t, r];
                            ((i && (i.plainObjects || i.allowPrototypes)) ||
                                !s.call(Object.prototype, r)) &&
                                (t[r] = !0);
                        }
                        return t;
                    }
                    if (!t || 'object' != typeof t) return [t].concat(r);
                    var a = t;
                    return (
                        n(t) && !n(r) && (a = o(t, i)),
                        n(t) && n(r)
                            ? (r.forEach(function(r, n) {
                                  if (s.call(t, n)) {
                                      var o = t[n];
                                      o &&
                                      'object' == typeof o &&
                                      r &&
                                      'object' == typeof r
                                          ? (t[n] = e(o, r, i))
                                          : t.push(r);
                                  } else t[n] = r;
                              }),
                              t)
                            : Object.keys(r).reduce(function(t, n) {
                                  var o = r[n];
                                  return (
                                      s.call(t, n)
                                          ? (t[n] = e(t[n], o, i))
                                          : (t[n] = o),
                                      t
                                  );
                              }, a)
                    );
                },
            };
        },
        function(e, t, r) {
            'use strict';
            var s = String.prototype.replace,
                n = /%20/g;
            e.exports = {
                default: 'RFC3986',
                formatters: {
                    RFC1738: function(e) {
                        return s.call(e, n, '+');
                    },
                    RFC3986: function(e) {
                        return e;
                    },
                },
                RFC1738: 'RFC1738',
                RFC3986: 'RFC3986',
            };
        },
        function(e, t) {
            e.exports = require('crypto');
        },
        function(e, t, r) {
            'use strict';
            const s = r(1),
                n = r(9),
                i = r(21).makeAutoPaginationMethods;
            e.exports = function(e) {
                return function(...t) {
                    const r = 'function' == typeof t[t.length - 1] && t.pop();
                    e.urlParams = s.extractUrlParams(
                        this.createResourcePathWithSymbols(e.path || '')
                    );
                    const o = s.callbackifyPromiseWithTimeout(
                        n(this, t, e, {}),
                        r
                    );
                    if ('list' === e.methodType) {
                        const r = i(this, t, e, o);
                        Object.assign(o, r);
                    }
                    return o;
                };
            };
        },
        function(e, t, r) {
            'use strict';
            const s = r(1);
            e.exports = function(e, t, r, n) {
                return new Promise((i, o) => {
                    try {
                        var a = (function(e, t, r, n) {
                            const i = s.makeURLInterpolator(r.path || ''),
                                o = (r.method || 'GET').toUpperCase(),
                                a = r.urlParams || [],
                                c = r.encode || (e => e),
                                u = r.host,
                                p = e.createResourcePathWithSymbols(r.path),
                                l = [].slice.call(t),
                                d = a.reduce((e, t) => {
                                    const r = l.shift();
                                    if ('string' != typeof r)
                                        throw new Error(
                                            `Stripe: Argument "${t}" must be a string, but got: ${r} (on API request to \`${o} ${p}\`)`
                                        );
                                    return (e[t] = r), e;
                                }, {}),
                                h = s.getDataFromArgs(l),
                                m = c(Object.assign({}, h, n)),
                                f = s.getOptionsFromArgs(l);
                            if (l.filter(e => null != e).length)
                                throw new Error(
                                    `Stripe: Unknown arguments (${l}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${o} \`${p}\`)`
                                );
                            const g = e.createFullPath(i, d),
                                y = Object.assign(f.headers, r.headers);
                            r.validator && r.validator(m, { headers: y });
                            const x =
                                'GET' === r.method || 'DELETE' === r.method;
                            return {
                                requestMethod: o,
                                requestPath: g,
                                bodyData: x ? {} : m,
                                queryData: x ? m : {},
                                auth: f.auth,
                                headers: y,
                                host: u,
                                settings: f.settings,
                            };
                        })(e, t, r, n);
                    } catch (e) {
                        return void o(e);
                    }
                    const c = 0 === Object.keys(a.queryData).length,
                        u = [
                            a.requestPath,
                            c ? '' : '?',
                            s.stringifyRequestData(a.queryData),
                        ].join(''),
                        { headers: p, settings: l } = a;
                    e._request(
                        a.requestMethod,
                        a.host,
                        u,
                        a.bodyData,
                        a.auth,
                        { headers: p, settings: l },
                        function(e, t) {
                            e
                                ? o(e)
                                : i(
                                      r.transformResponseData
                                          ? r.transformResponseData(t)
                                          : t
                                  );
                        }
                    );
                });
            };
        },
        function(e, t, r) {
            'use strict';
            const s = r(7),
                n = r(1),
                { StripeError: i, StripeSignatureVerificationError: o } = r(2),
                a = {
                    DEFAULT_TOLERANCE: 300,
                    constructEvent(e, t, r, s) {
                        return (
                            this.signature.verifyHeader(
                                e,
                                t,
                                r,
                                s || a.DEFAULT_TOLERANCE
                            ),
                            JSON.parse(e)
                        );
                    },
                    generateTestHeaderString: function(e) {
                        if (!e)
                            throw new i({ message: 'Options are required' });
                        return (
                            (e.timestamp =
                                Math.floor(e.timestamp) ||
                                Math.floor(Date.now() / 1e3)),
                            (e.scheme = e.scheme || c.EXPECTED_SCHEME),
                            (e.signature =
                                e.signature ||
                                c._computeSignature(
                                    e.timestamp + '.' + e.payload,
                                    e.secret
                                )),
                            [
                                't=' + e.timestamp,
                                e.scheme + '=' + e.signature,
                            ].join(',')
                        );
                    },
                },
                c = {
                    EXPECTED_SCHEME: 'v1',
                    _computeSignature: (e, t) =>
                        s
                            .createHmac('sha256', t)
                            .update(e, 'utf8')
                            .digest('hex'),
                    verifyHeader(e, t, r, s) {
                        if (
                            ((e = Buffer.isBuffer(e) ? e.toString('utf8') : e),
                            Array.isArray(t))
                        )
                            throw new Error(
                                'Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header.'
                            );
                        const i = (function(e, t) {
                            if ('string' != typeof e) return null;
                            return e.split(',').reduce(
                                (e, r) => {
                                    const s = r.split('=');
                                    return (
                                        't' === s[0] && (e.timestamp = s[1]),
                                        s[0] === t && e.signatures.push(s[1]),
                                        e
                                    );
                                },
                                { timestamp: -1, signatures: [] }
                            );
                        })(
                            (t = Buffer.isBuffer(t) ? t.toString('utf8') : t),
                            this.EXPECTED_SCHEME
                        );
                        if (!i || -1 === i.timestamp)
                            throw new o({
                                message:
                                    'Unable to extract timestamp and signatures from header',
                                detail: { header: t, payload: e },
                            });
                        if (!i.signatures.length)
                            throw new o({
                                message:
                                    'No signatures found with expected scheme',
                                detail: { header: t, payload: e },
                            });
                        const a = this._computeSignature(
                            `${i.timestamp}.${e}`,
                            r
                        );
                        if (
                            !!!i.signatures.filter(n.secureCompare.bind(n, a))
                                .length
                        )
                            throw new o({
                                message:
                                    'No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing',
                                detail: { header: t, payload: e },
                            });
                        const c = Math.floor(Date.now() / 1e3) - i.timestamp;
                        if (s > 0 && c > s)
                            throw new o({
                                message: 'Timestamp outside the tolerance zone',
                                detail: { header: t, payload: e },
                            });
                        return !0;
                    },
                };
            (a.signature = c), (e.exports = a);
        },
        function(e, t, r) {
            'use strict';
            const s = r(12);
            (u.PACKAGE_VERSION = r(80).version),
                (u.USER_AGENT = {
                    bindings_version: u.PACKAGE_VERSION,
                    lang: 'node',
                    lang_version: process.version,
                    platform: process.platform,
                    publisher: 'stripe',
                    uname: null,
                    typescript: !1,
                }),
                (u.USER_AGENT_SERIALIZED = null);
            const n = ['name', 'version', 'url', 'partner_id'],
                i = [
                    'apiVersion',
                    'typescript',
                    'maxNetworkRetries',
                    'httpAgent',
                    'timeout',
                    'host',
                    'port',
                    'protocol',
                    'telemetry',
                    'appInfo',
                ],
                o = r(4).EventEmitter,
                a = r(1),
                { emitWarning: c } = a;
            function u(e, t = {}) {
                if (!(this instanceof u)) return new u(e, t);
                const s = this._getPropsFromConfig(t);
                Object.defineProperty(this, '_emitter', {
                    value: new o(),
                    enumerable: !1,
                    configurable: !1,
                    writable: !1,
                }),
                    (this.on = this._emitter.on.bind(this._emitter)),
                    (this.once = this._emitter.once.bind(this._emitter)),
                    (this.off = this._emitter.removeListener.bind(
                        this._emitter
                    )),
                    (this._api = {
                        auth: null,
                        host: s.host || 'api.stripe.com',
                        port: s.port || '443',
                        protocol: s.protocol || 'https',
                        basePath: '/v1/',
                        version: s.apiVersion || null,
                        timeout: a.validateInteger('timeout', s.timeout, 8e4),
                        maxNetworkRetries: a.validateInteger(
                            'maxNetworkRetries',
                            s.maxNetworkRetries,
                            0
                        ),
                        agent: s.httpAgent || null,
                        dev: !1,
                    });
                const n = s.typescript || !1;
                n !== u.USER_AGENT.typescript &&
                    ((u.USER_AGENT_SERIALIZED = null),
                    (u.USER_AGENT.typescript = n)),
                    s.appInfo && this._setAppInfo(s.appInfo),
                    this._prepResources(),
                    this._setApiKey(e),
                    (this.errors = r(2)),
                    (this.webhooks = r(10)),
                    (this._prevRequestMetrics = []),
                    (this._enableTelemetry = !1 !== s.telemetry);
            }
            (u.StripeResource = r(0)),
                (u.resources = s),
                (u.errors = r(2)),
                (u.webhooks = r(10)),
                (u.prototype = {
                    setHost(e, t, r) {
                        c(
                            '`setHost` is deprecated. Use the `host` config option instead.'
                        ),
                            this._setApiField('host', e),
                            t && this.setPort(t),
                            r && this.setProtocol(r);
                    },
                    setProtocol(e) {
                        c(
                            '`setProtocol` is deprecated. Use the `protocol` config option instead.'
                        ),
                            this._setApiField('protocol', e.toLowerCase());
                    },
                    setPort(e) {
                        c(
                            '`setPort` is deprecated. Use the `port` config option instead.'
                        ),
                            this._setApiField('port', e);
                    },
                    setApiVersion(e) {
                        c(
                            '`setApiVersion` is deprecated. Use the `apiVersion` config or request option instead.'
                        ),
                            e && this._setApiField('version', e);
                    },
                    setApiKey(e) {
                        c(
                            '`setApiKey` is deprecated. Use the `apiKey` request option instead.'
                        ),
                            this._setApiKey(e);
                    },
                    _setApiKey(e) {
                        e && this._setApiField('auth', `Bearer ${e}`);
                    },
                    setTimeout(e) {
                        c(
                            '`setTimeout` is deprecated. Use the `timeout` config or request option instead.'
                        ),
                            this._setApiField('timeout', null == e ? 8e4 : e);
                    },
                    setAppInfo(e) {
                        c(
                            '`setAppInfo` is deprecated. Use the `appInfo` config option instead.'
                        ),
                            this._setAppInfo(e);
                    },
                    _setAppInfo(e) {
                        if (e && 'object' != typeof e)
                            throw new Error('AppInfo must be an object.');
                        if (e && !e.name)
                            throw new Error('AppInfo.name is required');
                        e = e || {};
                        const t = n.reduce(
                            (t, r) => (
                                'string' == typeof e[r] &&
                                    ((t = t || {})[r] = e[r]),
                                t
                            ),
                            void 0
                        );
                        (u.USER_AGENT_SERIALIZED = void 0), (this._appInfo = t);
                    },
                    setHttpAgent(e) {
                        c(
                            '`setHttpAgent` is deprecated. Use the `httpAgent` config option instead.'
                        ),
                            this._setApiField('agent', e);
                    },
                    _setApiField(e, t) {
                        this._api[e] = t;
                    },
                    getApiField(e) {
                        return this._api[e];
                    },
                    setClientId(e) {
                        this._clientId = e;
                    },
                    getClientId() {
                        return this._clientId;
                    },
                    getConstant: e => {
                        switch (e) {
                            case 'DEFAULT_HOST':
                                return 'api.stripe.com';
                            case 'DEFAULT_PORT':
                                return '443';
                            case 'DEFAULT_BASE_PATH':
                                return '/v1/';
                            case 'DEFAULT_API_VERSION':
                                return null;
                            case 'DEFAULT_TIMEOUT':
                                return 8e4;
                            case 'MAX_NETWORK_RETRY_DELAY_SEC':
                                return 2;
                            case 'INITIAL_NETWORK_RETRY_DELAY_SEC':
                                return 0.5;
                        }
                        return u[e];
                    },
                    getMaxNetworkRetries() {
                        return this.getApiField('maxNetworkRetries');
                    },
                    setMaxNetworkRetries(e) {
                        this._setApiNumberField('maxNetworkRetries', e);
                    },
                    _setApiNumberField(e, t, r) {
                        const s = a.validateInteger(e, t, r);
                        this._setApiField(e, s);
                    },
                    getMaxNetworkRetryDelay: () => 2,
                    getInitialNetworkRetryDelay: () => 0.5,
                    getClientUserAgent(e) {
                        if (u.USER_AGENT_SERIALIZED)
                            return e(u.USER_AGENT_SERIALIZED);
                        this.getClientUserAgentSeeded(u.USER_AGENT, t => {
                            (u.USER_AGENT_SERIALIZED = t),
                                e(u.USER_AGENT_SERIALIZED);
                        });
                    },
                    getClientUserAgentSeeded(e, t) {
                        a.safeExec('uname -a', (r, s) => {
                            const n = {};
                            for (const t in e) n[t] = encodeURIComponent(e[t]);
                            (n.uname = encodeURIComponent(s || 'UNKNOWN')),
                                this._appInfo &&
                                    (n.application = this._appInfo),
                                t(JSON.stringify(n));
                        });
                    },
                    getAppInfoAsString() {
                        if (!this._appInfo) return '';
                        let e = this._appInfo.name;
                        return (
                            this._appInfo.version &&
                                (e += `/${this._appInfo.version}`),
                            this._appInfo.url &&
                                (e += ` (${this._appInfo.url})`),
                            e
                        );
                    },
                    setTelemetryEnabled(e) {
                        c(
                            '`setTelemetryEnabled` is deprecated. Use the `telemetry` config option instead.'
                        ),
                            (this._enableTelemetry = e);
                    },
                    getTelemetryEnabled() {
                        return this._enableTelemetry;
                    },
                    _prepResources() {
                        for (const e in s)
                            this[a.pascalToCamelCase(e)] = new s[e](this);
                    },
                    _getPropsFromConfig(e) {
                        if (!e) return {};
                        const t = 'string' == typeof e;
                        if (!(e === Object(e) && !Array.isArray(e)) && !t)
                            throw new Error(
                                'Config must either be an object or a string'
                            );
                        if (t) return { apiVersion: e };
                        if (
                            Object.keys(e).filter(e => !i.includes(e)).length >
                            0
                        )
                            throw new Error(
                                `Config object may only contain the following: ${i.join(
                                    ', '
                                )}`
                            );
                        return e;
                    },
                }),
                (e.exports = u),
                (e.exports.Stripe = u),
                (e.exports.default = u);
        },
        function(e, t, r) {
            'use strict';
            const s = r(13);
            e.exports = {
                Accounts: r(3),
                Account: r(3),
                AccountLinks: r(23),
                ApplePayDomains: r(24),
                ApplicationFees: r(25),
                Balance: r(26),
                BalanceTransactions: r(27),
                Charges: r(28),
                CountrySpecs: r(29),
                Coupons: r(30),
                CreditNotes: r(31),
                Customers: r(32),
                Disputes: r(33),
                EphemeralKeys: r(34),
                Events: r(35),
                ExchangeRates: r(36),
                Files: r(37),
                FileLinks: r(39),
                Invoices: r(40),
                InvoiceItems: r(41),
                IssuerFraudRecords: r(42),
                Mandates: r(43),
                OAuth: r(44),
                Orders: r(45),
                OrderReturns: r(46),
                PaymentIntents: r(47),
                PaymentMethods: r(48),
                Payouts: r(49),
                Plans: r(50),
                Products: r(51),
                Refunds: r(52),
                Reviews: r(53),
                SetupIntents: r(54),
                Skus: r(55),
                Sources: r(56),
                Subscriptions: r(57),
                SubscriptionItems: r(58),
                SubscriptionSchedules: r(59),
                TaxRates: r(60),
                Tokens: r(61),
                Topups: r(62),
                Transfers: r(63),
                WebhookEndpoints: r(64),
                Checkout: s('checkout', { Sessions: r(65) }),
                Issuing: s('issuing', {
                    Authorizations: r(66),
                    Cards: r(67),
                    Cardholders: r(68),
                    Disputes: r(69),
                    Transactions: r(70),
                }),
                Radar: s('radar', {
                    EarlyFraudWarnings: r(71),
                    ValueLists: r(72),
                    ValueListItems: r(73),
                }),
                Reporting: s('reporting', {
                    ReportRuns: r(74),
                    ReportTypes: r(75),
                }),
                Sigma: s('sigma', { ScheduledQueryRuns: r(76) }),
                Terminal: s('terminal', {
                    ConnectionTokens: r(77),
                    Locations: r(78),
                    Readers: r(79),
                }),
            };
        },
        function(e, t, r) {
            'use strict';
            function s(e, t) {
                for (const r in t) {
                    const s = r[0].toLowerCase() + r.substring(1),
                        n = new t[r](e);
                    this[s] = n;
                }
            }
            (e.exports = function(e, t) {
                return function(e) {
                    return new s(e, t);
                };
            }),
                (e.exports.ResourceNamespace = s);
        },
        function(e, t) {
            e.exports = require('http');
        },
        function(e, t) {
            e.exports = require('https');
        },
        function(e, t) {
            e.exports = require('path');
        },
        function(e, t, r) {
            'use strict';
            var s = r(18),
                n = r(19),
                i = r(6);
            e.exports = { formats: i, parse: n, stringify: s };
        },
        function(e, t, r) {
            'use strict';
            var s = r(5),
                n = r(6),
                i = Object.prototype.hasOwnProperty,
                o = {
                    brackets: function(e) {
                        return e + '[]';
                    },
                    comma: 'comma',
                    indices: function(e, t) {
                        return e + '[' + t + ']';
                    },
                    repeat: function(e) {
                        return e;
                    },
                },
                a = Array.isArray,
                c = Array.prototype.push,
                u = function(e, t) {
                    c.apply(e, a(t) ? t : [t]);
                },
                p = Date.prototype.toISOString,
                l = {
                    addQueryPrefix: !1,
                    allowDots: !1,
                    charset: 'utf-8',
                    charsetSentinel: !1,
                    delimiter: '&',
                    encode: !0,
                    encoder: s.encode,
                    encodeValuesOnly: !1,
                    formatter: n.formatters[n.default],
                    indices: !1,
                    serializeDate: function(e) {
                        return p.call(e);
                    },
                    skipNulls: !1,
                    strictNullHandling: !1,
                },
                d = function e(t, r, n, i, o, c, p, d, h, m, f, g, y) {
                    var x = t;
                    if (
                        ('function' == typeof p
                            ? (x = p(r, x))
                            : x instanceof Date
                            ? (x = m(x))
                            : 'comma' === n && a(x) && (x = x.join(',')),
                        null === x)
                    ) {
                        if (i) return c && !g ? c(r, l.encoder, y) : r;
                        x = '';
                    }
                    if (
                        'string' == typeof x ||
                        'number' == typeof x ||
                        'boolean' == typeof x ||
                        s.isBuffer(x)
                    )
                        return c
                            ? [
                                  f(g ? r : c(r, l.encoder, y)) +
                                      '=' +
                                      f(c(x, l.encoder, y)),
                              ]
                            : [f(r) + '=' + f(String(x))];
                    var _,
                        v = [];
                    if (void 0 === x) return v;
                    if (a(p)) _ = p;
                    else {
                        var E = Object.keys(x);
                        _ = d ? E.sort(d) : E;
                    }
                    for (var b = 0; b < _.length; ++b) {
                        var S = _[b];
                        (o && null === x[S]) ||
                            (a(x)
                                ? u(
                                      v,
                                      e(
                                          x[S],
                                          'function' == typeof n ? n(r, S) : r,
                                          n,
                                          i,
                                          o,
                                          c,
                                          p,
                                          d,
                                          h,
                                          m,
                                          f,
                                          g,
                                          y
                                      )
                                  )
                                : u(
                                      v,
                                      e(
                                          x[S],
                                          r + (h ? '.' + S : '[' + S + ']'),
                                          n,
                                          i,
                                          o,
                                          c,
                                          p,
                                          d,
                                          h,
                                          m,
                                          f,
                                          g,
                                          y
                                      )
                                  ));
                    }
                    return v;
                };
            e.exports = function(e, t) {
                var r,
                    s = e,
                    c = (function(e) {
                        if (!e) return l;
                        if (
                            null !== e.encoder &&
                            void 0 !== e.encoder &&
                            'function' != typeof e.encoder
                        )
                            throw new TypeError(
                                'Encoder has to be a function.'
                            );
                        var t = e.charset || l.charset;
                        if (
                            void 0 !== e.charset &&
                            'utf-8' !== e.charset &&
                            'iso-8859-1' !== e.charset
                        )
                            throw new TypeError(
                                'The charset option must be either utf-8, iso-8859-1, or undefined'
                            );
                        var r = n.default;
                        if (void 0 !== e.format) {
                            if (!i.call(n.formatters, e.format))
                                throw new TypeError(
                                    'Unknown format option provided.'
                                );
                            r = e.format;
                        }
                        var s = n.formatters[r],
                            o = l.filter;
                        return (
                            ('function' == typeof e.filter || a(e.filter)) &&
                                (o = e.filter),
                            {
                                addQueryPrefix:
                                    'boolean' == typeof e.addQueryPrefix
                                        ? e.addQueryPrefix
                                        : l.addQueryPrefix,
                                allowDots:
                                    void 0 === e.allowDots
                                        ? l.allowDots
                                        : !!e.allowDots,
                                charset: t,
                                charsetSentinel:
                                    'boolean' == typeof e.charsetSentinel
                                        ? e.charsetSentinel
                                        : l.charsetSentinel,
                                delimiter:
                                    void 0 === e.delimiter
                                        ? l.delimiter
                                        : e.delimiter,
                                encode:
                                    'boolean' == typeof e.encode
                                        ? e.encode
                                        : l.encode,
                                encoder:
                                    'function' == typeof e.encoder
                                        ? e.encoder
                                        : l.encoder,
                                encodeValuesOnly:
                                    'boolean' == typeof e.encodeValuesOnly
                                        ? e.encodeValuesOnly
                                        : l.encodeValuesOnly,
                                filter: o,
                                formatter: s,
                                serializeDate:
                                    'function' == typeof e.serializeDate
                                        ? e.serializeDate
                                        : l.serializeDate,
                                skipNulls:
                                    'boolean' == typeof e.skipNulls
                                        ? e.skipNulls
                                        : l.skipNulls,
                                sort:
                                    'function' == typeof e.sort ? e.sort : null,
                                strictNullHandling:
                                    'boolean' == typeof e.strictNullHandling
                                        ? e.strictNullHandling
                                        : l.strictNullHandling,
                            }
                        );
                    })(t);
                'function' == typeof c.filter
                    ? (s = (0, c.filter)('', s))
                    : a(c.filter) && (r = c.filter);
                var p,
                    h = [];
                if ('object' != typeof s || null === s) return '';
                p =
                    t && t.arrayFormat in o
                        ? t.arrayFormat
                        : t && 'indices' in t
                        ? t.indices
                            ? 'indices'
                            : 'repeat'
                        : 'indices';
                var m = o[p];
                r || (r = Object.keys(s)), c.sort && r.sort(c.sort);
                for (var f = 0; f < r.length; ++f) {
                    var g = r[f];
                    (c.skipNulls && null === s[g]) ||
                        u(
                            h,
                            d(
                                s[g],
                                g,
                                m,
                                c.strictNullHandling,
                                c.skipNulls,
                                c.encode ? c.encoder : null,
                                c.filter,
                                c.sort,
                                c.allowDots,
                                c.serializeDate,
                                c.formatter,
                                c.encodeValuesOnly,
                                c.charset
                            )
                        );
                }
                var y = h.join(c.delimiter),
                    x = !0 === c.addQueryPrefix ? '?' : '';
                return (
                    c.charsetSentinel &&
                        ('iso-8859-1' === c.charset
                            ? (x += 'utf8=%26%2310003%3B&')
                            : (x += 'utf8=%E2%9C%93&')),
                    y.length > 0 ? x + y : ''
                );
            };
        },
        function(e, t, r) {
            'use strict';
            var s = r(5),
                n = Object.prototype.hasOwnProperty,
                i = {
                    allowDots: !1,
                    allowPrototypes: !1,
                    arrayLimit: 20,
                    charset: 'utf-8',
                    charsetSentinel: !1,
                    comma: !1,
                    decoder: s.decode,
                    delimiter: '&',
                    depth: 5,
                    ignoreQueryPrefix: !1,
                    interpretNumericEntities: !1,
                    parameterLimit: 1e3,
                    parseArrays: !0,
                    plainObjects: !1,
                    strictNullHandling: !1,
                },
                o = function(e) {
                    return e.replace(/&#(\d+);/g, function(e, t) {
                        return String.fromCharCode(parseInt(t, 10));
                    });
                },
                a = function(e, t, r) {
                    if (e) {
                        var s = r.allowDots
                                ? e.replace(/\.([^.[]+)/g, '[$1]')
                                : e,
                            i = /(\[[^[\]]*])/g,
                            o = /(\[[^[\]]*])/.exec(s),
                            a = o ? s.slice(0, o.index) : s,
                            c = [];
                        if (a) {
                            if (
                                !r.plainObjects &&
                                n.call(Object.prototype, a) &&
                                !r.allowPrototypes
                            )
                                return;
                            c.push(a);
                        }
                        for (
                            var u = 0;
                            null !== (o = i.exec(s)) && u < r.depth;

                        ) {
                            if (
                                ((u += 1),
                                !r.plainObjects &&
                                    n.call(
                                        Object.prototype,
                                        o[1].slice(1, -1)
                                    ) &&
                                    !r.allowPrototypes)
                            )
                                return;
                            c.push(o[1]);
                        }
                        return (
                            o && c.push('[' + s.slice(o.index) + ']'),
                            (function(e, t, r) {
                                for (var s = t, n = e.length - 1; n >= 0; --n) {
                                    var i,
                                        o = e[n];
                                    if ('[]' === o && r.parseArrays)
                                        i = [].concat(s);
                                    else {
                                        i = r.plainObjects
                                            ? Object.create(null)
                                            : {};
                                        var a =
                                                '[' === o.charAt(0) &&
                                                ']' === o.charAt(o.length - 1)
                                                    ? o.slice(1, -1)
                                                    : o,
                                            c = parseInt(a, 10);
                                        r.parseArrays || '' !== a
                                            ? !isNaN(c) &&
                                              o !== a &&
                                              String(c) === a &&
                                              c >= 0 &&
                                              r.parseArrays &&
                                              c <= r.arrayLimit
                                                ? ((i = [])[c] = s)
                                                : (i[a] = s)
                                            : (i = { 0: s });
                                    }
                                    s = i;
                                }
                                return s;
                            })(c, t, r)
                        );
                    }
                };
            e.exports = function(e, t) {
                var r = (function(e) {
                    if (!e) return i;
                    if (
                        null !== e.decoder &&
                        void 0 !== e.decoder &&
                        'function' != typeof e.decoder
                    )
                        throw new TypeError('Decoder has to be a function.');
                    if (
                        void 0 !== e.charset &&
                        'utf-8' !== e.charset &&
                        'iso-8859-1' !== e.charset
                    )
                        throw new Error(
                            'The charset option must be either utf-8, iso-8859-1, or undefined'
                        );
                    var t = void 0 === e.charset ? i.charset : e.charset;
                    return {
                        allowDots:
                            void 0 === e.allowDots
                                ? i.allowDots
                                : !!e.allowDots,
                        allowPrototypes:
                            'boolean' == typeof e.allowPrototypes
                                ? e.allowPrototypes
                                : i.allowPrototypes,
                        arrayLimit:
                            'number' == typeof e.arrayLimit
                                ? e.arrayLimit
                                : i.arrayLimit,
                        charset: t,
                        charsetSentinel:
                            'boolean' == typeof e.charsetSentinel
                                ? e.charsetSentinel
                                : i.charsetSentinel,
                        comma: 'boolean' == typeof e.comma ? e.comma : i.comma,
                        decoder:
                            'function' == typeof e.decoder
                                ? e.decoder
                                : i.decoder,
                        delimiter:
                            'string' == typeof e.delimiter ||
                            s.isRegExp(e.delimiter)
                                ? e.delimiter
                                : i.delimiter,
                        depth: 'number' == typeof e.depth ? e.depth : i.depth,
                        ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
                        interpretNumericEntities:
                            'boolean' == typeof e.interpretNumericEntities
                                ? e.interpretNumericEntities
                                : i.interpretNumericEntities,
                        parameterLimit:
                            'number' == typeof e.parameterLimit
                                ? e.parameterLimit
                                : i.parameterLimit,
                        parseArrays: !1 !== e.parseArrays,
                        plainObjects:
                            'boolean' == typeof e.plainObjects
                                ? e.plainObjects
                                : i.plainObjects,
                        strictNullHandling:
                            'boolean' == typeof e.strictNullHandling
                                ? e.strictNullHandling
                                : i.strictNullHandling,
                    };
                })(t);
                if ('' === e || null == e)
                    return r.plainObjects ? Object.create(null) : {};
                for (
                    var c =
                            'string' == typeof e
                                ? (function(e, t) {
                                      var r,
                                          a = {},
                                          c = t.ignoreQueryPrefix
                                              ? e.replace(/^\?/, '')
                                              : e,
                                          u =
                                              t.parameterLimit === 1 / 0
                                                  ? void 0
                                                  : t.parameterLimit,
                                          p = c.split(t.delimiter, u),
                                          l = -1,
                                          d = t.charset;
                                      if (t.charsetSentinel)
                                          for (r = 0; r < p.length; ++r)
                                              0 === p[r].indexOf('utf8=') &&
                                                  ('utf8=%E2%9C%93' === p[r]
                                                      ? (d = 'utf-8')
                                                      : 'utf8=%26%2310003%3B' ===
                                                            p[r] &&
                                                        (d = 'iso-8859-1'),
                                                  (l = r),
                                                  (r = p.length));
                                      for (r = 0; r < p.length; ++r)
                                          if (r !== l) {
                                              var h,
                                                  m,
                                                  f = p[r],
                                                  g = f.indexOf(']='),
                                                  y =
                                                      -1 === g
                                                          ? f.indexOf('=')
                                                          : g + 1;
                                              -1 === y
                                                  ? ((h = t.decoder(
                                                        f,
                                                        i.decoder,
                                                        d
                                                    )),
                                                    (m = t.strictNullHandling
                                                        ? null
                                                        : ''))
                                                  : ((h = t.decoder(
                                                        f.slice(0, y),
                                                        i.decoder,
                                                        d
                                                    )),
                                                    (m = t.decoder(
                                                        f.slice(y + 1),
                                                        i.decoder,
                                                        d
                                                    ))),
                                                  m &&
                                                      t.interpretNumericEntities &&
                                                      'iso-8859-1' === d &&
                                                      (m = o(m)),
                                                  m &&
                                                      t.comma &&
                                                      m.indexOf(',') > -1 &&
                                                      (m = m.split(',')),
                                                  n.call(a, h)
                                                      ? (a[h] = s.combine(
                                                            a[h],
                                                            m
                                                        ))
                                                      : (a[h] = m);
                                          }
                                      return a;
                                  })(e, r)
                                : e,
                        u = r.plainObjects ? Object.create(null) : {},
                        p = Object.keys(c),
                        l = 0;
                    l < p.length;
                    ++l
                ) {
                    var d = p[l],
                        h = a(d, c[d], r);
                    u = s.merge(u, h, r);
                }
                return s.compact(u);
            };
        },
        function(e, t) {
            e.exports = require('child_process');
        },
        function(e, t, r) {
            'use strict';
            const s = r(9),
                n = r(1);
            function i() {
                return 'undefined' != typeof Symbol && Symbol.asyncIterator
                    ? Symbol.asyncIterator
                    : '@@asyncIterator';
            }
            function o(e) {
                if (e.length < 2) return;
                const t = e[1];
                if ('function' != typeof t)
                    throw Error(
                        `The second argument to autoPagingEach, if present, must be a callback function; receieved ${typeof t}`
                    );
                return t;
            }
            function a(e) {
                if (0 === e.length) return;
                const t = e[0];
                if ('function' != typeof t)
                    throw Error(
                        `The first argument to autoPagingEach, if present, must be a callback function; receieved ${typeof t}`
                    );
                if (2 === t.length) return t;
                if (t.length > 2)
                    throw Error(
                        `The \`onItem\` callback function passed to autoPagingEach must accept at most two arguments; got ${t}`
                    );
                return function(e, r) {
                    r(t(e));
                };
            }
            function c(e, t) {
                return new Promise((r, s) => {
                    e()
                        .then(function s(n) {
                            if (n.done) return void r();
                            const i = n.value;
                            return new Promise(e => {
                                t(i, e);
                            }).then(t =>
                                !1 === t ? s({ done: !0 }) : e().then(s)
                            );
                        })
                        .catch(s);
                });
            }
            e.exports.makeAutoPaginationMethods = function(e, t, r, u) {
                const p = { currentPromise: null };
                let l = u,
                    d = 0;
                function h(n) {
                    if (!n || !n.data || 'number' != typeof n.data.length)
                        throw Error(
                            'Unexpected: Stripe API response does not have a well-formed `data` array.'
                        );
                    if (d < n.data.length) {
                        const e = n.data[d];
                        return (d += 1), { value: e, done: !1 };
                    }
                    if (n.has_more) {
                        d = 0;
                        const i = (function(e) {
                            const t = e.data.length - 1,
                                r = e.data[t],
                                s = r && r.id;
                            if (!s)
                                throw Error(
                                    'Unexpected: No `id` found on the last item while auto-paging a list.'
                                );
                            return s;
                        })(n);
                        return (
                            (l = s(e, t, r, { starting_after: i })), l.then(h)
                        );
                    }
                    return { value: void 0, done: !0 };
                }
                function m() {
                    return (function(e, t) {
                        if (e.currentPromise) return e.currentPromise;
                        return (
                            (e.currentPromise = new Promise(t).then(
                                t => ((e.currentPromise = void 0), t)
                            )),
                            e.currentPromise
                        );
                    })(p, (e, t) =>
                        l
                            .then(h)
                            .then(e)
                            .catch(t)
                    );
                }
                const f = (function(e) {
                        return function() {
                            const t = [].slice.call(arguments),
                                r = a(t),
                                s = o(t);
                            if (t.length > 2)
                                throw Error(
                                    'autoPagingEach takes up to two arguments; received:',
                                    t
                                );
                            const i = c(e, r);
                            return n.callbackifyPromiseWithTimeout(i, s);
                        };
                    })(m),
                    g = (function(e) {
                        return function(t, r) {
                            const s = t && t.limit;
                            if (!s)
                                throw Error(
                                    'You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`.'
                                );
                            if (s > 1e4)
                                throw Error(
                                    'You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.'
                                );
                            const i = new Promise((t, r) => {
                                const n = [];
                                e(e => {
                                    if ((n.push(e), n.length >= s)) return !1;
                                })
                                    .then(() => {
                                        t(n);
                                    })
                                    .catch(r);
                            });
                            return n.callbackifyPromiseWithTimeout(i, r);
                        };
                    })(f),
                    y = {
                        autoPagingEach: f,
                        autoPagingToArray: g,
                        next: m,
                        return: () => ({}),
                        [i()]: () => y,
                    };
                return y;
            };
        },
        function(e, t, r) {
            'use strict';
            const s = r(8);
            e.exports = {
                create: s({ method: 'POST' }),
                list: s({ method: 'GET', methodType: 'list' }),
                retrieve: s({ method: 'GET', path: '/{id}' }),
                update: s({ method: 'POST', path: '{id}' }),
                del: s({ method: 'DELETE', path: '{id}' }),
            };
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'account_links',
                includeBasic: ['create'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'apple_pay/domains',
                includeBasic: ['create', 'del', 'list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'application_fees',
                includeBasic: ['list', 'retrieve'],
                createRefund: n({ method: 'POST', path: '/{id}/refunds' }),
                listRefunds: n({
                    method: 'GET',
                    path: '/{id}/refunds',
                    methodType: 'list',
                }),
                retrieveRefund: n({
                    method: 'GET',
                    path: '/{fee}/refunds/{id}',
                }),
                updateRefund: n({
                    method: 'POST',
                    path: '/{fee}/refunds/{id}',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'balance',
                retrieve: n({ method: 'GET', path: '' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'balance_transactions',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'charges',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                capture: n({ method: 'POST', path: '/{charge}/capture' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'country_specs',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'coupons',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'credit_notes',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                preview: n({ method: 'GET', path: '/preview' }),
                voidCreditNote: n({ method: 'POST', path: '/{id}/void' }),
                listLineItems: n({
                    method: 'GET',
                    path: '/{creditNote}/lines',
                    methodType: 'list',
                }),
                listPreviewLineItems: n({
                    method: 'GET',
                    path: '/preview/lines',
                    methodType: 'list',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'customers',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
                deleteDiscount: n({
                    method: 'DELETE',
                    path: '/{customer}/discount',
                }),
                createBalanceTransaction: n({
                    method: 'POST',
                    path: '/{customer}/balance_transactions',
                }),
                listBalanceTransactions: n({
                    method: 'GET',
                    path: '/{customer}/balance_transactions',
                    methodType: 'list',
                }),
                retrieveBalanceTransaction: n({
                    method: 'GET',
                    path: '/{customer}/balance_transactions/{transaction}',
                }),
                updateBalanceTransaction: n({
                    method: 'POST',
                    path: '/{customer}/balance_transactions/{transaction}',
                }),
                createSource: n({
                    method: 'POST',
                    path: '/{customer}/sources',
                }),
                listSources: n({
                    method: 'GET',
                    path: '/{customer}/sources',
                    methodType: 'list',
                }),
                retrieveSource: n({
                    method: 'GET',
                    path: '/{customer}/sources/{id}',
                }),
                updateSource: n({
                    method: 'POST',
                    path: '/{customer}/sources/{id}',
                }),
                deleteSource: n({
                    method: 'DELETE',
                    path: '/{customer}/sources/{id}',
                }),
                verifySource: n({
                    method: 'POST',
                    path: '/{customer}/sources/{id}/verify',
                }),
                createTaxId: n({ method: 'POST', path: '/{customer}/tax_ids' }),
                deleteTaxId: n({
                    method: 'DELETE',
                    path: '/{customer}/tax_ids/{id}',
                }),
                listTaxIds: n({
                    method: 'GET',
                    path: '/{customer}/tax_ids',
                    methodType: 'list',
                }),
                retrieveTaxId: n({
                    method: 'GET',
                    path: '/{customer}/tax_ids/{id}',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'disputes',
                includeBasic: ['list', 'retrieve', 'update'],
                close: n({ method: 'POST', path: '/{dispute}/close' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'ephemeral_keys',
                includeBasic: ['del'],
                create: n({
                    method: 'POST',
                    path: '',
                    validator: (e, t) => {
                        if (!t.headers || !t.headers['Stripe-Version'])
                            throw new Error(
                                'stripe_version must be specified to create an ephemeral key'
                            );
                    },
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'events',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'exchange_rates',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const { multipartRequestDataProcessor: s } = r(38),
                n = r(0),
                i = n.method;
            e.exports = n.extend({
                path: 'files',
                includeBasic: ['list', 'retrieve'],
                create: i({
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    host: 'files.stripe.com',
                }),
                requestDataProcessor: s,
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(1),
                { StripeError: n } = r(2);
            class i extends n {}
            const o = (e, t, r) => {
                const n = (
                    Math.round(1e16 * Math.random()) +
                    Math.round(1e16 * Math.random())
                ).toString();
                r['Content-Type'] = `multipart/form-data; boundary=${n}`;
                let i = Buffer.alloc(0);
                function o(e) {
                    const t = i,
                        r = e instanceof Buffer ? e : Buffer.from(e);
                    (i = Buffer.alloc(t.length + r.length + 2)),
                        t.copy(i),
                        r.copy(i, t.length),
                        i.write('\r\n', i.length - 2);
                }
                function a(e) {
                    return `"${e
                        .replace(/"|"/g, '%22')
                        .replace(/\r\n|\r|\n/g, ' ')}"`;
                }
                const c = s.flattenAndStringify(t);
                for (const e in c) {
                    const t = c[e];
                    o(`--${n}`),
                        t.hasOwnProperty('data')
                            ? (o(
                                  `Content-Disposition: form-data; name=${a(
                                      e
                                  )}; filename=${a(t.name || 'blob')}`
                              ),
                              o(
                                  `Content-Type: ${t.type ||
                                      'application/octet-stream'}`
                              ),
                              o(''),
                              o(t.data))
                            : (o(
                                  `Content-Disposition: form-data; name=${a(e)}`
                              ),
                              o(''),
                              o(t));
                }
                return o(`--${n}--`), i;
            };
            e.exports.multipartRequestDataProcessor = (e, t, r, n) => {
                if (((t = t || {}), 'POST' !== e))
                    return n(null, s.stringifyRequestData(t));
                return s.checkForStream(t)
                    ? ((e, t, r, s) => {
                          const n = [];
                          t.file.data
                              .on('data', e => {
                                  n.push(e);
                              })
                              .once('end', () => {
                                  const e = Object.assign({}, t);
                                  e.file.data = Buffer.concat(n);
                                  const i = o(0, e, r);
                                  s(null, i);
                              })
                              .on('error', e => {
                                  s(
                                      new i({
                                          message:
                                              'An error occurred while attempting to process the file for upload.',
                                          detail: e,
                                      }),
                                      null
                                  );
                              });
                      })(0, t, r, n)
                    : n(null, o(0, t, r));
            };
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'file_links',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'invoices',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
                finalizeInvoice: n({
                    method: 'POST',
                    path: '/{invoice}/finalize',
                }),
                markUncollectible: n({
                    method: 'POST',
                    path: '/{invoice}/mark_uncollectible',
                }),
                pay: n({ method: 'POST', path: '/{invoice}/pay' }),
                sendInvoice: n({ method: 'POST', path: '/{invoice}/send' }),
                retrieveUpcoming: n({ method: 'GET', path: '/upcoming' }),
                voidInvoice: n({ method: 'POST', path: '/{invoice}/void' }),
                listLineItems: n({
                    method: 'GET',
                    path: '/{invoice}/lines',
                    methodType: 'list',
                }),
                listUpcomingLineItems: n({
                    method: 'GET',
                    path: '/upcoming/lines',
                    methodType: 'list',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'invoiceitems',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'issuer_fraud_records',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'mandates',
                includeBasic: ['retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method,
                i = r(1),
                o = 'connect.stripe.com';
            e.exports = s.extend({
                basePath: '/',
                authorizeUrl(e, t) {
                    e = e || {};
                    let r = 'oauth/authorize';
                    return (
                        (t = t || {}).express && (r = `express/${r}`),
                        e.response_type || (e.response_type = 'code'),
                        e.client_id ||
                            (e.client_id = this._stripe.getClientId()),
                        e.scope || (e.scope = 'read_write'),
                        `https://${o}/${r}?${i.stringifyRequestData(e)}`
                    );
                },
                token: n({ method: 'POST', path: 'oauth/token', host: o }),
                deauthorize(e) {
                    return (
                        e.client_id ||
                            (e.client_id = this._stripe.getClientId()),
                        n({
                            method: 'POST',
                            path: 'oauth/deauthorize',
                            host: o,
                        }).apply(this, arguments)
                    );
                },
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'orders',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                pay: n({ method: 'POST', path: '/{id}/pay' }),
                returnOrder: n({ method: 'POST', path: '/{id}/returns' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'order_returns',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'payment_intents',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                cancel: n({ method: 'POST', path: '/{intent}/cancel' }),
                capture: n({ method: 'POST', path: '/{intent}/capture' }),
                confirm: n({ method: 'POST', path: '/{intent}/confirm' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'payment_methods',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                attach: n({ method: 'POST', path: '/{paymentMethod}/attach' }),
                detach: n({ method: 'POST', path: '/{paymentMethod}/detach' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'payouts',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                cancel: n({ method: 'POST', path: '/{payout}/cancel' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'plans',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'products',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'refunds',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'reviews',
                includeBasic: ['list', 'retrieve'],
                approve: n({ method: 'POST', path: '/{review}/approve' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'setup_intents',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                cancel: n({ method: 'POST', path: '/{intent}/cancel' }),
                confirm: n({ method: 'POST', path: '/{intent}/confirm' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'skus',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'sources',
                includeBasic: ['create', 'retrieve', 'update'],
                listSourceTransactions: n({
                    method: 'GET',
                    path: '/{source}/source_transactions',
                    methodType: 'list',
                }),
                verify: n({ method: 'POST', path: '/{source}/verify' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'subscriptions',
                includeBasic: ['create', 'list', 'retrieve', 'update', 'del'],
                deleteDiscount: n({
                    method: 'DELETE',
                    path: '/{subscriptionExposedId}/discount',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'subscription_items',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
                createUsageRecord: n({
                    method: 'POST',
                    path: '/{subscriptionItem}/usage_records',
                }),
                listUsageRecordSummaries: n({
                    method: 'GET',
                    path: '/{subscriptionItem}/usage_record_summaries',
                    methodType: 'list',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'subscription_schedules',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                cancel: n({ method: 'POST', path: '/{schedule}/cancel' }),
                release: n({ method: 'POST', path: '/{schedule}/release' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'tax_rates',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'tokens',
                includeBasic: ['create', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'topups',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                cancel: n({ method: 'POST', path: '/{topup}/cancel' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'transfers',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                createReversal: n({ method: 'POST', path: '/{id}/reversals' }),
                listReversals: n({
                    method: 'GET',
                    path: '/{id}/reversals',
                    methodType: 'list',
                }),
                retrieveReversal: n({
                    method: 'GET',
                    path: '/{transfer}/reversals/{id}',
                }),
                updateReversal: n({
                    method: 'POST',
                    path: '/{transfer}/reversals/{id}',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'webhook_endpoints',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'checkout/sessions',
                includeBasic: ['create', 'list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'issuing/authorizations',
                includeBasic: ['list', 'retrieve', 'update'],
                approve: n({
                    method: 'POST',
                    path: '/{authorization}/approve',
                }),
                decline: n({
                    method: 'POST',
                    path: '/{authorization}/decline',
                }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0),
                n = s.method;
            e.exports = s.extend({
                path: 'issuing/cards',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
                retrieveDetails: n({ method: 'GET', path: '/{card}/details' }),
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'issuing/cardholders',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'issuing/disputes',
                includeBasic: ['create', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'issuing/transactions',
                includeBasic: ['list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'radar/early_fraud_warnings',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'radar/value_lists',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'radar/value_list_items',
                includeBasic: ['create', 'del', 'list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'reporting/report_runs',
                includeBasic: ['create', 'list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'reporting/report_types',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'sigma/scheduled_query_runs',
                includeBasic: ['list', 'retrieve'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'terminal/connection_tokens',
                includeBasic: ['create'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'terminal/locations',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e, t, r) {
            'use strict';
            const s = r(0);
            e.exports = s.extend({
                path: 'terminal/readers',
                includeBasic: ['create', 'del', 'list', 'retrieve', 'update'],
            });
        },
        function(e) {
            e.exports = JSON.parse(
                '{"name":"stripe","version":"8.32.0","description":"Stripe API wrapper","keywords":["stripe","payment processing","credit cards","api"],"homepage":"https://github.com/stripe/stripe-node","author":"Stripe <support@stripe.com> (https://stripe.com/)","contributors":["Ask Bjørn Hansen <ask@develooper.com> (http://www.askask.com/)","Michelle Bu <michelle@stripe.com>","Alex Sexton <alex@stripe.com>","James Padolsey"],"repository":{"type":"git","url":"git://github.com/stripe/stripe-node.git"},"bugs:":"https://github.com/stripe/stripe-node/issues","engines":{"node":"^8.1 || >=10.*"},"main":"lib/stripe.js","types":"types/2020-03-02/index.d.ts","devDependencies":{"@typescript-eslint/eslint-plugin":"^2.13.0","@typescript-eslint/parser":"^2.13.0","chai":"~4.2.0","chai-as-promised":"~7.1.1","coveralls":"^3.0.0","eslint":"^6.8.0","eslint-config-prettier":"^4.1.0","eslint-plugin-chai-friendly":"^0.4.0","eslint-plugin-prettier":"^3.0.1","mocha":"~6.1.4","mocha-junit-reporter":"^1.23.1","nock":"^10.0.6","nyc":"^14.1.0","prettier":"^1.16.4","typescript":"^3.7.2"},"dependencies":{"@types/node":">=8.1.0","qs":"^6.6.0"},"license":"MIT","scripts":{"clean":"rm -rf ./.nyc_output ./node_modules/.cache ./coverage","mocha":"nyc mocha","mocha-only":"mocha","test":"yarn lint && yarn test-typescript && yarn mocha","test-typescript":"tsc --build types/test","lint":"eslint --ext .js,.jsx,.ts .","fix":"yarn lint --fix","report":"nyc -r text -r lcov report","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js"},"_resolved":"https://registry.npmjs.org/stripe/-/stripe-8.32.0.tgz","_integrity":"sha512-38saMK54VCgVZO9vn1kZFRZQH1+S4Y09e9vdbilNXHuVPD6S66ISiDpnaKLDjrl8QxKWCmNjDWnarJQSxETYGA==","_from":"stripe@8.32.0"}'
            );
        },
        ,
        ,
        function(e, t, r) {
            'use strict';
            r.r(t),
                r.d(t, 'handler', function() {
                    return n;
                });
            const s = r(11)(process.env.GATSBY_STRIPE_SECRET_KEY);
            function n(e, t, r) {
                const n = JSON.parse(e.body),
                    { stripeId: i } = n;
                s.paymentIntents
                    .list({ customer: i }, function(e, t) {
                        if (e)
                            return (
                                console.error(
                                    'Error fetching stripe payment intents: ',
                                    e
                                ),
                                r(null, {
                                    statusCode: 401,
                                    body: JSON.stringify({ error: e }),
                                })
                            );
                        r(null, {
                            statusCode: 200,
                            body: JSON.stringify({
                                message: 'Payment intents list',
                                paymentIntents: t,
                            }),
                        });
                    })
                    .catch(
                        e => (
                            console.error('error', e),
                            r(null, {
                                statusCode: 401,
                                body: JSON.stringify({ error: e.message }),
                            })
                        )
                    );
            }
        },
    ])
);
