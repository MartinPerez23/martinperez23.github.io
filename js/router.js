// router.js: router SPA basico para cargar paginas en #app sin recargar.
(function () {
  // Mapa de paginas permitidas para evitar rutas arbitrarias.
  const validPages = new Set(["principal", "productos", "producto"]);

  // Arma rutas con fallback absoluta/relativa para GitHub Pages.
  function pageRoutes(pageName) {
    return [`/pages/${pageName}.html`, `./pages/${pageName}.html`];
  }

  // Lee HTML de pagina probando rutas alternativas.
  async function fetchPageHtml(pageName) {
    const routes = pageRoutes(pageName);
    // agregar variantes basadas en el prefijo de ruta de GitHub Pages
    const base = location.pathname.replace(/\/[^\/]*$/, "");
    if (base && base !== "/") {
      routes.forEach((r) => {
        const trimmed = r.replace(/^\//, "");
        routes.push(base + "/" + trimmed);
      });
    }

    for (const route of routes) {
      try {
        const response = await fetch(route);
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {}
    }

    console.warn("No se pudo cargar la pagina: " + pageName);
    return "<div class='container'><p>Error cargando la pagina.</p></div>";
  }

  // Actualiza estado visual del menu.
  function syncActiveLink(pageName) {
    document.querySelectorAll("#spa-header [data-route]").forEach((link) => {
      if (link.getAttribute("data-route") === pageName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Hook post-render por pagina para cargar data dinamica.
  async function runPageLogic(pageName, params) {
    if (
      pageName === "productos" &&
      typeof window.renderProductos === "function"
    ) {
      await window.renderProductos();
      return;
    }

    if (
      pageName === "producto" &&
      typeof window.renderProducto === "function"
    ) {
      const productId = params && params.id ? params.id : null;
      await window.renderProducto(productId);
      return;
    }

    // Scroll opcional para secciones internas de principal (ejemplo: contacto).
    if (pageName === "principal" && params && params.section) {
      const section = document.getElementById(params.section);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Carga dinamica de paginas dentro de #app.
  async function loadPage(pageName, params = {}, options = {}) {
    const { pushState = true } = options;

    if (!validPages.has(pageName)) {
      pageName = "principal";
    }

    const app = document.getElementById("app");
    if (!app) {
      return;
    }

    try {
      const html = await fetchPageHtml(pageName);
      app.innerHTML = html;
      syncActiveLink(pageName);
      await runPageLogic(pageName, params);

      if (pushState) {
        const state = { page: pageName, params: params };
        const hash = pageName === "principal" ? "#principal" : `#${pageName}`;
        history.pushState(state, "", hash);
      }
      if (pageName === "productos") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      app.innerHTML =
        "<div class='container'><p>Error cargando la pagina.</p></div>";
      console.error(error);
    }
  }

  // Intercepta clicks dentro del header para no recargar (ademas del onclick).
  function bindHeaderInterception() {
    const header = document.getElementById("spa-header");
    if (!header) {
      return;
    }

    header.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-route]");
      if (!link) {
        return;
      }

      event.preventDefault();
      const route = link.getAttribute("data-route");
      loadPage(route);
    });
  }

  // Maneja historial del navegador.
  function bindPopState() {
    window.addEventListener("popstate", (event) => {
      const state = event.state;
      if (state && state.page) {
        loadPage(state.page, state.params || {}, { pushState: false });
      } else {
        loadPage("principal", {}, { pushState: false });
      }
    });
  }

  // Inicializacion del router al cargar script.
  async function initRouter() {
    bindHeaderInterception();
    bindPopState();
    await loadPage("principal", {}, { pushState: false });
  }

  // API global requerida por la consigna.
  window.loadPage = loadPage;
  window.initRouter = initRouter;
  initRouter();
})();
