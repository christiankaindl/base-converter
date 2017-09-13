! function(e, n) {
    "object" == typeof exports && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ? define(["exports"], n) : n(e.hyperapp = {})
}(this, function(e) {
    "use strict";

    function n(e, n) {
        var t, a = [];
        for (r = arguments.length; r-- > 2;) o.push(arguments[r]);
        for (; o.length;)
            if (Array.isArray(t = o.pop()))
                for (r = t.length; r--;) o.push(t[r]);
            else null != t && !0 !== t && !1 !== t && ("number" == typeof t && (t += ""), a.push(t));
        return "string" == typeof e ? {
            tag: e,
            data: n || {},
            children: a
        } : e(n, a)
    }

    function t(e) {
        function n(e, t, r) {
            Object.keys(t || []).map(function(a) {
                var f = t[a],
                    u = r ? r + "." + a : a;
                "function" == typeof f ? e[a] = function(e) {
                    i("action", {
                        name: u,
                        data: e
                    });
                    var n = i("resolve", f(v, b, e));
                    return "function" == typeof n ? n(o) : o(n)
                } : n(e[a] || (e[a] = {}), f, u)
            })
        }

        function t(e) {
            for (h = p(x, h, y, y = i("render", m)(v, b), g = !g); e = a.pop();) e()
        }

        function r() {
            m && !g && requestAnimationFrame(t, g = !g)
        }

        function o(e) {
            return "function" == typeof e ? o(e(v)) : (e && (e = i("update", f(v, e))) && r(v = e), v)
        }

        function i(e, n) {
            return (k[e] || []).map(function(e) {
                var t = e(v, b, n);
                null != t && (n = t)
            }), n
        }

        function f(e, n) {
            var t = {};
            for (var r in e) t[r] = e[r];
            for (var r in n) t[r] = n[r];
            return t
        }

        function u(e) {
            if (e && (e = e.data)) return e.key
        }

        function c(e, n) {
            if ("string" == typeof e) var t = document.createTextNode(e);
            else {
                var t = (n = n || "svg" === e.tag) ? document.createElementNS("http://www.w3.org/2000/svg", e.tag) : document.createElement(e.tag);
                e.data && e.data.oncreate && a.push(function() {
                    e.data.oncreate(t)
                });
                for (var r in e.data) l(t, r, e.data[r]);
                for (var r = 0; r < e.children.length;) t.appendChild(c(e.children[r++], n))
            }
            return t
        }

        function l(e, n, t, r) {
            if ("key" === n);
            else if ("style" === n)
                for (var o in f(r, t = t || {})) e.style[o] = t[o] || "";
            else {
                try {
                    e[n] = t
                } catch (e) {}
                "function" != typeof t && (t ? e.setAttribute(n, t) : e.removeAttribute(n))
            }
        }

        function d(e, n, t) {
            for (var r in f(n, t)) {
                var o = t[r],
                    i = "value" === r || "checked" === r ? e[r] : n[r];
                o !== i && l(e, r, o, i)
            }
            t && t.onupdate && a.push(function() {
                t.onupdate(e, n)
            })
        }

        function s(e, n, t) {
            t && t.onremove ? t.onremove(n) : e.removeChild(n)
        }

        function p(e, n, t, r, o, a) {
            if (null == t) n = e.insertBefore(c(r, o), n);
            else if (null != r.tag && r.tag === t.tag) {
                d(n, t.data, r.data), o = o || "svg" === r.tag;
                for (var i = r.children.length, f = t.children.length, l = {}, v = [], h = {}, y = 0; y < f; y++) {
                    var g = v[y] = n.childNodes[y],
                        m = t.children[y],
                        b = u(m);
                    null != b && (l[b] = [g, m])
                }
                for (var y = 0, k = 0; k < i;) {
                    var g = v[y],
                        m = t.children[y],
                        w = r.children[k],
                        b = u(m);
                    if (h[b]) y++;
                    else {
                        var x = u(w),
                            A = l[x] || [];
                        null == x ? (null == b && (p(n, g, m, w, o), k++), y++) : (b === x ? (p(n, A[0], A[1], w, o), y++) : A[0] ? (n.insertBefore(A[0], g), p(n, A[0], A[1], w, o)) : p(n, g, null, w, o), k++, h[x] = w)
                    }
                }
                for (; y < f;) {
                    var m = t.children[y],
                        b = u(m);
                    null == b && s(n, v[y], m.data), y++
                }
                for (var y in l) {
                    var A = l[y],
                        j = A[1];
                    h[j.data.key] || s(n, A[0], j.data)
                }
            } else n && r !== n.nodeValue && ("string" == typeof r && "string" == typeof t ? n.nodeValue = r : (n = e.insertBefore(c(r, o), a = n), s(e, a, t.data)));
            return n
        }
        var v, h, y, g, m = e.view,
            b = {},
            k = {},
            w = e.mixins || [],
            x = e.root || document.body;
        return w.concat(e).map(function(e) {
            e = "function" == typeof e ? e(i) : e, Object.keys(e.events || []).map(function(n) {
                k[n] = (k[n] || []).concat(e.events[n])
            }), v = f(v, e.state), n(b, e.actions)
        }), r((y = i("load", h = x.children[0])) === h && (y = h = null)), i
    }
    var r, o = [],
        a = [];
    e.h = n, e.app = t
});
//# sourceMappingURL=hyperapp.js.map
