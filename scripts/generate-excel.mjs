import XLSX from "xlsx";

const nombres = ["Ana", "Luis", "Maria", "Jose", "Carmen", "Pedro", "Laura", "Juan", "Sofia", "Diego", "Elena", "Carlos", "Marta", "Andres", "Patricia", "Roberto", "Isabel", "Fernando", "Lucia", "Miguel", "Rosa", "Antonio", "Paula", "Manuel", "Sara", "David", "Eva", "Javier", "Nuria", "Pablo"];
const apellidos = ["Garcia", "Rodriguez", "Martinez", "Lopez", "Gonzalez", "Hernandez", "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz", "Morales", "Reyes", "Alvarez", "Castillo", "Romero", "Mendoza"];
const ciudades = ["Ciudad de Mexico", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Leon", "Queretaro", "Merida", "Cancun", "Toluca"];
const calles = ["Av. Reforma", "Calle Madero", "Blvd. Juarez", "Calle Hidalgo", "Av. Universidad", "Calle Morelos", "Blvd. Lazaro", "Calle Allende", "Av. Insurgentes", "Calle Zaragoza"];
const colonias = ["Col. Centro", "Col. Norte", "Col. Sur", "Col. Reforma", "Fracc. Jardines"];
const categorias = ["Electronica", "Ropa", "Hogar", "Deportes", "Libros", "Juguetes", "Belleza", "Alimentos"];
const marcas = ["TechPro", "StyleCo", "HomeMax", "SportX", "BookWorld", "FunToys", "BeautyPlus", "FreshFood"];
const estadosPedido = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];
const metodosPago = ["tarjeta", "efectivo", "transferencia", "paypal", "mercadopago"];
const estados = ["activo", "inactivo"];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateClientes(count) {
  const rows = [];
  for (let i = 1; i <= count; i++) {
    const nombre = rand(nombres);
    const apellido = rand(apellidos);
    const ciudad = rand(ciudades);
    const calle = rand(calles);
    const num = randInt(100, 9999);
    rows.push([
      i,
      nombre,
      apellido,
      `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@email.com`,
      `55-${randInt(1000, 9999)}-${randInt(1000, 9999)}`,
      `${calle} ${num}, ${rand(colonias)}`,
      ciudad,
      rand(estados),
    ]);
  }
  return rows;
}

function generateProductos(count) {
  const rows = [];
  const nombresProducto = {
    "Electronica": ["Smartphone X200", "Laptop Pro 15", "Auriculares BT", "Tablet S8", "Smartwatch V3", "Camara Digital 4K", "Teclado Mecanico", "Monitor 27\"", "Cargador Rapido", "Bocina Bluetooth"],
    "Ropa": ["Camisa Casual", "Pantalon Jean", "Zapatillas Deportivas", "Chaqueta Cuero", "Vestido Verano", "Sueter Lana", "Camiseta Algodon", "Pantalon Chino", "Zapatos Formales", "Gorra Deportiva"],
    "Hogar": ["Sillon Moderno", "Mesa Centro", "Lampara LED", "Juego Sabanas", "Cojin Decorativo", "Espejo Pared", "Reloj Pared", "Cortina Blackout", "Cuadro Abstracto", "Jardinera"],
    "Deportes": ["Balon Futbol", "Raqueta Tennis", "Pesas 10kg", "Esterilla Yoga", "Bicicleta Spinning", "Guantes Boxeo", "Red Volleyball", "Tennis Running", "Mochila Deportiva", "Cuerda Saltar"],
    "Libros": ["Novela Misterio", "Guia JavaScript", "Cuentos Cortos", "Historia Mexico", "Poemas Modernos", "Manual React", "Biografia Famoso", "Diccionario Espanol", "Comic Superheroe", "Recetas Cocina"],
    "Juguetes": ["Juego Mesa", "Peluche Oso", "Bloques Construir", "Carrito Control", "Muneca Fashion", "Rompecabezas 500", "Juego Cartas", "Figura Accion", "Dinosaurio Plastico", "Set Pintura"],
    "Belleza": ["Crema Facial", "Labial Rojo", "Perfume Floral", "Shampoo", "Maquillaje Ojos", "Protector Solar", "Crema Manos", "Mascarilla Facial", "Desodorante", "Jabon Exfoliante"],
    "Alimentos": ["Cafe Organico", "Chocolate Oscuro", "Te Verde", "Miel Pura", "Granola", "Pasta Integral", "Aceite Oliva", "Frutos Secos", "Mermelada", "Pan Artesanal"],
  };

  for (let i = 1; i <= count; i++) {
    const categoria = rand(categorias);
    const nombresCat = nombresProducto[categoria];
    rows.push([
      i,
      rand(nombresCat),
      `${rand(nombresCat)} de alta calidad, ideal para el dia a dia.`,
      parseFloat((randInt(50, 5000) + Math.random() * 0.99).toFixed(2)),
      randInt(0, 200),
      categoria,
      rand(marcas),
      Math.random() > 0.1 ? "activo" : "inactivo",
    ]);
  }
  return rows;
}

function generatePedidos(count) {
  const rows = [];
  const direcciones = [
    "Av. Reforma 123, Col. Centro, Ciudad de Mexico",
    "Calle Madero 456, Col. Norte, Guadalajara",
    "Blvd. Juarez 789, Col. Sur, Monterrey",
    "Calle Hidalgo 321, Col. Reforma, Puebla",
    "Av. Universidad 654, Col. Centro, Tijuana",
  ];
  for (let i = 1; i <= count; i++) {
    const idCliente = randInt(1, 60);
    const fecha = new Date(2024, randInt(0, 11), randInt(1, 28));
    const fechaStr = fecha.toISOString().split("T")[0];
    const total = parseFloat((randInt(100, 10000) + Math.random() * 0.99).toFixed(2));
    rows.push([
      i,
      idCliente,
      fechaStr,
      total,
      rand(estadosPedido),
      rand(metodosPago),
      rand(direcciones),
    ]);
  }
  return rows;
}

function generateDetallesPedido(count) {
  const rows = [];
  for (let i = 1; i <= count; i++) {
    const idPedido = randInt(1, 50);
    const idProducto = randInt(1, 40);
    const cantidad = randInt(1, 10);
    const precioUnitario = parseFloat((randInt(50, 500) + Math.random() * 0.99).toFixed(2));
    const subtotal = parseFloat((precioUnitario * cantidad).toFixed(2));
    rows.push([
      i,
      idPedido,
      idProducto,
      cantidad,
      precioUnitario,
      subtotal,
    ]);
  }
  return rows;
}

const wb = XLSX.utils.book_new();

function addSheet(name, headers, types, rows) {
  const data = [headers, types, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, name);
}

addSheet(
  "cliente",
  ["idCliente", "nombre", "apellido", "email", "telefono", "direccion", "ciudad", "estado"],
  ["INT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT"],
  generateClientes(60)
);

addSheet(
  "producto",
  ["idProducto", "nombre", "descripcion", "precio", "stock", "categoria", "marca", "estado"],
  ["INT", "TEXT", "TEXT", "DECIMAL", "INT", "TEXT", "TEXT", "TEXT"],
  generateProductos(40)
);

addSheet(
  "pedido",
  ["idPedido", "idCliente", "fechaPedido", "total", "estado", "metodoPago", "direccionEnvio"],
  ["INT", "INT", "DATE", "DECIMAL", "TEXT", "TEXT", "TEXT"],
  generatePedidos(50)
);

addSheet(
  "detallePedido",
  ["idDetalle", "idPedido", "idProducto", "cantidad", "precioUnitario", "subtotal"],
  ["INT", "INT", "INT", "INT", "DECIMAL", "DECIMAL"],
  generateDetallesPedido(50)
);

XLSX.writeFile(wb, "public/tienda-online.xlsx");
console.log("Excel creado: public/tienda-online.xlsx");
