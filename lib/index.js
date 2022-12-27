if (!window[Symbol.for('@jibs')])
  throw new TypeError('Expected "window[Symbol.for(\'@jibs\')]" to be jibs library.');

const { Component } = window[Symbol.for('@jibs')];

export default class Router extends Component {
  constructor(...args) {
    super(...args);

    window.addEventListener('popstate', this.onPopState);

    this.context.routes = {};
    this.context.router = this;
    this.context.router.navigate = this.navigate;

    this.renderMatchingRoutes(this.getCurrentLocation());
  }

  destroy() {
    window.removeEventListener('popstate', this.onPopState);
    super.destroy();
  }

  onPopState() {
    this.renderMatchingRoutes(this.getCurrentLocation());
  }

  matchesPath(location, pattern) {
    if (pattern instanceof RegExp)
      return location.pathname.match(pattern);
    else if (typeof pattern === 'function')
      return pattern.call(this, location);
    else
      throw new TypeError('"pattern" must be a regular expression (RegExp) instance, or a function.');
  }

  renderMatchingRoutes(location) {
    let routes    = this.props.routes || [];
    let hasMatch  = false;

    for (let route of routes) {
      let {
        pattern,
        render,
        route: routeName,
      } = route;

      let result = this.matchesPath(location, pattern);
      if (result) {
        hasMatch = true;

        let renderResult = render.call(this, result, { ...location, navigate: this.navigate.bind(this) });
        if (renderResult === undefined)
          renderResult = null;

        if (routeName)
          this.context.routes = { ...(this.context.routes || {}), [routeName]: renderResult };
      }
    }

    this.context.routeInfo = location;

    return hasMatch;
  }

  getLocationFromURL(_url) {
    let url           = new URL(_url);
    let searchParams  = {};

    for (let [ key, value ] of url.searchParams)
      searchParams[key] = value;

    var location = {
      hash:         url.hash,
      host:         url.host,
      hostname:     url.hostname,
      href:         url.href,
      origin:       url.origin,
      password:     url.password,
      pathname:     url.pathname,
      port:         url.port,
      protocol:     url.protocol,
      search:       url.search,
      searchParams: searchParams,
      username:     url.username,
    };

    return location;
  }

  getCurrentLocation() {
    return this.getLocationFromURL(window.location.href);
  }

  navigate(_href, _options) {
    if (!_href)
      return;

    let options = _options || {};
    let href    = _href.toString();
    if (!(/^[\w-]+:/).test(href))
      href = `${window.location.origin}/${href}`;

    href = href.replace(/\/{2,}/g, '/');

    let url     = new URL(href);
    let search  = url.searchParams.toString();
    let newURL  = `${url.pathname}${(search) ? `?${search}` : ''}${(url.hash) ? `#${url.hash}` : ''}`;
    let current = this.getLocationFromURL(href);

    if (options.history !== false) {
      window.history[(options.history === 'replace') ? 'replaceState' : 'pushState'](
        {
          previous: this.getCurrentLocation(),
          current,
        },
        '',
        newURL,
      );
    }

    if (options.passive !== true)
      this.renderMatchingRoutes(current);
  }

  render(children) {
    return children;
  }
}
