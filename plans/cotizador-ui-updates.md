# Mejoras del cotizador

Solicitud de ejecución: actualizar main, mejorar accesorios y alineación, crear elementos mediante Dialog, quitar acceso demo y separar PDF interno/cliente.

1. Selector compartido con búsqueda por nombre/código/categoría, selección múltiple y compatibilidad del motor. Conservar validación BUR.
2. Campos de cajón/eje con labels asociados y controles de igual altura.
3. Diálogo reutilizable de creación para los siete catálogos, validación y errores persistentes sin cerrar el formulario.
4. Quitar credenciales demo de la interfaz y mantener autenticación real.
5. Dos exportaciones PDF en resumen e historial. Cliente: importes finales sin costos internos ni márgenes. Interno: desglose base y recargos.
6. Tests de interacción, build, lint y revisión visual local sin modificar Firebase de producción.
