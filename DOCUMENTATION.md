# DOCUMENTACIÓN TÉCNICA PARA DESARROLLADORES (`DOCUMENTATION.md`)

Este documento describe la arquitectura de software, las fórmulas matemáticas de ingeniería, el modelo de datos y seguridad en Firebase, la distribución de carpetas dentro de `workspace/` y la estrategia de componentes, Custom Hooks y pruebas automatizadas del proyecto **COR Metalconf Cotizador**.

---

## 1. Stack Tecnológico y Convenciones de Código

- **Core**: React 19 + JavaScript ES Modules (`.js` / `.jsx`).
- **Bundler**: Vite 8 (con alias `@/` apuntando a `workspace/frontend/src/` configurado en `vite.config.js`, `vitest.config.js` y `jsconfig.json`).
- **Estilos y UI**: Tailwind CSS v4 (`@import "tailwindcss";` en `src/index.css`), primitivas accesibles de `@base-ui/react` / `shadcn/ui` y `lucide-react`.
- **Backend-as-a-Service (BaaS)**: Firebase v12 (`firebase/auth` para autenticación y `firebase/firestore` para persistencia en tiempo real).
- **Generación de Documentos**: `jspdf` v4 con dibujo vectorial nativo para esquemas técnicos de persianas.
- **Calidad y Testing**: Vitest v5 + React Testing Library + JSDOM + Oxlint.

### Estándares de Arquitectura y Clean Code
1. **Modularidad Estricta (SRP)**:
   - Ningún archivo de código fuente debe superar las **~100 líneas** y ninguna función o componente debe superar las **~40 líneas**. Cuando una vista crece, se descompone en subcomponentes de presentación y Custom Hooks de lógica.
2. **Estilo Declarativo**:
   - Los componentes de React se declaran con `export default function ComponentName()` (evitando funciones flecha anónimas asignadas a constantes) para mejorar la trazabilidad en React DevTools y facilitar su composición.
   - No se utilizan puntos y comas (`;`) al final de las sentencias (estándar ASI).
   - Código auto-documentado mediante nombres descriptivos en lugar de comentarios redundantes.

---

## 2. Distribución del Proyecto dentro de `workspace/`

Todo el código fuente, configuración de base de datos y pruebas de la aplicación vive dentro de `workspace/frontend/`:

```text
workspace/
├── reports/
│   └── reporte_sintesis.md                 # Reportes técnicos de validación y compilación
└── frontend/
    ├── .env.example                        # Plantilla de variables de entorno VITE_FIREBASE_*
    ├── .firebaserc                         # Proyecto de Firebase vinculado (persianas-25c73)
    ├── firebase.json                       # Configuración de despliegue de reglas de Firestore
    ├── firestore.rules                     # Reglas de seguridad server-side (RBAC y lista blanca)
    ├── jsconfig.json                       # Mapeo de rutas @/* -> ./src/*
    ├── package.json                        # Scripts y dependencias del frontend
    ├── vite.config.js                      # Configuración de Vite 8 + React + Tailwind v4
    ├── vitest.config.js                    # Configuración del runner de pruebas con JSDOM
    ├── scripts/
    │   └── seed-firestore.mjs              # Script CLI para poblar catálogos iniciales en Firestore
    └── src/
        ├── App.jsx                         # Guardián raíz de sesión, splash y autorización RBAC
        ├── main.jsx                        # Punto de montaje de React envuelto en <AuthProvider>
        ├── index.css                       # Directivas globales y tokens de Tailwind CSS v4
        ├── components/ui/                  # Primitivas atómicas de interfaz (shadcn / Base UI)
        │   ├── button.jsx
        │   ├── card.jsx
        │   ├── checkbox.jsx
        │   ├── dialog.jsx
        │   ├── input.jsx
        │   ├── label.jsx
        │   ├── select.jsx
        │   ├── table.jsx
        │   └── tabs.jsx
        ├── lib/                            # Inicialización de infraestructura y utilidades base
        │   ├── firebaseConfig.js           # Validación estricta de variables VITE_FIREBASE_*
        │   ├── firebase.js                 # Instancias singleton: firebaseApp, auth y db
        │   └── utils.js                    # Helper cn() (clsx + tailwind-merge)
        ├── features/                       # Módulos de dominio orientados a negocio
        │   ├── auth/                       # Autenticación, lista blanca, roles y sesión
        │   ├── admin/                      # ABM/CRUD de catálogos maestros y gestión de usuarios
        │   └── estimator/                  # Motor de cálculo, cotizador multi-cortina y SVG 2D
        ├── shared/                         # Módulos transversales compartidos entre features
        │   ├── components/                 # Layout autenticado, Header, Splash, AccessoryPicker
        │   ├── providers/                  # Context Providers globales (AuthContext, BudgetContext)
        │   └── utils/                      # Motor de exportación PDF (interno/cliente) y seedData
        └── test/
            └── setup.js                    # Configuración global de @testing-library/jest-dom
```

---

## 3. Distribución de Componentes, Custom Hooks y Providers (HOCs / Context)

La aplicación separa estrictamente **Estado Global (Providers)**, **Lógica de Dominio (Custom Hooks)**, **Servicios de Infraestructura** y **Componentes de Presentación**.

### 3.1. Providers y Composición de Alto Nivel (`src/shared/providers/` y `src/App.jsx`)

En lugar de utilizar Higher-Order Components (HOCs) clásicos basados en clases, la aplicación implementa el patrón de **Provider Composition + Route/View Guards**:

| Módulo | Ubicación | Responsabilidad Técnica |
| :--- | :--- | :--- |
| `AuthProvider` / `useAuth()` | `src/shared/providers/AuthContext.jsx` | Escucha `onAuthStateChanged` de Firebase Auth y se suscribe en tiempo real al documento del usuario en la colección `usuarios` de Firestore. Calcula y expone: `user`, `userProfile`, `role` (`"master"` \| `"empleado"` \| `null`), `isMaster`, `isEmpleado`, `isBlocked`, `isAuthorized`, `loading`, `authError`, `login(email, pass)` y `logout()`. |
| `BudgetProvider` / `useBudget()` | `src/shared/providers/BudgetContext.jsx` | Compone `useMasterData()` y `useBudgetHistory()` en un único contexto. Solo se monta **después** de que `App.jsx` confirma `isAuthorized === true`, garantizando que ningún usuario no autorizado o bloqueado inicie suscripciones a Firestore. |
| `App` (Auth Guard) | `src/App.jsx` | Orquesta la máquina de estados de acceso: `loading` → `<LoginPage />` (si `!user`) → `<SplashScreen />` → `<UnauthorizedScreen />` (si `!isAuthorized` o `isBlocked`) → `<AuthenticatedApp />` (si está autorizado). |
| `AuthenticatedApp` (Role Guard) | `src/shared/components/AuthenticatedApp.jsx` | Envuelve la sesión en `<BudgetProvider>`. Si `isMaster === true`, habilita la navegación por pestañas entre *Cotizador Cliente* (`<EstimatorPage />`) y *Configuración de elementos* (`<ConfigCrud />`). Si el usuario es `empleado`, oculta la configuración y renderiza únicamente `<EstimatorPage />`. |

---

### 3.2. Custom Hooks (`src/features/**/hooks/`)

Toda la lógica de estado, sincronización con Firestore y cálculos matemáticos reside en hooks especializados:

| Custom Hook | Ubicación | Entradas / Salidas y Responsabilidad |
| :--- | :--- | :--- |
| `useLoginForm(onAuthenticated)` | `src/features/auth/hooks/useLoginForm.js` | Controla el estado del formulario de inicio de sesión (`email`, `password`, `formError`, `isSubmitting`), valida campos obligatorios, ejecuta `login()` y traduce errores de Firebase mediante `getAuthErrorMessage`. |
| `useMasterData()` | `src/features/admin/hooks/useMasterData.js` | Abre suscripciones `onSnapshot` a las 7 colecciones maestras (`lamas`, `ejes`, `guias`, `cajones`, `motores`, `accesorios`, `margins`). Si `app_config/initial_data` no existe, ejecuta la carga inicial (`seedFirestore`). Expone `createItem(col, item)`, `updateItem(col, id, changes)` y `deleteItem(col, id)`. |
| `useCrud(collectionName)` | `src/features/admin/hooks/useCrud.js` | Adaptador sobre `useBudget()` que valida que `collectionName` pertenezca a `MASTER_COLLECTION_NAMES` y devuelve `{ items, loading, error, createItem, updateItem, deleteItem }` acotados a esa colección. |
| `useCreateElement({ collectionKey, existingItems, onCreate, onOpenChange })` | `src/features/admin/hooks/useCreateElement.js` | Gestiona el estado del diálogo de alta de cualquier catálogo utilizando los esquemas declarativos de `createElementSchema.js`. Previene códigos/IDs duplicados, normaliza tipos numéricos/booleanos y maneja errores asíncronos sin perder los datos ingresados. |
| `useCurtainManager()` | `src/features/estimator/hooks/useCurtainManager.js` | Administra el arreglo de cortinas del presupuesto (`budgetItems`) y la pestaña activa (`activeItemId`). Permite agregar diseños (`C1`, `C2`...), eliminar paños, limpiar el presupuesto, filtrar accesorios al cambiar de lama y evaluar `isGasketRequiredButMissing`. |
| `useCurtainSync(activeItem, setBudgetItems, catalogs)` | `src/features/estimator/hooks/useCurtainSync.js` | Sincroniza la cortina activa cuando terminan de cargarse o editarse los catálogos maestros de Firestore y recalcula automáticamente `item.calcs` invocando `useShutterCalculations`. |
| `useShutterCalculations(params)` | `src/features/estimator/hooks/useShutterCalculations.js` | Hook memoizado (`useMemo`) que ejecuta todas las ecuaciones geométricas y de costos de una cortina. Devuelve `{ wFinal, hFinal, slatsQty, guideLen, slatsCost, guidesCost, ejeCost, cajonCost, motorCost, accsCost, total }`. |
| `useBudgetSummary(params)` | `src/features/estimator/hooks/useBudgetSummary.js` | Calcula el `grandTotal` aplicando `marginFactor * item.qty` sobre todas las cortinas, resuelve el nombre de la tarifa activa y ejecuta el guardado del presupuesto en Firestore si no está bloqueado por falta de burlete. |
| `useBudgetHistory()` | `src/features/estimator/hooks/useBudgetHistory.js` | Suscribe en tiempo real a la colección `budget_history` ordenando por `createdAt` descendente y expone `{ history, historyLoading, historyError, saveBudget, deleteBudget }`. |

---

### 3.3. Componentes por Dominio

#### A. Autenticación (`src/features/auth/`)
- **`components/LoginPage.jsx`**: Pantalla de inicio de sesión corporativa sin opción de auto-registro, con leyenda de soporte dirigida a **Grupo Gonzalez**.
- **`components/UnauthorizedScreen.jsx`**: Pantalla de bloqueo cuando un usuario autenticado no figura en la colección `usuarios` o tiene `blocked: true`.
- **`services/userService.js`**: Capa de acceso a datos para la colección `usuarios`. Incluye:
  - `subscribeToUserProfile(user, onProfile, onError)`: Busca el documento del usuario en `usuarios/{uid}` y, como fallback, en `usuarios/{emailNormalizado}`. Nunca auto-crea documentos para usuarios desconocidos.
  - `subscribeToAllUsers(onUsers, onError)`: Stream en tiempo real de todos los usuarios para el panel Master.
  - `authorizeUserEmail({ email, password, displayName, role })`: Da de alta un nuevo usuario en Firebase Auth y Firestore.
  - `updateUserRole(userId, newRole)` y `setUserBlockedStatus(userId, blocked)`: Mutaciones de rol y estado de bloqueo.
- **`services/secondaryAuthProvision.js`**: Crea una instancia secundaria efímera de Firebase App (`initializeApp` + `deleteApp`) para que un usuario `master` pueda ejecutar `createUserWithEmailAndPassword` al dar de alta un nuevo correo sin reemplazar ni cerrar su propia sesión activa.

#### B. Administración de Datos Maestros (`src/features/admin/components/`)
- **`ConfigCrud.jsx`**: Contenedor de pestañas para las 7 tablas de catálogo (`LamaCrudTable`, `EjeCrudTable`, `GuiaCrudTable`, `CajonCrudTable`, `MotorCrudTable`, `AccesorioCrudTable`, `MargenCrudTable`) y la pestaña `Usuarios DB` (`UserRoleTable`).
- **`CreateElementDialog.jsx` + `CreateElementFields.jsx` + `createElementSchema.js`**: Sistema polimórfico de creación de registros con validación de esquema para los 7 catálogos.
- **`EditElementModal.jsx`**: Modal de edición en línea de registros existentes.
- **`MotorCompatibilityModal.jsx` + `AccessoryChecklist.jsx`**: Configuración de la lista de códigos de accesorios (`compatibleAccessories`) permitidos por cada motor.
- **`UserRoleTable.jsx` + `AuthorizeUserForm.jsx` + `UserRoleRow.jsx`**: Panel de gestión de usuarios (alta con contraseña inicial, cambio de rol `Master` ⇄ `Empleado` y botón `Bloquear` / `Desbloquear` con protección anti auto-bloqueo).

#### C. Cotizador e Ingeniería (`src/features/estimator/components/`)
- **`EstimatorPage.jsx`**: Layout principal de 3 columnas que conecta `useCurtainManager` con los editores, el visualizador y el resumen.
- **`CurtainTabs.jsx`**: Barra de navegación entre cortinas del mismo presupuesto (`C1`, `C2`...) con botones para agregar diseño o reiniciar presupuesto.
- **`CurtainEditorCard.jsx` + `EstimatorInputs.jsx` + `EstimatorOptions.jsx` + `VueloOptions.jsx` + `OptionSelect.jsx`**: Controles de entrada de medidas, selección de materiales, configuración de vuelo y selector múltiple de accesorios (`AccessoryPicker.jsx`).
- **`ShutterVisualizer.jsx`**: Renderizador SVG 2D interactivo que dibuja a escala el marco, guías, lamas según el porcentaje de apertura, cajón/eje y motor.
- **`CurtainBreakdown.jsx`**: Tabla detallada de medidas finales y costos parciales por cortina.
- **`EstimatorSummary.jsx` + `MarginSelector.jsx` + `BudgetTotals.jsx` + `PdfButtons.jsx`**: Selección de tarifa comercial, alerta de bloqueo por burlete faltante, total general, guardado y botones de descarga PDF.
- **`HistoryList.jsx`**: Historial de presupuestos guardados en Firestore con reimpresión de **PDF Interno** y **PDF Cliente** y eliminación.

#### D. Motor de Generación PDF (`src/shared/utils/`)
- **`pdfGenerator.js`**: Punto de entrada `generatePDF(budget, audience)` donde `audience` es `"internal"` o `"client"`. Calcula paginación automática para no cortar ninguna cortina entre dos páginas.
- **`pdf/drawBudgetPdfHeader.js`**: Dibuja el encabezado corporativo; oculta el nombre y porcentaje de la tarifa cuando `audience === "client"`.
- **`pdf/getPdfItemLines.js`**: Construye las líneas descriptivas de cada cortina. En modo `"internal"` detalla costos base por componente y porcentaje de recargo; en modo `"client"` muestra solo especificaciones técnicas y el subtotal final de venta.
- **`drawPdfShutterDiagram.js`**: Dibuja vectorialmente en el documento PDF el esquema de cada cortina cerrada con sus cotas en metros.

---

## 4. Fórmulas Matemáticas del Motor de Cálculo (`useShutterCalculations.js`)

Dado un ancho inicial $W_i$ (en metros) y un alto inicial $H_i$ (en metros):

1. **Ancho Final ($W_f$)**:
   $$W_f = W_i + 2 \cdot W_g$$
   Donde $W_g$ es el ancho de perfil de la guía seleccionada (`selectedGuide.profileWidth`) si `hasGuides === true`, o $0$ en caso contrario.

2. **Alto Final ($H_f$)**:
   $$H_f = H_i + H_v$$
   Donde $H_v = 0.40\text{ m}$ si la cortina incluye vuelo (`hasVuelo === true`) y el usuario marca sumar la medida de vuelo (`addVueloMeasure === true`), o $0\text{ m}$ en caso contrario.

3. **Cantidad de Lamas ($N_l$)**:
   $$N_l = \left\lceil \frac{H_f}{H_u} \right\rceil$$
   Donde $H_u$ es la altura útil en metros de la lama seleccionada (`selectedLama.usefulHeight`, con fallback a $0.05\text{ m}$).

4. **Largo Total de Guías ($L_g$)**:
   $$L_g = \begin{cases} 2 \cdot H_f & \text{si } \text{hasGuides} = \text{true} \\ 0 & \text{si } \text{hasGuides} = \text{false} \end{cases}$$

5. **Costos por Componente (en USD)**:
   - **Costo de Lamas ($C_l$)**: $C_l = N_l \cdot W_f \cdot P_{\text{lama}}$
   - **Costo de Guías ($C_g$)**: $C_g = L_g \cdot P_{\text{guia}}$ (si `hasGuides === true`, sino $0$)
   - **Costo de Eje ($C_e$)**: $C_e = P_{\text{eje}}$ (si `hasVuelo === true`, sino $0$)
   - **Costo de Cajón ($C_c$)**: $C_c = P_{\text{cajon}}$ (si `hasVuelo === true`, sino $0$)
   - **Costo de Motor ($C_m$)**: $C_m = P_{\text{motor}}$
   - **Costo de Accesorios ($C_a$)**: $C_a = \sum P_{\text{accesorio}}$

6. **Costo Base de Cortina ($T_{\text{base}}$) y Total con Margen ($T_{\text{venta}}$)**:
   $$T_{\text{base}} = C_l + C_g + C_e + C_c + C_m + C_a$$
   $$T_{\text{venta}} = T_{\text{base}} \cdot \left(1 + \frac{M_{\%}}{100}\right) \cdot Q$$
   Donde $M_{\%}$ es el porcentaje de margen/tarifa seleccionado y $Q$ la cantidad de cortinas iguales (`item.qty`).

### Regla de Validación de Burlete (`initialCurtain.js`)
Si la lama seleccionada tiene `allowsGasket === true` (o código `L3`), la función `hasMissingGasket(item)` verifica que dentro de `item.selectedAccs` exista al menos un accesorio con categoría `"burlete"` o código que comience con `"BUR"`. Si falta en cualquiera de las cortinas del presupuesto, `isGasketRequiredButMissing` pasa a `true` y bloquea el guardado del presupuesto mostrando una alerta preventiva.

---

## 5. Arquitectura de Firebase y Reglas de Seguridad (`firestore.rules`)

### Colecciones en Cloud Firestore
- **`usuarios/{uid_o_email}`**: Padrón de cuentas autorizadas. Campos:
  - `id` / `uid`: string (UID de Firebase Auth o email normalizado en minúsculas)
  - `email`: string (en minúsculas)
  - `displayName`: string
  - `role`: `"master"` | `"empleado"`
  - `blocked`: boolean (`false` = habilitado, `true` = bloqueado)
  - `createdAt`, `updatedAt`: ISO timestamp
- **Catálogos Maestros** (ID de documento = `code`, excepto en `margins` que usa `id`):
  - `lamas`, `ejes`, `guias`, `cajones`, `motores`, `accesorios`, `margins`.
- **`app_config/initial_data`**: Bandera booleana (`seeded: true`) que evita re-ejecutar el seed inicial cuando la base de datos ya fue poblada.
- **`budget_history/{budgetId}`**: Presupuestos guardados con `client`, `items`, `marginName`, `marginFactor`, `grandTotal`, `date` y `createdAt`.

### Reglas de Seguridad Server-Side (`workspace/frontend/firestore.rules`)
Las reglas de Firestore implementan dos funciones centrales en el servidor:
- `hasActiveProfile()`: Verifica que el usuario esté autenticado (`request.auth != null`), que exista su documento en `usuarios/$(request.auth.uid)` o en `usuarios/$(request.auth.token.email.lower())`, que su campo `blocked` sea distinto de `true` y que su `role` sea `'master'` o `'empleado'`.
- `isMaster()`: Verifica `hasActiveProfile() && role == 'master'`.

**Matriz de Permisos en Firestore**:
- **Catálogos (`lamas`, `ejes`, `guias`, `cajones`, `motores`, `accesorios`, `margins`, `app_config`)**:
  - `read`: Requiere `hasActiveProfile()` (`master` o `empleado` habilitado).
  - `write`: Requiere exclusivamente `isMaster()`.
- **`budget_history`**:
  - `read, write`: Requiere `hasActiveProfile()`.
- **`usuarios`**:
  - `get`: Permitido al propio usuario sobre su documento o a cualquier `isMaster()`.
  - `list, create, update, delete`: Requiere exclusivamente `isMaster()`.

---

## 6. Arquitectura de Pruebas Automatizadas (Vitest)

Las pruebas unitarias y de integración están co-localizadas junto a cada módulo dentro de carpetas `__tests__/` para facilitar su mantenimiento y ejecución continua.

### Ubicación y Cobertura de las 23 Suites de Tests (75 pruebas)

1. **Autenticación y Control de Acceso (`src/features/auth/`)**:
   - `__tests__/AuthContext.test.jsx`: Verifica login, denegación de acceso a cuentas no registradas en `usuarios`, bloqueo instantáneo cuando `blocked === true` y cierre de sesión.
   - `services/__tests__/userService.test.js`: Verifica normalización de emails, ausencia de auto-creación de perfiles, cambio de rol, bloqueo/desbloqueo y alta de usuarios con `secondaryAuthProvision`.
   - `components/__tests__/LoginPage.test.jsx`: Comprueba el formulario único de login, ausencia de botón de registro, mensaje de **Grupo Gonzalez** y traducción de errores.
   - `__tests__/getAuthErrorMessage.test.js`: Mapeo de códigos `auth/*` a mensajes en español.
2. **Guardia de Roles y Componentes Compartidos (`src/shared/components/__tests__/`)**:
   - `AuthenticatedApp.test.jsx`: Verifica que el rol `empleado` vea únicamente el cotizador y que el rol `master` vea además la pestaña *Configuración de elementos*.
   - `AppHeader.test.jsx`: Renderizado de usuario activo, badge de rol y botón de cierre de sesión.
   - `AccessoryPicker.test.jsx`: Búsqueda por nombre/código/categoría y selección múltiple de accesorios.
   - `SplashScreen.test.jsx`: Renderizado y temporizador de transición.
3. **Panel Administrativo y CRUD (`src/features/admin/components/__tests__/`)**:
   - `ConfigCrud.test.jsx`: Renderizado condicional de pestañas según permisos `isMaster`.
   - `UserRoleTable.test.jsx`: Cambio de rol, bloqueo de usuarios, protección del usuario propio `(Tú)` y formulario de alta con contraseña inicial.
   - `CreateElementDialog.test.jsx`: Pruebas de creación para las 7 colecciones del catálogo y bloqueo de códigos duplicados.
   - `EditElementModal.test.jsx`: Edición y guardado de ítems existentes.
   - `MotorCompatibilityModal.test.jsx`: Asignación de accesorios compatibles a un motor.
4. **Motor de Cálculo y Cotizador (`src/features/estimator/`)**:
   - `hooks/__tests__/useShutterCalculations.test.js`: Verificación matemática de medidas finales, cantidad de lamas y costos.
   - `hooks/__tests__/gasketValidation.test.js`: Reglas de obligatoriedad de burlete (`BUR`).
   - `hooks/__tests__/useBudgetHistory.test.js`: Guardado y eliminación de presupuestos.
   - `__tests__/businessRules.test.jsx`: Pruebas integrales de reglas de negocio del cotizador.
   - `components/__tests__/EstimatorOptions.test.jsx`: Descarte automático de accesorios incompatibles al cambiar de motor.
   - `components/__tests__/EstimatorSummary.test.jsx`: Bloqueo de guardado ante falta de burlete.
   - `components/__tests__/PdfButtons.test.jsx`: Disparo de exportación para ambas variantes de PDF.
5. **Generación de PDF (`src/shared/utils/`)**:
   - `__tests__/pdfGenerator.test.js`, `pdf/__tests__/getPdfItemLines.test.js` y `pdf/__tests__/writePdfLines.test.js`: Verifican que el PDF Interno incluya costos y recargos, que el PDF Cliente los oculte conservando el mismo precio final y que el salto de página funcione correctamente.
