var t={d:(e,r)=>{for(var o in r)t.o(r,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:r[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};if(t.d(e,{Z:()=>Router}),!window[Symbol.for("@jibs")])throw new TypeError("Expected \"window[Symbol.for('@jibs')]\" to be jibs library.");const{Component:r}=window[Symbol.for("@jibs")];class Router extends r{constructor(...t){super(...t),window.addEventListener("popstate",this.onPopState),this.context.routes={},this.context.router=this,this.context.router.navigate=this.navigate,this.renderMatchingRoute(this.getCurrentLocation())}destroy(){window.removeEventListener("popstate",this.onPopState),super.destroy()}onPopState(){this.renderMatchingRoute(this.getCurrentLocation())}matchesPath(t,e){if(e instanceof RegExp)return t.pathname.match(e);if("function"==typeof e)return e.call(this,t);throw new TypeError('"pattern" must be a regular expression (RegExp) instance, or a function.')}renderMatchingRoute(t){let e=this.props.routes||[];for(let r of e){let{pattern:e,render:o,route:n}=r,a=this.matchesPath(t,e);if(a){let e=o.call(this,a,t);void 0===e&&(e=null),n&&(this.context.routes={...this.context.routes||{},[n]:e})}}}getLocationFromURL(t){let e=new URL(t),r={};for(let[t,o]of e.searchParams)r[t]=o;return{hash:e.hash,host:e.host,hostname:e.hostname,href:e.href,origin:e.origin,password:e.password,pathname:e.pathname,port:e.port,protocol:e.protocol,search:e.search,searchParams:r,username:e.username}}getCurrentLocation(){return this.getLocationFromURL(window.location.href)}navigate(t,e){if(!t)return;let r=e||{},o=t.toString();/^[\w-]+:/.test(o)||(o=`${window.location.origin}/${o}`),o=o.replace(/\/{2,}/g,"/");let n=new URL(o),a=n.searchParams.toString(),s=`${n.pathname}${a?`?${a}`:""}${n.hash?`#${n.hash}`:""}`,i=this.getLocationFromURL(o);!1!==r.history&&window.history[r.replace?"replaceState":"pushState"]({previous:this.getCurrentLocation(),current:i},"",s),this.renderMatchingRoute(i)}render(t){return t}}var o=e.Z;export{o as default};
//# sourceMappingURL=index.js.map