//variables formulario dosis

let loginForm = document.querySelector('#loginForm');
let email = document.querySelector('#email');
let password = document.querySelector('#password');
let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
//variables formulario dosis

//variables formulario dosis
let form = document.querySelector('#form');
let name = document.querySelector('#name');
let checkD = document.querySelector('#dia');
let checkN = document.querySelector('#noche');
let fecha = document.querySelector('#fecha');
let print = document.querySelector('#print')
//variables formulario dosis

function validarLogin (ev) {
    ev.preventDefault();
    if(email.value && password.value != ''){
        if(emailRegex.test(email.value)){
            let userEmail = email.value;
            let userPassword = password.value;
            
            firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
            .then((userCredential) => {
                // Signed in
                console.log(user)
                var user = userCredential.user;
                console.log(user)
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode + " " + errorMessage)
            });

        } else {
            console.log('email no valido');
        }
    } else {
        console.log('completa los campos');
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





document.addEventListener("DOMContentLoaded",function() {
    form.addEventListener('submit', validadFormulario);
    loginForm.addEventListener('submit', validarLogin)
    let headerBtn = document.querySelector('#hamburger');
    let loginContainer = document.querySelector('.headerContainer__login');

    headerBtn.onclick = () => {  
        headerBtn.classList.toggle("change");
        loginContainer.classList.toggle("d-flex");
    }
   
});