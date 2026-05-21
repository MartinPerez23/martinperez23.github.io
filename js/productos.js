(function () {
  let productosCache = null;
  let carruselProducto = {
    imagenes: [],
    indice: 0,
  };

  function getImagenes(producto) {
    if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
      return producto.imagenes;
    }

    if (producto.imagen) {
      return [producto.imagen];
    }

    return [];
  }

  function getImagenPrincipal(producto) {
    const imagenes = getImagenes(producto);
    return imagenes[0] || "";
  }

  // Obtiene y cachea el JSON de productos para evitar fetch repetidos.
  async function getProductos() {
    if (productosCache) {
      return productosCache;
    }

    const routes = ["/data/productos.json", "./data/productos.json"];
    const base = location.pathname.replace(/\/[^\/]*$/, "");
    if (base && base !== "/") {
      routes.push(base + "/data/productos.json");
    }

    for (const route of routes) {
      try {
        const response = await fetch(route);
        if (response.ok) {
          productosCache = await response.json();
          return productosCache;
        }
      } catch (error) {
        // Intenta la siguiente ruta.
      }
    }

    console.warn("No se pudo cargar los productos");
    return [];
  }

  // Renderiza las tarjetas en pages/productos.html.
  async function renderProductos() {
    const grid = document.getElementById("productos-grid");
    if (!grid) {
      return;
    }

    const productos = await getProductos();

    grid.innerHTML = productos
      .map((producto) => {
        const imagenPrincipal = getImagenPrincipal(producto);

        return `
                <article class="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6 
                shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-300 flex flex-col">

                    <img 
                        src="${imagenPrincipal}" 
                        alt="${producto.nombre}" 
                        loading="lazy"
                        class="w-full h-48 object-contain mb-6"
                    >

                    <div class="flex flex-col flex-grow">

                        <h3 class="text-xl font-semibold mb-2">
                            ${producto.nombre}
                        </h3>

                        <p class="text-gray-400 mb-6 flex-grow">
                            ${producto.descripcion}
                        </p>

                        <button 
                            class="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-black font-semibold hover:opacity-90 transition"
                            onclick="loadProducto('${producto.id}')"
                        >
                            Ver producto
                        </button>

                    </div>

                </article>
            `;
      })
      .join("");
  }

  // Renderiza el detalle en pages/producto.html usando id.
  async function renderProducto(idProducto) {
    const detail = document.getElementById("producto-detalle");
    if (!detail) {
      return;
    }

    const productos = await getProductos();
    const producto = productos.find((item) => item.id === idProducto);

    if (!producto) {
      detail.innerHTML = `
                <p class="text-red-400 text-center">
                    No se encontró el producto solicitado.
                </p>
            `;
      return;
    }

    const imagenes = getImagenes(producto);
    const tieneVariasImagenes = imagenes.length > 1;

    carruselProducto = {
      imagenes: imagenes,
      indice: 0,
    };

    detail.innerHTML = `
            <div class="producto-carrusel">
                <img 
                    id="producto-imagen-principal"
                    src="${imagenes[0] || ""}" 
                    alt="${producto.nombre}"
                    class="w-full h-80 object-contain rounded-2xl border border-cyan-500/20 bg-[#0f172a]"
                >

                ${tieneVariasImagenes ? renderControlesCarrusel(producto, imagenes) : ""}
            </div>

            <div>

                <h3 class="text-3xl font-bold mb-4">
                    ${producto.nombre}
                </h3>

                <p class="text-gray-400 mb-6">
                    ${producto.descripcion_larga}
                </p>

                <span class="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm mb-6">
                    Categoría: ${producto.categoria}
                </span>

                <div>
                    <a
                        href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hola,%20consulto%20por%20${encodeURIComponent(producto.nombre)}"
                        target="_blank"
                        class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-black font-semibold inline-block"
                    >
                        Consultar por WhatsApp
                    </a>
                </div>

            </div>
        `;
  }

  function renderControlesCarrusel(producto, imagenes) {
    return `
        <div class="flex items-center justify-center gap-4 mt-4">
            <button
                type="button"
                aria-label="Imagen anterior"
                class="w-10 h-10 rounded-full border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black transition"
                onclick="cambiarImagenProducto(-1)"
            >
                &lsaquo;
            </button>

            <div id="producto-indicadores" class="flex items-center gap-2">
                ${imagenes
                  .map(
                    (_, index) => `
                        <button
                            type="button"
                            aria-label="Ver imagen ${index + 1}"
                            class="w-2 h-2 rounded-full transition ${
                              index === 0 ? "bg-cyan-neon" : "bg-cyan-500/20"
                            }"
                            onclick="seleccionarImagenProducto(${index})"
                        ></button>
                    `
                  )
                  .join("")}
            </div>

            <button
                type="button"
                aria-label="Imagen siguiente"
                class="w-10 h-10 rounded-full border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black transition"
                onclick="cambiarImagenProducto(1)"
            >
                &rsaquo;
            </button>
        </div>

        <div id="producto-miniaturas" class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
            ${imagenes
              .map(
                (imagen, index) => `
                    <button
                        type="button"
                        class="h-20 rounded-xl border ${
                          index === 0 ? "border-cyan-400" : "border-cyan-500/20"
                        } bg-[#0f172a] p-2 transition hover:border-cyan-neon/60"
                        onclick="seleccionarImagenProducto(${index})"
                    >
                        <img
                            src="${imagen}"
                            alt="${producto.nombre} ${index + 1}"
                            class="w-full h-full object-contain"
                            loading="lazy"
                        >
                    </button>
                `
              )
              .join("")}
        </div>
    `;
  }

  function actualizarCarruselProducto() {
    const imagen = document.getElementById("producto-imagen-principal");
    if (!imagen || carruselProducto.imagenes.length === 0) {
      return;
    }

    imagen.src = carruselProducto.imagenes[carruselProducto.indice];

    document
      .querySelectorAll("#producto-indicadores button")
      .forEach((button, index) => {
        button.classList.toggle("bg-cyan-neon", index === carruselProducto.indice);
        button.classList.toggle("bg-cyan-500/20", index !== carruselProducto.indice);
      });

    document
      .querySelectorAll("#producto-miniaturas button")
      .forEach((button, index) => {
        button.classList.toggle("border-cyan-400", index === carruselProducto.indice);
        button.classList.toggle(
          "border-cyan-500/20",
          index !== carruselProducto.indice
        );
      });
  }

  function cambiarImagenProducto(direccion) {
    const total = carruselProducto.imagenes.length;
    if (total < 2) {
      return;
    }

    carruselProducto.indice =
      (carruselProducto.indice + direccion + total) % total;
    actualizarCarruselProducto();
  }

  function seleccionarImagenProducto(indice) {
    if (indice < 0 || indice >= carruselProducto.imagenes.length) {
      return;
    }

    carruselProducto.indice = indice;
    actualizarCarruselProducto();
  }

  // Navega al detalle usando el router global.
  function loadProducto(idProducto) {
    if (typeof window.loadPage === "function") {
      window.loadPage("producto", { id: idProducto });
    }
  }

  // Exponer funciones globales para que router.js y el HTML las usen.
  window.renderProductos = renderProductos;
  window.renderProducto = renderProducto;
  window.loadProducto = loadProducto;
  window.cambiarImagenProducto = cambiarImagenProducto;
  window.seleccionarImagenProducto = seleccionarImagenProducto;
})();
