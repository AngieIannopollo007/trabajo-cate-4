const solPeruano = 400; 
const reales = 300;
const dolar = 1300;
const euro = 1400;
const yen = 100;
const franco = 2000;
const pesoColombiano = 200;
const quetzal = 500;

function suma(event){
    event.preventDefault();
    let pais = document.getElementById("opcion").value;
    let dias = parseFloat(document.getElementById("dias").value);

    let costoViaje = 100 * dias; 
    let costoPesos;
    if(pais == "Cusco") costoPesos = costoViaje * solPeruano;
    if(pais == "Rio") costoPesos = costoViaje * reales;
    if(pais == "Miami") costoPesos = costoViaje * dolar;
    if(pais == "Barcelona") costoPesos = costoViaje * euro;
    if(pais == "Tokyo") costoPesos = costoViaje * yen;
    if(pais == "Suiza") costoPesos = costoViaje * franco;
    if(pais == "Colombia") costoPesos = costoViaje * pesoColombiano;
    if(pais == "Guatemala") costoPesos = costoViaje * quetzal;


    document.getElementById("costoFinal").textContent =
    "El numero es: " + costoPesos;

   return;
}