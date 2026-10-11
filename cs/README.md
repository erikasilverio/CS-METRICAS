# Cartera de Erika · Customer Success

Panel para acompañar la cartera de clientes: semáforo de salud, chance de baja, renovaciones, tareas del mes e indicadores de CS. Funciona en el navegador, sin servidor. Las cuentas se guardan en el navegador y se pueden importar o exportar en CSV.

## Archivos
- `index.html`: estructura de la página
- `styles.css`: estilos y animaciones
- `app.js`: datos de ejemplo (`SEED`), cálculo del Health Score (`calc`), indicadores (`inds`), gráficos, tabla, importación y exportación

## Indicadores
| Indicador | Qué mide |
|---|---|
| NPS | Promotores (9-10) menos detractores (0-6), en %. Mide lealtad. |
| CSAT | Satisfacción media, de 1 a 5. |
| GRR | Retención bruta de ingresos, sin contar expansión. |
| NRR | Retención neta de ingresos, con expansión. Sobre 100% la cartera crece sola. |
| Churn de logos | % de cuentas dadas de baja sobre el total. |
| Retención de logos | % de cuentas que siguen activas. |
| MRR perdido por bajas | % del MRR inicial perdido por cuentas que se fueron. |
| Expansión / Contracción MRR | Ingreso ganado por upsell y perdido por downgrades. |
| Tiempo al primer valor | Días de onboarding hasta el primer resultado. |
| Adopción | % de funcionalidades clave en uso. |
| Health Score | Uso 25%, Adopción 20%, NPS 15%, Tickets 15%, Último contacto 10%, Pagos 10%, Champion 5%. |
| Chance de baja | (100 - Health) x 0,9, +8 si renueva en 60 días o menos, +6 si hay mora de más de 30 días. |

## Cómo abrirlo
Abrí `index.html` en el navegador, o en Visual Studio Code con la extensión Live Server (`Open with Live Server`). También sirve `abrir-en-vscode.bat` (Windows) o `abrir-en-vscode.sh` (Mac/Linux).

## Publicar en GitHub Pages
Subí `index.html`, `styles.css` y `app.js` a la raíz de un repositorio público y activá **Settings > Pages** con la rama `main` y la carpeta `/ (root)`.
