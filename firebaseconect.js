window.addEventListener('DOMContentLoaded', async (event) => {
  console.log('firebaseconect.js cargado correctamente')  
})

// Importar librerías Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

// Importar librerías Firestore
import { getFirestore, collection, getDocs, addDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"

// Importar librerias de autenticación
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, deleteUser} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Función para obtener configuración desde firebaseConfig.php
// De esta forma los datos de acceso a firebase no son accesibles desde el usuario
async function fetchFirebaseConfig() {
  const response = await fetch('firebaseConfig.php'); 
  if (!response.ok) {
    throw new Error('No se pudo cargar la configuración de Firebase');
  }
  return response.json();
}

// Inicializar Firebase dinámicamente con la configuración obtenida
const firebaseConfig = await fetchFirebaseConfig();
const app = initializeApp(firebaseConfig);

// Inicializar BBDD
const db = getFirestore(app);

// Obtener la instancia de autenticación
const auth = getAuth();

// Obtener la ruta actual
const currentPage = window.location.pathname;


// Clase ManageAccount, incluye funciones de inicio de sesión, cierre de sesión y registra usuarios creando colecciones, añadiendoles mail y passwords vacías
export class ManageAccount {  
  //función para registrar usuario
  register(email, password) { 
    //Contraseña vacía
    const voidpassword = "Sin contraseña añadida, por favor, añade una"; 
    //Listado completo de colecciones:
    const collections = ["bombasgens", "dinopolis", "dna", "dta", "excursionesmaritimas", "gdsparquesreunidos", "grprgermany", "grprbelgium", "grpritaly", "grprnetherlands", "hwmaspalomas", "islamagica", "magiccostablanca", "oceanografic", "parquesgruposm", "portaventuraworld", "puydufou", "puydufou-france", "sendaviva", "terranatura", "terranaturamurcia", "tixalia", "travelparks", "visitvalencia"];
    //Listado de colecciones de pruebas:
    //const collections = ["test1", "test2"];
    createUserWithEmailAndPassword(auth, email, password)//llama a función para crear usuario
      .then((_) => {
        //itera por todas las colecciones del listado 
        for (let i = 0; i < collections.length; i++) { 
          //llama a función addCollection para crear las colecciones y añadiendoles mail y passwords vacías
          addCollection(collections[i], email, voidpassword)
          console.log("usuario guardado en " + collections[i]); 
        }        
        // Mostrar alerta de registro exitoso
        alert("Registro exitoso. Para continuar inicia sesión.");
      })
      //gestión de errores
      .catch((error) => {
        //Muestra error por consola
        console.error(error.message);
        //ALERTAS:
        //si el error es Firebase: Error (auth/invalid-email).
        if (error.code === "auth/invalid-email") {
          alert("El correo electrónico no es válido, por favor, introduce un correo electrónico válido.");
        }
        //si el error es Firebase: Firebase: Password should be at least 6 characters (auth/weak-password).
        if (error.code === "auth/weak-password") {
          alert("La contraseña debe tener al menos 6 caracteres. Por favor, introduce una contraseña de al menos 6 caracteres.");
        }
        //si el error es Firebase: Firebase: Error (auth/email-already-in-use).
        if (error.code === "auth/email-already-in-use") {
          alert("El correo electrónico ya se encuentra registrado. Puedes iniciar sesión con el botón 'Iniciar sesión'");
        }       
        //si el error no es ninguno de los otros tres.
        if (error.code !== "auth/invalid-email" && error.code !== "auth/weak-password" && error.code !== "auth/email-already-in-use") {
          alert("Error al registrar: " + error.message);
        }
      });
  }
  // Función para iniciar sesión
  authenticate(email, password) {
    //llama a función para iniciar sesión
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        // Mostrar alerta de inicio de sesión exitoso y redirigir al usuario a la página principal
        window.location.href = "index.html";
        alert("Has iniciado sesión correctamente. Serás redirigido a la página principal.");
      }
    )
    //gestión de errores
    .catch(
      (error) => {
        //Muestra error por consola
        console.error(error.message);
        //ALERTAS:
        //si el error es Firebase: Error (auth/invalid-email).
        if (error.code === "auth/invalid-email") {
          alert("El correo electrónico no es válido o no está registrado. Por favor, introduce un correo electrónico válido.");
        }
        //si el error es Firebase: Error (auth/invalid-credential).
        if (error.code === "auth/invalid-credential") {
          alert("El mail o la contraseña proporcionada no son válidos. Por favor, revisa si el correo electrónico y la contraseña son correctos.");
        }
        //si el error no es Firebase: Error (auth/invalid-email) ni Firebase: Error (auth/invalid-credential)
        if (error.code !== "auth/invalid-email" && error.code !== "auth/invalid-credential") {
            // Mostrar alerta de error de inicio de sesión
          alert("Error al iniciar sesión: " + error.message);
        }               
      }
    );
  }
  // Función para cerrar sesión
  signOut() {
    //llama a función para cerrar sesión
    signOut(auth)
      .then((_) => {
        //redirigir al usuario a la página de inicio de sesión
        window.location.href = "login.html";
        alert("Has cerrado sesión correctamente. Serás redirigido a la página de inicio de sesión.");
      })
      //gestión de errores
      .catch((error) => {
        //Muestra error por consola
        console.error(error.message);
        // Mostrar alerta de error de inicio de sesión
        alert("Error al cerrar sesión: " + error.message);
      });
  }
}


// Función para crear colección y registrar mail y contraseña
export const addCollection = (collectionname, mail, password) => {
  //llama a función para crear colección añadiendo mail y contraseña
  addDoc (collection(db, collectionname),{mail, password})    
}


// Función para verificar estado de la sesión y redirigir a login si no hay usuario

//Versión 1 - web alojada en firebase
// export function checkSession() {
//   onAuthStateChanged(auth, (user) => { //verifica estado de la sesión
//       if (!user && window.location.pathname !== "/login.html") {
//         //si no hay usuario y no está en login, redirigir a login.
//           window.location.href = "login.html";
//       }
//   });
// }

// //versión 2 - web alojada en raíz de localhost de PRE
// export function checkSession() {
//   onAuthStateChanged(auth, (user) => { //verifica estado de la sesión
//       if (!user && window.location.pathname !== "/PRE_ExpertItSupport/login.html") {
//         //si no hay usuario y no está en login, redirigir a login.
//           window.location.href = "login.html";
//       }
//   });
// }

//versión 3 - web alojada en localhost/xampp de PRE
export function checkSession() {
  onAuthStateChanged(auth, (user) => { //verifica estado de la sesión
      if (!user && window.location.pathname !== "/xampp/PRE_ExpertItSupport/login.html") {
        //si no hay usuario y no está en login, redirigir a login.
          window.location.href = "login.html";
      }
  });
}


// Iniciar la verificación del estado de la sesión despues de inicializar firebase
checkSession();


// Función para ocultar el botón de inicio de sesión si el usuario ya ha iniciado sesión. 
export function hideLoginButtonIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {  //verifica estado de la sesión
    const loginButton = document.querySelector('a[href="login.html"]'); //busca el botón de inicio de sesión
    if (user) { //si hay usuario, oculta el botón de inicio de sesión
      loginButton.style.display = 'none';
    }
  });
} 


//Verifica si el archivo actual no es login.html antes de llamar a la función para ocultar el botón de inicio de sesión
if (currentPage !== '/login.html') {
  hideLoginButtonIfLoggedIn();
}


// Función para mostrar el mail del usuario
export function getUserMail() {
  try {
    const user = auth.currentUser; // Obtiene el usuario actual
    if (user) { //si hay usuario mostrar el mail del usuario
      const userMailElement = document.getElementById('user-mail');
      userMailElement.textContent = user.email;
    } else { //si no hay usuario mostrar vacío
      const userMailElement = document.getElementById('user-mail');
      userMailElement.textContent = '';
    }
  } catch (error) {
    console.error('Error al obtener el mail del usuario, si aún no se ha logeado es correcto', error);
  }
}
// Verifica si el archivo actual no es login.html antes de llamar a la función para mostrar el mail del usuario
if (currentPage !== '/login.html') {
  onAuthStateChanged(auth, (user) => { 
    getUserMail();
  });
}


//funcion para mostrar el password del usuario
export const getPassword = async (tablaSeleccionada) => { 
  // Obtiene el usuario actual
  const user = auth.currentUser; 
  // Obtiene los datos de la colección
  const querySnapshot = await getDocs(collection(db, tablaSeleccionada)); 
  // Inicializa la variable html
  let html = '';
  // Itera sobre los datos de la colección
  querySnapshot.forEach((doc) => {  
      // Obtiene los datos del documento
      const client = doc.data() 
      //console.log(doc.data())
      // Si el mail del usuario coincide con el mail del documento
      if (client.mail === user.email) { 
          //console.log(doc.data())
          // Agrega el password del documento a la variable html
          html += `${client.password}` 
          //console.log(html)
      }      
  });
  //Obtiene el valor de la variable html y lo muestra en el elemento con id 'experticket-password'
  const passwordContainer = document.getElementById('experticket-password').innerHTML = html
};


//función para cambiar el password del usuario usando updateDoc
//se le proporciona la coleccion, y el nuevo password, el mail es el email del usuario logueado
//no es necesario comprobar si hay un usuario logueado ya que si no se esta logeado redirige a login  
export async function cambiarPassword(coleccion, nuevoPassword) {
  // Obtiene el usuario actual
  const user = getAuth().currentUser;  // Obtiene el usuario actual
  const coleccionRef = collection(db, coleccion); // Crea una referencia a la colección
  // Crea una consulta para encontrar documentos con el email especificado:
  const q = query(coleccionRef, where("mail", "==", user.email));
  const querySnapshot = await getDocs(q); // Obtiene los documentos que coinciden con la consulta
  querySnapshot.forEach((doc) => {  // Itera sobre los documentos encontrados
    updateDoc(doc.ref, { password: nuevoPassword });  // Actualiza el campo "password" del documento
  });
}

//función para cambiar el mail del usuario usando updateDoc
//se le proporciona la coleccion, y el nuevo mail, el mail es el email del usuario logueado
//no es necesario comprobar si hay un usuario logueado ya que si no se esta logeado redirige a login  
export async function cambiarMail(coleccion, nuevoMail) {
  // Obtiene el usuario actual
  const user = getAuth().currentUser;  // Obtiene el usuario actual
  const coleccionRef = collection(db, coleccion); // Crea una referencia a la colección
  // Crea una consulta para encontrar documentos con el email especificado:
  const q = query(coleccionRef, where("mail", "==", user.email));
  const querySnapshot = await getDocs(q); // Obtiene los documentos que coinciden con la consulta
  querySnapshot.forEach((doc) => {  // Itera sobre los documentos encontrados
    updateDoc(doc.ref, { mail: nuevoMail });  // Actualiza el campo "mail" del documento
  });
}


//funcion para cambiar el password del usuario usando updatePassword
export async function cambiarContraseña(nuevaContraseña) {
  // Obtiene el usuario actual  
  const user = auth.currentUser;
  if (user) { //si hay usuario
    try { //intenta cambiar la contraseña
      await updatePassword(user, nuevaContraseña); 
      console.log("La contraseña se ha cambiado correctamente.");
      // alerta de que la contraseña se ha cambiado correctamente
      alert("La contraseña se ha cambiado correctamente.");
    } catch (error) { //gestiona los errores
      if (error.code === "auth/requires-recent-login") { //si el error es Firebase: Error (auth/requires-recent-login)
        console.error("El usuario necesita iniciar sesión de nuevo para cambiar la contraseña.");
        // alerta de que el usuario necesita iniciar sesión de nuevo para cambiar la contraseña
        alert("Por seguridad, el usuario necesita iniciar sesión de nuevo para cambiar la contraseña. Por favor, cierra sesión e inicia sesión de nuevo para poder cambiar la contraseña.");
      } else {
        console.error("Error al cambiar la contraseña:", error);
        // alerta de que hubo un error al cambiar la contraseña
        alert("Hubo un error al cambiar la contraseña. Por favor, cierra sesión e inténtalo de nuevo.");
      }
    }
  } else {
    console.error("No hay ningún usuario logeado.");
    // alerta de que no hay usuario logeado
    alert("Por favor, inicia sesión antes de cambiar la contraseña.");
  }
}

// función para eliminar la cuenta del usuario
export async function deleteAccount() {
  // Obtén el usuario actual
  const user = auth.currentUser;
  if (user) {
    try {  // Intenta eliminar la cuenta del usuario
      await deleteUser(user);
      console.log("Se ha eliminado la cuenta del usuario");
      // Mostrar alerta de borrado exitoso
      alert("Se han eliminado todos los datos del usuario.");
    } catch (error) { // Maneja el error
      if (error.code === "auth/requires-recent-login") { //si el error es Firebase: Error (auth/requires-recent-login)
        console.error("El usuario necesita iniciar sesión de nuevo para eliminar la cuenta.");
        // alerta de que el usuario necesita iniciar sesión de nuevo para eliminar la cuenta
        alert("Por seguridad, el usuario necesita iniciar sesión de nuevo para eliminar la cuenta. Por favor, cierra sesión e inicia sesión de nuevo para poder eliminar la cuenta.");
      } else {
        console.error("Error al eliminar la cuenta:", error);
        // alerta de que hubo un error al eliminar la cuenta
        alert("Hubo un error al eliminar la cuenta. Por favor, cierra sesión e inténtalo de nuevo.");
      }
    }    
  } else {
    console.error("No hay ningún usuario logeado.");
    // alerta de que no hay usuario logeado
    alert("Por favor, inicia sesión antes de eliminar la cuenta.");
  }   
}

















