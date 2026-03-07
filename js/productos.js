(function () {
  let productosCache = null;

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
        return `
                <article class="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6 
                shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-300 flex flex-col">

                    <img 
                        src="${producto.imagen}" 
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

    detail.innerHTML = `
            <div>
                <img 
                    src="${producto.imagen}" 
                    alt="${producto.nombre}"
                    class="w-full rounded-2xl border border-cyan-500/20"
                >
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
                        href="https://wa.me/549XXXXXXXXXX?text=Hola,%20consulto%20por%20${encodeURIComponent(producto.nombre)}"
                        target="_blank"
                        class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-black font-semibold inline-block"
                    >
                        Consultar por WhatsApp
                    </a>
                </div>

            </div>
        `;
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
})();
