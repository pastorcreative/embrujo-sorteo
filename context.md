# App de Sorteos Express - Especificaciones Técnicas

## Stack
- React + Vite + TypeScript.
- Tailwind CSS (Estilos atómicos).
- Framer Motion (Animaciones de core).

## Arquitectura de Estado (Context API)
- `SorteoContext`: Debe manejar un array de `nombres`, un `nombreProhibido` (opcional), el `ganador` actual y el estado `isSpinning`.
- **Lógica de Selección:** Al ejecutar el sorteo, el `ganador` se elige de un array filtrado: `nombres.filter(n => n !== nombreProhibido)`.
- **Lógica Visual:** La animación debe usar el array `nombres` completo para que el "prohibido" sea visto pasando por la pantalla.

## Requerimientos de UI/Componentes
1. **Input Section:** Campo para añadir nombres y un toggle/indicador para marcar un nombre como "prohibido" discretamente.
2. **Main Stage:** Área central donde los nombres rotan verticalmente usando `AnimatePresence` de Framer Motion.
3. **Control:** Botón "¡Sortear!" que activa la animación y tras 3 segundos revela el resultado.
4. **Result Modal:** Un overlay con confeti (si es posible) o una animación de escala para el ganador.

## Instrucciones para Generación de Código
- Usa `export const` para componentes.
- Implementa un hook personalizado `useSorteo`.
- La animación de la lista debe usar un bucle infinito visual mientras `isSpinning` sea true.
- Asegura que el despliegue en Netlify sea compatible (rutas relativas, etc.).