//variables formulario login
let headerBtn = document.querySelector('#hamburger');
let loginForm = document.querySelector('#loginForm');
let email = document.querySelector('#email');
let password = document.querySelector('#password');
let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
let googleBtn = document.querySelector('#google');
var provider = new firebase.auth.GoogleAuthProvider();
let loginContainer = document.querySelector('.headerContainer__login');
let userLoggedContainer = document.querySelector('.headerContainer__login-logged');
let loginEmailBtn = document.querySelector('#loginBtn')
    
    //user logged
let userNameDisplay = document.querySelector('#userNameDisplay');
let userPhotoDisplay = document.querySelector('#userPhoto');
    //user logged
    //logout
let logoutBtn = document.querySelector('#logoutBtn');
    //logout

//variables formulario login

//sweeALERTSCONFIG
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    //timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
//sweeALERTSCONFIG


//variables formulario dosis
let form = document.querySelector('#form');
let name = document.querySelector('#name');
let checkD = document.querySelector('#dia');
let checkN = document.querySelector('#noche');
let fecha = document.querySelector('#fecha');
let print = document.querySelector('#print')
//variables formulario dosis

let  validarLogin =  (ev) => {
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
                        title: `${errorCode}`
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


function validadFormulario (ev) {
    ev.preventDefault();
    let ischeck1 = checkD.checked;
    let ischeck2 = checkN.checked;
    debugger
    if(ischeck1 ^ ischeck2 && name.value != '' && fecha.value !=''){
        let textData = document.createElement('span');
        textData.append(` ${name.value} ${checkD.value} ${checkN.value} ${fecha.value} `)
        print.append(textData);
        setTimeout(() => {
            textData.remove();
        },1000);
        console.log(`success ${name.value} ${checkD.value} ${checkN.value} ${fecha.value} `)
    } else  {
        let textData = document.createElement('span');
        textData.append(` completa los campos `)
        print.append(textData);
        setTimeout(() => {
            textData.remove();
        },1000);
    }
  
}

function  loginWhitGoogle () {
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
        Toast.fire({
            icon: 'success',
            title: `Bienvenido ${user.displayName}`
          })
        
        
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
        // ...
    });
}

/* function renderLogBtn (Container, textValue, btnId) {
    let singOutBtn = document.createElement('input');
        singOutBtn.type = 'submit';
        singOutBtn.classList.add('headerContainer__login-sendBtn');
        singOutBtn.value = textValue;
        singOutBtn.id = btnId;
        //singOutBtn.onclick = 'logout()';
        Container.appendChild(singOutBtn)
} */

/* let fireListener = () => {

    firebase.auth().onAuthStateChanged(user => {
        //debugger
            if(user){
                console.log(`usuario ${user.displayName}`);
                
              

            } else {
                console.log('no hay usuario')
            }
         
        })
} */



let hammburBtn = () => {
    headerBtn.onclick = () => { 
        //debugger
        headerBtn.classList.toggle("change");
        firebase.auth().onAuthStateChanged((user) => {
            if(user && loginContainer.style.display == 'none'){
                if(userLoggedContainer.style.display == 'none' ){
                    userLoggedContainer.style.display = 'flex';
                    //debugger
                    if(user.photoURL && user.displayName != null){
                        userNameDisplay.innerHTML = `${user.displayName}`;
                        userPhotoDisplay.src = `${user.photoURL}`;
                    } else {
                        userNameDisplay.innerHTML = `${email.value}`;
                        userPhotoDisplay.src = "assets/userImg.png";
                    } 
                } else {
                    userLoggedContainer.style.display = 'none';
                }
                
                
            } else {
                if(user == null ){
                    if(loginContainer.style.display == 'none'){
                        loginContainer.style.display = 'flex';
    
                    } else {
    
                        loginContainer.style.display = 'none';
                    }
                }
            }           
        })
    }
}


function logout () {
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


document.addEventListener("DOMContentLoaded",function() {
    form.addEventListener('submit', validadFormulario);
    //loginForm.addEventListener('submit', validarLogin);
    googleBtn.addEventListener('click',loginWhitGoogle);

    hammburBtn();
    validarLogin();
    logout();

   
});