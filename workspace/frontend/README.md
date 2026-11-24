# COR Metalconf — Cotizador Técnico y Comercial de Cortinas Metálicas

**COR Metalconf Cotizador** es una aplicación web diseñada para presupuestar cortinas y persianas metálicas a medida en tiempo real. Permite configurar múltiples paños/diseños dentro de un mismo presupuesto, visualizar un esquema técnico 2D interactivo, aplicar reglas de ingeniería (compatibilidad de motores, ejes, vuelos y obligatoriedad de burletes) y exportar presupuestos diferenciados en PDF tanto para uso interno como para el cliente final.

---

## Ventajas Principales

- **Cotización Multi-Cortina en Tiempo Real**: Permite agregar, editar y comparar varias cortinas (`C1`, `C2`, `C3`...) dentro de un mismo presupuesto, recalculando instantáneamente dimensiones finales, cantidad de tablillas/lamas, metros lineales de guías y costos totales.
- **Validación Automática de Reglas de Negocio**:
  - Filtra automáticamente los accesorios compatibles según el motor seleccionado.
  - Detecta si la lama elegida requiere burlete (`BUR`) y bloquea el guardado o exportación hasta seleccionar un burlete compatible, evitando errores de presupuestación en taller.
  - Calcula automáticamente el suplemento de vuelo (`+0.40 m` opcionales al alto final) y habilita el costo de cajón y eje según corresponda.
- **Visualizador Técnico 2D Interactivo**: Representación vectorial en vivo de la cortina con control deslizable de apertura (`0%` a `100%`), reflejando la proporción ancho/alto, presencia de guías laterales, cajón superior/eje y motorización.
- **Doble Formato de Exportación PDF**:
  - **PDF Interno**: Incluye el desglose técnico completo, costos unitarios por componente, tarifa/recargo aplicado y diagrama vectorial de cada cortina.
  - **PDF Cliente**: Presenta el detalle técnico, cantidades, diagrama a escala y precios finales de venta ocultando los costos base, márgenes internos y recargos comerciales.
- **Catálogo y Historial Sincronizados en la Nube**: Todos los precios de materiales, tarifas y presupuestos guardados se sincronizan en tiempo real con Firebase Firestore.
- **Acceso Blindado por Lista Blanca y Roles (RBAC)**: Sin registro público abierto. Solo pueden ingresar usuarios expresamente dados de alta y habilitados por un administrador.

---

## Roles de Usuario y Qué Puede Hacer Cada Uno

El sistema cuenta con autenticación cerrada y dos niveles de permisos administrados en tiempo real:

### 1. Usuario `Empleado` (Perfil Comercial / Ventas)
Orientado al equipo de atención y presupuestación diaria. Al iniciar sesión accede directamente al **Cotizador Cliente** (la pestaña de *Configuración de elementos* permanece oculta).

**¿Qué puede hacer?**
- Configurar presupuestos con una o múltiples cortinas indicando ancho, alto y cantidad de unidades.
- Elegir tipo de lama, guías laterales, sistema de vuelo (eje y cajón), motor y accesorios compatibles.
- Seleccionar la tarifa comercial aplicable (*Gremio*, *Público*, *Mayorista*, etc. o un porcentaje *Personalizado*).
- Guardar presupuestos con referencia de cliente en el **Historial de Presupuestos** compartido.
- Descargar o reimprimir en cualquier momento el **PDF Cliente** y el **PDF Interno** tanto del presupuesto actual como del historial.

### 2. Usuario `Master` (Perfil Administrador / Ingeniería)
Posee todas las funciones del **Cotizador Cliente** más acceso exclusivo a la pestaña **Configuración de elementos (Panel Administrativo de Datos Maestros)**.

**¿Qué puede hacer además de cotizar?**
- **Administrar el Catálogo Técnico (ABM / CRUD en tiempo real)**:
  - **Lamas**: Crear, editar o eliminar tipos de tablillas, su altura útil (`m`), precio por metro lineal (`USD`) y si admiten/requieren burlete.
  - **Ejes, Guías y Cajones**: Administrar códigos, nombres, anchos de perfil y precios en `USD`.
  - **Motores y Compatibilidades**: Gestionar motores, precios y configurar mediante un matriz interactiva qué accesorios son compatibles con cada motor.
  - **Accesorios**: Dar de alta accesorios generales y burletes (`BUR`) con categoría, unidad de medida y precio.
  - **Márgenes / Tarifas**: Configurar los porcentajes de recargo comercial predeterminados.
- **Gestionar Usuarios y Accesos (`Usuarios DB`)**:
  - **Crear y habilitar nuevos usuarios**: Dar de alta un correo con su contraseña inicial, nombre y rol (`Empleado` o `Master`) directamente desde la aplicación.
  - **Cambiar roles**: Ascender un `Empleado` a `Master` o viceversa en un clic.
  - **Bloquear / Desbloquear cuentas**: Suspender o reactivar el acceso de cualquier usuario de forma inmediata.

---

## Cómo se Usa la Aplicación (Flujo del Usuario)

1. **Inicio de Sesión**:
   - Ingresá con tu correo y contraseña asignados.
   - Si tu cuenta no está habilitada o tenés inconvenientes para autenticarte, la pantalla indicará comunicarte con **Grupo Gonzalez** para consultas.
2. **Armado de Cortinas en el Cotizador**:
   - En la barra superior de diseños (`C1`, `+ Agregar Diseño`), seleccioná la cortina activa o sumá nuevos paños al presupuesto.
   - Completá **Nombre / Referencia de la cortina**, **Cantidad**, **Ancho inicial (`m`)** y **Alto inicial (`m`)**.
   - Seleccioná la **Lama / Tablilla** y activá o desactivá **Incluir Guías** (eligiendo el perfil de guía) e **Incluir Vuelo** (eligiendo Eje, Cajón y si deseás sumar los `+0.40 m` de vuelo al alto final).
   - Elegí el **Motor** y abrí el selector de **Accesorios** (podés buscar por nombre, código o categoría). Si la lama requiere burlete, el sistema te indicará seleccionar uno compatible.
3. **Revisión Visual y Tarifa**:
   - En la columna derecha, probá la apertura en el **Visualizador 2D** y revisá en **Desglose de Cortinas** las medidas finales calculadas y el costo por componente.
   - En **Resumen del Presupuesto**, seleccioná la **Tarifa / Margen** a aplicar e ingresá el nombre o referencia del **Cliente**.
4. **Guardado y Descarga de PDF**:
   - Hacé clic en **PDF Interno** o **PDF Cliente** para descargar el documento al instante, o presioná **Guardar Presupuesto** para almacenarlo en el historial inferior.

---

## Instalación y Ejecución Local

### Requisitos
- **Node.js** `>= 22.x` (o `>= 24.x`) y **npm**.
- Proyecto de **Firebase** con *Authentication (Email/Password)* y *Cloud Firestore* habilitados.

### Variables de Entorno
Copiá el archivo `.env.example` a `.env` dentro de `workspace/frontend/` con las credenciales de tu proyecto Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Comandos Disponibles (en `workspace/frontend/`)

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con HMR (http://localhost:5173)
npm run dev

# Ejecutar la suite completa de tests unitarios y de integración (Vitest)
npm test

# Ejecutar linter de código (Oxlint)
npm run lint

# Compilar bundle optimizado para producción en dist/
npm run build

# Previsualizar el build de producción localmente
npm run preview
```
