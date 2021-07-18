
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
    let user = firebase.auth().currentUser;  
    let ischeck1 = checkD.checked;
    let ischeck2 = checkN.checked;
debugger
    if (user){
        if(ischeck1 ^ ischeck2 && name.value != '' && fecha.value !=''){
            if(ischeck1){

                db.collection("dosis").add({
                    user: user.email,
                    mascota: name.value,
                    dosisTurno: checkD.value,
                    fecha: fecha.value,
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
            } else {
                db.collection("dosis").add({
                    user: user.email,
                    mascota: name.value,
                    dosisTurno: checkN.value,
                    fecha: fecha.value,
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
            }
            
            
            console.log(`success ${name.value} ${checkD.value} ${checkN.value} ${fecha.value} `)
        } else  {
           console.log('llena los campos')
        }
    } else {
        console.log('tienes que estar registrado')
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

/* let consultarDosisPromise = () => {
    debugger
    new Promise((resolve, rejec) =>{
        debugger
        db.collection("dosis").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                let userName = doc.data().user; 
            let mascota = doc.data().mascota;
            let fecha = doc.data().fecha;
            let dosisTurno = doc.data().dosisTurno;
            docData.push(new dbData(userName, mascota,fecha,dosisTurno))
            console.log(docData)
            

            })
        })
        .catch((error) => {
            console.error(error);
        })
    });
    
} */



let consultarDosis = async () => {
    let dataMout = document.querySelector('#dataSection');
    await db.collection("dosis").get()
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
    debugger

    console.log(docData)
    renderDocData (docData) ;
    
}
function renderDocData (array) {
   for(let item of array){
       //debugger
        console.log(item.docId)
        let div = document.createElement('div');
        let spanName = document.createElement('span');
        let spanMascota = document.createElement('span');
        let spanFecha = document.createElement('span');
        let spandosisTurno = document.createElement('span');

        spanName.append(item.userName);
        spanMascota.append(item.mascota);
        spanFecha.append(item.fecha);
        spandosisTurno.append(item.dosisTurno);
        div.append(spanName);
        div.append(spanMascota);
        div.append(spanFecha);
        div.append(spandosisTurno);
        dataMout.append(div);


   }
}


/* 
function renderData (userName,mascota,fecha,dosisTurno) {
    //debugger
    let div = document.createElement('div');
    let spanName = document.createElement('span');
    let spanmascota = document.createElement('span');
    let spanfecha = document.createElement('span');
    let spandosisTurno = document.createElement('span');

    spanName.append(userName);
    spanmascota.append(mascota);
    spanfecha.append(fecha);
    spandosisTurno.append(dosisTurno);
    div.appendChild(spanName);
    div.appendChild(spanmascota);
    div.appendChild(spanfecha);
    div.appendChild(spandosisTurno);
    dataMout.append(div);
} */


document.addEventListener("DOMContentLoaded",function() {
    form.addEventListener('submit', validadFormulario);
    //loginForm.addEventListener('submit', validarLogin);
    googleBtn.addEventListener('click',loginWhitGoogle);

    hammburBtn();
    validarLogin();
    logout();
    consultarDosis();
 
    //consultarDosisDate();
    //consultarDosisPromise();
    //renderDbData();



   
});