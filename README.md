# Cupping Pass Digital

Crea una aplicación web moderna para cafeterías de especialidad llamada "CuppingPass". 

Estética minimalista nórdica de especialidad: fondo beige/lino cálido (#F4F3EE), superficies blancas limpias, bordes sutiles y acento terracota (#B34B2E).

La app debe tener 2 vistas principales y conexión con Supabase:

1. Vista Cliente (/registro):

- Formulario de alta rápida con estética editorial:

  * Nombre y apellidos

  * Teléfono móvil

  * ¿Qué sueles pedir? (Flat White, Café con Leche/Latte, Doble Espresso, Filtro Batch Brew, Iced Latte)

  * Tipo de leche (Bebida de Avena Barista, Leche Fresca Entera, Solo/Negro, Bebida de Soja)

  * Perfil de sabor (Dulce & Chocolate, Afrutado & Cítrico, Me fío del Barista)

  * ¿Tomas descafeinado? (No / Sí, descafeinado al agua)

- Al pulsar "Generar Tarjeta", guarda estos datos en una tabla de Supabase llamada 'customers' y muestra en pantalla un pase digital elegante con un código QR que contiene el ID único del cliente recién creado.

2. Vista Barista (/barista):

- Pantalla protegida por un teclado PIN numérico (PIN por defecto: 2026).

- Integra un escáner de cámara para leer el código QR del cliente.

- Al escanear el ID, consulta en tiempo real en Supabase y muestra:

  * Nombre del cliente en grande para saludarlo.

  * Su preparación habitual y tipo de leche destacados.

  * Una caja con la "Tolva recomendada del día" según su perfil de sabor.

  * Una fila interactiva de sellos de fidelidad (meta de 5 cafés).

  * Botón para añadir un sello (actualiza en Supabase el contador). Si llega a 5 sellos, muestra una alerta verde festiva de "¡Café de cortesía disponible!".

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/11ee7583-5e08-5181-9088-2ad93fc468ed).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
