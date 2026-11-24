# Informe de síntesis — Blindaje de Autenticación, Lista Blanca y RBAC

Estado: EXITOSO

## Base y alcance

Rama creada: `pablo/auth-whitelist-rbac` desde `main`.
Plan ejecutado: `plans/2026-11-24_10-38-00_auth-whitelist-y-bloqueo-rbac.json` (estado: `aprobado`).

Se eliminó el registro público de cuentas, el auto-aprovisionamiento de perfiles como `empleado` y la asignación por defecto del rol `master` a `admin@propulsa.com` y `demo@persianas.com`. Se implementó el control de acceso basado en cuentas existentes y habilitadas en la colección `usuarios`, la gestión de bloqueo/desbloqueo y roles por parte de usuarios `master`, la leyenda de soporte con **Grupo Gonzalez**, el ocultamiento de la pestaña *Configuración de elementos* a los empleados y la validación server-side en `firestore.rules`.

## Validación Ejecutada

- `npm --prefix workspace/frontend run test -- --maxWorkers=2`: **23 archivos de prueba aprobados (75 tests pasados, 0 fallidos)**.
- `npm --prefix workspace/frontend run build`: **Compilación de producción exitosa (`dist/` generado en 1.60s, 0 errores)**.
- `npm --prefix workspace/frontend run lint`: **0 errores** (6 advertencias previas de Fast Refresh/effects en componentes existentes).
- `git diff --check`: **Aprobado sin errores de formato**.

## Archivos modificados

| Archivo | Cambio |
| --- | --- |
| [userService.js](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/services/userService.js) | Eliminados `DEFAULT_MASTER_EMAILS`, `getInitialRoleForEmail` y `seedInitialAdminUsers`. `subscribeToUserProfile` ya no crea documentos automáticamente si el usuario no existe en `usuarios`. Añadidas `authorizeUserEmail` y `setUserBlockedStatus`. |
| [AuthContext.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/shared/providers/AuthContext.jsx) | Eliminado `register` (`createUserWithEmailAndPassword`) y el fallback de rol por email. Expone `isBlocked` e `isAuthorized` verificando que el perfil exista en `usuarios`, no esté bloqueado y tenga rol `master` o `empleado`. |
| [getAuthErrorMessage.js](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/utils/getAuthErrorMessage.js) | Agregadas traducciones para `auth/user-disabled` (indicando contacto con Grupo Gonzalez) y `auth/too-many-requests`. |
| [useLoginForm.js](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/hooks/useLoginForm.js) | Eliminado `isRegistering` y `toggleMode`; el formulario ejecuta exclusivamente `login`. |
| [LoginPage.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/components/LoginPage.jsx) | Eliminado el botón "Crear una cuenta" y añadida la leyenda de contacto con **Grupo Gonzalez** para consultas o problemas de autenticación. |
| [UnauthorizedScreen.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/components/UnauthorizedScreen.jsx) | Nueva pantalla de Acceso Restringido para cuentas no dadas de alta en `usuarios` o con `blocked: true`, con leyenda de contacto a **Grupo Gonzalez** y cierre de sesión. |
| [App.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/App.jsx) | Bloquea el montaje de `AuthenticatedApp` cuando `!isAuthorized`, redirigiendo a `UnauthorizedScreen`. |
| [AuthenticatedApp.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/shared/components/AuthenticatedApp.jsx) | Oculta el selector de pestañas y `ConfigCrud` (*Configuración de elementos*) a los usuarios con rol `empleado`, mostrando únicamente el *Cotizador Cliente*. |
| [AuthorizeUserForm.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/admin/components/AuthorizeUserForm.jsx) | Formulario modular en *Usuarios DB* para que un `master` habilite nuevos correos con nombre y rol inicial (`empleado` o `master`). |
| [UserRoleRow.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/admin/components/UserRoleRow.jsx) | Fila modular de la tabla de usuarios con badge de estado (`Habilitado` / `Bloqueado`), cambio de rol y botón `Bloquear` / `Desbloquear` (protegido contra auto-bloqueo). |
| [UserRoleTable.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/admin/components/UserRoleTable.jsx) | Integra `AuthorizeUserForm` y `UserRoleRow` con soporte para alternar rol y estado de bloqueo. |
| [firestore.rules](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/firestore.rules) | Reglas de seguridad que exigen perfil activo (`blocked != true` y `role in ['master', 'empleado']`) para lectura de catálogo y uso de `budget_history`, y reservan toda escritura de catálogo y gestión de `usuarios` exclusivamente a `isMaster()`. |
| [userService.test.js](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/services/__tests__/userService.test.js) | Pruebas unitarias de no auto-registro, normalización, bloqueo y pre-autorización de correos. |
| [AuthContext.test.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/__tests__/AuthContext.test.jsx) | Pruebas de autorización, rechazo de usuarios no registrados en `usuarios` y bloqueo en tiempo real. |
| [LoginPage.test.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/components/__tests__/LoginPage.test.jsx) | Verifica ausencia de botón de registro y presencia del mensaje de **Grupo Gonzalez**. |
| [getAuthErrorMessage.test.js](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/auth/__tests__/getAuthErrorMessage.test.js) | Incluye validación de mensaje para `auth/user-disabled`. |
| [UserRoleTable.test.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/features/admin/components/__tests__/UserRoleTable.test.jsx) | Verifica cambio de rol, bloqueo de usuario y formulario de alta de correo autorizado. |
| [AuthenticatedApp.test.jsx](file:///c:/Users/pablo/Desktop/consultora/cotizador-cortinas/workspace/frontend/src/shared/components/__tests__/AuthenticatedApp.test.jsx) | Verifica que el empleado solo vea el cotizador y el Master vea ambas pestañas. |
