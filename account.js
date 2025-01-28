//importaciones
import { ManageAccount } from './firebaseconect.js';
import { cambiarContraseña } from './firebaseconect.js';
import { cambiarPassword } from './firebaseconect.js';
import { cambiarMail } from './firebaseconect.js';
import { deleteAccount } from './firebaseconect.js';

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('account.js cargado correctamente')  
})

// Creamos una instancia de manageAccount
const manageAccount = new ManageAccount();

// Definimos los elementos del DOM que vamos a utilizar
const switchReset = document.getElementById('switch-reset');
const switchDelAccount = document.getElementById('switch-del-account');
const newpassId = "Sin contraseña añadida, por favor, añade una";
const deletedPassId = "Contraseña borrada";
const deletedMailId = "Cuenta borrada";
const collections = ["bombasgens", "dinopolis", "dna", "dta", "excursionesmaritimas", "gdsparquesreunidos", "grprgermany", "grprbelgium", "grpritaly", "grprnetherlands", "hwmaspalomas", "islamagica", "magiccostablanca", "oceanografic", "parquesgruposm", "portaventuraworld", "puydufou", "puydufou-france", "sendaviva", "terranatura", "terranaturamurcia", "tixalia", "travelparks", "visitvalencia"];
const newUserPassword1 = document.getElementById("new-password1");
const newUserPassword2 = document.getElementById("new-password2");


// Listeners para los botones y demás elementos.
document.getElementById("reset-button").addEventListener("click", resetAllPasswords);
document.getElementById("modify-button").addEventListener("click", changePassword);
document.getElementById("logout-button").addEventListener("click", logOut);
document.getElementById("del-account-button").addEventListener("click", delAccountAndData);


//listener para switchReset
switchReset.addEventListener("change", (event) => {
  //cuando cambie mostrar valor por consola
  console.log("El switch cambio de valor a: " + event.target.checked);
  //si switchReset esta activado, mostrar alerta
  if (event.target.checked) {
    //mostrar aviso
    alert("Has activado la eliminación de passwords. Si pulsas Restablecer eliminaras todas las contraseñas almacenadas en tu cuenta.\n\nPara borrarlas de forma individual, puedes usar la segunda pestaña de la página principal.");
  }
});


//listener para switchDelAccount
switchDelAccount.addEventListener("change", (event) => {
  //cuando cambie mostrar valor por consola
  console.log("El switch cambio de valor a: " + event.target.checked);
  //si switchDelAccount esta activado, mostrar alerta
  if (event.target.checked) {
    var result = confirm("La eliminación de tu cuenta es definitiva e irreversible. Esto significa que una vez que elimines tu cuenta, no podrás recuperarla ni acceder a ninguno de los datos asociados a ella.\n\nAl eliminar tu cuenta, se borrarán todos los datos asociados a ella, incluyendo:\n\n* Tus datos de usuario.\n* Todas tus contraseñas almacenadas serán eliminadas\n\nAl hacer clic en \"Aceptar\", confirmas que has leído y comprendido esta advertencia y que deseas continuar con el proceso de eliminación.\n\nSi no deseas eliminar tu cuenta, puedes cancelar esta acción haciendo clic en \"Cancelar\".\n\n¿Estás seguro de que deseas eliminar tu cuenta?");
    if (result) {
      switchDelAccount.checked = true;
      console.log("Usuario confirma haber leido la advertencia de eliminación y acepta continuar.");
    } else {
      switchDelAccount.checked = false;
      console.log("Usuario rechaza eliminar la cuenta.");
    }
  }
});


//Función para el cierre de sesión
function logOut () {
    manageAccount.signOut().then(() => {
      window.location.href = "login.html";
      alert("Sesión cerrada correctamente.");
    }).catch((error) => {
      console.error(error.message);
      alert("Error al cerrar sesión: " + error.message);
    });
}


//Función para cambiar contraseña de usuario.
function changePassword() {
    //si newUserPassword1 o newUserPassword2 están vacíos, mostrar alerta
    if (newUserPassword1.value === "" || newUserPassword2.value === "") {
        console.log("Campo vacío.")
        alert("Por favor, introduce una contraseña en ambos campos.");
        return;
    }
    //si newUserPassword1 es igual a newUserPassword2, cambiar contrasenya a newUserPassword1
    if (newUserPassword1.value === newUserPassword2.value) {
        console.log("Las contraseñas coinciden.")
        cambiarContraseña(newUserPassword1.value);
        //vacia campos
        newUserPassword1.value = "";
        newUserPassword2.value = "";
    //si newUserPassword1 no es igual a newUserPassword2, mostrar alerta    
    } else {
        console.log("Las contraseñas no coinciden.")
        alert("Las contrasenyes no coinciden. Por favor, introduce la misma en los dos campos.");
        //vacia campos
        newUserPassword1.value = "";
        newUserPassword2.value = "";
    }
}


//Función para resetear todos los passwords
//Sólo funciona si el switchReset esta activado
function resetAllPasswords() {
  //si switchReset esta desactivado, mostrar alerta y no continuar
  if (!switchReset.checked) {
    console.log("switchReset desactivado");
    alert("Confirma la eliminación antes para continuar.");
    return;
  }
  //si switchReset esta activado, llamar a cambiarPassword
  if (switchReset.checked) {
    //iterar por cada elemento de collections, llamando a cambiarPassword en cada iteración y dando el valor de collections[i]
    for (let i = 0; i < collections.length; i++) {
      cambiarPassword(collections[i], newpassId);
      console.log("Reiniciado password de " + collections[i]);
    }    
    // Mostrar alerta de borrado exitoso
    alert("Se han reiniciado los passwords de todos los expertickets.");
    //desactivar switchReset
    switchReset.checked = false;
  }
}
 

//Función para borrar cuenta, sólo funciona si el switchDelAccount esta activado
async function delAccountAndData() {
  try {
    //si switchDelAccount esta desactivado, mostrar alerta y no continuar
    if (!switchDelAccount.checked) {
      console.log("switchDelAccount desactivado");
      alert("Confirma la eliminación antes para continuar.");
      return;
    }
    //si switchDelAccount esta activado, "borra" contraseñas y mails y luegoo llama a deleteAccount
    if (switchDelAccount.checked) {
      //iterar por cada elemento de collections
      //en cada iteración llama a cambiarPassword y a cambiarMail y dando el valor de collections[i]
      for (let i = 0; i < collections.length; i++) {
        try {
          await cambiarPassword(collections[i], deletedPassId);
          await cambiarMail(collections[i], deletedMailId);
          console.log("borrados datos de " + collections[i]);
        } catch (error) {
          console.error("Error al borrar password o mail: de colección " + collections[i] + " : ", error);
          // Mostrar alerta de que hubo un error al cambiar password o mail
          alert("Hubo un error al borrar datos. Por favor, cierra sesión e inténtalo de nuevo.");
          // No continuar con deleteAccount()
          return;
        }
      }
      // Elimina la cuenta del usuario solo si todos los documentos se eliminaron correctamente
      await deleteAccount();      
      //si todo sale bien, la función deleteAccount mostrará un alerta de borrado exitoso
      //desactivar switchDelAccount
      switchDelAccount.checked = false;
      
    }    
    //desactivar switchDelAccount (por seguridad)
    switchDelAccount.checked = false;
  }catch (error) {
    console.error("Error al eliminar datos o cuenta:", error);
  }
}

