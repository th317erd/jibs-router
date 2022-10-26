const { Component } = window[Symbol.for('@jibs')];

export default class Router extends Component {
  constructor(...args) {
    super(...args);

    window.addEventListener('popstate', this.onPopState);

    this.context.routes = {};
    this.context.router = this;
    this.context.router.navigate = this.navigate;

    this.renderMatchingRoute(this.getCurrentLocation());
  }

  destroy() {
    window.removeEventListener('popstate', this.onPopState);
    super.destroy();
  }

  onPopState() {
    this.renderMatchingRoute(this.getCurrentLocation());
  }

  matchesPath(location, pattern) {
    if (pattern instanceof RegExp)
      return location.pathname.match(pattern);
    else if (typeof pattern === 'function')
      return pattern.call(this, location);
    else
      throw new TypeError('"pattern" must be a regular expression (RegExp) instance, or a function.');
  }

  renderMatchingRoute(location) {
    let routes = this.props.routes || [];

    for (let route of routes) {
      let {
        pattern,
        render,
        route: routeName,
      } = route;

      let result = this.matchesPath(location, pattern);
      if (result) {
        let renderResult = render.call(this, result, location);
        if (renderResult === undefined)
          renderResult = null;

        if (routeName)
          this.context.routes = { ...(this.context.routes || {}), [routeName]: renderResult };
      }
    }
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
      href = `${window.location.origin}\/${href}`;

    href = href.replace(/\/{2,}/g, '/');

    let url     = new URL(href);
    let search  = url.searchParams.toString();
    let newURL  = `${url.pathname}${(search) ? `?${search}` : ''}${(url.hash) ? `#${url.hash}` : ''}`;
    let current = this.getLocationFromURL(href);

    window.history[(options.replace) ? 'replaceState' : 'pushState'](
      {
        previous: this.getCurrentLocation(),
        current,
      },
      '',
      newURL,
    );

    this.renderMatchingRoute(current);
  }

  render(children) {
    return children;
  }
}
