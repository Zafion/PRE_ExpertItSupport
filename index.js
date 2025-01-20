//importaciones
import { ManageAccount } from './firebaseconect.js';
import { getPassword } from './firebaseconect.js';
import { cambiarPassword } from './firebaseconect.js';

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('index.js cargado correctamente')  
})

// Creamos una instancia de manageAccount
const manageAccount = new ManageAccount();

// Definimos los elementos del DOM que vamos a utilizar
const expertSel = document.getElementById("experticket-selector");
const expertEnv = document.getElementById("expert-env");
const expertType = document.getElementById("expert-type");
const expertId = document.getElementById("expert-id");
const expertBtn = document.getElementById("expert-button");
const freshTicket = document.getElementById("fresh-ticket");
const freshBtn = document.getElementById("fresh-button");
const devopsWI = document.getElementById("devops-wi");
const devopsBtn = document.getElementById("devops-button");
const openSwitch = document.getElementById("switch_newtab");
const newpassId = document.getElementById("newpass-id");
const addpassBtn = document.getElementById("addpass-button");
const logoutButton = document.getElementById('logout-button');
const selectorTabla = document.getElementById('table-selector');
const passwordElement = document.getElementById('experticket-password');
const switchShow = document.getElementById('switch-show');
const userMail = document.getElementById('user-mail');


// Definimos las URL bases y combinaciones según el entorno 
const proTixalia = "https://admin.tixalia.com/";
const proFirst = "https://admin.";
const proLast = ".experticket.com";
const preFirst = "https://pre-";
const preLast = ".admin.experticket.com/";
// Definimos las URL bases para los diferentes servicios
const freshBase = "https://freshdesk.experticket.com/a/tickets/";
const devopsBase = "https://dev.azure.com/experticket/Experticket/_workitems/edit/";


//Función con listener para el para el cierre de sesión
logoutButton.addEventListener('click', () => {
  manageAccount.signOut().then(() => {
    window.location.href = "login.html";
    alert("Sesión cerrada correctamente.");
  }).catch((error) => {
    console.error(error.message);
    alert("Error al cerrar sesión: " + error.message);
  });
});

//Función con listener para userMail
userMail.addEventListener('click', redirectToAccount);


//Función que comprueba combinación de Experticket y entorno para definir url base
const getBaseUrl = () => {
  let baseUrl; //variable en la que almacenar la url
  const selectedService = expertSel.value; //Experticket seleccionado
  const selectedEnv = expertEnv.value; //Entorno seleccionado
  if (selectedService === "tixalia" && selectedEnv === "PRO") { //Si el Experticket es tixalia y el entorno es PRO
    baseUrl = proTixalia; 
  } else if (selectedService !== "TIXALIA" && selectedEnv === "PRO") { //Si el Experticket no es TIXALIA y el entorno es PRO
    baseUrl = proFirst + selectedService + proLast;
  } else { //resto (cualquier Experticket combinado con PRE)
    baseUrl = preFirst + selectedService + preLast;
  }
  return baseUrl;
};


// Objeto con funciones para manejar los clics en los botones
const handleClick = {
  experTicket: function () { // Verifica si la longitud del identificador es correcta
    if (expertId.value.length === 13 || expertId.value.length === 19) {
      if (openSwitch.checked) { // Verifica si la opción de abrir en una nueva pestaña está activada
        window.open(getBaseUrl() + expertType.value + expertId.value, "_blank"); //Si está activada abrirá en una nueva pestaña
      } else {
        window.location = getBaseUrl() + expertType.value + expertId.value; //si no Redirige a la URL en la misma pestaña
      }
    } else { // Muestra una alerta si el identificador no tiene la longitud adecuada
      alert("El identificador debe tener 13 (19 para las ventas)");
    }
  },
  freshDesk: function () { 
    // Verifica si el campo está vacío, comprueba si la opción de abrir en una nueva pestaña está activada y redirige a la URL correspondiente
    // Obtener el valor del campo fresh-ticket
    const freshTicket = document.getElementById("fresh-ticket").value;        
    // Verificar si el campo está vacío
    if (freshTicket === "") {
      alert("Por favor, introduce número de ticket de Freshdesk");
      return; // Salir de la función si el campo está vacío
    }    
    //  Verifica si la opción de abrir en una nueva pestaña está activada
    if (openSwitch.checked) { //Si está activada abrirá en una nueva pestaña
      window.open(freshBase + freshTicket.value, "_blank");
    } else { //Si no, abrira en la misma pestaña
      window.location = freshBase + freshTicket.value;
    }
  },


  devOps: function () { 
    // Verifica si el campo está vacío, comprueba si la opción de abrir en una nueva pestaña está activada y redirige a la URL correspondiente
    // Obtener el valor del campo devops-wi
    const devOpsWI = document.getElementById("devops-wi").value;
    // Verificar si el campo está vacío
    if (devOpsWI === "") {
      alert("Por favor, introduce número de Work Item de DevOps");
      return; // Salir de la función si el campo está vacío
    }        
    //  Verifica si la opción de abrir en una nueva pestaña está activada
    if (openSwitch.checked) { //Si está activada abrirá en una nueva pestaña
      window.open(devopsBase + devopsWI.value, "_blank");
    } else { //Si no, abrira en la misma pestaña
      window.location = devopsBase + devopsWI.value;
    }
  }
};


// Función para manejar el presionar teclas enter del teclado
const handleKeyPress = (e) => {
  if (e.code == "Enter" || e.code == "NumpadEnter") {
    switch (e.target.id) {
      case "expert-id":
        handleClick.experTicket();
        break;
      case "devops-wi":
        handleClick.devOps();
        break;
      case "fresh-ticket":
        handleClick.freshDesk();
        break;
    }
  }
};


// Funciones para manejar el cambio de desplegables de pestaña de Experticket
const handleChangeEnv = () => {
  console.log("Entorno seleccionado " + expertEnv.value);
};

const handleChangeExperticket = () => {
  console.log("Experticket seleccionado " + expertSel.value);
};

const handleChangeType = () => {
  console.log("Tipo de ID seleccionado " + expertType.value);
};


// Listeners para los botones y desplegables.
expertEnv.addEventListener("change", handleChangeEnv); // Escucha el cambio en el desplegable de entorno
expertSel.addEventListener("change", handleChangeExperticket); // Escucha el cambio en el desplegable de Expetticket
freshBtn.addEventListener("click", handleClick.freshDesk); // Escucha el clic en el botón de Freshdesk
expertType.addEventListener("change", handleChangeType); // Escucha el cambio en el desplegable de tipo
devopsBtn.addEventListener("click", handleClick.devOps); // Escucha el clic en el botón de DevOps
expertId.addEventListener("keydown", handleKeyPress); // Escucha la pulsación de teclas en el campo de identificador de Experticket
freshTicket.addEventListener("keydown", handleKeyPress); // Escucha la pulsación de teclas en el campo de número de ticket de Freshdesk
devopsWI.addEventListener("keydown", handleKeyPress); // Escucha la pulsación de teclas en el campo de número de Work Item de DevOps
newpassId.addEventListener("keydown", handleKeyPress); // Escucha la pulsación de teclas en el campo de nueva contraseña
addpassBtn.addEventListener("click", handleClick.addpassBtn); // Escucha el clic en el botón de nueva contraseña
switchShow.addEventListener('change', togglePasswordVisibility); // Escucha el cambio en el switch


//Función que comprueba combinación de Experticket y entorno para definir url base
expertBtn.addEventListener("click", function() { // Escucha el clic en el botón de Experticket
  var selectedOption = expertEnv.value;
  var selectedSearchType = expertType.value;
  var selectedExperticket = expertSel.value;
  if (selectedOption === 'Selecciona entorno...') { //Comprueba que se selecciona entorno
    alert('Por favor, selecciona un entorno (PRE o PRO) antes de continuar.');
  } else if (selectedSearchType === "Buscar por...") {  //comprueba que se selecciona tipo
    alert("Por favor, selecciona una opción de búsqueda.");
  } else if (selectedExperticket === "Selecciona Experticket...") {  //comprueba que se selecciona tipo
    alert("Por favor, selecciona un Experticket.");
  } else {
    handleClick.experTicket();
  }
});


// Escuchar el cambio en la tabla y llama a la función getPassword()
selectorTabla.addEventListener('change', () => {
  //desactiva 'switch-show' cada vez que se cambia de tabla por seguridad
  document.getElementById('switch-show').checked = false;
  // Mostrar asteriscos
  passwordElement.textContent = '*************';
  console.log("tablasel: " + selectorTabla.value);
});


// Escuchar clic en addpassBtn que llama a cambiarPassword
// con cambiarPassword actualiza contraseña con el valor de newpassId
addpassBtn.addEventListener("click", () => {
  //console.log("newpassId: " + newpassId.value);
  console.log("tablasel: " + selectorTabla.value);
  //si tablasel es vacío, mostrar alerta
  if (selectorTabla.value === "Selecciona Experticket...") {
    alert("Por favor, selecciona una tabla antes de continuar.");
    return;
  }
  //si newpassId.value es vacío o está formado por espacios, preguntar si quiere continuar.
  if (!newpassId.value || newpassId.value === "" || newpassId.value === null || newpassId.value === undefined || newpassId.value.trim() === "") {
    if (!confirm("Contraseña vacía ¿Seguro que quieres borrar la contraseña?")) {
      return; //Si no acepta, no hace nada.
    }
    //si acepta cambiar valor a "Sin contraseña añadida, por favor, añade una"
    newpassId.value="Sin contraseña añadida, por favor, añade una";
  }
  // Llamar a cambiarPassword de la tabla seleccionada con el valor de newpassId
  cambiarPassword(selectorTabla.value,  newpassId.value); 
  // Mostrar alerta de registro exitoso
  alert("Contraseña de " + selectorTabla.value + " actualizada.");
  //borrar contenido de newpass-id
  newpassId.value = "";
  //desactiva 'switch-show' por seguridad
  document.getElementById('switch-show').checked = false;
  // Mostrar asteriscos
  passwordElement.textContent = '*************';
})


// Función para mostrar o ocultar la contraseña
function togglePasswordVisibility() {
  // Obtener el valor de switch-show
  const switchShow = document.getElementById('switch-show');
  // si el switch esta activado
  if (switchShow.checked) {
    // Obtener la contraseña
    getPassword(selectorTabla.value);
    // Mostrar contraseña
    passwordElement.textContent = passwordElement.dataset.password;
  // si el switch esta desactivado  
  } else {
    // Mostrar asteriscos
    passwordElement.textContent = '*************';
  }
}

// Función para redirigir a la página de gestión de cuenta
function redirectToAccount() {
  window.location.href = '/account.html';
}


