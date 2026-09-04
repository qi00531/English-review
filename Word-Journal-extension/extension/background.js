//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l;
function u(e, t, n) {
	function r(n, r) {
		if (n._zod || Object.defineProperty(n, "_zod", {
			value: {
				def: r,
				constr: o,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: !1
		}), n._zod.traits.has(e)) return;
		n._zod.traits.add(e), t(n, r);
		let i = o.prototype, a = Object.keys(i);
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			t in n || (n[t] = i[t].bind(n));
		}
	}
	let i = n?.Parent ?? Object;
	class a extends i {}
	Object.defineProperty(a, "name", { value: e });
	function o(e) {
		var t;
		let i = n?.Parent ? new a() : this;
		r(i, e), (t = i._zod).deferred ?? (t.deferred = []);
		for (let e of i._zod.deferred) e();
		return i;
	}
	return Object.defineProperty(o, "init", { value: r }), Object.defineProperty(o, Symbol.hasInstance, { value: (t) => n?.Parent && t instanceof n.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(o, "name", { value: e }), o;
}
var d = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, f = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(l = globalThis).__zod_globalConfig ?? (l.__zod_globalConfig = {});
var p = globalThis.__zod_globalConfig;
function m(e) {
	return e && Object.assign(p, e), p;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
function h(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function g(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
function _(e) {
	return { get value() {
		{
			let t = e();
			return Object.defineProperty(this, "value", { value: t }), t;
		}
	} };
}
function v(e) {
	return e == null;
}
function y(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
var b = /* @__PURE__*/ Symbol("evaluating");
function x(e, t, n) {
	let r;
	Object.defineProperty(e, t, {
		get() {
			if (r !== b) return r === void 0 && (r = b, r = n()), r;
		},
		set(n) {
			Object.defineProperty(e, t, { value: n });
		},
		configurable: !0
	});
}
function S(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function C(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function ee(e) {
	return JSON.stringify(e);
}
function te(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var ne = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function re(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var ie = /* @__PURE__*/ _(() => {
	if (p.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function ae(e) {
	if (re(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return re(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function oe(e) {
	return ae(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var se = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function ce(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function w(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function T(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function le(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
-Number.MAX_VALUE, Number.MAX_VALUE;
function ue(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	return w(e, C(e._zod.def, {
		get shape() {
			let e = {};
			for (let r in t) {
				if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
				t[r] && (e[r] = n.shape[r]);
			}
			return S(this, "shape", e), e;
		},
		checks: []
	}));
}
function E(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	return w(e, C(e._zod.def, {
		get shape() {
			let r = { ...e._zod.def.shape };
			for (let e in t) {
				if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
				t[e] && delete r[e];
			}
			return S(this, "shape", r), r;
		},
		checks: []
	}));
}
function de(e, t) {
	if (!ae(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = e._zod.def.shape;
		for (let e in t) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return w(e, C(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return S(this, "shape", n), n;
	} }));
}
function fe(e, t) {
	if (!ae(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return w(e, C(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return S(this, "shape", n), n;
	} }));
}
function pe(e, t) {
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return w(e, C(e._zod.def, {
		get shape() {
			let n = {
				...e._zod.def.shape,
				...t._zod.def.shape
			};
			return S(this, "shape", n), n;
		},
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function me(e, t, n) {
	let r = t._zod.def.checks;
	if (r && r.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
	return w(t, C(t._zod.def, {
		get shape() {
			let r = t._zod.def.shape, i = { ...r };
			if (n) for (let t in n) {
				if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
				n[t] && (i[t] = e ? new e({
					type: "optional",
					innerType: r[t]
				}) : r[t]);
			}
			else for (let t in r) i[t] = e ? new e({
				type: "optional",
				innerType: r[t]
			}) : r[t];
			return S(this, "shape", i), i;
		},
		checks: []
	}));
}
function he(e, t, n) {
	return w(t, C(t._zod.def, { get shape() {
		let r = t._zod.def.shape, i = { ...r };
		if (n) for (let t in n) {
			if (!(t in i)) throw Error(`Unrecognized key: "${t}"`);
			n[t] && (i[t] = new e({
				type: "nonoptional",
				innerType: r[t]
			}));
		}
		else for (let t in r) i[t] = new e({
			type: "nonoptional",
			innerType: r[t]
		});
		return S(this, "shape", i), i;
	} }));
}
function ge(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function _e(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function D(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function ve(e) {
	return typeof e == "string" ? e : e?.message;
}
function O(e, t, n) {
	let r = e.message ? e.message : ve(e.inst?._zod.def?.error?.(e)) ?? ve(t?.error?.(e)) ?? ve(n.customError?.(e)) ?? ve(n.localeError?.(e)) ?? "Invalid input", { inst: i, continue: a, input: o, ...s } = e;
	return s.path ??= [], s.message = r, t?.reportInput && (s.input = o), s;
}
function ye(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function be(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
var xe = (e, t) => {
	e.name = "$ZodError", Object.defineProperty(e, "_zod", {
		value: e._zod,
		enumerable: !1
	}), Object.defineProperty(e, "issues", {
		value: t,
		enumerable: !1
	}), e.message = JSON.stringify(t, g, 2), Object.defineProperty(e, "toString", {
		value: () => e.message,
		enumerable: !1
	});
}, Se = u("$ZodError", xe), Ce = u("$ZodError", xe, { Parent: Error });
function we(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? (n[i.path[0]] = n[i.path[0]] || [], n[i.path[0]].push(t(i))) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function Te(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e, i = []) => {
		for (let a of e.issues) if (a.code === "invalid_union" && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === "invalid_key") r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === "invalid_element") r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n, i = 0;
				for (; i < e.length;) {
					let n = e[i];
					i === e.length - 1 ? (r[n] = r[n] || { _errors: [] }, r[n]._errors.push(t(a))) : r[n] = r[n] || { _errors: [] }, r = r[n], i++;
				}
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
var Ee = (e) => (t, n, r, i) => {
	let a = r ? {
		...r,
		async: !1
	} : { async: !1 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise) throw new d();
	if (o.issues.length) {
		let t = new ((i?.Err) ?? e)(o.issues.map((e) => O(e, a, m())));
		throw ne(t, i?.callee), t;
	}
	return o.value;
}, k = (e) => async (t, n, r, i) => {
	let a = r ? {
		...r,
		async: !0
	} : { async: !0 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise && (o = await o), o.issues.length) {
		let t = new ((i?.Err) ?? e)(o.issues.map((e) => O(e, a, m())));
		throw ne(t, i?.callee), t;
	}
	return o.value;
}, De = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new d();
	return a.issues.length ? {
		success: !1,
		error: new (e ?? Se)(a.issues.map((e) => O(e, i, m())))
	} : {
		success: !0,
		data: a.value
	};
}, Oe = /* @__PURE__*/ De(Ce), ke = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? {
		success: !1,
		error: new e(a.issues.map((e) => O(e, i, m())))
	} : {
		success: !0,
		data: a.value
	};
}, Ae = /* @__PURE__*/ ke(Ce), je = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Ee(e)(t, n, i);
}, Me = (e) => (t, n, r) => Ee(e)(t, n, r), Ne = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return k(e)(t, n, i);
}, Pe = (e) => async (t, n, r) => k(e)(t, n, r), Fe = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return De(e)(t, n, i);
}, Ie = (e) => (t, n, r) => De(e)(t, n, r), Le = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return ke(e)(t, n, i);
}, Re = (e) => async (t, n, r) => ke(e)(t, n, r), ze = /^[cC][0-9a-z]{6,}$/, Be = /^[0-9a-z]+$/, A = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Ve = /^[0-9a-vA-V]{20}$/, He = /^[A-Za-z0-9]{27}$/, Ue = /^[a-zA-Z0-9_-]{21}$/, j = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, We = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Ge = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Ke = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, qe = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Je() {
	return new RegExp(qe, "u");
}
var Ye = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Xe = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Ze = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Qe = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, $e = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, et = /^[A-Za-z0-9_-]*$/, M = /^https?$/, N = /^\+[1-9]\d{6,14}$/, tt = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", nt = /*@__PURE__*/ RegExp(`^${tt}$`);
function rt(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function it(e) {
	return RegExp(`^${rt(e)}$`);
}
function at(e) {
	let t = rt({ precision: e.precision }), n = ["Z"];
	e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let r = `${t}(?:${n.join("|")})`;
	return RegExp(`^${tt}T(?:${r})$`);
}
var ot = (e) => {
	let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
	return RegExp(`^${t}$`);
}, st = /^[^A-Z]*$/, ct = /^[^a-z]*$/, P = /*@__PURE__*/ u("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), lt = /*@__PURE__*/ u("$ZodCheckMaxLength", (e, t) => {
	var n;
	P.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !v(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.maximum ?? Infinity;
		t.maximum < n && (e._zod.bag.maximum = t.maximum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length <= t.maximum) return;
		let i = ye(r);
		n.issues.push({
			origin: i,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), ut = /*@__PURE__*/ u("$ZodCheckMinLength", (e, t) => {
	var n;
	P.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !v(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.minimum ?? -Infinity;
		t.minimum > n && (e._zod.bag.minimum = t.minimum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length >= t.minimum) return;
		let i = ye(r);
		n.issues.push({
			origin: i,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), dt = /*@__PURE__*/ u("$ZodCheckLengthEquals", (e, t) => {
	var n;
	P.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !v(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.minimum = t.length, n.maximum = t.length, n.length = t.length;
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if (i === t.length) return;
		let a = ye(r), o = i > t.length;
		n.issues.push({
			origin: a,
			...o ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), F = /*@__PURE__*/ u("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	P.init(e, t), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.format = t.format, t.pattern && (n.patterns ??= /* @__PURE__ */ new Set(), n.patterns.add(t.pattern));
	}), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), ft = /*@__PURE__*/ u("$ZodCheckRegex", (e, t) => {
	F.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), pt = /*@__PURE__*/ u("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= st, F.init(e, t);
}), I = /*@__PURE__*/ u("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= ct, F.init(e, t);
}), mt = /*@__PURE__*/ u("$ZodCheckIncludes", (e, t) => {
	P.init(e, t);
	let n = ce(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
	t.pattern = r, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(r);
	}), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), ht = /*@__PURE__*/ u("$ZodCheckStartsWith", (e, t) => {
	P.init(e, t);
	let n = RegExp(`^${ce(t.prefix)}.*`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), gt = /*@__PURE__*/ u("$ZodCheckEndsWith", (e, t) => {
	P.init(e, t);
	let n = RegExp(`.*${ce(t.suffix)}$`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), _t = /*@__PURE__*/ u("$ZodCheckOverwrite", (e, t) => {
	P.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), vt = class {
	constructor(e = []) {
		this.content = [], this.indent = 0, this && (this.args = e);
	}
	indented(e) {
		this.indent += 1, e(this), --this.indent;
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.args, n = [...(this?.content ?? [""]).map((e) => `  ${e}`)];
		return new e(...t, n.join("\n"));
	}
}, yt = {
	major: 4,
	minor: 4,
	patch: 3
}, L = /*@__PURE__*/ u("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = yt;
	let r = [...e._zod.def.checks ?? []];
	e._zod.traits.has("$ZodCheck") && r.unshift(e);
	for (let t of r) for (let n of t._zod.onattach) n(e);
	if (r.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (e, t, n) => {
			let r = ge(e), i;
			for (let a of t) {
				if (a._zod.def.when) {
					if (_e(e) || !a._zod.def.when(e)) continue;
				} else if (r) continue;
				let t = e.issues.length, o = a._zod.check(e);
				if (o instanceof Promise && n?.async === !1) throw new d();
				if (i || o instanceof Promise) i = (i ?? Promise.resolve()).then(async () => {
					await o, e.issues.length !== t && (r ||= ge(e, t));
				});
				else {
					if (e.issues.length === t) continue;
					r ||= ge(e, t);
				}
			}
			return i ? i.then(() => e) : e;
		}, n = (n, i, a) => {
			if (ge(n)) return n.aborted = !0, n;
			let o = t(i, r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new d();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (i, a) => {
			if (a.skipChecks) return e._zod.parse(i, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: i.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, i, a)) : n(t, i, a);
			}
			let o = e._zod.parse(i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new d();
				return o.then((e) => t(e, r, a));
			}
			return t(o, r, a);
		};
	}
	x(e, "~standard", () => ({
		validate: (t) => {
			try {
				let n = Oe(e, t);
				return n.success ? { value: n.data } : { issues: n.error?.issues };
			} catch {
				return Ae(e, t).then((e) => e.success ? { value: e.data } : { issues: e.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
}), bt = /*@__PURE__*/ u("$ZodString", (e, t) => {
	L.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? ot(e._zod.bag), e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), R = /*@__PURE__*/ u("$ZodStringFormat", (e, t) => {
	F.init(e, t), bt.init(e, t);
}), xt = /*@__PURE__*/ u("$ZodGUID", (e, t) => {
	t.pattern ??= We, R.init(e, t);
}), z = /*@__PURE__*/ u("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= Ge(e);
	} else t.pattern ??= Ge();
	R.init(e, t);
}), St = /*@__PURE__*/ u("$ZodEmail", (e, t) => {
	t.pattern ??= Ke, R.init(e, t);
}), Ct = /*@__PURE__*/ u("$ZodURL", (e, t) => {
	R.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim();
			if (!t.normalize && t.protocol?.source === M.source && !/^https?:\/\//i.test(r)) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			let i = new URL(r);
			t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(i.hostname) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(i.protocol.endsWith(":") ? i.protocol.slice(0, -1) : i.protocol) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), n.value = t.normalize ? i.href : r;
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), wt = /*@__PURE__*/ u("$ZodEmoji", (e, t) => {
	t.pattern ??= Je(), R.init(e, t);
}), Tt = /*@__PURE__*/ u("$ZodNanoID", (e, t) => {
	t.pattern ??= Ue, R.init(e, t);
}), Et = /*@__PURE__*/ u("$ZodCUID", (e, t) => {
	t.pattern ??= ze, R.init(e, t);
}), Dt = /*@__PURE__*/ u("$ZodCUID2", (e, t) => {
	t.pattern ??= Be, R.init(e, t);
}), Ot = /*@__PURE__*/ u("$ZodULID", (e, t) => {
	t.pattern ??= A, R.init(e, t);
}), B = /*@__PURE__*/ u("$ZodXID", (e, t) => {
	t.pattern ??= Ve, R.init(e, t);
}), kt = /*@__PURE__*/ u("$ZodKSUID", (e, t) => {
	t.pattern ??= He, R.init(e, t);
}), At = /*@__PURE__*/ u("$ZodISODateTime", (e, t) => {
	t.pattern ??= at(t), R.init(e, t);
}), jt = /*@__PURE__*/ u("$ZodISODate", (e, t) => {
	t.pattern ??= nt, R.init(e, t);
}), Mt = /*@__PURE__*/ u("$ZodISOTime", (e, t) => {
	t.pattern ??= it(t), R.init(e, t);
}), Nt = /*@__PURE__*/ u("$ZodISODuration", (e, t) => {
	t.pattern ??= j, R.init(e, t);
}), Pt = /*@__PURE__*/ u("$ZodIPv4", (e, t) => {
	t.pattern ??= Ye, R.init(e, t), e._zod.bag.format = "ipv4";
}), Ft = /*@__PURE__*/ u("$ZodIPv6", (e, t) => {
	t.pattern ??= Xe, R.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
		try {
			new URL(`http://[${n.value}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), It = /*@__PURE__*/ u("$ZodCIDRv4", (e, t) => {
	t.pattern ??= Ze, R.init(e, t);
}), Lt = /*@__PURE__*/ u("$ZodCIDRv6", (e, t) => {
	t.pattern ??= Qe, R.init(e, t), e._zod.check = (n) => {
		let r = n.value.split("/");
		try {
			if (r.length !== 2) throw Error();
			let [e, t] = r;
			if (!t) throw Error();
			let n = Number(t);
			if (`${n}` !== t || n < 0 || n > 128) throw Error();
			new URL(`http://[${e}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
});
function Rt(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var V = /*@__PURE__*/ u("$ZodBase64", (e, t) => {
	t.pattern ??= $e, R.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
		Rt(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function zt(e) {
	if (!et.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return Rt(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var Bt = /*@__PURE__*/ u("$ZodBase64URL", (e, t) => {
	t.pattern ??= et, R.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
		zt(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Vt = /*@__PURE__*/ u("$ZodE164", (e, t) => {
	t.pattern ??= N, R.init(e, t);
});
function H(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var Ht = /*@__PURE__*/ u("$ZodJWT", (e, t) => {
	R.init(e, t), e._zod.check = (n) => {
		H(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Ut = /*@__PURE__*/ u("$ZodUnknown", (e, t) => {
	L.init(e, t), e._zod.parse = (e) => e;
}), Wt = /*@__PURE__*/ u("$ZodNever", (e, t) => {
	L.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function Gt(e, t, n) {
	e.issues.length && t.issues.push(...D(n, e.issues)), t.value[n] = e.value;
}
var Kt = /*@__PURE__*/ u("$ZodArray", (e, t) => {
	L.init(e, t), e._zod.parse = (n, r) => {
		let i = n.value;
		if (!Array.isArray(i)) return n.issues.push({
			expected: "array",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
		n.value = Array(i.length);
		let a = [];
		for (let e = 0; e < i.length; e++) {
			let o = i[e], s = t.element._zod.run({
				value: o,
				issues: []
			}, r);
			s instanceof Promise ? a.push(s.then((t) => Gt(t, n, e))) : Gt(s, n, e);
		}
		return a.length ? Promise.all(a).then(() => n) : n;
	};
});
function U(e, t, n, r, i, a) {
	let o = n in r;
	if (e.issues.length) {
		if (i && a && !o) return;
		t.issues.push(...D(n, e.issues));
	}
	if (!o && !i) {
		e.issues.length || t.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [n]
		});
		return;
	}
	e.value === void 0 ? o && (t.value[n] = void 0) : t.value[n] = e.value;
}
function W(e) {
	let t = Object.keys(e.shape);
	for (let n of t) if (!e.shape?.[n]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${n}": expected a Zod schema`);
	let n = le(e.shape);
	return {
		...e,
		keys: t,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(n)
	};
}
function qt(e, t, n, r, i, a) {
	let o = [], s = i.keySet, c = i.catchall._zod, l = c.def.type, u = c.optin === "optional", d = c.optout === "optional";
	for (let i in t) {
		if (i === "__proto__" || s.has(i)) continue;
		if (l === "never") {
			o.push(i);
			continue;
		}
		let a = c.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => U(e, n, i, t, u, d))) : U(a, n, i, t, u, d);
	}
	return o.length && n.issues.push({
		code: "unrecognized_keys",
		keys: o,
		input: t,
		inst: a
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var Jt = /*@__PURE__*/ u("$ZodObject", (e, t) => {
	if (L.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
		let e = t.shape;
		Object.defineProperty(t, "shape", { get: () => {
			let n = { ...e };
			return Object.defineProperty(t, "shape", { value: n }), n;
		} });
	}
	let n = _(() => W(t));
	x(e._zod, "propValues", () => {
		let e = t.shape, n = {};
		for (let t in e) {
			let r = e[t]._zod;
			if (r.values) {
				n[t] ?? (n[t] = /* @__PURE__ */ new Set());
				for (let e of r.values) n[t].add(e);
			}
		}
		return n;
	});
	let r = re, i = t.catchall, a;
	e._zod.parse = (t, o) => {
		a ??= n.value;
		let s = t.value;
		if (!r(s)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: s,
			inst: e
		}), t;
		t.value = {};
		let c = [], l = a.shape;
		for (let e of a.keys) {
			let n = l[e], r = n._zod.optin === "optional", i = n._zod.optout === "optional", a = n._zod.run({
				value: s[e],
				issues: []
			}, o);
			a instanceof Promise ? c.push(a.then((n) => U(n, t, e, s, r, i))) : U(a, t, e, s, r, i);
		}
		return i ? qt(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
	};
}), Yt = /*@__PURE__*/ u("$ZodObjectJIT", (e, t) => {
	Jt.init(e, t);
	let n = e._zod.parse, r = _(() => W(t)), i = (e) => {
		let t = new vt([
			"shape",
			"payload",
			"ctx"
		]), n = r.value, i = (e) => {
			let t = ee(e);
			return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
		};
		t.write("const input = payload.value;");
		let a = Object.create(null), o = 0;
		for (let e of n.keys) a[e] = `key_${o++}`;
		t.write("const newResult = {};");
		for (let r of n.keys) {
			let n = a[r], o = ee(r), s = e[r], c = s?._zod?.optin === "optional", l = s?._zod?.optout === "optional";
			t.write(`const ${n} = ${i(r)};`), c && l ? t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `) : c ? t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `) : t.write(`
        const ${n}_present = ${o} in input;
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${o}]
          });
        }

        if (${n}_present) {
          if (${n}.value === undefined) {
            newResult[${o}] = undefined;
          } else {
            newResult[${o}] = ${n}.value;
          }
        }

      `);
		}
		t.write("payload.value = newResult;"), t.write("return payload;");
		let s = t.compile();
		return (t, n) => s(e, t, n);
	}, a, o = re, s = !p.jitless, c = s && ie.value, l = t.catchall, u;
	e._zod.parse = (d, f) => {
		u ??= r.value;
		let p = d.value;
		return o(p) ? s && c && f?.async === !1 && f.jitless !== !0 ? (a ||= i(t.shape), d = a(d, f), l ? qt([], p, d, f, u, e) : d) : n(d, f) : (d.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), d);
	};
});
function Xt(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !ge(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => O(e, r, m())))
	}), t);
}
var Zt = /*@__PURE__*/ u("$ZodUnion", (e, t) => {
	L.init(e, t), x(e._zod, "optin", () => t.options.some((e) => e._zod.optin === "optional") ? "optional" : void 0), x(e._zod, "optout", () => t.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), x(e._zod, "values", () => {
		if (t.options.every((e) => e._zod.values)) return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
	}), x(e._zod, "pattern", () => {
		if (t.options.every((e) => e._zod.pattern)) {
			let e = t.options.map((e) => e._zod.pattern);
			return RegExp(`^(${e.map((e) => y(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1 ? t.options[0]._zod.run : null;
	e._zod.parse = (r, i) => {
		if (n) return n(r, i);
		let a = !1, o = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: r.value,
				issues: []
			}, i);
			if (t instanceof Promise) o.push(t), a = !0;
			else {
				if (t.issues.length === 0) return t;
				o.push(t);
			}
		}
		return a ? Promise.all(o).then((t) => Xt(t, r, e, i)) : Xt(o, r, e, i);
	};
}), Qt = /*@__PURE__*/ u("$ZodIntersection", (e, t) => {
	L.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => en(e, t, n)) : en(e, i, a);
	};
});
function $t(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (ae(e) && ae(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = $t(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = $t(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function en(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i;
	for (let n of t.issues) if (n.code === "unrecognized_keys") {
		i ??= n;
		for (let e of n.keys) r.has(e) || r.set(e, {}), r.get(e).l = !0;
	} else e.issues.push(n);
	for (let t of n.issues) if (t.code === "unrecognized_keys") for (let e of t.keys) r.has(e) || r.set(e, {}), r.get(e).r = !0;
	else e.issues.push(t);
	let a = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (a.length && i && e.issues.push({
		...i,
		keys: a
	}), ge(e)) return e;
	let o = $t(t.value, n.value);
	if (!o.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
	return e.value = o.data, e;
}
var tn = /*@__PURE__*/ u("$ZodEnum", (e, t) => {
	L.init(e, t);
	let n = h(t.entries), r = new Set(n);
	e._zod.values = r, e._zod.pattern = RegExp(`^(${n.filter((e) => se.has(typeof e)).map((e) => typeof e == "string" ? ce(e) : e.toString()).join("|")})$`), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), nn = /*@__PURE__*/ u("$ZodTransform", (e, t) => {
	L.init(e, t), e._zod.optin = "optional", e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new f(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n.fallback = !0, n));
		if (i instanceof Promise) throw new d();
		return n.value = i, n.fallback = !0, n;
	};
});
function rn(e, t) {
	return t === void 0 && (e.issues.length || e.fallback) ? {
		issues: [],
		value: void 0
	} : e;
}
var an = /*@__PURE__*/ u("$ZodOptional", (e, t) => {
	L.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", x(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), x(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${y(e.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (t.innerType._zod.optin === "optional") {
			let r = e.value, i = t.innerType._zod.run(e, n);
			return i instanceof Promise ? i.then((e) => rn(e, r)) : rn(i, r);
		}
		return e.value === void 0 ? e : t.innerType._zod.run(e, n);
	};
}), on = /*@__PURE__*/ u("$ZodExactOptional", (e, t) => {
	an.init(e, t), x(e._zod, "values", () => t.innerType._zod.values), x(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), sn = /*@__PURE__*/ u("$ZodNullable", (e, t) => {
	L.init(e, t), x(e._zod, "optin", () => t.innerType._zod.optin), x(e._zod, "optout", () => t.innerType._zod.optout), x(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${y(e.source)}|null)$`) : void 0;
	}), x(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), cn = /*@__PURE__*/ u("$ZodDefault", (e, t) => {
	L.init(e, t), e._zod.optin = "optional", x(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => ln(e, t)) : ln(r, t);
	};
});
function ln(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var un = /*@__PURE__*/ u("$ZodPrefault", (e, t) => {
	L.init(e, t), e._zod.optin = "optional", x(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), dn = /*@__PURE__*/ u("$ZodNonOptional", (e, t) => {
	L.init(e, t), x(e._zod, "values", () => {
		let e = t.innerType._zod.values;
		return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => fn(t, e)) : fn(i, e);
	};
});
function fn(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
var pn = /*@__PURE__*/ u("$ZodCatch", (e, t) => {
	L.init(e, t), e._zod.optin = "optional", x(e._zod, "optout", () => t.innerType._zod.optout), x(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((r) => (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => O(e, n, m())) },
			input: e.value
		}), e.issues = [], e.fallback = !0), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => O(e, n, m())) },
			input: e.value
		}), e.issues = [], e.fallback = !0), e);
	};
}), mn = /*@__PURE__*/ u("$ZodPipe", (e, t) => {
	L.init(e, t), x(e._zod, "values", () => t.in._zod.values), x(e._zod, "optin", () => t.in._zod.optin), x(e._zod, "optout", () => t.out._zod.optout), x(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => hn(e, t.in, n)) : hn(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => hn(e, t.out, n)) : hn(r, t.out, n);
	};
});
function hn(e, t, n) {
	return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues,
		fallback: e.fallback
	}, n);
}
var gn = /*@__PURE__*/ u("$ZodPreprocess", (e, t) => {
	mn.init(e, t);
}), _n = /*@__PURE__*/ u("$ZodReadonly", (e, t) => {
	L.init(e, t), x(e._zod, "propValues", () => t.innerType._zod.propValues), x(e._zod, "values", () => t.innerType._zod.values), x(e._zod, "optin", () => t.innerType?._zod?.optin), x(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(vn) : vn(r);
	};
});
function vn(e) {
	return e.value = Object.freeze(e.value), e;
}
var yn = /*@__PURE__*/ u("$ZodCustom", (e, t) => {
	P.init(e, t), L.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => bn(t, n, r, e));
		bn(i, n, r, e);
	};
});
function bn(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(be(e));
	}
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
var xn, Sn = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function Cn() {
	return new Sn();
}
(xn = globalThis).__zod_globalRegistry ?? (xn.__zod_globalRegistry = Cn());
var wn = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function Tn(e, t) {
	return new e({
		type: "string",
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function En(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Dn(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function On(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function kn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function G(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function An(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function jn(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Mn(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Nn(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Pn(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Fn(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function In(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ln(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Rn(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function zn(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Bn(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Vn(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Hn(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Un(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wn(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Gn(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Kn(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qn(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Jn(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Yn(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xn(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Zn(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function Qn(e, t) {
	return new e({
		type: "never",
		...T(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $n(e, t) {
	return new lt({
		check: "max_length",
		...T(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function er(e, t) {
	return new ut({
		check: "min_length",
		...T(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function tr(e, t) {
	return new dt({
		check: "length_equals",
		...T(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function nr(e, t) {
	return new ft({
		check: "string_format",
		format: "regex",
		...T(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function rr(e) {
	return new pt({
		check: "string_format",
		format: "lowercase",
		...T(e)
	});
}
// @__NO_SIDE_EFFECTS__
function ir(e) {
	return new I({
		check: "string_format",
		format: "uppercase",
		...T(e)
	});
}
// @__NO_SIDE_EFFECTS__
function ar(e, t) {
	return new mt({
		check: "string_format",
		format: "includes",
		...T(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function or(e, t) {
	return new ht({
		check: "string_format",
		format: "starts_with",
		...T(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function sr(e, t) {
	return new gt({
		check: "string_format",
		format: "ends_with",
		...T(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function cr(e) {
	return new _t({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function lr(e) {
	return /* @__PURE__ */ cr((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function ur() {
	return /* @__PURE__ */ cr((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function K() {
	return /* @__PURE__ */ cr((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function dr() {
	return /* @__PURE__ */ cr((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function fr() {
	return /* @__PURE__ */ cr((e) => te(e));
}
// @__NO_SIDE_EFFECTS__
function pr(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...T(n)
	});
}
// @__NO_SIDE_EFFECTS__
function mr(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...T(n)
	});
}
// @__NO_SIDE_EFFECTS__
function hr(e, t) {
	let n = /* @__PURE__ */ gr((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(be(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", r.input ??= t.value, r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(be(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function gr(e, t) {
	let n = new P({
		check: "custom",
		...T(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
function _r(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? wn,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		external: e?.external ?? void 0
	};
}
function q(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o);
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, q(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Object.assign(o.schema, c), t.io === "input" && J(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function vr(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${a}`
			};
		}
		if (t[1] === n) return { ref: "#" };
		let i = `#/${r}/`, a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + a
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) {
			a(n);
			continue;
		}
		if (e.external) {
			let r = e.external.registry.get(n[0])?.id;
			if (t !== n[0] && r) {
				a(n);
				continue;
			}
		}
		if (e.metadataRegistry.get(n[0])?.id) {
			a(n);
			continue;
		}
		if (r.cycle) {
			a(n);
			continue;
		}
		if (r.count > 1 && e.reused === "ref") {
			a(n);
			continue;
		}
	}
}
function yr(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Object.assign(i, s), Object.assign(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== "$ref" && e !== "allOf" && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== "$ref" && e !== "allOf" && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	for (let t of [...e.seen.entries()].reverse()) r(t[0]);
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Object.assign(i, n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, o[e.defId] = e.def);
	}
	e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: xr(t, "input", e.processors),
					output: xr(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function J(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return J(r.element, n);
	if (r.type === "set") return J(r.valueType, n);
	if (r.type === "lazy") return J(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault") return J(r.innerType, n);
	if (r.type === "intersection") return J(r.left, n) || J(r.right, n);
	if (r.type === "record" || r.type === "map") return J(r.keyType, n) || J(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : J(r.in, n) || J(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (J(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (J(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (J(e, n)) return !0;
		return !!(r.rest && J(r.rest, n));
	}
	return !1;
}
var br = (e, t = {}) => (n) => {
	let r = _r({
		...n,
		processors: t
	});
	return q(e, r), vr(r, e), yr(r, e);
}, xr = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = _r({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return q(e, o), vr(o, e), yr(o, e);
}, Sr = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, Cr = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = Sr[s] ?? s, i.format === "" && delete i.format, s === "time" && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c];
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, wr = (e, t, n, r) => {
	n.not = {};
}, Tr = (e, t, n, r) => {
	let i = e._zod.def, a = h(i.entries);
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, Er = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
}, Dr = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
}, Or = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = e._zod.bag;
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = q(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
}, kr = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object", i.properties = {};
	let o = a.shape;
	for (let e in o) i.properties[e] = q(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	});
	let s = new Set(Object.keys(o)), c = new Set([...s].filter((e) => {
		let n = a.shape[e]._zod;
		return t.io === "input" ? n.optin === void 0 : n.optout === void 0;
	}));
	c.size > 0 && (i.required = Array.from(c)), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = q(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, Ar = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => q(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, jr = (e, t, n, r) => {
	let i = e._zod.def, a = q(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = q(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1;
	n.allOf = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
}, Mr = (e, t, n, r) => {
	let i = e._zod.def, a = q(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, Nr = (e, t, n, r) => {
	let i = e._zod.def;
	q(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Pr = (e, t, n, r) => {
	let i = e._zod.def;
	q(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.default = JSON.parse(JSON.stringify(i.defaultValue));
}, Fr = (e, t, n, r) => {
	let i = e._zod.def;
	q(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue)));
}, Ir = (e, t, n, r) => {
	let i = e._zod.def;
	q(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		throw Error("Dynamic catch values are not supported in JSON Schema");
	}
	n.default = o;
}, Lr = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	q(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, Rr = (e, t, n, r) => {
	let i = e._zod.def;
	q(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, zr = (e, t, n, r) => {
	let i = e._zod.def;
	q(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Br = /*@__PURE__*/ u("ZodISODateTime", (e, t) => {
	At.init(e, t), Z.init(e, t);
});
function Vr(e) {
	return /* @__PURE__ */ qn(Br, e);
}
var Hr = /*@__PURE__*/ u("ZodISODate", (e, t) => {
	jt.init(e, t), Z.init(e, t);
});
function Ur(e) {
	return /* @__PURE__ */ Jn(Hr, e);
}
var Wr = /*@__PURE__*/ u("ZodISOTime", (e, t) => {
	Mt.init(e, t), Z.init(e, t);
});
function Gr(e) {
	return /* @__PURE__ */ Yn(Wr, e);
}
var Kr = /*@__PURE__*/ u("ZodISODuration", (e, t) => {
	Nt.init(e, t), Z.init(e, t);
});
function qr(e) {
	return /* @__PURE__ */ Xn(Kr, e);
}
var Y = /*@__PURE__*/ u("ZodError", (e, t) => {
	Se.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
		format: { value: (t) => Te(e, t) },
		flatten: { value: (t) => we(e, t) },
		addIssue: { value: (t) => {
			e.issues.push(t), e.message = JSON.stringify(e.issues, g, 2);
		} },
		addIssues: { value: (t) => {
			e.issues.push(...t), e.message = JSON.stringify(e.issues, g, 2);
		} },
		isEmpty: { get() {
			return e.issues.length === 0;
		} }
	});
}, { Parent: Error }), Jr = /* @__PURE__ */ Ee(Y), Yr = /* @__PURE__ */ k(Y), Xr = /* @__PURE__ */ De(Y), Zr = /* @__PURE__ */ ke(Y), Qr = /* @__PURE__ */ je(Y), $r = /* @__PURE__ */ Me(Y), ei = /* @__PURE__ */ Ne(Y), ti = /* @__PURE__ */ Pe(Y), ni = /* @__PURE__ */ Fe(Y), ri = /* @__PURE__ */ Ie(Y), ii = /* @__PURE__ */ Le(Y), ai = /* @__PURE__ */ Re(Y), oi = /* @__PURE__ */ new WeakMap();
function si(e, t, n) {
	let r = Object.getPrototypeOf(e), i = oi.get(r);
	if (i || (i = /* @__PURE__ */ new Set(), oi.set(r, i)), !i.has(t)) {
		i.add(t);
		for (let e in n) {
			let t = n[e];
			Object.defineProperty(r, e, {
				configurable: !0,
				enumerable: !1,
				get() {
					let n = t.bind(this);
					return Object.defineProperty(this, e, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: n
					}), n;
				},
				set(t) {
					Object.defineProperty(this, e, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: t
					});
				}
			});
		}
	}
}
var X = /*@__PURE__*/ u("ZodType", (e, t) => (L.init(e, t), Object.assign(e["~standard"], { jsonSchema: {
	input: xr(e, "input"),
	output: xr(e, "output")
} }), e.toJSONSchema = br(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.parse = (t, n) => Jr(e, t, n, { callee: e.parse }), e.safeParse = (t, n) => Xr(e, t, n), e.parseAsync = async (t, n) => Yr(e, t, n, { callee: e.parseAsync }), e.safeParseAsync = async (t, n) => Zr(e, t, n), e.spa = e.safeParseAsync, e.encode = (t, n) => Qr(e, t, n), e.decode = (t, n) => $r(e, t, n), e.encodeAsync = async (t, n) => ei(e, t, n), e.decodeAsync = async (t, n) => ti(e, t, n), e.safeEncode = (t, n) => ni(e, t, n), e.safeDecode = (t, n) => ri(e, t, n), e.safeEncodeAsync = async (t, n) => ii(e, t, n), e.safeDecodeAsync = async (t, n) => ai(e, t, n), si(e, "ZodType", {
	check(...e) {
		let t = this.def;
		return this.clone(C(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return w(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(fa(e, t));
	},
	superRefine(e, t) {
		return this.check(pa(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ cr(e));
	},
	optional() {
		return qi(this);
	},
	exactOptional() {
		return Yi(this);
	},
	nullable() {
		return Zi(this);
	},
	nullish() {
		return qi(Zi(this));
	},
	nonoptional(e) {
		return ra(this, e);
	},
	array() {
		return Fi(this);
	},
	or(e) {
		return zi([this, e]);
	},
	and(e) {
		return Vi(this, e);
	},
	transform(e) {
		return sa(this, Gi(e));
	},
	default(e) {
		return $i(this, e);
	},
	prefault(e) {
		return ta(this, e);
	},
	catch(e) {
		return aa(this, e);
	},
	pipe(e) {
		return sa(this, e);
	},
	readonly() {
		return ua(this);
	},
	describe(e) {
		let t = this.clone();
		return wn.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return wn.get(this);
		let t = this.clone();
		return wn.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e) {
		return e(this);
	}
}), Object.defineProperty(e, "description", {
	get() {
		return wn.get(e)?.description;
	},
	configurable: !0
}), e)), ci = /*@__PURE__*/ u("_ZodString", (e, t) => {
	bt.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Cr(e, t, n, r);
	let n = e._zod.bag;
	e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, si(e, "_ZodString", {
		regex(...e) {
			return this.check(/* @__PURE__ */ nr(...e));
		},
		includes(...e) {
			return this.check(/* @__PURE__ */ ar(...e));
		},
		startsWith(...e) {
			return this.check(/* @__PURE__ */ or(...e));
		},
		endsWith(...e) {
			return this.check(/* @__PURE__ */ sr(...e));
		},
		min(...e) {
			return this.check(/* @__PURE__ */ er(...e));
		},
		max(...e) {
			return this.check(/* @__PURE__ */ $n(...e));
		},
		length(...e) {
			return this.check(/* @__PURE__ */ tr(...e));
		},
		nonempty(...e) {
			return this.check(/* @__PURE__ */ er(1, ...e));
		},
		lowercase(e) {
			return this.check(/* @__PURE__ */ rr(e));
		},
		uppercase(e) {
			return this.check(/* @__PURE__ */ ir(e));
		},
		trim() {
			return this.check(/* @__PURE__ */ ur());
		},
		normalize(...e) {
			return this.check(/* @__PURE__ */ lr(...e));
		},
		toLowerCase() {
			return this.check(/* @__PURE__ */ K());
		},
		toUpperCase() {
			return this.check(/* @__PURE__ */ dr());
		},
		slugify() {
			return this.check(/* @__PURE__ */ fr());
		}
	});
}), li = /*@__PURE__*/ u("ZodString", (e, t) => {
	bt.init(e, t), ci.init(e, t), e.email = (t) => e.check(/* @__PURE__ */ En(di, t)), e.url = (t) => e.check(/* @__PURE__ */ jn(mi, t)), e.jwt = (t) => e.check(/* @__PURE__ */ Kn(ki, t)), e.emoji = (t) => e.check(/* @__PURE__ */ Mn(hi, t)), e.guid = (t) => e.check(/* @__PURE__ */ Dn(fi, t)), e.uuid = (t) => e.check(/* @__PURE__ */ On(pi, t)), e.uuidv4 = (t) => e.check(/* @__PURE__ */ kn(pi, t)), e.uuidv6 = (t) => e.check(/* @__PURE__ */ G(pi, t)), e.uuidv7 = (t) => e.check(/* @__PURE__ */ An(pi, t)), e.nanoid = (t) => e.check(/* @__PURE__ */ Nn(gi, t)), e.guid = (t) => e.check(/* @__PURE__ */ Dn(fi, t)), e.cuid = (t) => e.check(/* @__PURE__ */ Pn(_i, t)), e.cuid2 = (t) => e.check(/* @__PURE__ */ Fn(vi, t)), e.ulid = (t) => e.check(/* @__PURE__ */ In(yi, t)), e.base64 = (t) => e.check(/* @__PURE__ */ Un(Ei, t)), e.base64url = (t) => e.check(/* @__PURE__ */ Wn(Di, t)), e.xid = (t) => e.check(/* @__PURE__ */ Ln(bi, t)), e.ksuid = (t) => e.check(/* @__PURE__ */ Rn(xi, t)), e.ipv4 = (t) => e.check(/* @__PURE__ */ zn(Si, t)), e.ipv6 = (t) => e.check(/* @__PURE__ */ Bn(Ci, t)), e.cidrv4 = (t) => e.check(/* @__PURE__ */ Vn(wi, t)), e.cidrv6 = (t) => e.check(/* @__PURE__ */ Hn(Ti, t)), e.e164 = (t) => e.check(/* @__PURE__ */ Gn(Oi, t)), e.datetime = (t) => e.check(Vr(t)), e.date = (t) => e.check(Ur(t)), e.time = (t) => e.check(Gr(t)), e.duration = (t) => e.check(qr(t));
});
function ui(e) {
	return /* @__PURE__ */ Tn(li, e);
}
var Z = /*@__PURE__*/ u("ZodStringFormat", (e, t) => {
	R.init(e, t), ci.init(e, t);
}), di = /*@__PURE__*/ u("ZodEmail", (e, t) => {
	St.init(e, t), Z.init(e, t);
}), fi = /*@__PURE__*/ u("ZodGUID", (e, t) => {
	xt.init(e, t), Z.init(e, t);
}), pi = /*@__PURE__*/ u("ZodUUID", (e, t) => {
	z.init(e, t), Z.init(e, t);
}), mi = /*@__PURE__*/ u("ZodURL", (e, t) => {
	Ct.init(e, t), Z.init(e, t);
}), hi = /*@__PURE__*/ u("ZodEmoji", (e, t) => {
	wt.init(e, t), Z.init(e, t);
}), gi = /*@__PURE__*/ u("ZodNanoID", (e, t) => {
	Tt.init(e, t), Z.init(e, t);
}), _i = /*@__PURE__*/ u("ZodCUID", (e, t) => {
	Et.init(e, t), Z.init(e, t);
}), vi = /*@__PURE__*/ u("ZodCUID2", (e, t) => {
	Dt.init(e, t), Z.init(e, t);
}), yi = /*@__PURE__*/ u("ZodULID", (e, t) => {
	Ot.init(e, t), Z.init(e, t);
}), bi = /*@__PURE__*/ u("ZodXID", (e, t) => {
	B.init(e, t), Z.init(e, t);
}), xi = /*@__PURE__*/ u("ZodKSUID", (e, t) => {
	kt.init(e, t), Z.init(e, t);
}), Si = /*@__PURE__*/ u("ZodIPv4", (e, t) => {
	Pt.init(e, t), Z.init(e, t);
}), Ci = /*@__PURE__*/ u("ZodIPv6", (e, t) => {
	Ft.init(e, t), Z.init(e, t);
}), wi = /*@__PURE__*/ u("ZodCIDRv4", (e, t) => {
	It.init(e, t), Z.init(e, t);
}), Ti = /*@__PURE__*/ u("ZodCIDRv6", (e, t) => {
	Lt.init(e, t), Z.init(e, t);
}), Ei = /*@__PURE__*/ u("ZodBase64", (e, t) => {
	V.init(e, t), Z.init(e, t);
}), Di = /*@__PURE__*/ u("ZodBase64URL", (e, t) => {
	Bt.init(e, t), Z.init(e, t);
}), Oi = /*@__PURE__*/ u("ZodE164", (e, t) => {
	Vt.init(e, t), Z.init(e, t);
}), ki = /*@__PURE__*/ u("ZodJWT", (e, t) => {
	Ht.init(e, t), Z.init(e, t);
}), Ai = /*@__PURE__*/ u("ZodUnknown", (e, t) => {
	Ut.init(e, t), X.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function ji() {
	return /* @__PURE__ */ Zn(Ai);
}
var Mi = /*@__PURE__*/ u("ZodNever", (e, t) => {
	Wt.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => wr(e, t, n, r);
});
function Ni(e) {
	return /* @__PURE__ */ Qn(Mi, e);
}
var Pi = /*@__PURE__*/ u("ZodArray", (e, t) => {
	Kt.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Or(e, t, n, r), e.element = t.element, si(e, "ZodArray", {
		min(e, t) {
			return this.check(/* @__PURE__ */ er(e, t));
		},
		nonempty(e) {
			return this.check(/* @__PURE__ */ er(1, e));
		},
		max(e, t) {
			return this.check(/* @__PURE__ */ $n(e, t));
		},
		length(e, t) {
			return this.check(/* @__PURE__ */ tr(e, t));
		},
		unwrap() {
			return this.element;
		}
	});
});
function Fi(e, t) {
	return /* @__PURE__ */ pr(Pi, e, t);
}
var Ii = /*@__PURE__*/ u("ZodObject", (e, t) => {
	Yt.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => kr(e, t, n, r), x(e, "shape", () => t.shape), si(e, "ZodObject", {
		keyof() {
			return Ui(Object.keys(this._zod.def.shape));
		},
		catchall(e) {
			return this.clone({
				...this._zod.def,
				catchall: e
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: ji()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: ji()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: Ni()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(e) {
			return de(this, e);
		},
		safeExtend(e) {
			return fe(this, e);
		},
		merge(e) {
			return pe(this, e);
		},
		pick(e) {
			return ue(this, e);
		},
		omit(e) {
			return E(this, e);
		},
		partial(...e) {
			return me(Ki, this, e[0]);
		},
		required(...e) {
			return he(na, this, e[0]);
		}
	});
});
function Li(e, t) {
	return new Ii({
		type: "object",
		shape: e ?? {},
		...T(t)
	});
}
var Ri = /*@__PURE__*/ u("ZodUnion", (e, t) => {
	Zt.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ar(e, t, n, r), e.options = t.options;
});
function zi(e, t) {
	return new Ri({
		type: "union",
		options: e,
		...T(t)
	});
}
var Bi = /*@__PURE__*/ u("ZodIntersection", (e, t) => {
	Qt.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => jr(e, t, n, r);
});
function Vi(e, t) {
	return new Bi({
		type: "intersection",
		left: e,
		right: t
	});
}
var Hi = /*@__PURE__*/ u("ZodEnum", (e, t) => {
	tn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Tr(e, t, n, r), e.enum = t.entries, e.options = Object.values(t.entries);
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new Hi({
			...t,
			checks: [],
			...T(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new Hi({
			...t,
			checks: [],
			...T(r),
			entries: i
		});
	};
});
function Ui(e, t) {
	return new Hi({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...T(t)
	});
}
var Wi = /*@__PURE__*/ u("ZodTransform", (e, t) => {
	nn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Dr(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new f(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(be(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", t.input ??= n.value, t.inst ??= e, n.issues.push(be(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n.fallback = !0, n)) : (n.value = i, n.fallback = !0, n);
	};
});
function Gi(e) {
	return new Wi({
		type: "transform",
		transform: e
	});
}
var Ki = /*@__PURE__*/ u("ZodOptional", (e, t) => {
	an.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => zr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function qi(e) {
	return new Ki({
		type: "optional",
		innerType: e
	});
}
var Ji = /*@__PURE__*/ u("ZodExactOptional", (e, t) => {
	on.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => zr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Yi(e) {
	return new Ji({
		type: "optional",
		innerType: e
	});
}
var Xi = /*@__PURE__*/ u("ZodNullable", (e, t) => {
	sn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Mr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Zi(e) {
	return new Xi({
		type: "nullable",
		innerType: e
	});
}
var Qi = /*@__PURE__*/ u("ZodDefault", (e, t) => {
	cn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Pr(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function $i(e, t) {
	return new Qi({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : oe(t);
		}
	});
}
var ea = /*@__PURE__*/ u("ZodPrefault", (e, t) => {
	un.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Fr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ta(e, t) {
	return new ea({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : oe(t);
		}
	});
}
var na = /*@__PURE__*/ u("ZodNonOptional", (e, t) => {
	dn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Nr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ra(e, t) {
	return new na({
		type: "nonoptional",
		innerType: e,
		...T(t)
	});
}
var ia = /*@__PURE__*/ u("ZodCatch", (e, t) => {
	pn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ir(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function aa(e, t) {
	return new ia({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : () => t
	});
}
var oa = /*@__PURE__*/ u("ZodPipe", (e, t) => {
	mn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Lr(e, t, n, r), e.in = t.in, e.out = t.out;
});
function sa(e, t) {
	return new oa({
		type: "pipe",
		in: e,
		out: t
	});
}
var ca = /*@__PURE__*/ u("ZodPreprocess", (e, t) => {
	oa.init(e, t), gn.init(e, t);
}), la = /*@__PURE__*/ u("ZodReadonly", (e, t) => {
	_n.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Rr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ua(e) {
	return new la({
		type: "readonly",
		innerType: e
	});
}
var da = /*@__PURE__*/ u("ZodCustom", (e, t) => {
	yn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => Er(e, t, n, r);
});
function fa(e, t = {}) {
	return /* @__PURE__ */ mr(da, e, t);
}
function pa(e, t) {
	return /* @__PURE__ */ hr(e, t);
}
function ma(e, t) {
	return new ca({
		type: "pipe",
		in: Gi(e),
		out: t
	});
}
//#endregion
//#region src/capture/validate-selection.ts
var ha = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g, ga = /^[A-Za-z]+(?:['’-][A-Za-z]+)*(?:[\s.,!?;:()\-]+[A-Za-z]+(?:['’-][A-Za-z]+)*)*[.,!?;:]?$/;
function _a(e) {
	let t = e.trim().replace(/\s+/g, " ");
	if (!t) return {
		ok: !1,
		code: "EMPTY"
	};
	if (!ga.test(t)) return {
		ok: !1,
		code: "NOT_ENGLISH"
	};
	let n = t.match(ha)?.length ?? 0;
	return n > 8 ? {
		ok: !1,
		code: "TOO_LONG"
	} : {
		ok: !0,
		text: t,
		normalizedText: t.toLocaleLowerCase("en-US"),
		type: n === 1 ? "word" : "phrase"
	};
}
//#endregion
//#region src/capture/enrich-selection.ts
var va = Fi(Li({ phonetics: Fi(Li({
	text: ui().optional(),
	audio: ui().optional()
})).optional() })), ya = Li({
	term: ui().trim().min(1),
	meaningsZh: ma((e) => typeof e == "string" ? e.split(/[；;\n]+/).map((e) => e.trim()).filter(Boolean) : e, Fi(ui().trim().min(1)).min(1)),
	exampleEn: ui().trim().min(1),
	exampleZh: ui().trim().min(1)
}), ba = Li({ choices: Fi(Li({ message: Li({ content: ui() }) })).min(1) }), xa = class extends Error {
	status;
	code = "AI_REQUEST_FAILED";
	constructor(e) {
		super("AI request failed"), this.status = e, this.name = "AiRequestError";
	}
}, Sa = class extends Error {
	code = "INVALID_RESPONSE";
	constructor() {
		super("AI response does not match the selected term"), this.name = "InvalidAiResponseError";
	}
};
function Ca(e) {
	return e.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}
function wa(e, t) {
	let n = e.toLocaleLowerCase("en-US").match(/[a-z]+(?:['’-][a-z]+)*/g) ?? [], r = t.toLocaleLowerCase("en-US").match(/[a-z]+(?:['’-][a-z]+)*/g) ?? [], i = 0;
	return r.length > 0 && r.every((e) => {
		let t = n.indexOf(e, i);
		return t < 0 ? !1 : (i = t + 1, !0);
	});
}
async function Ta(e, t) {
	let n = null, r = null;
	try {
		let i = await t(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(e)}`);
		if (i.ok) {
			let e = va.parse(await i.json()), t = e[0]?.phonetics?.find((e) => e.audio) ?? e[0]?.phonetics?.[0];
			n = t?.text ?? null, r = t?.audio || null;
		}
	} catch {}
	return {
		ipa: n,
		audioUrl: r
	};
}
async function Ea(e, t, n) {
	for (let r = 0; r < 2; r += 1) {
		let i = await n(`${t.baseUrl.replace(/\/$/, "")}/chat/completions`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${t.apiKey}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({
				model: t.model,
				temperature: 0,
				response_format: { type: "json_object" },
				messages: [{
					role: "system",
					content: [
						"你是严谨的英汉学习词典编辑，只处理用户给出的目标英文。",
						"只返回 JSON，字段必须为 term、meaningsZh、exampleEn、exampleZh。",
						"term 必须原样等于目标英文；meaningsZh 只能是该词或短语的主要中文义项；",
						"exampleEn 只能有一句且必须原样包含目标英文；exampleZh 是该句的准确翻译。",
						"禁止回答其他单词。"
					].join("")
				}, {
					role: "user",
					content: `目标英文：${e.text}${r === 1 ? "\n上一次回答与目标不一致，请严格重新生成。" : ""}`
				}]
			}),
			signal: AbortSignal.timeout(2e4)
		});
		if (!i.ok) throw new xa(i.status);
		try {
			let t = ba.parse(await i.json()), n = ya.parse(JSON.parse(t.choices[0].message.content));
			if (Ca(n.term) === e.normalizedText && wa(n.exampleEn, e.text)) return n;
		} catch {}
	}
	throw new Sa();
}
async function Da(e, t, n = fetch) {
	if (!t.apiKey.trim()) throw Error("AI_KEY_MISSING");
	let r = _a(e);
	if (!r.ok) throw Error(r.code);
	let i = Ta(r.text, n), a = Ea(r, t, n), [{ ipa: o, audioUrl: s }, c] = await Promise.all([i, a]), { term: l, ...u } = c;
	return {
		id: crypto.randomUUID(),
		text: r.text,
		normalizedText: r.normalizedText,
		type: r.type,
		...u,
		usIpa: o,
		ukIpa: null,
		usAudioUrl: s,
		ukAudioUrl: null,
		audioFallback: s ? "none" : "speech-synthesis",
		status: "ready",
		capturedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/constants.js
var Oa = 365.2425, ka = 6048e5, Aa = 864e5, ja = 6e4, Ma = 36e5, Na = 86400;
Na * 7, Na * Oa / 12 * 3;
var Pa = Symbol.for("constructDateFrom");
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/constructFrom.js
function Fa(e, t) {
	return typeof e == "function" ? e(t) : e && typeof e == "object" && Pa in e ? e[Pa](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/toDate.js
function Q(e, t) {
	return Fa(t || e, e);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/addDays.js
function Ia(e, t, n) {
	let r = Q(e, n?.in);
	return isNaN(t) ? Fa(n?.in || e, NaN) : (t && r.setDate(r.getDate() + t), r);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/defaultOptions.js
var La = {};
function Ra() {
	return La;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfWeek.js
function za(e, t) {
	let n = Ra(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, i = Q(e, t?.in), a = i.getDay(), o = (a < r ? 7 : 0) + a - r;
	return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfISOWeek.js
function Ba(e, t) {
	return za(e, {
		...t,
		weekStartsOn: 1
	});
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getISOWeekYear.js
function Va(e, t) {
	let n = Q(e, t?.in), r = n.getFullYear(), i = Fa(n, 0);
	i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
	let a = Ba(i), o = Fa(n, 0);
	o.setFullYear(r, 0, 4), o.setHours(0, 0, 0, 0);
	let s = Ba(o);
	return n.getTime() >= a.getTime() ? r + 1 : n.getTime() >= s.getTime() ? r : r - 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function Ha(e) {
	let t = Q(e), n = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()));
	return n.setUTCFullYear(t.getFullYear()), e - +n;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/normalizeDates.js
function Ua(e, ...t) {
	let n = Fa.bind(null, e || t.find((e) => typeof e == "object"));
	return t.map(n);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfDay.js
function Wa(e, t) {
	let n = Q(e, t?.in);
	return n.setHours(0, 0, 0, 0), n;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/differenceInCalendarDays.js
function Ga(e, t, n) {
	let [r, i] = Ua(n?.in, e, t), a = Wa(r), o = Wa(i), s = +a - Ha(a), c = +o - Ha(o);
	return Math.round((s - c) / Aa);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfISOWeekYear.js
function Ka(e, t) {
	let n = Va(e, t), r = Fa(t?.in || e, 0);
	return r.setFullYear(n, 0, 4), r.setHours(0, 0, 0, 0), Ba(r);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/isDate.js
function qa(e) {
	return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/isValid.js
function Ja(e) {
	return !(!qa(e) && typeof e != "number" || isNaN(+Q(e)));
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfYear.js
function Ya(e, t) {
	let n = Q(e, t?.in);
	return n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var Xa = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
}, Za = (e, t, n) => {
	let r, i = Xa[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", t.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function Qa(e) {
	return (t = {}) => {
		let n = t.width ? String(t.width) : e.defaultWidth;
		return e.formats[n] || e.formats[e.defaultWidth];
	};
}
var $a = {
	date: Qa({
		formats: {
			full: "EEEE, MMMM do, y",
			long: "MMMM do, y",
			medium: "MMM d, y",
			short: "MM/dd/yyyy"
		},
		defaultWidth: "full"
	}),
	time: Qa({
		formats: {
			full: "h:mm:ss a zzzz",
			long: "h:mm:ss a z",
			medium: "h:mm:ss a",
			short: "h:mm a"
		},
		defaultWidth: "full"
	}),
	dateTime: Qa({
		formats: {
			full: "{{date}} 'at' {{time}}",
			long: "{{date}} 'at' {{time}}",
			medium: "{{date}}, {{time}}",
			short: "{{date}}, {{time}}"
		},
		defaultWidth: "full"
	})
}, eo = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
}, to = (e, t, n, r) => eo[e];
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function no(e) {
	return (t, n) => {
		let r = n?.context ? String(n.context) : "standalone", i;
		if (r === "formatting" && e.formattingValues) {
			let t = e.defaultFormattingWidth || e.defaultWidth, r = n?.width ? String(n.width) : t;
			i = e.formattingValues[r] || e.formattingValues[t];
		} else {
			let t = e.defaultWidth, r = n?.width ? String(n.width) : e.defaultWidth;
			i = e.values[r] || e.values[t];
		}
		let a = e.argumentCallback ? e.argumentCallback(t) : t;
		return i[a];
	};
}
var ro = {
	ordinalNumber: (e, t) => {
		let n = Number(e), r = n % 100;
		if (r > 20 || r < 10) switch (r % 10) {
			case 1: return n + "st";
			case 2: return n + "nd";
			case 3: return n + "rd";
		}
		return n + "th";
	},
	era: no({
		values: {
			narrow: ["B", "A"],
			abbreviated: ["BC", "AD"],
			wide: ["Before Christ", "Anno Domini"]
		},
		defaultWidth: "wide"
	}),
	quarter: no({
		values: {
			narrow: [
				"1",
				"2",
				"3",
				"4"
			],
			abbreviated: [
				"Q1",
				"Q2",
				"Q3",
				"Q4"
			],
			wide: [
				"1st quarter",
				"2nd quarter",
				"3rd quarter",
				"4th quarter"
			]
		},
		defaultWidth: "wide",
		argumentCallback: (e) => e - 1
	}),
	month: no({
		values: {
			narrow: [
				"J",
				"F",
				"M",
				"A",
				"M",
				"J",
				"J",
				"A",
				"S",
				"O",
				"N",
				"D"
			],
			abbreviated: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			wide: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			]
		},
		defaultWidth: "wide"
	}),
	day: no({
		values: {
			narrow: [
				"S",
				"M",
				"T",
				"W",
				"T",
				"F",
				"S"
			],
			short: [
				"Su",
				"Mo",
				"Tu",
				"We",
				"Th",
				"Fr",
				"Sa"
			],
			abbreviated: [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			],
			wide: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			]
		},
		defaultWidth: "wide"
	}),
	dayPeriod: no({
		values: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			}
		},
		defaultWidth: "wide",
		formattingValues: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			}
		},
		defaultFormattingWidth: "wide"
	})
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildMatchFn.js
function io(e) {
	return (t, n = {}) => {
		let r = n.width, i = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], a = t.match(i);
		if (!a) return null;
		let o = a[0], s = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? oo(s, (e) => e.test(o)) : ao(s, (e) => e.test(o)), l;
		l = e.valueCallback ? e.valueCallback(c) : c, l = n.valueCallback ? n.valueCallback(l) : l;
		let u = t.slice(o.length);
		return {
			value: l,
			rest: u
		};
	};
}
function ao(e, t) {
	for (let n in e) if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n])) return n;
}
function oo(e, t) {
	for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function so(e) {
	return (t, n = {}) => {
		let r = t.match(e.matchPattern);
		if (!r) return null;
		let i = r[0], a = t.match(e.parsePattern);
		if (!a) return null;
		let o = e.valueCallback ? e.valueCallback(a[0]) : a[0];
		o = n.valueCallback ? n.valueCallback(o) : o;
		let s = t.slice(i.length);
		return {
			value: o,
			rest: s
		};
	};
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/locale/en-US.js
var co = {
	code: "en-US",
	formatDistance: Za,
	formatLong: $a,
	formatRelative: to,
	localize: ro,
	match: {
		ordinalNumber: so({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: (e) => parseInt(e, 10)
		}),
		era: io({
			matchPatterns: {
				narrow: /^(b|a)/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
				wide: /^(before christ|before common era|anno domini|common era)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^b/i, /^(a|c)/i] },
			defaultParseWidth: "any"
		}),
		quarter: io({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](th|st|nd|rd)? quarter/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/1/i,
				/2/i,
				/3/i,
				/4/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: io({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
				wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^j/i,
					/^f/i,
					/^m/i,
					/^a/i,
					/^m/i,
					/^j/i,
					/^j/i,
					/^a/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				],
				any: [
					/^ja/i,
					/^f/i,
					/^mar/i,
					/^ap/i,
					/^may/i,
					/^jun/i,
					/^jul/i,
					/^au/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: io({
			matchPatterns: {
				narrow: /^[smtwf]/i,
				short: /^(su|mo|tu|we|th|fr|sa)/i,
				abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
				wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^s/i,
					/^m/i,
					/^t/i,
					/^w/i,
					/^t/i,
					/^f/i,
					/^s/i
				],
				any: [
					/^su/i,
					/^m/i,
					/^tu/i,
					/^w/i,
					/^th/i,
					/^f/i,
					/^sa/i
				]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: io({
			matchPatterns: {
				narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
				any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^a/i,
				pm: /^p/i,
				midnight: /^mi/i,
				noon: /^no/i,
				morning: /morning/i,
				afternoon: /afternoon/i,
				evening: /evening/i,
				night: /night/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
};
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getDayOfYear.js
function lo(e, t) {
	let n = Q(e, t?.in);
	return Ga(n, Ya(n)) + 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getISOWeek.js
function uo(e, t) {
	let n = Q(e, t?.in), r = Ba(n) - +Ka(n);
	return Math.round(r / ka) + 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getWeekYear.js
function fo(e, t) {
	let n = Q(e, t?.in), r = n.getFullYear(), i = Ra(), a = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? i.firstWeekContainsDate ?? i.locale?.options?.firstWeekContainsDate ?? 1, o = Fa(t?.in || e, 0);
	o.setFullYear(r + 1, 0, a), o.setHours(0, 0, 0, 0);
	let s = za(o, t), c = Fa(t?.in || e, 0);
	c.setFullYear(r, 0, a), c.setHours(0, 0, 0, 0);
	let l = za(c, t);
	return +n >= +s ? r + 1 : +n >= +l ? r : r - 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/startOfWeekYear.js
function po(e, t) {
	let n = Ra(), r = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, i = fo(e, t), a = Fa(t?.in || e, 0);
	return a.setFullYear(i, 0, r), a.setHours(0, 0, 0, 0), za(a, t);
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/getWeek.js
function mo(e, t) {
	let n = Q(e, t?.in), r = za(n, t) - +po(n, t);
	return Math.round(r / ka) + 1;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/addLeadingZeros.js
function $(e, t) {
	return (e < 0 ? "-" : "") + Math.abs(e).toString().padStart(t, "0");
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/format/lightFormatters.js
var ho = {
	y(e, t) {
		let n = e.getFullYear(), r = n > 0 ? n : 1 - n;
		return $(t === "yy" ? r % 100 : r, t.length);
	},
	M(e, t) {
		let n = e.getMonth();
		return t === "M" ? String(n + 1) : $(n + 1, 2);
	},
	d(e, t) {
		return $(e.getDate(), t.length);
	},
	a(e, t) {
		let n = e.getHours() / 12 >= 1 ? "pm" : "am";
		switch (t) {
			case "a":
			case "aa": return n.toUpperCase();
			case "aaa": return n;
			case "aaaaa": return n[0];
			default: return n === "am" ? "a.m." : "p.m.";
		}
	},
	h(e, t) {
		return $(e.getHours() % 12 || 12, t.length);
	},
	H(e, t) {
		return $(e.getHours(), t.length);
	},
	m(e, t) {
		return $(e.getMinutes(), t.length);
	},
	s(e, t) {
		return $(e.getSeconds(), t.length);
	},
	S(e, t) {
		let n = t.length, r = e.getMilliseconds();
		return $(Math.trunc(r * 10 ** (n - 3)), t.length);
	}
}, go = {
	am: "am",
	pm: "pm",
	midnight: "midnight",
	noon: "noon",
	morning: "morning",
	afternoon: "afternoon",
	evening: "evening",
	night: "night"
}, _o = {
	G: function(e, t, n) {
		let r = +(e.getFullYear() > 0);
		switch (t) {
			case "G":
			case "GG":
			case "GGG": return n.era(r, { width: "abbreviated" });
			case "GGGGG": return n.era(r, { width: "narrow" });
			default: return n.era(r, { width: "wide" });
		}
	},
	y: function(e, t, n) {
		if (t === "yo") {
			let t = e.getFullYear(), r = t > 0 ? t : 1 - t;
			return n.ordinalNumber(r, { unit: "year" });
		}
		return ho.y(e, t);
	},
	Y: function(e, t, n, r) {
		let i = fo(e, r), a = i > 0 ? i : 1 - i;
		return t === "YY" ? $(a % 100, 2) : t === "Yo" ? n.ordinalNumber(a, { unit: "year" }) : $(a, t.length);
	},
	R: function(e, t) {
		return $(Va(e), t.length);
	},
	u: function(e, t) {
		return $(e.getFullYear(), t.length);
	},
	Q: function(e, t, n) {
		let r = Math.ceil((e.getMonth() + 1) / 3);
		switch (t) {
			case "Q": return String(r);
			case "QQ": return $(r, 2);
			case "Qo": return n.ordinalNumber(r, { unit: "quarter" });
			case "QQQ": return n.quarter(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "QQQQQ": return n.quarter(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.quarter(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	q: function(e, t, n) {
		let r = Math.ceil((e.getMonth() + 1) / 3);
		switch (t) {
			case "q": return String(r);
			case "qq": return $(r, 2);
			case "qo": return n.ordinalNumber(r, { unit: "quarter" });
			case "qqq": return n.quarter(r, {
				width: "abbreviated",
				context: "standalone"
			});
			case "qqqqq": return n.quarter(r, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.quarter(r, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	M: function(e, t, n) {
		let r = e.getMonth();
		switch (t) {
			case "M":
			case "MM": return ho.M(e, t);
			case "Mo": return n.ordinalNumber(r + 1, { unit: "month" });
			case "MMM": return n.month(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "MMMMM": return n.month(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.month(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	L: function(e, t, n) {
		let r = e.getMonth();
		switch (t) {
			case "L": return String(r + 1);
			case "LL": return $(r + 1, 2);
			case "Lo": return n.ordinalNumber(r + 1, { unit: "month" });
			case "LLL": return n.month(r, {
				width: "abbreviated",
				context: "standalone"
			});
			case "LLLLL": return n.month(r, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.month(r, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	w: function(e, t, n, r) {
		let i = mo(e, r);
		return t === "wo" ? n.ordinalNumber(i, { unit: "week" }) : $(i, t.length);
	},
	I: function(e, t, n) {
		let r = uo(e);
		return t === "Io" ? n.ordinalNumber(r, { unit: "week" }) : $(r, t.length);
	},
	d: function(e, t, n) {
		return t === "do" ? n.ordinalNumber(e.getDate(), { unit: "date" }) : ho.d(e, t);
	},
	D: function(e, t, n) {
		let r = lo(e);
		return t === "Do" ? n.ordinalNumber(r, { unit: "dayOfYear" }) : $(r, t.length);
	},
	E: function(e, t, n) {
		let r = e.getDay();
		switch (t) {
			case "E":
			case "EE":
			case "EEE": return n.day(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "EEEEE": return n.day(r, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return n.day(r, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	e: function(e, t, n, r) {
		let i = e.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
		switch (t) {
			case "e": return String(a);
			case "ee": return $(a, 2);
			case "eo": return n.ordinalNumber(a, { unit: "day" });
			case "eee": return n.day(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "eeeee": return n.day(i, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return n.day(i, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	c: function(e, t, n, r) {
		let i = e.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
		switch (t) {
			case "c": return String(a);
			case "cc": return $(a, t.length);
			case "co": return n.ordinalNumber(a, { unit: "day" });
			case "ccc": return n.day(i, {
				width: "abbreviated",
				context: "standalone"
			});
			case "ccccc": return n.day(i, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return n.day(i, {
				width: "short",
				context: "standalone"
			});
			default: return n.day(i, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	i: function(e, t, n) {
		let r = e.getDay(), i = r === 0 ? 7 : r;
		switch (t) {
			case "i": return String(i);
			case "ii": return $(i, t.length);
			case "io": return n.ordinalNumber(i, { unit: "day" });
			case "iii": return n.day(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "iiiii": return n.day(r, {
				width: "narrow",
				context: "formatting"
			});
			case "iiiiii": return n.day(r, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	a: function(e, t, n) {
		let r = e.getHours() / 12 >= 1 ? "pm" : "am";
		switch (t) {
			case "a":
			case "aa": return n.dayPeriod(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "aaa": return n.dayPeriod(r, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "aaaaa": return n.dayPeriod(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	b: function(e, t, n) {
		let r = e.getHours(), i;
		switch (i = r === 12 ? go.noon : r === 0 ? go.midnight : r / 12 >= 1 ? "pm" : "am", t) {
			case "b":
			case "bb": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "bbb": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "bbbbb": return n.dayPeriod(i, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	B: function(e, t, n) {
		let r = e.getHours(), i;
		switch (i = r >= 17 ? go.evening : r >= 12 ? go.afternoon : r >= 4 ? go.morning : go.night, t) {
			case "B":
			case "BB":
			case "BBB": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "BBBBB": return n.dayPeriod(i, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	h: function(e, t, n) {
		if (t === "ho") {
			let t = e.getHours() % 12;
			return t === 0 && (t = 12), n.ordinalNumber(t, { unit: "hour" });
		}
		return ho.h(e, t);
	},
	H: function(e, t, n) {
		return t === "Ho" ? n.ordinalNumber(e.getHours(), { unit: "hour" }) : ho.H(e, t);
	},
	K: function(e, t, n) {
		let r = e.getHours() % 12;
		return t === "Ko" ? n.ordinalNumber(r, { unit: "hour" }) : $(r, t.length);
	},
	k: function(e, t, n) {
		let r = e.getHours();
		return r === 0 && (r = 24), t === "ko" ? n.ordinalNumber(r, { unit: "hour" }) : $(r, t.length);
	},
	m: function(e, t, n) {
		return t === "mo" ? n.ordinalNumber(e.getMinutes(), { unit: "minute" }) : ho.m(e, t);
	},
	s: function(e, t, n) {
		return t === "so" ? n.ordinalNumber(e.getSeconds(), { unit: "second" }) : ho.s(e, t);
	},
	S: function(e, t) {
		return ho.S(e, t);
	},
	X: function(e, t, n) {
		let r = e.getTimezoneOffset();
		if (r === 0) return "Z";
		switch (t) {
			case "X": return yo(r);
			case "XXXX":
			case "XX": return bo(r);
			default: return bo(r, ":");
		}
	},
	x: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "x": return yo(r);
			case "xxxx":
			case "xx": return bo(r);
			default: return bo(r, ":");
		}
	},
	O: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "O":
			case "OO":
			case "OOO": return "GMT" + vo(r, ":");
			default: return "GMT" + bo(r, ":");
		}
	},
	z: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "z":
			case "zz":
			case "zzz": return "GMT" + vo(r, ":");
			default: return "GMT" + bo(r, ":");
		}
	},
	t: function(e, t, n) {
		return $(Math.trunc(e / 1e3), t.length);
	},
	T: function(e, t, n) {
		return $(+e, t.length);
	}
};
function vo(e, t = "") {
	let n = e > 0 ? "-" : "+", r = Math.abs(e), i = Math.trunc(r / 60), a = r % 60;
	return a === 0 ? n + String(i) : n + String(i) + t + $(a, 2);
}
function yo(e, t) {
	return e % 60 == 0 ? (e > 0 ? "-" : "+") + $(Math.abs(e) / 60, 2) : bo(e, t);
}
function bo(e, t = "") {
	let n = e > 0 ? "-" : "+", r = Math.abs(e), i = $(Math.trunc(r / 60), 2), a = $(r % 60, 2);
	return n + i + t + a;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/_lib/format/longFormatters.js
var xo = (e, t) => {
	switch (e) {
		case "P": return t.date({ width: "short" });
		case "PP": return t.date({ width: "medium" });
		case "PPP": return t.date({ width: "long" });
		default: return t.date({ width: "full" });
	}
}, So = (e, t) => {
	switch (e) {
		case "p": return t.time({ width: "short" });
		case "pp": return t.time({ width: "medium" });
		case "ppp": return t.time({ width: "long" });
		default: return t.time({ width: "full" });
	}
}, Co = {
	p: So,
	P: (e, t) => {
		let n = e.match(/(P+)(p+)?/) || [], r = n[1], i = n[2];
		if (!i) return xo(e, t);
		let a;
		switch (r) {
			case "P":
				a = t.dateTime({ width: "short" });
				break;
			case "PP":
				a = t.dateTime({ width: "medium" });
				break;
			case "PPP":
				a = t.dateTime({ width: "long" });
				break;
			default: a = t.dateTime({ width: "full" });
		}
		return a.replace("{{date}}", xo(r, t)).replace("{{time}}", So(i, t));
	}
}, wo = /^D+$/, To = /^Y+$/, Eo = [
	"D",
	"DD",
	"YY",
	"YYYY"
];
function Do(e) {
	return wo.test(e);
}
function Oo(e) {
	return To.test(e);
}
function ko(e, t, n) {
	let r = Ao(e, t, n);
	if (console.warn(r), Eo.includes(e)) throw RangeError(r);
}
function Ao(e, t, n) {
	let r = e[0] === "Y" ? "years" : "days of the month";
	return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/format.js
var jo = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Mo = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, No = /^'([^]*?)'?$/, Po = /''/g, Fo = /[a-zA-Z]/;
function Io(e, t, n) {
	let r = Ra(), i = n?.locale ?? r.locale ?? co, a = n?.firstWeekContainsDate ?? n?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, o = n?.weekStartsOn ?? n?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, s = Q(e, n?.in);
	if (!Ja(s)) throw RangeError("Invalid time value");
	let c = t.match(Mo).map((e) => {
		let t = e[0];
		if (t === "p" || t === "P") {
			let n = Co[t];
			return n(e, i.formatLong);
		}
		return e;
	}).join("").match(jo).map((e) => {
		if (e === "''") return {
			isToken: !1,
			value: "'"
		};
		let t = e[0];
		if (t === "'") return {
			isToken: !1,
			value: Lo(e)
		};
		if (_o[t]) return {
			isToken: !0,
			value: e
		};
		if (t.match(Fo)) throw RangeError("Format string contains an unescaped latin alphabet character `" + t + "`");
		return {
			isToken: !1,
			value: e
		};
	});
	i.localize.preprocessor && (c = i.localize.preprocessor(s, c));
	let l = {
		firstWeekContainsDate: a,
		weekStartsOn: o,
		locale: i
	};
	return c.map((r) => {
		if (!r.isToken) return r.value;
		let a = r.value;
		(!n?.useAdditionalWeekYearTokens && Oo(a) || !n?.useAdditionalDayOfYearTokens && Do(a)) && ko(a, t, String(e));
		let o = _o[a[0]];
		return o(s, a, i.localize, l);
	}).join("");
}
function Lo(e) {
	let t = e.match(No);
	return t ? t[1].replace(Po, "'") : e;
}
//#endregion
//#region node_modules/.pnpm/date-fns@4.4.0/node_modules/date-fns/parseISO.js
function Ro(e, t) {
	let n = () => Fa(t?.in, NaN), r = t?.additionalDigits ?? 2, i = Uo(e), a;
	if (i.date) {
		let e = Wo(i.date, r);
		a = Go(e.restDateString, e.year);
	}
	if (!a || isNaN(+a)) return n();
	let o = +a, s = 0, c;
	if (i.time && (s = qo(i.time), isNaN(s))) return n();
	if (i.timezone) {
		if (c = Yo(i.timezone), isNaN(c)) return n();
	} else {
		let e = new Date(o + s), n = Q(0, t?.in);
		return n.setFullYear(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()), n.setHours(e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds()), n;
	}
	return Q(o + s + c, t?.in);
}
var zo = {
	dateTimeDelimiter: /[T ]/,
	timeZoneDelimiter: /[Z ]/i,
	timezone: /([Z+-].*)$/
}, Bo = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/, Vo = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/, Ho = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function Uo(e) {
	let t = {}, n = e.split(zo.dateTimeDelimiter), r;
	if (n.length > 2) return t;
	if (/:/.test(n[0]) ? r = n[0] : (t.date = n[0], r = n[1], zo.timeZoneDelimiter.test(t.date) && (t.date = e.split(zo.timeZoneDelimiter)[0], r = e.substr(t.date.length, e.length))), r) {
		let e = zo.timezone.exec(r);
		e ? (t.time = r.replace(e[1], ""), t.timezone = e[1]) : t.time = r;
	}
	return t;
}
function Wo(e, t) {
	let n = RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + t) + "})|(\\d{2}|[+-]\\d{" + (2 + t) + "})$)"), r = e.match(n);
	if (!r) return {
		year: NaN,
		restDateString: ""
	};
	let i = r[1] ? parseInt(r[1]) : null, a = r[2] ? parseInt(r[2]) : null;
	return {
		year: a === null ? i : a * 100,
		restDateString: e.slice((r[1] || r[2]).length)
	};
}
function Go(e, t) {
	if (t === null) return /* @__PURE__ */ new Date(NaN);
	let n = e.match(Bo);
	if (!n) return /* @__PURE__ */ new Date(NaN);
	let r = !!n[4], i = Ko(n[1]), a = Ko(n[2]) - 1, o = Ko(n[3]), s = Ko(n[4]), c = Ko(n[5]) - 1;
	if (r) return ts(t, s, c) ? Xo(t, s, c) : /* @__PURE__ */ new Date(NaN);
	{
		let e = /* @__PURE__ */ new Date(0);
		return !$o(t, a, o) || !es(t, i) ? /* @__PURE__ */ new Date(NaN) : (e.setUTCFullYear(t, a, Math.max(i, o)), e);
	}
}
function Ko(e) {
	return e ? parseInt(e) : 1;
}
function qo(e) {
	let t = e.match(Vo);
	if (!t) return NaN;
	let n = Jo(t[1]), r = Jo(t[2]), i = Jo(t[3]);
	return ns(n, r, i) ? n * Ma + r * ja + i * 1e3 : NaN;
}
function Jo(e) {
	return e && parseFloat(e.replace(",", ".")) || 0;
}
function Yo(e) {
	if (e === "Z") return 0;
	let t = e.match(Ho);
	if (!t) return 0;
	let n = t[1] === "+" ? -1 : 1, r = parseInt(t[2]), i = t[3] && parseInt(t[3]) || 0;
	return rs(r, i) ? n * (r * Ma + i * ja) : NaN;
}
function Xo(e, t, n) {
	let r = /* @__PURE__ */ new Date(0);
	r.setUTCFullYear(e, 0, 4);
	let i = r.getUTCDay() || 7, a = (t - 1) * 7 + n + 1 - i;
	return r.setUTCDate(r.getUTCDate() + a), r;
}
var Zo = [
	31,
	null,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
function Qo(e) {
	return e % 400 == 0 || e % 4 == 0 && e % 100 != 0;
}
function $o(e, t, n) {
	return t >= 0 && t <= 11 && n >= 1 && n <= (Zo[t] || (Qo(e) ? 29 : 28));
}
function es(e, t) {
	return t >= 1 && t <= (Qo(e) ? 366 : 365);
}
function ts(e, t, n) {
	return t >= 1 && t <= 53 && n >= 0 && n <= 6;
}
function ns(e, t, n) {
	return e === 24 ? t === 0 && n === 0 : n >= 0 && n < 60 && t >= 0 && t < 60 && e >= 0 && e < 25;
}
function rs(e, t) {
	return t >= 0 && t <= 59;
}
//#endregion
//#region src/domain/models.ts
var is = [
	1,
	2,
	4,
	7,
	15,
	30
];
//#endregion
//#region src/domain/schedule.ts
function as(e) {
	let t = Ro(e);
	return is.map((e) => Io(Ia(t, e), "yyyy-MM-dd"));
}
//#endregion
//#region src/capture/capture-to-entry.ts
function os(e) {
	return {
		english: e.text,
		usIpa: e.usIpa,
		ukIpa: e.ukIpa,
		usAudioUrl: e.usAudioUrl,
		ukAudioUrl: e.ukAudioUrl,
		meaningsZh: e.meaningsZh,
		exampleEn: e.exampleEn,
		exampleZh: e.exampleZh,
		audioFallback: e.audioFallback,
		source: e.usAudioUrl || e.ukAudioUrl ? "dictionary-ai" : "ai"
	};
}
//#endregion
//#region src/db/repository.ts
function ss(e) {
	return e.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}
var cs = class {
	db;
	constructor(e) {
		this.db = e;
	}
	async saveEntries(e, t) {
		let n = await this.appendToDailyList(e, t, !0);
		if (!n.ok) throw Error("Duplicate override failed");
		return n.list;
	}
	async appendToDailyList(e, t, n = !1) {
		if (t.length === 0) throw Error("At least one entry is required");
		return this.db.transaction("rw", this.db.lists, this.db.entries, this.db.reviewNodes, async () => {
			let r = [...new Set(t.map((e) => ss(e.english)))], i = await this.db.entries.where("normalizedEnglish").anyOf(r).toArray();
			if (!n && i.length > 0) {
				let e = (await this.db.lists.bulkGet(i.map((e) => e.listId))).filter((e) => e !== void 0), t = new Map(e.map((e) => [e.id, e]));
				return {
					ok: !1,
					code: "DUPLICATE",
					duplicates: i.flatMap((e) => {
						let n = t.get(e.listId);
						return n ? [{
							listId: n.id,
							listNumber: n.listNumber,
							normalizedEnglish: e.normalizedEnglish
						}] : [];
					})
				};
			}
			let a = await this.getOrCreateDailyList(e);
			return await this.insertEntries(a.id, t), {
				ok: !0,
				list: a
			};
		});
	}
	async getOrCreateDailyList(e) {
		let t = await this.db.lists.where("createdDate").equals(e).first();
		if (t) return t;
		let n = {
			id: crypto.randomUUID(),
			listNumber: await this.db.lists.count() + 1,
			createdDate: e,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		await this.db.lists.add(n);
		let r = as(e).map((e, t) => ({
			id: crypto.randomUUID(),
			listId: n.id,
			dueDate: e,
			completedAt: null,
			sequence: t
		}));
		return await this.db.reviewNodes.bulkAdd(r), n;
	}
	async insertEntries(e, t) {
		let n = (/* @__PURE__ */ new Date()).toISOString();
		await this.db.entries.bulkAdd(t.map((t) => ({
			...t,
			id: crypto.randomUUID(),
			listId: e,
			normalizedEnglish: ss(t.english),
			updatedAt: n
		})));
	}
	getLists() {
		return this.db.lists.orderBy("listNumber").toArray();
	}
	getEntries(e) {
		return this.db.entries.where("listId").equals(e).toArray();
	}
	async saveCaptureDraft(e) {
		await this.db.captureDrafts.put(e);
	}
	getCaptureDrafts() {
		return this.db.captureDrafts.orderBy("capturedAt").toArray();
	}
	async updateCaptureDraft(e, t) {
		if (await this.db.captureDrafts.update(e, t) === 0) throw Error("Capture not found");
	}
	deleteCaptureDraft(e) {
		return this.db.captureDrafts.delete(e);
	}
	async findDuplicate(e) {
		let t = await this.db.entries.where("normalizedEnglish").equals(e).first();
		if (!t) return null;
		let n = await this.db.lists.get(t.listId);
		return n ? {
			listId: n.id,
			listNumber: n.listNumber
		} : null;
	}
	async promoteCaptureDrafts(e, t) {
		if (t.length === 0) throw Error("At least one capture is required");
		return this.db.transaction("rw", this.db.captureDrafts, this.db.lists, this.db.entries, this.db.reviewNodes, async () => {
			let n = (await this.db.captureDrafts.bulkGet(t)).filter((e) => e !== void 0);
			if (n.length !== t.length || n.some((e) => e.status !== "ready")) throw Error("Capture selection is incomplete");
			let r = await this.db.lists.where("createdDate").equals(e).first(), i = (/* @__PURE__ */ new Date()).toISOString();
			return r || (r = {
				id: crypto.randomUUID(),
				listNumber: await this.db.lists.count() + 1,
				createdDate: e,
				createdAt: i
			}, await this.db.lists.add(r), await this.db.reviewNodes.bulkAdd(as(e).map((e, t) => ({
				id: crypto.randomUUID(),
				listId: r.id,
				dueDate: e,
				completedAt: null,
				sequence: t
			})))), await this.db.entries.bulkAdd(n.map((e) => ({
				id: crypto.randomUUID(),
				listId: r.id,
				english: e.text,
				normalizedEnglish: e.normalizedText,
				usIpa: e.usIpa,
				ukIpa: e.ukIpa,
				usAudioUrl: e.usAudioUrl,
				ukAudioUrl: e.ukAudioUrl,
				meaningsZh: e.meaningsZh,
				exampleEn: e.exampleEn,
				exampleZh: e.exampleZh,
				audioFallback: e.audioFallback,
				source: e.usAudioUrl || e.ukAudioUrl ? "dictionary-ai" : "ai",
				updatedAt: i
			}))), await this.db.captureDrafts.bulkDelete(t), r;
		});
	}
	async migrateReadyCaptures(e) {
		return this.db.transaction("rw", this.db.captureDrafts, this.db.lists, this.db.entries, this.db.reviewNodes, async () => {
			let t = await this.db.captureDrafts.where("status").equals("ready").toArray();
			if (t.length === 0) return { migrated: 0 };
			let n = await this.getOrCreateDailyList(e);
			return await this.insertEntries(n.id, t.map(os)), await this.db.captureDrafts.bulkDelete(t.map((e) => e.id)), {
				migrated: t.length,
				listNumber: n.listNumber
			};
		});
	}
	async getReviewNodes(e) {
		return (await this.db.reviewNodes.where("listId").equals(e).toArray()).sort((e, t) => e.sequence - t.sequence);
	}
	async completeReviewNode(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
		if (await this.db.reviewNodes.update(e, { completedAt: t }) === 0) throw Error("Review node not found");
	}
	async undoCompletion(e) {
		if (await this.db.reviewNodes.update(e, { completedAt: null }) === 0) throw Error("Review node not found");
	}
	async deleteList(e) {
		await this.db.transaction("rw", this.db.lists, this.db.entries, this.db.reviewNodes, async () => {
			await Promise.all([this.db.entries.where("listId").equals(e).delete(), this.db.reviewNodes.where("listId").equals(e).delete()]), await this.db.lists.delete(e);
		});
	}
	async updateEntry(e, t) {
		if (await this.db.entries.update(e, {
			...t,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}) === 0) throw Error("Entry not found");
	}
	async saveDraft(e, t) {
		await this.db.drafts.put({
			id: e,
			payload: t,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	async setSetting(e, t) {
		await this.db.settings.put({
			key: e,
			value: t
		});
	}
	async snapshot() {
		let [e, t, n, r, i, a] = await Promise.all([
			this.db.lists.orderBy("listNumber").toArray(),
			this.db.entries.toArray(),
			this.db.reviewNodes.toArray(),
			this.db.drafts.toArray(),
			this.db.settings.toArray(),
			this.db.captureDrafts.orderBy("capturedAt").toArray()
		]);
		return {
			lists: e,
			entries: t,
			reviewNodes: n,
			drafts: r,
			settings: i,
			captureDrafts: a
		};
	}
	async clearAll() {
		await this.db.transaction("rw", [
			this.db.lists,
			this.db.entries,
			this.db.reviewNodes,
			this.db.drafts,
			this.db.settings,
			this.db.captureDrafts
		], () => Promise.all([
			this.db.lists.clear(),
			this.db.entries.clear(),
			this.db.reviewNodes.clear(),
			this.db.drafts.clear(),
			this.db.settings.clear(),
			this.db.captureDrafts.clear()
		]).then(() => void 0));
	}
	async replaceSnapshot(e) {
		await this.db.transaction("rw", [
			this.db.lists,
			this.db.entries,
			this.db.reviewNodes,
			this.db.drafts,
			this.db.settings,
			this.db.captureDrafts
		], async () => {
			await Promise.all([
				this.db.lists.clear(),
				this.db.entries.clear(),
				this.db.reviewNodes.clear(),
				this.db.drafts.clear(),
				this.db.settings.clear(),
				this.db.captureDrafts.clear()
			]), await this.db.lists.bulkAdd(e.lists), await this.db.entries.bulkAdd(e.entries), await this.db.reviewNodes.bulkAdd(e.reviewNodes), await this.db.drafts.bulkAdd(e.drafts), await this.db.settings.bulkAdd(e.settings), await this.db.captureDrafts.bulkAdd(e.captureDrafts);
		});
	}
}, ls = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	((n, r) => {
		typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self).Dexie = r();
	})(e, function() {
		var e = function(t, n) {
			return (e = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? function(e, t) {
				e.__proto__ = t;
			} : function(e, t) {
				for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
			}))(t, n);
		}, t = function() {
			return (t = Object.assign || function(e) {
				for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
				return e;
			}).apply(this, arguments);
		};
		function n(e, t, n) {
			if (n || arguments.length === 2) for (var r, i = 0, a = t.length; i < a; i++) !r && i in t || ((r ||= Array.prototype.slice.call(t, 0, i))[i] = t[i]);
			return e.concat(r || Array.prototype.slice.call(t));
		}
		var r = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, i = Object.keys, a = Array.isArray;
		function o(e, t) {
			return typeof t == "object" && i(t).forEach(function(n) {
				e[n] = t[n];
			}), e;
		}
		typeof Promise > "u" || r.Promise || (r.Promise = Promise);
		var s = Object.getPrototypeOf, c = {}.hasOwnProperty;
		function l(e, t) {
			return c.call(e, t);
		}
		function u(e, t) {
			typeof t == "function" && (t = t(s(e))), (typeof Reflect > "u" ? i : Reflect.ownKeys)(t).forEach(function(n) {
				f(e, n, t[n]);
			});
		}
		var d = Object.defineProperty;
		function f(e, t, n, r) {
			d(e, t, o(n && l(n, "get") && typeof n.get == "function" ? {
				get: n.get,
				set: n.set,
				configurable: !0
			} : {
				value: n,
				configurable: !0,
				writable: !0
			}, r));
		}
		function p(e) {
			return { from: function(t) {
				return e.prototype = Object.create(t.prototype), f(e.prototype, "constructor", e), { extend: u.bind(null, e.prototype) };
			} };
		}
		var m = Object.getOwnPropertyDescriptor, h = [].slice;
		function g(e, t, n) {
			return h.call(e, t, n);
		}
		function _(e, t) {
			return t(e);
		}
		function v(e) {
			if (!e) throw Error("Assertion Failed");
		}
		function y(e) {
			r.setImmediate ? setImmediate(e) : setTimeout(e, 0);
		}
		function b(e, t) {
			if (typeof t == "string" && l(e, t)) return e[t];
			if (!t) return e;
			if (typeof t != "string") {
				for (var n = [], r = 0, i = t.length; r < i; ++r) {
					var a = b(e, t[r]);
					n.push(a);
				}
				return n;
			}
			var o, s = t.indexOf(".");
			return s === -1 || (o = e[t.substr(0, s)]) == null ? void 0 : b(o, t.substr(s + 1));
		}
		function x(e, t, n) {
			if (e && t !== void 0 && !("isFrozen" in Object && Object.isFrozen(e))) {
				if (typeof t != "string" && "length" in t) {
					v(typeof n != "string" && "length" in n);
					for (var r = 0, i = t.length; r < i; ++r) x(e, t[r], n[r]);
				} else {
					var o = t.indexOf(".");
					if (o !== -1) {
						var s = t.substr(0, o), o = t.substr(o + 1);
						if (o === "") n === void 0 ? a(e) && !isNaN(parseInt(s)) ? e.splice(s, 1) : delete e[s] : e[s] = n;
						else {
							var c = e[s];
							if (!c || !l(e, s)) {
								if (n === void 0) return;
								c = e[s] = {};
							}
							x(c, o, n);
						}
					} else n === void 0 ? a(e) && !isNaN(parseInt(t)) ? e.splice(t, 1) : delete e[t] : e[t] = n;
				}
			}
		}
		function S(e) {
			var t, n = {};
			for (t in e) l(e, t) && (n[t] = e[t]);
			return n;
		}
		var C = [].concat;
		function ee(e) {
			return C.apply([], e);
		}
		var te = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(ee([
			8,
			16,
			32,
			64
		].map(function(e) {
			return [
				"Int",
				"Uint",
				"Float"
			].map(function(t) {
				return t + e + "Array";
			});
		}))).filter(function(e) {
			return r[e];
		}), ne = new Set(te.map(function(e) {
			return r[e];
		})), re = null;
		function ie(e) {
			return re = /* @__PURE__ */ new WeakMap(), e = function e(t) {
				if (!t || typeof t != "object") return t;
				var n = re.get(t);
				if (n) return n;
				if (a(t)) {
					n = [], re.set(t, n);
					for (var r = 0, i = t.length; r < i; ++r) n.push(e(t[r]));
				} else if (ne.has(t.constructor)) n = t;
				else {
					var o, c = s(t);
					for (o in n = c === Object.prototype ? {} : Object.create(c), re.set(t, n), t) l(t, o) && (n[o] = e(t[o]));
				}
				return n;
			}(e), re = null, e;
		}
		var ae = {}.toString;
		function oe(e) {
			return ae.call(e).slice(8, -1);
		}
		var se = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", ce = typeof se == "symbol" ? function(e) {
			var t;
			return e != null && (t = e[se]) && t.apply(e);
		} : function() {
			return null;
		};
		function w(e, t) {
			t = e.indexOf(t), 0 <= t && e.splice(t, 1);
		}
		var T = {};
		function le(e) {
			var t, n, r, i;
			if (arguments.length === 1) {
				if (a(e)) return e.slice();
				if (this === T && typeof e == "string") return [e];
				if (i = ce(e)) for (n = []; !(r = i.next()).done;) n.push(r.value);
				else {
					if (e == null || typeof (t = e.length) != "number") return [e];
					for (n = Array(t); t--;) n[t] = e[t];
				}
			} else for (t = arguments.length, n = Array(t); t--;) n[t] = arguments[t];
			return n;
		}
		var ue = typeof Symbol < "u" ? function(e) {
			return e[Symbol.toStringTag] === "AsyncFunction";
		} : function() {
			return !1;
		}, te = [
			"Unknown",
			"Constraint",
			"Data",
			"TransactionInactive",
			"ReadOnly",
			"Version",
			"NotFound",
			"InvalidState",
			"InvalidAccess",
			"Abort",
			"Timeout",
			"QuotaExceeded",
			"Syntax",
			"DataClone"
		], E = [
			"Modify",
			"Bulk",
			"OpenFailed",
			"VersionChange",
			"Schema",
			"Upgrade",
			"InvalidTable",
			"MissingAPI",
			"NoSuchDatabase",
			"InvalidArgument",
			"SubTransaction",
			"Unsupported",
			"Internal",
			"DatabaseClosed",
			"PrematureCommit",
			"ForeignAwait"
		].concat(te), de = {
			VersionChanged: "Database version changed by other database connection",
			DatabaseClosed: "Database has been closed",
			Abort: "Transaction aborted",
			TransactionInactive: "Transaction has already completed or failed",
			MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
		};
		function fe(e, t) {
			this.name = e, this.message = t;
		}
		function pe(e, t) {
			return e + ". Errors: " + Object.keys(t).map(function(e) {
				return t[e].toString();
			}).filter(function(e, t, n) {
				return n.indexOf(e) === t;
			}).join("\n");
		}
		function me(e, t, n, r) {
			this.failures = t, this.failedKeys = r, this.successCount = n, this.message = pe(e, t);
		}
		function he(e, t) {
			this.name = "BulkError", this.failures = Object.keys(t).map(function(e) {
				return t[e];
			}), this.failuresByPos = t, this.message = pe(e, this.failures);
		}
		p(fe).from(Error).extend({ toString: function() {
			return this.name + ": " + this.message;
		} }), p(me).from(fe), p(he).from(fe);
		var ge = E.reduce(function(e, t) {
			return e[t] = t + "Error", e;
		}, {}), _e = fe, D = E.reduce(function(e, t) {
			var n = t + "Error";
			function r(e, r) {
				this.name = n, e ? typeof e == "string" ? (this.message = `${e}${r ? "\n " + r : ""}`, this.inner = r || null) : typeof e == "object" && (this.message = `${e.name} ${e.message}`, this.inner = e) : (this.message = de[t] || n, this.inner = null);
			}
			return p(r).from(_e), e[t] = r, e;
		}, {}), ve = (D.Syntax = SyntaxError, D.Type = TypeError, D.Range = RangeError, te.reduce(function(e, t) {
			return e[t + "Error"] = D[t], e;
		}, {}));
		te = E.reduce(function(e, t) {
			return [
				"Syntax",
				"Type",
				"Range"
			].indexOf(t) === -1 && (e[t + "Error"] = D[t]), e;
		}, {});
		function O() {}
		function ye(e) {
			return e;
		}
		function be(e, t) {
			return e == null || e === ye ? t : function(n) {
				return t(e(n));
			};
		}
		function xe(e, t) {
			return function() {
				e.apply(this, arguments), t.apply(this, arguments);
			};
		}
		function Se(e, t) {
			return e === O ? t : function() {
				var n = e.apply(this, arguments), r = (n !== void 0 && (arguments[0] = n), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return r && (this.onsuccess = this.onsuccess ? xe(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? xe(i, this.onerror) : i), a === void 0 ? n : a;
			};
		}
		function Ce(e, t) {
			return e === O ? t : function() {
				e.apply(this, arguments);
				var n = this.onsuccess, r = this.onerror;
				this.onsuccess = this.onerror = null, t.apply(this, arguments), n && (this.onsuccess = this.onsuccess ? xe(n, this.onsuccess) : n), r && (this.onerror = this.onerror ? xe(r, this.onerror) : r);
			};
		}
		function we(e, t) {
			return e === O ? t : function(n) {
				var r = e.apply(this, arguments), n = (o(n, r), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return n && (this.onsuccess = this.onsuccess ? xe(n, this.onsuccess) : n), i && (this.onerror = this.onerror ? xe(i, this.onerror) : i), r === void 0 ? a === void 0 ? void 0 : a : o(r, a);
			};
		}
		function Te(e, t) {
			return e === O ? t : function() {
				return !1 !== t.apply(this, arguments) && e.apply(this, arguments);
			};
		}
		function Ee(e, t) {
			return e === O ? t : function() {
				var n = e.apply(this, arguments);
				if (n && typeof n.then == "function") {
					for (var r = this, i = arguments.length, a = Array(i); i--;) a[i] = arguments[i];
					return n.then(function() {
						return t.apply(r, a);
					});
				}
				return t.apply(this, arguments);
			};
		}
		te.ModifyError = me, te.DexieError = fe, te.BulkError = he;
		var k = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
		function De(e) {
			k = e;
		}
		var Oe = {}, ke = 100, Ae = typeof Promise > "u" ? [] : (E = Promise.resolve(), typeof crypto < "u" && crypto.subtle ? [
			Ae = crypto.subtle.digest("SHA-512", new Uint8Array([0])),
			s(Ae),
			E
		] : [
			E,
			s(E),
			E
		]), E = Ae[0], je = Ae[1], je = je && je.then, Me = E && E.constructor, Ne = !!Ae[2], Pe = function(e, t) {
			Ve.push([e, t]), Ie &&= (queueMicrotask(Xe), !1);
		}, Fe = !0, Ie = !0, Le = [], Re = [], ze = ye, Be = {
			id: "global",
			global: !0,
			ref: 0,
			unhandleds: [],
			onunhandled: O,
			pgp: !1,
			env: {},
			finalize: O
		}, A = Be, Ve = [], He = 0, Ue = [];
		function j(e) {
			if (typeof this != "object") throw TypeError("Promises must be constructed via new");
			this._listeners = [], this._lib = !1;
			var t = this._PSD = A;
			if (typeof e != "function") {
				if (e !== Oe) throw TypeError("Not a function");
				this._state = arguments[1], this._value = arguments[2], !1 === this._state && Ke(this, this._value);
			} else this._state = null, this._value = null, ++t.ref, function e(t, n) {
				try {
					n(function(n) {
						if (t._state === null) {
							if (n === t) throw TypeError("A promise cannot be resolved with itself.");
							var r = t._lib && Ze();
							n && typeof n.then == "function" ? e(t, function(e, t) {
								n instanceof j ? n._then(e, t) : n.then(e, t);
							}) : (t._state = !0, t._value = n, qe(t)), r && Qe();
						}
					}, Ke.bind(null, t));
				} catch (e) {
					Ke(t, e);
				}
			}(this, e);
		}
		var We = {
			get: function() {
				var e = A, t = it;
				function n(n, r) {
					var i = this, a = !e.global && (e !== A || t !== it), o = a && !ct(), s = new j(function(t, s) {
						Je(i, new Ge(ft(n, e, a, o), ft(r, e, a, o), t, s, e));
					});
					return this._consoleTask && (s._consoleTask = this._consoleTask), s;
				}
				return n.prototype = Oe, n;
			},
			set: function(e) {
				f(this, "then", e && e.prototype === Oe ? We : {
					get: function() {
						return e;
					},
					set: We.set
				});
			}
		};
		function Ge(e, t, n, r, i) {
			this.onFulfilled = typeof e == "function" ? e : null, this.onRejected = typeof t == "function" ? t : null, this.resolve = n, this.reject = r, this.psd = i;
		}
		function Ke(e, t) {
			var n, r;
			Re.push(t), e._state === null && (n = e._lib && Ze(), t = ze(t), e._state = !1, e._value = t, r = e, Le.some(function(e) {
				return e._value === r._value;
			}) || Le.push(r), qe(e), n) && Qe();
		}
		function qe(e) {
			var t = e._listeners;
			e._listeners = [];
			for (var n = 0, r = t.length; n < r; ++n) Je(e, t[n]);
			var i = e._PSD;
			--i.ref || i.finalize(), He === 0 && (++He, Pe(function() {
				--He == 0 && $e();
			}, []));
		}
		function Je(e, t) {
			if (e._state === null) e._listeners.push(t);
			else {
				var n = e._state ? t.onFulfilled : t.onRejected;
				if (n === null) return (e._state ? t.resolve : t.reject)(e._value);
				++t.psd.ref, ++He, Pe(Ye, [
					n,
					e,
					t
				]);
			}
		}
		function Ye(e, t, n) {
			try {
				var r, i = t._value;
				!t._state && Re.length && (Re = []), r = k && t._consoleTask ? t._consoleTask.run(function() {
					return e(i);
				}) : e(i), t._state || Re.indexOf(i) !== -1 || ((e) => {
					for (var t = Le.length; t;) if (Le[--t]._value === e._value) return Le.splice(t, 1);
				})(t), n.resolve(r);
			} catch (e) {
				n.reject(e);
			} finally {
				--He == 0 && $e(), --n.psd.ref || n.psd.finalize();
			}
		}
		function Xe() {
			F(Be, function() {
				Ze() && Qe();
			});
		}
		function Ze() {
			var e = Fe;
			return Ie = Fe = !1, e;
		}
		function Qe() {
			var e, t, n;
			do
				for (; 0 < Ve.length;) for (e = Ve, Ve = [], n = e.length, t = 0; t < n; ++t) {
					var r = e[t];
					r[0].apply(null, r[1]);
				}
			while (0 < Ve.length);
			Ie = Fe = !0;
		}
		function $e() {
			for (var e = Le, t = (Le = [], e.forEach(function(e) {
				e._PSD.onunhandled.call(null, e._value, e);
			}), Ue.slice(0)), n = t.length; n;) t[--n]();
		}
		function et(e) {
			return new j(Oe, !1, e);
		}
		function M(e, t) {
			var n = A;
			return function() {
				var r = Ze(), i = A;
				try {
					return ut(n, !0), e.apply(this, arguments);
				} catch (e) {
					t && t(e);
				} finally {
					ut(i, !1), r && Qe();
				}
			};
		}
		u(j.prototype, {
			then: We,
			_then: function(e, t) {
				Je(this, new Ge(null, null, e, t, A));
			},
			catch: function(e) {
				var t, n;
				return arguments.length === 1 ? this.then(null, e) : (t = e, n = arguments[1], typeof t == "function" ? this.then(null, function(e) {
					return (e instanceof t ? n : et)(e);
				}) : this.then(null, function(e) {
					return (e && e.name === t ? n : et)(e);
				}));
			},
			finally: function(e) {
				return this.then(function(t) {
					return j.resolve(e()).then(function() {
						return t;
					});
				}, function(t) {
					return j.resolve(e()).then(function() {
						return et(t);
					});
				});
			},
			timeout: function(e, t) {
				var n = this;
				return e < 1 / 0 ? new j(function(r, i) {
					var a = setTimeout(function() {
						return i(new D.Timeout(t));
					}, e);
					n.then(r, i).finally(clearTimeout.bind(null, a));
				}) : this;
			}
		}), typeof Symbol < "u" && Symbol.toStringTag && f(j.prototype, Symbol.toStringTag, "Dexie.Promise"), Be.env = dt(), u(j, {
			all: function() {
				var e = le.apply(null, arguments).map(P);
				return new j(function(t, n) {
					e.length === 0 && t([]);
					var r = e.length;
					e.forEach(function(i, a) {
						return j.resolve(i).then(function(n) {
							e[a] = n, --r || t(e);
						}, n);
					});
				});
			},
			resolve: function(e) {
				return e instanceof j ? e : e && typeof e.then == "function" ? new j(function(t, n) {
					e.then(t, n);
				}) : new j(Oe, !0, e);
			},
			reject: et,
			race: function() {
				var e = le.apply(null, arguments).map(P);
				return new j(function(t, n) {
					e.map(function(e) {
						return j.resolve(e).then(t, n);
					});
				});
			},
			PSD: {
				get: function() {
					return A;
				},
				set: function(e) {
					return A = e;
				}
			},
			totalEchoes: { get: function() {
				return it;
			} },
			newPSD: ot,
			usePSD: F,
			scheduler: {
				get: function() {
					return Pe;
				},
				set: function(e) {
					Pe = e;
				}
			},
			rejectionMapper: {
				get: function() {
					return ze;
				},
				set: function(e) {
					ze = e;
				}
			},
			follow: function(e, t) {
				return new j(function(n, r) {
					return ot(function(t, n) {
						var r = A;
						r.unhandleds = [], r.onunhandled = n, r.finalize = xe(function() {
							var e, r = this;
							e = function() {
								r.unhandleds.length === 0 ? t() : n(r.unhandleds[0]);
							}, Ue.push(function t() {
								e(), Ue.splice(Ue.indexOf(t), 1);
							}), ++He, Pe(function() {
								--He == 0 && $e();
							}, []);
						}, r.finalize), e();
					}, t, n, r);
				});
			}
		}), Me && (Me.allSettled && f(j, "allSettled", function() {
			var e = le.apply(null, arguments).map(P);
			return new j(function(t) {
				e.length === 0 && t([]);
				var n = e.length, r = Array(n);
				e.forEach(function(e, i) {
					return j.resolve(e).then(function(e) {
						return r[i] = {
							status: "fulfilled",
							value: e
						};
					}, function(e) {
						return r[i] = {
							status: "rejected",
							reason: e
						};
					}).then(function() {
						return --n || t(r);
					});
				});
			});
		}), Me.any && typeof AggregateError < "u" && f(j, "any", function() {
			var e = le.apply(null, arguments).map(P);
			return new j(function(t, n) {
				e.length === 0 && n(/* @__PURE__ */ AggregateError([]));
				var r = e.length, i = Array(r);
				e.forEach(function(e, a) {
					return j.resolve(e).then(function(e) {
						return t(e);
					}, function(e) {
						i[a] = e, --r || n(AggregateError(i));
					});
				});
			});
		}), Me.withResolvers) && (j.withResolvers = Me.withResolvers);
		var N = {
			awaits: 0,
			echoes: 0,
			id: 0
		}, tt = 0, nt = [], rt = 0, it = 0, at = 0;
		function ot(e, t, n, r) {
			var i = A, a = Object.create(i), t = (a.parent = i, a.ref = 0, a.global = !1, a.id = ++at, Be.env, a.env = Ne ? {
				Promise: j,
				PromiseProp: {
					value: j,
					configurable: !0,
					writable: !0
				},
				all: j.all,
				race: j.race,
				allSettled: j.allSettled,
				any: j.any,
				resolve: j.resolve,
				reject: j.reject
			} : {}, t && o(a, t), ++i.ref, a.finalize = function() {
				--this.parent.ref || this.parent.finalize();
			}, F(a, e, n, r));
			return a.ref === 0 && a.finalize(), t;
		}
		function st() {
			return N.id ||= ++tt, ++N.awaits, N.echoes += ke, N.id;
		}
		function ct() {
			return !!N.awaits && (--N.awaits == 0 && (N.id = 0), N.echoes = N.awaits * ke, !0);
		}
		function P(e) {
			return N.echoes && e && e.constructor === Me ? (st(), e.then(function(e) {
				return ct(), e;
			}, function(e) {
				return ct(), I(e);
			})) : e;
		}
		function lt() {
			var e = nt[nt.length - 1];
			nt.pop(), ut(e, !1);
		}
		function ut(e, t) {
			var n, i, a = A;
			(t ? !N.echoes || rt++ && e === A : !rt || --rt && e === A) || queueMicrotask(t ? function(e) {
				++it, N.echoes && --N.echoes != 0 || (N.echoes = N.awaits = N.id = 0), nt.push(A), ut(e, !0);
			}.bind(null, e) : lt), e !== A && (A = e, a === Be && (Be.env = dt()), Ne) && (n = Be.env.Promise, i = e.env, a.global || e.global) && (Object.defineProperty(r, "Promise", i.PromiseProp), n.all = i.all, n.race = i.race, n.resolve = i.resolve, n.reject = i.reject, i.allSettled && (n.allSettled = i.allSettled), i.any) && (n.any = i.any);
		}
		function dt() {
			var e = r.Promise;
			return Ne ? {
				Promise: e,
				PromiseProp: Object.getOwnPropertyDescriptor(r, "Promise"),
				all: e.all,
				race: e.race,
				allSettled: e.allSettled,
				any: e.any,
				resolve: e.resolve,
				reject: e.reject
			} : {};
		}
		function F(e, t, n, r, i) {
			var a = A;
			try {
				return ut(e, !0), t(n, r, i);
			} finally {
				ut(a, !1);
			}
		}
		function ft(e, t, n, r) {
			return typeof e == "function" ? function() {
				var i = A;
				n && st(), ut(t, !0);
				try {
					return e.apply(this, arguments);
				} finally {
					ut(i, !1), r && queueMicrotask(ct);
				}
			} : e;
		}
		function pt(e) {
			Promise === Me && N.echoes === 0 ? rt === 0 ? e() : enqueueNativeMicroTask(e) : setTimeout(e, 0);
		}
		("" + je).indexOf("[native code]") === -1 && (st = ct = O);
		var I = j.reject, mt = "￿", ht = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", gt = "String expected.", _t = "__dbnames", vt = "readonly", yt = "readwrite";
		function L(e, t) {
			return e ? t ? function() {
				return e.apply(this, arguments) && t.apply(this, arguments);
			} : e : t;
		}
		var bt = {
			type: 3,
			lower: -1 / 0,
			lowerOpen: !1,
			upper: [[]],
			upperOpen: !1
		};
		function R(e) {
			return typeof e != "string" || /\./.test(e) ? function(e) {
				return e;
			} : function(t) {
				return t[e] === void 0 && e in t && delete (t = ie(t))[e], t;
			};
		}
		function xt() {
			throw D.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
		}
		function z(e, t) {
			try {
				var n = St(e), r = St(t);
				if (n !== r) return n === "Array" ? 1 : r === "Array" ? -1 : n === "binary" ? 1 : r === "binary" ? -1 : n === "string" ? 1 : r === "string" ? -1 : n === "Date" ? 1 : r === "Date" ? -1 : NaN;
				switch (n) {
					case "number":
					case "Date":
					case "string": return t < e ? 1 : e < t ? -1 : 0;
					case "binary":
						for (var i = Ct(e), a = Ct(t), o = i.length, s = a.length, c = o < s ? o : s, l = 0; l < c; ++l) if (i[l] !== a[l]) return i[l] < a[l] ? -1 : 1;
						return o === s ? 0 : o < s ? -1 : 1;
					case "Array":
						for (var u = e, d = t, f = u.length, p = d.length, m = f < p ? f : p, h = 0; h < m; ++h) {
							var g = z(u[h], d[h]);
							if (g !== 0) return g;
						}
						return f === p ? 0 : f < p ? -1 : 1;
				}
			} catch {}
			return NaN;
		}
		function St(e) {
			var t = typeof e;
			return t == "object" && (ArrayBuffer.isView(e) || (t = oe(e)) === "ArrayBuffer") ? "binary" : t;
		}
		function Ct(e) {
			return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : new Uint8Array(e);
		}
		function wt(e, t, n) {
			var r = e.schema.yProps;
			return r ? (t && 0 < n.numFailures && (t = t.filter(function(e, t) {
				return !n.failures[t];
			})), Promise.all(r.map(function(n) {
				return n = n.updatesTable, t ? e.db.table(n).where("k").anyOf(t).delete() : e.db.table(n).clear();
			})).then(function() {
				return n;
			})) : n;
		}
		Et.prototype.execute = function(e) {
			var t = this["@@propmod"];
			if (t.add !== void 0) {
				var r = t.add;
				if (a(r)) return n(n([], a(e) ? e : [], !0), r, !0).sort();
				if (typeof r == "number") return (Number(e) || 0) + r;
				if (typeof r == "bigint") try {
					return BigInt(e) + r;
				} catch {
					return BigInt(0) + r;
				}
				throw TypeError(`Invalid term ${r}`);
			}
			if (t.remove !== void 0) {
				var i = t.remove;
				if (a(i)) return a(e) ? e.filter(function(e) {
					return !i.includes(e);
				}).sort() : [];
				if (typeof i == "number") return Number(e) - i;
				if (typeof i == "bigint") try {
					return BigInt(e) - i;
				} catch {
					return BigInt(0) - i;
				}
				throw TypeError(`Invalid subtrahend ${i}`);
			}
			return r = (r = t.replacePrefix)?.[0], r && typeof e == "string" && e.startsWith(r) ? t.replacePrefix[1] + e.substring(r.length) : e;
		};
		var Tt = Et;
		function Et(e) {
			this["@@propmod"] = e;
		}
		function Dt(e, t) {
			for (var n = i(t), r = n.length, a = !1, o = 0; o < r; ++o) {
				var s = n[o], c = t[s], l = b(e, s);
				c instanceof Tt ? (x(e, s, c.execute(l)), a = !0) : l !== c && (x(e, s, c), a = !0);
			}
			return a;
		}
		B.prototype._trans = function(e, t, n) {
			var r = this._tx || A.trans, i = this.name, a = k && typeof console < "u" && console.createTask && console.createTask(`Dexie: ${e === "readonly" ? "read" : "write"} ${this.name}`);
			function o(e, n, r) {
				if (r.schema[i]) return t(r.idbtrans, r);
				throw new D.NotFound("Table " + i + " not part of transaction");
			}
			var s = Ze();
			try {
				var c = r && r.db._novip === this.db._novip ? r === A.trans ? r._promise(e, o, n) : ot(function() {
					return r._promise(e, o, n);
				}, {
					trans: r,
					transless: A.transless || A
				}) : function e(t, n, r, i) {
					if (t.idbdb && (t._state.openComplete || A.letThrough || t._vip)) {
						var a = t._createTransaction(n, r, t._dbSchema);
						try {
							a.create(), t._state.PR1398_maxLoop = 3;
						} catch (a) {
							return a.name === ge.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
								return e(t, n, r, i);
							})) : I(a);
						}
						return a._promise(n, function(e, t) {
							return ot(function() {
								return A.trans = a, i(e, t, a);
							});
						}).then(function(e) {
							if (n === "readwrite") try {
								a.idbtrans.commit();
							} catch {}
							return n === "readonly" ? e : a._completion.then(function() {
								return e;
							});
						});
					}
					if (t._state.openComplete) return I(new D.DatabaseClosed(t._state.dbOpenError));
					if (!t._state.isBeingOpened) {
						if (!t._state.autoOpen) return I(new D.DatabaseClosed());
						t.open().catch(O);
					}
					return t._state.dbReadyPromise.then(function() {
						return e(t, n, r, i);
					});
				}(this.db, e, [this.name], o);
				return a && (c._consoleTask = a, c = c.catch(function(e) {
					return console.trace(e), I(e);
				})), c;
			} finally {
				s && Qe();
			}
		}, B.prototype.get = function(e, t) {
			var n = this;
			return e && e.constructor === Object ? this.where(e).first(t) : e == null ? I(new D.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(t) {
				return n.core.get({
					trans: t,
					key: e
				}).then(function(e) {
					return n.hook.reading.fire(e);
				});
			}).then(t);
		}, B.prototype.where = function(e) {
			if (typeof e == "string") return new this.db.WhereClause(this, e);
			if (a(e)) return new this.db.WhereClause(this, `[${e.join("+")}]`);
			var t = i(e);
			if (t.length === 1) return this.where(t[0]).equals(e[t[0]]);
			var n = this.schema.indexes.concat(this.schema.primKey).filter(function(e) {
				if (e.compound && t.every(function(t) {
					return 0 <= e.keyPath.indexOf(t);
				})) {
					for (var n = 0; n < t.length; ++n) if (t.indexOf(e.keyPath[n]) === -1) return !1;
					return !0;
				}
				return !1;
			}).sort(function(e, t) {
				return e.keyPath.length - t.keyPath.length;
			})[0];
			if (n && this.db._maxKey !== mt) return s = n.keyPath.slice(0, t.length), this.where(s).equals(s.map(function(t) {
				return e[t];
			}));
			!n && k && console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit from a compound index [${t.join("+")}]`);
			var r = this.schema.idxByName;
			function o(e, t) {
				return z(e, t) === 0;
			}
			var s = t.reduce(function(t, n) {
				var i = t[0], t = t[1], s = r[n], c = e[n];
				return [i || s, i || !s ? L(t, s && s.multi ? function(e) {
					return e = b(e, n), a(e) && e.some(function(e) {
						return o(c, e);
					});
				} : function(e) {
					return o(c, b(e, n));
				}) : t];
			}, [null, null]), c = s[0], s = s[1];
			return c ? this.where(c.name).equals(e[c.keyPath]).filter(s) : n ? this.filter(s) : this.where(t).equals("");
		}, B.prototype.filter = function(e) {
			return this.toCollection().and(e);
		}, B.prototype.count = function(e) {
			return this.toCollection().count(e);
		}, B.prototype.offset = function(e) {
			return this.toCollection().offset(e);
		}, B.prototype.limit = function(e) {
			return this.toCollection().limit(e);
		}, B.prototype.each = function(e) {
			return this.toCollection().each(e);
		}, B.prototype.toArray = function(e) {
			return this.toCollection().toArray(e);
		}, B.prototype.toCollection = function() {
			return new this.db.Collection(new this.db.WhereClause(this));
		}, B.prototype.orderBy = function(e) {
			return new this.db.Collection(new this.db.WhereClause(this, a(e) ? `[${e.join("+")}]` : e));
		}, B.prototype.reverse = function() {
			return this.toCollection().reverse();
		}, B.prototype.mapToClass = function(t) {
			for (var n = this.db, r = this.name, i = ((this.schema.mappedClass = t).prototype instanceof xt && (t = ((t) => {
				var i = s, a = t;
				if (typeof a != "function" && a !== null) throw TypeError("Class extends value " + String(a) + " is not a constructor or null");
				function o() {
					this.constructor = i;
				}
				function s() {
					return t !== null && t.apply(this, arguments) || this;
				}
				return e(i, a), i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o()), Object.defineProperty(s.prototype, "db", {
					get: function() {
						return n;
					},
					enumerable: !1,
					configurable: !0
				}), s.prototype.table = function() {
					return r;
				}, s;
			})(t)), /* @__PURE__ */ new Set()), a = t.prototype; a; a = s(a)) Object.getOwnPropertyNames(a).forEach(function(e) {
				return i.add(e);
			});
			function o(e) {
				if (!e) return e;
				var n, r = Object.create(t.prototype);
				for (n in e) if (!i.has(n)) try {
					r[n] = e[n];
				} catch {}
				return r;
			}
			return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = o, this.hook("reading", o), t;
		}, B.prototype.defineClass = function() {
			return this.mapToClass(function(e) {
				o(this, e);
			});
		}, B.prototype.add = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = R(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "add",
					keys: t == null ? null : [t],
					values: [o]
				});
			}).then(function(e) {
				return e.numFailures ? j.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, B.prototype.upsert = function(e, t) {
			var n = this, r = this.schema.primKey.keyPath;
			return this._trans("readwrite", function(i) {
				return n.core.get({
					trans: i,
					key: e
				}).then(function(a) {
					var o = a ?? {};
					return Dt(o, t), r && x(o, r, e), n.core.mutate({
						trans: i,
						type: "put",
						values: [o],
						keys: [e],
						upsert: !0,
						updates: {
							keys: [e],
							changeSpecs: [t]
						}
					}).then(function(e) {
						return e.numFailures ? j.reject(e.failures[0]) : !!a;
					});
				});
			});
		}, B.prototype.update = function(e, t) {
			return typeof e != "object" || a(e) ? this.where(":id").equals(e).modify(t) : (e = b(e, this.schema.primKey.keyPath)) === void 0 ? I(new D.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e).modify(t);
		}, B.prototype.put = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = R(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "put",
					values: [o],
					keys: t == null ? null : [t]
				});
			}).then(function(e) {
				return e.numFailures ? j.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, B.prototype.delete = function(e) {
			var t = this;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: [e]
				}).then(function(n) {
					return wt(t, [e], n);
				}).then(function(e) {
					return e.numFailures ? j.reject(e.failures[0]) : void 0;
				});
			});
		}, B.prototype.clear = function() {
			var e = this;
			return this._trans("readwrite", function(t) {
				return e.core.mutate({
					trans: t,
					type: "deleteRange",
					range: bt
				}).then(function(t) {
					return wt(e, null, t);
				});
			}).then(function(e) {
				return e.numFailures ? j.reject(e.failures[0]) : void 0;
			});
		}, B.prototype.bulkGet = function(e) {
			var t = this;
			return this._trans("readonly", function(n) {
				return t.core.getMany({
					keys: e,
					trans: n
				}).then(function(e) {
					return e.map(function(e) {
						return t.hook.reading.fire(e);
					});
				});
			});
		}, B.prototype.bulkAdd = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new D.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new D.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(R(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "add",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new he(`${r.name}.bulkAdd(): ${t} of ${s} operations failed`, n);
				});
			});
		}, B.prototype.bulkPut = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new D.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new D.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(R(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "put",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new he(`${r.name}.bulkPut(): ${t} of ${s} operations failed`, n);
				});
			});
		}, B.prototype.bulkUpdate = function(e) {
			var t = this, n = this.core, r = e.map(function(e) {
				return e.key;
			}), i = e.map(function(e) {
				return e.changes;
			}), a = [];
			return this._trans("readwrite", function(o) {
				return n.getMany({
					trans: o,
					keys: r,
					cache: "clone"
				}).then(function(s) {
					var c = [], l = [], u = (e.forEach(function(e, n) {
						var r = e.key, i = e.changes, o = s[n];
						if (o) {
							for (var u = 0, d = Object.keys(i); u < d.length; u++) {
								var f = d[u], p = i[f];
								if (f === t.schema.primKey.keyPath) {
									if (z(p, r) !== 0) throw new D.Constraint("Cannot update primary key in bulkUpdate()");
								} else x(o, f, p);
							}
							a.push(n), c.push(r), l.push(o);
						}
					}), c.length);
					return n.mutate({
						trans: o,
						type: "put",
						keys: c,
						values: l,
						updates: {
							keys: r,
							changeSpecs: i
						}
					}).then(function(e) {
						var n = e.numFailures, r = e.failures;
						if (n === 0) return u;
						for (var i = 0, o = Object.keys(r); i < o.length; i++) {
							var s, c = o[i], l = a[Number(c)];
							l != null && (s = r[c], delete r[c], r[l] = s);
						}
						throw new he(`${t.name}.bulkUpdate(): ${n} of ${u} operations failed`, r);
					});
				});
			});
		}, B.prototype.bulkDelete = function(e) {
			var t = this, n = e.length;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: e
				}).then(function(n) {
					return wt(t, e, n);
				});
			}).then(function(e) {
				var r = e.numFailures, i = e.failures;
				if (r === 0) return e.lastResult;
				throw new he(`${t.name}.bulkDelete(): ${r} of ${n} operations failed`, i);
			});
		};
		var Ot = B;
		function B() {}
		function kt(e) {
			function t(t, r) {
				if (r) {
					for (var i = arguments.length, a = Array(i - 1); --i;) a[i - 1] = arguments[i];
					return n[t].subscribe.apply(null, a), e;
				}
				if (typeof t == "string") return n[t];
			}
			var n = {};
			t.addEventType = s;
			for (var r = 1, o = arguments.length; r < o; ++r) s(arguments[r]);
			return t;
			function s(e, r, o) {
				var c, l;
				if (typeof e != "object") return r ||= Te, l = {
					subscribers: [],
					fire: o ||= O,
					subscribe: function(e) {
						l.subscribers.indexOf(e) === -1 && (l.subscribers.push(e), l.fire = r(l.fire, e));
					},
					unsubscribe: function(e) {
						l.subscribers = l.subscribers.filter(function(t) {
							return t !== e;
						}), l.fire = l.subscribers.reduce(r, o);
					}
				}, n[e] = t[e] = l;
				i(c = e).forEach(function(e) {
					var t = c[e];
					if (a(t)) s(e, c[e][0], c[e][1]);
					else {
						if (t !== "asap") throw new D.InvalidArgument("Invalid event config");
						var n = s(e, ye, function() {
							for (var e = arguments.length, t = Array(e); e--;) t[e] = arguments[e];
							n.subscribers.forEach(function(e) {
								y(function() {
									e.apply(null, t);
								});
							});
						});
					}
				});
			}
		}
		function At(e, t) {
			return p(t).from({ prototype: e }), t;
		}
		function jt(e, t) {
			return !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter);
		}
		function Mt(e, t) {
			e.filter = L(e.filter, t);
		}
		function Nt(e, t, n) {
			var r = e.replayFilter;
			e.replayFilter = r ? function() {
				return L(r(), t());
			} : t, e.justLimit = n && !r;
		}
		function Pt(e, t) {
			if (e.isPrimKey) return t.primaryKey;
			var n = t.getIndexByKeyPath(e.index);
			if (n) return n;
			throw new D.Schema("KeyPath " + e.index + " on object store " + t.name + " is not indexed");
		}
		function Ft(e, t, n) {
			var r = Pt(e, t.schema);
			return t.openCursor({
				trans: n,
				values: !e.keysOnly,
				reverse: e.dir === "prev",
				unique: !!e.unique,
				query: {
					index: r,
					range: e.range
				}
			});
		}
		function It(e, t, n, r) {
			var i, a, o = e.replayFilter ? L(e.filter, e.replayFilter()) : e.filter;
			return e.or ? (i = {}, a = function(e, n, r) {
				var a, s;
				o && !o(n, r, function(e) {
					return n.stop(e);
				}, function(e) {
					return n.fail(e);
				}) || ((s = "" + (a = n.primaryKey)) == "[object ArrayBuffer]" && (s = "" + new Uint8Array(a)), l(i, s)) || (i[s] = !0, t(e, n, r));
			}, Promise.all([e.or._iterate(a, n), Lt(Ft(e, r, n), e.algorithm, a, !e.keysOnly && e.valueMapper)])) : Lt(Ft(e, r, n), L(e.algorithm, o), t, !e.keysOnly && e.valueMapper);
		}
		function Lt(e, t, n, r) {
			var i = M(r ? function(e, t, i) {
				return n(r(e), t, i);
			} : n);
			return e.then(function(e) {
				if (e) return e.start(function() {
					var n = function() {
						return e.continue();
					};
					t && !t(e, function(e) {
						return n = e;
					}, function(t) {
						e.stop(t), n = O;
					}, function(t) {
						e.fail(t), n = O;
					}) || i(e.value, e, function(e) {
						return n = e;
					}), n();
				});
			});
		}
		V.prototype._read = function(e, t) {
			var n = this._ctx;
			return n.error ? n.table._trans(null, I.bind(null, n.error)) : n.table._trans("readonly", e).then(t);
		}, V.prototype._write = function(e) {
			var t = this._ctx;
			return t.error ? t.table._trans(null, I.bind(null, t.error)) : t.table._trans("readwrite", e, "locked");
		}, V.prototype._addAlgorithm = function(e) {
			var t = this._ctx;
			t.algorithm = L(t.algorithm, e);
		}, V.prototype._iterate = function(e, t) {
			return It(this._ctx, e, t, this._ctx.table.core);
		}, V.prototype.clone = function(e) {
			var t = Object.create(this.constructor.prototype), n = Object.create(this._ctx);
			return e && o(n, e), t._ctx = n, t;
		}, V.prototype.raw = function() {
			return this._ctx.valueMapper = null, this;
		}, V.prototype.each = function(e) {
			var t = this._ctx;
			return this._read(function(n) {
				return It(t, e, n, t.table.core);
			});
		}, V.prototype.count = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r = t._ctx, i = r.table.core;
				return jt(r, !0) ? i.count({
					trans: e,
					query: {
						index: Pt(r, i.schema),
						range: r.range
					}
				}).then(function(e) {
					return Math.min(e, r.limit);
				}) : (n = 0, It(r, function() {
					return ++n, !1;
				}, e, i).then(function() {
					return n;
				}));
			}).then(e);
		}, V.prototype.sortBy = function(e, t) {
			var n = e.split(".").reverse(), r = n[0], i = n.length - 1;
			function a(e, t) {
				return t ? a(e[n[t]], t - 1) : e[r];
			}
			var o = this._ctx.dir === "next" ? 1 : -1;
			function s(e, t) {
				return z(a(e, i), a(t, i)) * o;
			}
			return this.toArray(function(e) {
				return e.slice().sort(s);
			}).then(t);
		}, V.prototype.toArray = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r, i, a = t._ctx;
				return jt(a, !0) && 0 < a.limit ? (n = a.valueMapper, r = Pt(a, a.table.core.schema), a.table.core.query({
					trans: e,
					limit: a.limit,
					values: !0,
					direction: a.dir === "prev" ? "prev" : void 0,
					query: {
						index: r,
						range: a.range
					}
				}).then(function(e) {
					return e = e.result, n ? e.map(n) : e;
				})) : (i = [], It(a, function(e) {
					return i.push(e);
				}, e, a.table.core).then(function() {
					return i;
				}));
			}, e);
		}, V.prototype.offset = function(e) {
			var t = this._ctx;
			return e <= 0 || (t.offset += e, jt(t) ? Nt(t, function() {
				var t = e;
				return function(e, n) {
					return t === 0 || (t === 1 ? --t : n(function() {
						e.advance(t), t = 0;
					}), !1);
				};
			}) : Nt(t, function() {
				var t = e;
				return function() {
					return --t < 0;
				};
			})), this;
		}, V.prototype.limit = function(e) {
			return this._ctx.limit = Math.min(this._ctx.limit, e), Nt(this._ctx, function() {
				var t = e;
				return function(e, n, r) {
					return --t <= 0 && n(r), 0 <= t;
				};
			}, !0), this;
		}, V.prototype.until = function(e, t) {
			return Mt(this._ctx, function(n, r, i) {
				return !e(n.value) || (r(i), t);
			}), this;
		}, V.prototype.first = function(e) {
			return this.limit(1).toArray(function(e) {
				return e[0];
			}).then(e);
		}, V.prototype.last = function(e) {
			return this.reverse().first(e);
		}, V.prototype.filter = function(e) {
			var t;
			return Mt(this._ctx, function(t) {
				return e(t.value);
			}), (t = this._ctx).isMatch = L(t.isMatch, e), this;
		}, V.prototype.and = function(e) {
			return this.filter(e);
		}, V.prototype.or = function(e) {
			return new this.db.WhereClause(this._ctx.table, e, this);
		}, V.prototype.reverse = function() {
			return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
		}, V.prototype.desc = function() {
			return this.reverse();
		}, V.prototype.eachKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.key, n);
			});
		}, V.prototype.eachUniqueKey = function(e) {
			return this._ctx.unique = "unique", this.eachKey(e);
		}, V.prototype.eachPrimaryKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.primaryKey, n);
			});
		}, V.prototype.keys = function(e) {
			var t = this._ctx, n = (t.keysOnly = !t.isMatch, []);
			return this.each(function(e, t) {
				n.push(t.key);
			}).then(function() {
				return n;
			}).then(e);
		}, V.prototype.primaryKeys = function(e) {
			var t = this._ctx;
			if (jt(t, !0) && 0 < t.limit) return this._read(function(e) {
				var n = Pt(t, t.table.core.schema);
				return t.table.core.query({
					trans: e,
					values: !1,
					limit: t.limit,
					direction: t.dir === "prev" ? "prev" : void 0,
					query: {
						index: n,
						range: t.range
					}
				});
			}).then(function(e) {
				return e.result;
			}).then(e);
			t.keysOnly = !t.isMatch;
			var n = [];
			return this.each(function(e, t) {
				n.push(t.primaryKey);
			}).then(function() {
				return n;
			}).then(e);
		}, V.prototype.uniqueKeys = function(e) {
			return this._ctx.unique = "unique", this.keys(e);
		}, V.prototype.firstKey = function(e) {
			return this.limit(1).keys(function(e) {
				return e[0];
			}).then(e);
		}, V.prototype.lastKey = function(e) {
			return this.reverse().firstKey(e);
		}, V.prototype.distinct = function() {
			var e, t = this._ctx, t = t.index && t.table.schema.idxByName[t.index];
			return t && t.multi && (e = {}, Mt(this._ctx, function(t) {
				var t = t.primaryKey.toString(), n = l(e, t);
				return e[t] = !0, !n;
			})), this;
		}, V.prototype.modify = function(e) {
			var t = this, n = this._ctx;
			return this._write(function(r) {
				function a(e, t) {
					var n = t.failures;
					p += e - t.numFailures;
					for (var r = 0, a = i(n); r < a.length; r++) {
						var o = a[r];
						f.push(n[o]);
					}
				}
				var o = typeof e == "function" ? e : function(t) {
					return Dt(t, e);
				}, s = n.table.core, c = s.schema.primaryKey, l = c.outbound, u = c.extractKey, d = 200, c = t.db._options.modifyChunkSize, f = (c && (d = typeof c == "object" ? c[s.name] || c["*"] || 200 : c), []), p = 0, m = [], h = e === zt;
				return t.clone().primaryKeys().then(function(t) {
					function i(f) {
						var p = Math.min(d, t.length - f), m = t.slice(f, f + p);
						return (h ? Promise.resolve([]) : s.getMany({
							trans: r,
							keys: m,
							cache: "immutable"
						})).then(function(g) {
							var _ = [], v = [], y = l ? [] : null, b = h ? m : [];
							if (!h) for (var x = 0; x < p; ++x) {
								var S = g[x], C = {
									value: ie(S),
									primKey: t[f + x]
								};
								!1 !== o.call(C, C.value, C) && (C.value == null ? b.push(t[f + x]) : l || z(u(S), u(C.value)) === 0 ? (v.push(C.value), l && y.push(t[f + x])) : (b.push(t[f + x]), _.push(C.value)));
							}
							return Promise.resolve(0 < _.length && s.mutate({
								trans: r,
								type: "add",
								values: _
							}).then(function(e) {
								for (var t in e.failures) b.splice(parseInt(t), 1);
								a(_.length, e);
							})).then(function() {
								return (0 < v.length || c && typeof e == "object") && s.mutate({
									trans: r,
									type: "put",
									keys: y,
									values: v,
									criteria: c,
									changeSpec: typeof e != "function" && e,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return a(v.length, e);
								});
							}).then(function() {
								return (0 < b.length || c && h) && s.mutate({
									trans: r,
									type: "delete",
									keys: b,
									criteria: c,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return wt(n.table, b, e);
								}).then(function(e) {
									return a(b.length, e);
								});
							}).then(function() {
								return t.length > f + p && i(f + d);
							});
						});
					}
					var c = jt(n) && n.limit === 1 / 0 && (typeof e != "function" || h) && {
						index: n.index,
						range: n.range
					};
					return i(0).then(function() {
						if (0 < f.length) throw new me("Error modifying one or more objects", f, p, m);
						return t.length;
					});
				});
			});
		}, V.prototype.delete = function() {
			var e = this._ctx, t = e.range;
			return !jt(e) || e.table.schema.yProps || !e.isPrimKey && t.type !== 3 ? this.modify(zt) : this._write(function(n) {
				var r = e.table.core.schema.primaryKey, i = t;
				return e.table.core.count({
					trans: n,
					query: {
						index: r,
						range: i
					}
				}).then(function(t) {
					return e.table.core.mutate({
						trans: n,
						type: "deleteRange",
						range: i
					}).then(function(e) {
						var n = e.failures, e = e.numFailures;
						if (e) throw new me("Could not delete some values", Object.keys(n).map(function(e) {
							return n[e];
						}), t - e);
						return t - e;
					});
				});
			});
		};
		var Rt = V;
		function V() {}
		var zt = function(e, t) {
			return t.value = null;
		};
		function Bt(e, t) {
			return e < t ? -1 : e === t ? 0 : 1;
		}
		function Vt(e, t) {
			return t < e ? -1 : e === t ? 0 : 1;
		}
		function H(e, t, n) {
			return e = e instanceof Kt ? new e.Collection(e) : e, e._ctx.error = new (n || TypeError)(t), e;
		}
		function Ht(e) {
			return new e.Collection(e, function() {
				return Gt("");
			}).limit(0);
		}
		function Ut(e, t, n, r) {
			var i, a, o, s, c, l, u, d = n.length;
			if (!n.every(function(e) {
				return typeof e == "string";
			})) return H(e, gt);
			function f(e) {
				i = e === "next" ? function(e) {
					return e.toUpperCase();
				} : function(e) {
					return e.toLowerCase();
				}, a = e === "next" ? function(e) {
					return e.toLowerCase();
				} : function(e) {
					return e.toUpperCase();
				}, o = e === "next" ? Bt : Vt;
				var t = n.map(function(e) {
					return {
						lower: a(e),
						upper: i(e)
					};
				}).sort(function(e, t) {
					return o(e.lower, t.lower);
				});
				s = t.map(function(e) {
					return e.upper;
				}), c = t.map(function(e) {
					return e.lower;
				}), u = (l = e) === "next" ? "" : r;
			}
			f("next");
			var e = new e.Collection(e, function() {
				return Wt(s[0], c[d - 1] + r);
			}), p = (e._ondirectionchange = function(e) {
				f(e);
			}, 0);
			return e._addAlgorithm(function(e, n, r) {
				var i = e.key;
				if (typeof i == "string") {
					var f = a(i);
					if (t(f, c, p)) return !0;
					for (var m = null, h = p; h < d; ++h) {
						var g = ((e, t, n, r, i, a) => {
							for (var o = Math.min(e.length, r.length), s = -1, c = 0; c < o; ++c) {
								var l = t[c];
								if (l !== r[c]) return i(e[c], n[c]) < 0 ? e.substr(0, c) + n[c] + n.substr(c + 1) : i(e[c], r[c]) < 0 ? e.substr(0, c) + r[c] + n.substr(c + 1) : 0 <= s ? e.substr(0, s) + t[s] + n.substr(s + 1) : null;
								i(e[c], l) < 0 && (s = c);
							}
							return o < r.length && a === "next" ? e + n.substr(e.length) : o < e.length && a === "prev" ? e.substr(0, n.length) : s < 0 ? null : e.substr(0, s) + r[s] + n.substr(s + 1);
						})(i, f, s[h], c[h], o, l);
						g === null && m === null ? p = h + 1 : (m === null || 0 < o(m, g)) && (m = g);
					}
					n(m === null ? r : function() {
						e.continue(m + u);
					});
				}
				return !1;
			}), e;
		}
		function Wt(e, t, n, r) {
			return {
				type: 2,
				lower: e,
				upper: t,
				lowerOpen: n,
				upperOpen: r
			};
		}
		function Gt(e) {
			return {
				type: 1,
				lower: e,
				upper: e
			};
		}
		Object.defineProperty(U.prototype, "Collection", {
			get: function() {
				return this._ctx.table.db.Collection;
			},
			enumerable: !1,
			configurable: !0
		}), U.prototype.between = function(e, t, n, r) {
			n = !1 !== n, r = !0 === r;
			try {
				return 0 < this._cmp(e, t) || this._cmp(e, t) === 0 && (n || r) && (!n || !r) ? Ht(this) : new this.Collection(this, function() {
					return Wt(e, t, !n, !r);
				});
			} catch {
				return H(this, ht);
			}
		}, U.prototype.equals = function(e) {
			return e == null ? H(this, ht) : new this.Collection(this, function() {
				return Gt(e);
			});
		}, U.prototype.above = function(e) {
			return e == null ? H(this, ht) : new this.Collection(this, function() {
				return Wt(e, void 0, !0);
			});
		}, U.prototype.aboveOrEqual = function(e) {
			return e == null ? H(this, ht) : new this.Collection(this, function() {
				return Wt(e, void 0, !1);
			});
		}, U.prototype.below = function(e) {
			return e == null ? H(this, ht) : new this.Collection(this, function() {
				return Wt(void 0, e, !1, !0);
			});
		}, U.prototype.belowOrEqual = function(e) {
			return e == null ? H(this, ht) : new this.Collection(this, function() {
				return Wt(void 0, e);
			});
		}, U.prototype.startsWith = function(e) {
			return typeof e == "string" ? this.between(e, e + mt, !0, !0) : H(this, gt);
		}, U.prototype.startsWithIgnoreCase = function(e) {
			return e === "" ? this.startsWith(e) : Ut(this, function(e, t) {
				return e.indexOf(t[0]) === 0;
			}, [e], mt);
		}, U.prototype.equalsIgnoreCase = function(e) {
			return Ut(this, function(e, t) {
				return e === t[0];
			}, [e], "");
		}, U.prototype.anyOfIgnoreCase = function() {
			var e = le.apply(T, arguments);
			return e.length === 0 ? Ht(this) : Ut(this, function(e, t) {
				return t.indexOf(e) !== -1;
			}, e, "");
		}, U.prototype.startsWithAnyOfIgnoreCase = function() {
			var e = le.apply(T, arguments);
			return e.length === 0 ? Ht(this) : Ut(this, function(e, t) {
				return t.some(function(t) {
					return e.indexOf(t) === 0;
				});
			}, e, mt);
		}, U.prototype.anyOf = function() {
			var e, t, n = this, r = le.apply(T, arguments), i = this._cmp;
			try {
				r.sort(i);
			} catch {
				return H(this, ht);
			}
			return r.length === 0 ? Ht(this) : ((e = new this.Collection(this, function() {
				return Wt(r[0], r[r.length - 1]);
			}))._ondirectionchange = function(e) {
				i = e === "next" ? n._ascending : n._descending, r.sort(i);
			}, t = 0, e._addAlgorithm(function(e, n, a) {
				for (var o = e.key; 0 < i(o, r[t]);) if (++t === r.length) return n(a), !1;
				return i(o, r[t]) === 0 || (n(function() {
					e.continue(r[t]);
				}), !1);
			}), e);
		}, U.prototype.notEqual = function(e) {
			return this.inAnyRange([[-1 / 0, e], [e, this.db._maxKey]], {
				includeLowers: !1,
				includeUppers: !1
			});
		}, U.prototype.noneOf = function() {
			var e = le.apply(T, arguments);
			if (e.length === 0) return new this.Collection(this);
			try {
				e.sort(this._ascending);
			} catch {
				return H(this, ht);
			}
			var t = e.reduce(function(e, t) {
				return e ? e.concat([[e[e.length - 1][1], t]]) : [[-1 / 0, t]];
			}, null);
			return t.push([e[e.length - 1], this.db._maxKey]), this.inAnyRange(t, {
				includeLowers: !1,
				includeUppers: !1
			});
		}, U.prototype.inAnyRange = function(e, t) {
			var n = this, r = this._cmp, i = this._ascending, a = this._descending, o = this._min, s = this._max;
			if (e.length === 0) return Ht(this);
			if (!e.every(function(e) {
				return e[0] !== void 0 && e[1] !== void 0 && i(e[0], e[1]) <= 0;
			})) return H(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", D.InvalidArgument);
			var c = !t || !1 !== t.includeLowers, l = t && !0 === t.includeUppers, u, d = i;
			function f(e, t) {
				return d(e[0], t[0]);
			}
			try {
				(u = e.reduce(function(e, t) {
					for (var n = 0, i = e.length; n < i; ++n) {
						var a = e[n];
						if (r(t[0], a[1]) < 0 && 0 < r(t[1], a[0])) {
							a[0] = o(a[0], t[0]), a[1] = s(a[1], t[1]);
							break;
						}
					}
					return n === i && e.push(t), e;
				}, [])).sort(f);
			} catch {
				return H(this, ht);
			}
			var p = 0, m = l ? function(e) {
				return 0 < i(e, u[p][1]);
			} : function(e) {
				return 0 <= i(e, u[p][1]);
			}, h = c ? function(e) {
				return 0 < a(e, u[p][0]);
			} : function(e) {
				return 0 <= a(e, u[p][0]);
			}, g = m, t = new this.Collection(this, function() {
				return Wt(u[0][0], u[u.length - 1][1], !c, !l);
			});
			return t._ondirectionchange = function(e) {
				d = e === "next" ? (g = m, i) : (g = h, a), u.sort(f);
			}, t._addAlgorithm(function(e, t, r) {
				for (var a, o = e.key; g(o);) if (++p === u.length) return t(r), !1;
				return !m(a = o) && !h(a) || (n._cmp(o, u[p][1]) === 0 || n._cmp(o, u[p][0]) === 0 || t(function() {
					d === i ? e.continue(u[p][0]) : e.continue(u[p][1]);
				}), !1);
			}), t;
		}, U.prototype.startsWithAnyOf = function() {
			var e = le.apply(T, arguments);
			return e.every(function(e) {
				return typeof e == "string";
			}) ? e.length === 0 ? Ht(this) : this.inAnyRange(e.map(function(e) {
				return [e, e + mt];
			})) : H(this, "startsWithAnyOf() only works with strings");
		};
		var Kt = U;
		function U() {}
		function W(e) {
			return M(function(t) {
				return qt(t), e(t.target.error), !1;
			});
		}
		function qt(e) {
			e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
		}
		var Jt = "storagemutated", Yt = "x-storagemutated-1", Xt = kt(null, Jt), Zt = (Qt.prototype._lock = function() {
			return v(!A.global), ++this._reculock, this._reculock !== 1 || A.global || (A.lockOwnerFor = this), this;
		}, Qt.prototype._unlock = function() {
			if (v(!A.global), --this._reculock == 0) for (A.global || (A.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked();) {
				var e = this._blockedFuncs.shift();
				try {
					F(e[1], e[0]);
				} catch {}
			}
			return this;
		}, Qt.prototype._locked = function() {
			return this._reculock && A.lockOwnerFor !== this;
		}, Qt.prototype.create = function(e) {
			var t = this;
			if (this.mode) {
				var n = this.db.idbdb, r = this.db._state.dbOpenError;
				if (v(!this.idbtrans), !e && !n) switch (r && r.name) {
					case "DatabaseClosedError": throw new D.DatabaseClosed(r);
					case "MissingAPIError": throw new D.MissingAPI(r.message, r);
					default: throw new D.OpenFailed(r);
				}
				if (!this.active) throw new D.TransactionInactive();
				v(this._completion._state === null), (e = this.idbtrans = e || (this.db.core || n).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = M(function(n) {
					qt(n), t._reject(e.error);
				}), e.onabort = M(function(n) {
					qt(n), t.active && t._reject(new D.Abort(e.error)), t.active = !1, t.on("abort").fire(n);
				}), e.oncomplete = M(function() {
					t.active = !1, t._resolve(), "mutatedParts" in e && Xt.storagemutated.fire(e.mutatedParts);
				});
			}
			return this;
		}, Qt.prototype._promise = function(e, t, n) {
			var r, i = this;
			return e === "readwrite" && this.mode !== "readwrite" ? I(new D.ReadOnly("Transaction is readonly")) : this.active ? this._locked() ? new j(function(r, a) {
				i._blockedFuncs.push([function() {
					i._promise(e, t, n).then(r, a);
				}, A]);
			}) : n ? ot(function() {
				var e = new j(function(e, n) {
					i._lock();
					var r = t(e, n, i);
					r && r.then && r.then(e, n);
				});
				return e.finally(function() {
					return i._unlock();
				}), e._lib = !0, e;
			}) : ((r = new j(function(e, n) {
				var r = t(e, n, i);
				r && r.then && r.then(e, n);
			}))._lib = !0, r) : I(new D.TransactionInactive());
		}, Qt.prototype._root = function() {
			return this.parent ? this.parent._root() : this;
		}, Qt.prototype.waitFor = function(e) {
			var t, n = this._root(), r = j.resolve(e), i = (n._waitingFor ? n._waitingFor = n._waitingFor.then(function() {
				return r;
			}) : (n._waitingFor = r, n._waitingQueue = [], t = n.idbtrans.objectStore(n.storeNames[0]), function e() {
				for (++n._spinCount; n._waitingQueue.length;) n._waitingQueue.shift()();
				n._waitingFor && (t.get(-1 / 0).onsuccess = e);
			}()), n._waitingFor);
			return new j(function(e, t) {
				r.then(function(t) {
					return n._waitingQueue.push(M(e.bind(null, t)));
				}, function(e) {
					return n._waitingQueue.push(M(t.bind(null, e)));
				}).finally(function() {
					n._waitingFor === i && (n._waitingFor = null);
				});
			});
		}, Qt.prototype.abort = function() {
			this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new D.Abort()));
		}, Qt.prototype.table = function(e) {
			var t = this._memoizedTables ||= {};
			if (l(t, e)) return t[e];
			var n = this.schema[e];
			if (n) return (n = new this.db.Table(e, n, this)).core = this.db.core.table(e), t[e] = n;
			throw new D.NotFound("Table " + e + " not part of transaction");
		}, Qt);
		function Qt() {}
		function $t(e, t, n, r, i, a, o, s) {
			return {
				name: e,
				keyPath: t,
				unique: n,
				multi: r,
				auto: i,
				compound: a,
				src: (n && !o ? "&" : "") + (r ? "*" : "") + (i ? "++" : "") + en(t),
				type: s
			};
		}
		function en(e) {
			return typeof e == "string" ? e : e ? "[" + [].join.call(e, "+") + "]" : "";
		}
		function tn(e, t, n) {
			return {
				name: e,
				primKey: t,
				indexes: n,
				mappedClass: null,
				idxByName: (r = function(e) {
					return [e.name, e];
				}, n.reduce(function(e, t, n) {
					return t = r(t, n), t && (e[t[0]] = t[1]), e;
				}, {}))
			};
			var r;
		}
		var nn = function(e) {
			try {
				return e.only([[]]), nn = function() {
					return [[]];
				}, [[]];
			} catch {
				return nn = function() {
					return mt;
				}, mt;
			}
		};
		function rn(e) {
			return e == null ? function() {} : typeof e == "string" ? (t = e).split(".").length === 1 ? function(e) {
				return e[t];
			} : function(e) {
				return b(e, t);
			} : function(t) {
				return b(t, e);
			};
			var t;
		}
		function an(e) {
			return [].slice.call(e);
		}
		var on = 0;
		function sn(e) {
			return e == null ? ":id" : typeof e == "string" ? e : `[${e.join("+")}]`;
		}
		function cn(e, t, n) {
			function r(e) {
				if (e.type === 3) return null;
				if (e.type === 4) throw Error("Cannot convert never type to IDBKeyRange");
				var n = e.lower, r = e.upper, i = e.lowerOpen, e = e.upperOpen;
				return n === void 0 ? r === void 0 ? null : t.upperBound(r, !!e) : r === void 0 ? t.lowerBound(n, !!i) : t.bound(n, r, !!i, !!e);
			}
			function i(e) {
				var t, n, i = e.name;
				return {
					name: i,
					schema: e,
					mutate: function(e) {
						var t = e.trans, n = e.type, a = e.keys, o = e.values, s = e.range;
						return new Promise(function(e, c) {
							e = M(e);
							var l = t.objectStore(i), u = l.keyPath == null, d = n === "put" || n === "add";
							if (!d && n !== "delete" && n !== "deleteRange") throw Error("Invalid operation type: " + n);
							var f, p = (a || o || { length: 1 }).length;
							if (a && o && a.length !== o.length) throw Error("Given keys array must have same length as given values array.");
							if (p === 0) return e({
								numFailures: 0,
								failures: {},
								results: [],
								lastResult: void 0
							});
							function m(e) {
								++_, qt(e);
							}
							var h = [], g = [], _ = 0;
							if (n === "deleteRange") {
								if (s.type === 4) return e({
									numFailures: _,
									failures: g,
									results: [],
									lastResult: void 0
								});
								s.type === 3 ? h.push(f = l.clear()) : h.push(f = l.delete(r(s)));
							} else {
								var u = d ? u ? [o, a] : [o, null] : [a, null], v = u[0], y = u[1];
								if (d) for (var b = 0; b < p; ++b) h.push(f = y && y[b] !== void 0 ? l[n](v[b], y[b]) : l[n](v[b])), f.onerror = m;
								else for (b = 0; b < p; ++b) h.push(f = l[n](v[b])), f.onerror = m;
							}
							function x(t) {
								t = t.target.result, h.forEach(function(e, t) {
									return e.error != null && (g[t] = e.error);
								}), e({
									numFailures: _,
									failures: g,
									results: n === "delete" ? a : h.map(function(e) {
										return e.result;
									}),
									lastResult: t
								});
							}
							f.onerror = function(e) {
								m(e), x(e);
							}, f.onsuccess = x;
						});
					},
					getMany: function(e) {
						var t = e.trans, n = e.keys;
						return new Promise(function(e, r) {
							e = M(e);
							for (var a, o = t.objectStore(i), s = n.length, c = Array(s), l = 0, u = 0, d = function(t) {
								t = t.target, c[t._pos] = t.result, ++u === l && e(c);
							}, f = W(r), p = 0; p < s; ++p) n[p] != null && ((a = o.get(n[p]))._pos = p, a.onsuccess = d, a.onerror = f, ++l);
							l === 0 && e(c);
						});
					},
					get: function(e) {
						var t = e.trans, n = e.key;
						return new Promise(function(e, r) {
							e = M(e);
							var a = t.objectStore(i).get(n);
							a.onsuccess = function(t) {
								return e(t.target.result);
							}, a.onerror = W(r);
						});
					},
					query: (t = c, n = l, function(e) {
						return new Promise(function(a, o) {
							a = M(a);
							var s, c, l, u, d = e.trans, f = e.values, p = e.limit, m = e.query, h = (h = e.direction) ?? "next", g = p === 1 / 0 ? void 0 : p, _ = m.index, m = m.range, d = d.objectStore(i), d = _.isPrimaryKey ? d : d.index(_.name), _ = r(m);
							if (p === 0) return a({ result: [] });
							n ? (m = {
								query: _,
								count: g,
								direction: h
							}, (s = f ? d.getAll(m) : d.getAllKeys(m)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = W(o)) : t && h === "next" ? ((s = f ? d.getAll(_, g) : d.getAllKeys(_, g)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = W(o)) : (c = 0, l = !f && "openKeyCursor" in d ? d.openKeyCursor(_, h) : d.openCursor(_, h), u = [], l.onsuccess = function() {
								var e = l.result;
								return !e || (u.push(f ? e.value : e.primaryKey), ++c === p) ? a({ result: u }) : void e.continue();
							}, l.onerror = W(o));
						});
					}),
					openCursor: function(e) {
						var t = e.trans, n = e.values, a = e.query, o = e.reverse, s = e.unique;
						return new Promise(function(e, c) {
							e = M(e);
							var l = a.index, u = a.range, d = t.objectStore(i), d = l.isPrimaryKey ? d : d.index(l.name), l = o ? s ? "prevunique" : "prev" : s ? "nextunique" : "next", f = !n && "openKeyCursor" in d ? d.openKeyCursor(r(u), l) : d.openCursor(r(u), l);
							f.onerror = W(c), f.onsuccess = M(function(n) {
								var r, i, a, o, s = f.result;
								s ? (s.___id = ++on, s.done = !1, r = s.continue.bind(s), i = (i = s.continuePrimaryKey) && i.bind(s), a = s.advance.bind(s), o = function() {
									throw Error("Cursor not stopped");
								}, s.trans = t, s.stop = s.continue = s.continuePrimaryKey = s.advance = function() {
									throw Error("Cursor not started");
								}, s.fail = M(c), s.next = function() {
									var e = this, t = 1;
									return this.start(function() {
										return t-- ? e.continue() : e.stop();
									}).then(function() {
										return e;
									});
								}, s.start = function(e) {
									function t() {
										if (f.result) try {
											e();
										} catch (e) {
											s.fail(e);
										}
										else s.done = !0, s.start = function() {
											throw Error("Cursor behind last entry");
										}, s.stop();
									}
									var n = new Promise(function(e, t) {
										e = M(e), f.onerror = W(t), s.fail = t, s.stop = function(t) {
											s.stop = s.continue = s.continuePrimaryKey = s.advance = o, e(t);
										};
									});
									return f.onsuccess = M(function(e) {
										f.onsuccess = t, t();
									}), s.continue = r, s.continuePrimaryKey = i, s.advance = a, t(), n;
								}, e(s)) : e(null);
							}, c);
						});
					},
					count: function(e) {
						var t = e.query, n = e.trans, a = t.index, o = t.range;
						return new Promise(function(e, t) {
							var s = n.objectStore(i), s = a.isPrimaryKey ? s : s.index(a.name), c = r(o), c = c ? s.count(c) : s.count();
							c.onsuccess = M(function(t) {
								return e(t.target.result);
							}), c.onerror = W(t);
						});
					}
				};
			}
			o = n, s = an((n = e).objectStoreNames), u = 0 < s.length ? o.objectStore(s[0]) : {};
			var o, n = {
				schema: {
					name: n.name,
					tables: s.map(function(e) {
						return o.objectStore(e);
					}).map(function(e) {
						var t = e.keyPath, n = e.autoIncrement, r = a(t), i = {}, r = {
							name: e.name,
							primaryKey: {
								name: null,
								isPrimaryKey: !0,
								outbound: t == null,
								compound: r,
								keyPath: t,
								autoIncrement: n,
								unique: !0,
								extractKey: rn(t)
							},
							indexes: an(e.indexNames).map(function(t) {
								return e.index(t);
							}).map(function(e) {
								var t = e.name, n = e.unique, r = e.multiEntry, e = e.keyPath, t = {
									name: t,
									compound: a(e),
									keyPath: e,
									unique: n,
									multiEntry: r,
									extractKey: rn(e)
								};
								return i[sn(e)] = t;
							}),
							getIndexByKeyPath: function(e) {
								return i[sn(e)];
							}
						};
						return i[":id"] = r.primaryKey, t != null && (i[sn(t)] = r.primaryKey), r;
					})
				},
				hasGetAll: 0 < s.length && "getAll" in u && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604),
				hasIdb3Features: "getAllRecords" in u
			}, s = n.schema, c = n.hasGetAll, l = n.hasIdb3Features, u = s.tables.map(i), d = {};
			return u.forEach(function(e) {
				return d[e.name] = e;
			}), {
				stack: "dbcore",
				transaction: e.transaction.bind(e),
				table: function(e) {
					if (d[e]) return d[e];
					throw Error(`Table '${e}' not found`);
				},
				MIN_KEY: -1 / 0,
				MAX_KEY: nn(t),
				schema: s
			};
		}
		function ln(e, n, r, i) {
			return r = r.IDBKeyRange, n = cn(n, r, i), { dbcore: e.dbcore.reduce(function(e, n) {
				return n = n.create, t(t({}, e), n(e));
			}, n) };
		}
		function un(e, t) {
			var n = t.db, n = ln(e._middlewares, n, e._deps, t);
			e.core = n.dbcore, e.tables.forEach(function(t) {
				var n = t.name;
				e.core.schema.tables.some(function(e) {
					return e.name === n;
				}) && (t.core = e.core.table(n), e[n] instanceof e.Table) && (e[n].core = t.core);
			});
		}
		function dn(e, t, n, r) {
			n.forEach(function(n) {
				var i = r[n];
				t.forEach(function(t) {
					var r = function e(t, n) {
						return m(t, n) || (t = s(t)) && e(t, n);
					}(t, n);
					(!r || "value" in r && r.value === void 0) && (t === e.Transaction.prototype || t instanceof e.Transaction ? f(t, n, {
						get: function() {
							return this.table(n);
						},
						set: function(e) {
							d(this, n, {
								value: e,
								writable: !0,
								configurable: !0,
								enumerable: !0
							});
						}
					}) : t[n] = new e.Table(n, i));
				});
			});
		}
		function fn(e, t) {
			t.forEach(function(t) {
				for (var n in t) t[n] instanceof e.Table && delete t[n];
			});
		}
		function pn(e, t) {
			return e._cfg.version - t._cfg.version;
		}
		function mn(e, t, n, r) {
			var a = e._dbSchema, o = (n.objectStoreNames.contains("$meta") && !a.$meta && (a.$meta = tn("$meta", Sn("")[0], []), e._storeNames.push("$meta")), e._createTransaction("readwrite", e._storeNames, a)), s = (o.create(n), o._completion.catch(r), o._reject.bind(o)), c = A.transless || A;
			ot(function() {
				if (A.trans = o, A.transless = c, t !== 0) return un(e, n), l = t, ((r = o).storeNames.includes("$meta") ? r.table("$meta").get("version").then(function(e) {
					return e ?? l;
				}) : j.resolve(l)).then(function(t) {
					var r = e, a = t, s = o, c = n, l = [], t = r._versions, u = r._dbSchema = bn(0, r.idbdb, c);
					return (t = t.filter(function(e) {
						return e._cfg.version >= a;
					})).length === 0 ? j.resolve() : (t.forEach(function(e) {
						l.push(function() {
							var t, n, o, l = u, d = e._cfg.dbschema, f = (xn(r, l, c), xn(r, d, c), u = r._dbSchema = d, gn(l, d)), p = (f.add.forEach(function(e) {
								_n(c, e[0], e[1].primKey, e[1].indexes);
							}), f.change.forEach(function(e) {
								if (e.recreate) throw new D.Upgrade("Not yet support for changing primary key");
								var t = c.objectStore(e.name);
								e.add.forEach(function(e) {
									return yn(t, e);
								}), e.change.forEach(function(e) {
									t.deleteIndex(e.name), yn(t, e);
								}), e.del.forEach(function(e) {
									return t.deleteIndex(e);
								});
							}), e._cfg.contentUpgrade);
							if (p && e._cfg.version > a) return un(r, c), s._memoizedTables = {}, t = S(d), f.del.forEach(function(e) {
								t[e] = l[e];
							}), fn(r, [r.Transaction.prototype]), dn(r, [r.Transaction.prototype], i(t), t), s.schema = t, (n = ue(p)) && st(), d = j.follow(function() {
								var e;
								(o = p(s)) && n && (e = ct.bind(null, null), o.then(e, e));
							}), o && typeof o.then == "function" ? j.resolve(o) : d.then(function() {
								return o;
							});
						}), l.push(function(t) {
							var n = e._cfg.dbschema, i = t;
							[].slice.call(i.db.objectStoreNames).forEach(function(e) {
								return n[e] == null && i.db.deleteObjectStore(e);
							}), fn(r, [r.Transaction.prototype]), dn(r, [r.Transaction.prototype], r._storeNames, r._dbSchema), s.schema = r._dbSchema;
						}), l.push(function(t) {
							r.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(r.idbdb.version / 10) === e._cfg.version ? (r.idbdb.deleteObjectStore("$meta"), delete r._dbSchema.$meta, r._storeNames = r._storeNames.filter(function(e) {
								return e !== "$meta";
							})) : t.objectStore("$meta").put(e._cfg.version, "version"));
						});
					}), function e() {
						return l.length ? j.resolve(l.shift()(s.idbtrans)).then(e) : j.resolve();
					}().then(function() {
						vn(u, c);
					}));
				}).catch(s);
				var r, l;
				i(a).forEach(function(e) {
					_n(n, e, a[e].primKey, a[e].indexes);
				}), un(e, n), j.follow(function() {
					return e.on.populate.fire(o);
				}).catch(s);
			});
		}
		function hn(e, t) {
			vn(e._dbSchema, t), t.db.version % 10 != 0 || t.objectStoreNames.contains("$meta") || t.db.createObjectStore("$meta").add(Math.ceil(t.db.version / 10 - 1), "version");
			var n = bn(0, e.idbdb, t);
			xn(e, e._dbSchema, t);
			for (var r = 0, i = gn(n, e._dbSchema).change; r < i.length; r++) {
				var a = ((e) => {
					if (e.change.length || e.recreate) return console.warn(`Unable to patch indexes of table ${e.name} because it has changes on the type of index or primary key.`), { value: void 0 };
					var n = t.objectStore(e.name);
					e.add.forEach(function(t) {
						k && console.debug(`Dexie upgrade patch: Creating missing index ${e.name}.${t.src}`), yn(n, t);
					});
				})(i[r]);
				if (typeof a == "object") return a.value;
			}
		}
		function gn(e, t) {
			var n, r = {
				del: [],
				add: [],
				change: []
			};
			for (n in e) t[n] || r.del.push(n);
			for (n in t) {
				var i = e[n], a = t[n];
				if (i) {
					var o = {
						name: n,
						def: a,
						recreate: !1,
						del: [],
						add: [],
						change: []
					};
					if ("" + (i.primKey.keyPath || "") != "" + (a.primKey.keyPath || "") || i.primKey.auto !== a.primKey.auto) o.recreate = !0, r.change.push(o);
					else {
						var s = i.idxByName, c = a.idxByName, l = void 0;
						for (l in s) c[l] || o.del.push(l);
						for (l in c) {
							var u = s[l], d = c[l];
							u ? u.src !== d.src && o.change.push(d) : o.add.push(d);
						}
						(0 < o.del.length || 0 < o.add.length || 0 < o.change.length) && r.change.push(o);
					}
				} else r.add.push([n, a]);
			}
			return r;
		}
		function _n(e, t, n, r) {
			var i = e.db.createObjectStore(t, n.keyPath ? {
				keyPath: n.keyPath,
				autoIncrement: n.auto
			} : { autoIncrement: n.auto });
			r.forEach(function(e) {
				return yn(i, e);
			});
		}
		function vn(e, t) {
			i(e).forEach(function(n) {
				t.db.objectStoreNames.contains(n) || (k && console.debug("Dexie: Creating missing table", n), _n(t, n, e[n].primKey, e[n].indexes));
			});
		}
		function yn(e, t) {
			e.createIndex(t.name, t.keyPath, {
				unique: t.unique,
				multiEntry: t.multi
			});
		}
		function bn(e, t, n) {
			var r = {};
			return g(t.objectStoreNames, 0).forEach(function(e) {
				for (var t = n.objectStore(e), i = $t(en(c = t.keyPath), c || "", !0, !1, !!t.autoIncrement, c && typeof c != "string", !0), a = [], o = 0; o < t.indexNames.length; ++o) {
					var s = t.index(t.indexNames[o]), c = s.keyPath, s = $t(s.name, c, !!s.unique, !!s.multiEntry, !1, c && typeof c != "string", !1);
					a.push(s);
				}
				r[e] = tn(e, i, a);
			}), r;
		}
		function xn(e, t, n) {
			for (var i = n.db.objectStoreNames, a = 0; a < i.length; ++a) {
				var o = i[a], s = n.objectStore(o);
				e._hasGetAll = "getAll" in s;
				for (var c = 0; c < s.indexNames.length; ++c) {
					var l, u = s.indexNames[c], d = s.index(u).keyPath, d = typeof d == "string" ? d : "[" + g(d).join("+") + "]";
					t[o] && (l = t[o].idxByName[d]) && (l.name = u, delete t[o].idxByName[d], t[o].idxByName[u] = l);
				}
			}
			typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && r.WorkerGlobalScope && r instanceof r.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e._hasGetAll = !1);
		}
		function Sn(e) {
			return e.split(",").map(function(e, t) {
				var n = e.split(":"), r = (r = n[1])?.trim(), n = (e = n[0].trim()).replace(/([&*]|\+\+)/g, ""), i = /^\[/.test(n) ? n.match(/^\[(.*)\]$/)[1].split("+") : n;
				return $t(n, i || null, /\&/.test(e), /\*/.test(e), /\+\+/.test(e), a(i), t === 0, r);
			});
		}
		wn.prototype._createTableSchema = tn, wn.prototype._parseIndexSyntax = Sn, wn.prototype._parseStoresSpec = function(e, t) {
			var n = this;
			i(e).forEach(function(r) {
				if (e[r] !== null) {
					var i = n._parseIndexSyntax(e[r]), a = i.shift();
					if (!a) throw new D.Schema("Invalid schema for table " + r + ": " + e[r]);
					if (a.unique = !0, a.multi) throw new D.Schema("Primary key cannot be multiEntry*");
					i.forEach(function(e) {
						if (e.auto) throw new D.Schema("Only primary key can be marked as autoIncrement (++)");
						if (!e.keyPath) throw new D.Schema("Index must have a name and cannot be an empty string");
					}), a = n._createTableSchema(r, a, i), t[r] = a;
				}
			});
		}, wn.prototype.stores = function(e) {
			var t = this.db, e = (this._cfg.storesSource = this._cfg.storesSource ? o(this._cfg.storesSource, e) : e, t._versions), n = {}, r = {};
			return e.forEach(function(e) {
				o(n, e._cfg.storesSource), r = e._cfg.dbschema = {}, e._parseStoresSpec(n, r);
			}), t._dbSchema = r, fn(t, [
				t._allTables,
				t,
				t.Transaction.prototype
			]), dn(t, [
				t._allTables,
				t,
				t.Transaction.prototype,
				this._cfg.tables
			], i(r), r), t._storeNames = i(r), this;
		}, wn.prototype.upgrade = function(e) {
			return this._cfg.contentUpgrade = Ee(this._cfg.contentUpgrade || O, e), this;
		};
		var Cn = wn;
		function wn() {}
		var Tn = (() => {
			var e, t, n;
			return typeof FinalizationRegistry < "u" && typeof WeakRef < "u" ? (e = /* @__PURE__ */ new Set(), t = new FinalizationRegistry(function(t) {
				e.delete(t);
			}), {
				toArray: function() {
					return Array.from(e).map(function(e) {
						return e.deref();
					}).filter(function(e) {
						return e !== void 0;
					});
				},
				add: function(n) {
					var r = new WeakRef(n._novip);
					e.add(r), t.register(n._novip, r, r), e.size > n._options.maxConnections && (r = e.values().next().value, e.delete(r), t.unregister(r));
				},
				remove: function(n) {
					if (n) for (var r = e.values(), i = r.next(); !i.done;) {
						var a = i.value;
						if (a.deref() === n._novip) return e.delete(a), void t.unregister(a);
						i = r.next();
					}
				}
			}) : (n = [], {
				toArray: function() {
					return n;
				},
				add: function(e) {
					n.push(e._novip);
				},
				remove: function(e) {
					e && (e = n.indexOf(e._novip)) !== -1 && n.splice(e, 1);
				}
			});
		})();
		function En(e, t) {
			var n = e._dbNamesDB;
			return n || (n = e._dbNamesDB = new ur(_t, {
				addons: [],
				indexedDB: e,
				IDBKeyRange: t
			})).version(1).stores({ dbnames: "name" }), n.table("dbnames");
		}
		function Dn(e) {
			return e && typeof e.databases == "function";
		}
		function On(e) {
			return ot(function() {
				return A.letThrough = !0, e();
			});
		}
		function kn(e) {
			return !("from" in e);
		}
		var G = function(e, t) {
			var n;
			if (!this) return n = new G(), e && "d" in e && o(n, e), n;
			o(this, arguments.length ? {
				d: 1,
				from: e,
				to: 1 < arguments.length ? t : e
			} : { d: 0 });
		};
		function An(e, t, n) {
			var r = z(t, n);
			if (!isNaN(r)) {
				if (0 < r) throw RangeError();
				if (kn(e)) return o(e, {
					from: t,
					to: n,
					d: 1
				});
				var r = e.l, i = e.r;
				if (z(n, e.from) < 0) return r ? An(r, t, n) : e.l = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, Pn(e);
				if (0 < z(t, e.to)) return i ? An(i, t, n) : e.r = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, Pn(e);
				z(t, e.from) < 0 && (e.from = t, e.l = null, e.d = i ? i.d + 1 : 1), 0 < z(n, e.to) && (e.to = n, e.r = null, e.d = e.l ? e.l.d + 1 : 1), t = !e.r, r && !e.l && jn(e, r), i && t && jn(e, i);
			}
		}
		function jn(e, t) {
			kn(t) || function e(t, n) {
				var r = n.from, i = n.l, a = n.r;
				An(t, r, n.to), i && e(t, i), a && e(t, a);
			}(e, t);
		}
		function Mn(e, t) {
			var n = Nn(t), r = n.next();
			if (!r.done) for (var i = r.value, a = Nn(e), o = a.next(i.from), s = o.value; !r.done && !o.done;) {
				if (z(s.from, i.to) <= 0 && 0 <= z(s.to, i.from)) return !0;
				z(i.from, s.from) < 0 ? i = (r = n.next(s.from)).value : s = (o = a.next(i.from)).value;
			}
			return !1;
		}
		function Nn(e) {
			var t = kn(e) ? null : {
				s: 0,
				n: e
			};
			return { next: function(e) {
				for (var n = 0 < arguments.length; t;) switch (t.s) {
					case 0: if (t.s = 1, n) for (; t.n.l && z(e, t.n.from) < 0;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					else for (; t.n.l;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					case 1: if (t.s = 2, !n || z(e, t.n.to) <= 0) return {
						value: t.n,
						done: !1
					};
					case 2: if (t.n.r) {
						t.s = 3, t = {
							up: t,
							n: t.n.r,
							s: 0
						};
						continue;
					}
					case 3: t = t.up;
				}
				return { done: !0 };
			} };
		}
		function Pn(e) {
			var n, r, i, a = ((a = e.r)?.d || 0) - ((a = e.l)?.d || 0), a = 1 < a ? "r" : a < -1 ? "l" : "";
			a && (n = a == "r" ? "l" : "r", r = t({}, e), i = e[a], e.from = i.from, e.to = i.to, e[a] = i[a], r[a] = i[n], (e[n] = r).d = Fn(r)), e.d = Fn(e);
		}
		function Fn(e) {
			var t = e.r, e = e.l;
			return (t ? e ? Math.max(t.d, e.d) : t.d : e ? e.d : 0) + 1;
		}
		function In(e, t) {
			return i(t).forEach(function(n) {
				e[n] ? jn(e[n], t[n]) : e[n] = function e(t) {
					var n, r, i = {};
					for (n in t) l(t, n) && (r = t[n], i[n] = !r || typeof r != "object" || ne.has(r.constructor) ? r : e(r));
					return i;
				}(t[n]);
			}), e;
		}
		function Ln(e, t) {
			return e.all || t.all || Object.keys(e).some(function(n) {
				return t[n] && Mn(t[n], e[n]);
			});
		}
		u(G.prototype, ((E = {
			add: function(e) {
				return jn(this, e), this;
			},
			addKey: function(e) {
				return An(this, e, e), this;
			},
			addKeys: function(e) {
				var t = this;
				return e.forEach(function(e) {
					return An(t, e, e);
				}), this;
			},
			hasKey: function(e) {
				var t = Nn(this).next(e).value;
				return t && z(t.from, e) <= 0 && 0 <= z(t.to, e);
			}
		})[se] = function() {
			return Nn(this);
		}, E));
		var Rn = {}, zn = {}, Bn = !1;
		function Vn(e) {
			In(zn, e), Bn || (Bn = !0, setTimeout(function() {
				Bn = !1, Hn(zn, !(zn = {}));
			}, 0));
		}
		function Hn(e, t) {
			t === void 0 && (t = !1);
			var n = /* @__PURE__ */ new Set();
			if (e.all) for (var r = 0, i = Object.values(Rn); r < i.length; r++) Un(s = i[r], e, n, t);
			else for (var a in e) {
				var o, s, a = /^idb\:\/\/(.*)\/(.*)\//.exec(a);
				a && (o = a[1], a = a[2], s = Rn[`idb://${o}/${a}`]) && Un(s, e, n, t);
			}
			n.forEach(function(e) {
				return e();
			});
		}
		function Un(e, t, n, r) {
			for (var i = [], a = 0, o = Object.entries(e.queries.query); a < o.length; a++) {
				for (var s = o[a], c = s[0], l = [], u = 0, d = s[1]; u < d.length; u++) {
					var f = d[u];
					Ln(t, f.obsSet) ? f.subscribers.forEach(function(e) {
						return n.add(e);
					}) : r && l.push(f);
				}
				r && i.push([c, l]);
			}
			if (r) for (var p = 0, m = i; p < m.length; p++) {
				var h = m[p], c = h[0], l = h[1];
				e.queries.query[c] = l;
			}
		}
		function Wn(e) {
			var t = e._state, n = e._deps.indexedDB;
			if (t.isBeingOpened || e.idbdb) return t.dbReadyPromise.then(function() {
				return t.dbOpenError ? I(t.dbOpenError) : e;
			});
			t.isBeingOpened = !0, t.dbOpenError = null, t.openComplete = !1;
			var r = t.openCanceller, a = Math.round(10 * e.verno), o = !1;
			function s() {
				if (t.openCanceller !== r) throw new D.DatabaseClosed("db.open() was cancelled");
			}
			function c() {
				return new j(function(r, l) {
					if (s(), !n) throw new D.MissingAPI();
					var u = e.name, p = t.autoSchema || !a ? n.open(u) : n.open(u, a);
					if (!p) throw new D.MissingAPI();
					p.onerror = W(l), p.onblocked = M(e._fireOnBlocked), p.onupgradeneeded = M(function(r) {
						var i;
						d = p.transaction, t.autoSchema && !e._options.allowEmptyDB ? (p.onerror = qt, d.abort(), p.result.close(), (i = n.deleteDatabase(u)).onsuccess = i.onerror = M(function() {
							l(new D.NoSuchDatabase(`Database ${u} doesnt exist`));
						})) : (d.onerror = W(l), i = r.oldVersion > 2 ** 62 ? 0 : r.oldVersion, f = i < 1, e.idbdb = p.result, o && hn(e, d), mn(e, i / 10, d, l));
					}, l), p.onsuccess = M(function() {
						d = null;
						var n, s, l, m, h, _, v = e.idbdb = p.result, y = g(v.objectStoreNames);
						if (0 < y.length) try {
							var b = v.transaction((h = y).length === 1 ? h[0] : h, "readonly");
							if (t.autoSchema) _ = v, m = b, (l = e).verno = _.version / 10, m = l._dbSchema = bn(0, _, m), l._storeNames = g(_.objectStoreNames, 0), dn(l, [l._allTables], i(m), m);
							else if (xn(e, e._dbSchema, b), s = b, ((s = gn(bn(0, (n = e).idbdb, s), n._dbSchema)).add.length || s.change.some(function(e) {
								return e.add.length || e.change.length;
							})) && !o) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), v.close(), a = v.version + 1, o = !0, r(c());
							un(e, b);
						} catch {}
						Tn.add(e), v.onversionchange = M(function(n) {
							t.vcFired = !0, e.on("versionchange").fire(n);
						}), v.onclose = M(function() {
							e.close({ disableAutoOpen: !1 });
						}), f && (y = e._deps, h = u, Dn(_ = y.indexedDB) || h === _t || En(_, y.IDBKeyRange).put({ name: h }).catch(O)), r();
					}, l);
				}).catch(function(e) {
					switch (e?.name) {
						case "UnknownError":
							if (0 < t.PR1398_maxLoop) return t.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), c();
							break;
						case "VersionError": if (0 < a) return a = 0, c();
					}
					return j.reject(e);
				});
			}
			var l, u = t.dbReadyResolve, d = null, f = !1;
			return j.race([r, (typeof navigator > "u" ? j.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e) {
				function t() {
					return indexedDB.databases().finally(e);
				}
				l = setInterval(t, 100), t();
			}).finally(function() {
				return clearInterval(l);
			}) : Promise.resolve()).then(c)]).then(function() {
				return s(), t.onReadyBeingFired = [], j.resolve(On(function() {
					return e.on.ready.fire(e.vip);
				})).then(function n() {
					var r;
					if (0 < t.onReadyBeingFired.length) return r = t.onReadyBeingFired.reduce(Ee, O), t.onReadyBeingFired = [], j.resolve(On(function() {
						return r(e.vip);
					})).then(n);
				});
			}).finally(function() {
				t.openCanceller === r && (t.onReadyBeingFired = null, t.isBeingOpened = !1);
			}).catch(function(n) {
				t.dbOpenError = n;
				try {
					d && d.abort();
				} catch {}
				return r === t.openCanceller && e._close(), I(n);
			}).finally(function() {
				t.openComplete = !0, u();
			}).then(function() {
				var t;
				return f && (t = {}, e.tables.forEach(function(n) {
					n.schema.indexes.forEach(function(r) {
						r.name && (t[`idb://${e.name}/${n.name}/${r.name}`] = new G(-1 / 0, [[[]]]));
					}), t[`idb://${e.name}/${n.name}/`] = t[`idb://${e.name}/${n.name}/:dels`] = new G(-1 / 0, [[[]]]);
				}), Xt(Jt).fire(t), Hn(t, !0)), e;
			});
		}
		function Gn(e) {
			function t(t) {
				return e.next(t);
			}
			var n = i(t), r = i(function(t) {
				return e.throw(t);
			});
			function i(e) {
				return function(t) {
					var t = e(t), i = t.value;
					return t.done ? i : i && typeof i.then == "function" ? i.then(n, r) : a(i) ? Promise.all(i).then(n, r) : n(i);
				};
			}
			return i(t)();
		}
		function Kn(e, t, n) {
			for (var r = a(e) ? e.slice() : [e], i = 0; i < n; ++i) r.push(t);
			return r;
		}
		var qn = {
			stack: "dbcore",
			name: "VirtualIndexMiddleware",
			level: 1,
			create: function(e) {
				return t(t({}, e), { table: function(n) {
					var r = e.table(n), n = r.schema, i = Object.create(null), a = [];
					function o(e, n, r) {
						var s = sn(e), c = i[s] = i[s] || [], l = e == null ? 0 : typeof e == "string" ? 1 : e.length, u = 0 < n, s = t(t({}, r), {
							name: u ? `${s}(virtual-from:${r.name})` : r.name,
							lowLevelIndex: r,
							isVirtual: u,
							keyTail: n,
							keyLength: l,
							extractKey: rn(e),
							unique: !u && r.unique
						});
						return c.push(s), s.isPrimaryKey || a.push(s), 1 < l && o(l === 2 ? e[0] : e.slice(0, l - 1), n + 1, r), c.sort(function(e, t) {
							return e.keyTail - t.keyTail;
						}), s;
					}
					var s = o(n.primaryKey.keyPath, 0, n.primaryKey);
					i[":id"] = [s];
					for (var c = 0, l = n.indexes; c < l.length; c++) {
						var u = l[c];
						o(u.keyPath, 0, u);
					}
					function d(n) {
						var r, i = n.query.index;
						return i.isVirtual ? t(t({}, n), { query: {
							index: i.lowLevelIndex,
							range: (r = n.query.range, i = i.keyTail, {
								type: r.type === 1 ? 2 : r.type,
								lower: Kn(r.lower, r.lowerOpen ? e.MAX_KEY : e.MIN_KEY, i),
								lowerOpen: !0,
								upper: Kn(r.upper, r.upperOpen ? e.MIN_KEY : e.MAX_KEY, i),
								upperOpen: !0
							})
						} }) : n;
					}
					return t(t({}, r), {
						schema: t(t({}, n), {
							primaryKey: s,
							indexes: a,
							getIndexByKeyPath: function(e) {
								return (e = i[sn(e)]) && e[0];
							}
						}),
						count: function(e) {
							return r.count(d(e));
						},
						query: function(e) {
							return r.query(d(e));
						},
						openCursor: function(t) {
							var n = t.query.index, i = n.keyTail, a = n.keyLength;
							return n.isVirtual ? r.openCursor(d(t)).then(function(e) {
								return e && o(e);
							}) : r.openCursor(t);
							function o(n) {
								return Object.create(n, {
									continue: { value: function(r) {
										r == null ? t.unique ? n.continue(n.key.slice(0, a).concat(t.reverse ? e.MIN_KEY : e.MAX_KEY, i)) : n.continue() : n.continue(Kn(r, t.reverse ? e.MAX_KEY : e.MIN_KEY, i));
									} },
									continuePrimaryKey: { value: function(t, r) {
										n.continuePrimaryKey(Kn(t, e.MAX_KEY, i), r);
									} },
									primaryKey: { get: function() {
										return n.primaryKey;
									} },
									key: { get: function() {
										var e = n.key;
										return a === 1 ? e[0] : e.slice(0, a);
									} },
									value: { get: function() {
										return n.value;
									} }
								});
							}
						}
					});
				} });
			}
		};
		function Jn(e, t, n, r) {
			return n ||= {}, r ||= "", i(e).forEach(function(i) {
				var a, o, s;
				l(t, i) ? (a = e[i], o = t[i], typeof a == "object" && typeof o == "object" && a && o ? (s = oe(a)) === oe(o) ? s === "Object" ? Jn(a, o, n, r + i + ".") : a !== o && (n[r + i] = t[i]) : n[r + i] = t[i] : a !== o && (n[r + i] = t[i])) : n[r + i] = void 0;
			}), i(t).forEach(function(i) {
				l(e, i) || (n[r + i] = t[i]);
			}), n;
		}
		function Yn(e, t) {
			return t.type === "delete" ? t.keys : t.keys || t.values.map(e.extractKey);
		}
		var Xn = {
			stack: "dbcore",
			name: "HooksMiddleware",
			level: 2,
			create: function(e) {
				return t(t({}, e), { table: function(r) {
					var i = e.table(r), a = i.schema.primaryKey;
					return t(t({}, i), { mutate: function(e) {
						var o = A.trans, s = o.table(r).hook, c = s.deleting, u = s.creating, d = s.updating;
						switch (e.type) {
							case "add":
								if (u.fire === O) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "put":
								if (u.fire === O && d.fire === O) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "delete":
								if (c.fire === O) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "deleteRange":
								if (c.fire === O) break;
								return o._promise("readwrite", function() {
									return function e(n, r, o) {
										return i.query({
											trans: n,
											values: !1,
											query: {
												index: a,
												range: r
											},
											limit: o
										}).then(function(i) {
											var a = i.result;
											return f({
												type: "delete",
												keys: a,
												trans: n
											}).then(function(i) {
												return 0 < i.numFailures ? Promise.reject(i.failures[0]) : a.length < o ? {
													failures: [],
													numFailures: 0,
													lastResult: void 0
												} : e(n, t(t({}, r), {
													lower: a[a.length - 1],
													lowerOpen: !0
												}), o);
											});
										});
									}(e.trans, e.range, 1e4);
								}, !0);
						}
						return i.mutate(e);
						function f(e) {
							var r, o, s, f = A.trans, p = e.keys || Yn(a, e);
							if (p) return (e = e.type === "add" || e.type === "put" ? t(t({}, e), { keys: p }) : t({}, e)).type !== "delete" && (e.values = n([], e.values, !0)), e.keys && (e.keys = n([], e.keys, !0)), r = i, s = p, ((o = e).type === "add" ? Promise.resolve([]) : r.getMany({
								trans: o.trans,
								keys: s,
								cache: "immutable"
							})).then(function(t) {
								var n = p.map(function(n, r) {
									var i, o, s, p = t[r], m = {
										onerror: null,
										onsuccess: null
									};
									return e.type === "delete" ? c.fire.call(m, n, p, f) : e.type === "add" || p === void 0 ? (i = u.fire.call(m, n, e.values[r], f), n == null && i != null && (e.keys[r] = n = i, a.outbound || x(e.values[r], a.keyPath, n))) : (i = Jn(p, e.values[r]), (o = d.fire.call(m, i, n, p, f)) && (s = e.values[r], Object.keys(o).forEach(function(e) {
										l(s, e) ? s[e] = o[e] : x(s, e, o[e]);
									}))), m;
								});
								return i.mutate(e).then(function(r) {
									for (var i = r.failures, a = r.results, o = r.numFailures, r = r.lastResult, s = 0; s < p.length; ++s) {
										var c = (a || p)[s], l = n[s];
										c == null ? l.onerror && l.onerror(i[s]) : l.onsuccess && l.onsuccess(e.type === "put" && t[s] ? e.values[s] : c);
									}
									return {
										failures: i,
										results: a,
										numFailures: o,
										lastResult: r
									};
								}).catch(function(e) {
									return n.forEach(function(t) {
										return t.onerror && t.onerror(e);
									}), Promise.reject(e);
								});
							});
							throw Error("Keys missing");
						}
					} });
				} });
			}
		};
		function Zn(e, t, n) {
			try {
				if (!t || t.keys.length < e.length) return null;
				for (var r = [], i = 0, a = 0; i < t.keys.length && a < e.length; ++i) z(t.keys[i], e[a]) === 0 && (r.push(n ? ie(t.values[i]) : t.values[i]), ++a);
				return r.length === e.length ? r : null;
			} catch {
				return null;
			}
		}
		var Qn = {
			stack: "dbcore",
			level: -1,
			create: function(e) {
				return { table: function(n) {
					var r = e.table(n);
					return t(t({}, r), {
						getMany: function(e) {
							var t;
							return e.cache ? (t = Zn(e.keys, e.trans._cache, e.cache === "clone")) ? j.resolve(t) : r.getMany(e).then(function(t) {
								return e.trans._cache = {
									keys: e.keys,
									values: e.cache === "clone" ? ie(t) : t
								}, t;
							}) : r.getMany(e);
						},
						mutate: function(e) {
							return e.type !== "add" && (e.trans._cache = null), r.mutate(e);
						}
					});
				} };
			}
		};
		function $n(e, t) {
			return e.trans.mode === "readonly" && !!e.subscr && !e.trans.explicit && e.trans.db._options.cache !== "disabled" && !t.schema.primaryKey.outbound;
		}
		function er(e, t) {
			switch (e) {
				case "query": return t.values && !t.unique;
				case "get":
				case "getMany":
				case "count":
				case "openCursor": return !1;
			}
		}
		var tr = {
			stack: "dbcore",
			level: 0,
			name: "Observability",
			create: function(e) {
				var n = e.schema.name, r = new G(e.MIN_KEY, e.MAX_KEY);
				return t(t({}, e), {
					transaction: function(t, n, r) {
						if (A.subscr && n !== "readonly") throw new D.ReadOnly(`Readwrite transaction in liveQuery context. Querier source: ${A.querier}`);
						return e.transaction(t, n, r);
					},
					table: function(o) {
						function s(t) {
							var t = t.query;
							return [t.index, new G((t = t.range).lower ?? e.MIN_KEY, t.upper ?? e.MAX_KEY)];
						}
						var c = e.table(o), l = c.schema, u = l.primaryKey, d = l.indexes, f = u.extractKey, p = u.outbound, m = u.autoIncrement && d.filter(function(e) {
							return e.compound && e.keyPath.includes(u.keyPath);
						}), h = t(t({}, c), { mutate: function(t) {
							function i(e) {
								return e = `idb://${n}/${o}/${e}`, h[e] || (h[e] = new G());
							}
							var s, d, f, p = t.trans, h = t.mutatedParts ||= {}, g = i(""), _ = i(":dels"), v = t.type, y = t.type === "deleteRange" ? [t.range] : t.type === "delete" ? [t.keys] : t.values.length < 50 ? [Yn(u, t).filter(function(e) {
								return e;
							}), t.values] : [], b = y[0], y = y[1], x = t.trans._cache;
							return a(b) ? (g.addKeys(b), (v = v === "delete" || b.length === y.length ? Zn(b, x) : null) || _.addKeys(b), (v || y) && (s = i, d = v, f = y, l.indexes.forEach(function(e) {
								var t = s(e.name || "");
								function n(t) {
									return t == null ? null : e.extractKey(t);
								}
								function r(n) {
									e.multiEntry && a(n) ? n.forEach(function(e) {
										return t.addKey(e);
									}) : t.addKey(n);
								}
								(d || f).forEach(function(e, t) {
									var i = d && n(d[t]), t = f && n(f[t]);
									z(i, t) !== 0 && (i != null && r(i), t != null) && r(t);
								});
							}))) : b ? (y = {
								from: (x = b.lower) ?? e.MIN_KEY,
								to: (v = b.upper) ?? e.MAX_KEY
							}, _.add(y), g.add(y)) : (g.add(r), _.add(r), l.indexes.forEach(function(e) {
								return i(e.name).add(r);
							})), c.mutate(t).then(function(e) {
								return !b || t.type !== "add" && t.type !== "put" || (g.addKeys(e.results), m && m.forEach(function(n) {
									for (var r = t.values.map(function(e) {
										return n.extractKey(e);
									}), a = n.keyPath.findIndex(function(e) {
										return e === u.keyPath;
									}), o = 0, s = e.results.length; o < s; ++o) r[o][a] = e.results[o];
									i(n.name).addKeys(r);
								})), p.mutatedParts = In(p.mutatedParts || {}, h), e;
							});
						} }), g = {
							get: function(e) {
								return [u, new G(e.key)];
							},
							getMany: function(e) {
								return [u, new G().addKeys(e.keys)];
							},
							count: s,
							query: s,
							openCursor: s
						};
						return i(g).forEach(function(e) {
							h[e] = function(i) {
								var a = A.subscr, s = !!a, l = $n(A, c) && er(e, i) ? i.obsSet = {} : a;
								if (s) {
									var u, a = function(e) {
										return e = `idb://${n}/${o}/${e}`, l[e] || (l[e] = new G());
									}, d = a(""), m = a(":dels"), s = g[e](i), h = s[0], s = s[1];
									if ((e === "query" && h.isPrimaryKey && !i.values ? m : a(h.name || "")).add(s), !h.isPrimaryKey) {
										if (e !== "count") return u = e === "query" && p && i.values && c.query(t(t({}, i), { values: !1 })), c[e].apply(this, arguments).then(function(t) {
											if (e === "query") {
												if (p && i.values) return u.then(function(e) {
													return e = e.result, d.addKeys(e), t;
												});
												var n = i.values ? t.result.map(f) : t.result;
												(i.values ? d : m).addKeys(n);
											} else {
												var r, a;
												if (e === "openCursor") return a = i.values, (r = t) && Object.create(r, {
													key: { get: function() {
														return m.addKey(r.primaryKey), r.key;
													} },
													primaryKey: { get: function() {
														var e = r.primaryKey;
														return m.addKey(e), e;
													} },
													value: { get: function() {
														return a && d.addKey(r.primaryKey), r.value;
													} }
												});
											}
											return t;
										});
										m.add(r);
									}
								}
								return c[e].apply(this, arguments);
							};
						}), h;
					}
				});
			}
		};
		function nr(e, n, r) {
			var i;
			return r.numFailures === 0 ? n : n.type === "deleteRange" || (i = n.keys ? n.keys.length : "values" in n && n.values ? n.values.length : 1, r.numFailures === i) ? null : (i = t({}, n), a(i.keys) && (i.keys = i.keys.filter(function(e, t) {
				return !(t in r.failures);
			})), "values" in i && a(i.values) && (i.values = i.values.filter(function(e, t) {
				return !(t in r.failures);
			})), i);
		}
		function rr(e, t) {
			return n = e, ((r = t).lower === void 0 || (r.lowerOpen ? 0 < z(n, r.lower) : 0 <= z(n, r.lower))) && (n = e, (r = t).upper === void 0 || (r.upperOpen ? z(n, r.upper) < 0 : z(n, r.upper) <= 0));
			var n, r;
		}
		function ir(e, t, n, r, i, o) {
			var s, c, l, u, d, f, p;
			return !n || n.length === 0 || (s = t.query.index, c = s.multiEntry, l = t.query.range, u = r.schema.primaryKey.extractKey, d = s.extractKey, f = (s.lowLevelIndex || s).extractKey, (r = n.reduce(function(e, n) {
				var r = e, i = [];
				if (n.type === "add" || n.type === "put") for (var o = new G(), s = n.values.length - 1; 0 <= s; --s) {
					var f, p = n.values[s], m = u(p);
					!o.hasKey(m) && (f = d(p), c && a(f) ? f.some(function(e) {
						return rr(e, l);
					}) : rr(f, l)) && (o.addKey(m), i.push(p));
				}
				switch (n.type) {
					case "add":
						var h = new G().addKeys(t.values ? e.map(function(e) {
							return u(e);
						}) : e), r = e.concat(t.values ? i.filter(function(e) {
							return e = u(e), !h.hasKey(e) && (h.addKey(e), !0);
						}) : i.map(function(e) {
							return u(e);
						}).filter(function(e) {
							return !h.hasKey(e) && (h.addKey(e), !0);
						}));
						break;
					case "put":
						var g = new G().addKeys(n.values.map(function(e) {
							return u(e);
						}));
						r = e.filter(function(e) {
							return !g.hasKey(t.values ? u(e) : e);
						}).concat(t.values ? i : i.map(function(e) {
							return u(e);
						}));
						break;
					case "delete":
						var _ = new G().addKeys(n.keys);
						r = e.filter(function(e) {
							return !_.hasKey(t.values ? u(e) : e);
						});
						break;
					case "deleteRange":
						var v = n.range;
						r = e.filter(function(e) {
							return !rr(u(e), v);
						});
				}
				return r;
			}, e)) === e) ? e : (p = function(e, t) {
				return z(f(e), f(t)) || z(u(e), u(t));
			}, r.sort(t.direction === "prev" || t.direction === "prevunique" ? function(e, t) {
				return p(t, e);
			} : p), t.limit && t.limit < 1 / 0 && (r.length > t.limit ? r.length = t.limit : e.length === t.limit && r.length < t.limit && (i.dirty = !0)), o ? Object.freeze(r) : r);
		}
		function ar(e, t) {
			return z(e.lower, t.lower) === 0 && z(e.upper, t.upper) === 0 && !!e.lowerOpen == !!t.lowerOpen && !!e.upperOpen == !!t.upperOpen;
		}
		function or(e, t) {
			return ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : -1;
				if (t === void 0) return 1;
				if ((e = z(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return 1;
					if (r) return -1;
				}
				return e;
			})(e.lower, t.lower, e.lowerOpen, t.lowerOpen) <= 0 && 0 <= ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : 1;
				if (t === void 0) return -1;
				if ((e = z(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return -1;
					if (r) return 1;
				}
				return e;
			})(e.upper, t.upper, e.upperOpen, t.upperOpen);
		}
		function sr(e, t, n, r) {
			e.subscribers.add(n), r.addEventListener("abort", function() {
				var r, i;
				e.subscribers.delete(n), e.subscribers.size === 0 && (r = e, i = t, setTimeout(function() {
					r.subscribers.size === 0 && w(i, r);
				}, 3e3));
			});
		}
		var cr = {
			stack: "dbcore",
			level: 0,
			name: "Cache",
			create: function(e) {
				var n = e.schema.name;
				return t(t({}, e), {
					transaction: function(t, r, i) {
						var a, o, s = e.transaction(t, r, i);
						return r === "readwrite" && (i = (a = new AbortController()).signal, s.addEventListener("abort", (o = function(i) {
							return function() {
								if (a.abort(), r === "readwrite") {
									for (var o = /* @__PURE__ */ new Set(), c = 0, l = t; c < l.length; c++) {
										var u = l[c], d = Rn[`idb://${n}/${u}`];
										if (d) {
											var f = e.table(u), p = d.optimisticOps.filter(function(e) {
												return e.trans === s;
											});
											if (s._explicit && i && s.mutatedParts) for (var m = 0, h = Object.values(d.queries.query); m < h.length; m++) for (var g = 0, _ = (b = h[m]).slice(); g < _.length; g++) Ln((x = _[g]).obsSet, s.mutatedParts) && (w(b, x), x.subscribers.forEach(function(e) {
												return o.add(e);
											}));
											else if (0 < p.length) {
												d.optimisticOps = d.optimisticOps.filter(function(e) {
													return e.trans !== s;
												});
												for (var v = 0, y = Object.values(d.queries.query); v < y.length; v++) for (var b, x, S, C = 0, ee = (b = y[v]).slice(); C < ee.length; C++) (x = ee[C]).res != null && s.mutatedParts && (i && !x.dirty ? (S = Object.isFrozen(x.res), S = ir(x.res, x.req, p, f, x, S), x.dirty ? (w(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})) : S !== x.res && (x.res = S, x.promise = j.resolve({ result: S }))) : (x.dirty && w(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})));
											}
										}
									}
									o.forEach(function(e) {
										return e();
									});
								}
							};
						})(!1), { signal: i }), s.addEventListener("error", o(!1), { signal: i }), s.addEventListener("complete", o(!0), { signal: i })), s;
					},
					table: function(r) {
						var i = e.table(r), a = i.schema.primaryKey;
						return t(t({}, i), {
							mutate: function(e) {
								var o, s = A.trans;
								return !a.outbound && s.db._options.cache !== "disabled" && !s.explicit && s.idbtrans.mode === "readwrite" && (o = Rn[`idb://${n}/${r}`]) ? (s = i.mutate(e), e.type !== "add" && e.type !== "put" || !(50 <= e.values.length || Yn(a, e).some(function(e) {
									return e == null;
								})) ? (o.optimisticOps.push(e), e.mutatedParts && Vn(e.mutatedParts), s.then(function(t) {
									0 < t.numFailures && (w(o.optimisticOps, e), (t = nr(0, e, t)) && o.optimisticOps.push(t), e.mutatedParts) && Vn(e.mutatedParts);
								}), s.catch(function() {
									w(o.optimisticOps, e), e.mutatedParts && Vn(e.mutatedParts);
								})) : s.then(function(n) {
									var r = nr(0, t(t({}, e), { values: e.values.map(function(e, r) {
										var i;
										return n.failures[r] ? e : (x(i = (i = a.keyPath) != null && i.includes(".") ? ie(e) : t({}, e), a.keyPath, n.results[r]), i);
									}) }), n);
									o.optimisticOps.push(r), queueMicrotask(function() {
										return e.mutatedParts && Vn(e.mutatedParts);
									});
								}), s) : i.mutate(e);
							},
							query: function(e) {
								var t, a, o, s, c, l, u;
								return $n(A, i) && er("query", e) ? (t = (o = A.trans)?.db._options.cache === "immutable", a = (o = A).requery, o = o.signal, l = ((e, t, n, r) => {
									var i = Rn[`idb://${e}/${t}`];
									if (!i) return [];
									if (!(e = i.queries[n])) return [
										null,
										!1,
										i,
										null
									];
									var a = e[(r.query ? r.query.index.name : null) || ""];
									if (!a) return [
										null,
										!1,
										i,
										null
									];
									switch (n) {
										case "query":
											var o = (s = r.direction) ?? "next", s = a.find(function(e) {
												return e.req.limit === r.limit && e.req.values === r.values && (e.req.direction ?? "next") === o && ar(e.req.query.range, r.query.range);
											});
											return s ? [
												s,
												!0,
												i,
												a
											] : [
												a.find(function(e) {
													return ("limit" in e.req ? e.req.limit : 1 / 0) >= r.limit && (e.req.direction ?? "next") === o && (!r.values || e.req.values) && or(e.req.query.range, r.query.range);
												}),
												!1,
												i,
												a
											];
										case "count": return s = a.find(function(e) {
											return ar(e.req.query.range, r.query.range);
										}), [
											s,
											!!s,
											i,
											a
										];
									}
								})(n, r, "query", e), u = l[0], s = l[2], c = l[3], u && l[1] ? u.obsSet = e.obsSet : (l = i.query(e).then(function(e) {
									var n = e.result;
									if (u && (u.res = n), t) {
										for (var r = 0, i = n.length; r < i; ++r) Object.freeze(n[r]);
										Object.freeze(n);
									}
									return e;
								}).catch(function(e) {
									return c && u && w(c, u), Promise.reject(e);
								}), u = {
									obsSet: e.obsSet,
									promise: l,
									subscribers: /* @__PURE__ */ new Set(),
									type: "query",
									req: e,
									dirty: !1
								}, c ? c.push(u) : (c = [u], (s ||= Rn[`idb://${n}/${r}`] = {
									queries: {
										query: {},
										count: {}
									},
									objs: /* @__PURE__ */ new Map(),
									optimisticOps: [],
									unsignaledParts: {}
								}).queries.query[e.query.index.name || ""] = c)), sr(u, c, a, o), u.promise.then(function(n) {
									return n = ir(n.result, e, s?.optimisticOps, i, u, t), { result: t ? n : ie(n) };
								})) : i.query(e);
							}
						});
					}
				});
			}
		};
		function lr(e, t) {
			return new Proxy(e, { get: function(e, n, r) {
				return n === "db" ? t : Reflect.get(e, n, r);
			} });
		}
		K.prototype.version = function(e) {
			if (isNaN(e) || e < .1) throw new D.Type("Given version is not a positive number");
			if (e = Math.round(10 * e) / 10, this.idbdb || this._state.isBeingOpened) throw new D.Schema("Cannot add version when database is open");
			this.verno = Math.max(this.verno, e);
			var t = this._versions, n = t.filter(function(t) {
				return t._cfg.version === e;
			})[0];
			return n || (n = new this.Version(e), t.push(n), t.sort(pn), n.stores({}), this._state.autoSchema = !1), n;
		}, K.prototype._whenReady = function(e) {
			var t = this;
			return this.idbdb && (this._state.openComplete || A.letThrough || this._vip) ? e() : new j(function(e, n) {
				if (t._state.openComplete) return n(new D.DatabaseClosed(t._state.dbOpenError));
				if (!t._state.isBeingOpened) {
					if (!t._state.autoOpen) return void n(new D.DatabaseClosed());
					t.open().catch(O);
				}
				t._state.dbReadyPromise.then(e, n);
			}).then(e);
		}, K.prototype.use = function(e) {
			var t = e.stack, n = e.create, r = e.level, e = e.name, i = (e && this.unuse({
				stack: t,
				name: e
			}), this._middlewares[t] || (this._middlewares[t] = []));
			return i.push({
				stack: t,
				create: n,
				level: r ?? 10,
				name: e
			}), i.sort(function(e, t) {
				return e.level - t.level;
			}), this;
		}, K.prototype.unuse = function(e) {
			var t = e.stack, n = e.name, r = e.create;
			return t && this._middlewares[t] && (this._middlewares[t] = this._middlewares[t].filter(function(e) {
				return r ? e.create !== r : !!n && e.name !== n;
			})), this;
		}, K.prototype.open = function() {
			var e = this;
			return F(Be, function() {
				return Wn(e);
			});
		}, K.prototype._close = function() {
			this.on.close.fire(new CustomEvent("close"));
			var e = this._state;
			if (Tn.remove(this), this.idbdb) {
				try {
					this.idbdb.close();
				} catch {}
				this.idbdb = null;
			}
			e.isBeingOpened || (e.dbReadyPromise = new j(function(t) {
				e.dbReadyResolve = t;
			}), e.openCanceller = new j(function(t, n) {
				e.cancelOpen = n;
			}));
		}, K.prototype.close = function(e) {
			var e = (e === void 0 ? { disableAutoOpen: !0 } : e).disableAutoOpen, t = this._state;
			e ? (t.isBeingOpened && t.cancelOpen(new D.DatabaseClosed()), this._close(), t.autoOpen = !1, t.dbOpenError = new D.DatabaseClosed()) : (this._close(), t.autoOpen = this._options.autoOpen || t.isBeingOpened, t.openComplete = !1, t.dbOpenError = null);
		}, K.prototype.delete = function(e) {
			var t = this, n = (e === void 0 && (e = { disableAutoOpen: !0 }), 0 < arguments.length && typeof arguments[0] != "object"), r = this._state;
			return new j(function(i, a) {
				function o() {
					t.close(e);
					var n = t._deps.indexedDB.deleteDatabase(t.name);
					n.onsuccess = M(function() {
						var e = t._deps, n = t.name, r;
						Dn(r = e.indexedDB) || n === _t || En(r, e.IDBKeyRange).delete(n).catch(O), i();
					}), n.onerror = W(a), n.onblocked = t._fireOnBlocked;
				}
				if (n) throw new D.InvalidArgument("Invalid closeOptions argument to db.delete()");
				r.isBeingOpened ? r.dbReadyPromise.then(o) : o();
			});
		}, K.prototype.backendDB = function() {
			return this.idbdb;
		}, K.prototype.isOpen = function() {
			return this.idbdb !== null;
		}, K.prototype.hasBeenClosed = function() {
			var e = this._state.dbOpenError;
			return e && e.name === "DatabaseClosed";
		}, K.prototype.hasFailed = function() {
			return this._state.dbOpenError !== null;
		}, K.prototype.dynamicallyOpened = function() {
			return this._state.autoSchema;
		}, Object.defineProperty(K.prototype, "tables", {
			get: function() {
				var e = this;
				return i(this._allTables).map(function(t) {
					return e._allTables[t];
				});
			},
			enumerable: !1,
			configurable: !0
		}), K.prototype.transaction = function() {
			var e = function(e, t, n) {
				var r = arguments.length;
				if (r < 2) throw new D.InvalidArgument("Too few arguments");
				for (var i = Array(r - 1); --r;) i[r - 1] = arguments[r];
				return n = i.pop(), [
					e,
					ee(i),
					n
				];
			}.apply(this, arguments);
			return this._transaction.apply(this, e);
		}, K.prototype._transaction = function(e, t, n) {
			var r, i, a = this, o = A.trans, s = (o && o.db === this && e.indexOf("!") === -1 || (o = null), e.indexOf("?") !== -1);
			e = e.replace("!", "").replace("?", "");
			try {
				if (i = t.map(function(e) {
					if (e = e instanceof a.Table ? e.name : e, typeof e != "string") throw TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
					return e;
				}), e == "r" || e === vt) r = vt;
				else {
					if (e != "rw" && e != yt) throw new D.InvalidArgument("Invalid transaction mode: " + e);
					r = yt;
				}
				if (o) {
					if (o.mode === vt && r === yt) {
						if (!s) throw new D.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
						o = null;
					}
					o && i.forEach(function(e) {
						if (o && o.storeNames.indexOf(e) === -1) {
							if (!s) throw new D.SubTransaction("Table " + e + " not included in parent transaction.");
							o = null;
						}
					}), s && o && !o.active && (o = null);
				}
			} catch (e) {
				return o ? o._promise(null, function(t, n) {
					n(e);
				}) : I(e);
			}
			var c = function e(t, n, r, i, a) {
				return j.resolve().then(function() {
					var o = A.transless || A, s = t._createTransaction(n, r, t._dbSchema, i), o = (s.explicit = !0, {
						trans: s,
						transless: o
					});
					if (i) s.idbtrans = i.idbtrans;
					else try {
						s.create(), s.idbtrans._explicit = !0, t._state.PR1398_maxLoop = 3;
					} catch (i) {
						return i.name === ge.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
							return e(t, n, r, null, a);
						})) : I(i);
					}
					var c, l = ue(a), o = (l && st(), j.follow(function() {
						var e;
						(c = a.call(s, s)) && (l ? (e = ct.bind(null, null), c.then(e, e)) : typeof c.next == "function" && typeof c.throw == "function" && (c = Gn(c)));
					}, o));
					return (c && typeof c.then == "function" ? j.resolve(c).then(function(e) {
						return s.active ? e : I(new D.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
					}) : o.then(function() {
						return c;
					})).then(function(e) {
						return i && s._resolve(), s._completion.then(function() {
							return e;
						});
					}).catch(function(e) {
						return s._reject(e), I(e);
					});
				});
			}.bind(null, this, r, i, o, n);
			return o ? o._promise(r, c, "lock") : A.trans ? F(A.transless, function() {
				return a._whenReady(c);
			}) : this._whenReady(c);
		}, K.prototype.table = function(e) {
			if (l(this._allTables, e)) return this._allTables[e];
			throw new D.InvalidTable(`Table ${e} does not exist`);
		};
		var ur = K;
		function K(e, n) {
			var r, i, a, o, s, c = this, l = (this._middlewares = {}, this.verno = 0, K.dependencies), l = (this._options = n = t({
				addons: K.addons,
				autoOpen: !0,
				indexedDB: l.indexedDB,
				IDBKeyRange: l.IDBKeyRange,
				cache: "cloned",
				maxConnections: 1e3
			}, n), this._deps = {
				indexedDB: n.indexedDB,
				IDBKeyRange: n.IDBKeyRange
			}, n.addons), u = (this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this, {
				dbOpenError: null,
				isBeingOpened: !1,
				onReadyBeingFired: null,
				openComplete: !1,
				dbReadyResolve: O,
				dbReadyPromise: null,
				cancelOpen: O,
				openCanceller: null,
				autoSchema: !0,
				PR1398_maxLoop: 3,
				autoOpen: n.autoOpen
			}), d = (u.dbReadyPromise = new j(function(e) {
				u.dbReadyResolve = e;
			}), u.openCanceller = new j(function(e, t) {
				u.cancelOpen = t;
			}), this._state = u, this.name = e, this.on = kt(this, "populate", "blocked", "versionchange", "close", { ready: [Ee, O] }), this.once = function(e, t) {
				var n = function() {
					var r = [...arguments];
					c.on(e).unsubscribe(n), t.apply(c, r);
				};
				return c.on(e, n);
			}, this.on.ready.subscribe = _(this.on.ready.subscribe, function(e) {
				return function(t, n) {
					K.vip(function() {
						var r, i = c._state;
						i.openComplete ? (i.dbOpenError || j.resolve().then(t), n && e(t)) : i.onReadyBeingFired ? (i.onReadyBeingFired.push(t), n && e(t)) : (e(t), r = c, n || e(function e() {
							r.on.ready.unsubscribe(t), r.on.ready.unsubscribe(e);
						}));
					});
				};
			}), this.Collection = (r = this, At(Rt.prototype, function(e, t) {
				this.db = r;
				var n = bt, i = null;
				if (t) try {
					n = t();
				} catch (e) {
					i = e;
				}
				var t = e._ctx, e = t.table, a = e.hook.reading.fire;
				this._ctx = {
					table: e,
					index: t.index,
					isPrimKey: !t.index || e.schema.primKey.keyPath && t.index === e.schema.primKey.name,
					range: n,
					keysOnly: !1,
					dir: "next",
					unique: "",
					algorithm: null,
					filter: null,
					replayFilter: null,
					justLimit: !0,
					isMatch: null,
					offset: 0,
					limit: 1 / 0,
					error: i,
					or: t.or,
					valueMapper: a === ye ? null : a
				};
			})), this.Table = (i = this, At(Ot.prototype, function(e, t, n) {
				this.db = i, this._tx = n, this.name = e, this.schema = t, this.hook = i._allTables[e] ? i._allTables[e].hook : kt(null, {
					creating: [Se, O],
					reading: [be, ye],
					updating: [we, O],
					deleting: [Ce, O]
				});
			})), this.Transaction = (a = this, At(Zt.prototype, function(e, t, n, r, i) {
				var o = this;
				e !== "readonly" && t.forEach(function(e) {
					e = (e = n[e])?.yProps, e && (t = t.concat(e.map(function(e) {
						return e.updatesTable;
					})));
				}), this.db = a, this.mode = e, this.storeNames = t, this.schema = n, this.chromeTransactionDurability = r, this.idbtrans = null, this.on = kt(this, "complete", "error", "abort"), this.parent = i || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new j(function(e, t) {
					o._resolve = e, o._reject = t;
				}), this._completion.then(function() {
					o.active = !1, o.on.complete.fire();
				}, function(e) {
					var t = o.active;
					return o.active = !1, o.on.error.fire(e), o.parent ? o.parent._reject(e) : t && o.idbtrans && o.idbtrans.abort(), I(e);
				});
			})), this.Version = (o = this, At(Cn.prototype, function(e) {
				this.db = o, this._cfg = {
					version: e,
					storesSource: null,
					dbschema: {},
					tables: {},
					contentUpgrade: null
				};
			})), this.WhereClause = (s = this, At(Kt.prototype, function(e, t, n) {
				if (this.db = s, this._ctx = {
					table: e,
					index: t === ":id" ? null : t,
					or: n
				}, this._cmp = this._ascending = z, this._descending = function(e, t) {
					return z(t, e);
				}, this._max = function(e, t) {
					return 0 < z(e, t) ? e : t;
				}, this._min = function(e, t) {
					return z(e, t) < 0 ? e : t;
				}, this._IDBKeyRange = s._deps.IDBKeyRange, !this._IDBKeyRange) throw new D.MissingAPI();
			})), this.on("versionchange", function(e) {
				0 < e.newVersion ? console.warn(`Another connection wants to upgrade database '${c.name}'. Closing db now to resume the upgrade.`) : console.warn(`Another connection wants to delete database '${c.name}'. Closing db now to resume the delete request.`), c.close({ disableAutoOpen: !1 });
			}), this.on("blocked", function(e) {
				!e.newVersion || e.newVersion < e.oldVersion ? console.warn(`Dexie.delete('${c.name}') was blocked`) : console.warn(`Upgrade '${c.name}' blocked by other connection holding version ${e.oldVersion / 10}`);
			}), this._maxKey = nn(n.IDBKeyRange), this._createTransaction = function(e, t, n, r) {
				return new c.Transaction(e, t, n, c._options.chromeTransactionDurability, r);
			}, this._fireOnBlocked = function(e) {
				c.on("blocked").fire(e), Tn.toArray().filter(function(e) {
					return e.name === c.name && e !== c && !e._state.vcFired;
				}).map(function(t) {
					return t.on("versionchange").fire(e);
				});
			}, this.use(Qn), this.use(cr), this.use(tr), this.use(qn), this.use(Xn), new Proxy(this, { get: function(e, t, n) {
				var r;
				return t === "_vip" || (t === "table" ? function(e) {
					return lr(c.table(e), d);
				} : (r = Reflect.get(e, t, n)) instanceof Ot ? lr(r, d) : t === "tables" ? r.map(function(e) {
					return lr(e, d);
				}) : t === "_createTransaction" ? function() {
					return lr(r.apply(this, arguments), d);
				} : r);
			} }));
			this.vip = d, l.forEach(function(e) {
				return e(c);
			});
		}
		var dr, je = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", fr = (pr.prototype.subscribe = function(e, t, n) {
			return this._subscribe(e && typeof e != "function" ? e : {
				next: e,
				error: t,
				complete: n
			});
		}, pr.prototype[je] = function() {
			return this;
		}, pr);
		function pr(e) {
			this._subscribe = e;
		}
		try {
			dr = {
				indexedDB: r.indexedDB || r.mozIndexedDB || r.webkitIndexedDB || r.msIndexedDB,
				IDBKeyRange: r.IDBKeyRange || r.webkitIDBKeyRange
			};
		} catch {
			dr = {
				indexedDB: null,
				IDBKeyRange: null
			};
		}
		function mr(e) {
			var t, n = !1, r = new fr(function(r) {
				var i = ue(e), a, o = !1, s = {}, c = {}, l = {
					get closed() {
						return o;
					},
					unsubscribe: function() {
						o || (o = !0, a && a.abort(), u && Xt.storagemutated.unsubscribe(p));
					}
				}, u = (r.start && r.start(l), !1), d = function() {
					return pt(m);
				};
				function f() {
					return Ln(c, s);
				}
				var p = function(e) {
					In(s, e), f() && d();
				}, m = function() {
					var l, m, h;
					!o && dr.indexedDB && (s = {}, l = {}, a && a.abort(), a = new AbortController(), h = ((t) => {
						var n = Ze();
						try {
							i && st();
							var r = ot(e, t);
							return r = i ? r.finally(ct) : r;
						} finally {
							n && Qe();
						}
					})(m = {
						subscr: l,
						signal: a.signal,
						requery: d,
						querier: e,
						trans: null
					}), u ||= (Xt.storagemutated.subscribe(p), !0), Promise.resolve(h).then(function(e) {
						n = !0, t = e, o || m.signal.aborted || (f() || (c = l, f()) ? d() : (s = {}, pt(function() {
							return !o && r.next && r.next(e);
						})));
					}, function(e) {
						n = !1, ["DatabaseClosedError", "AbortError"].includes(e?.name) || o || pt(function() {
							o || r.error && r.error(e);
						});
					}));
				};
				return setTimeout(d, 0), l;
			});
			return r.hasValue = function() {
				return n;
			}, r.getValue = function() {
				return t;
			}, r;
		}
		var hr = ur;
		function gr(e) {
			var t = q;
			try {
				q = !0, Xt.storagemutated.fire(e), Hn(e, !0);
			} finally {
				q = t;
			}
		}
		u(hr, t(t({}, te), {
			delete: function(e) {
				return new hr(e, { addons: [] }).delete();
			},
			exists: function(e) {
				return new hr(e, { addons: [] }).open().then(function(e) {
					return e.close(), !0;
				}).catch("NoSuchDatabaseError", function() {
					return !1;
				});
			},
			getDatabaseNames: function(e) {
				try {
					return t = hr.dependencies, n = t.indexedDB, t = t.IDBKeyRange, (Dn(n) ? Promise.resolve(n.databases()).then(function(e) {
						return e.map(function(e) {
							return e.name;
						}).filter(function(e) {
							return e !== _t;
						});
					}) : En(n, t).toCollection().primaryKeys()).then(e);
				} catch {
					return I(new D.MissingAPI());
				}
				var t, n;
			},
			defineClass: function() {
				return function(e) {
					o(this, e);
				};
			},
			ignoreTransaction: function(e) {
				return A.trans ? F(A.transless || Be, e) : e();
			},
			vip: On,
			async: function(e) {
				return function() {
					try {
						var t = Gn(e.apply(this, arguments));
						return t && typeof t.then == "function" ? t : j.resolve(t);
					} catch (e) {
						return I(e);
					}
				};
			},
			spawn: function(e, t, n) {
				try {
					var r = Gn(e.apply(n, t || []));
					return r && typeof r.then == "function" ? r : j.resolve(r);
				} catch (e) {
					return I(e);
				}
			},
			currentTransaction: { get: function() {
				return A.trans || null;
			} },
			waitFor: function(e, t) {
				return e = j.resolve(typeof e == "function" ? hr.ignoreTransaction(e) : e).timeout(t || 6e4), A.trans ? A.trans.waitFor(e) : e;
			},
			Promise: j,
			debug: {
				get: function() {
					return k;
				},
				set: function(e) {
					De(e);
				}
			},
			derive: p,
			extend: o,
			props: u,
			override: _,
			Events: kt,
			on: Xt,
			liveQuery: mr,
			extendObservabilitySet: In,
			getByKeyPath: b,
			setByKeyPath: x,
			delByKeyPath: function(e, t) {
				typeof t == "string" ? x(e, t, void 0) : "length" in t && [].map.call(t, function(t) {
					x(e, t, void 0);
				});
			},
			shallowClone: S,
			deepClone: ie,
			getObjectDiff: Jn,
			cmp: z,
			asap: y,
			minKey: -1 / 0,
			addons: [],
			connections: { get: Tn.toArray },
			errnames: ge,
			dependencies: dr,
			cache: Rn,
			semVer: "4.4.5",
			version: "4.4.5".split(".").map(function(e) {
				return parseInt(e);
			}).reduce(function(e, t, n) {
				return e + t / 10 ** (2 * n);
			})
		})), hr.maxKey = nn(hr.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Xt(Jt, function(e) {
			q ||= (e = new CustomEvent(Yt, { detail: e }), q = !0, dispatchEvent(e), !1);
		}), addEventListener(Yt, function(e) {
			e = e.detail, q || gr(e);
		}));
		var _r, q = !1, vr = function() {};
		return typeof BroadcastChannel < "u" && ((vr = function() {
			(_r = new BroadcastChannel(Yt)).onmessage = function(e) {
				return e.data && gr(e.data);
			};
		})(), typeof _r.unref == "function" && _r.unref(), Xt(Jt, function(e) {
			q || _r.postMessage(e);
		})), typeof addEventListener < "u" && (addEventListener("pagehide", function(e) {
			if (!ur.disableBfCache && e.persisted) {
				k && console.debug("Dexie: handling persisted pagehide"), _r?.close();
				for (var t = 0, n = Tn.toArray(); t < n.length; t++) n[t].close({ disableAutoOpen: !1 });
			}
		}), addEventListener("pageshow", function(e) {
			!ur.disableBfCache && e.persisted && (k && console.debug("Dexie: handling persisted pageshow"), vr(), gr({ all: new G(-1 / 0, [[]]) }));
		})), j.rejectionMapper = function(e, t) {
			return !e || e instanceof fe || e instanceof TypeError || e instanceof SyntaxError || !e.name || !ve[e.name] ? e : (t = new ve[e.name](t || e.message, e), "stack" in e && f(t, "stack", { get: function() {
				return this.inner.stack;
			} }), t);
		}, De(k), t(ur, Object.freeze({
			__proto__: null,
			DEFAULT_MAX_CONNECTIONS: 1e3,
			Dexie: ur,
			Entity: xt,
			PropModification: Tt,
			RangeSet: G,
			add: function(e) {
				return new Tt({ add: e });
			},
			cmp: z,
			default: ur,
			liveQuery: mr,
			mergeRanges: jn,
			rangesOverlap: Mn,
			remove: function(e) {
				return new Tt({ remove: e });
			},
			replacePrefix: function(e, t) {
				return new Tt({ replacePrefix: [e, t] });
			}
		}), { default: ur }), ur;
	});
})))(), 1), us = Symbol.for("Dexie"), ds = globalThis[us] || (globalThis[us] = ls.default);
if (ls.default.semVer !== ds.semVer) throw Error(`Two different versions of Dexie loaded in the same app: ${ls.default.semVer} and ${ds.semVer}`);
var { liveQuery: fs, mergeRanges: ps, rangesOverlap: ms, RangeSet: hs, cmp: gs, Entity: _s, PropModification: vs, replacePrefix: ys, add: bs, remove: xs, DexieYProvider: Ss } = ds, Cs = new cs(new class extends ds {
	lists;
	entries;
	reviewNodes;
	drafts;
	settings;
	captureDrafts;
	constructor(e = "english-review") {
		super(e), this.version(1).stores({
			lists: "&id,&createdDate,listNumber,createdAt",
			entries: "&id,listId,english,[listId+english],updatedAt",
			reviewNodes: "&id,listId,dueDate,completedAt,[dueDate+completedAt],[listId+sequence]",
			drafts: "&id,updatedAt",
			settings: "&key"
		}), this.version(2).stores({ entries: "&id,listId,english,normalizedEnglish,[listId+normalizedEnglish],updatedAt" }).upgrade((e) => e.table("entries").toCollection().modify((e) => {
			e.normalizedEnglish = e.english.trim().toLocaleLowerCase("en-US");
		})), this.version(3).stores({ captureDrafts: "&id,normalizedText,status,capturedAt" });
	}
}()), ws = class {
	repository;
	readSettings;
	enrich;
	dailyListWriter;
	constructor(e, t, n, r) {
		this.repository = e, this.readSettings = t, this.enrich = n, this.dailyListWriter = r;
	}
	async preview(e) {
		let t = _a(e);
		if (!t.ok) return t;
		let n = await this.readSettings();
		return n.enabled ? n.apiKey.trim() ? {
			ok: !0,
			draft: await this.enrich(t.text, n),
			duplicate: await this.repository.findDuplicate(t.normalizedText)
		} : {
			ok: !1,
			code: "AI_KEY_MISSING"
		} : {
			ok: !1,
			code: "AI_DISABLED"
		};
	}
	async save(e, t) {
		if (e.status !== "ready") return {
			ok: !1,
			code: "INVALID_DRAFT"
		};
		let n = await this.repository.findDuplicate(e.normalizedText);
		return n && !t ? {
			ok: !1,
			code: "DUPLICATE",
			duplicate: n
		} : this.dailyListWriter.saveCapture(e, t);
	}
}, Ts = "wordJournalAi", Es = {
	baseUrl: "https://api.openai.com/v1",
	model: "gpt-4.1-mini",
	apiKey: "",
	enabled: !0
};
function Ds() {
	return chrome.storage.local;
}
async function Os(e = Ds()) {
	let t = (await e.get(Ts))[Ts];
	return {
		...Es,
		...t
	};
}
//#endregion
//#region src/extension/context-menu.ts
async function ks(e, t, n = chrome.tabs, r = chrome.scripting) {
	let i = {
		type: "SHOW_CAPTURE",
		text: t
	};
	try {
		await n.sendMessage(e, i);
	} catch {
		await r.executeScript({
			target: { tabId: e },
			files: ["extension/content.js"]
		}), await n.sendMessage(e, i);
	}
}
//#endregion
//#region src/capture/capture-error.ts
function As(e, t) {
	let n = e && typeof e == "object" ? e : {}, r = typeof n.status == "number" ? n.status : void 0, i = "UNEXPECTED", a = "服务暂时异常，请稍后重试";
	e instanceof TypeError ? (i = "NETWORK", a = "网络连接失败，请检查连接后重试") : r === 401 || r === 403 ? (i = "AUTH_FAILED", a = "AI 服务认证失败，请检查 API Key") : r === 429 ? (i = "RATE_LIMITED", a = "请求过于频繁，请稍后重试") : r === 404 || n.code === "MODEL_UNAVAILABLE" ? (i = "MODEL_UNAVAILABLE", a = "当前模型不可用，请检查模型名称") : n.code === "INVALID_CONTENT" || n.code === "NOT_ENGLISH" || n.code === "TOO_MANY_WORDS" ? (i = "INVALID_CONTENT", a = "内容格式无法识别，请重新选择单词或短语") : n.code === "INVALID_RESPONSE" ? (i = "INVALID_RESPONSE", a = "AI 返回内容无法解析，请重试") : (t === "save" || n.name === "DatabaseClosedError" || n.name === "ConstraintError") && (i = "STORAGE_FAILED", a = "本地保存失败，请重试");
	let o = [
		`错误类型: ${i}`,
		`阶段: ${t}`,
		r === void 0 ? "" : `状态码: ${r}`,
		`说明: ${a}`
	].filter(Boolean).join("\n");
	return {
		code: i,
		message: a,
		stage: t,
		...r === void 0 ? {} : { status: r },
		detail: o
	};
}
//#endregion
//#region src/db/legacy-capture-migration.ts
async function js(e, t) {
	try {
		return await e.migrateReadyCaptures(t);
	} catch (e) {
		return {
			migrated: 0,
			error: As(e, "migration")
		};
	}
}
//#endregion
//#region src/capture/daily-list-service.ts
var Ms = class {
	repository;
	getLocalDate;
	constructor(e, t) {
		this.repository = e, this.getLocalDate = t;
	}
	async saveCapture(e, t) {
		return e.status === "ready" ? this.saveEntries([os(e)], t) : {
			ok: !1,
			code: "INVALID_DRAFT"
		};
	}
	async saveEntries(e, t) {
		let n = await this.repository.appendToDailyList(this.getLocalDate(), e, t);
		if (!n.ok) {
			let e = n.duplicates[0];
			return e ? {
				ok: !1,
				code: "DUPLICATE",
				duplicate: {
					listId: e.listId,
					listNumber: e.listNumber
				}
			} : {
				ok: !1,
				code: "INVALID_DRAFT"
			};
		}
		return {
			ok: !0,
			listId: n.list.id,
			listNumber: n.list.listNumber
		};
	}
};
//#endregion
//#region src/extension/background.ts
js(Cs, Io(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
var Ns = new ws(Cs, Os, Da, new Ms(Cs, () => Io(/* @__PURE__ */ new Date(), "yyyy-MM-dd")));
async function Ps(e = "/") {
	let t = chrome.runtime.getURL("index.html"), [n] = await chrome.tabs.query({ url: `${t}*` });
	if (n?.id) {
		await chrome.tabs.update(n.id, {
			active: !0,
			url: `${t}#${e}`
		}), n.windowId && await chrome.windows.update(n.windowId, { focused: !0 });
		return;
	}
	await chrome.tabs.create({ url: `${t}#${e}` });
}
async function Fs(e) {
	return e.type === "PREVIEW_CAPTURE" ? Ns.preview(e.text) : e.type === "SAVE_CAPTURE" ? Ns.save(e.draft, e.allowDuplicate) : (await Ps(e.route), { ok: !0 });
}
chrome.runtime.onMessage.addListener((e, t, n) => (Fs(e).then(n).catch((t) => {
	n({
		ok: !1,
		error: As(t, e.type === "SAVE_CAPTURE" ? "save" : "enrich")
	});
}), !0)), chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "word-journal-capture",
		title: "收录到 Word Journal",
		contexts: ["selection"]
	});
}), chrome.contextMenus.onClicked.addListener((e, t) => {
	e.menuItemId === "word-journal-capture" && e.selectionText && t?.id && ks(t.id, e.selectionText).catch(() => void 0);
}), chrome.action.onClicked.addListener(() => {
	Ps("/");
});
//#endregion
