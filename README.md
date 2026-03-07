# martinperez23.github.io

Esta es una SPA estática diseñada para funcionar en GitHub Pages o cualquier servidor HTTP. **No se recomienda abrir
los archivos directamente con `file://`**, ya que las llamadas `fetch()` usadas para cargar los "partials" y las páginas
pueden fallar y dejar la pantalla en blanco.

Para probar localmente, ejecuta un servidor simple, por ejemplo:

```bash
cd path/to/martinperez23.github.io
# con python 3
python -m http.server 8000
# o con node.js
npx serve .
```

Luego visita `http://localhost:8000` en tu navegador.

Si aun así algo no carga, el código ahora incluye manejadores de errores que muestran mensajes de
fallback en lugar de dejar la aplicación en blanco.
