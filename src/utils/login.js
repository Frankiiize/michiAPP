import {Toast} from './sweetAlerts.js';
var provider = new firebase.auth.GoogleAuthProvider();
let headerBtn = document.querySelector('#hamburger');
let loginContainer = document.querySelector('.headerContainer__login');
let userLoggedContainer = document.querySelector('.headerContainer__login-logged');
let loginEmailBtn = document.querySelector('#loginBtn');
let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;


let logoutBtn = document.querySelector('#logoutBtn');
export function  loginWhitGoogle () {
        //debugger
        firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /* @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
    
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            //debugger
            console.log('paso' + user.displayName);
            loginContainer.style.display = 'none';
            userLoggedContainer.style.display = 'flex';
            Toast.fire({
                icon: 'success',
                title: `Bienvenido ${user.displayName}`
              })
              if(user){
                  //debugger
                  let cerrarVentana = () => {
                      
                      setTimeout(() =>{
                          userLoggedContainer.style.display = 'none';
                          headerBtn.classList = 'headerHamburger';
                      },1500);
                }
                cerrarVentana();
              }
            
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.error(error.message)
            console.error(credential)
            Swal.fire({
                icon: 'error',
                title: `${errorCode} ${email}`,
                text: `${errorMessage}`,
                buttonsStyling: false,                      
              })
            // ...
        });
    }
export let  validarLogin =  (ev) => {
    loginEmailBtn.onclick = () => {

      
        if(email.value && password.value != ''){
            if(emailRegex.test(email.value)){
                let userEmail = email.value;
                let userPassword = password.value;
                
                firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
                .then((userCredential) => {
                    // Signed in
                    
                    //debugger
                    var user = userCredential.user;
                    if(user && loginContainer.style.display == 'flex'){
                        console.log(`${user.displayName} logeo con exito`);
                        loginContainer.style.display = 'none';
                        if(user.displayName == null){
                            Toast.fire({
                                icon: 'success',
                                title: `Bienvenido ${userEmail} `
                              })
                            } else {
                                Toast.fire({
                                    icon: 'success',
                                    title: `Bienvenido ${user.displayName}`
                                  })
                                }


                    } 
                   // return;
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage)
                    Toast.fire({
                        icon: 'error',
                        title: `${errorMessage}`
                      })
                });
    
            } else {
                console.log('email no valido');
                Toast.fire({
                    icon: 'error',
                    title: 'Email no valido'
                  })
            }
        } else {
            console.log('completa los campos');
          
            Toast.fire({
                icon: 'error',
                title: 'Completa los campos'
              })
              
        }
    }
}
    
export function logout () {
    logoutBtn.onclick = () =>{

        firebase.auth().signOut()
        .then(() => {
            // Sign-out successful.
            console.log('Sign-out successful');
            userLoggedContainer.style.display = 'none';
            Toast.fire({
                icon: 'info',
                title: 'Cierre de sesión exitoso'
              })
              setTimeout(() => {
                loginContainer.style.display = 'flex';
                window.location = '../../html/index.html';
              },500);
        }).catch((error) => {
            // An error happened.
            console.error(error);
            Toast.fire({
                icon: 'error',
                title: '${error.message}'
              })
          });
    }
}