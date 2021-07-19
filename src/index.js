
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

//variables baseDatos
var db = firebase.firestore(); 
//variables baseDatos

//variables imprimir data
let docData = [];
let dataMout = document.querySelector('#dataSection');

//variables imprimir data

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


function validadFormulario (ev) {
    
    ev.preventDefault();
    let user = firebase.auth().currentUser;  
    let ischeck1 = checkD.checked;
    let ischeck2 = checkN.checked;
//debugger
    if (user){
        if(ischeck1 ^ ischeck2 && name.value != '' && fecha.value !=''){
            if(ischeck1){
                db.collection("dosis").add({
                    user: user.displayName,
                    mascota: name.value,
                    dosisTurno: checkD.value,
                    fecha: fecha.value,
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro enviado',
                        text: `${name.value} tomo su docis del ${checkD.value}`,
                        buttonsStyling: false,                                            
                      })
                      
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
            } else {
                db.collection("dosis").add({
                    user: user.displayName,
                    mascota: name.value,
                    dosisTurno: checkN.value,
                    fecha: fecha.value,
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro enviado',
                        text: `${name.value} tomo su docis de la ${checkN.value}`,
                        buttonsStyling: false,                      
                      })
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
            }
        } else if (ischeck1 && ischeck2)  {
           console.log('Incorrecto')
           Swal.fire({
            icon: 'error',
            title: 'Incorrecto',
            text: `Ooops... no puedes marcar dia y noche a la misma vez`,
            buttonsStyling: false,                      
          })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'LLena los campos',
                text: `Ooops...`,
                buttonsStyling: false,                      
              })
        }
    } else {
        console.log('tienes que estar registrado')
        Swal.fire({
            icon: 'error',
            title: 'tienes que estar registrado',
            text: `Ooops... habla con frankiDios para que te registre`,
            buttonsStyling: false,                      
          })
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
        Swal.fire({
            icon: 'error',
            title: `${errorCode} ${email}`,
            text: `${errorMessage}`,
            buttonsStyling: false,                      
          })
        // ...
    });
}


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

class dbData {
    constructor(docId, userName, mascota, fecha, dosis,serverDate){
        
        this.docId = docId,
        this.userName = userName,
        this.mascota = mascota,
        this.fecha = fecha,
        this.dosisTurno = dosis,
        this.serverDate = serverDate
    }
}




let consultarDosis = async () => {
   
    await db.collection("dosis")
    .orderBy("serverDate", "desc").get()
    .then((querySnapshot) => {
        //debugger
        querySnapshot.forEach((doc) => {
           // debugger
            // doc.data() is never undefined for query doc snapshots
           // console.log(doc.id, " => ", doc.data());
            let docId = doc.id;
            let userName =  doc.data().user; 
            let mascota =  doc.data().mascota;
            let fecha =  doc.data().fecha;
            let dosis =  doc.data().dosisTurno;
            let serverDate = doc.data().serverDate;
            docData.push(new dbData(docId, userName, mascota,fecha,dosis,serverDate))
            //renderData(userName,mascota,fecha,dosisTurno);
            console.log(docData)
        })
    }).catch(error => {
        console.error(error);
    });
    //debugger

    console.log(docData)
    renderDocData (docData) ;
}

function renderDocData (array) {
   for(let item of array){
       //debugger
        console.log(item.docId)
        let divCards = document.createElement('div');
        divCards.classList = 'dataSection__cardsContainer';

        let userContainer = document.createElement('div');
        let mascotaContainer = document.createElement('div');
        let fechaContainer = document.createElement('div');
        let dosisContainer = document.createElement('div');
        
        userContainer.classList = 'dataSection__cardsContainer-user';
        mascotaContainer.classList = 'dataSection__cardsContainer-mascota';
        fechaContainer.classList = 'dataSection__cardsContainer-fecha';
        dosisContainer.classList = 'dataSection__cardsContainer-dosis'

        userContainer.innerHTML = `<i class="user-icon"></i>
                                   <span>Modificado:</span>
                                   <span>${item.userName}</span>`;

        mascotaContainer.innerHTML = `<i class="mascota-icon"></i>
                                      <span>Mascota:</span>
                                      <span>${item.mascota}</span>`;

        fechaContainer.innerHTML = `<i class="fecha-icon"></i>
                                    <span>fecha:</span>
                                    <span>${item.fecha}</span>`;

        dosisContainer.innerHTML = `<i class="dosis-icon"></i>
                                    <span>Dosis:</span>
                                     <span>${item.dosisTurno}</span>`;
                                   
        divCards.append(mascotaContainer);
        divCards.append(userContainer);
        divCards.append(fechaContainer);
        divCards.append(dosisContainer);
        dataMout.append(divCards);


   }
}

document.addEventListener("DOMContentLoaded",function() {
    form.addEventListener('submit', validadFormulario);
    googleBtn.addEventListener('click',loginWhitGoogle);

    hammburBtn();
    validarLogin();
    logout();
    consultarDosis();
 



   
});