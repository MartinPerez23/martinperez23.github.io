// productos.js: logica para renderizar lista y detalle de productos desde JSON.
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

        console.warn("No se pudo cargar data/productos.json");
        return [];
    }

    // Renderiza las tarjetas en pages/productos.html.
    async function renderProductos() {
        const grid = document.getElementById("productos-grid");
        if (!grid) {
            return;
        }

        const productos = await getProductos();

        grid.innerHTML = productos.map((producto) => {
            return `
                <article class="producto-card">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    <div class="producto-card-body">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <button class="btn" onclick="loadProducto('${producto.id}')">Ver producto</button>
                    </div>
                </article>
            `;
        }).join("");
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
            detail.innerHTML = "<p>No se encontro el producto solicitado.</p>";
            return;
        }

        detail.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div>
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion_larga}</p>
                <span class="chip">Categoria: ${producto.categoria}</span>
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
