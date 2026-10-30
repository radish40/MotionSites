(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const u of a)if(u.type==="childList")for(const d of u.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function n(a){const u={};return a.integrity&&(u.integrity=a.integrity),a.referrerPolicy&&(u.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?u.credentials="include":a.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function s(a){if(a.ep)return;a.ep=!0;const u=n(a);fetch(a.href,u)}})();function x_(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var oc={exports:{}},Eo={},ac={exports:{}},pt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ph;function S_(){if(Ph)return pt;Ph=1;var o=Symbol.for("react.element"),e=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),u=Symbol.for("react.provider"),d=Symbol.for("react.context"),c=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),v=Symbol.iterator;function S(L){return L===null||typeof L!="object"?null:(L=v&&L[v]||L["@@iterator"],typeof L=="function"?L:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,T={};function x(L,H,W){this.props=L,this.context=H,this.refs=T,this.updater=W||M}x.prototype.isReactComponent={},x.prototype.setState=function(L,H){if(typeof L!="object"&&typeof L!="function"&&L!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,L,H,"setState")},x.prototype.forceUpdate=function(L){this.updater.enqueueForceUpdate(this,L,"forceUpdate")};function _(){}_.prototype=x.prototype;function N(L,H,W){this.props=L,this.context=H,this.refs=T,this.updater=W||M}var P=N.prototype=new _;P.constructor=N,w(P,x.prototype),P.isPureReactComponent=!0;var U=Array.isArray,Y=Object.prototype.hasOwnProperty,O={current:null},I={key:!0,ref:!0,__self:!0,__source:!0};function ce(L,H,W){var se,fe={},Me=null,de=null;if(H!=null)for(se in H.ref!==void 0&&(de=H.ref),H.key!==void 0&&(Me=""+H.key),H)Y.call(H,se)&&!I.hasOwnProperty(se)&&(fe[se]=H[se]);var Se=arguments.length-2;if(Se===1)fe.children=W;else if(1<Se){for(var Ee=Array(Se),Ne=0;Ne<Se;Ne++)Ee[Ne]=arguments[Ne+2];fe.children=Ee}if(L&&L.defaultProps)for(se in Se=L.defaultProps,Se)fe[se]===void 0&&(fe[se]=Se[se]);return{$$typeof:o,type:L,key:Me,ref:de,props:fe,_owner:O.current}}function R(L,H){return{$$typeof:o,type:L.type,key:H,ref:L.ref,props:L.props,_owner:L._owner}}function b(L){return typeof L=="object"&&L!==null&&L.$$typeof===o}function oe(L){var H={"=":"=0",":":"=2"};return"$"+L.replace(/[=:]/g,function(W){return H[W]})}var le=/\/+/g;function _e(L,H){return typeof L=="object"&&L!==null&&L.key!=null?oe(""+L.key):H.toString(36)}function k(L,H,W,se,fe){var Me=typeof L;(Me==="undefined"||Me==="boolean")&&(L=null);var de=!1;if(L===null)de=!0;else switch(Me){case"string":case"number":de=!0;break;case"object":switch(L.$$typeof){case o:case e:de=!0}}if(de)return de=L,fe=fe(de),L=se===""?"."+_e(de,0):se,U(fe)?(W="",L!=null&&(W=L.replace(le,"$&/")+"/"),k(fe,H,W,"",function(Ne){return Ne})):fe!=null&&(b(fe)&&(fe=R(fe,W+(!fe.key||de&&de.key===fe.key?"":(""+fe.key).replace(le,"$&/")+"/")+L)),H.push(fe)),1;if(de=0,se=se===""?".":se+":",U(L))for(var Se=0;Se<L.length;Se++){Me=L[Se];var Ee=se+_e(Me,Se);de+=k(Me,H,W,Ee,fe)}else if(Ee=S(L),typeof Ee=="function")for(L=Ee.call(L),Se=0;!(Me=L.next()).done;)Me=Me.value,Ee=se+_e(Me,Se++),de+=k(Me,H,W,Ee,fe);else if(Me==="object")throw H=String(L),Error("Objects are not valid as a React child (found: "+(H==="[object Object]"?"object with keys {"+Object.keys(L).join(", ")+"}":H)+"). If you meant to render a collection of children, use an array instead.");return de}function Q(L,H,W){if(L==null)return L;var se=[],fe=0;return k(L,se,"","",function(Me){return H.call(W,Me,fe++)}),se}function re(L){if(L._status===-1){var H=L._result;H=H(),H.then(function(W){(L._status===0||L._status===-1)&&(L._status=1,L._result=W)},function(W){(L._status===0||L._status===-1)&&(L._status=2,L._result=W)}),L._status===-1&&(L._status=0,L._result=H)}if(L._status===1)return L._result.default;throw L._result}var ae={current:null},G={transition:null},K={ReactCurrentDispatcher:ae,ReactCurrentBatchConfig:G,ReactCurrentOwner:O};function V(){throw Error("act(...) is not supported in production builds of React.")}return pt.Children={map:Q,forEach:function(L,H,W){Q(L,function(){H.apply(this,arguments)},W)},count:function(L){var H=0;return Q(L,function(){H++}),H},toArray:function(L){return Q(L,function(H){return H})||[]},only:function(L){if(!b(L))throw Error("React.Children.only expected to receive a single React element child.");return L}},pt.Component=x,pt.Fragment=n,pt.Profiler=a,pt.PureComponent=N,pt.StrictMode=s,pt.Suspense=h,pt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=K,pt.act=V,pt.cloneElement=function(L,H,W){if(L==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+L+".");var se=w({},L.props),fe=L.key,Me=L.ref,de=L._owner;if(H!=null){if(H.ref!==void 0&&(Me=H.ref,de=O.current),H.key!==void 0&&(fe=""+H.key),L.type&&L.type.defaultProps)var Se=L.type.defaultProps;for(Ee in H)Y.call(H,Ee)&&!I.hasOwnProperty(Ee)&&(se[Ee]=H[Ee]===void 0&&Se!==void 0?Se[Ee]:H[Ee])}var Ee=arguments.length-2;if(Ee===1)se.children=W;else if(1<Ee){Se=Array(Ee);for(var Ne=0;Ne<Ee;Ne++)Se[Ne]=arguments[Ne+2];se.children=Se}return{$$typeof:o,type:L.type,key:fe,ref:Me,props:se,_owner:de}},pt.createContext=function(L){return L={$$typeof:d,_currentValue:L,_currentValue2:L,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},L.Provider={$$typeof:u,_context:L},L.Consumer=L},pt.createElement=ce,pt.createFactory=function(L){var H=ce.bind(null,L);return H.type=L,H},pt.createRef=function(){return{current:null}},pt.forwardRef=function(L){return{$$typeof:c,render:L}},pt.isValidElement=b,pt.lazy=function(L){return{$$typeof:g,_payload:{_status:-1,_result:L},_init:re}},pt.memo=function(L,H){return{$$typeof:m,type:L,compare:H===void 0?null:H}},pt.startTransition=function(L){var H=G.transition;G.transition={};try{L()}finally{G.transition=H}},pt.unstable_act=V,pt.useCallback=function(L,H){return ae.current.useCallback(L,H)},pt.useContext=function(L){return ae.current.useContext(L)},pt.useDebugValue=function(){},pt.useDeferredValue=function(L){return ae.current.useDeferredValue(L)},pt.useEffect=function(L,H){return ae.current.useEffect(L,H)},pt.useId=function(){return ae.current.useId()},pt.useImperativeHandle=function(L,H,W){return ae.current.useImperativeHandle(L,H,W)},pt.useInsertionEffect=function(L,H){return ae.current.useInsertionEffect(L,H)},pt.useLayoutEffect=function(L,H){return ae.current.useLayoutEffect(L,H)},pt.useMemo=function(L,H){return ae.current.useMemo(L,H)},pt.useReducer=function(L,H,W){return ae.current.useReducer(L,H,W)},pt.useRef=function(L){return ae.current.useRef(L)},pt.useState=function(L){return ae.current.useState(L)},pt.useSyncExternalStore=function(L,H,W){return ae.current.useSyncExternalStore(L,H,W)},pt.useTransition=function(){return ae.current.useTransition()},pt.version="18.3.1",pt}var Lh;function Qc(){return Lh||(Lh=1,ac.exports=S_()),ac.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bh;function y_(){if(bh)return Eo;bh=1;var o=Qc(),e=Symbol.for("react.element"),n=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,a=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function d(c,h,m){var g,v={},S=null,M=null;m!==void 0&&(S=""+m),h.key!==void 0&&(S=""+h.key),h.ref!==void 0&&(M=h.ref);for(g in h)s.call(h,g)&&!u.hasOwnProperty(g)&&(v[g]=h[g]);if(c&&c.defaultProps)for(g in h=c.defaultProps,h)v[g]===void 0&&(v[g]=h[g]);return{$$typeof:e,type:c,key:S,ref:M,props:v,_owner:a.current}}return Eo.Fragment=n,Eo.jsx=d,Eo.jsxs=d,Eo}var Dh;function M_(){return Dh||(Dh=1,oc.exports=y_()),oc.exports}var dr=M_(),Va={},lc={exports:{}},Cn={},uc={exports:{}},cc={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Uh;function E_(){return Uh||(Uh=1,(function(o){function e(G,K){var V=G.length;G.push(K);e:for(;0<V;){var L=V-1>>>1,H=G[L];if(0<a(H,K))G[L]=K,G[V]=H,V=L;else break e}}function n(G){return G.length===0?null:G[0]}function s(G){if(G.length===0)return null;var K=G[0],V=G.pop();if(V!==K){G[0]=V;e:for(var L=0,H=G.length,W=H>>>1;L<W;){var se=2*(L+1)-1,fe=G[se],Me=se+1,de=G[Me];if(0>a(fe,V))Me<H&&0>a(de,fe)?(G[L]=de,G[Me]=V,L=Me):(G[L]=fe,G[se]=V,L=se);else if(Me<H&&0>a(de,V))G[L]=de,G[Me]=V,L=Me;else break e}}return K}function a(G,K){var V=G.sortIndex-K.sortIndex;return V!==0?V:G.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var u=performance;o.unstable_now=function(){return u.now()}}else{var d=Date,c=d.now();o.unstable_now=function(){return d.now()-c}}var h=[],m=[],g=1,v=null,S=3,M=!1,w=!1,T=!1,x=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,N=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function P(G){for(var K=n(m);K!==null;){if(K.callback===null)s(m);else if(K.startTime<=G)s(m),K.sortIndex=K.expirationTime,e(h,K);else break;K=n(m)}}function U(G){if(T=!1,P(G),!w)if(n(h)!==null)w=!0,re(Y);else{var K=n(m);K!==null&&ae(U,K.startTime-G)}}function Y(G,K){w=!1,T&&(T=!1,_(ce),ce=-1),M=!0;var V=S;try{for(P(K),v=n(h);v!==null&&(!(v.expirationTime>K)||G&&!oe());){var L=v.callback;if(typeof L=="function"){v.callback=null,S=v.priorityLevel;var H=L(v.expirationTime<=K);K=o.unstable_now(),typeof H=="function"?v.callback=H:v===n(h)&&s(h),P(K)}else s(h);v=n(h)}if(v!==null)var W=!0;else{var se=n(m);se!==null&&ae(U,se.startTime-K),W=!1}return W}finally{v=null,S=V,M=!1}}var O=!1,I=null,ce=-1,R=5,b=-1;function oe(){return!(o.unstable_now()-b<R)}function le(){if(I!==null){var G=o.unstable_now();b=G;var K=!0;try{K=I(!0,G)}finally{K?_e():(O=!1,I=null)}}else O=!1}var _e;if(typeof N=="function")_e=function(){N(le)};else if(typeof MessageChannel<"u"){var k=new MessageChannel,Q=k.port2;k.port1.onmessage=le,_e=function(){Q.postMessage(null)}}else _e=function(){x(le,0)};function re(G){I=G,O||(O=!0,_e())}function ae(G,K){ce=x(function(){G(o.unstable_now())},K)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(G){G.callback=null},o.unstable_continueExecution=function(){w||M||(w=!0,re(Y))},o.unstable_forceFrameRate=function(G){0>G||125<G?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<G?Math.floor(1e3/G):5},o.unstable_getCurrentPriorityLevel=function(){return S},o.unstable_getFirstCallbackNode=function(){return n(h)},o.unstable_next=function(G){switch(S){case 1:case 2:case 3:var K=3;break;default:K=S}var V=S;S=K;try{return G()}finally{S=V}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function(G,K){switch(G){case 1:case 2:case 3:case 4:case 5:break;default:G=3}var V=S;S=G;try{return K()}finally{S=V}},o.unstable_scheduleCallback=function(G,K,V){var L=o.unstable_now();switch(typeof V=="object"&&V!==null?(V=V.delay,V=typeof V=="number"&&0<V?L+V:L):V=L,G){case 1:var H=-1;break;case 2:H=250;break;case 5:H=1073741823;break;case 4:H=1e4;break;default:H=5e3}return H=V+H,G={id:g++,callback:K,priorityLevel:G,startTime:V,expirationTime:H,sortIndex:-1},V>L?(G.sortIndex=V,e(m,G),n(h)===null&&G===n(m)&&(T?(_(ce),ce=-1):T=!0,ae(U,V-L))):(G.sortIndex=H,e(h,G),w||M||(w=!0,re(Y))),G},o.unstable_shouldYield=oe,o.unstable_wrapCallback=function(G){var K=S;return function(){var V=S;S=K;try{return G.apply(this,arguments)}finally{S=V}}}})(cc)),cc}var Nh;function T_(){return Nh||(Nh=1,uc.exports=E_()),uc.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ih;function w_(){if(Ih)return Cn;Ih=1;var o=Qc(),e=T_();function n(t){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)i+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+t+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,a={};function u(t,i){d(t,i),d(t+"Capture",i)}function d(t,i){for(a[t]=i,t=0;t<i.length;t++)s.add(i[t])}var c=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},v={};function S(t){return h.call(v,t)?!0:h.call(g,t)?!1:m.test(t)?v[t]=!0:(g[t]=!0,!1)}function M(t,i,r,l){if(r!==null&&r.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return l?!1:r!==null?!r.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function w(t,i,r,l){if(i===null||typeof i>"u"||M(t,i,r,l))return!0;if(l)return!1;if(r!==null)switch(r.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function T(t,i,r,l,f,p,y){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=l,this.attributeNamespace=f,this.mustUseProperty=r,this.propertyName=t,this.type=i,this.sanitizeURL=p,this.removeEmptyString=y}var x={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){x[t]=new T(t,0,!1,t,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var i=t[0];x[i]=new T(i,1,!1,t[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(t){x[t]=new T(t,2,!1,t.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){x[t]=new T(t,2,!1,t,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){x[t]=new T(t,3,!1,t.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(t){x[t]=new T(t,3,!0,t,null,!1,!1)}),["capture","download"].forEach(function(t){x[t]=new T(t,4,!1,t,null,!1,!1)}),["cols","rows","size","span"].forEach(function(t){x[t]=new T(t,6,!1,t,null,!1,!1)}),["rowSpan","start"].forEach(function(t){x[t]=new T(t,5,!1,t.toLowerCase(),null,!1,!1)});var _=/[\-:]([a-z])/g;function N(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var i=t.replace(_,N);x[i]=new T(i,1,!1,t,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var i=t.replace(_,N);x[i]=new T(i,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(t){var i=t.replace(_,N);x[i]=new T(i,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(t){x[t]=new T(t,1,!1,t.toLowerCase(),null,!1,!1)}),x.xlinkHref=new T("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(t){x[t]=new T(t,1,!1,t.toLowerCase(),null,!0,!0)});function P(t,i,r,l){var f=x.hasOwnProperty(i)?x[i]:null;(f!==null?f.type!==0:l||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(w(i,r,f,l)&&(r=null),l||f===null?S(i)&&(r===null?t.removeAttribute(i):t.setAttribute(i,""+r)):f.mustUseProperty?t[f.propertyName]=r===null?f.type===3?!1:"":r:(i=f.attributeName,l=f.attributeNamespace,r===null?t.removeAttribute(i):(f=f.type,r=f===3||f===4&&r===!0?"":""+r,l?t.setAttributeNS(l,i,r):t.setAttribute(i,r))))}var U=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Y=Symbol.for("react.element"),O=Symbol.for("react.portal"),I=Symbol.for("react.fragment"),ce=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),b=Symbol.for("react.provider"),oe=Symbol.for("react.context"),le=Symbol.for("react.forward_ref"),_e=Symbol.for("react.suspense"),k=Symbol.for("react.suspense_list"),Q=Symbol.for("react.memo"),re=Symbol.for("react.lazy"),ae=Symbol.for("react.offscreen"),G=Symbol.iterator;function K(t){return t===null||typeof t!="object"?null:(t=G&&t[G]||t["@@iterator"],typeof t=="function"?t:null)}var V=Object.assign,L;function H(t){if(L===void 0)try{throw Error()}catch(r){var i=r.stack.trim().match(/\n( *(at )?)/);L=i&&i[1]||""}return`
`+L+t}var W=!1;function se(t,i){if(!t||W)return"";W=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(J){var l=J}Reflect.construct(t,[],i)}else{try{i.call()}catch(J){l=J}t.call(i.prototype)}else{try{throw Error()}catch(J){l=J}t()}}catch(J){if(J&&l&&typeof J.stack=="string"){for(var f=J.stack.split(`
`),p=l.stack.split(`
`),y=f.length-1,D=p.length-1;1<=y&&0<=D&&f[y]!==p[D];)D--;for(;1<=y&&0<=D;y--,D--)if(f[y]!==p[D]){if(y!==1||D!==1)do if(y--,D--,0>D||f[y]!==p[D]){var F=`
`+f[y].replace(" at new "," at ");return t.displayName&&F.includes("<anonymous>")&&(F=F.replace("<anonymous>",t.displayName)),F}while(1<=y&&0<=D);break}}}finally{W=!1,Error.prepareStackTrace=r}return(t=t?t.displayName||t.name:"")?H(t):""}function fe(t){switch(t.tag){case 5:return H(t.type);case 16:return H("Lazy");case 13:return H("Suspense");case 19:return H("SuspenseList");case 0:case 2:case 15:return t=se(t.type,!1),t;case 11:return t=se(t.type.render,!1),t;case 1:return t=se(t.type,!0),t;default:return""}}function Me(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case I:return"Fragment";case O:return"Portal";case R:return"Profiler";case ce:return"StrictMode";case _e:return"Suspense";case k:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case oe:return(t.displayName||"Context")+".Consumer";case b:return(t._context.displayName||"Context")+".Provider";case le:var i=t.render;return t=t.displayName,t||(t=i.displayName||i.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Q:return i=t.displayName||null,i!==null?i:Me(t.type)||"Memo";case re:i=t._payload,t=t._init;try{return Me(t(i))}catch{}}return null}function de(t){var i=t.type;switch(t.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=i.render,t=t.displayName||t.name||"",i.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Me(i);case 8:return i===ce?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Se(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Ee(t){var i=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Ne(t){var i=Ee(t)?"checked":"value",r=Object.getOwnPropertyDescriptor(t.constructor.prototype,i),l=""+t[i];if(!t.hasOwnProperty(i)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var f=r.get,p=r.set;return Object.defineProperty(t,i,{configurable:!0,get:function(){return f.call(this)},set:function(y){l=""+y,p.call(this,y)}}),Object.defineProperty(t,i,{enumerable:r.enumerable}),{getValue:function(){return l},setValue:function(y){l=""+y},stopTracking:function(){t._valueTracker=null,delete t[i]}}}}function ct(t){t._valueTracker||(t._valueTracker=Ne(t))}function Z(t){if(!t)return!1;var i=t._valueTracker;if(!i)return!0;var r=i.getValue(),l="";return t&&(l=Ee(t)?t.checked?"true":"false":t.value),t=l,t!==r?(i.setValue(t),!0):!1}function Nt(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Ve(t,i){var r=i.checked;return V({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??t._wrapperState.initialChecked})}function $e(t,i){var r=i.defaultValue==null?"":i.defaultValue,l=i.checked!=null?i.checked:i.defaultChecked;r=Se(i.value!=null?i.value:r),t._wrapperState={initialChecked:l,initialValue:r,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function ze(t,i){i=i.checked,i!=null&&P(t,"checked",i,!1)}function ht(t,i){ze(t,i);var r=Se(i.value),l=i.type;if(r!=null)l==="number"?(r===0&&t.value===""||t.value!=r)&&(t.value=""+r):t.value!==""+r&&(t.value=""+r);else if(l==="submit"||l==="reset"){t.removeAttribute("value");return}i.hasOwnProperty("value")?C(t,i.type,r):i.hasOwnProperty("defaultValue")&&C(t,i.type,Se(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(t.defaultChecked=!!i.defaultChecked)}function rt(t,i,r){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var l=i.type;if(!(l!=="submit"&&l!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+t._wrapperState.initialValue,r||i===t.value||(t.value=i),t.defaultValue=i}r=t.name,r!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,r!==""&&(t.name=r)}function C(t,i,r){(i!=="number"||Nt(t.ownerDocument)!==t)&&(r==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+r&&(t.defaultValue=""+r))}var E=Array.isArray;function $(t,i,r,l){if(t=t.options,i){i={};for(var f=0;f<r.length;f++)i["$"+r[f]]=!0;for(r=0;r<t.length;r++)f=i.hasOwnProperty("$"+t[r].value),t[r].selected!==f&&(t[r].selected=f),f&&l&&(t[r].defaultSelected=!0)}else{for(r=""+Se(r),i=null,f=0;f<t.length;f++){if(t[f].value===r){t[f].selected=!0,l&&(t[f].defaultSelected=!0);return}i!==null||t[f].disabled||(i=t[f])}i!==null&&(i.selected=!0)}}function ge(t,i){if(i.dangerouslySetInnerHTML!=null)throw Error(n(91));return V({},i,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function me(t,i){var r=i.value;if(r==null){if(r=i.children,i=i.defaultValue,r!=null){if(i!=null)throw Error(n(92));if(E(r)){if(1<r.length)throw Error(n(93));r=r[0]}i=r}i==null&&(i=""),r=i}t._wrapperState={initialValue:Se(r)}}function xe(t,i){var r=Se(i.value),l=Se(i.defaultValue);r!=null&&(r=""+r,r!==t.value&&(t.value=r),i.defaultValue==null&&t.defaultValue!==r&&(t.defaultValue=r)),l!=null&&(t.defaultValue=""+l)}function Oe(t){var i=t.textContent;i===t._wrapperState.initialValue&&i!==""&&i!==null&&(t.value=i)}function Re(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function De(t,i){return t==null||t==="http://www.w3.org/1999/xhtml"?Re(i):t==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var He,We=(function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,r,l,f){MSApp.execUnsafeLocalFunction(function(){return t(i,r,l,f)})}:t})(function(t,i){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=i;else{for(He=He||document.createElement("div"),He.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=He.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;i.firstChild;)t.appendChild(i.firstChild)}});function ue(t,i){if(i){var r=t.firstChild;if(r&&r===t.lastChild&&r.nodeType===3){r.nodeValue=i;return}}t.textContent=i}var Qe={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},tt=["Webkit","ms","Moz","O"];Object.keys(Qe).forEach(function(t){tt.forEach(function(i){i=i+t.charAt(0).toUpperCase()+t.substring(1),Qe[i]=Qe[t]})});function Ye(t,i,r){return i==null||typeof i=="boolean"||i===""?"":r||typeof i!="number"||i===0||Qe.hasOwnProperty(t)&&Qe[t]?(""+i).trim():i+"px"}function Ge(t,i){t=t.style;for(var r in i)if(i.hasOwnProperty(r)){var l=r.indexOf("--")===0,f=Ye(r,i[r],l);r==="float"&&(r="cssFloat"),l?t.setProperty(r,f):t[r]=f}}var Pe=V({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ze(t,i){if(i){if(Pe[t]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(n(137,t));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(n(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(n(61))}if(i.style!=null&&typeof i.style!="object")throw Error(n(62))}}function st(t,i){if(t.indexOf("-")===-1)return typeof i.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vt=null;function lt(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Te=null,B=null,we=null;function Ce(t){if(t=ao(t)){if(typeof Te!="function")throw Error(n(280));var i=t.stateNode;i&&(i=ra(i),Te(t.stateNode,t.type,i))}}function et(t){B?we?we.push(t):we=[t]:B=t}function qe(){if(B){var t=B,i=we;if(we=B=null,Ce(t),i)for(t=0;t<i.length;t++)Ce(i[t])}}function Mt(t,i){return t(i)}function Et(){}var Ot=!1;function Kt(t,i,r){if(Ot)return t(i,r);Ot=!0;try{return Mt(t,i,r)}finally{Ot=!1,(B!==null||we!==null)&&(Et(),qe())}}function St(t,i){var r=t.stateNode;if(r===null)return null;var l=ra(r);if(l===null)return null;r=l[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(t=t.type,l=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!l;break e;default:t=!1}if(t)return null;if(r&&typeof r!="function")throw Error(n(231,i,typeof r));return r}var Wt=!1;if(c)try{var on={};Object.defineProperty(on,"passive",{get:function(){Wt=!0}}),window.addEventListener("test",on,on),window.removeEventListener("test",on,on)}catch{Wt=!1}function Oo(t,i,r,l,f,p,y,D,F){var J=Array.prototype.slice.call(arguments,3);try{i.apply(r,J)}catch(pe){this.onError(pe)}}var xr=!1,_i=null,Sr=!1,ki=null,Bo={onError:function(t){xr=!0,_i=t}};function zo(t,i,r,l,f,p,y,D,F){xr=!1,_i=null,Oo.apply(Bo,arguments)}function Cl(t,i,r,l,f,p,y,D,F){if(zo.apply(this,arguments),xr){if(xr){var J=_i;xr=!1,_i=null}else throw Error(n(198));Sr||(Sr=!0,ki=J)}}function vi(t){var i=t,r=t;if(t.alternate)for(;i.return;)i=i.return;else{t=i;do i=t,(i.flags&4098)!==0&&(r=i.return),t=i.return;while(t)}return i.tag===3?r:null}function ko(t){if(t.tag===13){var i=t.memoizedState;if(i===null&&(t=t.alternate,t!==null&&(i=t.memoizedState)),i!==null)return i.dehydrated}return null}function A(t){if(vi(t)!==t)throw Error(n(188))}function q(t){var i=t.alternate;if(!i){if(i=vi(t),i===null)throw Error(n(188));return i!==t?null:t}for(var r=t,l=i;;){var f=r.return;if(f===null)break;var p=f.alternate;if(p===null){if(l=f.return,l!==null){r=l;continue}break}if(f.child===p.child){for(p=f.child;p;){if(p===r)return A(f),t;if(p===l)return A(f),i;p=p.sibling}throw Error(n(188))}if(r.return!==l.return)r=f,l=p;else{for(var y=!1,D=f.child;D;){if(D===r){y=!0,r=f,l=p;break}if(D===l){y=!0,l=f,r=p;break}D=D.sibling}if(!y){for(D=p.child;D;){if(D===r){y=!0,r=p,l=f;break}if(D===l){y=!0,l=p,r=f;break}D=D.sibling}if(!y)throw Error(n(189))}}if(r.alternate!==l)throw Error(n(190))}if(r.tag!==3)throw Error(n(188));return r.stateNode.current===r?t:i}function ne(t){return t=q(t),t!==null?ie(t):null}function ie(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var i=ie(t);if(i!==null)return i;t=t.sibling}return null}var ee=e.unstable_scheduleCallback,Le=e.unstable_cancelCallback,Xe=e.unstable_shouldYield,Je=e.unstable_requestPaint,Ue=e.unstable_now,ut=e.unstable_getCurrentPriorityLevel,it=e.unstable_ImmediatePriority,ot=e.unstable_UserBlockingPriority,At=e.unstable_NormalPriority,hn=e.unstable_LowPriority,kt=e.unstable_IdlePriority,yn=null,gt=null;function ft(t){if(gt&&typeof gt.onCommitFiberRoot=="function")try{gt.onCommitFiberRoot(yn,t,void 0,(t.current.flags&128)===128)}catch{}}var pn=Math.clz32?Math.clz32:Ho,Dt=Math.log,xi=Math.LN2;function Ho(t){return t>>>=0,t===0?32:31-(Dt(t)/xi|0)|0}var ui=64,Hi=4194304;function Bt(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function zn(t,i){var r=t.pendingLanes;if(r===0)return 0;var l=0,f=t.suspendedLanes,p=t.pingedLanes,y=r&268435455;if(y!==0){var D=y&~f;D!==0?l=Bt(D):(p&=y,p!==0&&(l=Bt(p)))}else y=r&~f,y!==0?l=Bt(y):p!==0&&(l=Bt(p));if(l===0)return 0;if(i!==0&&i!==l&&(i&f)===0&&(f=l&-l,p=i&-i,f>=p||f===16&&(p&4194240)!==0))return i;if((l&4)!==0&&(l|=r&16),i=t.entangledLanes,i!==0)for(t=t.entanglements,i&=l;0<i;)r=31-pn(i),f=1<<r,l|=t[r],i&=~f;return l}function Vs(t,i){switch(t){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Mn(t,i){for(var r=t.suspendedLanes,l=t.pingedLanes,f=t.expirationTimes,p=t.pendingLanes;0<p;){var y=31-pn(p),D=1<<y,F=f[y];F===-1?((D&r)===0||(D&l)!==0)&&(f[y]=Vs(D,i)):F<=i&&(t.expiredLanes|=D),p&=~D}}function yr(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Go(){var t=ui;return ui<<=1,(ui&4194240)===0&&(ui=64),t}function Xr(t){for(var i=[],r=0;31>r;r++)i.push(t);return i}function Ws(t,i,r){t.pendingLanes|=i,i!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,i=31-pn(i),t[i]=r}function km(t,i){var r=t.pendingLanes&~i;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=i,t.mutableReadLanes&=i,t.entangledLanes&=i,i=t.entanglements;var l=t.eventTimes;for(t=t.expirationTimes;0<r;){var f=31-pn(r),p=1<<f;i[f]=0,l[f]=-1,t[f]=-1,r&=~p}}function Pl(t,i){var r=t.entangledLanes|=i;for(t=t.entanglements;r;){var l=31-pn(r),f=1<<l;f&i|t[l]&i&&(t[l]|=i),r&=~f}}var Tt=0;function af(t){return t&=-t,1<t?4<t?(t&268435455)!==0?16:536870912:4:1}var lf,Ll,uf,cf,ff,bl=!1,Vo=[],Gi=null,Vi=null,Wi=null,Xs=new Map,Ys=new Map,Xi=[],Hm="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function df(t,i){switch(t){case"focusin":case"focusout":Gi=null;break;case"dragenter":case"dragleave":Vi=null;break;case"mouseover":case"mouseout":Wi=null;break;case"pointerover":case"pointerout":Xs.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ys.delete(i.pointerId)}}function qs(t,i,r,l,f,p){return t===null||t.nativeEvent!==p?(t={blockedOn:i,domEventName:r,eventSystemFlags:l,nativeEvent:p,targetContainers:[f]},i!==null&&(i=ao(i),i!==null&&Ll(i)),t):(t.eventSystemFlags|=l,i=t.targetContainers,f!==null&&i.indexOf(f)===-1&&i.push(f),t)}function Gm(t,i,r,l,f){switch(i){case"focusin":return Gi=qs(Gi,t,i,r,l,f),!0;case"dragenter":return Vi=qs(Vi,t,i,r,l,f),!0;case"mouseover":return Wi=qs(Wi,t,i,r,l,f),!0;case"pointerover":var p=f.pointerId;return Xs.set(p,qs(Xs.get(p)||null,t,i,r,l,f)),!0;case"gotpointercapture":return p=f.pointerId,Ys.set(p,qs(Ys.get(p)||null,t,i,r,l,f)),!0}return!1}function hf(t){var i=Mr(t.target);if(i!==null){var r=vi(i);if(r!==null){if(i=r.tag,i===13){if(i=ko(r),i!==null){t.blockedOn=i,ff(t.priority,function(){uf(r)});return}}else if(i===3&&r.stateNode.current.memoizedState.isDehydrated){t.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Wo(t){if(t.blockedOn!==null)return!1;for(var i=t.targetContainers;0<i.length;){var r=Ul(t.domEventName,t.eventSystemFlags,i[0],t.nativeEvent);if(r===null){r=t.nativeEvent;var l=new r.constructor(r.type,r);vt=l,r.target.dispatchEvent(l),vt=null}else return i=ao(r),i!==null&&Ll(i),t.blockedOn=r,!1;i.shift()}return!0}function pf(t,i,r){Wo(t)&&r.delete(i)}function Vm(){bl=!1,Gi!==null&&Wo(Gi)&&(Gi=null),Vi!==null&&Wo(Vi)&&(Vi=null),Wi!==null&&Wo(Wi)&&(Wi=null),Xs.forEach(pf),Ys.forEach(pf)}function js(t,i){t.blockedOn===i&&(t.blockedOn=null,bl||(bl=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Vm)))}function Ks(t){function i(f){return js(f,t)}if(0<Vo.length){js(Vo[0],t);for(var r=1;r<Vo.length;r++){var l=Vo[r];l.blockedOn===t&&(l.blockedOn=null)}}for(Gi!==null&&js(Gi,t),Vi!==null&&js(Vi,t),Wi!==null&&js(Wi,t),Xs.forEach(i),Ys.forEach(i),r=0;r<Xi.length;r++)l=Xi[r],l.blockedOn===t&&(l.blockedOn=null);for(;0<Xi.length&&(r=Xi[0],r.blockedOn===null);)hf(r),r.blockedOn===null&&Xi.shift()}var Yr=U.ReactCurrentBatchConfig,Xo=!0;function Wm(t,i,r,l){var f=Tt,p=Yr.transition;Yr.transition=null;try{Tt=1,Dl(t,i,r,l)}finally{Tt=f,Yr.transition=p}}function Xm(t,i,r,l){var f=Tt,p=Yr.transition;Yr.transition=null;try{Tt=4,Dl(t,i,r,l)}finally{Tt=f,Yr.transition=p}}function Dl(t,i,r,l){if(Xo){var f=Ul(t,i,r,l);if(f===null)$l(t,i,l,Yo,r),df(t,l);else if(Gm(f,t,i,r,l))l.stopPropagation();else if(df(t,l),i&4&&-1<Hm.indexOf(t)){for(;f!==null;){var p=ao(f);if(p!==null&&lf(p),p=Ul(t,i,r,l),p===null&&$l(t,i,l,Yo,r),p===f)break;f=p}f!==null&&l.stopPropagation()}else $l(t,i,l,null,r)}}var Yo=null;function Ul(t,i,r,l){if(Yo=null,t=lt(l),t=Mr(t),t!==null)if(i=vi(t),i===null)t=null;else if(r=i.tag,r===13){if(t=ko(i),t!==null)return t;t=null}else if(r===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;t=null}else i!==t&&(t=null);return Yo=t,null}function mf(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ut()){case it:return 1;case ot:return 4;case At:case hn:return 16;case kt:return 536870912;default:return 16}default:return 16}}var Yi=null,Nl=null,qo=null;function gf(){if(qo)return qo;var t,i=Nl,r=i.length,l,f="value"in Yi?Yi.value:Yi.textContent,p=f.length;for(t=0;t<r&&i[t]===f[t];t++);var y=r-t;for(l=1;l<=y&&i[r-l]===f[p-l];l++);return qo=f.slice(t,1<l?1-l:void 0)}function jo(t){var i=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&i===13&&(t=13)):t=i,t===10&&(t=13),32<=t||t===13?t:0}function Ko(){return!0}function _f(){return!1}function bn(t){function i(r,l,f,p,y){this._reactName=r,this._targetInst=f,this.type=l,this.nativeEvent=p,this.target=y,this.currentTarget=null;for(var D in t)t.hasOwnProperty(D)&&(r=t[D],this[D]=r?r(p):p[D]);return this.isDefaultPrevented=(p.defaultPrevented!=null?p.defaultPrevented:p.returnValue===!1)?Ko:_f,this.isPropagationStopped=_f,this}return V(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=Ko)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=Ko)},persist:function(){},isPersistent:Ko}),i}var qr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Il=bn(qr),$s=V({},qr,{view:0,detail:0}),Ym=bn($s),Fl,Ol,Qs,$o=V({},$s,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zl,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Qs&&(Qs&&t.type==="mousemove"?(Fl=t.screenX-Qs.screenX,Ol=t.screenY-Qs.screenY):Ol=Fl=0,Qs=t),Fl)},movementY:function(t){return"movementY"in t?t.movementY:Ol}}),vf=bn($o),qm=V({},$o,{dataTransfer:0}),jm=bn(qm),Km=V({},$s,{relatedTarget:0}),Bl=bn(Km),$m=V({},qr,{animationName:0,elapsedTime:0,pseudoElement:0}),Qm=bn($m),Zm=V({},qr,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Jm=bn(Zm),eg=V({},qr,{data:0}),xf=bn(eg),tg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ng={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ig={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function rg(t){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(t):(t=ig[t])?!!i[t]:!1}function zl(){return rg}var sg=V({},$s,{key:function(t){if(t.key){var i=tg[t.key]||t.key;if(i!=="Unidentified")return i}return t.type==="keypress"?(t=jo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?ng[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zl,charCode:function(t){return t.type==="keypress"?jo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?jo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),og=bn(sg),ag=V({},$o,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Sf=bn(ag),lg=V({},$s,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zl}),ug=bn(lg),cg=V({},qr,{propertyName:0,elapsedTime:0,pseudoElement:0}),fg=bn(cg),dg=V({},$o,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),hg=bn(dg),pg=[9,13,27,32],kl=c&&"CompositionEvent"in window,Zs=null;c&&"documentMode"in document&&(Zs=document.documentMode);var mg=c&&"TextEvent"in window&&!Zs,yf=c&&(!kl||Zs&&8<Zs&&11>=Zs),Mf=" ",Ef=!1;function Tf(t,i){switch(t){case"keyup":return pg.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function wf(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var jr=!1;function gg(t,i){switch(t){case"compositionend":return wf(i);case"keypress":return i.which!==32?null:(Ef=!0,Mf);case"textInput":return t=i.data,t===Mf&&Ef?null:t;default:return null}}function _g(t,i){if(jr)return t==="compositionend"||!kl&&Tf(t,i)?(t=gf(),qo=Nl=Yi=null,jr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return yf&&i.locale!=="ko"?null:i.data;default:return null}}var vg={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Af(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i==="input"?!!vg[t.type]:i==="textarea"}function Rf(t,i,r,l){et(l),i=ta(i,"onChange"),0<i.length&&(r=new Il("onChange","change",null,r,l),t.push({event:r,listeners:i}))}var Js=null,eo=null;function xg(t){Xf(t,0)}function Qo(t){var i=Jr(t);if(Z(i))return t}function Sg(t,i){if(t==="change")return i}var Cf=!1;if(c){var Hl;if(c){var Gl="oninput"in document;if(!Gl){var Pf=document.createElement("div");Pf.setAttribute("oninput","return;"),Gl=typeof Pf.oninput=="function"}Hl=Gl}else Hl=!1;Cf=Hl&&(!document.documentMode||9<document.documentMode)}function Lf(){Js&&(Js.detachEvent("onpropertychange",bf),eo=Js=null)}function bf(t){if(t.propertyName==="value"&&Qo(eo)){var i=[];Rf(i,eo,t,lt(t)),Kt(xg,i)}}function yg(t,i,r){t==="focusin"?(Lf(),Js=i,eo=r,Js.attachEvent("onpropertychange",bf)):t==="focusout"&&Lf()}function Mg(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Qo(eo)}function Eg(t,i){if(t==="click")return Qo(i)}function Tg(t,i){if(t==="input"||t==="change")return Qo(i)}function wg(t,i){return t===i&&(t!==0||1/t===1/i)||t!==t&&i!==i}var Kn=typeof Object.is=="function"?Object.is:wg;function to(t,i){if(Kn(t,i))return!0;if(typeof t!="object"||t===null||typeof i!="object"||i===null)return!1;var r=Object.keys(t),l=Object.keys(i);if(r.length!==l.length)return!1;for(l=0;l<r.length;l++){var f=r[l];if(!h.call(i,f)||!Kn(t[f],i[f]))return!1}return!0}function Df(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Uf(t,i){var r=Df(t);t=0;for(var l;r;){if(r.nodeType===3){if(l=t+r.textContent.length,t<=i&&l>=i)return{node:r,offset:i-t};t=l}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Df(r)}}function Nf(t,i){return t&&i?t===i?!0:t&&t.nodeType===3?!1:i&&i.nodeType===3?Nf(t,i.parentNode):"contains"in t?t.contains(i):t.compareDocumentPosition?!!(t.compareDocumentPosition(i)&16):!1:!1}function If(){for(var t=window,i=Nt();i instanceof t.HTMLIFrameElement;){try{var r=typeof i.contentWindow.location.href=="string"}catch{r=!1}if(r)t=i.contentWindow;else break;i=Nt(t.document)}return i}function Vl(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i&&(i==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||i==="textarea"||t.contentEditable==="true")}function Ag(t){var i=If(),r=t.focusedElem,l=t.selectionRange;if(i!==r&&r&&r.ownerDocument&&Nf(r.ownerDocument.documentElement,r)){if(l!==null&&Vl(r)){if(i=l.start,t=l.end,t===void 0&&(t=i),"selectionStart"in r)r.selectionStart=i,r.selectionEnd=Math.min(t,r.value.length);else if(t=(i=r.ownerDocument||document)&&i.defaultView||window,t.getSelection){t=t.getSelection();var f=r.textContent.length,p=Math.min(l.start,f);l=l.end===void 0?p:Math.min(l.end,f),!t.extend&&p>l&&(f=l,l=p,p=f),f=Uf(r,p);var y=Uf(r,l);f&&y&&(t.rangeCount!==1||t.anchorNode!==f.node||t.anchorOffset!==f.offset||t.focusNode!==y.node||t.focusOffset!==y.offset)&&(i=i.createRange(),i.setStart(f.node,f.offset),t.removeAllRanges(),p>l?(t.addRange(i),t.extend(y.node,y.offset)):(i.setEnd(y.node,y.offset),t.addRange(i)))}}for(i=[],t=r;t=t.parentNode;)t.nodeType===1&&i.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<i.length;r++)t=i[r],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Rg=c&&"documentMode"in document&&11>=document.documentMode,Kr=null,Wl=null,no=null,Xl=!1;function Ff(t,i,r){var l=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Xl||Kr==null||Kr!==Nt(l)||(l=Kr,"selectionStart"in l&&Vl(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),no&&to(no,l)||(no=l,l=ta(Wl,"onSelect"),0<l.length&&(i=new Il("onSelect","select",null,i,r),t.push({event:i,listeners:l}),i.target=Kr)))}function Zo(t,i){var r={};return r[t.toLowerCase()]=i.toLowerCase(),r["Webkit"+t]="webkit"+i,r["Moz"+t]="moz"+i,r}var $r={animationend:Zo("Animation","AnimationEnd"),animationiteration:Zo("Animation","AnimationIteration"),animationstart:Zo("Animation","AnimationStart"),transitionend:Zo("Transition","TransitionEnd")},Yl={},Of={};c&&(Of=document.createElement("div").style,"AnimationEvent"in window||(delete $r.animationend.animation,delete $r.animationiteration.animation,delete $r.animationstart.animation),"TransitionEvent"in window||delete $r.transitionend.transition);function Jo(t){if(Yl[t])return Yl[t];if(!$r[t])return t;var i=$r[t],r;for(r in i)if(i.hasOwnProperty(r)&&r in Of)return Yl[t]=i[r];return t}var Bf=Jo("animationend"),zf=Jo("animationiteration"),kf=Jo("animationstart"),Hf=Jo("transitionend"),Gf=new Map,Vf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function qi(t,i){Gf.set(t,i),u(i,[t])}for(var ql=0;ql<Vf.length;ql++){var jl=Vf[ql],Cg=jl.toLowerCase(),Pg=jl[0].toUpperCase()+jl.slice(1);qi(Cg,"on"+Pg)}qi(Bf,"onAnimationEnd"),qi(zf,"onAnimationIteration"),qi(kf,"onAnimationStart"),qi("dblclick","onDoubleClick"),qi("focusin","onFocus"),qi("focusout","onBlur"),qi(Hf,"onTransitionEnd"),d("onMouseEnter",["mouseout","mouseover"]),d("onMouseLeave",["mouseout","mouseover"]),d("onPointerEnter",["pointerout","pointerover"]),d("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var io="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Lg=new Set("cancel close invalid load scroll toggle".split(" ").concat(io));function Wf(t,i,r){var l=t.type||"unknown-event";t.currentTarget=r,Cl(l,i,void 0,t),t.currentTarget=null}function Xf(t,i){i=(i&4)!==0;for(var r=0;r<t.length;r++){var l=t[r],f=l.event;l=l.listeners;e:{var p=void 0;if(i)for(var y=l.length-1;0<=y;y--){var D=l[y],F=D.instance,J=D.currentTarget;if(D=D.listener,F!==p&&f.isPropagationStopped())break e;Wf(f,D,J),p=F}else for(y=0;y<l.length;y++){if(D=l[y],F=D.instance,J=D.currentTarget,D=D.listener,F!==p&&f.isPropagationStopped())break e;Wf(f,D,J),p=F}}}if(Sr)throw t=ki,Sr=!1,ki=null,t}function Pt(t,i){var r=i[nu];r===void 0&&(r=i[nu]=new Set);var l=t+"__bubble";r.has(l)||(Yf(i,t,2,!1),r.add(l))}function Kl(t,i,r){var l=0;i&&(l|=4),Yf(r,t,l,i)}var ea="_reactListening"+Math.random().toString(36).slice(2);function ro(t){if(!t[ea]){t[ea]=!0,s.forEach(function(r){r!=="selectionchange"&&(Lg.has(r)||Kl(r,!1,t),Kl(r,!0,t))});var i=t.nodeType===9?t:t.ownerDocument;i===null||i[ea]||(i[ea]=!0,Kl("selectionchange",!1,i))}}function Yf(t,i,r,l){switch(mf(i)){case 1:var f=Wm;break;case 4:f=Xm;break;default:f=Dl}r=f.bind(null,i,r,t),f=void 0,!Wt||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(f=!0),l?f!==void 0?t.addEventListener(i,r,{capture:!0,passive:f}):t.addEventListener(i,r,!0):f!==void 0?t.addEventListener(i,r,{passive:f}):t.addEventListener(i,r,!1)}function $l(t,i,r,l,f){var p=l;if((i&1)===0&&(i&2)===0&&l!==null)e:for(;;){if(l===null)return;var y=l.tag;if(y===3||y===4){var D=l.stateNode.containerInfo;if(D===f||D.nodeType===8&&D.parentNode===f)break;if(y===4)for(y=l.return;y!==null;){var F=y.tag;if((F===3||F===4)&&(F=y.stateNode.containerInfo,F===f||F.nodeType===8&&F.parentNode===f))return;y=y.return}for(;D!==null;){if(y=Mr(D),y===null)return;if(F=y.tag,F===5||F===6){l=p=y;continue e}D=D.parentNode}}l=l.return}Kt(function(){var J=p,pe=lt(r),ve=[];e:{var he=Gf.get(t);if(he!==void 0){var be=Il,Fe=t;switch(t){case"keypress":if(jo(r)===0)break e;case"keydown":case"keyup":be=og;break;case"focusin":Fe="focus",be=Bl;break;case"focusout":Fe="blur",be=Bl;break;case"beforeblur":case"afterblur":be=Bl;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":be=vf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":be=jm;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":be=ug;break;case Bf:case zf:case kf:be=Qm;break;case Hf:be=fg;break;case"scroll":be=Ym;break;case"wheel":be=hg;break;case"copy":case"cut":case"paste":be=Jm;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":be=Sf}var Be=(i&4)!==0,Ht=!Be&&t==="scroll",X=Be?he!==null?he+"Capture":null:he;Be=[];for(var z=J,j;z!==null;){j=z;var ye=j.stateNode;if(j.tag===5&&ye!==null&&(j=ye,X!==null&&(ye=St(z,X),ye!=null&&Be.push(so(z,ye,j)))),Ht)break;z=z.return}0<Be.length&&(he=new be(he,Fe,null,r,pe),ve.push({event:he,listeners:Be}))}}if((i&7)===0){e:{if(he=t==="mouseover"||t==="pointerover",be=t==="mouseout"||t==="pointerout",he&&r!==vt&&(Fe=r.relatedTarget||r.fromElement)&&(Mr(Fe)||Fe[Si]))break e;if((be||he)&&(he=pe.window===pe?pe:(he=pe.ownerDocument)?he.defaultView||he.parentWindow:window,be?(Fe=r.relatedTarget||r.toElement,be=J,Fe=Fe?Mr(Fe):null,Fe!==null&&(Ht=vi(Fe),Fe!==Ht||Fe.tag!==5&&Fe.tag!==6)&&(Fe=null)):(be=null,Fe=J),be!==Fe)){if(Be=vf,ye="onMouseLeave",X="onMouseEnter",z="mouse",(t==="pointerout"||t==="pointerover")&&(Be=Sf,ye="onPointerLeave",X="onPointerEnter",z="pointer"),Ht=be==null?he:Jr(be),j=Fe==null?he:Jr(Fe),he=new Be(ye,z+"leave",be,r,pe),he.target=Ht,he.relatedTarget=j,ye=null,Mr(pe)===J&&(Be=new Be(X,z+"enter",Fe,r,pe),Be.target=j,Be.relatedTarget=Ht,ye=Be),Ht=ye,be&&Fe)t:{for(Be=be,X=Fe,z=0,j=Be;j;j=Qr(j))z++;for(j=0,ye=X;ye;ye=Qr(ye))j++;for(;0<z-j;)Be=Qr(Be),z--;for(;0<j-z;)X=Qr(X),j--;for(;z--;){if(Be===X||X!==null&&Be===X.alternate)break t;Be=Qr(Be),X=Qr(X)}Be=null}else Be=null;be!==null&&qf(ve,he,be,Be,!1),Fe!==null&&Ht!==null&&qf(ve,Ht,Fe,Be,!0)}}e:{if(he=J?Jr(J):window,be=he.nodeName&&he.nodeName.toLowerCase(),be==="select"||be==="input"&&he.type==="file")var ke=Sg;else if(Af(he))if(Cf)ke=Tg;else{ke=Mg;var je=yg}else(be=he.nodeName)&&be.toLowerCase()==="input"&&(he.type==="checkbox"||he.type==="radio")&&(ke=Eg);if(ke&&(ke=ke(t,J))){Rf(ve,ke,r,pe);break e}je&&je(t,he,J),t==="focusout"&&(je=he._wrapperState)&&je.controlled&&he.type==="number"&&C(he,"number",he.value)}switch(je=J?Jr(J):window,t){case"focusin":(Af(je)||je.contentEditable==="true")&&(Kr=je,Wl=J,no=null);break;case"focusout":no=Wl=Kr=null;break;case"mousedown":Xl=!0;break;case"contextmenu":case"mouseup":case"dragend":Xl=!1,Ff(ve,r,pe);break;case"selectionchange":if(Rg)break;case"keydown":case"keyup":Ff(ve,r,pe)}var Ke;if(kl)e:{switch(t){case"compositionstart":var nt="onCompositionStart";break e;case"compositionend":nt="onCompositionEnd";break e;case"compositionupdate":nt="onCompositionUpdate";break e}nt=void 0}else jr?Tf(t,r)&&(nt="onCompositionEnd"):t==="keydown"&&r.keyCode===229&&(nt="onCompositionStart");nt&&(yf&&r.locale!=="ko"&&(jr||nt!=="onCompositionStart"?nt==="onCompositionEnd"&&jr&&(Ke=gf()):(Yi=pe,Nl="value"in Yi?Yi.value:Yi.textContent,jr=!0)),je=ta(J,nt),0<je.length&&(nt=new xf(nt,t,null,r,pe),ve.push({event:nt,listeners:je}),Ke?nt.data=Ke:(Ke=wf(r),Ke!==null&&(nt.data=Ke)))),(Ke=mg?gg(t,r):_g(t,r))&&(J=ta(J,"onBeforeInput"),0<J.length&&(pe=new xf("onBeforeInput","beforeinput",null,r,pe),ve.push({event:pe,listeners:J}),pe.data=Ke))}Xf(ve,i)})}function so(t,i,r){return{instance:t,listener:i,currentTarget:r}}function ta(t,i){for(var r=i+"Capture",l=[];t!==null;){var f=t,p=f.stateNode;f.tag===5&&p!==null&&(f=p,p=St(t,r),p!=null&&l.unshift(so(t,p,f)),p=St(t,i),p!=null&&l.push(so(t,p,f))),t=t.return}return l}function Qr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function qf(t,i,r,l,f){for(var p=i._reactName,y=[];r!==null&&r!==l;){var D=r,F=D.alternate,J=D.stateNode;if(F!==null&&F===l)break;D.tag===5&&J!==null&&(D=J,f?(F=St(r,p),F!=null&&y.unshift(so(r,F,D))):f||(F=St(r,p),F!=null&&y.push(so(r,F,D)))),r=r.return}y.length!==0&&t.push({event:i,listeners:y})}var bg=/\r\n?/g,Dg=/\u0000|\uFFFD/g;function jf(t){return(typeof t=="string"?t:""+t).replace(bg,`
`).replace(Dg,"")}function na(t,i,r){if(i=jf(i),jf(t)!==i&&r)throw Error(n(425))}function ia(){}var Ql=null,Zl=null;function Jl(t,i){return t==="textarea"||t==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var eu=typeof setTimeout=="function"?setTimeout:void 0,Ug=typeof clearTimeout=="function"?clearTimeout:void 0,Kf=typeof Promise=="function"?Promise:void 0,Ng=typeof queueMicrotask=="function"?queueMicrotask:typeof Kf<"u"?function(t){return Kf.resolve(null).then(t).catch(Ig)}:eu;function Ig(t){setTimeout(function(){throw t})}function tu(t,i){var r=i,l=0;do{var f=r.nextSibling;if(t.removeChild(r),f&&f.nodeType===8)if(r=f.data,r==="/$"){if(l===0){t.removeChild(f),Ks(i);return}l--}else r!=="$"&&r!=="$?"&&r!=="$!"||l++;r=f}while(r);Ks(i)}function ji(t){for(;t!=null;t=t.nextSibling){var i=t.nodeType;if(i===1||i===3)break;if(i===8){if(i=t.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return t}function $f(t){t=t.previousSibling;for(var i=0;t;){if(t.nodeType===8){var r=t.data;if(r==="$"||r==="$!"||r==="$?"){if(i===0)return t;i--}else r==="/$"&&i++}t=t.previousSibling}return null}var Zr=Math.random().toString(36).slice(2),ci="__reactFiber$"+Zr,oo="__reactProps$"+Zr,Si="__reactContainer$"+Zr,nu="__reactEvents$"+Zr,Fg="__reactListeners$"+Zr,Og="__reactHandles$"+Zr;function Mr(t){var i=t[ci];if(i)return i;for(var r=t.parentNode;r;){if(i=r[Si]||r[ci]){if(r=i.alternate,i.child!==null||r!==null&&r.child!==null)for(t=$f(t);t!==null;){if(r=t[ci])return r;t=$f(t)}return i}t=r,r=t.parentNode}return null}function ao(t){return t=t[ci]||t[Si],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Jr(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(n(33))}function ra(t){return t[oo]||null}var iu=[],es=-1;function Ki(t){return{current:t}}function Lt(t){0>es||(t.current=iu[es],iu[es]=null,es--)}function Rt(t,i){es++,iu[es]=t.current,t.current=i}var $i={},an=Ki($i),En=Ki(!1),Er=$i;function ts(t,i){var r=t.type.contextTypes;if(!r)return $i;var l=t.stateNode;if(l&&l.__reactInternalMemoizedUnmaskedChildContext===i)return l.__reactInternalMemoizedMaskedChildContext;var f={},p;for(p in r)f[p]=i[p];return l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=f),f}function Tn(t){return t=t.childContextTypes,t!=null}function sa(){Lt(En),Lt(an)}function Qf(t,i,r){if(an.current!==$i)throw Error(n(168));Rt(an,i),Rt(En,r)}function Zf(t,i,r){var l=t.stateNode;if(i=i.childContextTypes,typeof l.getChildContext!="function")return r;l=l.getChildContext();for(var f in l)if(!(f in i))throw Error(n(108,de(t)||"Unknown",f));return V({},r,l)}function oa(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||$i,Er=an.current,Rt(an,t),Rt(En,En.current),!0}function Jf(t,i,r){var l=t.stateNode;if(!l)throw Error(n(169));r?(t=Zf(t,i,Er),l.__reactInternalMemoizedMergedChildContext=t,Lt(En),Lt(an),Rt(an,t)):Lt(En),Rt(En,r)}var yi=null,aa=!1,ru=!1;function ed(t){yi===null?yi=[t]:yi.push(t)}function Bg(t){aa=!0,ed(t)}function Qi(){if(!ru&&yi!==null){ru=!0;var t=0,i=Tt;try{var r=yi;for(Tt=1;t<r.length;t++){var l=r[t];do l=l(!0);while(l!==null)}yi=null,aa=!1}catch(f){throw yi!==null&&(yi=yi.slice(t+1)),ee(it,Qi),f}finally{Tt=i,ru=!1}}return null}var ns=[],is=0,la=null,ua=0,kn=[],Hn=0,Tr=null,Mi=1,Ei="";function wr(t,i){ns[is++]=ua,ns[is++]=la,la=t,ua=i}function td(t,i,r){kn[Hn++]=Mi,kn[Hn++]=Ei,kn[Hn++]=Tr,Tr=t;var l=Mi;t=Ei;var f=32-pn(l)-1;l&=~(1<<f),r+=1;var p=32-pn(i)+f;if(30<p){var y=f-f%5;p=(l&(1<<y)-1).toString(32),l>>=y,f-=y,Mi=1<<32-pn(i)+f|r<<f|l,Ei=p+t}else Mi=1<<p|r<<f|l,Ei=t}function su(t){t.return!==null&&(wr(t,1),td(t,1,0))}function ou(t){for(;t===la;)la=ns[--is],ns[is]=null,ua=ns[--is],ns[is]=null;for(;t===Tr;)Tr=kn[--Hn],kn[Hn]=null,Ei=kn[--Hn],kn[Hn]=null,Mi=kn[--Hn],kn[Hn]=null}var Dn=null,Un=null,Ut=!1,$n=null;function nd(t,i){var r=Xn(5,null,null,0);r.elementType="DELETED",r.stateNode=i,r.return=t,i=t.deletions,i===null?(t.deletions=[r],t.flags|=16):i.push(r)}function id(t,i){switch(t.tag){case 5:var r=t.type;return i=i.nodeType!==1||r.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(t.stateNode=i,Dn=t,Un=ji(i.firstChild),!0):!1;case 6:return i=t.pendingProps===""||i.nodeType!==3?null:i,i!==null?(t.stateNode=i,Dn=t,Un=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(r=Tr!==null?{id:Mi,overflow:Ei}:null,t.memoizedState={dehydrated:i,treeContext:r,retryLane:1073741824},r=Xn(18,null,null,0),r.stateNode=i,r.return=t,t.child=r,Dn=t,Un=null,!0):!1;default:return!1}}function au(t){return(t.mode&1)!==0&&(t.flags&128)===0}function lu(t){if(Ut){var i=Un;if(i){var r=i;if(!id(t,i)){if(au(t))throw Error(n(418));i=ji(r.nextSibling);var l=Dn;i&&id(t,i)?nd(l,r):(t.flags=t.flags&-4097|2,Ut=!1,Dn=t)}}else{if(au(t))throw Error(n(418));t.flags=t.flags&-4097|2,Ut=!1,Dn=t}}}function rd(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Dn=t}function ca(t){if(t!==Dn)return!1;if(!Ut)return rd(t),Ut=!0,!1;var i;if((i=t.tag!==3)&&!(i=t.tag!==5)&&(i=t.type,i=i!=="head"&&i!=="body"&&!Jl(t.type,t.memoizedProps)),i&&(i=Un)){if(au(t))throw sd(),Error(n(418));for(;i;)nd(t,i),i=ji(i.nextSibling)}if(rd(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(n(317));e:{for(t=t.nextSibling,i=0;t;){if(t.nodeType===8){var r=t.data;if(r==="/$"){if(i===0){Un=ji(t.nextSibling);break e}i--}else r!=="$"&&r!=="$!"&&r!=="$?"||i++}t=t.nextSibling}Un=null}}else Un=Dn?ji(t.stateNode.nextSibling):null;return!0}function sd(){for(var t=Un;t;)t=ji(t.nextSibling)}function rs(){Un=Dn=null,Ut=!1}function uu(t){$n===null?$n=[t]:$n.push(t)}var zg=U.ReactCurrentBatchConfig;function lo(t,i,r){if(t=r.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(n(309));var l=r.stateNode}if(!l)throw Error(n(147,t));var f=l,p=""+t;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===p?i.ref:(i=function(y){var D=f.refs;y===null?delete D[p]:D[p]=y},i._stringRef=p,i)}if(typeof t!="string")throw Error(n(284));if(!r._owner)throw Error(n(290,t))}return t}function fa(t,i){throw t=Object.prototype.toString.call(i),Error(n(31,t==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":t))}function od(t){var i=t._init;return i(t._payload)}function ad(t){function i(X,z){if(t){var j=X.deletions;j===null?(X.deletions=[z],X.flags|=16):j.push(z)}}function r(X,z){if(!t)return null;for(;z!==null;)i(X,z),z=z.sibling;return null}function l(X,z){for(X=new Map;z!==null;)z.key!==null?X.set(z.key,z):X.set(z.index,z),z=z.sibling;return X}function f(X,z){return X=sr(X,z),X.index=0,X.sibling=null,X}function p(X,z,j){return X.index=j,t?(j=X.alternate,j!==null?(j=j.index,j<z?(X.flags|=2,z):j):(X.flags|=2,z)):(X.flags|=1048576,z)}function y(X){return t&&X.alternate===null&&(X.flags|=2),X}function D(X,z,j,ye){return z===null||z.tag!==6?(z=ec(j,X.mode,ye),z.return=X,z):(z=f(z,j),z.return=X,z)}function F(X,z,j,ye){var ke=j.type;return ke===I?pe(X,z,j.props.children,ye,j.key):z!==null&&(z.elementType===ke||typeof ke=="object"&&ke!==null&&ke.$$typeof===re&&od(ke)===z.type)?(ye=f(z,j.props),ye.ref=lo(X,z,j),ye.return=X,ye):(ye=Ia(j.type,j.key,j.props,null,X.mode,ye),ye.ref=lo(X,z,j),ye.return=X,ye)}function J(X,z,j,ye){return z===null||z.tag!==4||z.stateNode.containerInfo!==j.containerInfo||z.stateNode.implementation!==j.implementation?(z=tc(j,X.mode,ye),z.return=X,z):(z=f(z,j.children||[]),z.return=X,z)}function pe(X,z,j,ye,ke){return z===null||z.tag!==7?(z=Ur(j,X.mode,ye,ke),z.return=X,z):(z=f(z,j),z.return=X,z)}function ve(X,z,j){if(typeof z=="string"&&z!==""||typeof z=="number")return z=ec(""+z,X.mode,j),z.return=X,z;if(typeof z=="object"&&z!==null){switch(z.$$typeof){case Y:return j=Ia(z.type,z.key,z.props,null,X.mode,j),j.ref=lo(X,null,z),j.return=X,j;case O:return z=tc(z,X.mode,j),z.return=X,z;case re:var ye=z._init;return ve(X,ye(z._payload),j)}if(E(z)||K(z))return z=Ur(z,X.mode,j,null),z.return=X,z;fa(X,z)}return null}function he(X,z,j,ye){var ke=z!==null?z.key:null;if(typeof j=="string"&&j!==""||typeof j=="number")return ke!==null?null:D(X,z,""+j,ye);if(typeof j=="object"&&j!==null){switch(j.$$typeof){case Y:return j.key===ke?F(X,z,j,ye):null;case O:return j.key===ke?J(X,z,j,ye):null;case re:return ke=j._init,he(X,z,ke(j._payload),ye)}if(E(j)||K(j))return ke!==null?null:pe(X,z,j,ye,null);fa(X,j)}return null}function be(X,z,j,ye,ke){if(typeof ye=="string"&&ye!==""||typeof ye=="number")return X=X.get(j)||null,D(z,X,""+ye,ke);if(typeof ye=="object"&&ye!==null){switch(ye.$$typeof){case Y:return X=X.get(ye.key===null?j:ye.key)||null,F(z,X,ye,ke);case O:return X=X.get(ye.key===null?j:ye.key)||null,J(z,X,ye,ke);case re:var je=ye._init;return be(X,z,j,je(ye._payload),ke)}if(E(ye)||K(ye))return X=X.get(j)||null,pe(z,X,ye,ke,null);fa(z,ye)}return null}function Fe(X,z,j,ye){for(var ke=null,je=null,Ke=z,nt=z=0,Zt=null;Ke!==null&&nt<j.length;nt++){Ke.index>nt?(Zt=Ke,Ke=null):Zt=Ke.sibling;var yt=he(X,Ke,j[nt],ye);if(yt===null){Ke===null&&(Ke=Zt);break}t&&Ke&&yt.alternate===null&&i(X,Ke),z=p(yt,z,nt),je===null?ke=yt:je.sibling=yt,je=yt,Ke=Zt}if(nt===j.length)return r(X,Ke),Ut&&wr(X,nt),ke;if(Ke===null){for(;nt<j.length;nt++)Ke=ve(X,j[nt],ye),Ke!==null&&(z=p(Ke,z,nt),je===null?ke=Ke:je.sibling=Ke,je=Ke);return Ut&&wr(X,nt),ke}for(Ke=l(X,Ke);nt<j.length;nt++)Zt=be(Ke,X,nt,j[nt],ye),Zt!==null&&(t&&Zt.alternate!==null&&Ke.delete(Zt.key===null?nt:Zt.key),z=p(Zt,z,nt),je===null?ke=Zt:je.sibling=Zt,je=Zt);return t&&Ke.forEach(function(or){return i(X,or)}),Ut&&wr(X,nt),ke}function Be(X,z,j,ye){var ke=K(j);if(typeof ke!="function")throw Error(n(150));if(j=ke.call(j),j==null)throw Error(n(151));for(var je=ke=null,Ke=z,nt=z=0,Zt=null,yt=j.next();Ke!==null&&!yt.done;nt++,yt=j.next()){Ke.index>nt?(Zt=Ke,Ke=null):Zt=Ke.sibling;var or=he(X,Ke,yt.value,ye);if(or===null){Ke===null&&(Ke=Zt);break}t&&Ke&&or.alternate===null&&i(X,Ke),z=p(or,z,nt),je===null?ke=or:je.sibling=or,je=or,Ke=Zt}if(yt.done)return r(X,Ke),Ut&&wr(X,nt),ke;if(Ke===null){for(;!yt.done;nt++,yt=j.next())yt=ve(X,yt.value,ye),yt!==null&&(z=p(yt,z,nt),je===null?ke=yt:je.sibling=yt,je=yt);return Ut&&wr(X,nt),ke}for(Ke=l(X,Ke);!yt.done;nt++,yt=j.next())yt=be(Ke,X,nt,yt.value,ye),yt!==null&&(t&&yt.alternate!==null&&Ke.delete(yt.key===null?nt:yt.key),z=p(yt,z,nt),je===null?ke=yt:je.sibling=yt,je=yt);return t&&Ke.forEach(function(v_){return i(X,v_)}),Ut&&wr(X,nt),ke}function Ht(X,z,j,ye){if(typeof j=="object"&&j!==null&&j.type===I&&j.key===null&&(j=j.props.children),typeof j=="object"&&j!==null){switch(j.$$typeof){case Y:e:{for(var ke=j.key,je=z;je!==null;){if(je.key===ke){if(ke=j.type,ke===I){if(je.tag===7){r(X,je.sibling),z=f(je,j.props.children),z.return=X,X=z;break e}}else if(je.elementType===ke||typeof ke=="object"&&ke!==null&&ke.$$typeof===re&&od(ke)===je.type){r(X,je.sibling),z=f(je,j.props),z.ref=lo(X,je,j),z.return=X,X=z;break e}r(X,je);break}else i(X,je);je=je.sibling}j.type===I?(z=Ur(j.props.children,X.mode,ye,j.key),z.return=X,X=z):(ye=Ia(j.type,j.key,j.props,null,X.mode,ye),ye.ref=lo(X,z,j),ye.return=X,X=ye)}return y(X);case O:e:{for(je=j.key;z!==null;){if(z.key===je)if(z.tag===4&&z.stateNode.containerInfo===j.containerInfo&&z.stateNode.implementation===j.implementation){r(X,z.sibling),z=f(z,j.children||[]),z.return=X,X=z;break e}else{r(X,z);break}else i(X,z);z=z.sibling}z=tc(j,X.mode,ye),z.return=X,X=z}return y(X);case re:return je=j._init,Ht(X,z,je(j._payload),ye)}if(E(j))return Fe(X,z,j,ye);if(K(j))return Be(X,z,j,ye);fa(X,j)}return typeof j=="string"&&j!==""||typeof j=="number"?(j=""+j,z!==null&&z.tag===6?(r(X,z.sibling),z=f(z,j),z.return=X,X=z):(r(X,z),z=ec(j,X.mode,ye),z.return=X,X=z),y(X)):r(X,z)}return Ht}var ss=ad(!0),ld=ad(!1),da=Ki(null),ha=null,os=null,cu=null;function fu(){cu=os=ha=null}function du(t){var i=da.current;Lt(da),t._currentValue=i}function hu(t,i,r){for(;t!==null;){var l=t.alternate;if((t.childLanes&i)!==i?(t.childLanes|=i,l!==null&&(l.childLanes|=i)):l!==null&&(l.childLanes&i)!==i&&(l.childLanes|=i),t===r)break;t=t.return}}function as(t,i){ha=t,cu=os=null,t=t.dependencies,t!==null&&t.firstContext!==null&&((t.lanes&i)!==0&&(wn=!0),t.firstContext=null)}function Gn(t){var i=t._currentValue;if(cu!==t)if(t={context:t,memoizedValue:i,next:null},os===null){if(ha===null)throw Error(n(308));os=t,ha.dependencies={lanes:0,firstContext:t}}else os=os.next=t;return i}var Ar=null;function pu(t){Ar===null?Ar=[t]:Ar.push(t)}function ud(t,i,r,l){var f=i.interleaved;return f===null?(r.next=r,pu(i)):(r.next=f.next,f.next=r),i.interleaved=r,Ti(t,l)}function Ti(t,i){t.lanes|=i;var r=t.alternate;for(r!==null&&(r.lanes|=i),r=t,t=t.return;t!==null;)t.childLanes|=i,r=t.alternate,r!==null&&(r.childLanes|=i),r=t,t=t.return;return r.tag===3?r.stateNode:null}var Zi=!1;function mu(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function cd(t,i){t=t.updateQueue,i.updateQueue===t&&(i.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function wi(t,i){return{eventTime:t,lane:i,tag:0,payload:null,callback:null,next:null}}function Ji(t,i,r){var l=t.updateQueue;if(l===null)return null;if(l=l.shared,(xt&2)!==0){var f=l.pending;return f===null?i.next=i:(i.next=f.next,f.next=i),l.pending=i,Ti(t,r)}return f=l.interleaved,f===null?(i.next=i,pu(l)):(i.next=f.next,f.next=i),l.interleaved=i,Ti(t,r)}function pa(t,i,r){if(i=i.updateQueue,i!==null&&(i=i.shared,(r&4194240)!==0)){var l=i.lanes;l&=t.pendingLanes,r|=l,i.lanes=r,Pl(t,r)}}function fd(t,i){var r=t.updateQueue,l=t.alternate;if(l!==null&&(l=l.updateQueue,r===l)){var f=null,p=null;if(r=r.firstBaseUpdate,r!==null){do{var y={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};p===null?f=p=y:p=p.next=y,r=r.next}while(r!==null);p===null?f=p=i:p=p.next=i}else f=p=i;r={baseState:l.baseState,firstBaseUpdate:f,lastBaseUpdate:p,shared:l.shared,effects:l.effects},t.updateQueue=r;return}t=r.lastBaseUpdate,t===null?r.firstBaseUpdate=i:t.next=i,r.lastBaseUpdate=i}function ma(t,i,r,l){var f=t.updateQueue;Zi=!1;var p=f.firstBaseUpdate,y=f.lastBaseUpdate,D=f.shared.pending;if(D!==null){f.shared.pending=null;var F=D,J=F.next;F.next=null,y===null?p=J:y.next=J,y=F;var pe=t.alternate;pe!==null&&(pe=pe.updateQueue,D=pe.lastBaseUpdate,D!==y&&(D===null?pe.firstBaseUpdate=J:D.next=J,pe.lastBaseUpdate=F))}if(p!==null){var ve=f.baseState;y=0,pe=J=F=null,D=p;do{var he=D.lane,be=D.eventTime;if((l&he)===he){pe!==null&&(pe=pe.next={eventTime:be,lane:0,tag:D.tag,payload:D.payload,callback:D.callback,next:null});e:{var Fe=t,Be=D;switch(he=i,be=r,Be.tag){case 1:if(Fe=Be.payload,typeof Fe=="function"){ve=Fe.call(be,ve,he);break e}ve=Fe;break e;case 3:Fe.flags=Fe.flags&-65537|128;case 0:if(Fe=Be.payload,he=typeof Fe=="function"?Fe.call(be,ve,he):Fe,he==null)break e;ve=V({},ve,he);break e;case 2:Zi=!0}}D.callback!==null&&D.lane!==0&&(t.flags|=64,he=f.effects,he===null?f.effects=[D]:he.push(D))}else be={eventTime:be,lane:he,tag:D.tag,payload:D.payload,callback:D.callback,next:null},pe===null?(J=pe=be,F=ve):pe=pe.next=be,y|=he;if(D=D.next,D===null){if(D=f.shared.pending,D===null)break;he=D,D=he.next,he.next=null,f.lastBaseUpdate=he,f.shared.pending=null}}while(!0);if(pe===null&&(F=ve),f.baseState=F,f.firstBaseUpdate=J,f.lastBaseUpdate=pe,i=f.shared.interleaved,i!==null){f=i;do y|=f.lane,f=f.next;while(f!==i)}else p===null&&(f.shared.lanes=0);Pr|=y,t.lanes=y,t.memoizedState=ve}}function dd(t,i,r){if(t=i.effects,i.effects=null,t!==null)for(i=0;i<t.length;i++){var l=t[i],f=l.callback;if(f!==null){if(l.callback=null,l=r,typeof f!="function")throw Error(n(191,f));f.call(l)}}}var uo={},fi=Ki(uo),co=Ki(uo),fo=Ki(uo);function Rr(t){if(t===uo)throw Error(n(174));return t}function gu(t,i){switch(Rt(fo,i),Rt(co,t),Rt(fi,uo),t=i.nodeType,t){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:De(null,"");break;default:t=t===8?i.parentNode:i,i=t.namespaceURI||null,t=t.tagName,i=De(i,t)}Lt(fi),Rt(fi,i)}function ls(){Lt(fi),Lt(co),Lt(fo)}function hd(t){Rr(fo.current);var i=Rr(fi.current),r=De(i,t.type);i!==r&&(Rt(co,t),Rt(fi,r))}function _u(t){co.current===t&&(Lt(fi),Lt(co))}var It=Ki(0);function ga(t){for(var i=t;i!==null;){if(i.tag===13){var r=i.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var vu=[];function xu(){for(var t=0;t<vu.length;t++)vu[t]._workInProgressVersionPrimary=null;vu.length=0}var _a=U.ReactCurrentDispatcher,Su=U.ReactCurrentBatchConfig,Cr=0,Ft=null,Xt=null,$t=null,va=!1,ho=!1,po=0,kg=0;function ln(){throw Error(n(321))}function yu(t,i){if(i===null)return!1;for(var r=0;r<i.length&&r<t.length;r++)if(!Kn(t[r],i[r]))return!1;return!0}function Mu(t,i,r,l,f,p){if(Cr=p,Ft=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,_a.current=t===null||t.memoizedState===null?Wg:Xg,t=r(l,f),ho){p=0;do{if(ho=!1,po=0,25<=p)throw Error(n(301));p+=1,$t=Xt=null,i.updateQueue=null,_a.current=Yg,t=r(l,f)}while(ho)}if(_a.current=ya,i=Xt!==null&&Xt.next!==null,Cr=0,$t=Xt=Ft=null,va=!1,i)throw Error(n(300));return t}function Eu(){var t=po!==0;return po=0,t}function di(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return $t===null?Ft.memoizedState=$t=t:$t=$t.next=t,$t}function Vn(){if(Xt===null){var t=Ft.alternate;t=t!==null?t.memoizedState:null}else t=Xt.next;var i=$t===null?Ft.memoizedState:$t.next;if(i!==null)$t=i,Xt=t;else{if(t===null)throw Error(n(310));Xt=t,t={memoizedState:Xt.memoizedState,baseState:Xt.baseState,baseQueue:Xt.baseQueue,queue:Xt.queue,next:null},$t===null?Ft.memoizedState=$t=t:$t=$t.next=t}return $t}function mo(t,i){return typeof i=="function"?i(t):i}function Tu(t){var i=Vn(),r=i.queue;if(r===null)throw Error(n(311));r.lastRenderedReducer=t;var l=Xt,f=l.baseQueue,p=r.pending;if(p!==null){if(f!==null){var y=f.next;f.next=p.next,p.next=y}l.baseQueue=f=p,r.pending=null}if(f!==null){p=f.next,l=l.baseState;var D=y=null,F=null,J=p;do{var pe=J.lane;if((Cr&pe)===pe)F!==null&&(F=F.next={lane:0,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null}),l=J.hasEagerState?J.eagerState:t(l,J.action);else{var ve={lane:pe,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null};F===null?(D=F=ve,y=l):F=F.next=ve,Ft.lanes|=pe,Pr|=pe}J=J.next}while(J!==null&&J!==p);F===null?y=l:F.next=D,Kn(l,i.memoizedState)||(wn=!0),i.memoizedState=l,i.baseState=y,i.baseQueue=F,r.lastRenderedState=l}if(t=r.interleaved,t!==null){f=t;do p=f.lane,Ft.lanes|=p,Pr|=p,f=f.next;while(f!==t)}else f===null&&(r.lanes=0);return[i.memoizedState,r.dispatch]}function wu(t){var i=Vn(),r=i.queue;if(r===null)throw Error(n(311));r.lastRenderedReducer=t;var l=r.dispatch,f=r.pending,p=i.memoizedState;if(f!==null){r.pending=null;var y=f=f.next;do p=t(p,y.action),y=y.next;while(y!==f);Kn(p,i.memoizedState)||(wn=!0),i.memoizedState=p,i.baseQueue===null&&(i.baseState=p),r.lastRenderedState=p}return[p,l]}function pd(){}function md(t,i){var r=Ft,l=Vn(),f=i(),p=!Kn(l.memoizedState,f);if(p&&(l.memoizedState=f,wn=!0),l=l.queue,Au(vd.bind(null,r,l,t),[t]),l.getSnapshot!==i||p||$t!==null&&$t.memoizedState.tag&1){if(r.flags|=2048,go(9,_d.bind(null,r,l,f,i),void 0,null),Qt===null)throw Error(n(349));(Cr&30)!==0||gd(r,i,f)}return f}function gd(t,i,r){t.flags|=16384,t={getSnapshot:i,value:r},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.stores=[t]):(r=i.stores,r===null?i.stores=[t]:r.push(t))}function _d(t,i,r,l){i.value=r,i.getSnapshot=l,xd(i)&&Sd(t)}function vd(t,i,r){return r(function(){xd(i)&&Sd(t)})}function xd(t){var i=t.getSnapshot;t=t.value;try{var r=i();return!Kn(t,r)}catch{return!0}}function Sd(t){var i=Ti(t,1);i!==null&&ei(i,t,1,-1)}function yd(t){var i=di();return typeof t=="function"&&(t=t()),i.memoizedState=i.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:mo,lastRenderedState:t},i.queue=t,t=t.dispatch=Vg.bind(null,Ft,t),[i.memoizedState,t]}function go(t,i,r,l){return t={tag:t,create:i,destroy:r,deps:l,next:null},i=Ft.updateQueue,i===null?(i={lastEffect:null,stores:null},Ft.updateQueue=i,i.lastEffect=t.next=t):(r=i.lastEffect,r===null?i.lastEffect=t.next=t:(l=r.next,r.next=t,t.next=l,i.lastEffect=t)),t}function Md(){return Vn().memoizedState}function xa(t,i,r,l){var f=di();Ft.flags|=t,f.memoizedState=go(1|i,r,void 0,l===void 0?null:l)}function Sa(t,i,r,l){var f=Vn();l=l===void 0?null:l;var p=void 0;if(Xt!==null){var y=Xt.memoizedState;if(p=y.destroy,l!==null&&yu(l,y.deps)){f.memoizedState=go(i,r,p,l);return}}Ft.flags|=t,f.memoizedState=go(1|i,r,p,l)}function Ed(t,i){return xa(8390656,8,t,i)}function Au(t,i){return Sa(2048,8,t,i)}function Td(t,i){return Sa(4,2,t,i)}function wd(t,i){return Sa(4,4,t,i)}function Ad(t,i){if(typeof i=="function")return t=t(),i(t),function(){i(null)};if(i!=null)return t=t(),i.current=t,function(){i.current=null}}function Rd(t,i,r){return r=r!=null?r.concat([t]):null,Sa(4,4,Ad.bind(null,i,t),r)}function Ru(){}function Cd(t,i){var r=Vn();i=i===void 0?null:i;var l=r.memoizedState;return l!==null&&i!==null&&yu(i,l[1])?l[0]:(r.memoizedState=[t,i],t)}function Pd(t,i){var r=Vn();i=i===void 0?null:i;var l=r.memoizedState;return l!==null&&i!==null&&yu(i,l[1])?l[0]:(t=t(),r.memoizedState=[t,i],t)}function Ld(t,i,r){return(Cr&21)===0?(t.baseState&&(t.baseState=!1,wn=!0),t.memoizedState=r):(Kn(r,i)||(r=Go(),Ft.lanes|=r,Pr|=r,t.baseState=!0),i)}function Hg(t,i){var r=Tt;Tt=r!==0&&4>r?r:4,t(!0);var l=Su.transition;Su.transition={};try{t(!1),i()}finally{Tt=r,Su.transition=l}}function bd(){return Vn().memoizedState}function Gg(t,i,r){var l=ir(t);if(r={lane:l,action:r,hasEagerState:!1,eagerState:null,next:null},Dd(t))Ud(i,r);else if(r=ud(t,i,r,l),r!==null){var f=gn();ei(r,t,l,f),Nd(r,i,l)}}function Vg(t,i,r){var l=ir(t),f={lane:l,action:r,hasEagerState:!1,eagerState:null,next:null};if(Dd(t))Ud(i,f);else{var p=t.alternate;if(t.lanes===0&&(p===null||p.lanes===0)&&(p=i.lastRenderedReducer,p!==null))try{var y=i.lastRenderedState,D=p(y,r);if(f.hasEagerState=!0,f.eagerState=D,Kn(D,y)){var F=i.interleaved;F===null?(f.next=f,pu(i)):(f.next=F.next,F.next=f),i.interleaved=f;return}}catch{}finally{}r=ud(t,i,f,l),r!==null&&(f=gn(),ei(r,t,l,f),Nd(r,i,l))}}function Dd(t){var i=t.alternate;return t===Ft||i!==null&&i===Ft}function Ud(t,i){ho=va=!0;var r=t.pending;r===null?i.next=i:(i.next=r.next,r.next=i),t.pending=i}function Nd(t,i,r){if((r&4194240)!==0){var l=i.lanes;l&=t.pendingLanes,r|=l,i.lanes=r,Pl(t,r)}}var ya={readContext:Gn,useCallback:ln,useContext:ln,useEffect:ln,useImperativeHandle:ln,useInsertionEffect:ln,useLayoutEffect:ln,useMemo:ln,useReducer:ln,useRef:ln,useState:ln,useDebugValue:ln,useDeferredValue:ln,useTransition:ln,useMutableSource:ln,useSyncExternalStore:ln,useId:ln,unstable_isNewReconciler:!1},Wg={readContext:Gn,useCallback:function(t,i){return di().memoizedState=[t,i===void 0?null:i],t},useContext:Gn,useEffect:Ed,useImperativeHandle:function(t,i,r){return r=r!=null?r.concat([t]):null,xa(4194308,4,Ad.bind(null,i,t),r)},useLayoutEffect:function(t,i){return xa(4194308,4,t,i)},useInsertionEffect:function(t,i){return xa(4,2,t,i)},useMemo:function(t,i){var r=di();return i=i===void 0?null:i,t=t(),r.memoizedState=[t,i],t},useReducer:function(t,i,r){var l=di();return i=r!==void 0?r(i):i,l.memoizedState=l.baseState=i,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},l.queue=t,t=t.dispatch=Gg.bind(null,Ft,t),[l.memoizedState,t]},useRef:function(t){var i=di();return t={current:t},i.memoizedState=t},useState:yd,useDebugValue:Ru,useDeferredValue:function(t){return di().memoizedState=t},useTransition:function(){var t=yd(!1),i=t[0];return t=Hg.bind(null,t[1]),di().memoizedState=t,[i,t]},useMutableSource:function(){},useSyncExternalStore:function(t,i,r){var l=Ft,f=di();if(Ut){if(r===void 0)throw Error(n(407));r=r()}else{if(r=i(),Qt===null)throw Error(n(349));(Cr&30)!==0||gd(l,i,r)}f.memoizedState=r;var p={value:r,getSnapshot:i};return f.queue=p,Ed(vd.bind(null,l,p,t),[t]),l.flags|=2048,go(9,_d.bind(null,l,p,r,i),void 0,null),r},useId:function(){var t=di(),i=Qt.identifierPrefix;if(Ut){var r=Ei,l=Mi;r=(l&~(1<<32-pn(l)-1)).toString(32)+r,i=":"+i+"R"+r,r=po++,0<r&&(i+="H"+r.toString(32)),i+=":"}else r=kg++,i=":"+i+"r"+r.toString(32)+":";return t.memoizedState=i},unstable_isNewReconciler:!1},Xg={readContext:Gn,useCallback:Cd,useContext:Gn,useEffect:Au,useImperativeHandle:Rd,useInsertionEffect:Td,useLayoutEffect:wd,useMemo:Pd,useReducer:Tu,useRef:Md,useState:function(){return Tu(mo)},useDebugValue:Ru,useDeferredValue:function(t){var i=Vn();return Ld(i,Xt.memoizedState,t)},useTransition:function(){var t=Tu(mo)[0],i=Vn().memoizedState;return[t,i]},useMutableSource:pd,useSyncExternalStore:md,useId:bd,unstable_isNewReconciler:!1},Yg={readContext:Gn,useCallback:Cd,useContext:Gn,useEffect:Au,useImperativeHandle:Rd,useInsertionEffect:Td,useLayoutEffect:wd,useMemo:Pd,useReducer:wu,useRef:Md,useState:function(){return wu(mo)},useDebugValue:Ru,useDeferredValue:function(t){var i=Vn();return Xt===null?i.memoizedState=t:Ld(i,Xt.memoizedState,t)},useTransition:function(){var t=wu(mo)[0],i=Vn().memoizedState;return[t,i]},useMutableSource:pd,useSyncExternalStore:md,useId:bd,unstable_isNewReconciler:!1};function Qn(t,i){if(t&&t.defaultProps){i=V({},i),t=t.defaultProps;for(var r in t)i[r]===void 0&&(i[r]=t[r]);return i}return i}function Cu(t,i,r,l){i=t.memoizedState,r=r(l,i),r=r==null?i:V({},i,r),t.memoizedState=r,t.lanes===0&&(t.updateQueue.baseState=r)}var Ma={isMounted:function(t){return(t=t._reactInternals)?vi(t)===t:!1},enqueueSetState:function(t,i,r){t=t._reactInternals;var l=gn(),f=ir(t),p=wi(l,f);p.payload=i,r!=null&&(p.callback=r),i=Ji(t,p,f),i!==null&&(ei(i,t,f,l),pa(i,t,f))},enqueueReplaceState:function(t,i,r){t=t._reactInternals;var l=gn(),f=ir(t),p=wi(l,f);p.tag=1,p.payload=i,r!=null&&(p.callback=r),i=Ji(t,p,f),i!==null&&(ei(i,t,f,l),pa(i,t,f))},enqueueForceUpdate:function(t,i){t=t._reactInternals;var r=gn(),l=ir(t),f=wi(r,l);f.tag=2,i!=null&&(f.callback=i),i=Ji(t,f,l),i!==null&&(ei(i,t,l,r),pa(i,t,l))}};function Id(t,i,r,l,f,p,y){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(l,p,y):i.prototype&&i.prototype.isPureReactComponent?!to(r,l)||!to(f,p):!0}function Fd(t,i,r){var l=!1,f=$i,p=i.contextType;return typeof p=="object"&&p!==null?p=Gn(p):(f=Tn(i)?Er:an.current,l=i.contextTypes,p=(l=l!=null)?ts(t,f):$i),i=new i(r,p),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Ma,t.stateNode=i,i._reactInternals=t,l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=f,t.__reactInternalMemoizedMaskedChildContext=p),i}function Od(t,i,r,l){t=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(r,l),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(r,l),i.state!==t&&Ma.enqueueReplaceState(i,i.state,null)}function Pu(t,i,r,l){var f=t.stateNode;f.props=r,f.state=t.memoizedState,f.refs={},mu(t);var p=i.contextType;typeof p=="object"&&p!==null?f.context=Gn(p):(p=Tn(i)?Er:an.current,f.context=ts(t,p)),f.state=t.memoizedState,p=i.getDerivedStateFromProps,typeof p=="function"&&(Cu(t,i,p,r),f.state=t.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(i=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),i!==f.state&&Ma.enqueueReplaceState(f,f.state,null),ma(t,r,f,l),f.state=t.memoizedState),typeof f.componentDidMount=="function"&&(t.flags|=4194308)}function us(t,i){try{var r="",l=i;do r+=fe(l),l=l.return;while(l);var f=r}catch(p){f=`
Error generating stack: `+p.message+`
`+p.stack}return{value:t,source:i,stack:f,digest:null}}function Lu(t,i,r){return{value:t,source:null,stack:r??null,digest:i??null}}function bu(t,i){try{console.error(i.value)}catch(r){setTimeout(function(){throw r})}}var qg=typeof WeakMap=="function"?WeakMap:Map;function Bd(t,i,r){r=wi(-1,r),r.tag=3,r.payload={element:null};var l=i.value;return r.callback=function(){Pa||(Pa=!0,Yu=l),bu(t,i)},r}function zd(t,i,r){r=wi(-1,r),r.tag=3;var l=t.type.getDerivedStateFromError;if(typeof l=="function"){var f=i.value;r.payload=function(){return l(f)},r.callback=function(){bu(t,i)}}var p=t.stateNode;return p!==null&&typeof p.componentDidCatch=="function"&&(r.callback=function(){bu(t,i),typeof l!="function"&&(tr===null?tr=new Set([this]):tr.add(this));var y=i.stack;this.componentDidCatch(i.value,{componentStack:y!==null?y:""})}),r}function kd(t,i,r){var l=t.pingCache;if(l===null){l=t.pingCache=new qg;var f=new Set;l.set(i,f)}else f=l.get(i),f===void 0&&(f=new Set,l.set(i,f));f.has(r)||(f.add(r),t=a_.bind(null,t,i,r),i.then(t,t))}function Hd(t){do{var i;if((i=t.tag===13)&&(i=t.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return t;t=t.return}while(t!==null);return null}function Gd(t,i,r,l,f){return(t.mode&1)===0?(t===i?t.flags|=65536:(t.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(i=wi(-1,1),i.tag=2,Ji(r,i,1))),r.lanes|=1),t):(t.flags|=65536,t.lanes=f,t)}var jg=U.ReactCurrentOwner,wn=!1;function mn(t,i,r,l){i.child=t===null?ld(i,null,r,l):ss(i,t.child,r,l)}function Vd(t,i,r,l,f){r=r.render;var p=i.ref;return as(i,f),l=Mu(t,i,r,l,p,f),r=Eu(),t!==null&&!wn?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~f,Ai(t,i,f)):(Ut&&r&&su(i),i.flags|=1,mn(t,i,l,f),i.child)}function Wd(t,i,r,l,f){if(t===null){var p=r.type;return typeof p=="function"&&!Ju(p)&&p.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(i.tag=15,i.type=p,Xd(t,i,p,l,f)):(t=Ia(r.type,null,l,i,i.mode,f),t.ref=i.ref,t.return=i,i.child=t)}if(p=t.child,(t.lanes&f)===0){var y=p.memoizedProps;if(r=r.compare,r=r!==null?r:to,r(y,l)&&t.ref===i.ref)return Ai(t,i,f)}return i.flags|=1,t=sr(p,l),t.ref=i.ref,t.return=i,i.child=t}function Xd(t,i,r,l,f){if(t!==null){var p=t.memoizedProps;if(to(p,l)&&t.ref===i.ref)if(wn=!1,i.pendingProps=l=p,(t.lanes&f)!==0)(t.flags&131072)!==0&&(wn=!0);else return i.lanes=t.lanes,Ai(t,i,f)}return Du(t,i,r,l,f)}function Yd(t,i,r){var l=i.pendingProps,f=l.children,p=t!==null?t.memoizedState:null;if(l.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Rt(fs,Nn),Nn|=r;else{if((r&1073741824)===0)return t=p!==null?p.baseLanes|r:r,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:t,cachePool:null,transitions:null},i.updateQueue=null,Rt(fs,Nn),Nn|=t,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},l=p!==null?p.baseLanes:r,Rt(fs,Nn),Nn|=l}else p!==null?(l=p.baseLanes|r,i.memoizedState=null):l=r,Rt(fs,Nn),Nn|=l;return mn(t,i,f,r),i.child}function qd(t,i){var r=i.ref;(t===null&&r!==null||t!==null&&t.ref!==r)&&(i.flags|=512,i.flags|=2097152)}function Du(t,i,r,l,f){var p=Tn(r)?Er:an.current;return p=ts(i,p),as(i,f),r=Mu(t,i,r,l,p,f),l=Eu(),t!==null&&!wn?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~f,Ai(t,i,f)):(Ut&&l&&su(i),i.flags|=1,mn(t,i,r,f),i.child)}function jd(t,i,r,l,f){if(Tn(r)){var p=!0;oa(i)}else p=!1;if(as(i,f),i.stateNode===null)Ta(t,i),Fd(i,r,l),Pu(i,r,l,f),l=!0;else if(t===null){var y=i.stateNode,D=i.memoizedProps;y.props=D;var F=y.context,J=r.contextType;typeof J=="object"&&J!==null?J=Gn(J):(J=Tn(r)?Er:an.current,J=ts(i,J));var pe=r.getDerivedStateFromProps,ve=typeof pe=="function"||typeof y.getSnapshotBeforeUpdate=="function";ve||typeof y.UNSAFE_componentWillReceiveProps!="function"&&typeof y.componentWillReceiveProps!="function"||(D!==l||F!==J)&&Od(i,y,l,J),Zi=!1;var he=i.memoizedState;y.state=he,ma(i,l,y,f),F=i.memoizedState,D!==l||he!==F||En.current||Zi?(typeof pe=="function"&&(Cu(i,r,pe,l),F=i.memoizedState),(D=Zi||Id(i,r,D,l,he,F,J))?(ve||typeof y.UNSAFE_componentWillMount!="function"&&typeof y.componentWillMount!="function"||(typeof y.componentWillMount=="function"&&y.componentWillMount(),typeof y.UNSAFE_componentWillMount=="function"&&y.UNSAFE_componentWillMount()),typeof y.componentDidMount=="function"&&(i.flags|=4194308)):(typeof y.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=l,i.memoizedState=F),y.props=l,y.state=F,y.context=J,l=D):(typeof y.componentDidMount=="function"&&(i.flags|=4194308),l=!1)}else{y=i.stateNode,cd(t,i),D=i.memoizedProps,J=i.type===i.elementType?D:Qn(i.type,D),y.props=J,ve=i.pendingProps,he=y.context,F=r.contextType,typeof F=="object"&&F!==null?F=Gn(F):(F=Tn(r)?Er:an.current,F=ts(i,F));var be=r.getDerivedStateFromProps;(pe=typeof be=="function"||typeof y.getSnapshotBeforeUpdate=="function")||typeof y.UNSAFE_componentWillReceiveProps!="function"&&typeof y.componentWillReceiveProps!="function"||(D!==ve||he!==F)&&Od(i,y,l,F),Zi=!1,he=i.memoizedState,y.state=he,ma(i,l,y,f);var Fe=i.memoizedState;D!==ve||he!==Fe||En.current||Zi?(typeof be=="function"&&(Cu(i,r,be,l),Fe=i.memoizedState),(J=Zi||Id(i,r,J,l,he,Fe,F)||!1)?(pe||typeof y.UNSAFE_componentWillUpdate!="function"&&typeof y.componentWillUpdate!="function"||(typeof y.componentWillUpdate=="function"&&y.componentWillUpdate(l,Fe,F),typeof y.UNSAFE_componentWillUpdate=="function"&&y.UNSAFE_componentWillUpdate(l,Fe,F)),typeof y.componentDidUpdate=="function"&&(i.flags|=4),typeof y.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof y.componentDidUpdate!="function"||D===t.memoizedProps&&he===t.memoizedState||(i.flags|=4),typeof y.getSnapshotBeforeUpdate!="function"||D===t.memoizedProps&&he===t.memoizedState||(i.flags|=1024),i.memoizedProps=l,i.memoizedState=Fe),y.props=l,y.state=Fe,y.context=F,l=J):(typeof y.componentDidUpdate!="function"||D===t.memoizedProps&&he===t.memoizedState||(i.flags|=4),typeof y.getSnapshotBeforeUpdate!="function"||D===t.memoizedProps&&he===t.memoizedState||(i.flags|=1024),l=!1)}return Uu(t,i,r,l,p,f)}function Uu(t,i,r,l,f,p){qd(t,i);var y=(i.flags&128)!==0;if(!l&&!y)return f&&Jf(i,r,!1),Ai(t,i,p);l=i.stateNode,jg.current=i;var D=y&&typeof r.getDerivedStateFromError!="function"?null:l.render();return i.flags|=1,t!==null&&y?(i.child=ss(i,t.child,null,p),i.child=ss(i,null,D,p)):mn(t,i,D,p),i.memoizedState=l.state,f&&Jf(i,r,!0),i.child}function Kd(t){var i=t.stateNode;i.pendingContext?Qf(t,i.pendingContext,i.pendingContext!==i.context):i.context&&Qf(t,i.context,!1),gu(t,i.containerInfo)}function $d(t,i,r,l,f){return rs(),uu(f),i.flags|=256,mn(t,i,r,l),i.child}var Nu={dehydrated:null,treeContext:null,retryLane:0};function Iu(t){return{baseLanes:t,cachePool:null,transitions:null}}function Qd(t,i,r){var l=i.pendingProps,f=It.current,p=!1,y=(i.flags&128)!==0,D;if((D=y)||(D=t!==null&&t.memoizedState===null?!1:(f&2)!==0),D?(p=!0,i.flags&=-129):(t===null||t.memoizedState!==null)&&(f|=1),Rt(It,f&1),t===null)return lu(i),t=i.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?((i.mode&1)===0?i.lanes=1:t.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(y=l.children,t=l.fallback,p?(l=i.mode,p=i.child,y={mode:"hidden",children:y},(l&1)===0&&p!==null?(p.childLanes=0,p.pendingProps=y):p=Fa(y,l,0,null),t=Ur(t,l,r,null),p.return=i,t.return=i,p.sibling=t,i.child=p,i.child.memoizedState=Iu(r),i.memoizedState=Nu,t):Fu(i,y));if(f=t.memoizedState,f!==null&&(D=f.dehydrated,D!==null))return Kg(t,i,y,l,D,f,r);if(p){p=l.fallback,y=i.mode,f=t.child,D=f.sibling;var F={mode:"hidden",children:l.children};return(y&1)===0&&i.child!==f?(l=i.child,l.childLanes=0,l.pendingProps=F,i.deletions=null):(l=sr(f,F),l.subtreeFlags=f.subtreeFlags&14680064),D!==null?p=sr(D,p):(p=Ur(p,y,r,null),p.flags|=2),p.return=i,l.return=i,l.sibling=p,i.child=l,l=p,p=i.child,y=t.child.memoizedState,y=y===null?Iu(r):{baseLanes:y.baseLanes|r,cachePool:null,transitions:y.transitions},p.memoizedState=y,p.childLanes=t.childLanes&~r,i.memoizedState=Nu,l}return p=t.child,t=p.sibling,l=sr(p,{mode:"visible",children:l.children}),(i.mode&1)===0&&(l.lanes=r),l.return=i,l.sibling=null,t!==null&&(r=i.deletions,r===null?(i.deletions=[t],i.flags|=16):r.push(t)),i.child=l,i.memoizedState=null,l}function Fu(t,i){return i=Fa({mode:"visible",children:i},t.mode,0,null),i.return=t,t.child=i}function Ea(t,i,r,l){return l!==null&&uu(l),ss(i,t.child,null,r),t=Fu(i,i.pendingProps.children),t.flags|=2,i.memoizedState=null,t}function Kg(t,i,r,l,f,p,y){if(r)return i.flags&256?(i.flags&=-257,l=Lu(Error(n(422))),Ea(t,i,y,l)):i.memoizedState!==null?(i.child=t.child,i.flags|=128,null):(p=l.fallback,f=i.mode,l=Fa({mode:"visible",children:l.children},f,0,null),p=Ur(p,f,y,null),p.flags|=2,l.return=i,p.return=i,l.sibling=p,i.child=l,(i.mode&1)!==0&&ss(i,t.child,null,y),i.child.memoizedState=Iu(y),i.memoizedState=Nu,p);if((i.mode&1)===0)return Ea(t,i,y,null);if(f.data==="$!"){if(l=f.nextSibling&&f.nextSibling.dataset,l)var D=l.dgst;return l=D,p=Error(n(419)),l=Lu(p,l,void 0),Ea(t,i,y,l)}if(D=(y&t.childLanes)!==0,wn||D){if(l=Qt,l!==null){switch(y&-y){case 4:f=2;break;case 16:f=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:f=32;break;case 536870912:f=268435456;break;default:f=0}f=(f&(l.suspendedLanes|y))!==0?0:f,f!==0&&f!==p.retryLane&&(p.retryLane=f,Ti(t,f),ei(l,t,f,-1))}return Zu(),l=Lu(Error(n(421))),Ea(t,i,y,l)}return f.data==="$?"?(i.flags|=128,i.child=t.child,i=l_.bind(null,t),f._reactRetry=i,null):(t=p.treeContext,Un=ji(f.nextSibling),Dn=i,Ut=!0,$n=null,t!==null&&(kn[Hn++]=Mi,kn[Hn++]=Ei,kn[Hn++]=Tr,Mi=t.id,Ei=t.overflow,Tr=i),i=Fu(i,l.children),i.flags|=4096,i)}function Zd(t,i,r){t.lanes|=i;var l=t.alternate;l!==null&&(l.lanes|=i),hu(t.return,i,r)}function Ou(t,i,r,l,f){var p=t.memoizedState;p===null?t.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:l,tail:r,tailMode:f}:(p.isBackwards=i,p.rendering=null,p.renderingStartTime=0,p.last=l,p.tail=r,p.tailMode=f)}function Jd(t,i,r){var l=i.pendingProps,f=l.revealOrder,p=l.tail;if(mn(t,i,l.children,r),l=It.current,(l&2)!==0)l=l&1|2,i.flags|=128;else{if(t!==null&&(t.flags&128)!==0)e:for(t=i.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Zd(t,r,i);else if(t.tag===19)Zd(t,r,i);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===i)break e;for(;t.sibling===null;){if(t.return===null||t.return===i)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}l&=1}if(Rt(It,l),(i.mode&1)===0)i.memoizedState=null;else switch(f){case"forwards":for(r=i.child,f=null;r!==null;)t=r.alternate,t!==null&&ga(t)===null&&(f=r),r=r.sibling;r=f,r===null?(f=i.child,i.child=null):(f=r.sibling,r.sibling=null),Ou(i,!1,f,r,p);break;case"backwards":for(r=null,f=i.child,i.child=null;f!==null;){if(t=f.alternate,t!==null&&ga(t)===null){i.child=f;break}t=f.sibling,f.sibling=r,r=f,f=t}Ou(i,!0,r,null,p);break;case"together":Ou(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Ta(t,i){(i.mode&1)===0&&t!==null&&(t.alternate=null,i.alternate=null,i.flags|=2)}function Ai(t,i,r){if(t!==null&&(i.dependencies=t.dependencies),Pr|=i.lanes,(r&i.childLanes)===0)return null;if(t!==null&&i.child!==t.child)throw Error(n(153));if(i.child!==null){for(t=i.child,r=sr(t,t.pendingProps),i.child=r,r.return=i;t.sibling!==null;)t=t.sibling,r=r.sibling=sr(t,t.pendingProps),r.return=i;r.sibling=null}return i.child}function $g(t,i,r){switch(i.tag){case 3:Kd(i),rs();break;case 5:hd(i);break;case 1:Tn(i.type)&&oa(i);break;case 4:gu(i,i.stateNode.containerInfo);break;case 10:var l=i.type._context,f=i.memoizedProps.value;Rt(da,l._currentValue),l._currentValue=f;break;case 13:if(l=i.memoizedState,l!==null)return l.dehydrated!==null?(Rt(It,It.current&1),i.flags|=128,null):(r&i.child.childLanes)!==0?Qd(t,i,r):(Rt(It,It.current&1),t=Ai(t,i,r),t!==null?t.sibling:null);Rt(It,It.current&1);break;case 19:if(l=(r&i.childLanes)!==0,(t.flags&128)!==0){if(l)return Jd(t,i,r);i.flags|=128}if(f=i.memoizedState,f!==null&&(f.rendering=null,f.tail=null,f.lastEffect=null),Rt(It,It.current),l)break;return null;case 22:case 23:return i.lanes=0,Yd(t,i,r)}return Ai(t,i,r)}var eh,Bu,th,nh;eh=function(t,i){for(var r=i.child;r!==null;){if(r.tag===5||r.tag===6)t.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===i)break;for(;r.sibling===null;){if(r.return===null||r.return===i)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},Bu=function(){},th=function(t,i,r,l){var f=t.memoizedProps;if(f!==l){t=i.stateNode,Rr(fi.current);var p=null;switch(r){case"input":f=Ve(t,f),l=Ve(t,l),p=[];break;case"select":f=V({},f,{value:void 0}),l=V({},l,{value:void 0}),p=[];break;case"textarea":f=ge(t,f),l=ge(t,l),p=[];break;default:typeof f.onClick!="function"&&typeof l.onClick=="function"&&(t.onclick=ia)}Ze(r,l);var y;r=null;for(J in f)if(!l.hasOwnProperty(J)&&f.hasOwnProperty(J)&&f[J]!=null)if(J==="style"){var D=f[J];for(y in D)D.hasOwnProperty(y)&&(r||(r={}),r[y]="")}else J!=="dangerouslySetInnerHTML"&&J!=="children"&&J!=="suppressContentEditableWarning"&&J!=="suppressHydrationWarning"&&J!=="autoFocus"&&(a.hasOwnProperty(J)?p||(p=[]):(p=p||[]).push(J,null));for(J in l){var F=l[J];if(D=f!=null?f[J]:void 0,l.hasOwnProperty(J)&&F!==D&&(F!=null||D!=null))if(J==="style")if(D){for(y in D)!D.hasOwnProperty(y)||F&&F.hasOwnProperty(y)||(r||(r={}),r[y]="");for(y in F)F.hasOwnProperty(y)&&D[y]!==F[y]&&(r||(r={}),r[y]=F[y])}else r||(p||(p=[]),p.push(J,r)),r=F;else J==="dangerouslySetInnerHTML"?(F=F?F.__html:void 0,D=D?D.__html:void 0,F!=null&&D!==F&&(p=p||[]).push(J,F)):J==="children"?typeof F!="string"&&typeof F!="number"||(p=p||[]).push(J,""+F):J!=="suppressContentEditableWarning"&&J!=="suppressHydrationWarning"&&(a.hasOwnProperty(J)?(F!=null&&J==="onScroll"&&Pt("scroll",t),p||D===F||(p=[])):(p=p||[]).push(J,F))}r&&(p=p||[]).push("style",r);var J=p;(i.updateQueue=J)&&(i.flags|=4)}},nh=function(t,i,r,l){r!==l&&(i.flags|=4)};function _o(t,i){if(!Ut)switch(t.tailMode){case"hidden":i=t.tail;for(var r=null;i!==null;)i.alternate!==null&&(r=i),i=i.sibling;r===null?t.tail=null:r.sibling=null;break;case"collapsed":r=t.tail;for(var l=null;r!==null;)r.alternate!==null&&(l=r),r=r.sibling;l===null?i||t.tail===null?t.tail=null:t.tail.sibling=null:l.sibling=null}}function un(t){var i=t.alternate!==null&&t.alternate.child===t.child,r=0,l=0;if(i)for(var f=t.child;f!==null;)r|=f.lanes|f.childLanes,l|=f.subtreeFlags&14680064,l|=f.flags&14680064,f.return=t,f=f.sibling;else for(f=t.child;f!==null;)r|=f.lanes|f.childLanes,l|=f.subtreeFlags,l|=f.flags,f.return=t,f=f.sibling;return t.subtreeFlags|=l,t.childLanes=r,i}function Qg(t,i,r){var l=i.pendingProps;switch(ou(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return un(i),null;case 1:return Tn(i.type)&&sa(),un(i),null;case 3:return l=i.stateNode,ls(),Lt(En),Lt(an),xu(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(t===null||t.child===null)&&(ca(i)?i.flags|=4:t===null||t.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,$n!==null&&(Ku($n),$n=null))),Bu(t,i),un(i),null;case 5:_u(i);var f=Rr(fo.current);if(r=i.type,t!==null&&i.stateNode!=null)th(t,i,r,l,f),t.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!l){if(i.stateNode===null)throw Error(n(166));return un(i),null}if(t=Rr(fi.current),ca(i)){l=i.stateNode,r=i.type;var p=i.memoizedProps;switch(l[ci]=i,l[oo]=p,t=(i.mode&1)!==0,r){case"dialog":Pt("cancel",l),Pt("close",l);break;case"iframe":case"object":case"embed":Pt("load",l);break;case"video":case"audio":for(f=0;f<io.length;f++)Pt(io[f],l);break;case"source":Pt("error",l);break;case"img":case"image":case"link":Pt("error",l),Pt("load",l);break;case"details":Pt("toggle",l);break;case"input":$e(l,p),Pt("invalid",l);break;case"select":l._wrapperState={wasMultiple:!!p.multiple},Pt("invalid",l);break;case"textarea":me(l,p),Pt("invalid",l)}Ze(r,p),f=null;for(var y in p)if(p.hasOwnProperty(y)){var D=p[y];y==="children"?typeof D=="string"?l.textContent!==D&&(p.suppressHydrationWarning!==!0&&na(l.textContent,D,t),f=["children",D]):typeof D=="number"&&l.textContent!==""+D&&(p.suppressHydrationWarning!==!0&&na(l.textContent,D,t),f=["children",""+D]):a.hasOwnProperty(y)&&D!=null&&y==="onScroll"&&Pt("scroll",l)}switch(r){case"input":ct(l),rt(l,p,!0);break;case"textarea":ct(l),Oe(l);break;case"select":case"option":break;default:typeof p.onClick=="function"&&(l.onclick=ia)}l=f,i.updateQueue=l,l!==null&&(i.flags|=4)}else{y=f.nodeType===9?f:f.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Re(r)),t==="http://www.w3.org/1999/xhtml"?r==="script"?(t=y.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof l.is=="string"?t=y.createElement(r,{is:l.is}):(t=y.createElement(r),r==="select"&&(y=t,l.multiple?y.multiple=!0:l.size&&(y.size=l.size))):t=y.createElementNS(t,r),t[ci]=i,t[oo]=l,eh(t,i,!1,!1),i.stateNode=t;e:{switch(y=st(r,l),r){case"dialog":Pt("cancel",t),Pt("close",t),f=l;break;case"iframe":case"object":case"embed":Pt("load",t),f=l;break;case"video":case"audio":for(f=0;f<io.length;f++)Pt(io[f],t);f=l;break;case"source":Pt("error",t),f=l;break;case"img":case"image":case"link":Pt("error",t),Pt("load",t),f=l;break;case"details":Pt("toggle",t),f=l;break;case"input":$e(t,l),f=Ve(t,l),Pt("invalid",t);break;case"option":f=l;break;case"select":t._wrapperState={wasMultiple:!!l.multiple},f=V({},l,{value:void 0}),Pt("invalid",t);break;case"textarea":me(t,l),f=ge(t,l),Pt("invalid",t);break;default:f=l}Ze(r,f),D=f;for(p in D)if(D.hasOwnProperty(p)){var F=D[p];p==="style"?Ge(t,F):p==="dangerouslySetInnerHTML"?(F=F?F.__html:void 0,F!=null&&We(t,F)):p==="children"?typeof F=="string"?(r!=="textarea"||F!=="")&&ue(t,F):typeof F=="number"&&ue(t,""+F):p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&p!=="autoFocus"&&(a.hasOwnProperty(p)?F!=null&&p==="onScroll"&&Pt("scroll",t):F!=null&&P(t,p,F,y))}switch(r){case"input":ct(t),rt(t,l,!1);break;case"textarea":ct(t),Oe(t);break;case"option":l.value!=null&&t.setAttribute("value",""+Se(l.value));break;case"select":t.multiple=!!l.multiple,p=l.value,p!=null?$(t,!!l.multiple,p,!1):l.defaultValue!=null&&$(t,!!l.multiple,l.defaultValue,!0);break;default:typeof f.onClick=="function"&&(t.onclick=ia)}switch(r){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}}l&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return un(i),null;case 6:if(t&&i.stateNode!=null)nh(t,i,t.memoizedProps,l);else{if(typeof l!="string"&&i.stateNode===null)throw Error(n(166));if(r=Rr(fo.current),Rr(fi.current),ca(i)){if(l=i.stateNode,r=i.memoizedProps,l[ci]=i,(p=l.nodeValue!==r)&&(t=Dn,t!==null))switch(t.tag){case 3:na(l.nodeValue,r,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&na(l.nodeValue,r,(t.mode&1)!==0)}p&&(i.flags|=4)}else l=(r.nodeType===9?r:r.ownerDocument).createTextNode(l),l[ci]=i,i.stateNode=l}return un(i),null;case 13:if(Lt(It),l=i.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Ut&&Un!==null&&(i.mode&1)!==0&&(i.flags&128)===0)sd(),rs(),i.flags|=98560,p=!1;else if(p=ca(i),l!==null&&l.dehydrated!==null){if(t===null){if(!p)throw Error(n(318));if(p=i.memoizedState,p=p!==null?p.dehydrated:null,!p)throw Error(n(317));p[ci]=i}else rs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;un(i),p=!1}else $n!==null&&(Ku($n),$n=null),p=!0;if(!p)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=r,i):(l=l!==null,l!==(t!==null&&t.memoizedState!==null)&&l&&(i.child.flags|=8192,(i.mode&1)!==0&&(t===null||(It.current&1)!==0?Yt===0&&(Yt=3):Zu())),i.updateQueue!==null&&(i.flags|=4),un(i),null);case 4:return ls(),Bu(t,i),t===null&&ro(i.stateNode.containerInfo),un(i),null;case 10:return du(i.type._context),un(i),null;case 17:return Tn(i.type)&&sa(),un(i),null;case 19:if(Lt(It),p=i.memoizedState,p===null)return un(i),null;if(l=(i.flags&128)!==0,y=p.rendering,y===null)if(l)_o(p,!1);else{if(Yt!==0||t!==null&&(t.flags&128)!==0)for(t=i.child;t!==null;){if(y=ga(t),y!==null){for(i.flags|=128,_o(p,!1),l=y.updateQueue,l!==null&&(i.updateQueue=l,i.flags|=4),i.subtreeFlags=0,l=r,r=i.child;r!==null;)p=r,t=l,p.flags&=14680066,y=p.alternate,y===null?(p.childLanes=0,p.lanes=t,p.child=null,p.subtreeFlags=0,p.memoizedProps=null,p.memoizedState=null,p.updateQueue=null,p.dependencies=null,p.stateNode=null):(p.childLanes=y.childLanes,p.lanes=y.lanes,p.child=y.child,p.subtreeFlags=0,p.deletions=null,p.memoizedProps=y.memoizedProps,p.memoizedState=y.memoizedState,p.updateQueue=y.updateQueue,p.type=y.type,t=y.dependencies,p.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),r=r.sibling;return Rt(It,It.current&1|2),i.child}t=t.sibling}p.tail!==null&&Ue()>ds&&(i.flags|=128,l=!0,_o(p,!1),i.lanes=4194304)}else{if(!l)if(t=ga(y),t!==null){if(i.flags|=128,l=!0,r=t.updateQueue,r!==null&&(i.updateQueue=r,i.flags|=4),_o(p,!0),p.tail===null&&p.tailMode==="hidden"&&!y.alternate&&!Ut)return un(i),null}else 2*Ue()-p.renderingStartTime>ds&&r!==1073741824&&(i.flags|=128,l=!0,_o(p,!1),i.lanes=4194304);p.isBackwards?(y.sibling=i.child,i.child=y):(r=p.last,r!==null?r.sibling=y:i.child=y,p.last=y)}return p.tail!==null?(i=p.tail,p.rendering=i,p.tail=i.sibling,p.renderingStartTime=Ue(),i.sibling=null,r=It.current,Rt(It,l?r&1|2:r&1),i):(un(i),null);case 22:case 23:return Qu(),l=i.memoizedState!==null,t!==null&&t.memoizedState!==null!==l&&(i.flags|=8192),l&&(i.mode&1)!==0?(Nn&1073741824)!==0&&(un(i),i.subtreeFlags&6&&(i.flags|=8192)):un(i),null;case 24:return null;case 25:return null}throw Error(n(156,i.tag))}function Zg(t,i){switch(ou(i),i.tag){case 1:return Tn(i.type)&&sa(),t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 3:return ls(),Lt(En),Lt(an),xu(),t=i.flags,(t&65536)!==0&&(t&128)===0?(i.flags=t&-65537|128,i):null;case 5:return _u(i),null;case 13:if(Lt(It),t=i.memoizedState,t!==null&&t.dehydrated!==null){if(i.alternate===null)throw Error(n(340));rs()}return t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 19:return Lt(It),null;case 4:return ls(),null;case 10:return du(i.type._context),null;case 22:case 23:return Qu(),null;case 24:return null;default:return null}}var wa=!1,cn=!1,Jg=typeof WeakSet=="function"?WeakSet:Set,Ie=null;function cs(t,i){var r=t.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(l){zt(t,i,l)}else r.current=null}function zu(t,i,r){try{r()}catch(l){zt(t,i,l)}}var ih=!1;function e_(t,i){if(Ql=Xo,t=If(),Vl(t)){if("selectionStart"in t)var r={start:t.selectionStart,end:t.selectionEnd};else e:{r=(r=t.ownerDocument)&&r.defaultView||window;var l=r.getSelection&&r.getSelection();if(l&&l.rangeCount!==0){r=l.anchorNode;var f=l.anchorOffset,p=l.focusNode;l=l.focusOffset;try{r.nodeType,p.nodeType}catch{r=null;break e}var y=0,D=-1,F=-1,J=0,pe=0,ve=t,he=null;t:for(;;){for(var be;ve!==r||f!==0&&ve.nodeType!==3||(D=y+f),ve!==p||l!==0&&ve.nodeType!==3||(F=y+l),ve.nodeType===3&&(y+=ve.nodeValue.length),(be=ve.firstChild)!==null;)he=ve,ve=be;for(;;){if(ve===t)break t;if(he===r&&++J===f&&(D=y),he===p&&++pe===l&&(F=y),(be=ve.nextSibling)!==null)break;ve=he,he=ve.parentNode}ve=be}r=D===-1||F===-1?null:{start:D,end:F}}else r=null}r=r||{start:0,end:0}}else r=null;for(Zl={focusedElem:t,selectionRange:r},Xo=!1,Ie=i;Ie!==null;)if(i=Ie,t=i.child,(i.subtreeFlags&1028)!==0&&t!==null)t.return=i,Ie=t;else for(;Ie!==null;){i=Ie;try{var Fe=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(Fe!==null){var Be=Fe.memoizedProps,Ht=Fe.memoizedState,X=i.stateNode,z=X.getSnapshotBeforeUpdate(i.elementType===i.type?Be:Qn(i.type,Be),Ht);X.__reactInternalSnapshotBeforeUpdate=z}break;case 3:var j=i.stateNode.containerInfo;j.nodeType===1?j.textContent="":j.nodeType===9&&j.documentElement&&j.removeChild(j.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(n(163))}}catch(ye){zt(i,i.return,ye)}if(t=i.sibling,t!==null){t.return=i.return,Ie=t;break}Ie=i.return}return Fe=ih,ih=!1,Fe}function vo(t,i,r){var l=i.updateQueue;if(l=l!==null?l.lastEffect:null,l!==null){var f=l=l.next;do{if((f.tag&t)===t){var p=f.destroy;f.destroy=void 0,p!==void 0&&zu(i,r,p)}f=f.next}while(f!==l)}}function Aa(t,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var l=r.create;r.destroy=l()}r=r.next}while(r!==i)}}function ku(t){var i=t.ref;if(i!==null){var r=t.stateNode;switch(t.tag){case 5:t=r;break;default:t=r}typeof i=="function"?i(t):i.current=t}}function rh(t){var i=t.alternate;i!==null&&(t.alternate=null,rh(i)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(i=t.stateNode,i!==null&&(delete i[ci],delete i[oo],delete i[nu],delete i[Fg],delete i[Og])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function sh(t){return t.tag===5||t.tag===3||t.tag===4}function oh(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||sh(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Hu(t,i,r){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?r.nodeType===8?r.parentNode.insertBefore(t,i):r.insertBefore(t,i):(r.nodeType===8?(i=r.parentNode,i.insertBefore(t,r)):(i=r,i.appendChild(t)),r=r._reactRootContainer,r!=null||i.onclick!==null||(i.onclick=ia));else if(l!==4&&(t=t.child,t!==null))for(Hu(t,i,r),t=t.sibling;t!==null;)Hu(t,i,r),t=t.sibling}function Gu(t,i,r){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?r.insertBefore(t,i):r.appendChild(t);else if(l!==4&&(t=t.child,t!==null))for(Gu(t,i,r),t=t.sibling;t!==null;)Gu(t,i,r),t=t.sibling}var en=null,Zn=!1;function er(t,i,r){for(r=r.child;r!==null;)ah(t,i,r),r=r.sibling}function ah(t,i,r){if(gt&&typeof gt.onCommitFiberUnmount=="function")try{gt.onCommitFiberUnmount(yn,r)}catch{}switch(r.tag){case 5:cn||cs(r,i);case 6:var l=en,f=Zn;en=null,er(t,i,r),en=l,Zn=f,en!==null&&(Zn?(t=en,r=r.stateNode,t.nodeType===8?t.parentNode.removeChild(r):t.removeChild(r)):en.removeChild(r.stateNode));break;case 18:en!==null&&(Zn?(t=en,r=r.stateNode,t.nodeType===8?tu(t.parentNode,r):t.nodeType===1&&tu(t,r),Ks(t)):tu(en,r.stateNode));break;case 4:l=en,f=Zn,en=r.stateNode.containerInfo,Zn=!0,er(t,i,r),en=l,Zn=f;break;case 0:case 11:case 14:case 15:if(!cn&&(l=r.updateQueue,l!==null&&(l=l.lastEffect,l!==null))){f=l=l.next;do{var p=f,y=p.destroy;p=p.tag,y!==void 0&&((p&2)!==0||(p&4)!==0)&&zu(r,i,y),f=f.next}while(f!==l)}er(t,i,r);break;case 1:if(!cn&&(cs(r,i),l=r.stateNode,typeof l.componentWillUnmount=="function"))try{l.props=r.memoizedProps,l.state=r.memoizedState,l.componentWillUnmount()}catch(D){zt(r,i,D)}er(t,i,r);break;case 21:er(t,i,r);break;case 22:r.mode&1?(cn=(l=cn)||r.memoizedState!==null,er(t,i,r),cn=l):er(t,i,r);break;default:er(t,i,r)}}function lh(t){var i=t.updateQueue;if(i!==null){t.updateQueue=null;var r=t.stateNode;r===null&&(r=t.stateNode=new Jg),i.forEach(function(l){var f=u_.bind(null,t,l);r.has(l)||(r.add(l),l.then(f,f))})}}function Jn(t,i){var r=i.deletions;if(r!==null)for(var l=0;l<r.length;l++){var f=r[l];try{var p=t,y=i,D=y;e:for(;D!==null;){switch(D.tag){case 5:en=D.stateNode,Zn=!1;break e;case 3:en=D.stateNode.containerInfo,Zn=!0;break e;case 4:en=D.stateNode.containerInfo,Zn=!0;break e}D=D.return}if(en===null)throw Error(n(160));ah(p,y,f),en=null,Zn=!1;var F=f.alternate;F!==null&&(F.return=null),f.return=null}catch(J){zt(f,i,J)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)uh(i,t),i=i.sibling}function uh(t,i){var r=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Jn(i,t),hi(t),l&4){try{vo(3,t,t.return),Aa(3,t)}catch(Be){zt(t,t.return,Be)}try{vo(5,t,t.return)}catch(Be){zt(t,t.return,Be)}}break;case 1:Jn(i,t),hi(t),l&512&&r!==null&&cs(r,r.return);break;case 5:if(Jn(i,t),hi(t),l&512&&r!==null&&cs(r,r.return),t.flags&32){var f=t.stateNode;try{ue(f,"")}catch(Be){zt(t,t.return,Be)}}if(l&4&&(f=t.stateNode,f!=null)){var p=t.memoizedProps,y=r!==null?r.memoizedProps:p,D=t.type,F=t.updateQueue;if(t.updateQueue=null,F!==null)try{D==="input"&&p.type==="radio"&&p.name!=null&&ze(f,p),st(D,y);var J=st(D,p);for(y=0;y<F.length;y+=2){var pe=F[y],ve=F[y+1];pe==="style"?Ge(f,ve):pe==="dangerouslySetInnerHTML"?We(f,ve):pe==="children"?ue(f,ve):P(f,pe,ve,J)}switch(D){case"input":ht(f,p);break;case"textarea":xe(f,p);break;case"select":var he=f._wrapperState.wasMultiple;f._wrapperState.wasMultiple=!!p.multiple;var be=p.value;be!=null?$(f,!!p.multiple,be,!1):he!==!!p.multiple&&(p.defaultValue!=null?$(f,!!p.multiple,p.defaultValue,!0):$(f,!!p.multiple,p.multiple?[]:"",!1))}f[oo]=p}catch(Be){zt(t,t.return,Be)}}break;case 6:if(Jn(i,t),hi(t),l&4){if(t.stateNode===null)throw Error(n(162));f=t.stateNode,p=t.memoizedProps;try{f.nodeValue=p}catch(Be){zt(t,t.return,Be)}}break;case 3:if(Jn(i,t),hi(t),l&4&&r!==null&&r.memoizedState.isDehydrated)try{Ks(i.containerInfo)}catch(Be){zt(t,t.return,Be)}break;case 4:Jn(i,t),hi(t);break;case 13:Jn(i,t),hi(t),f=t.child,f.flags&8192&&(p=f.memoizedState!==null,f.stateNode.isHidden=p,!p||f.alternate!==null&&f.alternate.memoizedState!==null||(Xu=Ue())),l&4&&lh(t);break;case 22:if(pe=r!==null&&r.memoizedState!==null,t.mode&1?(cn=(J=cn)||pe,Jn(i,t),cn=J):Jn(i,t),hi(t),l&8192){if(J=t.memoizedState!==null,(t.stateNode.isHidden=J)&&!pe&&(t.mode&1)!==0)for(Ie=t,pe=t.child;pe!==null;){for(ve=Ie=pe;Ie!==null;){switch(he=Ie,be=he.child,he.tag){case 0:case 11:case 14:case 15:vo(4,he,he.return);break;case 1:cs(he,he.return);var Fe=he.stateNode;if(typeof Fe.componentWillUnmount=="function"){l=he,r=he.return;try{i=l,Fe.props=i.memoizedProps,Fe.state=i.memoizedState,Fe.componentWillUnmount()}catch(Be){zt(l,r,Be)}}break;case 5:cs(he,he.return);break;case 22:if(he.memoizedState!==null){dh(ve);continue}}be!==null?(be.return=he,Ie=be):dh(ve)}pe=pe.sibling}e:for(pe=null,ve=t;;){if(ve.tag===5){if(pe===null){pe=ve;try{f=ve.stateNode,J?(p=f.style,typeof p.setProperty=="function"?p.setProperty("display","none","important"):p.display="none"):(D=ve.stateNode,F=ve.memoizedProps.style,y=F!=null&&F.hasOwnProperty("display")?F.display:null,D.style.display=Ye("display",y))}catch(Be){zt(t,t.return,Be)}}}else if(ve.tag===6){if(pe===null)try{ve.stateNode.nodeValue=J?"":ve.memoizedProps}catch(Be){zt(t,t.return,Be)}}else if((ve.tag!==22&&ve.tag!==23||ve.memoizedState===null||ve===t)&&ve.child!==null){ve.child.return=ve,ve=ve.child;continue}if(ve===t)break e;for(;ve.sibling===null;){if(ve.return===null||ve.return===t)break e;pe===ve&&(pe=null),ve=ve.return}pe===ve&&(pe=null),ve.sibling.return=ve.return,ve=ve.sibling}}break;case 19:Jn(i,t),hi(t),l&4&&lh(t);break;case 21:break;default:Jn(i,t),hi(t)}}function hi(t){var i=t.flags;if(i&2){try{e:{for(var r=t.return;r!==null;){if(sh(r)){var l=r;break e}r=r.return}throw Error(n(160))}switch(l.tag){case 5:var f=l.stateNode;l.flags&32&&(ue(f,""),l.flags&=-33);var p=oh(t);Gu(t,p,f);break;case 3:case 4:var y=l.stateNode.containerInfo,D=oh(t);Hu(t,D,y);break;default:throw Error(n(161))}}catch(F){zt(t,t.return,F)}t.flags&=-3}i&4096&&(t.flags&=-4097)}function t_(t,i,r){Ie=t,ch(t)}function ch(t,i,r){for(var l=(t.mode&1)!==0;Ie!==null;){var f=Ie,p=f.child;if(f.tag===22&&l){var y=f.memoizedState!==null||wa;if(!y){var D=f.alternate,F=D!==null&&D.memoizedState!==null||cn;D=wa;var J=cn;if(wa=y,(cn=F)&&!J)for(Ie=f;Ie!==null;)y=Ie,F=y.child,y.tag===22&&y.memoizedState!==null?hh(f):F!==null?(F.return=y,Ie=F):hh(f);for(;p!==null;)Ie=p,ch(p),p=p.sibling;Ie=f,wa=D,cn=J}fh(t)}else(f.subtreeFlags&8772)!==0&&p!==null?(p.return=f,Ie=p):fh(t)}}function fh(t){for(;Ie!==null;){var i=Ie;if((i.flags&8772)!==0){var r=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:cn||Aa(5,i);break;case 1:var l=i.stateNode;if(i.flags&4&&!cn)if(r===null)l.componentDidMount();else{var f=i.elementType===i.type?r.memoizedProps:Qn(i.type,r.memoizedProps);l.componentDidUpdate(f,r.memoizedState,l.__reactInternalSnapshotBeforeUpdate)}var p=i.updateQueue;p!==null&&dd(i,p,l);break;case 3:var y=i.updateQueue;if(y!==null){if(r=null,i.child!==null)switch(i.child.tag){case 5:r=i.child.stateNode;break;case 1:r=i.child.stateNode}dd(i,y,r)}break;case 5:var D=i.stateNode;if(r===null&&i.flags&4){r=D;var F=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":F.autoFocus&&r.focus();break;case"img":F.src&&(r.src=F.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var J=i.alternate;if(J!==null){var pe=J.memoizedState;if(pe!==null){var ve=pe.dehydrated;ve!==null&&Ks(ve)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(n(163))}cn||i.flags&512&&ku(i)}catch(he){zt(i,i.return,he)}}if(i===t){Ie=null;break}if(r=i.sibling,r!==null){r.return=i.return,Ie=r;break}Ie=i.return}}function dh(t){for(;Ie!==null;){var i=Ie;if(i===t){Ie=null;break}var r=i.sibling;if(r!==null){r.return=i.return,Ie=r;break}Ie=i.return}}function hh(t){for(;Ie!==null;){var i=Ie;try{switch(i.tag){case 0:case 11:case 15:var r=i.return;try{Aa(4,i)}catch(F){zt(i,r,F)}break;case 1:var l=i.stateNode;if(typeof l.componentDidMount=="function"){var f=i.return;try{l.componentDidMount()}catch(F){zt(i,f,F)}}var p=i.return;try{ku(i)}catch(F){zt(i,p,F)}break;case 5:var y=i.return;try{ku(i)}catch(F){zt(i,y,F)}}}catch(F){zt(i,i.return,F)}if(i===t){Ie=null;break}var D=i.sibling;if(D!==null){D.return=i.return,Ie=D;break}Ie=i.return}}var n_=Math.ceil,Ra=U.ReactCurrentDispatcher,Vu=U.ReactCurrentOwner,Wn=U.ReactCurrentBatchConfig,xt=0,Qt=null,Gt=null,tn=0,Nn=0,fs=Ki(0),Yt=0,xo=null,Pr=0,Ca=0,Wu=0,So=null,An=null,Xu=0,ds=1/0,Ri=null,Pa=!1,Yu=null,tr=null,La=!1,nr=null,ba=0,yo=0,qu=null,Da=-1,Ua=0;function gn(){return(xt&6)!==0?Ue():Da!==-1?Da:Da=Ue()}function ir(t){return(t.mode&1)===0?1:(xt&2)!==0&&tn!==0?tn&-tn:zg.transition!==null?(Ua===0&&(Ua=Go()),Ua):(t=Tt,t!==0||(t=window.event,t=t===void 0?16:mf(t.type)),t)}function ei(t,i,r,l){if(50<yo)throw yo=0,qu=null,Error(n(185));Ws(t,r,l),((xt&2)===0||t!==Qt)&&(t===Qt&&((xt&2)===0&&(Ca|=r),Yt===4&&rr(t,tn)),Rn(t,l),r===1&&xt===0&&(i.mode&1)===0&&(ds=Ue()+500,aa&&Qi()))}function Rn(t,i){var r=t.callbackNode;Mn(t,i);var l=zn(t,t===Qt?tn:0);if(l===0)r!==null&&Le(r),t.callbackNode=null,t.callbackPriority=0;else if(i=l&-l,t.callbackPriority!==i){if(r!=null&&Le(r),i===1)t.tag===0?Bg(mh.bind(null,t)):ed(mh.bind(null,t)),Ng(function(){(xt&6)===0&&Qi()}),r=null;else{switch(af(l)){case 1:r=it;break;case 4:r=ot;break;case 16:r=At;break;case 536870912:r=kt;break;default:r=At}r=Eh(r,ph.bind(null,t))}t.callbackPriority=i,t.callbackNode=r}}function ph(t,i){if(Da=-1,Ua=0,(xt&6)!==0)throw Error(n(327));var r=t.callbackNode;if(hs()&&t.callbackNode!==r)return null;var l=zn(t,t===Qt?tn:0);if(l===0)return null;if((l&30)!==0||(l&t.expiredLanes)!==0||i)i=Na(t,l);else{i=l;var f=xt;xt|=2;var p=_h();(Qt!==t||tn!==i)&&(Ri=null,ds=Ue()+500,br(t,i));do try{s_();break}catch(D){gh(t,D)}while(!0);fu(),Ra.current=p,xt=f,Gt!==null?i=0:(Qt=null,tn=0,i=Yt)}if(i!==0){if(i===2&&(f=yr(t),f!==0&&(l=f,i=ju(t,f))),i===1)throw r=xo,br(t,0),rr(t,l),Rn(t,Ue()),r;if(i===6)rr(t,l);else{if(f=t.current.alternate,(l&30)===0&&!i_(f)&&(i=Na(t,l),i===2&&(p=yr(t),p!==0&&(l=p,i=ju(t,p))),i===1))throw r=xo,br(t,0),rr(t,l),Rn(t,Ue()),r;switch(t.finishedWork=f,t.finishedLanes=l,i){case 0:case 1:throw Error(n(345));case 2:Dr(t,An,Ri);break;case 3:if(rr(t,l),(l&130023424)===l&&(i=Xu+500-Ue(),10<i)){if(zn(t,0)!==0)break;if(f=t.suspendedLanes,(f&l)!==l){gn(),t.pingedLanes|=t.suspendedLanes&f;break}t.timeoutHandle=eu(Dr.bind(null,t,An,Ri),i);break}Dr(t,An,Ri);break;case 4:if(rr(t,l),(l&4194240)===l)break;for(i=t.eventTimes,f=-1;0<l;){var y=31-pn(l);p=1<<y,y=i[y],y>f&&(f=y),l&=~p}if(l=f,l=Ue()-l,l=(120>l?120:480>l?480:1080>l?1080:1920>l?1920:3e3>l?3e3:4320>l?4320:1960*n_(l/1960))-l,10<l){t.timeoutHandle=eu(Dr.bind(null,t,An,Ri),l);break}Dr(t,An,Ri);break;case 5:Dr(t,An,Ri);break;default:throw Error(n(329))}}}return Rn(t,Ue()),t.callbackNode===r?ph.bind(null,t):null}function ju(t,i){var r=So;return t.current.memoizedState.isDehydrated&&(br(t,i).flags|=256),t=Na(t,i),t!==2&&(i=An,An=r,i!==null&&Ku(i)),t}function Ku(t){An===null?An=t:An.push.apply(An,t)}function i_(t){for(var i=t;;){if(i.flags&16384){var r=i.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var l=0;l<r.length;l++){var f=r[l],p=f.getSnapshot;f=f.value;try{if(!Kn(p(),f))return!1}catch{return!1}}}if(r=i.child,i.subtreeFlags&16384&&r!==null)r.return=i,i=r;else{if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function rr(t,i){for(i&=~Wu,i&=~Ca,t.suspendedLanes|=i,t.pingedLanes&=~i,t=t.expirationTimes;0<i;){var r=31-pn(i),l=1<<r;t[r]=-1,i&=~l}}function mh(t){if((xt&6)!==0)throw Error(n(327));hs();var i=zn(t,0);if((i&1)===0)return Rn(t,Ue()),null;var r=Na(t,i);if(t.tag!==0&&r===2){var l=yr(t);l!==0&&(i=l,r=ju(t,l))}if(r===1)throw r=xo,br(t,0),rr(t,i),Rn(t,Ue()),r;if(r===6)throw Error(n(345));return t.finishedWork=t.current.alternate,t.finishedLanes=i,Dr(t,An,Ri),Rn(t,Ue()),null}function $u(t,i){var r=xt;xt|=1;try{return t(i)}finally{xt=r,xt===0&&(ds=Ue()+500,aa&&Qi())}}function Lr(t){nr!==null&&nr.tag===0&&(xt&6)===0&&hs();var i=xt;xt|=1;var r=Wn.transition,l=Tt;try{if(Wn.transition=null,Tt=1,t)return t()}finally{Tt=l,Wn.transition=r,xt=i,(xt&6)===0&&Qi()}}function Qu(){Nn=fs.current,Lt(fs)}function br(t,i){t.finishedWork=null,t.finishedLanes=0;var r=t.timeoutHandle;if(r!==-1&&(t.timeoutHandle=-1,Ug(r)),Gt!==null)for(r=Gt.return;r!==null;){var l=r;switch(ou(l),l.tag){case 1:l=l.type.childContextTypes,l!=null&&sa();break;case 3:ls(),Lt(En),Lt(an),xu();break;case 5:_u(l);break;case 4:ls();break;case 13:Lt(It);break;case 19:Lt(It);break;case 10:du(l.type._context);break;case 22:case 23:Qu()}r=r.return}if(Qt=t,Gt=t=sr(t.current,null),tn=Nn=i,Yt=0,xo=null,Wu=Ca=Pr=0,An=So=null,Ar!==null){for(i=0;i<Ar.length;i++)if(r=Ar[i],l=r.interleaved,l!==null){r.interleaved=null;var f=l.next,p=r.pending;if(p!==null){var y=p.next;p.next=f,l.next=y}r.pending=l}Ar=null}return t}function gh(t,i){do{var r=Gt;try{if(fu(),_a.current=ya,va){for(var l=Ft.memoizedState;l!==null;){var f=l.queue;f!==null&&(f.pending=null),l=l.next}va=!1}if(Cr=0,$t=Xt=Ft=null,ho=!1,po=0,Vu.current=null,r===null||r.return===null){Yt=1,xo=i,Gt=null;break}e:{var p=t,y=r.return,D=r,F=i;if(i=tn,D.flags|=32768,F!==null&&typeof F=="object"&&typeof F.then=="function"){var J=F,pe=D,ve=pe.tag;if((pe.mode&1)===0&&(ve===0||ve===11||ve===15)){var he=pe.alternate;he?(pe.updateQueue=he.updateQueue,pe.memoizedState=he.memoizedState,pe.lanes=he.lanes):(pe.updateQueue=null,pe.memoizedState=null)}var be=Hd(y);if(be!==null){be.flags&=-257,Gd(be,y,D,p,i),be.mode&1&&kd(p,J,i),i=be,F=J;var Fe=i.updateQueue;if(Fe===null){var Be=new Set;Be.add(F),i.updateQueue=Be}else Fe.add(F);break e}else{if((i&1)===0){kd(p,J,i),Zu();break e}F=Error(n(426))}}else if(Ut&&D.mode&1){var Ht=Hd(y);if(Ht!==null){(Ht.flags&65536)===0&&(Ht.flags|=256),Gd(Ht,y,D,p,i),uu(us(F,D));break e}}p=F=us(F,D),Yt!==4&&(Yt=2),So===null?So=[p]:So.push(p),p=y;do{switch(p.tag){case 3:p.flags|=65536,i&=-i,p.lanes|=i;var X=Bd(p,F,i);fd(p,X);break e;case 1:D=F;var z=p.type,j=p.stateNode;if((p.flags&128)===0&&(typeof z.getDerivedStateFromError=="function"||j!==null&&typeof j.componentDidCatch=="function"&&(tr===null||!tr.has(j)))){p.flags|=65536,i&=-i,p.lanes|=i;var ye=zd(p,D,i);fd(p,ye);break e}}p=p.return}while(p!==null)}xh(r)}catch(ke){i=ke,Gt===r&&r!==null&&(Gt=r=r.return);continue}break}while(!0)}function _h(){var t=Ra.current;return Ra.current=ya,t===null?ya:t}function Zu(){(Yt===0||Yt===3||Yt===2)&&(Yt=4),Qt===null||(Pr&268435455)===0&&(Ca&268435455)===0||rr(Qt,tn)}function Na(t,i){var r=xt;xt|=2;var l=_h();(Qt!==t||tn!==i)&&(Ri=null,br(t,i));do try{r_();break}catch(f){gh(t,f)}while(!0);if(fu(),xt=r,Ra.current=l,Gt!==null)throw Error(n(261));return Qt=null,tn=0,Yt}function r_(){for(;Gt!==null;)vh(Gt)}function s_(){for(;Gt!==null&&!Xe();)vh(Gt)}function vh(t){var i=Mh(t.alternate,t,Nn);t.memoizedProps=t.pendingProps,i===null?xh(t):Gt=i,Vu.current=null}function xh(t){var i=t;do{var r=i.alternate;if(t=i.return,(i.flags&32768)===0){if(r=Qg(r,i,Nn),r!==null){Gt=r;return}}else{if(r=Zg(r,i),r!==null){r.flags&=32767,Gt=r;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Yt=6,Gt=null;return}}if(i=i.sibling,i!==null){Gt=i;return}Gt=i=t}while(i!==null);Yt===0&&(Yt=5)}function Dr(t,i,r){var l=Tt,f=Wn.transition;try{Wn.transition=null,Tt=1,o_(t,i,r,l)}finally{Wn.transition=f,Tt=l}return null}function o_(t,i,r,l){do hs();while(nr!==null);if((xt&6)!==0)throw Error(n(327));r=t.finishedWork;var f=t.finishedLanes;if(r===null)return null;if(t.finishedWork=null,t.finishedLanes=0,r===t.current)throw Error(n(177));t.callbackNode=null,t.callbackPriority=0;var p=r.lanes|r.childLanes;if(km(t,p),t===Qt&&(Gt=Qt=null,tn=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||La||(La=!0,Eh(At,function(){return hs(),null})),p=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||p){p=Wn.transition,Wn.transition=null;var y=Tt;Tt=1;var D=xt;xt|=4,Vu.current=null,e_(t,r),uh(r,t),Ag(Zl),Xo=!!Ql,Zl=Ql=null,t.current=r,t_(r),Je(),xt=D,Tt=y,Wn.transition=p}else t.current=r;if(La&&(La=!1,nr=t,ba=f),p=t.pendingLanes,p===0&&(tr=null),ft(r.stateNode),Rn(t,Ue()),i!==null)for(l=t.onRecoverableError,r=0;r<i.length;r++)f=i[r],l(f.value,{componentStack:f.stack,digest:f.digest});if(Pa)throw Pa=!1,t=Yu,Yu=null,t;return(ba&1)!==0&&t.tag!==0&&hs(),p=t.pendingLanes,(p&1)!==0?t===qu?yo++:(yo=0,qu=t):yo=0,Qi(),null}function hs(){if(nr!==null){var t=af(ba),i=Wn.transition,r=Tt;try{if(Wn.transition=null,Tt=16>t?16:t,nr===null)var l=!1;else{if(t=nr,nr=null,ba=0,(xt&6)!==0)throw Error(n(331));var f=xt;for(xt|=4,Ie=t.current;Ie!==null;){var p=Ie,y=p.child;if((Ie.flags&16)!==0){var D=p.deletions;if(D!==null){for(var F=0;F<D.length;F++){var J=D[F];for(Ie=J;Ie!==null;){var pe=Ie;switch(pe.tag){case 0:case 11:case 15:vo(8,pe,p)}var ve=pe.child;if(ve!==null)ve.return=pe,Ie=ve;else for(;Ie!==null;){pe=Ie;var he=pe.sibling,be=pe.return;if(rh(pe),pe===J){Ie=null;break}if(he!==null){he.return=be,Ie=he;break}Ie=be}}}var Fe=p.alternate;if(Fe!==null){var Be=Fe.child;if(Be!==null){Fe.child=null;do{var Ht=Be.sibling;Be.sibling=null,Be=Ht}while(Be!==null)}}Ie=p}}if((p.subtreeFlags&2064)!==0&&y!==null)y.return=p,Ie=y;else e:for(;Ie!==null;){if(p=Ie,(p.flags&2048)!==0)switch(p.tag){case 0:case 11:case 15:vo(9,p,p.return)}var X=p.sibling;if(X!==null){X.return=p.return,Ie=X;break e}Ie=p.return}}var z=t.current;for(Ie=z;Ie!==null;){y=Ie;var j=y.child;if((y.subtreeFlags&2064)!==0&&j!==null)j.return=y,Ie=j;else e:for(y=z;Ie!==null;){if(D=Ie,(D.flags&2048)!==0)try{switch(D.tag){case 0:case 11:case 15:Aa(9,D)}}catch(ke){zt(D,D.return,ke)}if(D===y){Ie=null;break e}var ye=D.sibling;if(ye!==null){ye.return=D.return,Ie=ye;break e}Ie=D.return}}if(xt=f,Qi(),gt&&typeof gt.onPostCommitFiberRoot=="function")try{gt.onPostCommitFiberRoot(yn,t)}catch{}l=!0}return l}finally{Tt=r,Wn.transition=i}}return!1}function Sh(t,i,r){i=us(r,i),i=Bd(t,i,1),t=Ji(t,i,1),i=gn(),t!==null&&(Ws(t,1,i),Rn(t,i))}function zt(t,i,r){if(t.tag===3)Sh(t,t,r);else for(;i!==null;){if(i.tag===3){Sh(i,t,r);break}else if(i.tag===1){var l=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(tr===null||!tr.has(l))){t=us(r,t),t=zd(i,t,1),i=Ji(i,t,1),t=gn(),i!==null&&(Ws(i,1,t),Rn(i,t));break}}i=i.return}}function a_(t,i,r){var l=t.pingCache;l!==null&&l.delete(i),i=gn(),t.pingedLanes|=t.suspendedLanes&r,Qt===t&&(tn&r)===r&&(Yt===4||Yt===3&&(tn&130023424)===tn&&500>Ue()-Xu?br(t,0):Wu|=r),Rn(t,i)}function yh(t,i){i===0&&((t.mode&1)===0?i=1:(i=Hi,Hi<<=1,(Hi&130023424)===0&&(Hi=4194304)));var r=gn();t=Ti(t,i),t!==null&&(Ws(t,i,r),Rn(t,r))}function l_(t){var i=t.memoizedState,r=0;i!==null&&(r=i.retryLane),yh(t,r)}function u_(t,i){var r=0;switch(t.tag){case 13:var l=t.stateNode,f=t.memoizedState;f!==null&&(r=f.retryLane);break;case 19:l=t.stateNode;break;default:throw Error(n(314))}l!==null&&l.delete(i),yh(t,r)}var Mh;Mh=function(t,i,r){if(t!==null)if(t.memoizedProps!==i.pendingProps||En.current)wn=!0;else{if((t.lanes&r)===0&&(i.flags&128)===0)return wn=!1,$g(t,i,r);wn=(t.flags&131072)!==0}else wn=!1,Ut&&(i.flags&1048576)!==0&&td(i,ua,i.index);switch(i.lanes=0,i.tag){case 2:var l=i.type;Ta(t,i),t=i.pendingProps;var f=ts(i,an.current);as(i,r),f=Mu(null,i,l,t,f,r);var p=Eu();return i.flags|=1,typeof f=="object"&&f!==null&&typeof f.render=="function"&&f.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Tn(l)?(p=!0,oa(i)):p=!1,i.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,mu(i),f.updater=Ma,i.stateNode=f,f._reactInternals=i,Pu(i,l,t,r),i=Uu(null,i,l,!0,p,r)):(i.tag=0,Ut&&p&&su(i),mn(null,i,f,r),i=i.child),i;case 16:l=i.elementType;e:{switch(Ta(t,i),t=i.pendingProps,f=l._init,l=f(l._payload),i.type=l,f=i.tag=f_(l),t=Qn(l,t),f){case 0:i=Du(null,i,l,t,r);break e;case 1:i=jd(null,i,l,t,r);break e;case 11:i=Vd(null,i,l,t,r);break e;case 14:i=Wd(null,i,l,Qn(l.type,t),r);break e}throw Error(n(306,l,""))}return i;case 0:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Qn(l,f),Du(t,i,l,f,r);case 1:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Qn(l,f),jd(t,i,l,f,r);case 3:e:{if(Kd(i),t===null)throw Error(n(387));l=i.pendingProps,p=i.memoizedState,f=p.element,cd(t,i),ma(i,l,null,r);var y=i.memoizedState;if(l=y.element,p.isDehydrated)if(p={element:l,isDehydrated:!1,cache:y.cache,pendingSuspenseBoundaries:y.pendingSuspenseBoundaries,transitions:y.transitions},i.updateQueue.baseState=p,i.memoizedState=p,i.flags&256){f=us(Error(n(423)),i),i=$d(t,i,l,r,f);break e}else if(l!==f){f=us(Error(n(424)),i),i=$d(t,i,l,r,f);break e}else for(Un=ji(i.stateNode.containerInfo.firstChild),Dn=i,Ut=!0,$n=null,r=ld(i,null,l,r),i.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(rs(),l===f){i=Ai(t,i,r);break e}mn(t,i,l,r)}i=i.child}return i;case 5:return hd(i),t===null&&lu(i),l=i.type,f=i.pendingProps,p=t!==null?t.memoizedProps:null,y=f.children,Jl(l,f)?y=null:p!==null&&Jl(l,p)&&(i.flags|=32),qd(t,i),mn(t,i,y,r),i.child;case 6:return t===null&&lu(i),null;case 13:return Qd(t,i,r);case 4:return gu(i,i.stateNode.containerInfo),l=i.pendingProps,t===null?i.child=ss(i,null,l,r):mn(t,i,l,r),i.child;case 11:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Qn(l,f),Vd(t,i,l,f,r);case 7:return mn(t,i,i.pendingProps,r),i.child;case 8:return mn(t,i,i.pendingProps.children,r),i.child;case 12:return mn(t,i,i.pendingProps.children,r),i.child;case 10:e:{if(l=i.type._context,f=i.pendingProps,p=i.memoizedProps,y=f.value,Rt(da,l._currentValue),l._currentValue=y,p!==null)if(Kn(p.value,y)){if(p.children===f.children&&!En.current){i=Ai(t,i,r);break e}}else for(p=i.child,p!==null&&(p.return=i);p!==null;){var D=p.dependencies;if(D!==null){y=p.child;for(var F=D.firstContext;F!==null;){if(F.context===l){if(p.tag===1){F=wi(-1,r&-r),F.tag=2;var J=p.updateQueue;if(J!==null){J=J.shared;var pe=J.pending;pe===null?F.next=F:(F.next=pe.next,pe.next=F),J.pending=F}}p.lanes|=r,F=p.alternate,F!==null&&(F.lanes|=r),hu(p.return,r,i),D.lanes|=r;break}F=F.next}}else if(p.tag===10)y=p.type===i.type?null:p.child;else if(p.tag===18){if(y=p.return,y===null)throw Error(n(341));y.lanes|=r,D=y.alternate,D!==null&&(D.lanes|=r),hu(y,r,i),y=p.sibling}else y=p.child;if(y!==null)y.return=p;else for(y=p;y!==null;){if(y===i){y=null;break}if(p=y.sibling,p!==null){p.return=y.return,y=p;break}y=y.return}p=y}mn(t,i,f.children,r),i=i.child}return i;case 9:return f=i.type,l=i.pendingProps.children,as(i,r),f=Gn(f),l=l(f),i.flags|=1,mn(t,i,l,r),i.child;case 14:return l=i.type,f=Qn(l,i.pendingProps),f=Qn(l.type,f),Wd(t,i,l,f,r);case 15:return Xd(t,i,i.type,i.pendingProps,r);case 17:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Qn(l,f),Ta(t,i),i.tag=1,Tn(l)?(t=!0,oa(i)):t=!1,as(i,r),Fd(i,l,f),Pu(i,l,f,r),Uu(null,i,l,!0,t,r);case 19:return Jd(t,i,r);case 22:return Yd(t,i,r)}throw Error(n(156,i.tag))};function Eh(t,i){return ee(t,i)}function c_(t,i,r,l){this.tag=t,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xn(t,i,r,l){return new c_(t,i,r,l)}function Ju(t){return t=t.prototype,!(!t||!t.isReactComponent)}function f_(t){if(typeof t=="function")return Ju(t)?1:0;if(t!=null){if(t=t.$$typeof,t===le)return 11;if(t===Q)return 14}return 2}function sr(t,i){var r=t.alternate;return r===null?(r=Xn(t.tag,i,t.key,t.mode),r.elementType=t.elementType,r.type=t.type,r.stateNode=t.stateNode,r.alternate=t,t.alternate=r):(r.pendingProps=i,r.type=t.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=t.flags&14680064,r.childLanes=t.childLanes,r.lanes=t.lanes,r.child=t.child,r.memoizedProps=t.memoizedProps,r.memoizedState=t.memoizedState,r.updateQueue=t.updateQueue,i=t.dependencies,r.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},r.sibling=t.sibling,r.index=t.index,r.ref=t.ref,r}function Ia(t,i,r,l,f,p){var y=2;if(l=t,typeof t=="function")Ju(t)&&(y=1);else if(typeof t=="string")y=5;else e:switch(t){case I:return Ur(r.children,f,p,i);case ce:y=8,f|=8;break;case R:return t=Xn(12,r,i,f|2),t.elementType=R,t.lanes=p,t;case _e:return t=Xn(13,r,i,f),t.elementType=_e,t.lanes=p,t;case k:return t=Xn(19,r,i,f),t.elementType=k,t.lanes=p,t;case ae:return Fa(r,f,p,i);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case b:y=10;break e;case oe:y=9;break e;case le:y=11;break e;case Q:y=14;break e;case re:y=16,l=null;break e}throw Error(n(130,t==null?t:typeof t,""))}return i=Xn(y,r,i,f),i.elementType=t,i.type=l,i.lanes=p,i}function Ur(t,i,r,l){return t=Xn(7,t,l,i),t.lanes=r,t}function Fa(t,i,r,l){return t=Xn(22,t,l,i),t.elementType=ae,t.lanes=r,t.stateNode={isHidden:!1},t}function ec(t,i,r){return t=Xn(6,t,null,i),t.lanes=r,t}function tc(t,i,r){return i=Xn(4,t.children!==null?t.children:[],t.key,i),i.lanes=r,i.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},i}function d_(t,i,r,l,f){this.tag=i,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Xr(0),this.expirationTimes=Xr(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Xr(0),this.identifierPrefix=l,this.onRecoverableError=f,this.mutableSourceEagerHydrationData=null}function nc(t,i,r,l,f,p,y,D,F){return t=new d_(t,i,r,D,F),i===1?(i=1,p===!0&&(i|=8)):i=0,p=Xn(3,null,null,i),t.current=p,p.stateNode=t,p.memoizedState={element:l,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},mu(p),t}function h_(t,i,r){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:O,key:l==null?null:""+l,children:t,containerInfo:i,implementation:r}}function Th(t){if(!t)return $i;t=t._reactInternals;e:{if(vi(t)!==t||t.tag!==1)throw Error(n(170));var i=t;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Tn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(n(171))}if(t.tag===1){var r=t.type;if(Tn(r))return Zf(t,r,i)}return i}function wh(t,i,r,l,f,p,y,D,F){return t=nc(r,l,!0,t,f,p,y,D,F),t.context=Th(null),r=t.current,l=gn(),f=ir(r),p=wi(l,f),p.callback=i??null,Ji(r,p,f),t.current.lanes=f,Ws(t,f,l),Rn(t,l),t}function Oa(t,i,r,l){var f=i.current,p=gn(),y=ir(f);return r=Th(r),i.context===null?i.context=r:i.pendingContext=r,i=wi(p,y),i.payload={element:t},l=l===void 0?null:l,l!==null&&(i.callback=l),t=Ji(f,i,y),t!==null&&(ei(t,f,y,p),pa(t,f,y)),y}function Ba(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Ah(t,i){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var r=t.retryLane;t.retryLane=r!==0&&r<i?r:i}}function ic(t,i){Ah(t,i),(t=t.alternate)&&Ah(t,i)}function p_(){return null}var Rh=typeof reportError=="function"?reportError:function(t){console.error(t)};function rc(t){this._internalRoot=t}za.prototype.render=rc.prototype.render=function(t){var i=this._internalRoot;if(i===null)throw Error(n(409));Oa(t,i,null,null)},za.prototype.unmount=rc.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var i=t.containerInfo;Lr(function(){Oa(null,t,null,null)}),i[Si]=null}};function za(t){this._internalRoot=t}za.prototype.unstable_scheduleHydration=function(t){if(t){var i=cf();t={blockedOn:null,target:t,priority:i};for(var r=0;r<Xi.length&&i!==0&&i<Xi[r].priority;r++);Xi.splice(r,0,t),r===0&&hf(t)}};function sc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function ka(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Ch(){}function m_(t,i,r,l,f){if(f){if(typeof l=="function"){var p=l;l=function(){var J=Ba(y);p.call(J)}}var y=wh(i,l,t,0,null,!1,!1,"",Ch);return t._reactRootContainer=y,t[Si]=y.current,ro(t.nodeType===8?t.parentNode:t),Lr(),y}for(;f=t.lastChild;)t.removeChild(f);if(typeof l=="function"){var D=l;l=function(){var J=Ba(F);D.call(J)}}var F=nc(t,0,!1,null,null,!1,!1,"",Ch);return t._reactRootContainer=F,t[Si]=F.current,ro(t.nodeType===8?t.parentNode:t),Lr(function(){Oa(i,F,r,l)}),F}function Ha(t,i,r,l,f){var p=r._reactRootContainer;if(p){var y=p;if(typeof f=="function"){var D=f;f=function(){var F=Ba(y);D.call(F)}}Oa(i,y,t,f)}else y=m_(r,i,t,f,l);return Ba(y)}lf=function(t){switch(t.tag){case 3:var i=t.stateNode;if(i.current.memoizedState.isDehydrated){var r=Bt(i.pendingLanes);r!==0&&(Pl(i,r|1),Rn(i,Ue()),(xt&6)===0&&(ds=Ue()+500,Qi()))}break;case 13:Lr(function(){var l=Ti(t,1);if(l!==null){var f=gn();ei(l,t,1,f)}}),ic(t,1)}},Ll=function(t){if(t.tag===13){var i=Ti(t,134217728);if(i!==null){var r=gn();ei(i,t,134217728,r)}ic(t,134217728)}},uf=function(t){if(t.tag===13){var i=ir(t),r=Ti(t,i);if(r!==null){var l=gn();ei(r,t,i,l)}ic(t,i)}},cf=function(){return Tt},ff=function(t,i){var r=Tt;try{return Tt=t,i()}finally{Tt=r}},Te=function(t,i,r){switch(i){case"input":if(ht(t,r),i=r.name,r.type==="radio"&&i!=null){for(r=t;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<r.length;i++){var l=r[i];if(l!==t&&l.form===t.form){var f=ra(l);if(!f)throw Error(n(90));Z(l),ht(l,f)}}}break;case"textarea":xe(t,r);break;case"select":i=r.value,i!=null&&$(t,!!r.multiple,i,!1)}},Mt=$u,Et=Lr;var g_={usingClientEntryPoint:!1,Events:[ao,Jr,ra,et,qe,$u]},Mo={findFiberByHostInstance:Mr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},__={bundleType:Mo.bundleType,version:Mo.version,rendererPackageName:Mo.rendererPackageName,rendererConfig:Mo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:U.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=ne(t),t===null?null:t.stateNode},findFiberByHostInstance:Mo.findFiberByHostInstance||p_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ga=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ga.isDisabled&&Ga.supportsFiber)try{yn=Ga.inject(__),gt=Ga}catch{}}return Cn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=g_,Cn.createPortal=function(t,i){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!sc(i))throw Error(n(200));return h_(t,i,null,r)},Cn.createRoot=function(t,i){if(!sc(t))throw Error(n(299));var r=!1,l="",f=Rh;return i!=null&&(i.unstable_strictMode===!0&&(r=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onRecoverableError!==void 0&&(f=i.onRecoverableError)),i=nc(t,1,!1,null,null,r,!1,l,f),t[Si]=i.current,ro(t.nodeType===8?t.parentNode:t),new rc(i)},Cn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var i=t._reactInternals;if(i===void 0)throw typeof t.render=="function"?Error(n(188)):(t=Object.keys(t).join(","),Error(n(268,t)));return t=ne(i),t=t===null?null:t.stateNode,t},Cn.flushSync=function(t){return Lr(t)},Cn.hydrate=function(t,i,r){if(!ka(i))throw Error(n(200));return Ha(null,t,i,!0,r)},Cn.hydrateRoot=function(t,i,r){if(!sc(t))throw Error(n(405));var l=r!=null&&r.hydratedSources||null,f=!1,p="",y=Rh;if(r!=null&&(r.unstable_strictMode===!0&&(f=!0),r.identifierPrefix!==void 0&&(p=r.identifierPrefix),r.onRecoverableError!==void 0&&(y=r.onRecoverableError)),i=wh(i,null,t,1,r??null,f,!1,p,y),t[Si]=i.current,ro(t),l)for(t=0;t<l.length;t++)r=l[t],f=r._getVersion,f=f(r._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[r,f]:i.mutableSourceEagerHydrationData.push(r,f);return new za(i)},Cn.render=function(t,i,r){if(!ka(i))throw Error(n(200));return Ha(null,t,i,!1,r)},Cn.unmountComponentAtNode=function(t){if(!ka(t))throw Error(n(40));return t._reactRootContainer?(Lr(function(){Ha(null,null,t,!1,function(){t._reactRootContainer=null,t[Si]=null})}),!0):!1},Cn.unstable_batchedUpdates=$u,Cn.unstable_renderSubtreeIntoContainer=function(t,i,r,l){if(!ka(r))throw Error(n(200));if(t==null||t._reactInternals===void 0)throw Error(n(38));return Ha(t,i,r,!1,l)},Cn.version="18.3.1-next-f1338f8080-20240426",Cn}var Fh;function A_(){if(Fh)return lc.exports;Fh=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),lc.exports=w_(),lc.exports}var Oh;function R_(){if(Oh)return Va;Oh=1;var o=A_();return Va.createRoot=o.createRoot,Va.hydrateRoot=o.hydrateRoot,Va}var C_=R_();const P_=x_(C_);var Ct=Qc();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Zc="160",L_=0,Bh=1,b_=2,om=1,D_=2,Ui=3,_r=0,Ln=1,Ni=2,Fi=0,Us=1,kc=2,zh=3,kh=4,U_=5,kr=100,N_=101,I_=102,Hh=103,Gh=104,F_=200,O_=201,B_=202,z_=203,Hc=204,Gc=205,k_=206,H_=207,G_=208,V_=209,W_=210,X_=211,Y_=212,q_=213,j_=214,K_=0,$_=1,Q_=2,pl=3,Z_=4,J_=5,ev=6,tv=7,am=0,nv=1,iv=2,mr=0,rv=1,sv=2,ov=3,av=4,lv=5,uv=6,lm=300,Is=301,Fs=302,Vc=303,Wc=304,Ml=306,Xc=1e3,oi=1001,Yc=1002,xn=1003,Vh=1004,fc=1005,qn=1006,cv=1007,bo=1008,gr=1009,fv=1010,dv=1011,Jc=1012,um=1013,hr=1014,pr=1015,Oi=1016,cm=1017,fm=1018,Gr=1020,hv=1021,ai=1023,pv=1024,mv=1025,Vr=1026,Os=1027,gv=1028,dm=1029,_v=1030,hm=1031,pm=1033,dc=33776,hc=33777,pc=33778,mc=33779,Wh=35840,Xh=35841,Yh=35842,qh=35843,mm=36196,jh=37492,Kh=37496,$h=37808,Qh=37809,Zh=37810,Jh=37811,ep=37812,tp=37813,np=37814,ip=37815,rp=37816,sp=37817,op=37818,ap=37819,lp=37820,up=37821,gc=36492,cp=36494,fp=36495,vv=36283,dp=36284,hp=36285,pp=36286,gm=3e3,Wr=3001,xv=3200,Sv=3201,yv=0,Mv=1,jn="",nn="srgb",zi="srgb-linear",ef="display-p3",El="display-p3-linear",ml="linear",bt="srgb",gl="rec709",_l="p3",ps=7680,mp=519,Ev=512,Tv=513,wv=514,_m=515,Av=516,Rv=517,Cv=518,Pv=519,gp=35044,_p="300 es",qc=1035,Ii=2e3,vl=2001;class ks{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(n)===-1&&s[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const u=a.indexOf(n);u!==-1&&a.splice(u,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const a=s.slice(0);for(let u=0,d=a.length;u<d;u++)a[u].call(this,e);e.target=null}}}const fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vp=1234567;const Co=Math.PI/180,Do=180/Math.PI;function Hs(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(fn[o&255]+fn[o>>8&255]+fn[o>>16&255]+fn[o>>24&255]+"-"+fn[e&255]+fn[e>>8&255]+"-"+fn[e>>16&15|64]+fn[e>>24&255]+"-"+fn[n&63|128]+fn[n>>8&255]+"-"+fn[n>>16&255]+fn[n>>24&255]+fn[s&255]+fn[s>>8&255]+fn[s>>16&255]+fn[s>>24&255]).toLowerCase()}function Sn(o,e,n){return Math.max(e,Math.min(n,o))}function tf(o,e){return(o%e+e)%e}function Lv(o,e,n,s,a){return s+(o-e)*(a-s)/(n-e)}function bv(o,e,n){return o!==e?(n-o)/(e-o):0}function Po(o,e,n){return(1-n)*o+n*e}function Dv(o,e,n,s){return Po(o,e,1-Math.exp(-n*s))}function Uv(o,e=1){return e-Math.abs(tf(o,e*2)-e)}function Nv(o,e,n){return o<=e?0:o>=n?1:(o=(o-e)/(n-e),o*o*(3-2*o))}function Iv(o,e,n){return o<=e?0:o>=n?1:(o=(o-e)/(n-e),o*o*o*(o*(o*6-15)+10))}function Fv(o,e){return o+Math.floor(Math.random()*(e-o+1))}function Ov(o,e){return o+Math.random()*(e-o)}function Bv(o){return o*(.5-Math.random())}function zv(o){o!==void 0&&(vp=o);let e=vp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kv(o){return o*Co}function Hv(o){return o*Do}function jc(o){return(o&o-1)===0&&o!==0}function Gv(o){return Math.pow(2,Math.ceil(Math.log(o)/Math.LN2))}function xl(o){return Math.pow(2,Math.floor(Math.log(o)/Math.LN2))}function Vv(o,e,n,s,a){const u=Math.cos,d=Math.sin,c=u(n/2),h=d(n/2),m=u((e+s)/2),g=d((e+s)/2),v=u((e-s)/2),S=d((e-s)/2),M=u((s-e)/2),w=d((s-e)/2);switch(a){case"XYX":o.set(c*g,h*v,h*S,c*m);break;case"YZY":o.set(h*S,c*g,h*v,c*m);break;case"ZXZ":o.set(h*v,h*S,c*g,c*m);break;case"XZX":o.set(c*g,h*w,h*M,c*m);break;case"YXY":o.set(h*M,c*g,h*w,c*m);break;case"ZYZ":o.set(h*w,h*M,c*g,c*m);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Ls(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function _n(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}const xp={DEG2RAD:Co,RAD2DEG:Do,generateUUID:Hs,clamp:Sn,euclideanModulo:tf,mapLinear:Lv,inverseLerp:bv,lerp:Po,damp:Dv,pingpong:Uv,smoothstep:Nv,smootherstep:Iv,randInt:Fv,randFloat:Ov,randFloatSpread:Bv,seededRandom:zv,degToRad:kv,radToDeg:Hv,isPowerOfTwo:jc,ceilPowerOfTwo:Gv,floorPowerOfTwo:xl,setQuaternionFromProperEuler:Vv,normalize:_n,denormalize:Ls};class at{constructor(e=0,n=0){at.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,s=this.y,a=e.elements;return this.x=a[0]*n+a[3]*s+a[6],this.y=a[1]*n+a[4]*s+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(n,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const s=this.dot(e)/n;return Math.acos(Sn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,s=this.y-e.y;return n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,s){return this.x=e.x+(n.x-e.x)*s,this.y=e.y+(n.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const s=Math.cos(n),a=Math.sin(n),u=this.x-e.x,d=this.y-e.y;return this.x=u*s-d*a+e.x,this.y=u*a+d*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class mt{constructor(e,n,s,a,u,d,c,h,m){mt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,s,a,u,d,c,h,m)}set(e,n,s,a,u,d,c,h,m){const g=this.elements;return g[0]=e,g[1]=a,g[2]=c,g[3]=n,g[4]=u,g[5]=h,g[6]=s,g[7]=d,g[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,s=e.elements;return n[0]=s[0],n[1]=s[1],n[2]=s[2],n[3]=s[3],n[4]=s[4],n[5]=s[5],n[6]=s[6],n[7]=s[7],n[8]=s[8],this}extractBasis(e,n,s){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const s=e.elements,a=n.elements,u=this.elements,d=s[0],c=s[3],h=s[6],m=s[1],g=s[4],v=s[7],S=s[2],M=s[5],w=s[8],T=a[0],x=a[3],_=a[6],N=a[1],P=a[4],U=a[7],Y=a[2],O=a[5],I=a[8];return u[0]=d*T+c*N+h*Y,u[3]=d*x+c*P+h*O,u[6]=d*_+c*U+h*I,u[1]=m*T+g*N+v*Y,u[4]=m*x+g*P+v*O,u[7]=m*_+g*U+v*I,u[2]=S*T+M*N+w*Y,u[5]=S*x+M*P+w*O,u[8]=S*_+M*U+w*I,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],s=e[1],a=e[2],u=e[3],d=e[4],c=e[5],h=e[6],m=e[7],g=e[8];return n*d*g-n*c*m-s*u*g+s*c*h+a*u*m-a*d*h}invert(){const e=this.elements,n=e[0],s=e[1],a=e[2],u=e[3],d=e[4],c=e[5],h=e[6],m=e[7],g=e[8],v=g*d-c*m,S=c*h-g*u,M=m*u-d*h,w=n*v+s*S+a*M;if(w===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/w;return e[0]=v*T,e[1]=(a*m-g*s)*T,e[2]=(c*s-a*d)*T,e[3]=S*T,e[4]=(g*n-a*h)*T,e[5]=(a*u-c*n)*T,e[6]=M*T,e[7]=(s*h-m*n)*T,e[8]=(d*n-s*u)*T,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,s,a,u,d,c){const h=Math.cos(u),m=Math.sin(u);return this.set(s*h,s*m,-s*(h*d+m*c)+d+e,-a*m,a*h,-a*(-m*d+h*c)+c+n,0,0,1),this}scale(e,n){return this.premultiply(_c.makeScale(e,n)),this}rotate(e){return this.premultiply(_c.makeRotation(-e)),this}translate(e,n){return this.premultiply(_c.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),s=Math.sin(e);return this.set(n,-s,0,s,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,s=e.elements;for(let a=0;a<9;a++)if(n[a]!==s[a])return!1;return!0}fromArray(e,n=0){for(let s=0;s<9;s++)this.elements[s]=e[s+n];return this}toArray(e=[],n=0){const s=this.elements;return e[n]=s[0],e[n+1]=s[1],e[n+2]=s[2],e[n+3]=s[3],e[n+4]=s[4],e[n+5]=s[5],e[n+6]=s[6],e[n+7]=s[7],e[n+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _c=new mt;function vm(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function Sl(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function Wv(){const o=Sl("canvas");return o.style.display="block",o}const Sp={};function Lo(o){o in Sp||(Sp[o]=!0,console.warn(o))}const yp=new mt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Mp=new mt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Wa={[zi]:{transfer:ml,primaries:gl,toReference:o=>o,fromReference:o=>o},[nn]:{transfer:bt,primaries:gl,toReference:o=>o.convertSRGBToLinear(),fromReference:o=>o.convertLinearToSRGB()},[El]:{transfer:ml,primaries:_l,toReference:o=>o.applyMatrix3(Mp),fromReference:o=>o.applyMatrix3(yp)},[ef]:{transfer:bt,primaries:_l,toReference:o=>o.convertSRGBToLinear().applyMatrix3(Mp),fromReference:o=>o.applyMatrix3(yp).convertLinearToSRGB()}},Xv=new Set([zi,El]),wt={enabled:!0,_workingColorSpace:zi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(o){if(!Xv.has(o))throw new Error(`Unsupported working color space, "${o}".`);this._workingColorSpace=o},convert:function(o,e,n){if(this.enabled===!1||e===n||!e||!n)return o;const s=Wa[e].toReference,a=Wa[n].fromReference;return a(s(o))},fromWorkingColorSpace:function(o,e){return this.convert(o,this._workingColorSpace,e)},toWorkingColorSpace:function(o,e){return this.convert(o,e,this._workingColorSpace)},getPrimaries:function(o){return Wa[o].primaries},getTransfer:function(o){return o===jn?ml:Wa[o].transfer}};function Ns(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function vc(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let ms;class xm{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ms===void 0&&(ms=Sl("canvas")),ms.width=e.width,ms.height=e.height;const s=ms.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ms}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Sl("canvas");n.width=e.width,n.height=e.height;const s=n.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const a=s.getImageData(0,0,e.width,e.height),u=a.data;for(let d=0;d<u.length;d++)u[d]=Ns(u[d]/255)*255;return s.putImageData(a,0,0),n}else if(e.data){const n=e.data.slice(0);for(let s=0;s<n.length;s++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[s]=Math.floor(Ns(n[s]/255)*255):n[s]=Ns(n[s]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Yv=0;class Sm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yv++}),this.uuid=Hs(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},a=this.data;if(a!==null){let u;if(Array.isArray(a)){u=[];for(let d=0,c=a.length;d<c;d++)a[d].isDataTexture?u.push(xc(a[d].image)):u.push(xc(a[d]))}else u=xc(a);s.url=u}return n||(e.images[this.uuid]=s),s}}function xc(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?xm.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let qv=0;class On extends ks{constructor(e=On.DEFAULT_IMAGE,n=On.DEFAULT_MAPPING,s=oi,a=oi,u=qn,d=bo,c=ai,h=gr,m=On.DEFAULT_ANISOTROPY,g=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qv++}),this.uuid=Hs(),this.name="",this.source=new Sm(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=s,this.wrapT=a,this.magFilter=u,this.minFilter=d,this.anisotropy=m,this.format=c,this.internalFormat=null,this.type=h,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new mt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof g=="string"?this.colorSpace=g:(Lo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=g===Wr?nn:jn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),n||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==lm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Xc:e.x=e.x-Math.floor(e.x);break;case oi:e.x=e.x<0?0:1;break;case Yc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Xc:e.y=e.y-Math.floor(e.y);break;case oi:e.y=e.y<0?0:1;break;case Yc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Lo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===nn?Wr:gm}set encoding(e){Lo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Wr?nn:jn}}On.DEFAULT_IMAGE=null;On.DEFAULT_MAPPING=lm;On.DEFAULT_ANISOTROPY=1;class rn{constructor(e=0,n=0,s=0,a=1){rn.prototype.isVector4=!0,this.x=e,this.y=n,this.z=s,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,s,a){return this.x=e,this.y=n,this.z=s,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,s=this.y,a=this.z,u=this.w,d=e.elements;return this.x=d[0]*n+d[4]*s+d[8]*a+d[12]*u,this.y=d[1]*n+d[5]*s+d[9]*a+d[13]*u,this.z=d[2]*n+d[6]*s+d[10]*a+d[14]*u,this.w=d[3]*n+d[7]*s+d[11]*a+d[15]*u,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,s,a,u;const h=e.elements,m=h[0],g=h[4],v=h[8],S=h[1],M=h[5],w=h[9],T=h[2],x=h[6],_=h[10];if(Math.abs(g-S)<.01&&Math.abs(v-T)<.01&&Math.abs(w-x)<.01){if(Math.abs(g+S)<.1&&Math.abs(v+T)<.1&&Math.abs(w+x)<.1&&Math.abs(m+M+_-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const P=(m+1)/2,U=(M+1)/2,Y=(_+1)/2,O=(g+S)/4,I=(v+T)/4,ce=(w+x)/4;return P>U&&P>Y?P<.01?(s=0,a=.707106781,u=.707106781):(s=Math.sqrt(P),a=O/s,u=I/s):U>Y?U<.01?(s=.707106781,a=0,u=.707106781):(a=Math.sqrt(U),s=O/a,u=ce/a):Y<.01?(s=.707106781,a=.707106781,u=0):(u=Math.sqrt(Y),s=I/u,a=ce/u),this.set(s,a,u,n),this}let N=Math.sqrt((x-w)*(x-w)+(v-T)*(v-T)+(S-g)*(S-g));return Math.abs(N)<.001&&(N=1),this.x=(x-w)/N,this.y=(v-T)/N,this.z=(S-g)/N,this.w=Math.acos((m+M+_-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(n,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,s){return this.x=e.x+(n.x-e.x)*s,this.y=e.y+(n.y-e.y)*s,this.z=e.z+(n.z-e.z)*s,this.w=e.w+(n.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class jv extends ks{constructor(e=1,n=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new rn(0,0,e,n),this.scissorTest=!1,this.viewport=new rn(0,0,e,n);const a={width:e,height:n,depth:1};s.encoding!==void 0&&(Lo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),s.colorSpace=s.encoding===Wr?nn:jn),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},s),this.texture=new On(a,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=s.generateMipmaps,this.texture.internalFormat=s.internalFormat,this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}setSize(e,n,s=1){(this.width!==e||this.height!==n||this.depth!==s)&&(this.width=e,this.height=n,this.depth=s,this.texture.image.width=e,this.texture.image.height=n,this.texture.image.depth=s,this.dispose()),this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Sm(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class li extends jv{constructor(e=1,n=1,s={}){super(e,n,s),this.isWebGLRenderTarget=!0}}class ym extends On{constructor(e=null,n=1,s=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:s,depth:a},this.magFilter=xn,this.minFilter=xn,this.wrapR=oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Kv extends On{constructor(e=null,n=1,s=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:s,depth:a},this.magFilter=xn,this.minFilter=xn,this.wrapR=oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Uo{constructor(e=0,n=0,s=0,a=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=s,this._w=a}static slerpFlat(e,n,s,a,u,d,c){let h=s[a+0],m=s[a+1],g=s[a+2],v=s[a+3];const S=u[d+0],M=u[d+1],w=u[d+2],T=u[d+3];if(c===0){e[n+0]=h,e[n+1]=m,e[n+2]=g,e[n+3]=v;return}if(c===1){e[n+0]=S,e[n+1]=M,e[n+2]=w,e[n+3]=T;return}if(v!==T||h!==S||m!==M||g!==w){let x=1-c;const _=h*S+m*M+g*w+v*T,N=_>=0?1:-1,P=1-_*_;if(P>Number.EPSILON){const Y=Math.sqrt(P),O=Math.atan2(Y,_*N);x=Math.sin(x*O)/Y,c=Math.sin(c*O)/Y}const U=c*N;if(h=h*x+S*U,m=m*x+M*U,g=g*x+w*U,v=v*x+T*U,x===1-c){const Y=1/Math.sqrt(h*h+m*m+g*g+v*v);h*=Y,m*=Y,g*=Y,v*=Y}}e[n]=h,e[n+1]=m,e[n+2]=g,e[n+3]=v}static multiplyQuaternionsFlat(e,n,s,a,u,d){const c=s[a],h=s[a+1],m=s[a+2],g=s[a+3],v=u[d],S=u[d+1],M=u[d+2],w=u[d+3];return e[n]=c*w+g*v+h*M-m*S,e[n+1]=h*w+g*S+m*v-c*M,e[n+2]=m*w+g*M+c*S-h*v,e[n+3]=g*w-c*v-h*S-m*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,s,a){return this._x=e,this._y=n,this._z=s,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const s=e._x,a=e._y,u=e._z,d=e._order,c=Math.cos,h=Math.sin,m=c(s/2),g=c(a/2),v=c(u/2),S=h(s/2),M=h(a/2),w=h(u/2);switch(d){case"XYZ":this._x=S*g*v+m*M*w,this._y=m*M*v-S*g*w,this._z=m*g*w+S*M*v,this._w=m*g*v-S*M*w;break;case"YXZ":this._x=S*g*v+m*M*w,this._y=m*M*v-S*g*w,this._z=m*g*w-S*M*v,this._w=m*g*v+S*M*w;break;case"ZXY":this._x=S*g*v-m*M*w,this._y=m*M*v+S*g*w,this._z=m*g*w+S*M*v,this._w=m*g*v-S*M*w;break;case"ZYX":this._x=S*g*v-m*M*w,this._y=m*M*v+S*g*w,this._z=m*g*w-S*M*v,this._w=m*g*v+S*M*w;break;case"YZX":this._x=S*g*v+m*M*w,this._y=m*M*v+S*g*w,this._z=m*g*w-S*M*v,this._w=m*g*v-S*M*w;break;case"XZY":this._x=S*g*v-m*M*w,this._y=m*M*v-S*g*w,this._z=m*g*w+S*M*v,this._w=m*g*v+S*M*w;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const s=n/2,a=Math.sin(s);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,s=n[0],a=n[4],u=n[8],d=n[1],c=n[5],h=n[9],m=n[2],g=n[6],v=n[10],S=s+c+v;if(S>0){const M=.5/Math.sqrt(S+1);this._w=.25/M,this._x=(g-h)*M,this._y=(u-m)*M,this._z=(d-a)*M}else if(s>c&&s>v){const M=2*Math.sqrt(1+s-c-v);this._w=(g-h)/M,this._x=.25*M,this._y=(a+d)/M,this._z=(u+m)/M}else if(c>v){const M=2*Math.sqrt(1+c-s-v);this._w=(u-m)/M,this._x=(a+d)/M,this._y=.25*M,this._z=(h+g)/M}else{const M=2*Math.sqrt(1+v-s-c);this._w=(d-a)/M,this._x=(u+m)/M,this._y=(h+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let s=e.dot(n)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Sn(this.dot(e),-1,1)))}rotateTowards(e,n){const s=this.angleTo(e);if(s===0)return this;const a=Math.min(1,n/s);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const s=e._x,a=e._y,u=e._z,d=e._w,c=n._x,h=n._y,m=n._z,g=n._w;return this._x=s*g+d*c+a*m-u*h,this._y=a*g+d*h+u*c-s*m,this._z=u*g+d*m+s*h-a*c,this._w=d*g-s*c-a*h-u*m,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const s=this._x,a=this._y,u=this._z,d=this._w;let c=d*e._w+s*e._x+a*e._y+u*e._z;if(c<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,c=-c):this.copy(e),c>=1)return this._w=d,this._x=s,this._y=a,this._z=u,this;const h=1-c*c;if(h<=Number.EPSILON){const M=1-n;return this._w=M*d+n*this._w,this._x=M*s+n*this._x,this._y=M*a+n*this._y,this._z=M*u+n*this._z,this.normalize(),this}const m=Math.sqrt(h),g=Math.atan2(m,c),v=Math.sin((1-n)*g)/m,S=Math.sin(n*g)/m;return this._w=d*v+this._w*S,this._x=s*v+this._x*S,this._y=a*v+this._y*S,this._z=u*v+this._z*S,this._onChangeCallback(),this}slerpQuaternions(e,n,s){return this.copy(e).slerp(n,s)}random(){const e=Math.random(),n=Math.sqrt(1-e),s=Math.sqrt(e),a=2*Math.PI*Math.random(),u=2*Math.PI*Math.random();return this.set(n*Math.cos(a),s*Math.sin(u),s*Math.cos(u),n*Math.sin(a))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class te{constructor(e=0,n=0,s=0){te.prototype.isVector3=!0,this.x=e,this.y=n,this.z=s}set(e,n,s){return s===void 0&&(s=this.z),this.x=e,this.y=n,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Ep.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Ep.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,s=this.y,a=this.z,u=e.elements;return this.x=u[0]*n+u[3]*s+u[6]*a,this.y=u[1]*n+u[4]*s+u[7]*a,this.z=u[2]*n+u[5]*s+u[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,s=this.y,a=this.z,u=e.elements,d=1/(u[3]*n+u[7]*s+u[11]*a+u[15]);return this.x=(u[0]*n+u[4]*s+u[8]*a+u[12])*d,this.y=(u[1]*n+u[5]*s+u[9]*a+u[13])*d,this.z=(u[2]*n+u[6]*s+u[10]*a+u[14])*d,this}applyQuaternion(e){const n=this.x,s=this.y,a=this.z,u=e.x,d=e.y,c=e.z,h=e.w,m=2*(d*a-c*s),g=2*(c*n-u*a),v=2*(u*s-d*n);return this.x=n+h*m+d*v-c*g,this.y=s+h*g+c*m-u*v,this.z=a+h*v+u*g-d*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,s=this.y,a=this.z,u=e.elements;return this.x=u[0]*n+u[4]*s+u[8]*a,this.y=u[1]*n+u[5]*s+u[9]*a,this.z=u[2]*n+u[6]*s+u[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Math.max(e,Math.min(n,s)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,s){return this.x=e.x+(n.x-e.x)*s,this.y=e.y+(n.y-e.y)*s,this.z=e.z+(n.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const s=e.x,a=e.y,u=e.z,d=n.x,c=n.y,h=n.z;return this.x=a*h-u*c,this.y=u*d-s*h,this.z=s*c-a*d,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const s=e.dot(this)/n;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return Sc.copy(this).projectOnVector(e),this.sub(Sc)}reflect(e){return this.sub(Sc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const s=this.dot(e)/n;return Math.acos(Sn(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,s=this.y-e.y,a=this.z-e.z;return n*n+s*s+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,s){const a=Math.sin(n)*e;return this.x=a*Math.sin(s),this.y=Math.cos(n)*e,this.z=a*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,s){return this.x=e*Math.sin(n),this.y=s,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=s,this.z=a,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,n=Math.random()*Math.PI*2,s=Math.sqrt(1-e**2);return this.x=s*Math.cos(n),this.y=s*Math.sin(n),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Sc=new te,Ep=new Uo;class No{constructor(e=new te(1/0,1/0,1/0),n=new te(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,s=e.length;n<s;n+=3)this.expandByPoint(ti.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,s=e.count;n<s;n++)this.expandByPoint(ti.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,s=e.length;n<s;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const s=ti.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const u=s.getAttribute("position");if(n===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let d=0,c=u.count;d<c;d++)e.isMesh===!0?e.getVertexPosition(d,ti):ti.fromBufferAttribute(u,d),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xa.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),Xa.copy(s.boundingBox)),Xa.applyMatrix4(e.matrixWorld),this.union(Xa)}const a=e.children;for(let u=0,d=a.length;u<d;u++)this.expandByObject(a[u],n);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,s;return e.normal.x>0?(n=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),n<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(To),Ya.subVectors(this.max,To),gs.subVectors(e.a,To),_s.subVectors(e.b,To),vs.subVectors(e.c,To),ar.subVectors(_s,gs),lr.subVectors(vs,_s),Nr.subVectors(gs,vs);let n=[0,-ar.z,ar.y,0,-lr.z,lr.y,0,-Nr.z,Nr.y,ar.z,0,-ar.x,lr.z,0,-lr.x,Nr.z,0,-Nr.x,-ar.y,ar.x,0,-lr.y,lr.x,0,-Nr.y,Nr.x,0];return!yc(n,gs,_s,vs,Ya)||(n=[1,0,0,0,1,0,0,0,1],!yc(n,gs,_s,vs,Ya))?!1:(qa.crossVectors(ar,lr),n=[qa.x,qa.y,qa.z],yc(n,gs,_s,vs,Ya))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ci=[new te,new te,new te,new te,new te,new te,new te,new te],ti=new te,Xa=new No,gs=new te,_s=new te,vs=new te,ar=new te,lr=new te,Nr=new te,To=new te,Ya=new te,qa=new te,Ir=new te;function yc(o,e,n,s,a){for(let u=0,d=o.length-3;u<=d;u+=3){Ir.fromArray(o,u);const c=a.x*Math.abs(Ir.x)+a.y*Math.abs(Ir.y)+a.z*Math.abs(Ir.z),h=e.dot(Ir),m=n.dot(Ir),g=s.dot(Ir);if(Math.max(-Math.max(h,m,g),Math.min(h,m,g))>c)return!1}return!0}const $v=new No,wo=new te,Mc=new te;class nf{constructor(e=new te,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const s=this.center;n!==void 0?s.copy(n):$v.setFromPoints(e).getCenter(s);let a=0;for(let u=0,d=e.length;u<d;u++)a=Math.max(a,s.distanceToSquared(e[u]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const s=this.center.distanceToSquared(e);return n.copy(e),s>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wo.subVectors(e,this.center);const n=wo.lengthSq();if(n>this.radius*this.radius){const s=Math.sqrt(n),a=(s-this.radius)*.5;this.center.addScaledVector(wo,a/s),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Mc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wo.copy(e.center).add(Mc)),this.expandByPoint(wo.copy(e.center).sub(Mc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Pi=new te,Ec=new te,ja=new te,ur=new te,Tc=new te,Ka=new te,wc=new te;class Qv{constructor(e=new te,n=new te(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const s=n.dot(this.direction);return s<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Pi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Pi.copy(this.origin).addScaledVector(this.direction,n),Pi.distanceToSquared(e))}distanceSqToSegment(e,n,s,a){Ec.copy(e).add(n).multiplyScalar(.5),ja.copy(n).sub(e).normalize(),ur.copy(this.origin).sub(Ec);const u=e.distanceTo(n)*.5,d=-this.direction.dot(ja),c=ur.dot(this.direction),h=-ur.dot(ja),m=ur.lengthSq(),g=Math.abs(1-d*d);let v,S,M,w;if(g>0)if(v=d*h-c,S=d*c-h,w=u*g,v>=0)if(S>=-w)if(S<=w){const T=1/g;v*=T,S*=T,M=v*(v+d*S+2*c)+S*(d*v+S+2*h)+m}else S=u,v=Math.max(0,-(d*S+c)),M=-v*v+S*(S+2*h)+m;else S=-u,v=Math.max(0,-(d*S+c)),M=-v*v+S*(S+2*h)+m;else S<=-w?(v=Math.max(0,-(-d*u+c)),S=v>0?-u:Math.min(Math.max(-u,-h),u),M=-v*v+S*(S+2*h)+m):S<=w?(v=0,S=Math.min(Math.max(-u,-h),u),M=S*(S+2*h)+m):(v=Math.max(0,-(d*u+c)),S=v>0?u:Math.min(Math.max(-u,-h),u),M=-v*v+S*(S+2*h)+m);else S=d>0?-u:u,v=Math.max(0,-(d*S+c)),M=-v*v+S*(S+2*h)+m;return s&&s.copy(this.origin).addScaledVector(this.direction,v),a&&a.copy(Ec).addScaledVector(ja,S),M}intersectSphere(e,n){Pi.subVectors(e.center,this.origin);const s=Pi.dot(this.direction),a=Pi.dot(Pi)-s*s,u=e.radius*e.radius;if(a>u)return null;const d=Math.sqrt(u-a),c=s-d,h=s+d;return h<0?null:c<0?this.at(h,n):this.at(c,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/n;return s>=0?s:null}intersectPlane(e,n){const s=this.distanceToPlane(e);return s===null?null:this.at(s,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let s,a,u,d,c,h;const m=1/this.direction.x,g=1/this.direction.y,v=1/this.direction.z,S=this.origin;return m>=0?(s=(e.min.x-S.x)*m,a=(e.max.x-S.x)*m):(s=(e.max.x-S.x)*m,a=(e.min.x-S.x)*m),g>=0?(u=(e.min.y-S.y)*g,d=(e.max.y-S.y)*g):(u=(e.max.y-S.y)*g,d=(e.min.y-S.y)*g),s>d||u>a||((u>s||isNaN(s))&&(s=u),(d<a||isNaN(a))&&(a=d),v>=0?(c=(e.min.z-S.z)*v,h=(e.max.z-S.z)*v):(c=(e.max.z-S.z)*v,h=(e.min.z-S.z)*v),s>h||c>a)||((c>s||s!==s)&&(s=c),(h<a||a!==a)&&(a=h),a<0)?null:this.at(s>=0?s:a,n)}intersectsBox(e){return this.intersectBox(e,Pi)!==null}intersectTriangle(e,n,s,a,u){Tc.subVectors(n,e),Ka.subVectors(s,e),wc.crossVectors(Tc,Ka);let d=this.direction.dot(wc),c;if(d>0){if(a)return null;c=1}else if(d<0)c=-1,d=-d;else return null;ur.subVectors(this.origin,e);const h=c*this.direction.dot(Ka.crossVectors(ur,Ka));if(h<0)return null;const m=c*this.direction.dot(Tc.cross(ur));if(m<0||h+m>d)return null;const g=-c*ur.dot(wc);return g<0?null:this.at(g/d,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class sn{constructor(e,n,s,a,u,d,c,h,m,g,v,S,M,w,T,x){sn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,s,a,u,d,c,h,m,g,v,S,M,w,T,x)}set(e,n,s,a,u,d,c,h,m,g,v,S,M,w,T,x){const _=this.elements;return _[0]=e,_[4]=n,_[8]=s,_[12]=a,_[1]=u,_[5]=d,_[9]=c,_[13]=h,_[2]=m,_[6]=g,_[10]=v,_[14]=S,_[3]=M,_[7]=w,_[11]=T,_[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new sn().fromArray(this.elements)}copy(e){const n=this.elements,s=e.elements;return n[0]=s[0],n[1]=s[1],n[2]=s[2],n[3]=s[3],n[4]=s[4],n[5]=s[5],n[6]=s[6],n[7]=s[7],n[8]=s[8],n[9]=s[9],n[10]=s[10],n[11]=s[11],n[12]=s[12],n[13]=s[13],n[14]=s[14],n[15]=s[15],this}copyPosition(e){const n=this.elements,s=e.elements;return n[12]=s[12],n[13]=s[13],n[14]=s[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,s){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,n,s){return this.set(e.x,n.x,s.x,0,e.y,n.y,s.y,0,e.z,n.z,s.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,s=e.elements,a=1/xs.setFromMatrixColumn(e,0).length(),u=1/xs.setFromMatrixColumn(e,1).length(),d=1/xs.setFromMatrixColumn(e,2).length();return n[0]=s[0]*a,n[1]=s[1]*a,n[2]=s[2]*a,n[3]=0,n[4]=s[4]*u,n[5]=s[5]*u,n[6]=s[6]*u,n[7]=0,n[8]=s[8]*d,n[9]=s[9]*d,n[10]=s[10]*d,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,s=e.x,a=e.y,u=e.z,d=Math.cos(s),c=Math.sin(s),h=Math.cos(a),m=Math.sin(a),g=Math.cos(u),v=Math.sin(u);if(e.order==="XYZ"){const S=d*g,M=d*v,w=c*g,T=c*v;n[0]=h*g,n[4]=-h*v,n[8]=m,n[1]=M+w*m,n[5]=S-T*m,n[9]=-c*h,n[2]=T-S*m,n[6]=w+M*m,n[10]=d*h}else if(e.order==="YXZ"){const S=h*g,M=h*v,w=m*g,T=m*v;n[0]=S+T*c,n[4]=w*c-M,n[8]=d*m,n[1]=d*v,n[5]=d*g,n[9]=-c,n[2]=M*c-w,n[6]=T+S*c,n[10]=d*h}else if(e.order==="ZXY"){const S=h*g,M=h*v,w=m*g,T=m*v;n[0]=S-T*c,n[4]=-d*v,n[8]=w+M*c,n[1]=M+w*c,n[5]=d*g,n[9]=T-S*c,n[2]=-d*m,n[6]=c,n[10]=d*h}else if(e.order==="ZYX"){const S=d*g,M=d*v,w=c*g,T=c*v;n[0]=h*g,n[4]=w*m-M,n[8]=S*m+T,n[1]=h*v,n[5]=T*m+S,n[9]=M*m-w,n[2]=-m,n[6]=c*h,n[10]=d*h}else if(e.order==="YZX"){const S=d*h,M=d*m,w=c*h,T=c*m;n[0]=h*g,n[4]=T-S*v,n[8]=w*v+M,n[1]=v,n[5]=d*g,n[9]=-c*g,n[2]=-m*g,n[6]=M*v+w,n[10]=S-T*v}else if(e.order==="XZY"){const S=d*h,M=d*m,w=c*h,T=c*m;n[0]=h*g,n[4]=-v,n[8]=m*g,n[1]=S*v+T,n[5]=d*g,n[9]=M*v-w,n[2]=w*v-M,n[6]=c*g,n[10]=T*v+S}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Zv,e,Jv)}lookAt(e,n,s){const a=this.elements;return In.subVectors(e,n),In.lengthSq()===0&&(In.z=1),In.normalize(),cr.crossVectors(s,In),cr.lengthSq()===0&&(Math.abs(s.z)===1?In.x+=1e-4:In.z+=1e-4,In.normalize(),cr.crossVectors(s,In)),cr.normalize(),$a.crossVectors(In,cr),a[0]=cr.x,a[4]=$a.x,a[8]=In.x,a[1]=cr.y,a[5]=$a.y,a[9]=In.y,a[2]=cr.z,a[6]=$a.z,a[10]=In.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const s=e.elements,a=n.elements,u=this.elements,d=s[0],c=s[4],h=s[8],m=s[12],g=s[1],v=s[5],S=s[9],M=s[13],w=s[2],T=s[6],x=s[10],_=s[14],N=s[3],P=s[7],U=s[11],Y=s[15],O=a[0],I=a[4],ce=a[8],R=a[12],b=a[1],oe=a[5],le=a[9],_e=a[13],k=a[2],Q=a[6],re=a[10],ae=a[14],G=a[3],K=a[7],V=a[11],L=a[15];return u[0]=d*O+c*b+h*k+m*G,u[4]=d*I+c*oe+h*Q+m*K,u[8]=d*ce+c*le+h*re+m*V,u[12]=d*R+c*_e+h*ae+m*L,u[1]=g*O+v*b+S*k+M*G,u[5]=g*I+v*oe+S*Q+M*K,u[9]=g*ce+v*le+S*re+M*V,u[13]=g*R+v*_e+S*ae+M*L,u[2]=w*O+T*b+x*k+_*G,u[6]=w*I+T*oe+x*Q+_*K,u[10]=w*ce+T*le+x*re+_*V,u[14]=w*R+T*_e+x*ae+_*L,u[3]=N*O+P*b+U*k+Y*G,u[7]=N*I+P*oe+U*Q+Y*K,u[11]=N*ce+P*le+U*re+Y*V,u[15]=N*R+P*_e+U*ae+Y*L,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],s=e[4],a=e[8],u=e[12],d=e[1],c=e[5],h=e[9],m=e[13],g=e[2],v=e[6],S=e[10],M=e[14],w=e[3],T=e[7],x=e[11],_=e[15];return w*(+u*h*v-a*m*v-u*c*S+s*m*S+a*c*M-s*h*M)+T*(+n*h*M-n*m*S+u*d*S-a*d*M+a*m*g-u*h*g)+x*(+n*m*v-n*c*M-u*d*v+s*d*M+u*c*g-s*m*g)+_*(-a*c*g-n*h*v+n*c*S+a*d*v-s*d*S+s*h*g)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,s){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=n,a[14]=s),this}invert(){const e=this.elements,n=e[0],s=e[1],a=e[2],u=e[3],d=e[4],c=e[5],h=e[6],m=e[7],g=e[8],v=e[9],S=e[10],M=e[11],w=e[12],T=e[13],x=e[14],_=e[15],N=v*x*m-T*S*m+T*h*M-c*x*M-v*h*_+c*S*_,P=w*S*m-g*x*m-w*h*M+d*x*M+g*h*_-d*S*_,U=g*T*m-w*v*m+w*c*M-d*T*M-g*c*_+d*v*_,Y=w*v*h-g*T*h-w*c*S+d*T*S+g*c*x-d*v*x,O=n*N+s*P+a*U+u*Y;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/O;return e[0]=N*I,e[1]=(T*S*u-v*x*u-T*a*M+s*x*M+v*a*_-s*S*_)*I,e[2]=(c*x*u-T*h*u+T*a*m-s*x*m-c*a*_+s*h*_)*I,e[3]=(v*h*u-c*S*u-v*a*m+s*S*m+c*a*M-s*h*M)*I,e[4]=P*I,e[5]=(g*x*u-w*S*u+w*a*M-n*x*M-g*a*_+n*S*_)*I,e[6]=(w*h*u-d*x*u-w*a*m+n*x*m+d*a*_-n*h*_)*I,e[7]=(d*S*u-g*h*u+g*a*m-n*S*m-d*a*M+n*h*M)*I,e[8]=U*I,e[9]=(w*v*u-g*T*u-w*s*M+n*T*M+g*s*_-n*v*_)*I,e[10]=(d*T*u-w*c*u+w*s*m-n*T*m-d*s*_+n*c*_)*I,e[11]=(g*c*u-d*v*u-g*s*m+n*v*m+d*s*M-n*c*M)*I,e[12]=Y*I,e[13]=(g*T*a-w*v*a+w*s*S-n*T*S-g*s*x+n*v*x)*I,e[14]=(w*c*a-d*T*a-w*s*h+n*T*h+d*s*x-n*c*x)*I,e[15]=(d*v*a-g*c*a+g*s*h-n*v*h-d*s*S+n*c*S)*I,this}scale(e){const n=this.elements,s=e.x,a=e.y,u=e.z;return n[0]*=s,n[4]*=a,n[8]*=u,n[1]*=s,n[5]*=a,n[9]*=u,n[2]*=s,n[6]*=a,n[10]*=u,n[3]*=s,n[7]*=a,n[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,s,a))}makeTranslation(e,n,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,s,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,n,-s,0,0,s,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),s=Math.sin(e);return this.set(n,0,s,0,0,1,0,0,-s,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),s=Math.sin(e);return this.set(n,-s,0,0,s,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const s=Math.cos(n),a=Math.sin(n),u=1-s,d=e.x,c=e.y,h=e.z,m=u*d,g=u*c;return this.set(m*d+s,m*c-a*h,m*h+a*c,0,m*c+a*h,g*c+s,g*h-a*d,0,m*h-a*c,g*h+a*d,u*h*h+s,0,0,0,0,1),this}makeScale(e,n,s){return this.set(e,0,0,0,0,n,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,n,s,a,u,d){return this.set(1,s,u,0,e,1,d,0,n,a,1,0,0,0,0,1),this}compose(e,n,s){const a=this.elements,u=n._x,d=n._y,c=n._z,h=n._w,m=u+u,g=d+d,v=c+c,S=u*m,M=u*g,w=u*v,T=d*g,x=d*v,_=c*v,N=h*m,P=h*g,U=h*v,Y=s.x,O=s.y,I=s.z;return a[0]=(1-(T+_))*Y,a[1]=(M+U)*Y,a[2]=(w-P)*Y,a[3]=0,a[4]=(M-U)*O,a[5]=(1-(S+_))*O,a[6]=(x+N)*O,a[7]=0,a[8]=(w+P)*I,a[9]=(x-N)*I,a[10]=(1-(S+T))*I,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,n,s){const a=this.elements;let u=xs.set(a[0],a[1],a[2]).length();const d=xs.set(a[4],a[5],a[6]).length(),c=xs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(u=-u),e.x=a[12],e.y=a[13],e.z=a[14],ni.copy(this);const m=1/u,g=1/d,v=1/c;return ni.elements[0]*=m,ni.elements[1]*=m,ni.elements[2]*=m,ni.elements[4]*=g,ni.elements[5]*=g,ni.elements[6]*=g,ni.elements[8]*=v,ni.elements[9]*=v,ni.elements[10]*=v,n.setFromRotationMatrix(ni),s.x=u,s.y=d,s.z=c,this}makePerspective(e,n,s,a,u,d,c=Ii){const h=this.elements,m=2*u/(n-e),g=2*u/(s-a),v=(n+e)/(n-e),S=(s+a)/(s-a);let M,w;if(c===Ii)M=-(d+u)/(d-u),w=-2*d*u/(d-u);else if(c===vl)M=-d/(d-u),w=-d*u/(d-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return h[0]=m,h[4]=0,h[8]=v,h[12]=0,h[1]=0,h[5]=g,h[9]=S,h[13]=0,h[2]=0,h[6]=0,h[10]=M,h[14]=w,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,n,s,a,u,d,c=Ii){const h=this.elements,m=1/(n-e),g=1/(s-a),v=1/(d-u),S=(n+e)*m,M=(s+a)*g;let w,T;if(c===Ii)w=(d+u)*v,T=-2*v;else if(c===vl)w=u*v,T=-1*v;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return h[0]=2*m,h[4]=0,h[8]=0,h[12]=-S,h[1]=0,h[5]=2*g,h[9]=0,h[13]=-M,h[2]=0,h[6]=0,h[10]=T,h[14]=-w,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const n=this.elements,s=e.elements;for(let a=0;a<16;a++)if(n[a]!==s[a])return!1;return!0}fromArray(e,n=0){for(let s=0;s<16;s++)this.elements[s]=e[s+n];return this}toArray(e=[],n=0){const s=this.elements;return e[n]=s[0],e[n+1]=s[1],e[n+2]=s[2],e[n+3]=s[3],e[n+4]=s[4],e[n+5]=s[5],e[n+6]=s[6],e[n+7]=s[7],e[n+8]=s[8],e[n+9]=s[9],e[n+10]=s[10],e[n+11]=s[11],e[n+12]=s[12],e[n+13]=s[13],e[n+14]=s[14],e[n+15]=s[15],e}}const xs=new te,ni=new sn,Zv=new te(0,0,0),Jv=new te(1,1,1),cr=new te,$a=new te,In=new te,Tp=new sn,wp=new Uo;class Tl{constructor(e=0,n=0,s=0,a=Tl.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=s,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,s,a=this._order){return this._x=e,this._y=n,this._z=s,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,s=!0){const a=e.elements,u=a[0],d=a[4],c=a[8],h=a[1],m=a[5],g=a[9],v=a[2],S=a[6],M=a[10];switch(n){case"XYZ":this._y=Math.asin(Sn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-d,u)):(this._x=Math.atan2(S,m),this._z=0);break;case"YXZ":this._x=Math.asin(-Sn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(c,M),this._z=Math.atan2(h,m)):(this._y=Math.atan2(-v,u),this._z=0);break;case"ZXY":this._x=Math.asin(Sn(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-v,M),this._z=Math.atan2(-d,m)):(this._y=0,this._z=Math.atan2(h,u));break;case"ZYX":this._y=Math.asin(-Sn(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(S,M),this._z=Math.atan2(h,u)):(this._x=0,this._z=Math.atan2(-d,m));break;case"YZX":this._z=Math.asin(Sn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-g,m),this._y=Math.atan2(-v,u)):(this._x=0,this._y=Math.atan2(c,M));break;case"XZY":this._z=Math.asin(-Sn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(S,m),this._y=Math.atan2(c,u)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,s){return Tp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tp,n,s)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return wp.setFromEuler(this),this.setFromQuaternion(wp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tl.DEFAULT_ORDER="XYZ";class Mm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let e0=0;const Ap=new te,Ss=new Uo,Li=new sn,Qa=new te,Ao=new te,t0=new te,n0=new Uo,Rp=new te(1,0,0),Cp=new te(0,1,0),Pp=new te(0,0,1),i0={type:"added"},r0={type:"removed"};class Bn extends ks{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:e0++}),this.uuid=Hs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Bn.DEFAULT_UP.clone();const e=new te,n=new Tl,s=new Uo,a=new te(1,1,1);function u(){s.setFromEuler(n,!1)}function d(){n.setFromQuaternion(s,void 0,!1)}n._onChange(u),s._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new sn},normalMatrix:{value:new mt}}),this.matrix=new sn,this.matrixWorld=new sn,this.matrixAutoUpdate=Bn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Ss.setFromAxisAngle(e,n),this.quaternion.multiply(Ss),this}rotateOnWorldAxis(e,n){return Ss.setFromAxisAngle(e,n),this.quaternion.premultiply(Ss),this}rotateX(e){return this.rotateOnAxis(Rp,e)}rotateY(e){return this.rotateOnAxis(Cp,e)}rotateZ(e){return this.rotateOnAxis(Pp,e)}translateOnAxis(e,n){return Ap.copy(e).applyQuaternion(this.quaternion),this.position.add(Ap.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Rp,e)}translateY(e){return this.translateOnAxis(Cp,e)}translateZ(e){return this.translateOnAxis(Pp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(e,n,s){e.isVector3?Qa.copy(e):Qa.set(e,n,s);const a=this.parent;this.updateWorldMatrix(!0,!1),Ao.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(Ao,Qa,this.up):Li.lookAt(Qa,Ao,this.up),this.quaternion.setFromRotationMatrix(Li),a&&(Li.extractRotation(a.matrixWorld),Ss.setFromRotationMatrix(Li),this.quaternion.premultiply(Ss.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(i0)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(r0)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Li.multiply(e.parent.matrixWorld)),e.applyMatrix4(Li),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let s=0,a=this.children.length;s<a;s++){const d=this.children[s].getObjectByProperty(e,n);if(d!==void 0)return d}}getObjectsByProperty(e,n,s=[]){this[e]===n&&s.push(this);const a=this.children;for(let u=0,d=a.length;u<d;u++)a[u].getObjectsByProperty(e,n,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ao,e,t0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ao,n0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let s=0,a=n.length;s<a;s++){const u=n[s];(u.matrixWorldAutoUpdate===!0||e===!0)&&u.updateMatrixWorld(e)}}updateWorldMatrix(e,n){const s=this.parent;if(e===!0&&s!==null&&s.matrixWorldAutoUpdate===!0&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),n===!0){const a=this.children;for(let u=0,d=a.length;u<d;u++){const c=a[u];c.matrixWorldAutoUpdate===!0&&c.updateWorldMatrix(!1,!0)}}}toJSON(e){const n=e===void 0||typeof e=="string",s={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(c=>({boxInitialized:c.boxInitialized,boxMin:c.box.min.toArray(),boxMax:c.box.max.toArray(),sphereInitialized:c.sphereInitialized,sphereRadius:c.sphere.radius,sphereCenter:c.sphere.center.toArray()})),a.maxGeometryCount=this._maxGeometryCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function u(c,h){return c[h.uuid]===void 0&&(c[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=u(e.geometries,this.geometry);const c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){const h=c.shapes;if(Array.isArray(h))for(let m=0,g=h.length;m<g;m++){const v=h[m];u(e.shapes,v)}else u(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const c=[];for(let h=0,m=this.material.length;h<m;h++)c.push(u(e.materials,this.material[h]));a.material=c}else a.material=u(e.materials,this.material);if(this.children.length>0){a.children=[];for(let c=0;c<this.children.length;c++)a.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let c=0;c<this.animations.length;c++){const h=this.animations[c];a.animations.push(u(e.animations,h))}}if(n){const c=d(e.geometries),h=d(e.materials),m=d(e.textures),g=d(e.images),v=d(e.shapes),S=d(e.skeletons),M=d(e.animations),w=d(e.nodes);c.length>0&&(s.geometries=c),h.length>0&&(s.materials=h),m.length>0&&(s.textures=m),g.length>0&&(s.images=g),v.length>0&&(s.shapes=v),S.length>0&&(s.skeletons=S),M.length>0&&(s.animations=M),w.length>0&&(s.nodes=w)}return s.object=a,s;function d(c){const h=[];for(const m in c){const g=c[m];delete g.metadata,h.push(g)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let s=0;s<e.children.length;s++){const a=e.children[s];this.add(a.clone())}return this}}Bn.DEFAULT_UP=new te(0,1,0);Bn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ii=new te,bi=new te,Ac=new te,Di=new te,ys=new te,Ms=new te,Lp=new te,Rc=new te,Cc=new te,Pc=new te;let Za=!1;class ri{constructor(e=new te,n=new te,s=new te){this.a=e,this.b=n,this.c=s}static getNormal(e,n,s,a){a.subVectors(s,n),ii.subVectors(e,n),a.cross(ii);const u=a.lengthSq();return u>0?a.multiplyScalar(1/Math.sqrt(u)):a.set(0,0,0)}static getBarycoord(e,n,s,a,u){ii.subVectors(a,n),bi.subVectors(s,n),Ac.subVectors(e,n);const d=ii.dot(ii),c=ii.dot(bi),h=ii.dot(Ac),m=bi.dot(bi),g=bi.dot(Ac),v=d*m-c*c;if(v===0)return u.set(0,0,0),null;const S=1/v,M=(m*h-c*g)*S,w=(d*g-c*h)*S;return u.set(1-M-w,w,M)}static containsPoint(e,n,s,a){return this.getBarycoord(e,n,s,a,Di)===null?!1:Di.x>=0&&Di.y>=0&&Di.x+Di.y<=1}static getUV(e,n,s,a,u,d,c,h){return Za===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Za=!0),this.getInterpolation(e,n,s,a,u,d,c,h)}static getInterpolation(e,n,s,a,u,d,c,h){return this.getBarycoord(e,n,s,a,Di)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(u,Di.x),h.addScaledVector(d,Di.y),h.addScaledVector(c,Di.z),h)}static isFrontFacing(e,n,s,a){return ii.subVectors(s,n),bi.subVectors(e,n),ii.cross(bi).dot(a)<0}set(e,n,s){return this.a.copy(e),this.b.copy(n),this.c.copy(s),this}setFromPointsAndIndices(e,n,s,a){return this.a.copy(e[n]),this.b.copy(e[s]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,n,s,a){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),ii.cross(bi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ri.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return ri.getBarycoord(e,this.a,this.b,this.c,n)}getUV(e,n,s,a,u){return Za===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Za=!0),ri.getInterpolation(e,this.a,this.b,this.c,n,s,a,u)}getInterpolation(e,n,s,a,u){return ri.getInterpolation(e,this.a,this.b,this.c,n,s,a,u)}containsPoint(e){return ri.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ri.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const s=this.a,a=this.b,u=this.c;let d,c;ys.subVectors(a,s),Ms.subVectors(u,s),Rc.subVectors(e,s);const h=ys.dot(Rc),m=Ms.dot(Rc);if(h<=0&&m<=0)return n.copy(s);Cc.subVectors(e,a);const g=ys.dot(Cc),v=Ms.dot(Cc);if(g>=0&&v<=g)return n.copy(a);const S=h*v-g*m;if(S<=0&&h>=0&&g<=0)return d=h/(h-g),n.copy(s).addScaledVector(ys,d);Pc.subVectors(e,u);const M=ys.dot(Pc),w=Ms.dot(Pc);if(w>=0&&M<=w)return n.copy(u);const T=M*m-h*w;if(T<=0&&m>=0&&w<=0)return c=m/(m-w),n.copy(s).addScaledVector(Ms,c);const x=g*w-M*v;if(x<=0&&v-g>=0&&M-w>=0)return Lp.subVectors(u,a),c=(v-g)/(v-g+(M-w)),n.copy(a).addScaledVector(Lp,c);const _=1/(x+T+S);return d=T*_,c=S*_,n.copy(s).addScaledVector(ys,d).addScaledVector(Ms,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Em={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fr={h:0,s:0,l:0},Ja={h:0,s:0,l:0};function Lc(o,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?o+(e-o)*6*n:n<1/2?e:n<2/3?o+(e-o)*6*(2/3-n):o}class _t{constructor(e,n,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,s)}set(e,n,s){if(n===void 0&&s===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,n,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,wt.toWorkingColorSpace(this,n),this}setRGB(e,n,s,a=wt.workingColorSpace){return this.r=e,this.g=n,this.b=s,wt.toWorkingColorSpace(this,a),this}setHSL(e,n,s,a=wt.workingColorSpace){if(e=tf(e,1),n=Sn(n,0,1),s=Sn(s,0,1),n===0)this.r=this.g=this.b=s;else{const u=s<=.5?s*(1+n):s+n-s*n,d=2*s-u;this.r=Lc(d,u,e+1/3),this.g=Lc(d,u,e),this.b=Lc(d,u,e-1/3)}return wt.toWorkingColorSpace(this,a),this}setStyle(e,n=nn){function s(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const d=a[1],c=a[2];switch(d){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return s(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,n);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return s(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,n);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return s(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=a[1],d=u.length;if(d===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,n);if(d===6)return this.setHex(parseInt(u,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=nn){const s=Em[e.toLowerCase()];return s!==void 0?this.setHex(s,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ns(e.r),this.g=Ns(e.g),this.b=Ns(e.b),this}copyLinearToSRGB(e){return this.r=vc(e.r),this.g=vc(e.g),this.b=vc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return wt.fromWorkingColorSpace(dn.copy(this),e),Math.round(Sn(dn.r*255,0,255))*65536+Math.round(Sn(dn.g*255,0,255))*256+Math.round(Sn(dn.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=wt.workingColorSpace){wt.fromWorkingColorSpace(dn.copy(this),n);const s=dn.r,a=dn.g,u=dn.b,d=Math.max(s,a,u),c=Math.min(s,a,u);let h,m;const g=(c+d)/2;if(c===d)h=0,m=0;else{const v=d-c;switch(m=g<=.5?v/(d+c):v/(2-d-c),d){case s:h=(a-u)/v+(a<u?6:0);break;case a:h=(u-s)/v+2;break;case u:h=(s-a)/v+4;break}h/=6}return e.h=h,e.s=m,e.l=g,e}getRGB(e,n=wt.workingColorSpace){return wt.fromWorkingColorSpace(dn.copy(this),n),e.r=dn.r,e.g=dn.g,e.b=dn.b,e}getStyle(e=nn){wt.fromWorkingColorSpace(dn.copy(this),e);const n=dn.r,s=dn.g,a=dn.b;return e!==nn?`color(${e} ${n.toFixed(3)} ${s.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(s*255)},${Math.round(a*255)})`}offsetHSL(e,n,s){return this.getHSL(fr),this.setHSL(fr.h+e,fr.s+n,fr.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,s){return this.r=e.r+(n.r-e.r)*s,this.g=e.g+(n.g-e.g)*s,this.b=e.b+(n.b-e.b)*s,this}lerpHSL(e,n){this.getHSL(fr),e.getHSL(Ja);const s=Po(fr.h,Ja.h,n),a=Po(fr.s,Ja.s,n),u=Po(fr.l,Ja.l,n);return this.setHSL(s,a,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,s=this.g,a=this.b,u=e.elements;return this.r=u[0]*n+u[3]*s+u[6]*a,this.g=u[1]*n+u[4]*s+u[7]*a,this.b=u[2]*n+u[5]*s+u[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const dn=new _t;_t.NAMES=Em;let s0=0;class wl extends ks{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:s0++}),this.uuid=Hs(),this.name="",this.type="Material",this.blending=Us,this.side=_r,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Hc,this.blendDst=Gc,this.blendEquation=kr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=pl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ps,this.stencilZFail=ps,this.stencilZPass=ps,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const s=e[n];if(s===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const a=this[n];if(a===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(s):a&&a.isVector3&&s&&s.isVector3?a.copy(s):this[n]=s}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Us&&(s.blending=this.blending),this.side!==_r&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Hc&&(s.blendSrc=this.blendSrc),this.blendDst!==Gc&&(s.blendDst=this.blendDst),this.blendEquation!==kr&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==pl&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mp&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ps&&(s.stencilFail=this.stencilFail),this.stencilZFail!==ps&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==ps&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function a(u){const d=[];for(const c in u){const h=u[c];delete h.metadata,d.push(h)}return d}if(n){const u=a(e.textures),d=a(e.images);u.length>0&&(s.textures=u),d.length>0&&(s.images=d)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let s=null;if(n!==null){const a=n.length;s=new Array(a);for(let u=0;u!==a;++u)s[u]=n[u].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class rf extends wl{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=am,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Vt=new te,el=new at;class gi{constructor(e,n,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=s,this.usage=gp,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,s){e*=this.itemSize,s*=n.itemSize;for(let a=0,u=this.itemSize;a<u;a++)this.array[e+a]=n.array[s+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,s=this.count;n<s;n++)el.fromBufferAttribute(this,n),el.applyMatrix3(e),this.setXY(n,el.x,el.y);else if(this.itemSize===3)for(let n=0,s=this.count;n<s;n++)Vt.fromBufferAttribute(this,n),Vt.applyMatrix3(e),this.setXYZ(n,Vt.x,Vt.y,Vt.z);return this}applyMatrix4(e){for(let n=0,s=this.count;n<s;n++)Vt.fromBufferAttribute(this,n),Vt.applyMatrix4(e),this.setXYZ(n,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let n=0,s=this.count;n<s;n++)Vt.fromBufferAttribute(this,n),Vt.applyNormalMatrix(e),this.setXYZ(n,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let n=0,s=this.count;n<s;n++)Vt.fromBufferAttribute(this,n),Vt.transformDirection(e),this.setXYZ(n,Vt.x,Vt.y,Vt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let s=this.array[e*this.itemSize+n];return this.normalized&&(s=Ls(s,this.array)),s}setComponent(e,n,s){return this.normalized&&(s=_n(s,this.array)),this.array[e*this.itemSize+n]=s,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ls(n,this.array)),n}setX(e,n){return this.normalized&&(n=_n(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ls(n,this.array)),n}setY(e,n){return this.normalized&&(n=_n(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ls(n,this.array)),n}setZ(e,n){return this.normalized&&(n=_n(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ls(n,this.array)),n}setW(e,n){return this.normalized&&(n=_n(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,s){return e*=this.itemSize,this.normalized&&(n=_n(n,this.array),s=_n(s,this.array)),this.array[e+0]=n,this.array[e+1]=s,this}setXYZ(e,n,s,a){return e*=this.itemSize,this.normalized&&(n=_n(n,this.array),s=_n(s,this.array),a=_n(a,this.array)),this.array[e+0]=n,this.array[e+1]=s,this.array[e+2]=a,this}setXYZW(e,n,s,a,u){return e*=this.itemSize,this.normalized&&(n=_n(n,this.array),s=_n(s,this.array),a=_n(a,this.array),u=_n(u,this.array)),this.array[e+0]=n,this.array[e+1]=s,this.array[e+2]=a,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gp&&(e.usage=this.usage),e}}class Tm extends gi{constructor(e,n,s){super(new Uint16Array(e),n,s)}}class wm extends gi{constructor(e,n,s){super(new Uint32Array(e),n,s)}}class Bi extends gi{constructor(e,n,s){super(new Float32Array(e),n,s)}}let o0=0;const Yn=new sn,bc=new Bn,Es=new te,Fn=new No,Ro=new No,Jt=new te;class vr extends ks{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:o0++}),this.uuid=Hs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vm(e)?wm:Tm)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,s=0){this.groups.push({start:e,count:n,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const u=new mt().getNormalMatrix(e);s.applyNormalMatrix(u),s.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yn.makeRotationFromQuaternion(e),this.applyMatrix4(Yn),this}rotateX(e){return Yn.makeRotationX(e),this.applyMatrix4(Yn),this}rotateY(e){return Yn.makeRotationY(e),this.applyMatrix4(Yn),this}rotateZ(e){return Yn.makeRotationZ(e),this.applyMatrix4(Yn),this}translate(e,n,s){return Yn.makeTranslation(e,n,s),this.applyMatrix4(Yn),this}scale(e,n,s){return Yn.makeScale(e,n,s),this.applyMatrix4(Yn),this}lookAt(e){return bc.lookAt(e),bc.updateMatrix(),this.applyMatrix4(bc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Es).negate(),this.translate(Es.x,Es.y,Es.z),this}setFromPoints(e){const n=[];for(let s=0,a=e.length;s<a;s++){const u=e[s];n.push(u.x,u.y,u.z||0)}return this.setAttribute("position",new Bi(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new No);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new te(-1/0,-1/0,-1/0),new te(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const u=n[s];Fn.setFromBufferAttribute(u),this.morphTargetsRelative?(Jt.addVectors(this.boundingBox.min,Fn.min),this.boundingBox.expandByPoint(Jt),Jt.addVectors(this.boundingBox.max,Fn.max),this.boundingBox.expandByPoint(Jt)):(this.boundingBox.expandByPoint(Fn.min),this.boundingBox.expandByPoint(Fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new nf);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new te,1/0);return}if(e){const s=this.boundingSphere.center;if(Fn.setFromBufferAttribute(e),n)for(let u=0,d=n.length;u<d;u++){const c=n[u];Ro.setFromBufferAttribute(c),this.morphTargetsRelative?(Jt.addVectors(Fn.min,Ro.min),Fn.expandByPoint(Jt),Jt.addVectors(Fn.max,Ro.max),Fn.expandByPoint(Jt)):(Fn.expandByPoint(Ro.min),Fn.expandByPoint(Ro.max))}Fn.getCenter(s);let a=0;for(let u=0,d=e.count;u<d;u++)Jt.fromBufferAttribute(e,u),a=Math.max(a,s.distanceToSquared(Jt));if(n)for(let u=0,d=n.length;u<d;u++){const c=n[u],h=this.morphTargetsRelative;for(let m=0,g=c.count;m<g;m++)Jt.fromBufferAttribute(c,m),h&&(Es.fromBufferAttribute(e,m),Jt.add(Es)),a=Math.max(a,s.distanceToSquared(Jt))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=e.array,a=n.position.array,u=n.normal.array,d=n.uv.array,c=a.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gi(new Float32Array(4*c),4));const h=this.getAttribute("tangent").array,m=[],g=[];for(let b=0;b<c;b++)m[b]=new te,g[b]=new te;const v=new te,S=new te,M=new te,w=new at,T=new at,x=new at,_=new te,N=new te;function P(b,oe,le){v.fromArray(a,b*3),S.fromArray(a,oe*3),M.fromArray(a,le*3),w.fromArray(d,b*2),T.fromArray(d,oe*2),x.fromArray(d,le*2),S.sub(v),M.sub(v),T.sub(w),x.sub(w);const _e=1/(T.x*x.y-x.x*T.y);isFinite(_e)&&(_.copy(S).multiplyScalar(x.y).addScaledVector(M,-T.y).multiplyScalar(_e),N.copy(M).multiplyScalar(T.x).addScaledVector(S,-x.x).multiplyScalar(_e),m[b].add(_),m[oe].add(_),m[le].add(_),g[b].add(N),g[oe].add(N),g[le].add(N))}let U=this.groups;U.length===0&&(U=[{start:0,count:s.length}]);for(let b=0,oe=U.length;b<oe;++b){const le=U[b],_e=le.start,k=le.count;for(let Q=_e,re=_e+k;Q<re;Q+=3)P(s[Q+0],s[Q+1],s[Q+2])}const Y=new te,O=new te,I=new te,ce=new te;function R(b){I.fromArray(u,b*3),ce.copy(I);const oe=m[b];Y.copy(oe),Y.sub(I.multiplyScalar(I.dot(oe))).normalize(),O.crossVectors(ce,oe);const _e=O.dot(g[b])<0?-1:1;h[b*4]=Y.x,h[b*4+1]=Y.y,h[b*4+2]=Y.z,h[b*4+3]=_e}for(let b=0,oe=U.length;b<oe;++b){const le=U[b],_e=le.start,k=le.count;for(let Q=_e,re=_e+k;Q<re;Q+=3)R(s[Q+0]),R(s[Q+1]),R(s[Q+2])}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new gi(new Float32Array(n.count*3),3),this.setAttribute("normal",s);else for(let S=0,M=s.count;S<M;S++)s.setXYZ(S,0,0,0);const a=new te,u=new te,d=new te,c=new te,h=new te,m=new te,g=new te,v=new te;if(e)for(let S=0,M=e.count;S<M;S+=3){const w=e.getX(S+0),T=e.getX(S+1),x=e.getX(S+2);a.fromBufferAttribute(n,w),u.fromBufferAttribute(n,T),d.fromBufferAttribute(n,x),g.subVectors(d,u),v.subVectors(a,u),g.cross(v),c.fromBufferAttribute(s,w),h.fromBufferAttribute(s,T),m.fromBufferAttribute(s,x),c.add(g),h.add(g),m.add(g),s.setXYZ(w,c.x,c.y,c.z),s.setXYZ(T,h.x,h.y,h.z),s.setXYZ(x,m.x,m.y,m.z)}else for(let S=0,M=n.count;S<M;S+=3)a.fromBufferAttribute(n,S+0),u.fromBufferAttribute(n,S+1),d.fromBufferAttribute(n,S+2),g.subVectors(d,u),v.subVectors(a,u),g.cross(v),s.setXYZ(S+0,g.x,g.y,g.z),s.setXYZ(S+1,g.x,g.y,g.z),s.setXYZ(S+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,s=e.count;n<s;n++)Jt.fromBufferAttribute(e,n),Jt.normalize(),e.setXYZ(n,Jt.x,Jt.y,Jt.z)}toNonIndexed(){function e(c,h){const m=c.array,g=c.itemSize,v=c.normalized,S=new m.constructor(h.length*g);let M=0,w=0;for(let T=0,x=h.length;T<x;T++){c.isInterleavedBufferAttribute?M=h[T]*c.data.stride+c.offset:M=h[T]*g;for(let _=0;_<g;_++)S[w++]=m[M++]}return new gi(S,g,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new vr,s=this.index.array,a=this.attributes;for(const c in a){const h=a[c],m=e(h,s);n.setAttribute(c,m)}const u=this.morphAttributes;for(const c in u){const h=[],m=u[c];for(let g=0,v=m.length;g<v;g++){const S=m[g],M=e(S,s);h.push(M)}n.morphAttributes[c]=h}n.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let c=0,h=d.length;c<h;c++){const m=d[c];n.addGroup(m.start,m.count,m.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const m in h)h[m]!==void 0&&(e[m]=h[m]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const s=this.attributes;for(const h in s){const m=s[h];e.data.attributes[h]=m.toJSON(e.data)}const a={};let u=!1;for(const h in this.morphAttributes){const m=this.morphAttributes[h],g=[];for(let v=0,S=m.length;v<S;v++){const M=m[v];g.push(M.toJSON(e.data))}g.length>0&&(a[h]=g,u=!0)}u&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const c=this.boundingSphere;return c!==null&&(e.data.boundingSphere={center:c.center.toArray(),radius:c.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(n));const a=e.attributes;for(const m in a){const g=a[m];this.setAttribute(m,g.clone(n))}const u=e.morphAttributes;for(const m in u){const g=[],v=u[m];for(let S=0,M=v.length;S<M;S++)g.push(v[S].clone(n));this.morphAttributes[m]=g}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let m=0,g=d.length;m<g;m++){const v=d[m];this.addGroup(v.start,v.count,v.materialIndex)}const c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bp=new sn,Fr=new Qv,tl=new nf,Dp=new te,Ts=new te,ws=new te,As=new te,Dc=new te,nl=new te,il=new at,rl=new at,sl=new at,Up=new te,Np=new te,Ip=new te,ol=new te,al=new te;class mi extends Bn{constructor(e=new vr,n=new rf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,s=Object.keys(n);if(s.length>0){const a=n[s[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=a.length;u<d;u++){const c=a[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=u}}}}getVertexPosition(e,n){const s=this.geometry,a=s.attributes.position,u=s.morphAttributes.position,d=s.morphTargetsRelative;n.fromBufferAttribute(a,e);const c=this.morphTargetInfluences;if(u&&c){nl.set(0,0,0);for(let h=0,m=u.length;h<m;h++){const g=c[h],v=u[h];g!==0&&(Dc.fromBufferAttribute(v,e),d?nl.addScaledVector(Dc,g):nl.addScaledVector(Dc.sub(n),g))}n.add(nl)}return n}raycast(e,n){const s=this.geometry,a=this.material,u=this.matrixWorld;a!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),tl.copy(s.boundingSphere),tl.applyMatrix4(u),Fr.copy(e.ray).recast(e.near),!(tl.containsPoint(Fr.origin)===!1&&(Fr.intersectSphere(tl,Dp)===null||Fr.origin.distanceToSquared(Dp)>(e.far-e.near)**2))&&(bp.copy(u).invert(),Fr.copy(e.ray).applyMatrix4(bp),!(s.boundingBox!==null&&Fr.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,n,Fr)))}_computeIntersections(e,n,s){let a;const u=this.geometry,d=this.material,c=u.index,h=u.attributes.position,m=u.attributes.uv,g=u.attributes.uv1,v=u.attributes.normal,S=u.groups,M=u.drawRange;if(c!==null)if(Array.isArray(d))for(let w=0,T=S.length;w<T;w++){const x=S[w],_=d[x.materialIndex],N=Math.max(x.start,M.start),P=Math.min(c.count,Math.min(x.start+x.count,M.start+M.count));for(let U=N,Y=P;U<Y;U+=3){const O=c.getX(U),I=c.getX(U+1),ce=c.getX(U+2);a=ll(this,_,e,s,m,g,v,O,I,ce),a&&(a.faceIndex=Math.floor(U/3),a.face.materialIndex=x.materialIndex,n.push(a))}}else{const w=Math.max(0,M.start),T=Math.min(c.count,M.start+M.count);for(let x=w,_=T;x<_;x+=3){const N=c.getX(x),P=c.getX(x+1),U=c.getX(x+2);a=ll(this,d,e,s,m,g,v,N,P,U),a&&(a.faceIndex=Math.floor(x/3),n.push(a))}}else if(h!==void 0)if(Array.isArray(d))for(let w=0,T=S.length;w<T;w++){const x=S[w],_=d[x.materialIndex],N=Math.max(x.start,M.start),P=Math.min(h.count,Math.min(x.start+x.count,M.start+M.count));for(let U=N,Y=P;U<Y;U+=3){const O=U,I=U+1,ce=U+2;a=ll(this,_,e,s,m,g,v,O,I,ce),a&&(a.faceIndex=Math.floor(U/3),a.face.materialIndex=x.materialIndex,n.push(a))}}else{const w=Math.max(0,M.start),T=Math.min(h.count,M.start+M.count);for(let x=w,_=T;x<_;x+=3){const N=x,P=x+1,U=x+2;a=ll(this,d,e,s,m,g,v,N,P,U),a&&(a.faceIndex=Math.floor(x/3),n.push(a))}}}}function a0(o,e,n,s,a,u,d,c){let h;if(e.side===Ln?h=s.intersectTriangle(d,u,a,!0,c):h=s.intersectTriangle(a,u,d,e.side===_r,c),h===null)return null;al.copy(c),al.applyMatrix4(o.matrixWorld);const m=n.ray.origin.distanceTo(al);return m<n.near||m>n.far?null:{distance:m,point:al.clone(),object:o}}function ll(o,e,n,s,a,u,d,c,h,m){o.getVertexPosition(c,Ts),o.getVertexPosition(h,ws),o.getVertexPosition(m,As);const g=a0(o,e,n,s,Ts,ws,As,ol);if(g){a&&(il.fromBufferAttribute(a,c),rl.fromBufferAttribute(a,h),sl.fromBufferAttribute(a,m),g.uv=ri.getInterpolation(ol,Ts,ws,As,il,rl,sl,new at)),u&&(il.fromBufferAttribute(u,c),rl.fromBufferAttribute(u,h),sl.fromBufferAttribute(u,m),g.uv1=ri.getInterpolation(ol,Ts,ws,As,il,rl,sl,new at),g.uv2=g.uv1),d&&(Up.fromBufferAttribute(d,c),Np.fromBufferAttribute(d,h),Ip.fromBufferAttribute(d,m),g.normal=ri.getInterpolation(ol,Ts,ws,As,Up,Np,Ip,new te),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const v={a:c,b:h,c:m,normal:new te,materialIndex:0};ri.getNormal(Ts,ws,As,v.normal),g.face=v}return g}class Io extends vr{constructor(e=1,n=1,s=1,a=1,u=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:s,widthSegments:a,heightSegments:u,depthSegments:d};const c=this;a=Math.floor(a),u=Math.floor(u),d=Math.floor(d);const h=[],m=[],g=[],v=[];let S=0,M=0;w("z","y","x",-1,-1,s,n,e,d,u,0),w("z","y","x",1,-1,s,n,-e,d,u,1),w("x","z","y",1,1,e,s,n,a,d,2),w("x","z","y",1,-1,e,s,-n,a,d,3),w("x","y","z",1,-1,e,n,s,a,u,4),w("x","y","z",-1,-1,e,n,-s,a,u,5),this.setIndex(h),this.setAttribute("position",new Bi(m,3)),this.setAttribute("normal",new Bi(g,3)),this.setAttribute("uv",new Bi(v,2));function w(T,x,_,N,P,U,Y,O,I,ce,R){const b=U/I,oe=Y/ce,le=U/2,_e=Y/2,k=O/2,Q=I+1,re=ce+1;let ae=0,G=0;const K=new te;for(let V=0;V<re;V++){const L=V*oe-_e;for(let H=0;H<Q;H++){const W=H*b-le;K[T]=W*N,K[x]=L*P,K[_]=k,m.push(K.x,K.y,K.z),K[T]=0,K[x]=0,K[_]=O>0?1:-1,g.push(K.x,K.y,K.z),v.push(H/I),v.push(1-V/ce),ae+=1}}for(let V=0;V<ce;V++)for(let L=0;L<I;L++){const H=S+L+Q*V,W=S+L+Q*(V+1),se=S+(L+1)+Q*(V+1),fe=S+(L+1)+Q*V;h.push(H,W,fe),h.push(W,se,fe),G+=6}c.addGroup(M,G,R),M+=G,S+=ae}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Io(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Bs(o){const e={};for(const n in o){e[n]={};for(const s in o[n]){const a=o[n][s];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][s]=null):e[n][s]=a.clone():Array.isArray(a)?e[n][s]=a.slice():e[n][s]=a}}return e}function vn(o){const e={};for(let n=0;n<o.length;n++){const s=Bs(o[n]);for(const a in s)e[a]=s[a]}return e}function l0(o){const e=[];for(let n=0;n<o.length;n++)e.push(o[n].clone());return e}function Am(o){return o.getRenderTarget()===null?o.outputColorSpace:wt.workingColorSpace}const yl={clone:Bs,merge:vn};var u0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,c0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pn extends wl{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=u0,this.fragmentShader=c0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bs(e.uniforms),this.uniformsGroups=l0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const a in this.uniforms){const d=this.uniforms[a].value;d&&d.isTexture?n.uniforms[a]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?n.uniforms[a]={type:"c",value:d.getHex()}:d&&d.isVector2?n.uniforms[a]={type:"v2",value:d.toArray()}:d&&d.isVector3?n.uniforms[a]={type:"v3",value:d.toArray()}:d&&d.isVector4?n.uniforms[a]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?n.uniforms[a]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?n.uniforms[a]={type:"m4",value:d.toArray()}:n.uniforms[a]={value:d}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const s={};for(const a in this.extensions)this.extensions[a]===!0&&(s[a]=!0);return Object.keys(s).length>0&&(n.extensions=s),n}}class Rm extends Bn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new sn,this.projectionMatrix=new sn,this.projectionMatrixInverse=new sn,this.coordinateSystem=Ii}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class si extends Rm{constructor(e=50,n=1,s=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=a,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Do*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Co*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Do*2*Math.atan(Math.tan(Co*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,n,s,a,u,d){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=s,this.view.offsetY=a,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Co*.5*this.fov)/this.zoom,s=2*n,a=this.aspect*s,u=-.5*a;const d=this.view;if(this.view!==null&&this.view.enabled){const h=d.fullWidth,m=d.fullHeight;u+=d.offsetX*a/h,n-=d.offsetY*s/m,a*=d.width/h,s*=d.height/m}const c=this.filmOffset;c!==0&&(u+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+a,n,n-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Rs=-90,Cs=1;class f0 extends Bn{constructor(e,n,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new si(Rs,Cs,e,n);a.layers=this.layers,this.add(a);const u=new si(Rs,Cs,e,n);u.layers=this.layers,this.add(u);const d=new si(Rs,Cs,e,n);d.layers=this.layers,this.add(d);const c=new si(Rs,Cs,e,n);c.layers=this.layers,this.add(c);const h=new si(Rs,Cs,e,n);h.layers=this.layers,this.add(h);const m=new si(Rs,Cs,e,n);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[s,a,u,d,c,h]=n;for(const m of n)this.remove(m);if(e===Ii)s.up.set(0,1,0),s.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===vl)s.up.set(0,-1,0),s.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of n)this.add(m),m.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,d,c,h,m,g]=this.children,v=e.getRenderTarget(),S=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),w=e.xr.enabled;e.xr.enabled=!1;const T=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,a),e.render(n,u),e.setRenderTarget(s,1,a),e.render(n,d),e.setRenderTarget(s,2,a),e.render(n,c),e.setRenderTarget(s,3,a),e.render(n,h),e.setRenderTarget(s,4,a),e.render(n,m),s.texture.generateMipmaps=T,e.setRenderTarget(s,5,a),e.render(n,g),e.setRenderTarget(v,S,M),e.xr.enabled=w,s.texture.needsPMREMUpdate=!0}}class Cm extends On{constructor(e,n,s,a,u,d,c,h,m,g){e=e!==void 0?e:[],n=n!==void 0?n:Is,super(e,n,s,a,u,d,c,h,m,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class d0 extends li{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},a=[s,s,s,s,s,s];n.encoding!==void 0&&(Lo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Wr?nn:jn),this.texture=new Cm(a,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:qn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new Io(5,5,5),u=new Pn({name:"CubemapFromEquirect",uniforms:Bs(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Ln,blending:Fi});u.uniforms.tEquirect.value=n;const d=new mi(a,u),c=n.minFilter;return n.minFilter===bo&&(n.minFilter=qn),new f0(1,10,this).update(e,d),n.minFilter=c,d.geometry.dispose(),d.material.dispose(),this}clear(e,n,s,a){const u=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(n,s,a);e.setRenderTarget(u)}}const Uc=new te,h0=new te,p0=new mt;class Br{constructor(e=new te(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,s,a){return this.normal.set(e,n,s),this.constant=a,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,s){const a=Uc.subVectors(s,n).cross(h0.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const s=e.delta(Uc),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/a;return u<0||u>1?null:n.copy(e.start).addScaledVector(s,u)}intersectsLine(e){const n=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return n<0&&s>0||s<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const s=n||p0.getNormalMatrix(e),a=this.coplanarPoint(Uc).applyMatrix4(e),u=this.normal.applyMatrix3(s).normalize();return this.constant=-a.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Or=new nf,ul=new te;class Pm{constructor(e=new Br,n=new Br,s=new Br,a=new Br,u=new Br,d=new Br){this.planes=[e,n,s,a,u,d]}set(e,n,s,a,u,d){const c=this.planes;return c[0].copy(e),c[1].copy(n),c[2].copy(s),c[3].copy(a),c[4].copy(u),c[5].copy(d),this}copy(e){const n=this.planes;for(let s=0;s<6;s++)n[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,n=Ii){const s=this.planes,a=e.elements,u=a[0],d=a[1],c=a[2],h=a[3],m=a[4],g=a[5],v=a[6],S=a[7],M=a[8],w=a[9],T=a[10],x=a[11],_=a[12],N=a[13],P=a[14],U=a[15];if(s[0].setComponents(h-u,S-m,x-M,U-_).normalize(),s[1].setComponents(h+u,S+m,x+M,U+_).normalize(),s[2].setComponents(h+d,S+g,x+w,U+N).normalize(),s[3].setComponents(h-d,S-g,x-w,U-N).normalize(),s[4].setComponents(h-c,S-v,x-T,U-P).normalize(),n===Ii)s[5].setComponents(h+c,S+v,x+T,U+P).normalize();else if(n===vl)s[5].setComponents(c,v,T,P).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Or.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Or)}intersectsSprite(e){return Or.center.set(0,0,0),Or.radius=.7071067811865476,Or.applyMatrix4(e.matrixWorld),this.intersectsSphere(Or)}intersectsSphere(e){const n=this.planes,s=e.center,a=-e.radius;for(let u=0;u<6;u++)if(n[u].distanceToPoint(s)<a)return!1;return!0}intersectsBox(e){const n=this.planes;for(let s=0;s<6;s++){const a=n[s];if(ul.x=a.normal.x>0?e.max.x:e.min.x,ul.y=a.normal.y>0?e.max.y:e.min.y,ul.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(ul)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let s=0;s<6;s++)if(n[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Lm(){let o=null,e=!1,n=null,s=null;function a(u,d){n(u,d),s=o.requestAnimationFrame(a)}return{start:function(){e!==!0&&n!==null&&(s=o.requestAnimationFrame(a),e=!0)},stop:function(){o.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(u){n=u},setContext:function(u){o=u}}}function m0(o,e){const n=e.isWebGL2,s=new WeakMap;function a(m,g){const v=m.array,S=m.usage,M=v.byteLength,w=o.createBuffer();o.bindBuffer(g,w),o.bufferData(g,v,S),m.onUploadCallback();let T;if(v instanceof Float32Array)T=o.FLOAT;else if(v instanceof Uint16Array)if(m.isFloat16BufferAttribute)if(n)T=o.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else T=o.UNSIGNED_SHORT;else if(v instanceof Int16Array)T=o.SHORT;else if(v instanceof Uint32Array)T=o.UNSIGNED_INT;else if(v instanceof Int32Array)T=o.INT;else if(v instanceof Int8Array)T=o.BYTE;else if(v instanceof Uint8Array)T=o.UNSIGNED_BYTE;else if(v instanceof Uint8ClampedArray)T=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+v);return{buffer:w,type:T,bytesPerElement:v.BYTES_PER_ELEMENT,version:m.version,size:M}}function u(m,g,v){const S=g.array,M=g._updateRange,w=g.updateRanges;if(o.bindBuffer(v,m),M.count===-1&&w.length===0&&o.bufferSubData(v,0,S),w.length!==0){for(let T=0,x=w.length;T<x;T++){const _=w[T];n?o.bufferSubData(v,_.start*S.BYTES_PER_ELEMENT,S,_.start,_.count):o.bufferSubData(v,_.start*S.BYTES_PER_ELEMENT,S.subarray(_.start,_.start+_.count))}g.clearUpdateRanges()}M.count!==-1&&(n?o.bufferSubData(v,M.offset*S.BYTES_PER_ELEMENT,S,M.offset,M.count):o.bufferSubData(v,M.offset*S.BYTES_PER_ELEMENT,S.subarray(M.offset,M.offset+M.count)),M.count=-1),g.onUploadCallback()}function d(m){return m.isInterleavedBufferAttribute&&(m=m.data),s.get(m)}function c(m){m.isInterleavedBufferAttribute&&(m=m.data);const g=s.get(m);g&&(o.deleteBuffer(g.buffer),s.delete(m))}function h(m,g){if(m.isGLBufferAttribute){const S=s.get(m);(!S||S.version<m.version)&&s.set(m,{buffer:m.buffer,type:m.type,bytesPerElement:m.elementSize,version:m.version});return}m.isInterleavedBufferAttribute&&(m=m.data);const v=s.get(m);if(v===void 0)s.set(m,a(m,g));else if(v.version<m.version){if(v.size!==m.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");u(v.buffer,m,g),v.version=m.version}}return{get:d,remove:c,update:h}}class Al extends vr{constructor(e=1,n=1,s=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:s,heightSegments:a};const u=e/2,d=n/2,c=Math.floor(s),h=Math.floor(a),m=c+1,g=h+1,v=e/c,S=n/h,M=[],w=[],T=[],x=[];for(let _=0;_<g;_++){const N=_*S-d;for(let P=0;P<m;P++){const U=P*v-u;w.push(U,-N,0),T.push(0,0,1),x.push(P/c),x.push(1-_/h)}}for(let _=0;_<h;_++)for(let N=0;N<c;N++){const P=N+m*_,U=N+m*(_+1),Y=N+1+m*(_+1),O=N+1+m*_;M.push(P,U,O),M.push(U,Y,O)}this.setIndex(M),this.setAttribute("position",new Bi(w,3)),this.setAttribute("normal",new Bi(T,3)),this.setAttribute("uv",new Bi(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Al(e.width,e.height,e.widthSegments,e.heightSegments)}}var g0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,v0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,x0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,S0=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,y0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,M0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,E0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,T0=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,w0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,A0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,R0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,C0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,P0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,L0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,D0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,U0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,N0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,I0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,F0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,O0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,B0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,z0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,k0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,H0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,G0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,V0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,W0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,X0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Y0="gl_FragColor = linearToOutputTexel( gl_FragColor );",q0=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,j0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,K0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,$0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Q0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Z0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,J0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ex=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,nx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ix=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,rx=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,sx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ox=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ax=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ux=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,cx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,px=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,mx=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,gx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_x=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,vx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xx=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Sx=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yx=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Mx=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Ex=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Tx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ax=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Px=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,bx=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Dx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Ux=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Nx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ix=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ox=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Bx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,zx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Gx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Wx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Xx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$x=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Zx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Jx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,eS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,tS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,nS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,iS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,sS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,oS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,aS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,uS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,cS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,dS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,pS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const mS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_S=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,SS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,MS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,ES=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,TS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,wS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,AS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,CS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,PS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,LS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,US=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,NS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,FS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,OS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,BS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,kS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,GS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,WS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,XS=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,YS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,dt={alphahash_fragment:g0,alphahash_pars_fragment:_0,alphamap_fragment:v0,alphamap_pars_fragment:x0,alphatest_fragment:S0,alphatest_pars_fragment:y0,aomap_fragment:M0,aomap_pars_fragment:E0,batching_pars_vertex:T0,batching_vertex:w0,begin_vertex:A0,beginnormal_vertex:R0,bsdfs:C0,iridescence_fragment:P0,bumpmap_pars_fragment:L0,clipping_planes_fragment:b0,clipping_planes_pars_fragment:D0,clipping_planes_pars_vertex:U0,clipping_planes_vertex:N0,color_fragment:I0,color_pars_fragment:F0,color_pars_vertex:O0,color_vertex:B0,common:z0,cube_uv_reflection_fragment:k0,defaultnormal_vertex:H0,displacementmap_pars_vertex:G0,displacementmap_vertex:V0,emissivemap_fragment:W0,emissivemap_pars_fragment:X0,colorspace_fragment:Y0,colorspace_pars_fragment:q0,envmap_fragment:j0,envmap_common_pars_fragment:K0,envmap_pars_fragment:$0,envmap_pars_vertex:Q0,envmap_physical_pars_fragment:ux,envmap_vertex:Z0,fog_vertex:J0,fog_pars_vertex:ex,fog_fragment:tx,fog_pars_fragment:nx,gradientmap_pars_fragment:ix,lightmap_fragment:rx,lightmap_pars_fragment:sx,lights_lambert_fragment:ox,lights_lambert_pars_fragment:ax,lights_pars_begin:lx,lights_toon_fragment:cx,lights_toon_pars_fragment:fx,lights_phong_fragment:dx,lights_phong_pars_fragment:hx,lights_physical_fragment:px,lights_physical_pars_fragment:mx,lights_fragment_begin:gx,lights_fragment_maps:_x,lights_fragment_end:vx,logdepthbuf_fragment:xx,logdepthbuf_pars_fragment:Sx,logdepthbuf_pars_vertex:yx,logdepthbuf_vertex:Mx,map_fragment:Ex,map_pars_fragment:Tx,map_particle_fragment:wx,map_particle_pars_fragment:Ax,metalnessmap_fragment:Rx,metalnessmap_pars_fragment:Cx,morphcolor_vertex:Px,morphnormal_vertex:Lx,morphtarget_pars_vertex:bx,morphtarget_vertex:Dx,normal_fragment_begin:Ux,normal_fragment_maps:Nx,normal_pars_fragment:Ix,normal_pars_vertex:Fx,normal_vertex:Ox,normalmap_pars_fragment:Bx,clearcoat_normal_fragment_begin:zx,clearcoat_normal_fragment_maps:kx,clearcoat_pars_fragment:Hx,iridescence_pars_fragment:Gx,opaque_fragment:Vx,packing:Wx,premultiplied_alpha_fragment:Xx,project_vertex:Yx,dithering_fragment:qx,dithering_pars_fragment:jx,roughnessmap_fragment:Kx,roughnessmap_pars_fragment:$x,shadowmap_pars_fragment:Qx,shadowmap_pars_vertex:Zx,shadowmap_vertex:Jx,shadowmask_pars_fragment:eS,skinbase_vertex:tS,skinning_pars_vertex:nS,skinning_vertex:iS,skinnormal_vertex:rS,specularmap_fragment:sS,specularmap_pars_fragment:oS,tonemapping_fragment:aS,tonemapping_pars_fragment:lS,transmission_fragment:uS,transmission_pars_fragment:cS,uv_pars_fragment:fS,uv_pars_vertex:dS,uv_vertex:hS,worldpos_vertex:pS,background_vert:mS,background_frag:gS,backgroundCube_vert:_S,backgroundCube_frag:vS,cube_vert:xS,cube_frag:SS,depth_vert:yS,depth_frag:MS,distanceRGBA_vert:ES,distanceRGBA_frag:TS,equirect_vert:wS,equirect_frag:AS,linedashed_vert:RS,linedashed_frag:CS,meshbasic_vert:PS,meshbasic_frag:LS,meshlambert_vert:bS,meshlambert_frag:DS,meshmatcap_vert:US,meshmatcap_frag:NS,meshnormal_vert:IS,meshnormal_frag:FS,meshphong_vert:OS,meshphong_frag:BS,meshphysical_vert:zS,meshphysical_frag:kS,meshtoon_vert:HS,meshtoon_frag:GS,points_vert:VS,points_frag:WS,shadow_vert:XS,shadow_frag:YS,sprite_vert:qS,sprite_frag:jS},Ae={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new mt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new mt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new mt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new mt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new mt},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new mt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new mt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new mt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new mt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0},uvTransform:{value:new mt}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}}},pi={basic:{uniforms:vn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:vn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new _t(0)}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:vn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:vn([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:vn([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new _t(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:vn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:vn([Ae.points,Ae.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:vn([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:vn([Ae.common,Ae.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:vn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:vn([Ae.sprite,Ae.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new mt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distanceRGBA:{uniforms:vn([Ae.common,Ae.displacementmap,{referencePosition:{value:new te},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distanceRGBA_vert,fragmentShader:dt.distanceRGBA_frag},shadow:{uniforms:vn([Ae.lights,Ae.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};pi.physical={uniforms:vn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new mt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new mt},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new mt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new mt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new mt},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new mt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new mt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new mt},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new mt},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new mt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new mt},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new mt}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};const cl={r:0,b:0,g:0};function KS(o,e,n,s,a,u,d){const c=new _t(0);let h=u===!0?0:1,m,g,v=null,S=0,M=null;function w(x,_){let N=!1,P=_.isScene===!0?_.background:null;P&&P.isTexture&&(P=(_.backgroundBlurriness>0?n:e).get(P)),P===null?T(c,h):P&&P.isColor&&(T(P,1),N=!0);const U=o.xr.getEnvironmentBlendMode();U==="additive"?s.buffers.color.setClear(0,0,0,1,d):U==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,d),(o.autoClear||N)&&o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil),P&&(P.isCubeTexture||P.mapping===Ml)?(g===void 0&&(g=new mi(new Io(1,1,1),new Pn({name:"BackgroundCubeMaterial",uniforms:Bs(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Ln,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(Y,O,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(g)),g.material.uniforms.envMap.value=P,g.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,g.material.toneMapped=wt.getTransfer(P.colorSpace)!==bt,(v!==P||S!==P.version||M!==o.toneMapping)&&(g.material.needsUpdate=!0,v=P,S=P.version,M=o.toneMapping),g.layers.enableAll(),x.unshift(g,g.geometry,g.material,0,0,null)):P&&P.isTexture&&(m===void 0&&(m=new mi(new Al(2,2),new Pn({name:"BackgroundMaterial",uniforms:Bs(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:_r,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=P,m.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,m.material.toneMapped=wt.getTransfer(P.colorSpace)!==bt,P.matrixAutoUpdate===!0&&P.updateMatrix(),m.material.uniforms.uvTransform.value.copy(P.matrix),(v!==P||S!==P.version||M!==o.toneMapping)&&(m.material.needsUpdate=!0,v=P,S=P.version,M=o.toneMapping),m.layers.enableAll(),x.unshift(m,m.geometry,m.material,0,0,null))}function T(x,_){x.getRGB(cl,Am(o)),s.buffers.color.setClear(cl.r,cl.g,cl.b,_,d)}return{getClearColor:function(){return c},setClearColor:function(x,_=1){c.set(x),h=_,T(c,h)},getClearAlpha:function(){return h},setClearAlpha:function(x){h=x,T(c,h)},render:w}}function $S(o,e,n,s){const a=o.getParameter(o.MAX_VERTEX_ATTRIBS),u=s.isWebGL2?null:e.get("OES_vertex_array_object"),d=s.isWebGL2||u!==null,c={},h=x(null);let m=h,g=!1;function v(k,Q,re,ae,G){let K=!1;if(d){const V=T(ae,re,Q);m!==V&&(m=V,M(m.object)),K=_(k,ae,re,G),K&&N(k,ae,re,G)}else{const V=Q.wireframe===!0;(m.geometry!==ae.id||m.program!==re.id||m.wireframe!==V)&&(m.geometry=ae.id,m.program=re.id,m.wireframe=V,K=!0)}G!==null&&n.update(G,o.ELEMENT_ARRAY_BUFFER),(K||g)&&(g=!1,ce(k,Q,re,ae),G!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,n.get(G).buffer))}function S(){return s.isWebGL2?o.createVertexArray():u.createVertexArrayOES()}function M(k){return s.isWebGL2?o.bindVertexArray(k):u.bindVertexArrayOES(k)}function w(k){return s.isWebGL2?o.deleteVertexArray(k):u.deleteVertexArrayOES(k)}function T(k,Q,re){const ae=re.wireframe===!0;let G=c[k.id];G===void 0&&(G={},c[k.id]=G);let K=G[Q.id];K===void 0&&(K={},G[Q.id]=K);let V=K[ae];return V===void 0&&(V=x(S()),K[ae]=V),V}function x(k){const Q=[],re=[],ae=[];for(let G=0;G<a;G++)Q[G]=0,re[G]=0,ae[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Q,enabledAttributes:re,attributeDivisors:ae,object:k,attributes:{},index:null}}function _(k,Q,re,ae){const G=m.attributes,K=Q.attributes;let V=0;const L=re.getAttributes();for(const H in L)if(L[H].location>=0){const se=G[H];let fe=K[H];if(fe===void 0&&(H==="instanceMatrix"&&k.instanceMatrix&&(fe=k.instanceMatrix),H==="instanceColor"&&k.instanceColor&&(fe=k.instanceColor)),se===void 0||se.attribute!==fe||fe&&se.data!==fe.data)return!0;V++}return m.attributesNum!==V||m.index!==ae}function N(k,Q,re,ae){const G={},K=Q.attributes;let V=0;const L=re.getAttributes();for(const H in L)if(L[H].location>=0){let se=K[H];se===void 0&&(H==="instanceMatrix"&&k.instanceMatrix&&(se=k.instanceMatrix),H==="instanceColor"&&k.instanceColor&&(se=k.instanceColor));const fe={};fe.attribute=se,se&&se.data&&(fe.data=se.data),G[H]=fe,V++}m.attributes=G,m.attributesNum=V,m.index=ae}function P(){const k=m.newAttributes;for(let Q=0,re=k.length;Q<re;Q++)k[Q]=0}function U(k){Y(k,0)}function Y(k,Q){const re=m.newAttributes,ae=m.enabledAttributes,G=m.attributeDivisors;re[k]=1,ae[k]===0&&(o.enableVertexAttribArray(k),ae[k]=1),G[k]!==Q&&((s.isWebGL2?o:e.get("ANGLE_instanced_arrays"))[s.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](k,Q),G[k]=Q)}function O(){const k=m.newAttributes,Q=m.enabledAttributes;for(let re=0,ae=Q.length;re<ae;re++)Q[re]!==k[re]&&(o.disableVertexAttribArray(re),Q[re]=0)}function I(k,Q,re,ae,G,K,V){V===!0?o.vertexAttribIPointer(k,Q,re,G,K):o.vertexAttribPointer(k,Q,re,ae,G,K)}function ce(k,Q,re,ae){if(s.isWebGL2===!1&&(k.isInstancedMesh||ae.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;P();const G=ae.attributes,K=re.getAttributes(),V=Q.defaultAttributeValues;for(const L in K){const H=K[L];if(H.location>=0){let W=G[L];if(W===void 0&&(L==="instanceMatrix"&&k.instanceMatrix&&(W=k.instanceMatrix),L==="instanceColor"&&k.instanceColor&&(W=k.instanceColor)),W!==void 0){const se=W.normalized,fe=W.itemSize,Me=n.get(W);if(Me===void 0)continue;const de=Me.buffer,Se=Me.type,Ee=Me.bytesPerElement,Ne=s.isWebGL2===!0&&(Se===o.INT||Se===o.UNSIGNED_INT||W.gpuType===um);if(W.isInterleavedBufferAttribute){const ct=W.data,Z=ct.stride,Nt=W.offset;if(ct.isInstancedInterleavedBuffer){for(let Ve=0;Ve<H.locationSize;Ve++)Y(H.location+Ve,ct.meshPerAttribute);k.isInstancedMesh!==!0&&ae._maxInstanceCount===void 0&&(ae._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Ve=0;Ve<H.locationSize;Ve++)U(H.location+Ve);o.bindBuffer(o.ARRAY_BUFFER,de);for(let Ve=0;Ve<H.locationSize;Ve++)I(H.location+Ve,fe/H.locationSize,Se,se,Z*Ee,(Nt+fe/H.locationSize*Ve)*Ee,Ne)}else{if(W.isInstancedBufferAttribute){for(let ct=0;ct<H.locationSize;ct++)Y(H.location+ct,W.meshPerAttribute);k.isInstancedMesh!==!0&&ae._maxInstanceCount===void 0&&(ae._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let ct=0;ct<H.locationSize;ct++)U(H.location+ct);o.bindBuffer(o.ARRAY_BUFFER,de);for(let ct=0;ct<H.locationSize;ct++)I(H.location+ct,fe/H.locationSize,Se,se,fe*Ee,fe/H.locationSize*ct*Ee,Ne)}}else if(V!==void 0){const se=V[L];if(se!==void 0)switch(se.length){case 2:o.vertexAttrib2fv(H.location,se);break;case 3:o.vertexAttrib3fv(H.location,se);break;case 4:o.vertexAttrib4fv(H.location,se);break;default:o.vertexAttrib1fv(H.location,se)}}}}O()}function R(){le();for(const k in c){const Q=c[k];for(const re in Q){const ae=Q[re];for(const G in ae)w(ae[G].object),delete ae[G];delete Q[re]}delete c[k]}}function b(k){if(c[k.id]===void 0)return;const Q=c[k.id];for(const re in Q){const ae=Q[re];for(const G in ae)w(ae[G].object),delete ae[G];delete Q[re]}delete c[k.id]}function oe(k){for(const Q in c){const re=c[Q];if(re[k.id]===void 0)continue;const ae=re[k.id];for(const G in ae)w(ae[G].object),delete ae[G];delete re[k.id]}}function le(){_e(),g=!0,m!==h&&(m=h,M(m.object))}function _e(){h.geometry=null,h.program=null,h.wireframe=!1}return{setup:v,reset:le,resetDefaultState:_e,dispose:R,releaseStatesOfGeometry:b,releaseStatesOfProgram:oe,initAttributes:P,enableAttribute:U,disableUnusedAttributes:O}}function QS(o,e,n,s){const a=s.isWebGL2;let u;function d(g){u=g}function c(g,v){o.drawArrays(u,g,v),n.update(v,u,1)}function h(g,v,S){if(S===0)return;let M,w;if(a)M=o,w="drawArraysInstanced";else if(M=e.get("ANGLE_instanced_arrays"),w="drawArraysInstancedANGLE",M===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}M[w](u,g,v,S),n.update(v,u,S)}function m(g,v,S){if(S===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let w=0;w<S;w++)this.render(g[w],v[w]);else{M.multiDrawArraysWEBGL(u,g,0,v,0,S);let w=0;for(let T=0;T<S;T++)w+=v[T];n.update(w,u,1)}}this.setMode=d,this.render=c,this.renderInstances=h,this.renderMultiDraw=m}function ZS(o,e,n){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");s=o.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function u(I){if(I==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const d=typeof WebGL2RenderingContext<"u"&&o.constructor.name==="WebGL2RenderingContext";let c=n.precision!==void 0?n.precision:"highp";const h=u(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const m=d||e.has("WEBGL_draw_buffers"),g=n.logarithmicDepthBuffer===!0,v=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),S=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=o.getParameter(o.MAX_TEXTURE_SIZE),w=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),T=o.getParameter(o.MAX_VERTEX_ATTRIBS),x=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),_=o.getParameter(o.MAX_VARYING_VECTORS),N=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),P=S>0,U=d||e.has("OES_texture_float"),Y=P&&U,O=d?o.getParameter(o.MAX_SAMPLES):0;return{isWebGL2:d,drawBuffers:m,getMaxAnisotropy:a,getMaxPrecision:u,precision:c,logarithmicDepthBuffer:g,maxTextures:v,maxVertexTextures:S,maxTextureSize:M,maxCubemapSize:w,maxAttributes:T,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:N,vertexTextures:P,floatFragmentTextures:U,floatVertexTextures:Y,maxSamples:O}}function JS(o){const e=this;let n=null,s=0,a=!1,u=!1;const d=new Br,c=new mt,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(v,S){const M=v.length!==0||S||s!==0||a;return a=S,s=v.length,M},this.beginShadows=function(){u=!0,g(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(v,S){n=g(v,S,0)},this.setState=function(v,S,M){const w=v.clippingPlanes,T=v.clipIntersection,x=v.clipShadows,_=o.get(v);if(!a||w===null||w.length===0||u&&!x)u?g(null):m();else{const N=u?0:s,P=N*4;let U=_.clippingState||null;h.value=U,U=g(w,S,P,M);for(let Y=0;Y!==P;++Y)U[Y]=n[Y];_.clippingState=U,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=N}};function m(){h.value!==n&&(h.value=n,h.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(v,S,M,w){const T=v!==null?v.length:0;let x=null;if(T!==0){if(x=h.value,w!==!0||x===null){const _=M+T*4,N=S.matrixWorldInverse;c.getNormalMatrix(N),(x===null||x.length<_)&&(x=new Float32Array(_));for(let P=0,U=M;P!==T;++P,U+=4)d.copy(v[P]).applyMatrix4(N,c),d.normal.toArray(x,U),x[U+3]=d.constant}h.value=x,h.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,x}}function ey(o){let e=new WeakMap;function n(d,c){return c===Vc?d.mapping=Is:c===Wc&&(d.mapping=Fs),d}function s(d){if(d&&d.isTexture){const c=d.mapping;if(c===Vc||c===Wc)if(e.has(d)){const h=e.get(d).texture;return n(h,d.mapping)}else{const h=d.image;if(h&&h.height>0){const m=new d0(h.height/2);return m.fromEquirectangularTexture(o,d),e.set(d,m),d.addEventListener("dispose",a),n(m.texture,d.mapping)}else return null}}return d}function a(d){const c=d.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function u(){e=new WeakMap}return{get:s,dispose:u}}class sf extends Rm{constructor(e=-1,n=1,s=1,a=-1,u=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=s,this.bottom=a,this.near=u,this.far=d,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,s,a,u,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=s,this.view.offsetY=a,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let u=s-e,d=s+e,c=a+n,h=a-n;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=m*this.view.offsetX,d=u+m*this.view.width,c-=g*this.view.offsetY,h=c-g*this.view.height}this.projectionMatrix.makeOrthographic(u,d,c,h,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const bs=4,Fp=[.125,.215,.35,.446,.526,.582],Hr=20,Nc=new sf,Op=new _t;let Ic=null,Fc=0,Oc=0;const zr=(1+Math.sqrt(5))/2,Ps=1/zr,Bp=[new te(1,1,1),new te(-1,1,1),new te(1,1,-1),new te(-1,1,-1),new te(0,zr,Ps),new te(0,zr,-Ps),new te(Ps,0,zr),new te(-Ps,0,zr),new te(zr,Ps,0),new te(-zr,Ps,0)];class zp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,s=.1,a=100){Ic=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Oc=this._renderer.getActiveMipmapLevel(),this._setSize(256);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,s,a,u),n>0&&this._blur(u,0,0,n),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ic,Fc,Oc),e.scissorTest=!1,fl(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Is||e.mapping===Fs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ic=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Oc=this._renderer.getActiveMipmapLevel();const s=n||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,s={magFilter:qn,minFilter:qn,generateMipmaps:!1,type:Oi,format:ai,colorSpace:zi,depthBuffer:!1},a=kp(e,n,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kp(e,n,s);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ty(u)),this._blurMaterial=ny(u,e,n)}return a}_compileMaterial(e){const n=new mi(this._lodPlanes[0],e);this._renderer.compile(n,Nc)}_sceneToCubeUV(e,n,s,a){const c=new si(90,1,n,s),h=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],g=this._renderer,v=g.autoClear,S=g.toneMapping;g.getClearColor(Op),g.toneMapping=mr,g.autoClear=!1;const M=new rf({name:"PMREM.Background",side:Ln,depthWrite:!1,depthTest:!1}),w=new mi(new Io,M);let T=!1;const x=e.background;x?x.isColor&&(M.color.copy(x),e.background=null,T=!0):(M.color.copy(Op),T=!0);for(let _=0;_<6;_++){const N=_%3;N===0?(c.up.set(0,h[_],0),c.lookAt(m[_],0,0)):N===1?(c.up.set(0,0,h[_]),c.lookAt(0,m[_],0)):(c.up.set(0,h[_],0),c.lookAt(0,0,m[_]));const P=this._cubeSize;fl(a,N*P,_>2?P:0,P,P),g.setRenderTarget(a),T&&g.render(w,c),g.render(e,c)}w.geometry.dispose(),w.material.dispose(),g.toneMapping=S,g.autoClear=v,e.background=x}_textureToCubeUV(e,n){const s=this._renderer,a=e.mapping===Is||e.mapping===Fs;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hp());const u=a?this._cubemapMaterial:this._equirectMaterial,d=new mi(this._lodPlanes[0],u),c=u.uniforms;c.envMap.value=e;const h=this._cubeSize;fl(n,0,0,3*h,2*h),s.setRenderTarget(n),s.render(d,Nc)}_applyPMREM(e){const n=this._renderer,s=n.autoClear;n.autoClear=!1;for(let a=1;a<this._lodPlanes.length;a++){const u=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),d=Bp[(a-1)%Bp.length];this._blur(e,a-1,a,u,d)}n.autoClear=s}_blur(e,n,s,a,u){const d=this._pingPongRenderTarget;this._halfBlur(e,d,n,s,a,"latitudinal",u),this._halfBlur(d,e,s,s,a,"longitudinal",u)}_halfBlur(e,n,s,a,u,d,c){const h=this._renderer,m=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,v=new mi(this._lodPlanes[a],m),S=m.uniforms,M=this._sizeLods[s]-1,w=isFinite(u)?Math.PI/(2*M):2*Math.PI/(2*Hr-1),T=u/w,x=isFinite(u)?1+Math.floor(g*T):Hr;x>Hr&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Hr}`);const _=[];let N=0;for(let I=0;I<Hr;++I){const ce=I/T,R=Math.exp(-ce*ce/2);_.push(R),I===0?N+=R:I<x&&(N+=2*R)}for(let I=0;I<_.length;I++)_[I]=_[I]/N;S.envMap.value=e.texture,S.samples.value=x,S.weights.value=_,S.latitudinal.value=d==="latitudinal",c&&(S.poleAxis.value=c);const{_lodMax:P}=this;S.dTheta.value=w,S.mipInt.value=P-s;const U=this._sizeLods[a],Y=3*U*(a>P-bs?a-P+bs:0),O=4*(this._cubeSize-U);fl(n,Y,O,3*U,2*U),h.setRenderTarget(n),h.render(v,Nc)}}function ty(o){const e=[],n=[],s=[];let a=o;const u=o-bs+1+Fp.length;for(let d=0;d<u;d++){const c=Math.pow(2,a);n.push(c);let h=1/c;d>o-bs?h=Fp[d-o+bs-1]:d===0&&(h=0),s.push(h);const m=1/(c-2),g=-m,v=1+m,S=[g,g,v,g,v,v,g,g,v,v,g,v],M=6,w=6,T=3,x=2,_=1,N=new Float32Array(T*w*M),P=new Float32Array(x*w*M),U=new Float32Array(_*w*M);for(let O=0;O<M;O++){const I=O%3*2/3-1,ce=O>2?0:-1,R=[I,ce,0,I+2/3,ce,0,I+2/3,ce+1,0,I,ce,0,I+2/3,ce+1,0,I,ce+1,0];N.set(R,T*w*O),P.set(S,x*w*O);const b=[O,O,O,O,O,O];U.set(b,_*w*O)}const Y=new vr;Y.setAttribute("position",new gi(N,T)),Y.setAttribute("uv",new gi(P,x)),Y.setAttribute("faceIndex",new gi(U,_)),e.push(Y),a>bs&&a--}return{lodPlanes:e,sizeLods:n,sigmas:s}}function kp(o,e,n){const s=new li(o,e,n);return s.texture.mapping=Ml,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function fl(o,e,n,s,a){o.viewport.set(e,n,s,a),o.scissor.set(e,n,s,a)}function ny(o,e,n){const s=new Float32Array(Hr),a=new te(0,1,0);return new Pn({name:"SphericalGaussianBlur",defines:{n:Hr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:of(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function Hp(){return new Pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:of(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function Gp(){return new Pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:of(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function of(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function iy(o){let e=new WeakMap,n=null;function s(c){if(c&&c.isTexture){const h=c.mapping,m=h===Vc||h===Wc,g=h===Is||h===Fs;if(m||g)if(c.isRenderTargetTexture&&c.needsPMREMUpdate===!0){c.needsPMREMUpdate=!1;let v=e.get(c);return n===null&&(n=new zp(o)),v=m?n.fromEquirectangular(c,v):n.fromCubemap(c,v),e.set(c,v),v.texture}else{if(e.has(c))return e.get(c).texture;{const v=c.image;if(m&&v&&v.height>0||g&&v&&a(v)){n===null&&(n=new zp(o));const S=m?n.fromEquirectangular(c):n.fromCubemap(c);return e.set(c,S),c.addEventListener("dispose",u),S.texture}else return null}}}return c}function a(c){let h=0;const m=6;for(let g=0;g<m;g++)c[g]!==void 0&&h++;return h===m}function u(c){const h=c.target;h.removeEventListener("dispose",u);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function d(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function ry(o){const e={};function n(s){if(e[s]!==void 0)return e[s];let a;switch(s){case"WEBGL_depth_texture":a=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=o.getExtension(s)}return e[s]=a,a}return{has:function(s){return n(s)!==null},init:function(s){s.isWebGL2?(n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance")):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(s){const a=n(s);return a===null&&console.warn("THREE.WebGLRenderer: "+s+" extension not supported."),a}}}function sy(o,e,n,s){const a={},u=new WeakMap;function d(v){const S=v.target;S.index!==null&&e.remove(S.index);for(const w in S.attributes)e.remove(S.attributes[w]);for(const w in S.morphAttributes){const T=S.morphAttributes[w];for(let x=0,_=T.length;x<_;x++)e.remove(T[x])}S.removeEventListener("dispose",d),delete a[S.id];const M=u.get(S);M&&(e.remove(M),u.delete(S)),s.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,n.memory.geometries--}function c(v,S){return a[S.id]===!0||(S.addEventListener("dispose",d),a[S.id]=!0,n.memory.geometries++),S}function h(v){const S=v.attributes;for(const w in S)e.update(S[w],o.ARRAY_BUFFER);const M=v.morphAttributes;for(const w in M){const T=M[w];for(let x=0,_=T.length;x<_;x++)e.update(T[x],o.ARRAY_BUFFER)}}function m(v){const S=[],M=v.index,w=v.attributes.position;let T=0;if(M!==null){const N=M.array;T=M.version;for(let P=0,U=N.length;P<U;P+=3){const Y=N[P+0],O=N[P+1],I=N[P+2];S.push(Y,O,O,I,I,Y)}}else if(w!==void 0){const N=w.array;T=w.version;for(let P=0,U=N.length/3-1;P<U;P+=3){const Y=P+0,O=P+1,I=P+2;S.push(Y,O,O,I,I,Y)}}else return;const x=new(vm(S)?wm:Tm)(S,1);x.version=T;const _=u.get(v);_&&e.remove(_),u.set(v,x)}function g(v){const S=u.get(v);if(S){const M=v.index;M!==null&&S.version<M.version&&m(v)}else m(v);return u.get(v)}return{get:c,update:h,getWireframeAttribute:g}}function oy(o,e,n,s){const a=s.isWebGL2;let u;function d(M){u=M}let c,h;function m(M){c=M.type,h=M.bytesPerElement}function g(M,w){o.drawElements(u,w,c,M*h),n.update(w,u,1)}function v(M,w,T){if(T===0)return;let x,_;if(a)x=o,_="drawElementsInstanced";else if(x=e.get("ANGLE_instanced_arrays"),_="drawElementsInstancedANGLE",x===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}x[_](u,w,c,M*h,T),n.update(w,u,T)}function S(M,w,T){if(T===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let _=0;_<T;_++)this.render(M[_]/h,w[_]);else{x.multiDrawElementsWEBGL(u,w,0,c,M,0,T);let _=0;for(let N=0;N<T;N++)_+=w[N];n.update(_,u,1)}}this.setMode=d,this.setIndex=m,this.render=g,this.renderInstances=v,this.renderMultiDraw=S}function ay(o){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function s(u,d,c){switch(n.calls++,d){case o.TRIANGLES:n.triangles+=c*(u/3);break;case o.LINES:n.lines+=c*(u/2);break;case o.LINE_STRIP:n.lines+=c*(u-1);break;case o.LINE_LOOP:n.lines+=c*u;break;case o.POINTS:n.points+=c*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function a(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:a,update:s}}function ly(o,e){return o[0]-e[0]}function uy(o,e){return Math.abs(e[1])-Math.abs(o[1])}function cy(o,e,n){const s={},a=new Float32Array(8),u=new WeakMap,d=new rn,c=[];for(let m=0;m<8;m++)c[m]=[m,0];function h(m,g,v){const S=m.morphTargetInfluences;if(e.isWebGL2===!0){const w=g.morphAttributes.position||g.morphAttributes.normal||g.morphAttributes.color,T=w!==void 0?w.length:0;let x=u.get(g);if(x===void 0||x.count!==T){let Q=function(){_e.dispose(),u.delete(g),g.removeEventListener("dispose",Q)};var M=Q;x!==void 0&&x.texture.dispose();const P=g.morphAttributes.position!==void 0,U=g.morphAttributes.normal!==void 0,Y=g.morphAttributes.color!==void 0,O=g.morphAttributes.position||[],I=g.morphAttributes.normal||[],ce=g.morphAttributes.color||[];let R=0;P===!0&&(R=1),U===!0&&(R=2),Y===!0&&(R=3);let b=g.attributes.position.count*R,oe=1;b>e.maxTextureSize&&(oe=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const le=new Float32Array(b*oe*4*T),_e=new ym(le,b,oe,T);_e.type=pr,_e.needsUpdate=!0;const k=R*4;for(let re=0;re<T;re++){const ae=O[re],G=I[re],K=ce[re],V=b*oe*4*re;for(let L=0;L<ae.count;L++){const H=L*k;P===!0&&(d.fromBufferAttribute(ae,L),le[V+H+0]=d.x,le[V+H+1]=d.y,le[V+H+2]=d.z,le[V+H+3]=0),U===!0&&(d.fromBufferAttribute(G,L),le[V+H+4]=d.x,le[V+H+5]=d.y,le[V+H+6]=d.z,le[V+H+7]=0),Y===!0&&(d.fromBufferAttribute(K,L),le[V+H+8]=d.x,le[V+H+9]=d.y,le[V+H+10]=d.z,le[V+H+11]=K.itemSize===4?d.w:1)}}x={count:T,texture:_e,size:new at(b,oe)},u.set(g,x),g.addEventListener("dispose",Q)}let _=0;for(let P=0;P<S.length;P++)_+=S[P];const N=g.morphTargetsRelative?1:1-_;v.getUniforms().setValue(o,"morphTargetBaseInfluence",N),v.getUniforms().setValue(o,"morphTargetInfluences",S),v.getUniforms().setValue(o,"morphTargetsTexture",x.texture,n),v.getUniforms().setValue(o,"morphTargetsTextureSize",x.size)}else{const w=S===void 0?0:S.length;let T=s[g.id];if(T===void 0||T.length!==w){T=[];for(let U=0;U<w;U++)T[U]=[U,0];s[g.id]=T}for(let U=0;U<w;U++){const Y=T[U];Y[0]=U,Y[1]=S[U]}T.sort(uy);for(let U=0;U<8;U++)U<w&&T[U][1]?(c[U][0]=T[U][0],c[U][1]=T[U][1]):(c[U][0]=Number.MAX_SAFE_INTEGER,c[U][1]=0);c.sort(ly);const x=g.morphAttributes.position,_=g.morphAttributes.normal;let N=0;for(let U=0;U<8;U++){const Y=c[U],O=Y[0],I=Y[1];O!==Number.MAX_SAFE_INTEGER&&I?(x&&g.getAttribute("morphTarget"+U)!==x[O]&&g.setAttribute("morphTarget"+U,x[O]),_&&g.getAttribute("morphNormal"+U)!==_[O]&&g.setAttribute("morphNormal"+U,_[O]),a[U]=I,N+=I):(x&&g.hasAttribute("morphTarget"+U)===!0&&g.deleteAttribute("morphTarget"+U),_&&g.hasAttribute("morphNormal"+U)===!0&&g.deleteAttribute("morphNormal"+U),a[U]=0)}const P=g.morphTargetsRelative?1:1-N;v.getUniforms().setValue(o,"morphTargetBaseInfluence",P),v.getUniforms().setValue(o,"morphTargetInfluences",a)}}return{update:h}}function fy(o,e,n,s){let a=new WeakMap;function u(h){const m=s.render.frame,g=h.geometry,v=e.get(h,g);if(a.get(v)!==m&&(e.update(v),a.set(v,m)),h.isInstancedMesh&&(h.hasEventListener("dispose",c)===!1&&h.addEventListener("dispose",c),a.get(h)!==m&&(n.update(h.instanceMatrix,o.ARRAY_BUFFER),h.instanceColor!==null&&n.update(h.instanceColor,o.ARRAY_BUFFER),a.set(h,m))),h.isSkinnedMesh){const S=h.skeleton;a.get(S)!==m&&(S.update(),a.set(S,m))}return v}function d(){a=new WeakMap}function c(h){const m=h.target;m.removeEventListener("dispose",c),n.remove(m.instanceMatrix),m.instanceColor!==null&&n.remove(m.instanceColor)}return{update:u,dispose:d}}class bm extends On{constructor(e,n,s,a,u,d,c,h,m,g){if(g=g!==void 0?g:Vr,g!==Vr&&g!==Os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Vr&&(s=hr),s===void 0&&g===Os&&(s=Gr),super(null,a,u,d,c,h,g,s,m),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=c!==void 0?c:xn,this.minFilter=h!==void 0?h:xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const Dm=new On,Um=new bm(1,1);Um.compareFunction=_m;const Nm=new ym,Im=new Kv,Fm=new Cm,Vp=[],Wp=[],Xp=new Float32Array(16),Yp=new Float32Array(9),qp=new Float32Array(4);function Gs(o,e,n){const s=o[0];if(s<=0||s>0)return o;const a=e*n;let u=Vp[a];if(u===void 0&&(u=new Float32Array(a),Vp[a]=u),e!==0){s.toArray(u,0);for(let d=1,c=0;d!==e;++d)c+=n,o[d].toArray(u,c)}return u}function qt(o,e){if(o.length!==e.length)return!1;for(let n=0,s=o.length;n<s;n++)if(o[n]!==e[n])return!1;return!0}function jt(o,e){for(let n=0,s=e.length;n<s;n++)o[n]=e[n]}function Rl(o,e){let n=Wp[e];n===void 0&&(n=new Int32Array(e),Wp[e]=n);for(let s=0;s!==e;++s)n[s]=o.allocateTextureUnit();return n}function dy(o,e){const n=this.cache;n[0]!==e&&(o.uniform1f(this.addr,e),n[0]=e)}function hy(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(qt(n,e))return;o.uniform2fv(this.addr,e),jt(n,e)}}function py(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(qt(n,e))return;o.uniform3fv(this.addr,e),jt(n,e)}}function my(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(qt(n,e))return;o.uniform4fv(this.addr,e),jt(n,e)}}function gy(o,e){const n=this.cache,s=e.elements;if(s===void 0){if(qt(n,e))return;o.uniformMatrix2fv(this.addr,!1,e),jt(n,e)}else{if(qt(n,s))return;qp.set(s),o.uniformMatrix2fv(this.addr,!1,qp),jt(n,s)}}function _y(o,e){const n=this.cache,s=e.elements;if(s===void 0){if(qt(n,e))return;o.uniformMatrix3fv(this.addr,!1,e),jt(n,e)}else{if(qt(n,s))return;Yp.set(s),o.uniformMatrix3fv(this.addr,!1,Yp),jt(n,s)}}function vy(o,e){const n=this.cache,s=e.elements;if(s===void 0){if(qt(n,e))return;o.uniformMatrix4fv(this.addr,!1,e),jt(n,e)}else{if(qt(n,s))return;Xp.set(s),o.uniformMatrix4fv(this.addr,!1,Xp),jt(n,s)}}function xy(o,e){const n=this.cache;n[0]!==e&&(o.uniform1i(this.addr,e),n[0]=e)}function Sy(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(qt(n,e))return;o.uniform2iv(this.addr,e),jt(n,e)}}function yy(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(qt(n,e))return;o.uniform3iv(this.addr,e),jt(n,e)}}function My(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(qt(n,e))return;o.uniform4iv(this.addr,e),jt(n,e)}}function Ey(o,e){const n=this.cache;n[0]!==e&&(o.uniform1ui(this.addr,e),n[0]=e)}function Ty(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(qt(n,e))return;o.uniform2uiv(this.addr,e),jt(n,e)}}function wy(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(qt(n,e))return;o.uniform3uiv(this.addr,e),jt(n,e)}}function Ay(o,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(qt(n,e))return;o.uniform4uiv(this.addr,e),jt(n,e)}}function Ry(o,e,n){const s=this.cache,a=n.allocateTextureUnit();s[0]!==a&&(o.uniform1i(this.addr,a),s[0]=a);const u=this.type===o.SAMPLER_2D_SHADOW?Um:Dm;n.setTexture2D(e||u,a)}function Cy(o,e,n){const s=this.cache,a=n.allocateTextureUnit();s[0]!==a&&(o.uniform1i(this.addr,a),s[0]=a),n.setTexture3D(e||Im,a)}function Py(o,e,n){const s=this.cache,a=n.allocateTextureUnit();s[0]!==a&&(o.uniform1i(this.addr,a),s[0]=a),n.setTextureCube(e||Fm,a)}function Ly(o,e,n){const s=this.cache,a=n.allocateTextureUnit();s[0]!==a&&(o.uniform1i(this.addr,a),s[0]=a),n.setTexture2DArray(e||Nm,a)}function by(o){switch(o){case 5126:return dy;case 35664:return hy;case 35665:return py;case 35666:return my;case 35674:return gy;case 35675:return _y;case 35676:return vy;case 5124:case 35670:return xy;case 35667:case 35671:return Sy;case 35668:case 35672:return yy;case 35669:case 35673:return My;case 5125:return Ey;case 36294:return Ty;case 36295:return wy;case 36296:return Ay;case 35678:case 36198:case 36298:case 36306:case 35682:return Ry;case 35679:case 36299:case 36307:return Cy;case 35680:case 36300:case 36308:case 36293:return Py;case 36289:case 36303:case 36311:case 36292:return Ly}}function Dy(o,e){o.uniform1fv(this.addr,e)}function Uy(o,e){const n=Gs(e,this.size,2);o.uniform2fv(this.addr,n)}function Ny(o,e){const n=Gs(e,this.size,3);o.uniform3fv(this.addr,n)}function Iy(o,e){const n=Gs(e,this.size,4);o.uniform4fv(this.addr,n)}function Fy(o,e){const n=Gs(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,n)}function Oy(o,e){const n=Gs(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,n)}function By(o,e){const n=Gs(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,n)}function zy(o,e){o.uniform1iv(this.addr,e)}function ky(o,e){o.uniform2iv(this.addr,e)}function Hy(o,e){o.uniform3iv(this.addr,e)}function Gy(o,e){o.uniform4iv(this.addr,e)}function Vy(o,e){o.uniform1uiv(this.addr,e)}function Wy(o,e){o.uniform2uiv(this.addr,e)}function Xy(o,e){o.uniform3uiv(this.addr,e)}function Yy(o,e){o.uniform4uiv(this.addr,e)}function qy(o,e,n){const s=this.cache,a=e.length,u=Rl(n,a);qt(s,u)||(o.uniform1iv(this.addr,u),jt(s,u));for(let d=0;d!==a;++d)n.setTexture2D(e[d]||Dm,u[d])}function jy(o,e,n){const s=this.cache,a=e.length,u=Rl(n,a);qt(s,u)||(o.uniform1iv(this.addr,u),jt(s,u));for(let d=0;d!==a;++d)n.setTexture3D(e[d]||Im,u[d])}function Ky(o,e,n){const s=this.cache,a=e.length,u=Rl(n,a);qt(s,u)||(o.uniform1iv(this.addr,u),jt(s,u));for(let d=0;d!==a;++d)n.setTextureCube(e[d]||Fm,u[d])}function $y(o,e,n){const s=this.cache,a=e.length,u=Rl(n,a);qt(s,u)||(o.uniform1iv(this.addr,u),jt(s,u));for(let d=0;d!==a;++d)n.setTexture2DArray(e[d]||Nm,u[d])}function Qy(o){switch(o){case 5126:return Dy;case 35664:return Uy;case 35665:return Ny;case 35666:return Iy;case 35674:return Fy;case 35675:return Oy;case 35676:return By;case 5124:case 35670:return zy;case 35667:case 35671:return ky;case 35668:case 35672:return Hy;case 35669:case 35673:return Gy;case 5125:return Vy;case 36294:return Wy;case 36295:return Xy;case 36296:return Yy;case 35678:case 36198:case 36298:case 36306:case 35682:return qy;case 35679:case 36299:case 36307:return jy;case 35680:case 36300:case 36308:case 36293:return Ky;case 36289:case 36303:case 36311:case 36292:return $y}}class Zy{constructor(e,n,s){this.id=e,this.addr=s,this.cache=[],this.type=n.type,this.setValue=by(n.type)}}class Jy{constructor(e,n,s){this.id=e,this.addr=s,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=Qy(n.type)}}class eM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,s){const a=this.seq;for(let u=0,d=a.length;u!==d;++u){const c=a[u];c.setValue(e,n[c.id],s)}}}const Bc=/(\w+)(\])?(\[|\.)?/g;function jp(o,e){o.seq.push(e),o.map[e.id]=e}function tM(o,e,n){const s=o.name,a=s.length;for(Bc.lastIndex=0;;){const u=Bc.exec(s),d=Bc.lastIndex;let c=u[1];const h=u[2]==="]",m=u[3];if(h&&(c=c|0),m===void 0||m==="["&&d+2===a){jp(n,m===void 0?new Zy(c,o,e):new Jy(c,o,e));break}else{let v=n.map[c];v===void 0&&(v=new eM(c),jp(n,v)),n=v}}}class hl{constructor(e,n){this.seq=[],this.map={};const s=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<s;++a){const u=e.getActiveUniform(n,a),d=e.getUniformLocation(n,u.name);tM(u,d,this)}}setValue(e,n,s,a){const u=this.map[n];u!==void 0&&u.setValue(e,s,a)}setOptional(e,n,s){const a=n[s];a!==void 0&&this.setValue(e,s,a)}static upload(e,n,s,a){for(let u=0,d=n.length;u!==d;++u){const c=n[u],h=s[c.id];h.needsUpdate!==!1&&c.setValue(e,h.value,a)}}static seqWithValue(e,n){const s=[];for(let a=0,u=e.length;a!==u;++a){const d=e[a];d.id in n&&s.push(d)}return s}}function Kp(o,e,n){const s=o.createShader(e);return o.shaderSource(s,n),o.compileShader(s),s}const nM=37297;let iM=0;function rM(o,e){const n=o.split(`
`),s=[],a=Math.max(e-6,0),u=Math.min(e+6,n.length);for(let d=a;d<u;d++){const c=d+1;s.push(`${c===e?">":" "} ${c}: ${n[d]}`)}return s.join(`
`)}function sM(o){const e=wt.getPrimaries(wt.workingColorSpace),n=wt.getPrimaries(o);let s;switch(e===n?s="":e===_l&&n===gl?s="LinearDisplayP3ToLinearSRGB":e===gl&&n===_l&&(s="LinearSRGBToLinearDisplayP3"),o){case zi:case El:return[s,"LinearTransferOETF"];case nn:case ef:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",o),[s,"LinearTransferOETF"]}}function $p(o,e,n){const s=o.getShaderParameter(e,o.COMPILE_STATUS),a=o.getShaderInfoLog(e).trim();if(s&&a==="")return"";const u=/ERROR: 0:(\d+)/.exec(a);if(u){const d=parseInt(u[1]);return n.toUpperCase()+`

`+a+`

`+rM(o.getShaderSource(e),d)}else return a}function oM(o,e){const n=sM(e);return`vec4 ${o}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function aM(o,e){let n;switch(e){case rv:n="Linear";break;case sv:n="Reinhard";break;case ov:n="OptimizedCineon";break;case av:n="ACESFilmic";break;case uv:n="AgX";break;case lv:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+o+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function lM(o){return[o.extensionDerivatives||o.envMapCubeUVHeight||o.bumpMap||o.normalMapTangentSpace||o.clearcoatNormalMap||o.flatShading||o.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(o.extensionFragDepth||o.logarithmicDepthBuffer)&&o.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",o.extensionDrawBuffers&&o.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(o.extensionShaderTextureLOD||o.envMap||o.transmission)&&o.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ds).join(`
`)}function uM(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ds).join(`
`)}function cM(o){const e=[];for(const n in o){const s=o[n];s!==!1&&e.push("#define "+n+" "+s)}return e.join(`
`)}function fM(o,e){const n={},s=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let a=0;a<s;a++){const u=o.getActiveAttrib(e,a),d=u.name;let c=1;u.type===o.FLOAT_MAT2&&(c=2),u.type===o.FLOAT_MAT3&&(c=3),u.type===o.FLOAT_MAT4&&(c=4),n[d]={type:u.type,location:o.getAttribLocation(e,d),locationSize:c}}return n}function Ds(o){return o!==""}function Qp(o,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Zp(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const dM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Kc(o){return o.replace(dM,pM)}const hM=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function pM(o,e){let n=dt[e];if(n===void 0){const s=hM.get(e);if(s!==void 0)n=dt[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Kc(n)}const mM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jp(o){return o.replace(mM,gM)}function gM(o,e,n,s){let a="";for(let u=parseInt(e);u<parseInt(n);u++)a+=s.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return a}function em(o){let e="precision "+o.precision+` float;
precision `+o.precision+" int;";return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function _M(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===om?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===D_?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ui&&(e="SHADOWMAP_TYPE_VSM"),e}function vM(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Is:case Fs:e="ENVMAP_TYPE_CUBE";break;case Ml:e="ENVMAP_TYPE_CUBE_UV";break}return e}function xM(o){let e="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case Fs:e="ENVMAP_MODE_REFRACTION";break}return e}function SM(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case am:e="ENVMAP_BLENDING_MULTIPLY";break;case nv:e="ENVMAP_BLENDING_MIX";break;case iv:e="ENVMAP_BLENDING_ADD";break}return e}function yM(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:s,maxMip:n}}function MM(o,e,n,s){const a=o.getContext(),u=n.defines;let d=n.vertexShader,c=n.fragmentShader;const h=_M(n),m=vM(n),g=xM(n),v=SM(n),S=yM(n),M=n.isWebGL2?"":lM(n),w=uM(n),T=cM(u),x=a.createProgram();let _,N,P=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(_=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,T].filter(Ds).join(`
`),_.length>0&&(_+=`
`),N=[M,"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,T].filter(Ds).join(`
`),N.length>0&&(N+=`
`)):(_=[em(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,T,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+g:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors&&n.isWebGL2?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+h:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ds).join(`
`),N=[M,em(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,T,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+m:"",n.envMap?"#define "+g:"",n.envMap?"#define "+v:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+h:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==mr?"#define TONE_MAPPING":"",n.toneMapping!==mr?dt.tonemapping_pars_fragment:"",n.toneMapping!==mr?aM("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,oM("linearToOutputTexel",n.outputColorSpace),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Ds).join(`
`)),d=Kc(d),d=Qp(d,n),d=Zp(d,n),c=Kc(c),c=Qp(c,n),c=Zp(c,n),d=Jp(d),c=Jp(c),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,_=[w,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,N=["precision mediump sampler2DArray;","#define varying in",n.glslVersion===_p?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===_p?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+N);const U=P+_+d,Y=P+N+c,O=Kp(a,a.VERTEX_SHADER,U),I=Kp(a,a.FRAGMENT_SHADER,Y);a.attachShader(x,O),a.attachShader(x,I),n.index0AttributeName!==void 0?a.bindAttribLocation(x,0,n.index0AttributeName):n.morphTargets===!0&&a.bindAttribLocation(x,0,"position"),a.linkProgram(x);function ce(le){if(o.debug.checkShaderErrors){const _e=a.getProgramInfoLog(x).trim(),k=a.getShaderInfoLog(O).trim(),Q=a.getShaderInfoLog(I).trim();let re=!0,ae=!0;if(a.getProgramParameter(x,a.LINK_STATUS)===!1)if(re=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(a,x,O,I);else{const G=$p(a,O,"vertex"),K=$p(a,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(x,a.VALIDATE_STATUS)+`

Program Info Log: `+_e+`
`+G+`
`+K)}else _e!==""?console.warn("THREE.WebGLProgram: Program Info Log:",_e):(k===""||Q==="")&&(ae=!1);ae&&(le.diagnostics={runnable:re,programLog:_e,vertexShader:{log:k,prefix:_},fragmentShader:{log:Q,prefix:N}})}a.deleteShader(O),a.deleteShader(I),R=new hl(a,x),b=fM(a,x)}let R;this.getUniforms=function(){return R===void 0&&ce(this),R};let b;this.getAttributes=function(){return b===void 0&&ce(this),b};let oe=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return oe===!1&&(oe=a.getProgramParameter(x,nM)),oe},this.destroy=function(){s.releaseStatesOfProgram(this),a.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=iM++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=O,this.fragmentShader=I,this}let EM=0;class TM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,s=e.fragmentShader,a=this._getShaderStage(n),u=this._getShaderStage(s),d=this._getShaderCacheForMaterial(e);return d.has(a)===!1&&(d.add(a),a.usedTimes++),d.has(u)===!1&&(d.add(u),u.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const s of n)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let s=n.get(e);return s===void 0&&(s=new Set,n.set(e,s)),s}_getShaderStage(e){const n=this.shaderCache;let s=n.get(e);return s===void 0&&(s=new wM(e),n.set(e,s)),s}}class wM{constructor(e){this.id=EM++,this.code=e,this.usedTimes=0}}function AM(o,e,n,s,a,u,d){const c=new Mm,h=new TM,m=[],g=a.isWebGL2,v=a.logarithmicDepthBuffer,S=a.vertexTextures;let M=a.precision;const w={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(R){return R===0?"uv":`uv${R}`}function x(R,b,oe,le,_e){const k=le.fog,Q=_e.geometry,re=R.isMeshStandardMaterial?le.environment:null,ae=(R.isMeshStandardMaterial?n:e).get(R.envMap||re),G=ae&&ae.mapping===Ml?ae.image.height:null,K=w[R.type];R.precision!==null&&(M=a.getMaxPrecision(R.precision),M!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",M,"instead."));const V=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,L=V!==void 0?V.length:0;let H=0;Q.morphAttributes.position!==void 0&&(H=1),Q.morphAttributes.normal!==void 0&&(H=2),Q.morphAttributes.color!==void 0&&(H=3);let W,se,fe,Me;if(K){const Kt=pi[K];W=Kt.vertexShader,se=Kt.fragmentShader}else W=R.vertexShader,se=R.fragmentShader,h.update(R),fe=h.getVertexShaderID(R),Me=h.getFragmentShaderID(R);const de=o.getRenderTarget(),Se=_e.isInstancedMesh===!0,Ee=_e.isBatchedMesh===!0,Ne=!!R.map,ct=!!R.matcap,Z=!!ae,Nt=!!R.aoMap,Ve=!!R.lightMap,$e=!!R.bumpMap,ze=!!R.normalMap,ht=!!R.displacementMap,rt=!!R.emissiveMap,C=!!R.metalnessMap,E=!!R.roughnessMap,$=R.anisotropy>0,ge=R.clearcoat>0,me=R.iridescence>0,xe=R.sheen>0,Oe=R.transmission>0,Re=$&&!!R.anisotropyMap,De=ge&&!!R.clearcoatMap,He=ge&&!!R.clearcoatNormalMap,We=ge&&!!R.clearcoatRoughnessMap,ue=me&&!!R.iridescenceMap,Qe=me&&!!R.iridescenceThicknessMap,tt=xe&&!!R.sheenColorMap,Ye=xe&&!!R.sheenRoughnessMap,Ge=!!R.specularMap,Pe=!!R.specularColorMap,Ze=!!R.specularIntensityMap,st=Oe&&!!R.transmissionMap,vt=Oe&&!!R.thicknessMap,lt=!!R.gradientMap,Te=!!R.alphaMap,B=R.alphaTest>0,we=!!R.alphaHash,Ce=!!R.extensions,et=!!Q.attributes.uv1,qe=!!Q.attributes.uv2,Mt=!!Q.attributes.uv3;let Et=mr;return R.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Et=o.toneMapping),{isWebGL2:g,shaderID:K,shaderType:R.type,shaderName:R.name,vertexShader:W,fragmentShader:se,defines:R.defines,customVertexShaderID:fe,customFragmentShaderID:Me,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:M,batching:Ee,instancing:Se,instancingColor:Se&&_e.instanceColor!==null,supportsVertexTextures:S,outputColorSpace:de===null?o.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:zi,map:Ne,matcap:ct,envMap:Z,envMapMode:Z&&ae.mapping,envMapCubeUVHeight:G,aoMap:Nt,lightMap:Ve,bumpMap:$e,normalMap:ze,displacementMap:S&&ht,emissiveMap:rt,normalMapObjectSpace:ze&&R.normalMapType===Mv,normalMapTangentSpace:ze&&R.normalMapType===yv,metalnessMap:C,roughnessMap:E,anisotropy:$,anisotropyMap:Re,clearcoat:ge,clearcoatMap:De,clearcoatNormalMap:He,clearcoatRoughnessMap:We,iridescence:me,iridescenceMap:ue,iridescenceThicknessMap:Qe,sheen:xe,sheenColorMap:tt,sheenRoughnessMap:Ye,specularMap:Ge,specularColorMap:Pe,specularIntensityMap:Ze,transmission:Oe,transmissionMap:st,thicknessMap:vt,gradientMap:lt,opaque:R.transparent===!1&&R.blending===Us,alphaMap:Te,alphaTest:B,alphaHash:we,combine:R.combine,mapUv:Ne&&T(R.map.channel),aoMapUv:Nt&&T(R.aoMap.channel),lightMapUv:Ve&&T(R.lightMap.channel),bumpMapUv:$e&&T(R.bumpMap.channel),normalMapUv:ze&&T(R.normalMap.channel),displacementMapUv:ht&&T(R.displacementMap.channel),emissiveMapUv:rt&&T(R.emissiveMap.channel),metalnessMapUv:C&&T(R.metalnessMap.channel),roughnessMapUv:E&&T(R.roughnessMap.channel),anisotropyMapUv:Re&&T(R.anisotropyMap.channel),clearcoatMapUv:De&&T(R.clearcoatMap.channel),clearcoatNormalMapUv:He&&T(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:We&&T(R.clearcoatRoughnessMap.channel),iridescenceMapUv:ue&&T(R.iridescenceMap.channel),iridescenceThicknessMapUv:Qe&&T(R.iridescenceThicknessMap.channel),sheenColorMapUv:tt&&T(R.sheenColorMap.channel),sheenRoughnessMapUv:Ye&&T(R.sheenRoughnessMap.channel),specularMapUv:Ge&&T(R.specularMap.channel),specularColorMapUv:Pe&&T(R.specularColorMap.channel),specularIntensityMapUv:Ze&&T(R.specularIntensityMap.channel),transmissionMapUv:st&&T(R.transmissionMap.channel),thicknessMapUv:vt&&T(R.thicknessMap.channel),alphaMapUv:Te&&T(R.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(ze||$),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,vertexUv1s:et,vertexUv2s:qe,vertexUv3s:Mt,pointsUvs:_e.isPoints===!0&&!!Q.attributes.uv&&(Ne||Te),fog:!!k,useFog:R.fog===!0,fogExp2:k&&k.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:v,skinning:_e.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:L,morphTextureStride:H,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:R.dithering,shadowMapEnabled:o.shadowMap.enabled&&oe.length>0,shadowMapType:o.shadowMap.type,toneMapping:Et,useLegacyLights:o._useLegacyLights,decodeVideoTexture:Ne&&R.map.isVideoTexture===!0&&wt.getTransfer(R.map.colorSpace)===bt,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===Ni,flipSided:R.side===Ln,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionDerivatives:Ce&&R.extensions.derivatives===!0,extensionFragDepth:Ce&&R.extensions.fragDepth===!0,extensionDrawBuffers:Ce&&R.extensions.drawBuffers===!0,extensionShaderTextureLOD:Ce&&R.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Ce&&R.extensions.clipCullDistance&&s.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:g||s.has("EXT_frag_depth"),rendererExtensionDrawBuffers:g||s.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:g||s.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()}}function _(R){const b=[];if(R.shaderID?b.push(R.shaderID):(b.push(R.customVertexShaderID),b.push(R.customFragmentShaderID)),R.defines!==void 0)for(const oe in R.defines)b.push(oe),b.push(R.defines[oe]);return R.isRawShaderMaterial===!1&&(N(b,R),P(b,R),b.push(o.outputColorSpace)),b.push(R.customProgramCacheKey),b.join()}function N(R,b){R.push(b.precision),R.push(b.outputColorSpace),R.push(b.envMapMode),R.push(b.envMapCubeUVHeight),R.push(b.mapUv),R.push(b.alphaMapUv),R.push(b.lightMapUv),R.push(b.aoMapUv),R.push(b.bumpMapUv),R.push(b.normalMapUv),R.push(b.displacementMapUv),R.push(b.emissiveMapUv),R.push(b.metalnessMapUv),R.push(b.roughnessMapUv),R.push(b.anisotropyMapUv),R.push(b.clearcoatMapUv),R.push(b.clearcoatNormalMapUv),R.push(b.clearcoatRoughnessMapUv),R.push(b.iridescenceMapUv),R.push(b.iridescenceThicknessMapUv),R.push(b.sheenColorMapUv),R.push(b.sheenRoughnessMapUv),R.push(b.specularMapUv),R.push(b.specularColorMapUv),R.push(b.specularIntensityMapUv),R.push(b.transmissionMapUv),R.push(b.thicknessMapUv),R.push(b.combine),R.push(b.fogExp2),R.push(b.sizeAttenuation),R.push(b.morphTargetsCount),R.push(b.morphAttributeCount),R.push(b.numDirLights),R.push(b.numPointLights),R.push(b.numSpotLights),R.push(b.numSpotLightMaps),R.push(b.numHemiLights),R.push(b.numRectAreaLights),R.push(b.numDirLightShadows),R.push(b.numPointLightShadows),R.push(b.numSpotLightShadows),R.push(b.numSpotLightShadowsWithMaps),R.push(b.numLightProbes),R.push(b.shadowMapType),R.push(b.toneMapping),R.push(b.numClippingPlanes),R.push(b.numClipIntersection),R.push(b.depthPacking)}function P(R,b){c.disableAll(),b.isWebGL2&&c.enable(0),b.supportsVertexTextures&&c.enable(1),b.instancing&&c.enable(2),b.instancingColor&&c.enable(3),b.matcap&&c.enable(4),b.envMap&&c.enable(5),b.normalMapObjectSpace&&c.enable(6),b.normalMapTangentSpace&&c.enable(7),b.clearcoat&&c.enable(8),b.iridescence&&c.enable(9),b.alphaTest&&c.enable(10),b.vertexColors&&c.enable(11),b.vertexAlphas&&c.enable(12),b.vertexUv1s&&c.enable(13),b.vertexUv2s&&c.enable(14),b.vertexUv3s&&c.enable(15),b.vertexTangents&&c.enable(16),b.anisotropy&&c.enable(17),b.alphaHash&&c.enable(18),b.batching&&c.enable(19),R.push(c.mask),c.disableAll(),b.fog&&c.enable(0),b.useFog&&c.enable(1),b.flatShading&&c.enable(2),b.logarithmicDepthBuffer&&c.enable(3),b.skinning&&c.enable(4),b.morphTargets&&c.enable(5),b.morphNormals&&c.enable(6),b.morphColors&&c.enable(7),b.premultipliedAlpha&&c.enable(8),b.shadowMapEnabled&&c.enable(9),b.useLegacyLights&&c.enable(10),b.doubleSided&&c.enable(11),b.flipSided&&c.enable(12),b.useDepthPacking&&c.enable(13),b.dithering&&c.enable(14),b.transmission&&c.enable(15),b.sheen&&c.enable(16),b.opaque&&c.enable(17),b.pointsUvs&&c.enable(18),b.decodeVideoTexture&&c.enable(19),R.push(c.mask)}function U(R){const b=w[R.type];let oe;if(b){const le=pi[b];oe=yl.clone(le.uniforms)}else oe=R.uniforms;return oe}function Y(R,b){let oe;for(let le=0,_e=m.length;le<_e;le++){const k=m[le];if(k.cacheKey===b){oe=k,++oe.usedTimes;break}}return oe===void 0&&(oe=new MM(o,b,R,u),m.push(oe)),oe}function O(R){if(--R.usedTimes===0){const b=m.indexOf(R);m[b]=m[m.length-1],m.pop(),R.destroy()}}function I(R){h.remove(R)}function ce(){h.dispose()}return{getParameters:x,getProgramCacheKey:_,getUniforms:U,acquireProgram:Y,releaseProgram:O,releaseShaderCache:I,programs:m,dispose:ce}}function RM(){let o=new WeakMap;function e(u){let d=o.get(u);return d===void 0&&(d={},o.set(u,d)),d}function n(u){o.delete(u)}function s(u,d,c){o.get(u)[d]=c}function a(){o=new WeakMap}return{get:e,remove:n,update:s,dispose:a}}function CM(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function tm(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function nm(){const o=[];let e=0;const n=[],s=[],a=[];function u(){e=0,n.length=0,s.length=0,a.length=0}function d(v,S,M,w,T,x){let _=o[e];return _===void 0?(_={id:v.id,object:v,geometry:S,material:M,groupOrder:w,renderOrder:v.renderOrder,z:T,group:x},o[e]=_):(_.id=v.id,_.object=v,_.geometry=S,_.material=M,_.groupOrder=w,_.renderOrder=v.renderOrder,_.z=T,_.group=x),e++,_}function c(v,S,M,w,T,x){const _=d(v,S,M,w,T,x);M.transmission>0?s.push(_):M.transparent===!0?a.push(_):n.push(_)}function h(v,S,M,w,T,x){const _=d(v,S,M,w,T,x);M.transmission>0?s.unshift(_):M.transparent===!0?a.unshift(_):n.unshift(_)}function m(v,S){n.length>1&&n.sort(v||CM),s.length>1&&s.sort(S||tm),a.length>1&&a.sort(S||tm)}function g(){for(let v=e,S=o.length;v<S;v++){const M=o[v];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:n,transmissive:s,transparent:a,init:u,push:c,unshift:h,finish:g,sort:m}}function PM(){let o=new WeakMap;function e(s,a){const u=o.get(s);let d;return u===void 0?(d=new nm,o.set(s,[d])):a>=u.length?(d=new nm,u.push(d)):d=u[a],d}function n(){o=new WeakMap}return{get:e,dispose:n}}function LM(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new te,color:new _t};break;case"SpotLight":n={position:new te,direction:new te,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new te,color:new _t,distance:0,decay:0};break;case"HemisphereLight":n={direction:new te,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":n={color:new _t,position:new te,halfWidth:new te,halfHeight:new te};break}return o[e.id]=n,n}}}function bM(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=n,n}}}let DM=0;function UM(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function NM(o,e){const n=new LM,s=bM(),a={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)a.probe.push(new te);const u=new te,d=new sn,c=new sn;function h(g,v){let S=0,M=0,w=0;for(let le=0;le<9;le++)a.probe[le].set(0,0,0);let T=0,x=0,_=0,N=0,P=0,U=0,Y=0,O=0,I=0,ce=0,R=0;g.sort(UM);const b=v===!0?Math.PI:1;for(let le=0,_e=g.length;le<_e;le++){const k=g[le],Q=k.color,re=k.intensity,ae=k.distance,G=k.shadow&&k.shadow.map?k.shadow.map.texture:null;if(k.isAmbientLight)S+=Q.r*re*b,M+=Q.g*re*b,w+=Q.b*re*b;else if(k.isLightProbe){for(let K=0;K<9;K++)a.probe[K].addScaledVector(k.sh.coefficients[K],re);R++}else if(k.isDirectionalLight){const K=n.get(k);if(K.color.copy(k.color).multiplyScalar(k.intensity*b),k.castShadow){const V=k.shadow,L=s.get(k);L.shadowBias=V.bias,L.shadowNormalBias=V.normalBias,L.shadowRadius=V.radius,L.shadowMapSize=V.mapSize,a.directionalShadow[T]=L,a.directionalShadowMap[T]=G,a.directionalShadowMatrix[T]=k.shadow.matrix,U++}a.directional[T]=K,T++}else if(k.isSpotLight){const K=n.get(k);K.position.setFromMatrixPosition(k.matrixWorld),K.color.copy(Q).multiplyScalar(re*b),K.distance=ae,K.coneCos=Math.cos(k.angle),K.penumbraCos=Math.cos(k.angle*(1-k.penumbra)),K.decay=k.decay,a.spot[_]=K;const V=k.shadow;if(k.map&&(a.spotLightMap[I]=k.map,I++,V.updateMatrices(k),k.castShadow&&ce++),a.spotLightMatrix[_]=V.matrix,k.castShadow){const L=s.get(k);L.shadowBias=V.bias,L.shadowNormalBias=V.normalBias,L.shadowRadius=V.radius,L.shadowMapSize=V.mapSize,a.spotShadow[_]=L,a.spotShadowMap[_]=G,O++}_++}else if(k.isRectAreaLight){const K=n.get(k);K.color.copy(Q).multiplyScalar(re),K.halfWidth.set(k.width*.5,0,0),K.halfHeight.set(0,k.height*.5,0),a.rectArea[N]=K,N++}else if(k.isPointLight){const K=n.get(k);if(K.color.copy(k.color).multiplyScalar(k.intensity*b),K.distance=k.distance,K.decay=k.decay,k.castShadow){const V=k.shadow,L=s.get(k);L.shadowBias=V.bias,L.shadowNormalBias=V.normalBias,L.shadowRadius=V.radius,L.shadowMapSize=V.mapSize,L.shadowCameraNear=V.camera.near,L.shadowCameraFar=V.camera.far,a.pointShadow[x]=L,a.pointShadowMap[x]=G,a.pointShadowMatrix[x]=k.shadow.matrix,Y++}a.point[x]=K,x++}else if(k.isHemisphereLight){const K=n.get(k);K.skyColor.copy(k.color).multiplyScalar(re*b),K.groundColor.copy(k.groundColor).multiplyScalar(re*b),a.hemi[P]=K,P++}}N>0&&(e.isWebGL2?o.has("OES_texture_float_linear")===!0?(a.rectAreaLTC1=Ae.LTC_FLOAT_1,a.rectAreaLTC2=Ae.LTC_FLOAT_2):(a.rectAreaLTC1=Ae.LTC_HALF_1,a.rectAreaLTC2=Ae.LTC_HALF_2):o.has("OES_texture_float_linear")===!0?(a.rectAreaLTC1=Ae.LTC_FLOAT_1,a.rectAreaLTC2=Ae.LTC_FLOAT_2):o.has("OES_texture_half_float_linear")===!0?(a.rectAreaLTC1=Ae.LTC_HALF_1,a.rectAreaLTC2=Ae.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),a.ambient[0]=S,a.ambient[1]=M,a.ambient[2]=w;const oe=a.hash;(oe.directionalLength!==T||oe.pointLength!==x||oe.spotLength!==_||oe.rectAreaLength!==N||oe.hemiLength!==P||oe.numDirectionalShadows!==U||oe.numPointShadows!==Y||oe.numSpotShadows!==O||oe.numSpotMaps!==I||oe.numLightProbes!==R)&&(a.directional.length=T,a.spot.length=_,a.rectArea.length=N,a.point.length=x,a.hemi.length=P,a.directionalShadow.length=U,a.directionalShadowMap.length=U,a.pointShadow.length=Y,a.pointShadowMap.length=Y,a.spotShadow.length=O,a.spotShadowMap.length=O,a.directionalShadowMatrix.length=U,a.pointShadowMatrix.length=Y,a.spotLightMatrix.length=O+I-ce,a.spotLightMap.length=I,a.numSpotLightShadowsWithMaps=ce,a.numLightProbes=R,oe.directionalLength=T,oe.pointLength=x,oe.spotLength=_,oe.rectAreaLength=N,oe.hemiLength=P,oe.numDirectionalShadows=U,oe.numPointShadows=Y,oe.numSpotShadows=O,oe.numSpotMaps=I,oe.numLightProbes=R,a.version=DM++)}function m(g,v){let S=0,M=0,w=0,T=0,x=0;const _=v.matrixWorldInverse;for(let N=0,P=g.length;N<P;N++){const U=g[N];if(U.isDirectionalLight){const Y=a.directional[S];Y.direction.setFromMatrixPosition(U.matrixWorld),u.setFromMatrixPosition(U.target.matrixWorld),Y.direction.sub(u),Y.direction.transformDirection(_),S++}else if(U.isSpotLight){const Y=a.spot[w];Y.position.setFromMatrixPosition(U.matrixWorld),Y.position.applyMatrix4(_),Y.direction.setFromMatrixPosition(U.matrixWorld),u.setFromMatrixPosition(U.target.matrixWorld),Y.direction.sub(u),Y.direction.transformDirection(_),w++}else if(U.isRectAreaLight){const Y=a.rectArea[T];Y.position.setFromMatrixPosition(U.matrixWorld),Y.position.applyMatrix4(_),c.identity(),d.copy(U.matrixWorld),d.premultiply(_),c.extractRotation(d),Y.halfWidth.set(U.width*.5,0,0),Y.halfHeight.set(0,U.height*.5,0),Y.halfWidth.applyMatrix4(c),Y.halfHeight.applyMatrix4(c),T++}else if(U.isPointLight){const Y=a.point[M];Y.position.setFromMatrixPosition(U.matrixWorld),Y.position.applyMatrix4(_),M++}else if(U.isHemisphereLight){const Y=a.hemi[x];Y.direction.setFromMatrixPosition(U.matrixWorld),Y.direction.transformDirection(_),x++}}}return{setup:h,setupView:m,state:a}}function im(o,e){const n=new NM(o,e),s=[],a=[];function u(){s.length=0,a.length=0}function d(v){s.push(v)}function c(v){a.push(v)}function h(v){n.setup(s,v)}function m(v){n.setupView(s,v)}return{init:u,state:{lightsArray:s,shadowsArray:a,lights:n},setupLights:h,setupLightsView:m,pushLight:d,pushShadow:c}}function IM(o,e){let n=new WeakMap;function s(u,d=0){const c=n.get(u);let h;return c===void 0?(h=new im(o,e),n.set(u,[h])):d>=c.length?(h=new im(o,e),c.push(h)):h=c[d],h}function a(){n=new WeakMap}return{get:s,dispose:a}}class FM extends wl{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class OM extends wl{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const BM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,zM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function kM(o,e,n){let s=new Pm;const a=new at,u=new at,d=new rn,c=new FM({depthPacking:Sv}),h=new OM,m={},g=n.maxTextureSize,v={[_r]:Ln,[Ln]:_r,[Ni]:Ni},S=new Pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:BM,fragmentShader:zM}),M=S.clone();M.defines.HORIZONTAL_PASS=1;const w=new vr;w.setAttribute("position",new gi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new mi(w,S),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=om;let _=this.type;this.render=function(O,I,ce){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||O.length===0)return;const R=o.getRenderTarget(),b=o.getActiveCubeFace(),oe=o.getActiveMipmapLevel(),le=o.state;le.setBlending(Fi),le.buffers.color.setClear(1,1,1,1),le.buffers.depth.setTest(!0),le.setScissorTest(!1);const _e=_!==Ui&&this.type===Ui,k=_===Ui&&this.type!==Ui;for(let Q=0,re=O.length;Q<re;Q++){const ae=O[Q],G=ae.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ae,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const K=G.getFrameExtents();if(a.multiply(K),u.copy(G.mapSize),(a.x>g||a.y>g)&&(a.x>g&&(u.x=Math.floor(g/K.x),a.x=u.x*K.x,G.mapSize.x=u.x),a.y>g&&(u.y=Math.floor(g/K.y),a.y=u.y*K.y,G.mapSize.y=u.y)),G.map===null||_e===!0||k===!0){const L=this.type!==Ui?{minFilter:xn,magFilter:xn}:{};G.map!==null&&G.map.dispose(),G.map=new li(a.x,a.y,L),G.map.texture.name=ae.name+".shadowMap",G.camera.updateProjectionMatrix()}o.setRenderTarget(G.map),o.clear();const V=G.getViewportCount();for(let L=0;L<V;L++){const H=G.getViewport(L);d.set(u.x*H.x,u.y*H.y,u.x*H.z,u.y*H.w),le.viewport(d),G.updateMatrices(ae,L),s=G.getFrustum(),U(I,ce,G.camera,ae,this.type)}G.isPointLightShadow!==!0&&this.type===Ui&&N(G,ce),G.needsUpdate=!1}_=this.type,x.needsUpdate=!1,o.setRenderTarget(R,b,oe)};function N(O,I){const ce=e.update(T);S.defines.VSM_SAMPLES!==O.blurSamples&&(S.defines.VSM_SAMPLES=O.blurSamples,M.defines.VSM_SAMPLES=O.blurSamples,S.needsUpdate=!0,M.needsUpdate=!0),O.mapPass===null&&(O.mapPass=new li(a.x,a.y)),S.uniforms.shadow_pass.value=O.map.texture,S.uniforms.resolution.value=O.mapSize,S.uniforms.radius.value=O.radius,o.setRenderTarget(O.mapPass),o.clear(),o.renderBufferDirect(I,null,ce,S,T,null),M.uniforms.shadow_pass.value=O.mapPass.texture,M.uniforms.resolution.value=O.mapSize,M.uniforms.radius.value=O.radius,o.setRenderTarget(O.map),o.clear(),o.renderBufferDirect(I,null,ce,M,T,null)}function P(O,I,ce,R){let b=null;const oe=ce.isPointLight===!0?O.customDistanceMaterial:O.customDepthMaterial;if(oe!==void 0)b=oe;else if(b=ce.isPointLight===!0?h:c,o.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){const le=b.uuid,_e=I.uuid;let k=m[le];k===void 0&&(k={},m[le]=k);let Q=k[_e];Q===void 0&&(Q=b.clone(),k[_e]=Q,I.addEventListener("dispose",Y)),b=Q}if(b.visible=I.visible,b.wireframe=I.wireframe,R===Ui?b.side=I.shadowSide!==null?I.shadowSide:I.side:b.side=I.shadowSide!==null?I.shadowSide:v[I.side],b.alphaMap=I.alphaMap,b.alphaTest=I.alphaTest,b.map=I.map,b.clipShadows=I.clipShadows,b.clippingPlanes=I.clippingPlanes,b.clipIntersection=I.clipIntersection,b.displacementMap=I.displacementMap,b.displacementScale=I.displacementScale,b.displacementBias=I.displacementBias,b.wireframeLinewidth=I.wireframeLinewidth,b.linewidth=I.linewidth,ce.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const le=o.properties.get(b);le.light=ce}return b}function U(O,I,ce,R,b){if(O.visible===!1)return;if(O.layers.test(I.layers)&&(O.isMesh||O.isLine||O.isPoints)&&(O.castShadow||O.receiveShadow&&b===Ui)&&(!O.frustumCulled||s.intersectsObject(O))){O.modelViewMatrix.multiplyMatrices(ce.matrixWorldInverse,O.matrixWorld);const _e=e.update(O),k=O.material;if(Array.isArray(k)){const Q=_e.groups;for(let re=0,ae=Q.length;re<ae;re++){const G=Q[re],K=k[G.materialIndex];if(K&&K.visible){const V=P(O,K,R,b);O.onBeforeShadow(o,O,I,ce,_e,V,G),o.renderBufferDirect(ce,null,_e,V,O,G),O.onAfterShadow(o,O,I,ce,_e,V,G)}}}else if(k.visible){const Q=P(O,k,R,b);O.onBeforeShadow(o,O,I,ce,_e,Q,null),o.renderBufferDirect(ce,null,_e,Q,O,null),O.onAfterShadow(o,O,I,ce,_e,Q,null)}}const le=O.children;for(let _e=0,k=le.length;_e<k;_e++)U(le[_e],I,ce,R,b)}function Y(O){O.target.removeEventListener("dispose",Y);for(const ce in m){const R=m[ce],b=O.target.uuid;b in R&&(R[b].dispose(),delete R[b])}}}function HM(o,e,n){const s=n.isWebGL2;function a(){let B=!1;const we=new rn;let Ce=null;const et=new rn(0,0,0,0);return{setMask:function(qe){Ce!==qe&&!B&&(o.colorMask(qe,qe,qe,qe),Ce=qe)},setLocked:function(qe){B=qe},setClear:function(qe,Mt,Et,Ot,Kt){Kt===!0&&(qe*=Ot,Mt*=Ot,Et*=Ot),we.set(qe,Mt,Et,Ot),et.equals(we)===!1&&(o.clearColor(qe,Mt,Et,Ot),et.copy(we))},reset:function(){B=!1,Ce=null,et.set(-1,0,0,0)}}}function u(){let B=!1,we=null,Ce=null,et=null;return{setTest:function(qe){qe?Ee(o.DEPTH_TEST):Ne(o.DEPTH_TEST)},setMask:function(qe){we!==qe&&!B&&(o.depthMask(qe),we=qe)},setFunc:function(qe){if(Ce!==qe){switch(qe){case K_:o.depthFunc(o.NEVER);break;case $_:o.depthFunc(o.ALWAYS);break;case Q_:o.depthFunc(o.LESS);break;case pl:o.depthFunc(o.LEQUAL);break;case Z_:o.depthFunc(o.EQUAL);break;case J_:o.depthFunc(o.GEQUAL);break;case ev:o.depthFunc(o.GREATER);break;case tv:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}Ce=qe}},setLocked:function(qe){B=qe},setClear:function(qe){et!==qe&&(o.clearDepth(qe),et=qe)},reset:function(){B=!1,we=null,Ce=null,et=null}}}function d(){let B=!1,we=null,Ce=null,et=null,qe=null,Mt=null,Et=null,Ot=null,Kt=null;return{setTest:function(St){B||(St?Ee(o.STENCIL_TEST):Ne(o.STENCIL_TEST))},setMask:function(St){we!==St&&!B&&(o.stencilMask(St),we=St)},setFunc:function(St,Wt,on){(Ce!==St||et!==Wt||qe!==on)&&(o.stencilFunc(St,Wt,on),Ce=St,et=Wt,qe=on)},setOp:function(St,Wt,on){(Mt!==St||Et!==Wt||Ot!==on)&&(o.stencilOp(St,Wt,on),Mt=St,Et=Wt,Ot=on)},setLocked:function(St){B=St},setClear:function(St){Kt!==St&&(o.clearStencil(St),Kt=St)},reset:function(){B=!1,we=null,Ce=null,et=null,qe=null,Mt=null,Et=null,Ot=null,Kt=null}}}const c=new a,h=new u,m=new d,g=new WeakMap,v=new WeakMap;let S={},M={},w=new WeakMap,T=[],x=null,_=!1,N=null,P=null,U=null,Y=null,O=null,I=null,ce=null,R=new _t(0,0,0),b=0,oe=!1,le=null,_e=null,k=null,Q=null,re=null;const ae=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,K=0;const V=o.getParameter(o.VERSION);V.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(V)[1]),G=K>=1):V.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),G=K>=2);let L=null,H={};const W=o.getParameter(o.SCISSOR_BOX),se=o.getParameter(o.VIEWPORT),fe=new rn().fromArray(W),Me=new rn().fromArray(se);function de(B,we,Ce,et){const qe=new Uint8Array(4),Mt=o.createTexture();o.bindTexture(B,Mt),o.texParameteri(B,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(B,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let Et=0;Et<Ce;Et++)s&&(B===o.TEXTURE_3D||B===o.TEXTURE_2D_ARRAY)?o.texImage3D(we,0,o.RGBA,1,1,et,0,o.RGBA,o.UNSIGNED_BYTE,qe):o.texImage2D(we+Et,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,qe);return Mt}const Se={};Se[o.TEXTURE_2D]=de(o.TEXTURE_2D,o.TEXTURE_2D,1),Se[o.TEXTURE_CUBE_MAP]=de(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),s&&(Se[o.TEXTURE_2D_ARRAY]=de(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),Se[o.TEXTURE_3D]=de(o.TEXTURE_3D,o.TEXTURE_3D,1,1)),c.setClear(0,0,0,1),h.setClear(1),m.setClear(0),Ee(o.DEPTH_TEST),h.setFunc(pl),rt(!1),C(Bh),Ee(o.CULL_FACE),ze(Fi);function Ee(B){S[B]!==!0&&(o.enable(B),S[B]=!0)}function Ne(B){S[B]!==!1&&(o.disable(B),S[B]=!1)}function ct(B,we){return M[B]!==we?(o.bindFramebuffer(B,we),M[B]=we,s&&(B===o.DRAW_FRAMEBUFFER&&(M[o.FRAMEBUFFER]=we),B===o.FRAMEBUFFER&&(M[o.DRAW_FRAMEBUFFER]=we)),!0):!1}function Z(B,we){let Ce=T,et=!1;if(B)if(Ce=w.get(we),Ce===void 0&&(Ce=[],w.set(we,Ce)),B.isWebGLMultipleRenderTargets){const qe=B.texture;if(Ce.length!==qe.length||Ce[0]!==o.COLOR_ATTACHMENT0){for(let Mt=0,Et=qe.length;Mt<Et;Mt++)Ce[Mt]=o.COLOR_ATTACHMENT0+Mt;Ce.length=qe.length,et=!0}}else Ce[0]!==o.COLOR_ATTACHMENT0&&(Ce[0]=o.COLOR_ATTACHMENT0,et=!0);else Ce[0]!==o.BACK&&(Ce[0]=o.BACK,et=!0);et&&(n.isWebGL2?o.drawBuffers(Ce):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(Ce))}function Nt(B){return x!==B?(o.useProgram(B),x=B,!0):!1}const Ve={[kr]:o.FUNC_ADD,[N_]:o.FUNC_SUBTRACT,[I_]:o.FUNC_REVERSE_SUBTRACT};if(s)Ve[Hh]=o.MIN,Ve[Gh]=o.MAX;else{const B=e.get("EXT_blend_minmax");B!==null&&(Ve[Hh]=B.MIN_EXT,Ve[Gh]=B.MAX_EXT)}const $e={[F_]:o.ZERO,[O_]:o.ONE,[B_]:o.SRC_COLOR,[Hc]:o.SRC_ALPHA,[W_]:o.SRC_ALPHA_SATURATE,[G_]:o.DST_COLOR,[k_]:o.DST_ALPHA,[z_]:o.ONE_MINUS_SRC_COLOR,[Gc]:o.ONE_MINUS_SRC_ALPHA,[V_]:o.ONE_MINUS_DST_COLOR,[H_]:o.ONE_MINUS_DST_ALPHA,[X_]:o.CONSTANT_COLOR,[Y_]:o.ONE_MINUS_CONSTANT_COLOR,[q_]:o.CONSTANT_ALPHA,[j_]:o.ONE_MINUS_CONSTANT_ALPHA};function ze(B,we,Ce,et,qe,Mt,Et,Ot,Kt,St){if(B===Fi){_===!0&&(Ne(o.BLEND),_=!1);return}if(_===!1&&(Ee(o.BLEND),_=!0),B!==U_){if(B!==N||St!==oe){if((P!==kr||O!==kr)&&(o.blendEquation(o.FUNC_ADD),P=kr,O=kr),St)switch(B){case Us:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case kc:o.blendFunc(o.ONE,o.ONE);break;case zh:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case kh:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Us:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case kc:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case zh:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case kh:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}U=null,Y=null,I=null,ce=null,R.set(0,0,0),b=0,N=B,oe=St}return}qe=qe||we,Mt=Mt||Ce,Et=Et||et,(we!==P||qe!==O)&&(o.blendEquationSeparate(Ve[we],Ve[qe]),P=we,O=qe),(Ce!==U||et!==Y||Mt!==I||Et!==ce)&&(o.blendFuncSeparate($e[Ce],$e[et],$e[Mt],$e[Et]),U=Ce,Y=et,I=Mt,ce=Et),(Ot.equals(R)===!1||Kt!==b)&&(o.blendColor(Ot.r,Ot.g,Ot.b,Kt),R.copy(Ot),b=Kt),N=B,oe=!1}function ht(B,we){B.side===Ni?Ne(o.CULL_FACE):Ee(o.CULL_FACE);let Ce=B.side===Ln;we&&(Ce=!Ce),rt(Ce),B.blending===Us&&B.transparent===!1?ze(Fi):ze(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),h.setFunc(B.depthFunc),h.setTest(B.depthTest),h.setMask(B.depthWrite),c.setMask(B.colorWrite);const et=B.stencilWrite;m.setTest(et),et&&(m.setMask(B.stencilWriteMask),m.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),m.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),$(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?Ee(o.SAMPLE_ALPHA_TO_COVERAGE):Ne(o.SAMPLE_ALPHA_TO_COVERAGE)}function rt(B){le!==B&&(B?o.frontFace(o.CW):o.frontFace(o.CCW),le=B)}function C(B){B!==L_?(Ee(o.CULL_FACE),B!==_e&&(B===Bh?o.cullFace(o.BACK):B===b_?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):Ne(o.CULL_FACE),_e=B}function E(B){B!==k&&(G&&o.lineWidth(B),k=B)}function $(B,we,Ce){B?(Ee(o.POLYGON_OFFSET_FILL),(Q!==we||re!==Ce)&&(o.polygonOffset(we,Ce),Q=we,re=Ce)):Ne(o.POLYGON_OFFSET_FILL)}function ge(B){B?Ee(o.SCISSOR_TEST):Ne(o.SCISSOR_TEST)}function me(B){B===void 0&&(B=o.TEXTURE0+ae-1),L!==B&&(o.activeTexture(B),L=B)}function xe(B,we,Ce){Ce===void 0&&(L===null?Ce=o.TEXTURE0+ae-1:Ce=L);let et=H[Ce];et===void 0&&(et={type:void 0,texture:void 0},H[Ce]=et),(et.type!==B||et.texture!==we)&&(L!==Ce&&(o.activeTexture(Ce),L=Ce),o.bindTexture(B,we||Se[B]),et.type=B,et.texture=we)}function Oe(){const B=H[L];B!==void 0&&B.type!==void 0&&(o.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Re(){try{o.compressedTexImage2D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function De(){try{o.compressedTexImage3D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function He(){try{o.texSubImage2D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function We(){try{o.texSubImage3D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ue(){try{o.compressedTexSubImage2D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Qe(){try{o.compressedTexSubImage3D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function tt(){try{o.texStorage2D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ye(){try{o.texStorage3D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ge(){try{o.texImage2D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Pe(){try{o.texImage3D.apply(o,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ze(B){fe.equals(B)===!1&&(o.scissor(B.x,B.y,B.z,B.w),fe.copy(B))}function st(B){Me.equals(B)===!1&&(o.viewport(B.x,B.y,B.z,B.w),Me.copy(B))}function vt(B,we){let Ce=v.get(we);Ce===void 0&&(Ce=new WeakMap,v.set(we,Ce));let et=Ce.get(B);et===void 0&&(et=o.getUniformBlockIndex(we,B.name),Ce.set(B,et))}function lt(B,we){const et=v.get(we).get(B);g.get(we)!==et&&(o.uniformBlockBinding(we,et,B.__bindingPointIndex),g.set(we,et))}function Te(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),s===!0&&(o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null)),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),S={},L=null,H={},M={},w=new WeakMap,T=[],x=null,_=!1,N=null,P=null,U=null,Y=null,O=null,I=null,ce=null,R=new _t(0,0,0),b=0,oe=!1,le=null,_e=null,k=null,Q=null,re=null,fe.set(0,0,o.canvas.width,o.canvas.height),Me.set(0,0,o.canvas.width,o.canvas.height),c.reset(),h.reset(),m.reset()}return{buffers:{color:c,depth:h,stencil:m},enable:Ee,disable:Ne,bindFramebuffer:ct,drawBuffers:Z,useProgram:Nt,setBlending:ze,setMaterial:ht,setFlipSided:rt,setCullFace:C,setLineWidth:E,setPolygonOffset:$,setScissorTest:ge,activeTexture:me,bindTexture:xe,unbindTexture:Oe,compressedTexImage2D:Re,compressedTexImage3D:De,texImage2D:Ge,texImage3D:Pe,updateUBOMapping:vt,uniformBlockBinding:lt,texStorage2D:tt,texStorage3D:Ye,texSubImage2D:He,texSubImage3D:We,compressedTexSubImage2D:ue,compressedTexSubImage3D:Qe,scissor:Ze,viewport:st,reset:Te}}function GM(o,e,n,s,a,u,d){const c=a.isWebGL2,h=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new WeakMap;let v;const S=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function w(C,E){return M?new OffscreenCanvas(C,E):Sl("canvas")}function T(C,E,$,ge){let me=1;if((C.width>ge||C.height>ge)&&(me=ge/Math.max(C.width,C.height)),me<1||E===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap){const xe=E?xl:Math.floor,Oe=xe(me*C.width),Re=xe(me*C.height);v===void 0&&(v=w(Oe,Re));const De=$?w(Oe,Re):v;return De.width=Oe,De.height=Re,De.getContext("2d").drawImage(C,0,0,Oe,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+C.width+"x"+C.height+") to ("+Oe+"x"+Re+")."),De}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+C.width+"x"+C.height+")."),C;return C}function x(C){return jc(C.width)&&jc(C.height)}function _(C){return c?!1:C.wrapS!==oi||C.wrapT!==oi||C.minFilter!==xn&&C.minFilter!==qn}function N(C,E){return C.generateMipmaps&&E&&C.minFilter!==xn&&C.minFilter!==qn}function P(C){o.generateMipmap(C)}function U(C,E,$,ge,me=!1){if(c===!1)return E;if(C!==null){if(o[C]!==void 0)return o[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let xe=E;if(E===o.RED&&($===o.FLOAT&&(xe=o.R32F),$===o.HALF_FLOAT&&(xe=o.R16F),$===o.UNSIGNED_BYTE&&(xe=o.R8)),E===o.RED_INTEGER&&($===o.UNSIGNED_BYTE&&(xe=o.R8UI),$===o.UNSIGNED_SHORT&&(xe=o.R16UI),$===o.UNSIGNED_INT&&(xe=o.R32UI),$===o.BYTE&&(xe=o.R8I),$===o.SHORT&&(xe=o.R16I),$===o.INT&&(xe=o.R32I)),E===o.RG&&($===o.FLOAT&&(xe=o.RG32F),$===o.HALF_FLOAT&&(xe=o.RG16F),$===o.UNSIGNED_BYTE&&(xe=o.RG8)),E===o.RGBA){const Oe=me?ml:wt.getTransfer(ge);$===o.FLOAT&&(xe=o.RGBA32F),$===o.HALF_FLOAT&&(xe=o.RGBA16F),$===o.UNSIGNED_BYTE&&(xe=Oe===bt?o.SRGB8_ALPHA8:o.RGBA8),$===o.UNSIGNED_SHORT_4_4_4_4&&(xe=o.RGBA4),$===o.UNSIGNED_SHORT_5_5_5_1&&(xe=o.RGB5_A1)}return(xe===o.R16F||xe===o.R32F||xe===o.RG16F||xe===o.RG32F||xe===o.RGBA16F||xe===o.RGBA32F)&&e.get("EXT_color_buffer_float"),xe}function Y(C,E,$){return N(C,$)===!0||C.isFramebufferTexture&&C.minFilter!==xn&&C.minFilter!==qn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function O(C){return C===xn||C===Vh||C===fc?o.NEAREST:o.LINEAR}function I(C){const E=C.target;E.removeEventListener("dispose",I),R(E),E.isVideoTexture&&g.delete(E)}function ce(C){const E=C.target;E.removeEventListener("dispose",ce),oe(E)}function R(C){const E=s.get(C);if(E.__webglInit===void 0)return;const $=C.source,ge=S.get($);if(ge){const me=ge[E.__cacheKey];me.usedTimes--,me.usedTimes===0&&b(C),Object.keys(ge).length===0&&S.delete($)}s.remove(C)}function b(C){const E=s.get(C);o.deleteTexture(E.__webglTexture);const $=C.source,ge=S.get($);delete ge[E.__cacheKey],d.memory.textures--}function oe(C){const E=C.texture,$=s.get(C),ge=s.get(E);if(ge.__webglTexture!==void 0&&(o.deleteTexture(ge.__webglTexture),d.memory.textures--),C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let me=0;me<6;me++){if(Array.isArray($.__webglFramebuffer[me]))for(let xe=0;xe<$.__webglFramebuffer[me].length;xe++)o.deleteFramebuffer($.__webglFramebuffer[me][xe]);else o.deleteFramebuffer($.__webglFramebuffer[me]);$.__webglDepthbuffer&&o.deleteRenderbuffer($.__webglDepthbuffer[me])}else{if(Array.isArray($.__webglFramebuffer))for(let me=0;me<$.__webglFramebuffer.length;me++)o.deleteFramebuffer($.__webglFramebuffer[me]);else o.deleteFramebuffer($.__webglFramebuffer);if($.__webglDepthbuffer&&o.deleteRenderbuffer($.__webglDepthbuffer),$.__webglMultisampledFramebuffer&&o.deleteFramebuffer($.__webglMultisampledFramebuffer),$.__webglColorRenderbuffer)for(let me=0;me<$.__webglColorRenderbuffer.length;me++)$.__webglColorRenderbuffer[me]&&o.deleteRenderbuffer($.__webglColorRenderbuffer[me]);$.__webglDepthRenderbuffer&&o.deleteRenderbuffer($.__webglDepthRenderbuffer)}if(C.isWebGLMultipleRenderTargets)for(let me=0,xe=E.length;me<xe;me++){const Oe=s.get(E[me]);Oe.__webglTexture&&(o.deleteTexture(Oe.__webglTexture),d.memory.textures--),s.remove(E[me])}s.remove(E),s.remove(C)}let le=0;function _e(){le=0}function k(){const C=le;return C>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+a.maxTextures),le+=1,C}function Q(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function re(C,E){const $=s.get(C);if(C.isVideoTexture&&ht(C),C.isRenderTargetTexture===!1&&C.version>0&&$.__version!==C.version){const ge=C.image;if(ge===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ge.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{fe($,C,E);return}}n.bindTexture(o.TEXTURE_2D,$.__webglTexture,o.TEXTURE0+E)}function ae(C,E){const $=s.get(C);if(C.version>0&&$.__version!==C.version){fe($,C,E);return}n.bindTexture(o.TEXTURE_2D_ARRAY,$.__webglTexture,o.TEXTURE0+E)}function G(C,E){const $=s.get(C);if(C.version>0&&$.__version!==C.version){fe($,C,E);return}n.bindTexture(o.TEXTURE_3D,$.__webglTexture,o.TEXTURE0+E)}function K(C,E){const $=s.get(C);if(C.version>0&&$.__version!==C.version){Me($,C,E);return}n.bindTexture(o.TEXTURE_CUBE_MAP,$.__webglTexture,o.TEXTURE0+E)}const V={[Xc]:o.REPEAT,[oi]:o.CLAMP_TO_EDGE,[Yc]:o.MIRRORED_REPEAT},L={[xn]:o.NEAREST,[Vh]:o.NEAREST_MIPMAP_NEAREST,[fc]:o.NEAREST_MIPMAP_LINEAR,[qn]:o.LINEAR,[cv]:o.LINEAR_MIPMAP_NEAREST,[bo]:o.LINEAR_MIPMAP_LINEAR},H={[Ev]:o.NEVER,[Pv]:o.ALWAYS,[Tv]:o.LESS,[_m]:o.LEQUAL,[wv]:o.EQUAL,[Cv]:o.GEQUAL,[Av]:o.GREATER,[Rv]:o.NOTEQUAL};function W(C,E,$){if($?(o.texParameteri(C,o.TEXTURE_WRAP_S,V[E.wrapS]),o.texParameteri(C,o.TEXTURE_WRAP_T,V[E.wrapT]),(C===o.TEXTURE_3D||C===o.TEXTURE_2D_ARRAY)&&o.texParameteri(C,o.TEXTURE_WRAP_R,V[E.wrapR]),o.texParameteri(C,o.TEXTURE_MAG_FILTER,L[E.magFilter]),o.texParameteri(C,o.TEXTURE_MIN_FILTER,L[E.minFilter])):(o.texParameteri(C,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(C,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),(C===o.TEXTURE_3D||C===o.TEXTURE_2D_ARRAY)&&o.texParameteri(C,o.TEXTURE_WRAP_R,o.CLAMP_TO_EDGE),(E.wrapS!==oi||E.wrapT!==oi)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),o.texParameteri(C,o.TEXTURE_MAG_FILTER,O(E.magFilter)),o.texParameteri(C,o.TEXTURE_MIN_FILTER,O(E.minFilter)),E.minFilter!==xn&&E.minFilter!==qn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(o.texParameteri(C,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(C,o.TEXTURE_COMPARE_FUNC,H[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const ge=e.get("EXT_texture_filter_anisotropic");if(E.magFilter===xn||E.minFilter!==fc&&E.minFilter!==bo||E.type===pr&&e.has("OES_texture_float_linear")===!1||c===!1&&E.type===Oi&&e.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||s.get(E).__currentAnisotropy)&&(o.texParameterf(C,ge.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,a.getMaxAnisotropy())),s.get(E).__currentAnisotropy=E.anisotropy)}}function se(C,E){let $=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",I));const ge=E.source;let me=S.get(ge);me===void 0&&(me={},S.set(ge,me));const xe=Q(E);if(xe!==C.__cacheKey){me[xe]===void 0&&(me[xe]={texture:o.createTexture(),usedTimes:0},d.memory.textures++,$=!0),me[xe].usedTimes++;const Oe=me[C.__cacheKey];Oe!==void 0&&(me[C.__cacheKey].usedTimes--,Oe.usedTimes===0&&b(E)),C.__cacheKey=xe,C.__webglTexture=me[xe].texture}return $}function fe(C,E,$){let ge=o.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(ge=o.TEXTURE_2D_ARRAY),E.isData3DTexture&&(ge=o.TEXTURE_3D);const me=se(C,E),xe=E.source;n.bindTexture(ge,C.__webglTexture,o.TEXTURE0+$);const Oe=s.get(xe);if(xe.version!==Oe.__version||me===!0){n.activeTexture(o.TEXTURE0+$);const Re=wt.getPrimaries(wt.workingColorSpace),De=E.colorSpace===jn?null:wt.getPrimaries(E.colorSpace),He=E.colorSpace===jn||Re===De?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,E.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,E.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);const We=_(E)&&x(E.image)===!1;let ue=T(E.image,We,!1,a.maxTextureSize);ue=rt(E,ue);const Qe=x(ue)||c,tt=u.convert(E.format,E.colorSpace);let Ye=u.convert(E.type),Ge=U(E.internalFormat,tt,Ye,E.colorSpace,E.isVideoTexture);W(ge,E,Qe);let Pe;const Ze=E.mipmaps,st=c&&E.isVideoTexture!==!0&&Ge!==mm,vt=Oe.__version===void 0||me===!0,lt=Y(E,ue,Qe);if(E.isDepthTexture)Ge=o.DEPTH_COMPONENT,c?E.type===pr?Ge=o.DEPTH_COMPONENT32F:E.type===hr?Ge=o.DEPTH_COMPONENT24:E.type===Gr?Ge=o.DEPTH24_STENCIL8:Ge=o.DEPTH_COMPONENT16:E.type===pr&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===Vr&&Ge===o.DEPTH_COMPONENT&&E.type!==Jc&&E.type!==hr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=hr,Ye=u.convert(E.type)),E.format===Os&&Ge===o.DEPTH_COMPONENT&&(Ge=o.DEPTH_STENCIL,E.type!==Gr&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=Gr,Ye=u.convert(E.type))),vt&&(st?n.texStorage2D(o.TEXTURE_2D,1,Ge,ue.width,ue.height):n.texImage2D(o.TEXTURE_2D,0,Ge,ue.width,ue.height,0,tt,Ye,null));else if(E.isDataTexture)if(Ze.length>0&&Qe){st&&vt&&n.texStorage2D(o.TEXTURE_2D,lt,Ge,Ze[0].width,Ze[0].height);for(let Te=0,B=Ze.length;Te<B;Te++)Pe=Ze[Te],st?n.texSubImage2D(o.TEXTURE_2D,Te,0,0,Pe.width,Pe.height,tt,Ye,Pe.data):n.texImage2D(o.TEXTURE_2D,Te,Ge,Pe.width,Pe.height,0,tt,Ye,Pe.data);E.generateMipmaps=!1}else st?(vt&&n.texStorage2D(o.TEXTURE_2D,lt,Ge,ue.width,ue.height),n.texSubImage2D(o.TEXTURE_2D,0,0,0,ue.width,ue.height,tt,Ye,ue.data)):n.texImage2D(o.TEXTURE_2D,0,Ge,ue.width,ue.height,0,tt,Ye,ue.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){st&&vt&&n.texStorage3D(o.TEXTURE_2D_ARRAY,lt,Ge,Ze[0].width,Ze[0].height,ue.depth);for(let Te=0,B=Ze.length;Te<B;Te++)Pe=Ze[Te],E.format!==ai?tt!==null?st?n.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,Te,0,0,0,Pe.width,Pe.height,ue.depth,tt,Pe.data,0,0):n.compressedTexImage3D(o.TEXTURE_2D_ARRAY,Te,Ge,Pe.width,Pe.height,ue.depth,0,Pe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?n.texSubImage3D(o.TEXTURE_2D_ARRAY,Te,0,0,0,Pe.width,Pe.height,ue.depth,tt,Ye,Pe.data):n.texImage3D(o.TEXTURE_2D_ARRAY,Te,Ge,Pe.width,Pe.height,ue.depth,0,tt,Ye,Pe.data)}else{st&&vt&&n.texStorage2D(o.TEXTURE_2D,lt,Ge,Ze[0].width,Ze[0].height);for(let Te=0,B=Ze.length;Te<B;Te++)Pe=Ze[Te],E.format!==ai?tt!==null?st?n.compressedTexSubImage2D(o.TEXTURE_2D,Te,0,0,Pe.width,Pe.height,tt,Pe.data):n.compressedTexImage2D(o.TEXTURE_2D,Te,Ge,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?n.texSubImage2D(o.TEXTURE_2D,Te,0,0,Pe.width,Pe.height,tt,Ye,Pe.data):n.texImage2D(o.TEXTURE_2D,Te,Ge,Pe.width,Pe.height,0,tt,Ye,Pe.data)}else if(E.isDataArrayTexture)st?(vt&&n.texStorage3D(o.TEXTURE_2D_ARRAY,lt,Ge,ue.width,ue.height,ue.depth),n.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,tt,Ye,ue.data)):n.texImage3D(o.TEXTURE_2D_ARRAY,0,Ge,ue.width,ue.height,ue.depth,0,tt,Ye,ue.data);else if(E.isData3DTexture)st?(vt&&n.texStorage3D(o.TEXTURE_3D,lt,Ge,ue.width,ue.height,ue.depth),n.texSubImage3D(o.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,tt,Ye,ue.data)):n.texImage3D(o.TEXTURE_3D,0,Ge,ue.width,ue.height,ue.depth,0,tt,Ye,ue.data);else if(E.isFramebufferTexture){if(vt)if(st)n.texStorage2D(o.TEXTURE_2D,lt,Ge,ue.width,ue.height);else{let Te=ue.width,B=ue.height;for(let we=0;we<lt;we++)n.texImage2D(o.TEXTURE_2D,we,Ge,Te,B,0,tt,Ye,null),Te>>=1,B>>=1}}else if(Ze.length>0&&Qe){st&&vt&&n.texStorage2D(o.TEXTURE_2D,lt,Ge,Ze[0].width,Ze[0].height);for(let Te=0,B=Ze.length;Te<B;Te++)Pe=Ze[Te],st?n.texSubImage2D(o.TEXTURE_2D,Te,0,0,tt,Ye,Pe):n.texImage2D(o.TEXTURE_2D,Te,Ge,tt,Ye,Pe);E.generateMipmaps=!1}else st?(vt&&n.texStorage2D(o.TEXTURE_2D,lt,Ge,ue.width,ue.height),n.texSubImage2D(o.TEXTURE_2D,0,0,0,tt,Ye,ue)):n.texImage2D(o.TEXTURE_2D,0,Ge,tt,Ye,ue);N(E,Qe)&&P(ge),Oe.__version=xe.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Me(C,E,$){if(E.image.length!==6)return;const ge=se(C,E),me=E.source;n.bindTexture(o.TEXTURE_CUBE_MAP,C.__webglTexture,o.TEXTURE0+$);const xe=s.get(me);if(me.version!==xe.__version||ge===!0){n.activeTexture(o.TEXTURE0+$);const Oe=wt.getPrimaries(wt.workingColorSpace),Re=E.colorSpace===jn?null:wt.getPrimaries(E.colorSpace),De=E.colorSpace===jn||Oe===Re?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,E.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,E.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);const He=E.isCompressedTexture||E.image[0].isCompressedTexture,We=E.image[0]&&E.image[0].isDataTexture,ue=[];for(let Te=0;Te<6;Te++)!He&&!We?ue[Te]=T(E.image[Te],!1,!0,a.maxCubemapSize):ue[Te]=We?E.image[Te].image:E.image[Te],ue[Te]=rt(E,ue[Te]);const Qe=ue[0],tt=x(Qe)||c,Ye=u.convert(E.format,E.colorSpace),Ge=u.convert(E.type),Pe=U(E.internalFormat,Ye,Ge,E.colorSpace),Ze=c&&E.isVideoTexture!==!0,st=xe.__version===void 0||ge===!0;let vt=Y(E,Qe,tt);W(o.TEXTURE_CUBE_MAP,E,tt);let lt;if(He){Ze&&st&&n.texStorage2D(o.TEXTURE_CUBE_MAP,vt,Pe,Qe.width,Qe.height);for(let Te=0;Te<6;Te++){lt=ue[Te].mipmaps;for(let B=0;B<lt.length;B++){const we=lt[B];E.format!==ai?Ye!==null?Ze?n.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B,0,0,we.width,we.height,Ye,we.data):n.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B,Pe,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ze?n.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B,0,0,we.width,we.height,Ye,Ge,we.data):n.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B,Pe,we.width,we.height,0,Ye,Ge,we.data)}}}else{lt=E.mipmaps,Ze&&st&&(lt.length>0&&vt++,n.texStorage2D(o.TEXTURE_CUBE_MAP,vt,Pe,ue[0].width,ue[0].height));for(let Te=0;Te<6;Te++)if(We){Ze?n.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,ue[Te].width,ue[Te].height,Ye,Ge,ue[Te].data):n.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,Pe,ue[Te].width,ue[Te].height,0,Ye,Ge,ue[Te].data);for(let B=0;B<lt.length;B++){const Ce=lt[B].image[Te].image;Ze?n.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B+1,0,0,Ce.width,Ce.height,Ye,Ge,Ce.data):n.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B+1,Pe,Ce.width,Ce.height,0,Ye,Ge,Ce.data)}}else{Ze?n.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,Ye,Ge,ue[Te]):n.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,Pe,Ye,Ge,ue[Te]);for(let B=0;B<lt.length;B++){const we=lt[B];Ze?n.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B+1,0,0,Ye,Ge,we.image[Te]):n.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Te,B+1,Pe,Ye,Ge,we.image[Te])}}}N(E,tt)&&P(o.TEXTURE_CUBE_MAP),xe.__version=me.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function de(C,E,$,ge,me,xe){const Oe=u.convert($.format,$.colorSpace),Re=u.convert($.type),De=U($.internalFormat,Oe,Re,$.colorSpace);if(!s.get(E).__hasExternalTextures){const We=Math.max(1,E.width>>xe),ue=Math.max(1,E.height>>xe);me===o.TEXTURE_3D||me===o.TEXTURE_2D_ARRAY?n.texImage3D(me,xe,De,We,ue,E.depth,0,Oe,Re,null):n.texImage2D(me,xe,De,We,ue,0,Oe,Re,null)}n.bindFramebuffer(o.FRAMEBUFFER,C),ze(E)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,ge,me,s.get($).__webglTexture,0,$e(E)):(me===o.TEXTURE_2D||me>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&me<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,ge,me,s.get($).__webglTexture,xe),n.bindFramebuffer(o.FRAMEBUFFER,null)}function Se(C,E,$){if(o.bindRenderbuffer(o.RENDERBUFFER,C),E.depthBuffer&&!E.stencilBuffer){let ge=c===!0?o.DEPTH_COMPONENT24:o.DEPTH_COMPONENT16;if($||ze(E)){const me=E.depthTexture;me&&me.isDepthTexture&&(me.type===pr?ge=o.DEPTH_COMPONENT32F:me.type===hr&&(ge=o.DEPTH_COMPONENT24));const xe=$e(E);ze(E)?h.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,xe,ge,E.width,E.height):o.renderbufferStorageMultisample(o.RENDERBUFFER,xe,ge,E.width,E.height)}else o.renderbufferStorage(o.RENDERBUFFER,ge,E.width,E.height);o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,C)}else if(E.depthBuffer&&E.stencilBuffer){const ge=$e(E);$&&ze(E)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,ge,o.DEPTH24_STENCIL8,E.width,E.height):ze(E)?h.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,ge,o.DEPTH24_STENCIL8,E.width,E.height):o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_STENCIL,E.width,E.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.RENDERBUFFER,C)}else{const ge=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let me=0;me<ge.length;me++){const xe=ge[me],Oe=u.convert(xe.format,xe.colorSpace),Re=u.convert(xe.type),De=U(xe.internalFormat,Oe,Re,xe.colorSpace),He=$e(E);$&&ze(E)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,He,De,E.width,E.height):ze(E)?h.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,He,De,E.width,E.height):o.renderbufferStorage(o.RENDERBUFFER,De,E.width,E.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Ee(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(o.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!s.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),re(E.depthTexture,0);const ge=s.get(E.depthTexture).__webglTexture,me=$e(E);if(E.depthTexture.format===Vr)ze(E)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ge,0,me):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ge,0);else if(E.depthTexture.format===Os)ze(E)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ge,0,me):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function Ne(C){const E=s.get(C),$=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");Ee(E.__webglFramebuffer,C)}else if($){E.__webglDepthbuffer=[];for(let ge=0;ge<6;ge++)n.bindFramebuffer(o.FRAMEBUFFER,E.__webglFramebuffer[ge]),E.__webglDepthbuffer[ge]=o.createRenderbuffer(),Se(E.__webglDepthbuffer[ge],C,!1)}else n.bindFramebuffer(o.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=o.createRenderbuffer(),Se(E.__webglDepthbuffer,C,!1);n.bindFramebuffer(o.FRAMEBUFFER,null)}function ct(C,E,$){const ge=s.get(C);E!==void 0&&de(ge.__webglFramebuffer,C,C.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),$!==void 0&&Ne(C)}function Z(C){const E=C.texture,$=s.get(C),ge=s.get(E);C.addEventListener("dispose",ce),C.isWebGLMultipleRenderTargets!==!0&&(ge.__webglTexture===void 0&&(ge.__webglTexture=o.createTexture()),ge.__version=E.version,d.memory.textures++);const me=C.isWebGLCubeRenderTarget===!0,xe=C.isWebGLMultipleRenderTargets===!0,Oe=x(C)||c;if(me){$.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(c&&E.mipmaps&&E.mipmaps.length>0){$.__webglFramebuffer[Re]=[];for(let De=0;De<E.mipmaps.length;De++)$.__webglFramebuffer[Re][De]=o.createFramebuffer()}else $.__webglFramebuffer[Re]=o.createFramebuffer()}else{if(c&&E.mipmaps&&E.mipmaps.length>0){$.__webglFramebuffer=[];for(let Re=0;Re<E.mipmaps.length;Re++)$.__webglFramebuffer[Re]=o.createFramebuffer()}else $.__webglFramebuffer=o.createFramebuffer();if(xe)if(a.drawBuffers){const Re=C.texture;for(let De=0,He=Re.length;De<He;De++){const We=s.get(Re[De]);We.__webglTexture===void 0&&(We.__webglTexture=o.createTexture(),d.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(c&&C.samples>0&&ze(C)===!1){const Re=xe?E:[E];$.__webglMultisampledFramebuffer=o.createFramebuffer(),$.__webglColorRenderbuffer=[],n.bindFramebuffer(o.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let De=0;De<Re.length;De++){const He=Re[De];$.__webglColorRenderbuffer[De]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,$.__webglColorRenderbuffer[De]);const We=u.convert(He.format,He.colorSpace),ue=u.convert(He.type),Qe=U(He.internalFormat,We,ue,He.colorSpace,C.isXRRenderTarget===!0),tt=$e(C);o.renderbufferStorageMultisample(o.RENDERBUFFER,tt,Qe,C.width,C.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+De,o.RENDERBUFFER,$.__webglColorRenderbuffer[De])}o.bindRenderbuffer(o.RENDERBUFFER,null),C.depthBuffer&&($.__webglDepthRenderbuffer=o.createRenderbuffer(),Se($.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(o.FRAMEBUFFER,null)}}if(me){n.bindTexture(o.TEXTURE_CUBE_MAP,ge.__webglTexture),W(o.TEXTURE_CUBE_MAP,E,Oe);for(let Re=0;Re<6;Re++)if(c&&E.mipmaps&&E.mipmaps.length>0)for(let De=0;De<E.mipmaps.length;De++)de($.__webglFramebuffer[Re][De],C,E,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Re,De);else de($.__webglFramebuffer[Re],C,E,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);N(E,Oe)&&P(o.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(xe){const Re=C.texture;for(let De=0,He=Re.length;De<He;De++){const We=Re[De],ue=s.get(We);n.bindTexture(o.TEXTURE_2D,ue.__webglTexture),W(o.TEXTURE_2D,We,Oe),de($.__webglFramebuffer,C,We,o.COLOR_ATTACHMENT0+De,o.TEXTURE_2D,0),N(We,Oe)&&P(o.TEXTURE_2D)}n.unbindTexture()}else{let Re=o.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(c?Re=C.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),n.bindTexture(Re,ge.__webglTexture),W(Re,E,Oe),c&&E.mipmaps&&E.mipmaps.length>0)for(let De=0;De<E.mipmaps.length;De++)de($.__webglFramebuffer[De],C,E,o.COLOR_ATTACHMENT0,Re,De);else de($.__webglFramebuffer,C,E,o.COLOR_ATTACHMENT0,Re,0);N(E,Oe)&&P(Re),n.unbindTexture()}C.depthBuffer&&Ne(C)}function Nt(C){const E=x(C)||c,$=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let ge=0,me=$.length;ge<me;ge++){const xe=$[ge];if(N(xe,E)){const Oe=C.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:o.TEXTURE_2D,Re=s.get(xe).__webglTexture;n.bindTexture(Oe,Re),P(Oe),n.unbindTexture()}}}function Ve(C){if(c&&C.samples>0&&ze(C)===!1){const E=C.isWebGLMultipleRenderTargets?C.texture:[C.texture],$=C.width,ge=C.height;let me=o.COLOR_BUFFER_BIT;const xe=[],Oe=C.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Re=s.get(C),De=C.isWebGLMultipleRenderTargets===!0;if(De)for(let He=0;He<E.length;He++)n.bindFramebuffer(o.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+He,o.RENDERBUFFER,null),n.bindFramebuffer(o.FRAMEBUFFER,Re.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+He,o.TEXTURE_2D,null,0);n.bindFramebuffer(o.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer),n.bindFramebuffer(o.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let He=0;He<E.length;He++){xe.push(o.COLOR_ATTACHMENT0+He),C.depthBuffer&&xe.push(Oe);const We=Re.__ignoreDepthValues!==void 0?Re.__ignoreDepthValues:!1;if(We===!1&&(C.depthBuffer&&(me|=o.DEPTH_BUFFER_BIT),C.stencilBuffer&&(me|=o.STENCIL_BUFFER_BIT)),De&&o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Re.__webglColorRenderbuffer[He]),We===!0&&(o.invalidateFramebuffer(o.READ_FRAMEBUFFER,[Oe]),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[Oe])),De){const ue=s.get(E[He]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,ue,0)}o.blitFramebuffer(0,0,$,ge,0,0,$,ge,me,o.NEAREST),m&&o.invalidateFramebuffer(o.READ_FRAMEBUFFER,xe)}if(n.bindFramebuffer(o.READ_FRAMEBUFFER,null),n.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),De)for(let He=0;He<E.length;He++){n.bindFramebuffer(o.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+He,o.RENDERBUFFER,Re.__webglColorRenderbuffer[He]);const We=s.get(E[He]).__webglTexture;n.bindFramebuffer(o.FRAMEBUFFER,Re.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+He,o.TEXTURE_2D,We,0)}n.bindFramebuffer(o.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}}function $e(C){return Math.min(a.maxSamples,C.samples)}function ze(C){const E=s.get(C);return c&&C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function ht(C){const E=d.render.frame;g.get(C)!==E&&(g.set(C,E),C.update())}function rt(C,E){const $=C.colorSpace,ge=C.format,me=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===qc||$!==zi&&$!==jn&&(wt.getTransfer($)===bt?c===!1?e.has("EXT_sRGB")===!0&&ge===ai?(C.format=qc,C.minFilter=qn,C.generateMipmaps=!1):E=xm.sRGBToLinear(E):(ge!==ai||me!==gr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),E}this.allocateTextureUnit=k,this.resetTextureUnits=_e,this.setTexture2D=re,this.setTexture2DArray=ae,this.setTexture3D=G,this.setTextureCube=K,this.rebindTextures=ct,this.setupRenderTarget=Z,this.updateRenderTargetMipmap=Nt,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=de,this.useMultisampledRTT=ze}function VM(o,e,n){const s=n.isWebGL2;function a(u,d=jn){let c;const h=wt.getTransfer(d);if(u===gr)return o.UNSIGNED_BYTE;if(u===cm)return o.UNSIGNED_SHORT_4_4_4_4;if(u===fm)return o.UNSIGNED_SHORT_5_5_5_1;if(u===fv)return o.BYTE;if(u===dv)return o.SHORT;if(u===Jc)return o.UNSIGNED_SHORT;if(u===um)return o.INT;if(u===hr)return o.UNSIGNED_INT;if(u===pr)return o.FLOAT;if(u===Oi)return s?o.HALF_FLOAT:(c=e.get("OES_texture_half_float"),c!==null?c.HALF_FLOAT_OES:null);if(u===hv)return o.ALPHA;if(u===ai)return o.RGBA;if(u===pv)return o.LUMINANCE;if(u===mv)return o.LUMINANCE_ALPHA;if(u===Vr)return o.DEPTH_COMPONENT;if(u===Os)return o.DEPTH_STENCIL;if(u===qc)return c=e.get("EXT_sRGB"),c!==null?c.SRGB_ALPHA_EXT:null;if(u===gv)return o.RED;if(u===dm)return o.RED_INTEGER;if(u===_v)return o.RG;if(u===hm)return o.RG_INTEGER;if(u===pm)return o.RGBA_INTEGER;if(u===dc||u===hc||u===pc||u===mc)if(h===bt)if(c=e.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(u===dc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(u===hc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(u===pc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(u===mc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=e.get("WEBGL_compressed_texture_s3tc"),c!==null){if(u===dc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(u===hc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(u===pc)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(u===mc)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(u===Wh||u===Xh||u===Yh||u===qh)if(c=e.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(u===Wh)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(u===Xh)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(u===Yh)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(u===qh)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(u===mm)return c=e.get("WEBGL_compressed_texture_etc1"),c!==null?c.COMPRESSED_RGB_ETC1_WEBGL:null;if(u===jh||u===Kh)if(c=e.get("WEBGL_compressed_texture_etc"),c!==null){if(u===jh)return h===bt?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(u===Kh)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(u===$h||u===Qh||u===Zh||u===Jh||u===ep||u===tp||u===np||u===ip||u===rp||u===sp||u===op||u===ap||u===lp||u===up)if(c=e.get("WEBGL_compressed_texture_astc"),c!==null){if(u===$h)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(u===Qh)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(u===Zh)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(u===Jh)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(u===ep)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(u===tp)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(u===np)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(u===ip)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(u===rp)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(u===sp)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(u===op)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(u===ap)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(u===lp)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(u===up)return h===bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(u===gc||u===cp||u===fp)if(c=e.get("EXT_texture_compression_bptc"),c!==null){if(u===gc)return h===bt?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(u===cp)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(u===fp)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(u===vv||u===dp||u===hp||u===pp)if(c=e.get("EXT_texture_compression_rgtc"),c!==null){if(u===gc)return c.COMPRESSED_RED_RGTC1_EXT;if(u===dp)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(u===hp)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(u===pp)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return u===Gr?s?o.UNSIGNED_INT_24_8:(c=e.get("WEBGL_depth_texture"),c!==null?c.UNSIGNED_INT_24_8_WEBGL:null):o[u]!==void 0?o[u]:null}return{convert:a}}class WM extends si{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class dl extends Bn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const XM={type:"move"};class zc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dl,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dl,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new te,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new te),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dl,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new te,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new te),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const s of e.hand.values())this._getHandJoint(n,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,s){let a=null,u=null,d=null;const c=this._targetRay,h=this._grip,m=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(m&&e.hand){d=!0;for(const T of e.hand.values()){const x=n.getJointPose(T,s),_=this._getHandJoint(m,T);x!==null&&(_.matrix.fromArray(x.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=x.radius),_.visible=x!==null}const g=m.joints["index-finger-tip"],v=m.joints["thumb-tip"],S=g.position.distanceTo(v.position),M=.02,w=.005;m.inputState.pinching&&S>M+w?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&S<=M-w&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(u=n.getPose(e.gripSpace,s),u!==null&&(h.matrix.fromArray(u.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,u.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(u.linearVelocity)):h.hasLinearVelocity=!1,u.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(u.angularVelocity)):h.hasAngularVelocity=!1));c!==null&&(a=n.getPose(e.targetRaySpace,s),a===null&&u!==null&&(a=u),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(XM)))}return c!==null&&(c.visible=a!==null),h!==null&&(h.visible=u!==null),m!==null&&(m.visible=d!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const s=new dl;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[n.jointName]=s,e.add(s)}return e.joints[n.jointName]}}class YM extends ks{constructor(e,n){super();const s=this;let a=null,u=1,d=null,c="local-floor",h=1,m=null,g=null,v=null,S=null,M=null,w=null;const T=n.getContextAttributes();let x=null,_=null;const N=[],P=[],U=new at;let Y=null;const O=new si;O.layers.enable(1),O.viewport=new rn;const I=new si;I.layers.enable(2),I.viewport=new rn;const ce=[O,I],R=new WM;R.layers.enable(1),R.layers.enable(2);let b=null,oe=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let se=N[W];return se===void 0&&(se=new zc,N[W]=se),se.getTargetRaySpace()},this.getControllerGrip=function(W){let se=N[W];return se===void 0&&(se=new zc,N[W]=se),se.getGripSpace()},this.getHand=function(W){let se=N[W];return se===void 0&&(se=new zc,N[W]=se),se.getHandSpace()};function le(W){const se=P.indexOf(W.inputSource);if(se===-1)return;const fe=N[se];fe!==void 0&&(fe.update(W.inputSource,W.frame,m||d),fe.dispatchEvent({type:W.type,data:W.inputSource}))}function _e(){a.removeEventListener("select",le),a.removeEventListener("selectstart",le),a.removeEventListener("selectend",le),a.removeEventListener("squeeze",le),a.removeEventListener("squeezestart",le),a.removeEventListener("squeezeend",le),a.removeEventListener("end",_e),a.removeEventListener("inputsourceschange",k);for(let W=0;W<N.length;W++){const se=P[W];se!==null&&(P[W]=null,N[W].disconnect(se))}b=null,oe=null,e.setRenderTarget(x),M=null,S=null,v=null,a=null,_=null,H.stop(),s.isPresenting=!1,e.setPixelRatio(Y),e.setSize(U.width,U.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){u=W,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){c=W,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||d},this.setReferenceSpace=function(W){m=W},this.getBaseLayer=function(){return S!==null?S:M},this.getBinding=function(){return v},this.getFrame=function(){return w},this.getSession=function(){return a},this.setSession=async function(W){if(a=W,a!==null){if(x=e.getRenderTarget(),a.addEventListener("select",le),a.addEventListener("selectstart",le),a.addEventListener("selectend",le),a.addEventListener("squeeze",le),a.addEventListener("squeezestart",le),a.addEventListener("squeezeend",le),a.addEventListener("end",_e),a.addEventListener("inputsourceschange",k),T.xrCompatible!==!0&&await n.makeXRCompatible(),Y=e.getPixelRatio(),e.getSize(U),a.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const se={antialias:a.renderState.layers===void 0?T.antialias:!0,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:u};M=new XRWebGLLayer(a,n,se),a.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),_=new li(M.framebufferWidth,M.framebufferHeight,{format:ai,type:gr,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil})}else{let se=null,fe=null,Me=null;T.depth&&(Me=T.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,se=T.stencil?Os:Vr,fe=T.stencil?Gr:hr);const de={colorFormat:n.RGBA8,depthFormat:Me,scaleFactor:u};v=new XRWebGLBinding(a,n),S=v.createProjectionLayer(de),a.updateRenderState({layers:[S]}),e.setPixelRatio(1),e.setSize(S.textureWidth,S.textureHeight,!1),_=new li(S.textureWidth,S.textureHeight,{format:ai,type:gr,depthTexture:new bm(S.textureWidth,S.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0});const Se=e.properties.get(_);Se.__ignoreDepthValues=S.ignoreDepthValues}_.isXRRenderTarget=!0,this.setFoveation(h),m=null,d=await a.requestReferenceSpace(c),H.setContext(a),H.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode};function k(W){for(let se=0;se<W.removed.length;se++){const fe=W.removed[se],Me=P.indexOf(fe);Me>=0&&(P[Me]=null,N[Me].disconnect(fe))}for(let se=0;se<W.added.length;se++){const fe=W.added[se];let Me=P.indexOf(fe);if(Me===-1){for(let Se=0;Se<N.length;Se++)if(Se>=P.length){P.push(fe),Me=Se;break}else if(P[Se]===null){P[Se]=fe,Me=Se;break}if(Me===-1)break}const de=N[Me];de&&de.connect(fe)}}const Q=new te,re=new te;function ae(W,se,fe){Q.setFromMatrixPosition(se.matrixWorld),re.setFromMatrixPosition(fe.matrixWorld);const Me=Q.distanceTo(re),de=se.projectionMatrix.elements,Se=fe.projectionMatrix.elements,Ee=de[14]/(de[10]-1),Ne=de[14]/(de[10]+1),ct=(de[9]+1)/de[5],Z=(de[9]-1)/de[5],Nt=(de[8]-1)/de[0],Ve=(Se[8]+1)/Se[0],$e=Ee*Nt,ze=Ee*Ve,ht=Me/(-Nt+Ve),rt=ht*-Nt;se.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(rt),W.translateZ(ht),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert();const C=Ee+ht,E=Ne+ht,$=$e-rt,ge=ze+(Me-rt),me=ct*Ne/E*C,xe=Z*Ne/E*C;W.projectionMatrix.makePerspective($,ge,me,xe,C,E),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}function G(W,se){se===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(se.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(a===null)return;R.near=I.near=O.near=W.near,R.far=I.far=O.far=W.far,(b!==R.near||oe!==R.far)&&(a.updateRenderState({depthNear:R.near,depthFar:R.far}),b=R.near,oe=R.far);const se=W.parent,fe=R.cameras;G(R,se);for(let Me=0;Me<fe.length;Me++)G(fe[Me],se);fe.length===2?ae(R,O,I):R.projectionMatrix.copy(O.projectionMatrix),K(W,R,se)};function K(W,se,fe){fe===null?W.matrix.copy(se.matrixWorld):(W.matrix.copy(fe.matrixWorld),W.matrix.invert(),W.matrix.multiply(se.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(se.projectionMatrix),W.projectionMatrixInverse.copy(se.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Do*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(S===null&&M===null))return h},this.setFoveation=function(W){h=W,S!==null&&(S.fixedFoveation=W),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=W)};let V=null;function L(W,se){if(g=se.getViewerPose(m||d),w=se,g!==null){const fe=g.views;M!==null&&(e.setRenderTargetFramebuffer(_,M.framebuffer),e.setRenderTarget(_));let Me=!1;fe.length!==R.cameras.length&&(R.cameras.length=0,Me=!0);for(let de=0;de<fe.length;de++){const Se=fe[de];let Ee=null;if(M!==null)Ee=M.getViewport(Se);else{const ct=v.getViewSubImage(S,Se);Ee=ct.viewport,de===0&&(e.setRenderTargetTextures(_,ct.colorTexture,S.ignoreDepthValues?void 0:ct.depthStencilTexture),e.setRenderTarget(_))}let Ne=ce[de];Ne===void 0&&(Ne=new si,Ne.layers.enable(de),Ne.viewport=new rn,ce[de]=Ne),Ne.matrix.fromArray(Se.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(Se.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(Ee.x,Ee.y,Ee.width,Ee.height),de===0&&(R.matrix.copy(Ne.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),Me===!0&&R.cameras.push(Ne)}}for(let fe=0;fe<N.length;fe++){const Me=P[fe],de=N[fe];Me!==null&&de!==void 0&&de.update(Me,se,m||d)}V&&V(W,se),se.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:se}),w=null}const H=new Lm;H.setAnimationLoop(L),this.setAnimationLoop=function(W){V=W},this.dispose=function(){}}}function qM(o,e){function n(x,_){x.matrixAutoUpdate===!0&&x.updateMatrix(),_.value.copy(x.matrix)}function s(x,_){_.color.getRGB(x.fogColor.value,Am(o)),_.isFog?(x.fogNear.value=_.near,x.fogFar.value=_.far):_.isFogExp2&&(x.fogDensity.value=_.density)}function a(x,_,N,P,U){_.isMeshBasicMaterial||_.isMeshLambertMaterial?u(x,_):_.isMeshToonMaterial?(u(x,_),v(x,_)):_.isMeshPhongMaterial?(u(x,_),g(x,_)):_.isMeshStandardMaterial?(u(x,_),S(x,_),_.isMeshPhysicalMaterial&&M(x,_,U)):_.isMeshMatcapMaterial?(u(x,_),w(x,_)):_.isMeshDepthMaterial?u(x,_):_.isMeshDistanceMaterial?(u(x,_),T(x,_)):_.isMeshNormalMaterial?u(x,_):_.isLineBasicMaterial?(d(x,_),_.isLineDashedMaterial&&c(x,_)):_.isPointsMaterial?h(x,_,N,P):_.isSpriteMaterial?m(x,_):_.isShadowMaterial?(x.color.value.copy(_.color),x.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function u(x,_){x.opacity.value=_.opacity,_.color&&x.diffuse.value.copy(_.color),_.emissive&&x.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(x.map.value=_.map,n(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,n(_.alphaMap,x.alphaMapTransform)),_.bumpMap&&(x.bumpMap.value=_.bumpMap,n(_.bumpMap,x.bumpMapTransform),x.bumpScale.value=_.bumpScale,_.side===Ln&&(x.bumpScale.value*=-1)),_.normalMap&&(x.normalMap.value=_.normalMap,n(_.normalMap,x.normalMapTransform),x.normalScale.value.copy(_.normalScale),_.side===Ln&&x.normalScale.value.negate()),_.displacementMap&&(x.displacementMap.value=_.displacementMap,n(_.displacementMap,x.displacementMapTransform),x.displacementScale.value=_.displacementScale,x.displacementBias.value=_.displacementBias),_.emissiveMap&&(x.emissiveMap.value=_.emissiveMap,n(_.emissiveMap,x.emissiveMapTransform)),_.specularMap&&(x.specularMap.value=_.specularMap,n(_.specularMap,x.specularMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest);const N=e.get(_).envMap;if(N&&(x.envMap.value=N,x.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=_.reflectivity,x.ior.value=_.ior,x.refractionRatio.value=_.refractionRatio),_.lightMap){x.lightMap.value=_.lightMap;const P=o._useLegacyLights===!0?Math.PI:1;x.lightMapIntensity.value=_.lightMapIntensity*P,n(_.lightMap,x.lightMapTransform)}_.aoMap&&(x.aoMap.value=_.aoMap,x.aoMapIntensity.value=_.aoMapIntensity,n(_.aoMap,x.aoMapTransform))}function d(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,_.map&&(x.map.value=_.map,n(_.map,x.mapTransform))}function c(x,_){x.dashSize.value=_.dashSize,x.totalSize.value=_.dashSize+_.gapSize,x.scale.value=_.scale}function h(x,_,N,P){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.size.value=_.size*N,x.scale.value=P*.5,_.map&&(x.map.value=_.map,n(_.map,x.uvTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,n(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function m(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.rotation.value=_.rotation,_.map&&(x.map.value=_.map,n(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,n(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function g(x,_){x.specular.value.copy(_.specular),x.shininess.value=Math.max(_.shininess,1e-4)}function v(x,_){_.gradientMap&&(x.gradientMap.value=_.gradientMap)}function S(x,_){x.metalness.value=_.metalness,_.metalnessMap&&(x.metalnessMap.value=_.metalnessMap,n(_.metalnessMap,x.metalnessMapTransform)),x.roughness.value=_.roughness,_.roughnessMap&&(x.roughnessMap.value=_.roughnessMap,n(_.roughnessMap,x.roughnessMapTransform)),e.get(_).envMap&&(x.envMapIntensity.value=_.envMapIntensity)}function M(x,_,N){x.ior.value=_.ior,_.sheen>0&&(x.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),x.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(x.sheenColorMap.value=_.sheenColorMap,n(_.sheenColorMap,x.sheenColorMapTransform)),_.sheenRoughnessMap&&(x.sheenRoughnessMap.value=_.sheenRoughnessMap,n(_.sheenRoughnessMap,x.sheenRoughnessMapTransform))),_.clearcoat>0&&(x.clearcoat.value=_.clearcoat,x.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(x.clearcoatMap.value=_.clearcoatMap,n(_.clearcoatMap,x.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,n(_.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(x.clearcoatNormalMap.value=_.clearcoatNormalMap,n(_.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Ln&&x.clearcoatNormalScale.value.negate())),_.iridescence>0&&(x.iridescence.value=_.iridescence,x.iridescenceIOR.value=_.iridescenceIOR,x.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(x.iridescenceMap.value=_.iridescenceMap,n(_.iridescenceMap,x.iridescenceMapTransform)),_.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=_.iridescenceThicknessMap,n(_.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),_.transmission>0&&(x.transmission.value=_.transmission,x.transmissionSamplerMap.value=N.texture,x.transmissionSamplerSize.value.set(N.width,N.height),_.transmissionMap&&(x.transmissionMap.value=_.transmissionMap,n(_.transmissionMap,x.transmissionMapTransform)),x.thickness.value=_.thickness,_.thicknessMap&&(x.thicknessMap.value=_.thicknessMap,n(_.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=_.attenuationDistance,x.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(x.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(x.anisotropyMap.value=_.anisotropyMap,n(_.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=_.specularIntensity,x.specularColor.value.copy(_.specularColor),_.specularColorMap&&(x.specularColorMap.value=_.specularColorMap,n(_.specularColorMap,x.specularColorMapTransform)),_.specularIntensityMap&&(x.specularIntensityMap.value=_.specularIntensityMap,n(_.specularIntensityMap,x.specularIntensityMapTransform))}function w(x,_){_.matcap&&(x.matcap.value=_.matcap)}function T(x,_){const N=e.get(_).light;x.referencePosition.value.setFromMatrixPosition(N.matrixWorld),x.nearDistance.value=N.shadow.camera.near,x.farDistance.value=N.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:a}}function jM(o,e,n,s){let a={},u={},d=[];const c=n.isWebGL2?o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS):0;function h(N,P){const U=P.program;s.uniformBlockBinding(N,U)}function m(N,P){let U=a[N.id];U===void 0&&(w(N),U=g(N),a[N.id]=U,N.addEventListener("dispose",x));const Y=P.program;s.updateUBOMapping(N,Y);const O=e.render.frame;u[N.id]!==O&&(S(N),u[N.id]=O)}function g(N){const P=v();N.__bindingPointIndex=P;const U=o.createBuffer(),Y=N.__size,O=N.usage;return o.bindBuffer(o.UNIFORM_BUFFER,U),o.bufferData(o.UNIFORM_BUFFER,Y,O),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,P,U),U}function v(){for(let N=0;N<c;N++)if(d.indexOf(N)===-1)return d.push(N),N;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(N){const P=a[N.id],U=N.uniforms,Y=N.__cache;o.bindBuffer(o.UNIFORM_BUFFER,P);for(let O=0,I=U.length;O<I;O++){const ce=Array.isArray(U[O])?U[O]:[U[O]];for(let R=0,b=ce.length;R<b;R++){const oe=ce[R];if(M(oe,O,R,Y)===!0){const le=oe.__offset,_e=Array.isArray(oe.value)?oe.value:[oe.value];let k=0;for(let Q=0;Q<_e.length;Q++){const re=_e[Q],ae=T(re);typeof re=="number"||typeof re=="boolean"?(oe.__data[0]=re,o.bufferSubData(o.UNIFORM_BUFFER,le+k,oe.__data)):re.isMatrix3?(oe.__data[0]=re.elements[0],oe.__data[1]=re.elements[1],oe.__data[2]=re.elements[2],oe.__data[3]=0,oe.__data[4]=re.elements[3],oe.__data[5]=re.elements[4],oe.__data[6]=re.elements[5],oe.__data[7]=0,oe.__data[8]=re.elements[6],oe.__data[9]=re.elements[7],oe.__data[10]=re.elements[8],oe.__data[11]=0):(re.toArray(oe.__data,k),k+=ae.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,le,oe.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function M(N,P,U,Y){const O=N.value,I=P+"_"+U;if(Y[I]===void 0)return typeof O=="number"||typeof O=="boolean"?Y[I]=O:Y[I]=O.clone(),!0;{const ce=Y[I];if(typeof O=="number"||typeof O=="boolean"){if(ce!==O)return Y[I]=O,!0}else if(ce.equals(O)===!1)return ce.copy(O),!0}return!1}function w(N){const P=N.uniforms;let U=0;const Y=16;for(let I=0,ce=P.length;I<ce;I++){const R=Array.isArray(P[I])?P[I]:[P[I]];for(let b=0,oe=R.length;b<oe;b++){const le=R[b],_e=Array.isArray(le.value)?le.value:[le.value];for(let k=0,Q=_e.length;k<Q;k++){const re=_e[k],ae=T(re),G=U%Y;G!==0&&Y-G<ae.boundary&&(U+=Y-G),le.__data=new Float32Array(ae.storage/Float32Array.BYTES_PER_ELEMENT),le.__offset=U,U+=ae.storage}}}const O=U%Y;return O>0&&(U+=Y-O),N.__size=U,N.__cache={},this}function T(N){const P={boundary:0,storage:0};return typeof N=="number"||typeof N=="boolean"?(P.boundary=4,P.storage=4):N.isVector2?(P.boundary=8,P.storage=8):N.isVector3||N.isColor?(P.boundary=16,P.storage=12):N.isVector4?(P.boundary=16,P.storage=16):N.isMatrix3?(P.boundary=48,P.storage=48):N.isMatrix4?(P.boundary=64,P.storage=64):N.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",N),P}function x(N){const P=N.target;P.removeEventListener("dispose",x);const U=d.indexOf(P.__bindingPointIndex);d.splice(U,1),o.deleteBuffer(a[P.id]),delete a[P.id],delete u[P.id]}function _(){for(const N in a)o.deleteBuffer(a[N]);d=[],a={},u={}}return{bind:h,update:m,dispose:_}}class Om{constructor(e={}){const{canvas:n=Wv(),context:s=null,depth:a=!0,stencil:u=!0,alpha:d=!1,antialias:c=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:m=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:v=!1}=e;this.isWebGLRenderer=!0;let S;s!==null?S=s.getContextAttributes().alpha:S=d;const M=new Uint32Array(4),w=new Int32Array(4);let T=null,x=null;const _=[],N=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this._useLegacyLights=!1,this.toneMapping=mr,this.toneMappingExposure=1;const P=this;let U=!1,Y=0,O=0,I=null,ce=-1,R=null;const b=new rn,oe=new rn;let le=null;const _e=new _t(0);let k=0,Q=n.width,re=n.height,ae=1,G=null,K=null;const V=new rn(0,0,Q,re),L=new rn(0,0,Q,re);let H=!1;const W=new Pm;let se=!1,fe=!1,Me=null;const de=new sn,Se=new at,Ee=new te,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ct(){return I===null?ae:1}let Z=s;function Nt(A,q){for(let ne=0;ne<A.length;ne++){const ie=A[ne],ee=n.getContext(ie,q);if(ee!==null)return ee}return null}try{const A={alpha:!0,depth:a,stencil:u,antialias:c,premultipliedAlpha:h,preserveDrawingBuffer:m,powerPreference:g,failIfMajorPerformanceCaveat:v};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Zc}`),n.addEventListener("webglcontextlost",Te,!1),n.addEventListener("webglcontextrestored",B,!1),n.addEventListener("webglcontextcreationerror",we,!1),Z===null){const q=["webgl2","webgl","experimental-webgl"];if(P.isWebGL1Renderer===!0&&q.shift(),Z=Nt(q,A),Z===null)throw Nt(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&Z instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),Z.getShaderPrecisionFormat===void 0&&(Z.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Ve,$e,ze,ht,rt,C,E,$,ge,me,xe,Oe,Re,De,He,We,ue,Qe,tt,Ye,Ge,Pe,Ze,st;function vt(){Ve=new ry(Z),$e=new ZS(Z,Ve,e),Ve.init($e),Pe=new VM(Z,Ve,$e),ze=new HM(Z,Ve,$e),ht=new ay(Z),rt=new RM,C=new GM(Z,Ve,ze,rt,$e,Pe,ht),E=new ey(P),$=new iy(P),ge=new m0(Z,$e),Ze=new $S(Z,Ve,ge,$e),me=new sy(Z,ge,ht,Ze),xe=new fy(Z,me,ge,ht),tt=new cy(Z,$e,C),We=new JS(rt),Oe=new AM(P,E,$,Ve,$e,Ze,We),Re=new qM(P,rt),De=new PM,He=new IM(Ve,$e),Qe=new KS(P,E,$,ze,xe,S,h),ue=new kM(P,xe,$e),st=new jM(Z,ht,$e,ze),Ye=new QS(Z,Ve,ht,$e),Ge=new oy(Z,Ve,ht,$e),ht.programs=Oe.programs,P.capabilities=$e,P.extensions=Ve,P.properties=rt,P.renderLists=De,P.shadowMap=ue,P.state=ze,P.info=ht}vt();const lt=new YM(P,Z);this.xr=lt,this.getContext=function(){return Z},this.getContextAttributes=function(){return Z.getContextAttributes()},this.forceContextLoss=function(){const A=Ve.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Ve.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(A){A!==void 0&&(ae=A,this.setSize(Q,re,!1))},this.getSize=function(A){return A.set(Q,re)},this.setSize=function(A,q,ne=!0){if(lt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Q=A,re=q,n.width=Math.floor(A*ae),n.height=Math.floor(q*ae),ne===!0&&(n.style.width=A+"px",n.style.height=q+"px"),this.setViewport(0,0,A,q)},this.getDrawingBufferSize=function(A){return A.set(Q*ae,re*ae).floor()},this.setDrawingBufferSize=function(A,q,ne){Q=A,re=q,ae=ne,n.width=Math.floor(A*ne),n.height=Math.floor(q*ne),this.setViewport(0,0,A,q)},this.getCurrentViewport=function(A){return A.copy(b)},this.getViewport=function(A){return A.copy(V)},this.setViewport=function(A,q,ne,ie){A.isVector4?V.set(A.x,A.y,A.z,A.w):V.set(A,q,ne,ie),ze.viewport(b.copy(V).multiplyScalar(ae).floor())},this.getScissor=function(A){return A.copy(L)},this.setScissor=function(A,q,ne,ie){A.isVector4?L.set(A.x,A.y,A.z,A.w):L.set(A,q,ne,ie),ze.scissor(oe.copy(L).multiplyScalar(ae).floor())},this.getScissorTest=function(){return H},this.setScissorTest=function(A){ze.setScissorTest(H=A)},this.setOpaqueSort=function(A){G=A},this.setTransparentSort=function(A){K=A},this.getClearColor=function(A){return A.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor.apply(Qe,arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha.apply(Qe,arguments)},this.clear=function(A=!0,q=!0,ne=!0){let ie=0;if(A){let ee=!1;if(I!==null){const Le=I.texture.format;ee=Le===pm||Le===hm||Le===dm}if(ee){const Le=I.texture.type,Xe=Le===gr||Le===hr||Le===Jc||Le===Gr||Le===cm||Le===fm,Je=Qe.getClearColor(),Ue=Qe.getClearAlpha(),ut=Je.r,it=Je.g,ot=Je.b;Xe?(M[0]=ut,M[1]=it,M[2]=ot,M[3]=Ue,Z.clearBufferuiv(Z.COLOR,0,M)):(w[0]=ut,w[1]=it,w[2]=ot,w[3]=Ue,Z.clearBufferiv(Z.COLOR,0,w))}else ie|=Z.COLOR_BUFFER_BIT}q&&(ie|=Z.DEPTH_BUFFER_BIT),ne&&(ie|=Z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Z.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Te,!1),n.removeEventListener("webglcontextrestored",B,!1),n.removeEventListener("webglcontextcreationerror",we,!1),De.dispose(),He.dispose(),rt.dispose(),E.dispose(),$.dispose(),xe.dispose(),Ze.dispose(),st.dispose(),Oe.dispose(),lt.dispose(),lt.removeEventListener("sessionstart",Kt),lt.removeEventListener("sessionend",St),Me&&(Me.dispose(),Me=null),Wt.stop()};function Te(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function B(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const A=ht.autoReset,q=ue.enabled,ne=ue.autoUpdate,ie=ue.needsUpdate,ee=ue.type;vt(),ht.autoReset=A,ue.enabled=q,ue.autoUpdate=ne,ue.needsUpdate=ie,ue.type=ee}function we(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Ce(A){const q=A.target;q.removeEventListener("dispose",Ce),et(q)}function et(A){qe(A),rt.remove(A)}function qe(A){const q=rt.get(A).programs;q!==void 0&&(q.forEach(function(ne){Oe.releaseProgram(ne)}),A.isShaderMaterial&&Oe.releaseShaderCache(A))}this.renderBufferDirect=function(A,q,ne,ie,ee,Le){q===null&&(q=Ne);const Xe=ee.isMesh&&ee.matrixWorld.determinant()<0,Je=Cl(A,q,ne,ie,ee);ze.setMaterial(ie,Xe);let Ue=ne.index,ut=1;if(ie.wireframe===!0){if(Ue=me.getWireframeAttribute(ne),Ue===void 0)return;ut=2}const it=ne.drawRange,ot=ne.attributes.position;let At=it.start*ut,hn=(it.start+it.count)*ut;Le!==null&&(At=Math.max(At,Le.start*ut),hn=Math.min(hn,(Le.start+Le.count)*ut)),Ue!==null?(At=Math.max(At,0),hn=Math.min(hn,Ue.count)):ot!=null&&(At=Math.max(At,0),hn=Math.min(hn,ot.count));const kt=hn-At;if(kt<0||kt===1/0)return;Ze.setup(ee,ie,Je,ne,Ue);let yn,gt=Ye;if(Ue!==null&&(yn=ge.get(Ue),gt=Ge,gt.setIndex(yn)),ee.isMesh)ie.wireframe===!0?(ze.setLineWidth(ie.wireframeLinewidth*ct()),gt.setMode(Z.LINES)):gt.setMode(Z.TRIANGLES);else if(ee.isLine){let ft=ie.linewidth;ft===void 0&&(ft=1),ze.setLineWidth(ft*ct()),ee.isLineSegments?gt.setMode(Z.LINES):ee.isLineLoop?gt.setMode(Z.LINE_LOOP):gt.setMode(Z.LINE_STRIP)}else ee.isPoints?gt.setMode(Z.POINTS):ee.isSprite&&gt.setMode(Z.TRIANGLES);if(ee.isBatchedMesh)gt.renderMultiDraw(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount);else if(ee.isInstancedMesh)gt.renderInstances(At,kt,ee.count);else if(ne.isInstancedBufferGeometry){const ft=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,pn=Math.min(ne.instanceCount,ft);gt.renderInstances(At,kt,pn)}else gt.render(At,kt)};function Mt(A,q,ne){A.transparent===!0&&A.side===Ni&&A.forceSinglePass===!1?(A.side=Ln,A.needsUpdate=!0,ki(A,q,ne),A.side=_r,A.needsUpdate=!0,ki(A,q,ne),A.side=Ni):ki(A,q,ne)}this.compile=function(A,q,ne=null){ne===null&&(ne=A),x=He.get(ne),x.init(),N.push(x),ne.traverseVisible(function(ee){ee.isLight&&ee.layers.test(q.layers)&&(x.pushLight(ee),ee.castShadow&&x.pushShadow(ee))}),A!==ne&&A.traverseVisible(function(ee){ee.isLight&&ee.layers.test(q.layers)&&(x.pushLight(ee),ee.castShadow&&x.pushShadow(ee))}),x.setupLights(P._useLegacyLights);const ie=new Set;return A.traverse(function(ee){const Le=ee.material;if(Le)if(Array.isArray(Le))for(let Xe=0;Xe<Le.length;Xe++){const Je=Le[Xe];Mt(Je,ne,ee),ie.add(Je)}else Mt(Le,ne,ee),ie.add(Le)}),N.pop(),x=null,ie},this.compileAsync=function(A,q,ne=null){const ie=this.compile(A,q,ne);return new Promise(ee=>{function Le(){if(ie.forEach(function(Xe){rt.get(Xe).currentProgram.isReady()&&ie.delete(Xe)}),ie.size===0){ee(A);return}setTimeout(Le,10)}Ve.get("KHR_parallel_shader_compile")!==null?Le():setTimeout(Le,10)})};let Et=null;function Ot(A){Et&&Et(A)}function Kt(){Wt.stop()}function St(){Wt.start()}const Wt=new Lm;Wt.setAnimationLoop(Ot),typeof self<"u"&&Wt.setContext(self),this.setAnimationLoop=function(A){Et=A,lt.setAnimationLoop(A),A===null?Wt.stop():Wt.start()},lt.addEventListener("sessionstart",Kt),lt.addEventListener("sessionend",St),this.render=function(A,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(q),q=lt.getCamera()),A.isScene===!0&&A.onBeforeRender(P,A,q,I),x=He.get(A,N.length),x.init(),N.push(x),de.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),W.setFromProjectionMatrix(de),fe=this.localClippingEnabled,se=We.init(this.clippingPlanes,fe),T=De.get(A,_.length),T.init(),_.push(T),on(A,q,0,P.sortObjects),T.finish(),P.sortObjects===!0&&T.sort(G,K),this.info.render.frame++,se===!0&&We.beginShadows();const ne=x.state.shadowsArray;if(ue.render(ne,A,q),se===!0&&We.endShadows(),this.info.autoReset===!0&&this.info.reset(),Qe.render(T,A),x.setupLights(P._useLegacyLights),q.isArrayCamera){const ie=q.cameras;for(let ee=0,Le=ie.length;ee<Le;ee++){const Xe=ie[ee];Oo(T,A,Xe,Xe.viewport)}}else Oo(T,A,q);I!==null&&(C.updateMultisampleRenderTarget(I),C.updateRenderTargetMipmap(I)),A.isScene===!0&&A.onAfterRender(P,A,q),Ze.resetDefaultState(),ce=-1,R=null,N.pop(),N.length>0?x=N[N.length-1]:x=null,_.pop(),_.length>0?T=_[_.length-1]:T=null};function on(A,q,ne,ie){if(A.visible===!1)return;if(A.layers.test(q.layers)){if(A.isGroup)ne=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(q);else if(A.isLight)x.pushLight(A),A.castShadow&&x.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||W.intersectsSprite(A)){ie&&Ee.setFromMatrixPosition(A.matrixWorld).applyMatrix4(de);const Xe=xe.update(A),Je=A.material;Je.visible&&T.push(A,Xe,Je,ne,Ee.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||W.intersectsObject(A))){const Xe=xe.update(A),Je=A.material;if(ie&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ee.copy(A.boundingSphere.center)):(Xe.boundingSphere===null&&Xe.computeBoundingSphere(),Ee.copy(Xe.boundingSphere.center)),Ee.applyMatrix4(A.matrixWorld).applyMatrix4(de)),Array.isArray(Je)){const Ue=Xe.groups;for(let ut=0,it=Ue.length;ut<it;ut++){const ot=Ue[ut],At=Je[ot.materialIndex];At&&At.visible&&T.push(A,Xe,At,ne,Ee.z,ot)}}else Je.visible&&T.push(A,Xe,Je,ne,Ee.z,null)}}const Le=A.children;for(let Xe=0,Je=Le.length;Xe<Je;Xe++)on(Le[Xe],q,ne,ie)}function Oo(A,q,ne,ie){const ee=A.opaque,Le=A.transmissive,Xe=A.transparent;x.setupLightsView(ne),se===!0&&We.setGlobalState(P.clippingPlanes,ne),Le.length>0&&xr(ee,Le,q,ne),ie&&ze.viewport(b.copy(ie)),ee.length>0&&_i(ee,q,ne),Le.length>0&&_i(Le,q,ne),Xe.length>0&&_i(Xe,q,ne),ze.buffers.depth.setTest(!0),ze.buffers.depth.setMask(!0),ze.buffers.color.setMask(!0),ze.setPolygonOffset(!1)}function xr(A,q,ne,ie){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;const Le=$e.isWebGL2;Me===null&&(Me=new li(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")?Oi:gr,minFilter:bo,samples:Le?4:0})),P.getDrawingBufferSize(Se),Le?Me.setSize(Se.x,Se.y):Me.setSize(xl(Se.x),xl(Se.y));const Xe=P.getRenderTarget();P.setRenderTarget(Me),P.getClearColor(_e),k=P.getClearAlpha(),k<1&&P.setClearColor(16777215,.5),P.clear();const Je=P.toneMapping;P.toneMapping=mr,_i(A,ne,ie),C.updateMultisampleRenderTarget(Me),C.updateRenderTargetMipmap(Me);let Ue=!1;for(let ut=0,it=q.length;ut<it;ut++){const ot=q[ut],At=ot.object,hn=ot.geometry,kt=ot.material,yn=ot.group;if(kt.side===Ni&&At.layers.test(ie.layers)){const gt=kt.side;kt.side=Ln,kt.needsUpdate=!0,Sr(At,ne,ie,hn,kt,yn),kt.side=gt,kt.needsUpdate=!0,Ue=!0}}Ue===!0&&(C.updateMultisampleRenderTarget(Me),C.updateRenderTargetMipmap(Me)),P.setRenderTarget(Xe),P.setClearColor(_e,k),P.toneMapping=Je}function _i(A,q,ne){const ie=q.isScene===!0?q.overrideMaterial:null;for(let ee=0,Le=A.length;ee<Le;ee++){const Xe=A[ee],Je=Xe.object,Ue=Xe.geometry,ut=ie===null?Xe.material:ie,it=Xe.group;Je.layers.test(ne.layers)&&Sr(Je,q,ne,Ue,ut,it)}}function Sr(A,q,ne,ie,ee,Le){A.onBeforeRender(P,q,ne,ie,ee,Le),A.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),ee.onBeforeRender(P,q,ne,ie,A,Le),ee.transparent===!0&&ee.side===Ni&&ee.forceSinglePass===!1?(ee.side=Ln,ee.needsUpdate=!0,P.renderBufferDirect(ne,q,ie,ee,A,Le),ee.side=_r,ee.needsUpdate=!0,P.renderBufferDirect(ne,q,ie,ee,A,Le),ee.side=Ni):P.renderBufferDirect(ne,q,ie,ee,A,Le),A.onAfterRender(P,q,ne,ie,ee,Le)}function ki(A,q,ne){q.isScene!==!0&&(q=Ne);const ie=rt.get(A),ee=x.state.lights,Le=x.state.shadowsArray,Xe=ee.state.version,Je=Oe.getParameters(A,ee.state,Le,q,ne),Ue=Oe.getProgramCacheKey(Je);let ut=ie.programs;ie.environment=A.isMeshStandardMaterial?q.environment:null,ie.fog=q.fog,ie.envMap=(A.isMeshStandardMaterial?$:E).get(A.envMap||ie.environment),ut===void 0&&(A.addEventListener("dispose",Ce),ut=new Map,ie.programs=ut);let it=ut.get(Ue);if(it!==void 0){if(ie.currentProgram===it&&ie.lightsStateVersion===Xe)return zo(A,Je),it}else Je.uniforms=Oe.getUniforms(A),A.onBuild(ne,Je,P),A.onBeforeCompile(Je,P),it=Oe.acquireProgram(Je,Ue),ut.set(Ue,it),ie.uniforms=Je.uniforms;const ot=ie.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(ot.clippingPlanes=We.uniform),zo(A,Je),ie.needsLights=ko(A),ie.lightsStateVersion=Xe,ie.needsLights&&(ot.ambientLightColor.value=ee.state.ambient,ot.lightProbe.value=ee.state.probe,ot.directionalLights.value=ee.state.directional,ot.directionalLightShadows.value=ee.state.directionalShadow,ot.spotLights.value=ee.state.spot,ot.spotLightShadows.value=ee.state.spotShadow,ot.rectAreaLights.value=ee.state.rectArea,ot.ltc_1.value=ee.state.rectAreaLTC1,ot.ltc_2.value=ee.state.rectAreaLTC2,ot.pointLights.value=ee.state.point,ot.pointLightShadows.value=ee.state.pointShadow,ot.hemisphereLights.value=ee.state.hemi,ot.directionalShadowMap.value=ee.state.directionalShadowMap,ot.directionalShadowMatrix.value=ee.state.directionalShadowMatrix,ot.spotShadowMap.value=ee.state.spotShadowMap,ot.spotLightMatrix.value=ee.state.spotLightMatrix,ot.spotLightMap.value=ee.state.spotLightMap,ot.pointShadowMap.value=ee.state.pointShadowMap,ot.pointShadowMatrix.value=ee.state.pointShadowMatrix),ie.currentProgram=it,ie.uniformsList=null,it}function Bo(A){if(A.uniformsList===null){const q=A.currentProgram.getUniforms();A.uniformsList=hl.seqWithValue(q.seq,A.uniforms)}return A.uniformsList}function zo(A,q){const ne=rt.get(A);ne.outputColorSpace=q.outputColorSpace,ne.batching=q.batching,ne.instancing=q.instancing,ne.instancingColor=q.instancingColor,ne.skinning=q.skinning,ne.morphTargets=q.morphTargets,ne.morphNormals=q.morphNormals,ne.morphColors=q.morphColors,ne.morphTargetsCount=q.morphTargetsCount,ne.numClippingPlanes=q.numClippingPlanes,ne.numIntersection=q.numClipIntersection,ne.vertexAlphas=q.vertexAlphas,ne.vertexTangents=q.vertexTangents,ne.toneMapping=q.toneMapping}function Cl(A,q,ne,ie,ee){q.isScene!==!0&&(q=Ne),C.resetTextureUnits();const Le=q.fog,Xe=ie.isMeshStandardMaterial?q.environment:null,Je=I===null?P.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:zi,Ue=(ie.isMeshStandardMaterial?$:E).get(ie.envMap||Xe),ut=ie.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,it=!!ne.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),ot=!!ne.morphAttributes.position,At=!!ne.morphAttributes.normal,hn=!!ne.morphAttributes.color;let kt=mr;ie.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(kt=P.toneMapping);const yn=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,gt=yn!==void 0?yn.length:0,ft=rt.get(ie),pn=x.state.lights;if(se===!0&&(fe===!0||A!==R)){const Mn=A===R&&ie.id===ce;We.setState(ie,A,Mn)}let Dt=!1;ie.version===ft.__version?(ft.needsLights&&ft.lightsStateVersion!==pn.state.version||ft.outputColorSpace!==Je||ee.isBatchedMesh&&ft.batching===!1||!ee.isBatchedMesh&&ft.batching===!0||ee.isInstancedMesh&&ft.instancing===!1||!ee.isInstancedMesh&&ft.instancing===!0||ee.isSkinnedMesh&&ft.skinning===!1||!ee.isSkinnedMesh&&ft.skinning===!0||ee.isInstancedMesh&&ft.instancingColor===!0&&ee.instanceColor===null||ee.isInstancedMesh&&ft.instancingColor===!1&&ee.instanceColor!==null||ft.envMap!==Ue||ie.fog===!0&&ft.fog!==Le||ft.numClippingPlanes!==void 0&&(ft.numClippingPlanes!==We.numPlanes||ft.numIntersection!==We.numIntersection)||ft.vertexAlphas!==ut||ft.vertexTangents!==it||ft.morphTargets!==ot||ft.morphNormals!==At||ft.morphColors!==hn||ft.toneMapping!==kt||$e.isWebGL2===!0&&ft.morphTargetsCount!==gt)&&(Dt=!0):(Dt=!0,ft.__version=ie.version);let xi=ft.currentProgram;Dt===!0&&(xi=ki(ie,q,ee));let Ho=!1,ui=!1,Hi=!1;const Bt=xi.getUniforms(),zn=ft.uniforms;if(ze.useProgram(xi.program)&&(Ho=!0,ui=!0,Hi=!0),ie.id!==ce&&(ce=ie.id,ui=!0),Ho||R!==A){Bt.setValue(Z,"projectionMatrix",A.projectionMatrix),Bt.setValue(Z,"viewMatrix",A.matrixWorldInverse);const Mn=Bt.map.cameraPosition;Mn!==void 0&&Mn.setValue(Z,Ee.setFromMatrixPosition(A.matrixWorld)),$e.logarithmicDepthBuffer&&Bt.setValue(Z,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Bt.setValue(Z,"isOrthographic",A.isOrthographicCamera===!0),R!==A&&(R=A,ui=!0,Hi=!0)}if(ee.isSkinnedMesh){Bt.setOptional(Z,ee,"bindMatrix"),Bt.setOptional(Z,ee,"bindMatrixInverse");const Mn=ee.skeleton;Mn&&($e.floatVertexTextures?(Mn.boneTexture===null&&Mn.computeBoneTexture(),Bt.setValue(Z,"boneTexture",Mn.boneTexture,C)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}ee.isBatchedMesh&&(Bt.setOptional(Z,ee,"batchingTexture"),Bt.setValue(Z,"batchingTexture",ee._matricesTexture,C));const Vs=ne.morphAttributes;if((Vs.position!==void 0||Vs.normal!==void 0||Vs.color!==void 0&&$e.isWebGL2===!0)&&tt.update(ee,ne,xi),(ui||ft.receiveShadow!==ee.receiveShadow)&&(ft.receiveShadow=ee.receiveShadow,Bt.setValue(Z,"receiveShadow",ee.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(zn.envMap.value=Ue,zn.flipEnvMap.value=Ue.isCubeTexture&&Ue.isRenderTargetTexture===!1?-1:1),ui&&(Bt.setValue(Z,"toneMappingExposure",P.toneMappingExposure),ft.needsLights&&vi(zn,Hi),Le&&ie.fog===!0&&Re.refreshFogUniforms(zn,Le),Re.refreshMaterialUniforms(zn,ie,ae,re,Me),hl.upload(Z,Bo(ft),zn,C)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(hl.upload(Z,Bo(ft),zn,C),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Bt.setValue(Z,"center",ee.center),Bt.setValue(Z,"modelViewMatrix",ee.modelViewMatrix),Bt.setValue(Z,"normalMatrix",ee.normalMatrix),Bt.setValue(Z,"modelMatrix",ee.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const Mn=ie.uniformsGroups;for(let yr=0,Go=Mn.length;yr<Go;yr++)if($e.isWebGL2){const Xr=Mn[yr];st.update(Xr,xi),st.bind(Xr,xi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return xi}function vi(A,q){A.ambientLightColor.needsUpdate=q,A.lightProbe.needsUpdate=q,A.directionalLights.needsUpdate=q,A.directionalLightShadows.needsUpdate=q,A.pointLights.needsUpdate=q,A.pointLightShadows.needsUpdate=q,A.spotLights.needsUpdate=q,A.spotLightShadows.needsUpdate=q,A.rectAreaLights.needsUpdate=q,A.hemisphereLights.needsUpdate=q}function ko(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(A,q,ne){rt.get(A.texture).__webglTexture=q,rt.get(A.depthTexture).__webglTexture=ne;const ie=rt.get(A);ie.__hasExternalTextures=!0,ie.__hasExternalTextures&&(ie.__autoAllocateDepthBuffer=ne===void 0,ie.__autoAllocateDepthBuffer||Ve.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ie.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,q){const ne=rt.get(A);ne.__webglFramebuffer=q,ne.__useDefaultFramebuffer=q===void 0},this.setRenderTarget=function(A,q=0,ne=0){I=A,Y=q,O=ne;let ie=!0,ee=null,Le=!1,Xe=!1;if(A){const Ue=rt.get(A);Ue.__useDefaultFramebuffer!==void 0?(ze.bindFramebuffer(Z.FRAMEBUFFER,null),ie=!1):Ue.__webglFramebuffer===void 0?C.setupRenderTarget(A):Ue.__hasExternalTextures&&C.rebindTextures(A,rt.get(A.texture).__webglTexture,rt.get(A.depthTexture).__webglTexture);const ut=A.texture;(ut.isData3DTexture||ut.isDataArrayTexture||ut.isCompressedArrayTexture)&&(Xe=!0);const it=rt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(it[q])?ee=it[q][ne]:ee=it[q],Le=!0):$e.isWebGL2&&A.samples>0&&C.useMultisampledRTT(A)===!1?ee=rt.get(A).__webglMultisampledFramebuffer:Array.isArray(it)?ee=it[ne]:ee=it,b.copy(A.viewport),oe.copy(A.scissor),le=A.scissorTest}else b.copy(V).multiplyScalar(ae).floor(),oe.copy(L).multiplyScalar(ae).floor(),le=H;if(ze.bindFramebuffer(Z.FRAMEBUFFER,ee)&&$e.drawBuffers&&ie&&ze.drawBuffers(A,ee),ze.viewport(b),ze.scissor(oe),ze.setScissorTest(le),Le){const Ue=rt.get(A.texture);Z.framebufferTexture2D(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Z.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ue.__webglTexture,ne)}else if(Xe){const Ue=rt.get(A.texture),ut=q||0;Z.framebufferTextureLayer(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Ue.__webglTexture,ne||0,ut)}ce=-1},this.readRenderTargetPixels=function(A,q,ne,ie,ee,Le,Xe){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Je=rt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Xe!==void 0&&(Je=Je[Xe]),Je){ze.bindFramebuffer(Z.FRAMEBUFFER,Je);try{const Ue=A.texture,ut=Ue.format,it=Ue.type;if(ut!==ai&&Pe.convert(ut)!==Z.getParameter(Z.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const ot=it===Oi&&(Ve.has("EXT_color_buffer_half_float")||$e.isWebGL2&&Ve.has("EXT_color_buffer_float"));if(it!==gr&&Pe.convert(it)!==Z.getParameter(Z.IMPLEMENTATION_COLOR_READ_TYPE)&&!(it===pr&&($e.isWebGL2||Ve.has("OES_texture_float")||Ve.has("WEBGL_color_buffer_float")))&&!ot){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=A.width-ie&&ne>=0&&ne<=A.height-ee&&Z.readPixels(q,ne,ie,ee,Pe.convert(ut),Pe.convert(it),Le)}finally{const Ue=I!==null?rt.get(I).__webglFramebuffer:null;ze.bindFramebuffer(Z.FRAMEBUFFER,Ue)}}},this.copyFramebufferToTexture=function(A,q,ne=0){const ie=Math.pow(2,-ne),ee=Math.floor(q.image.width*ie),Le=Math.floor(q.image.height*ie);C.setTexture2D(q,0),Z.copyTexSubImage2D(Z.TEXTURE_2D,ne,0,0,A.x,A.y,ee,Le),ze.unbindTexture()},this.copyTextureToTexture=function(A,q,ne,ie=0){const ee=q.image.width,Le=q.image.height,Xe=Pe.convert(ne.format),Je=Pe.convert(ne.type);C.setTexture2D(ne,0),Z.pixelStorei(Z.UNPACK_FLIP_Y_WEBGL,ne.flipY),Z.pixelStorei(Z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ne.premultiplyAlpha),Z.pixelStorei(Z.UNPACK_ALIGNMENT,ne.unpackAlignment),q.isDataTexture?Z.texSubImage2D(Z.TEXTURE_2D,ie,A.x,A.y,ee,Le,Xe,Je,q.image.data):q.isCompressedTexture?Z.compressedTexSubImage2D(Z.TEXTURE_2D,ie,A.x,A.y,q.mipmaps[0].width,q.mipmaps[0].height,Xe,q.mipmaps[0].data):Z.texSubImage2D(Z.TEXTURE_2D,ie,A.x,A.y,Xe,Je,q.image),ie===0&&ne.generateMipmaps&&Z.generateMipmap(Z.TEXTURE_2D),ze.unbindTexture()},this.copyTextureToTexture3D=function(A,q,ne,ie,ee=0){if(P.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Le=A.max.x-A.min.x+1,Xe=A.max.y-A.min.y+1,Je=A.max.z-A.min.z+1,Ue=Pe.convert(ie.format),ut=Pe.convert(ie.type);let it;if(ie.isData3DTexture)C.setTexture3D(ie,0),it=Z.TEXTURE_3D;else if(ie.isDataArrayTexture||ie.isCompressedArrayTexture)C.setTexture2DArray(ie,0),it=Z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}Z.pixelStorei(Z.UNPACK_FLIP_Y_WEBGL,ie.flipY),Z.pixelStorei(Z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ie.premultiplyAlpha),Z.pixelStorei(Z.UNPACK_ALIGNMENT,ie.unpackAlignment);const ot=Z.getParameter(Z.UNPACK_ROW_LENGTH),At=Z.getParameter(Z.UNPACK_IMAGE_HEIGHT),hn=Z.getParameter(Z.UNPACK_SKIP_PIXELS),kt=Z.getParameter(Z.UNPACK_SKIP_ROWS),yn=Z.getParameter(Z.UNPACK_SKIP_IMAGES),gt=ne.isCompressedTexture?ne.mipmaps[ee]:ne.image;Z.pixelStorei(Z.UNPACK_ROW_LENGTH,gt.width),Z.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,gt.height),Z.pixelStorei(Z.UNPACK_SKIP_PIXELS,A.min.x),Z.pixelStorei(Z.UNPACK_SKIP_ROWS,A.min.y),Z.pixelStorei(Z.UNPACK_SKIP_IMAGES,A.min.z),ne.isDataTexture||ne.isData3DTexture?Z.texSubImage3D(it,ee,q.x,q.y,q.z,Le,Xe,Je,Ue,ut,gt.data):ne.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),Z.compressedTexSubImage3D(it,ee,q.x,q.y,q.z,Le,Xe,Je,Ue,gt.data)):Z.texSubImage3D(it,ee,q.x,q.y,q.z,Le,Xe,Je,Ue,ut,gt),Z.pixelStorei(Z.UNPACK_ROW_LENGTH,ot),Z.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,At),Z.pixelStorei(Z.UNPACK_SKIP_PIXELS,hn),Z.pixelStorei(Z.UNPACK_SKIP_ROWS,kt),Z.pixelStorei(Z.UNPACK_SKIP_IMAGES,yn),ee===0&&ie.generateMipmaps&&Z.generateMipmap(it),ze.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?C.setTextureCube(A,0):A.isData3DTexture?C.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?C.setTexture2DArray(A,0):C.setTexture2D(A,0),ze.unbindTexture()},this.resetState=function(){Y=0,O=0,I=null,ze.reset(),Ze.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ii}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===ef?"display-p3":"srgb",n.unpackColorSpace=wt.workingColorSpace===El?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===nn?Wr:gm}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Wr?nn:zi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class KM extends Om{}KM.prototype.isWebGL1Renderer=!0;class $M extends Bn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n}}class QM{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=rm(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=rm();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function rm(){return(typeof performance>"u"?Date:performance).now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zc);const Bm={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Fo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ZM=new sf(-1,1,1,-1,0,1);class JM extends vr{constructor(){super(),this.setAttribute("position",new Bi([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Bi([0,2,0,0,2,0],2))}}const eE=new JM;class zm{constructor(e){this._mesh=new mi(eE,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ZM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class $c extends Fo{constructor(e,n){super(),this.textureID=n!==void 0?n:"tDiffuse",e instanceof Pn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=yl.clone(e.uniforms),this.material=new Pn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new zm(this.material)}render(e,n,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class sm extends Fo{constructor(e,n){super(),this.scene=e,this.camera=n,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,n,s){const a=e.getContext(),u=e.state;u.buffers.color.setMask(!1),u.buffers.depth.setMask(!1),u.buffers.color.setLocked(!0),u.buffers.depth.setLocked(!0);let d,c;this.inverse?(d=0,c=1):(d=1,c=0),u.buffers.stencil.setTest(!0),u.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),u.buffers.stencil.setFunc(a.ALWAYS,d,4294967295),u.buffers.stencil.setClear(c),u.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),u.buffers.color.setLocked(!1),u.buffers.depth.setLocked(!1),u.buffers.color.setMask(!0),u.buffers.depth.setMask(!0),u.buffers.stencil.setLocked(!1),u.buffers.stencil.setFunc(a.EQUAL,1,4294967295),u.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),u.buffers.stencil.setLocked(!0)}}class tE extends Fo{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class nE{constructor(e,n){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),n===void 0){const s=e.getSize(new at);this._width=s.width,this._height=s.height,n=new li(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Oi}),n.texture.name="EffectComposer.rt1"}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $c(Bm),this.copyPass.material.blending=Fi,this.clock=new QM}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,n){this.passes.splice(n,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const n=this.passes.indexOf(e);n!==-1&&this.passes.splice(n,1)}isLastEnabledPass(e){for(let n=e+1;n<this.passes.length;n++)if(this.passes[n].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const n=this.renderer.getRenderTarget();let s=!1;for(let a=0,u=this.passes.length;a<u;a++){const d=this.passes[a];if(d.enabled!==!1){if(d.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),d.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),d.needsSwap){if(s){const c=this.renderer.getContext(),h=this.renderer.state.buffers.stencil;h.setFunc(c.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),h.setFunc(c.EQUAL,1,4294967295)}this.swapBuffers()}sm!==void 0&&(d instanceof sm?s=!0:d instanceof tE&&(s=!1))}}this.renderer.setRenderTarget(n)}reset(e){if(e===void 0){const n=this.renderer.getSize(new at);this._pixelRatio=this.renderer.getPixelRatio(),this._width=n.width,this._height=n.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,n){this._width=e,this._height=n;const s=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(s,a),this.renderTarget2.setSize(s,a);for(let u=0;u<this.passes.length;u++)this.passes[u].setSize(s,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class iE extends Fo{constructor(e,n,s=null,a=null,u=null){super(),this.scene=e,this.camera=n,this.overrideMaterial=s,this.clearColor=a,this.clearAlpha=u,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new _t}render(e,n,s){const a=e.autoClear;e.autoClear=!1;let u,d;this.overrideMaterial!==null&&(d=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),this.clearAlpha!==null&&(u=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(u),this.overrideMaterial!==null&&(this.scene.overrideMaterial=d),e.autoClear=a}}const rE={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new _t(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class zs extends Fo{constructor(e,n,s,a){super(),this.strength=n!==void 0?n:1,this.radius=s,this.threshold=a,this.resolution=e!==void 0?new at(e.x,e.y):new at(256,256),this.clearColor=new _t(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let u=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);this.renderTargetBright=new li(u,d,{type:Oi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let v=0;v<this.nMips;v++){const S=new li(u,d,{type:Oi});S.texture.name="UnrealBloomPass.h"+v,S.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(S);const M=new li(u,d,{type:Oi});M.texture.name="UnrealBloomPass.v"+v,M.texture.generateMipmaps=!1,this.renderTargetsVertical.push(M),u=Math.round(u/2),d=Math.round(d/2)}const c=rE;this.highPassUniforms=yl.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Pn({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];const h=[3,5,7,9,11];u=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);for(let v=0;v<this.nMips;v++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(h[v])),this.separableBlurMaterials[v].uniforms.invSize.value=new at(1/u,1/d),u=Math.round(u/2),d=Math.round(d/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1;const m=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=m,this.bloomTintColors=[new te(1,1,1),new te(1,1,1),new te(1,1,1),new te(1,1,1),new te(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const g=Bm;this.copyUniforms=yl.clone(g.uniforms),this.blendMaterial=new Pn({uniforms:this.copyUniforms,vertexShader:g.vertexShader,fragmentShader:g.fragmentShader,blending:kc,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new _t,this.oldClearAlpha=1,this.basic=new rf,this.fsQuad=new zm(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,n){let s=Math.round(e/2),a=Math.round(n/2);this.renderTargetBright.setSize(s,a);for(let u=0;u<this.nMips;u++)this.renderTargetsHorizontal[u].setSize(s,a),this.renderTargetsVertical[u].setSize(s,a),this.separableBlurMaterials[u].uniforms.invSize.value=new at(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2)}render(e,n,s,a,u){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const d=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),u&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=s.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let c=this.renderTargetBright;for(let h=0;h<this.nMips;h++)this.fsQuad.material=this.separableBlurMaterials[h],this.separableBlurMaterials[h].uniforms.colorTexture.value=c.texture,this.separableBlurMaterials[h].uniforms.direction.value=zs.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[h]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[h].uniforms.colorTexture.value=this.renderTargetsHorizontal[h].texture,this.separableBlurMaterials[h].uniforms.direction.value=zs.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[h]),e.clear(),this.fsQuad.render(e),c=this.renderTargetsVertical[h];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,u&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(s),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=d}getSeperableBlurMaterial(e){const n=[];for(let s=0;s<e;s++)n.push(.39894*Math.exp(-.5*s*s/(e*e))/e);return new Pn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new at(.5,.5)},direction:{value:new at(.5,.5)},gaussianCoefficients:{value:n}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new Pn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}zs.BlurDirectionX=new at(1,0);zs.BlurDirectionY=new at(0,1);const sE=({className:o,style:e,trailLength:n=50,inertia:s=.5,grainIntensity:a=.05,bloomStrength:u=.1,bloomRadius:d=1,bloomThreshold:c=.025,brightness:h=1,color:m="#B19EEF",mixBlendMode:g="screen",edgeIntensity:v=0,maxDevicePixelRatio:S=.5,targetPixels:M,fadeDelayMs:w,fadeDurationMs:T,zIndex:x=10})=>{const _=Ct.useRef(null),N=Ct.useRef(null),P=Ct.useRef(null),U=Ct.useRef(null),Y=Ct.useRef(null),O=Ct.useRef(null),I=Ct.useRef([]),ce=Ct.useRef(0),R=Ct.useRef(null),b=Ct.useRef(null),oe=Ct.useRef(new at(.5,.5)),le=Ct.useRef(new at(0,0)),_e=Ct.useRef(1),k=Ct.useRef(typeof performance<"u"?performance.now():Date.now()),Q=Ct.useRef(!1),re=Ct.useRef(!1),ae=Ct.useMemo(()=>typeof window<"u"&&("ontouchstart"in window||navigator.maxTouchPoints>0),[]),G=M??(ae?9e5:13e5),K=w??(ae?500:1e3),V=T??(ae?1e3:1500),L=`
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = vec4(position, 1.0);
}
`,H=`
uniform float iTime;
uniform vec3 iResolution;
uniform vec2 iMouse;
uniform vec2 iPrevMouse[MAX_TRAIL_LENGTH];
uniform float iOpacity;
uniform float iScale;
uniform vec3 iBaseColor;
uniform float iBrightness;
uniform float iEdgeIntensity;

varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }

float noise(vec2 p){
vec2 i = floor(p), f = fract(p);
f = f * f * (3. - 2. * f);
return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
}

float fbm(vec2 p){
float v = 0.0;
float a = 0.5;
mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
for(int i=0;i<5;i++){
v += a * noise(p);
p = m * p * 2.0;
a *= 0.5;
}
return v;
}

vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));
float smoke = fbm(p * iScale + r * 0.8);

float radius = 0.5 + 0.3 * (1.0 / iScale);
float distFactor = 1.0 - smoothstep(0.0, max(0.0001, radius * activity), length(p - mousePos));
float alpha = pow(smoke, 2.5) * distFactor;

vec3 c1 = tint1(iBaseColor);
vec3 c2 = tint2(iBaseColor);
vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

return vec4(color * alpha * intensity, alpha * intensity);
}

void main() {
vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

vec3 colorAcc = vec3(0.0);
float alphaAcc = 0.0;

vec4 b = blob(uv, mouse, 1.0, iOpacity);
colorAcc += b.rgb;
alphaAcc += b.a;

for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {
vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
float t = 1.0 - float(i) / float(MAX_TRAIL_LENGTH);
t = pow(t, 2.0);

if (t > 0.01) {
vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
colorAcc += bt.rgb;
alphaAcc += bt.a;
}
}

colorAcc *= iBrightness;

vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);
float k = clamp(iEdgeIntensity, 0.0, 1.0);
float edgeMask = mix(1.0 - k, 1.0, distFromEdge);

float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);
gl_FragColor = vec4(colorAcc, outAlpha);
}
`,W=Ct.useMemo(()=>({uniforms:{tDiffuse:{value:null},iTime:{value:0},intensity:{value:a}},vertexShader:`
varying vec2 vUv;
void main(){
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,fragmentShader:`
uniform sampler2D tDiffuse;
uniform float iTime;
uniform float intensity;
varying vec2 vUv;
float hash1(float n){ return fract(sin(n)*43758.5453); }
void main(){
vec4 color = texture2D(tDiffuse, vUv);
float n = hash1(vUv.x*1000.0 + vUv.y*2000.0 + iTime) * 2.0 - 1.0;
color.rgb += n * intensity * color.rgb;
gl_FragColor = color;
}
`}),[a]),se=Ct.useMemo(()=>new $c({uniforms:{tDiffuse:{value:null}},vertexShader:`
varying vec2 vUv;
void main(){
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,fragmentShader:`
uniform sampler2D tDiffuse;
varying vec2 vUv;
void main(){
vec4 c = texture2D(tDiffuse, vUv);
float a = max(c.a, 1e-5);
vec3 straight = c.rgb / a;
gl_FragColor = vec4(clamp(straight, 0.0, 1.0), c.a);
}
`}),[]);function fe(de){const Se=de.getBoundingClientRect(),Ee=600,Ne=Math.min(Math.max(1,Se.width),Math.max(1,Se.height));return Math.max(.5,Math.min(2,Ne/Ee))}Ct.useEffect(()=>{const de=_.current,Se=de==null?void 0:de.parentElement;if(!de||!Se)return;const Ee=new Om({antialias:!ae,alpha:!0,depth:!1,stencil:!1,powerPreference:"default",premultipliedAlpha:!1,preserveDrawingBuffer:!1});Ee.setClearColor(0,0),N.current=Ee,Ee.domElement.style.pointerEvents="none",g?Ee.domElement.style.mixBlendMode=String(g):Ee.domElement.style.removeProperty("mix-blend-mode"),Ee.domElement.style.display="block",Ee.domElement.style.width="100%",Ee.domElement.style.height="100%",Ee.domElement.style.background="transparent",de.appendChild(Ee.domElement);const Ne=new $M,ct=new sf(-1,1,1,-1,0,1),Z=new Al(2,2),Nt=Math.max(1,Math.floor(n));I.current=Array.from({length:Nt},()=>new at(.5,.5)),ce.current=0;const Ve=new _t(m),$e=new Pn({defines:{MAX_TRAIL_LENGTH:Nt},uniforms:{iTime:{value:0},iResolution:{value:new te(1,1,1)},iMouse:{value:new at(.5,.5)},iPrevMouse:{value:I.current.map(We=>We.clone())},iOpacity:{value:1},iScale:{value:1},iBaseColor:{value:new te(Ve.r,Ve.g,Ve.b)},iBrightness:{value:h},iEdgeIntensity:{value:v}},vertexShader:L,fragmentShader:H,transparent:!0,depthTest:!1,depthWrite:!1});U.current=$e;const ze=new mi(Z,$e);Ne.add(ze);const ht=new nE(Ee);P.current=ht;const rt=new iE(Ne,ct);ht.addPass(rt);const C=new zs(new at(1,1),u,d,c);Y.current=C,ht.addPass(C);const E=new $c(W);O.current=E,ht.addPass(E),ht.addPass(se);const $=()=>{var vt;const We=de.getBoundingClientRect(),ue=Math.max(1,Math.floor(We.width)),Qe=Math.max(1,Math.floor(We.height)),tt=Math.min(typeof window<"u"&&window.devicePixelRatio||1,S),Ye=ue*Qe*tt*tt,Ge=Ye<=G?1:Math.max(.5,Math.min(1,Math.sqrt(G/Math.max(1,Ye)))),Pe=tt*Ge;Ee.setPixelRatio(Pe),Ee.setSize(ue,Qe,!1),(vt=ht.setPixelRatio)==null||vt.call(ht,Pe),ht.setSize(ue,Qe);const Ze=Math.max(1,Math.floor(ue*Pe)),st=Math.max(1,Math.floor(Qe*Pe));$e.uniforms.iResolution.value.set(Ze,st,1),$e.uniforms.iScale.value=fe(de),C.setSize(Ze,st)};$();const ge=new ResizeObserver($);b.current=ge,ge.observe(de);const me=typeof performance<"u"?performance.now():Date.now(),xe=()=>{var Pe,Ze;const We=performance.now(),ue=(We-me)/1e3,Qe=U.current,tt=P.current;if(Q.current&&We-k.current<80)le.current.set(oe.current.x-Qe.uniforms.iMouse.value.x,oe.current.y-Qe.uniforms.iMouse.value.y),Qe.uniforms.iMouse.value.copy(oe.current),_e.current=1;else{le.current.multiplyScalar(s),le.current.lengthSq()>1e-6&&Qe.uniforms.iMouse.value.add(le.current);const st=We-k.current;if(st>K){const vt=Math.min(1,(st-K)/V);_e.current=Math.max(0,1-vt)}}const Ye=I.current.length;ce.current=(ce.current+1)%Ye,I.current[ce.current].copy(Qe.uniforms.iMouse.value);const Ge=Qe.uniforms.iPrevMouse.value;for(let st=0;st<Ye;st++){const vt=(ce.current-st+Ye)%Ye;Ge[st].copy(I.current[vt])}if(Qe.uniforms.iOpacity.value=_e.current,Qe.uniforms.iTime.value=ue,(Ze=(Pe=O.current)==null?void 0:Pe.uniforms)!=null&&Ze.iTime&&(O.current.uniforms.iTime.value=ue),tt.render(),_e.current<=.001){re.current=!1,R.current=null;return}R.current=requestAnimationFrame(xe)},Oe=()=>{re.current||(re.current=!0,R.current=requestAnimationFrame(xe))},Re=We=>{const ue=Se.getBoundingClientRect(),Qe=xp.clamp((We.clientX-ue.left)/Math.max(1,ue.width),0,1),tt=xp.clamp(1-(We.clientY-ue.top)/Math.max(1,ue.height),0,1);oe.current.set(Qe,tt),Q.current=!0,k.current=performance.now(),Oe()},De=()=>{Q.current=!0,Oe()},He=()=>{Q.current=!1,k.current=performance.now(),Oe()};return Se.addEventListener("pointermove",Re,{passive:!0}),Se.addEventListener("pointerenter",De,{passive:!0}),Se.addEventListener("pointerleave",He,{passive:!0}),Se.addEventListener("pointerup",He,{passive:!0}),Se.addEventListener("pointercancel",He,{passive:!0}),Oe(),()=>{var We;R.current&&cancelAnimationFrame(R.current),re.current=!1,R.current=null,Se.removeEventListener("pointermove",Re),Se.removeEventListener("pointerenter",De),Se.removeEventListener("pointerleave",He),Se.removeEventListener("pointerup",He),Se.removeEventListener("pointercancel",He),(We=b.current)==null||We.disconnect(),Ne.clear(),Z.dispose(),$e.dispose(),C.dispose(),E.dispose(),se.dispose(),ht.dispose(),Ee.dispose(),Ee.domElement&&Ee.domElement.parentElement&&Ee.domElement.parentElement.removeChild(Ee.domElement)}},[n,s,a,u,d,c,G,K,V,ae,m,h,g,v,S]),Ct.useEffect(()=>{if(U.current){const de=new _t(m);U.current.uniforms.iBaseColor.value.set(de.r,de.g,de.b)}},[m]),Ct.useEffect(()=>{U.current&&(U.current.uniforms.iBrightness.value=h)},[h]),Ct.useEffect(()=>{U.current&&(U.current.uniforms.iEdgeIntensity.value=v)},[v]),Ct.useEffect(()=>{var de,Se;(Se=(de=O.current)==null?void 0:de.uniforms)!=null&&Se.intensity&&(O.current.uniforms.intensity.value=a)},[a]),Ct.useEffect(()=>{var Se;const de=(Se=N.current)==null?void 0:Se.domElement;de&&(g?de.style.mixBlendMode=String(g):de.style.removeProperty("mix-blend-mode"))},[g]);const Me=Ct.useMemo(()=>({zIndex:x,mixBlendMode:g,...e}),[x,g,e]);return dr.jsx("div",{"aria-hidden":"true",ref:_,className:`pointer-events-none absolute inset-0 ${o??""}`,style:Me})},oE=()=>dr.jsxs("main",{style:{position:"relative",minHeight:"100vh",backgroundColor:"#111",color:"#fff",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",overflow:"hidden"},children:[dr.jsxs("div",{className:"z-20 text-center pointer-events-none select-none",children:[dr.jsx("h1",{className:"text-4xl md:text-6xl font-bold mb-4 tracking-tighter",children:"Ghost Cursor"}),dr.jsx("p",{className:"text-gray-400 text-lg",children:"Move your cursor to see the effect"})]}),dr.jsx(sE,{color:"#B19EEF",brightness:1.2,edgeIntensity:0,trailLength:20,inertia:.4,grainIntensity:.05,bloomStrength:.5,bloomRadius:.7,bloomThreshold:0,fadeDelayMs:200,fadeDurationMs:1e3}),dr.jsx("div",{className:"absolute inset-0 z-0 bg-gradient-to-tr from-purple-900/10 to-blue-900/10"})]});P_.createRoot(document.getElementById("root")).render(dr.jsx(oE,{}));
