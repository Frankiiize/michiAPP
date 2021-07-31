//import {Toast} from './sweetAlerts.js';
import {hammburBtn,Home} from './components/hamburger.js';
import {logout} from './utils/login.js';
import {closeModalBtn,showModal} from './components/modal.js';

var db = firebase.firestore(); 
//alert('hola')
let elimarDosisForm = document.querySelector('#elimarDosisForm');
let inputDocID = document.getElementById('eliminarDoc');
/* variables render */
let dosisMount = document.querySelector('.dosisCards');
let mascotaMount = document.querySelector('.petCards');
let dosisData = []
let mascotaData = [];
class dosisContructor {
    constructor(docId, userName, mascota, dosis,serverDate, medicamento){
        
        this.docId = docId,
        this.userName = userName,
        this.mascota = mascota,
        this.dosisTurno = dosis,
        this.serverDate = serverDate,
        this.medicamento = medicamento
    }
}
class mascotaCardConstructor {
    constructor(name, edad, peso, chip, foto){
        this.name = name,
        this.edad = edad,
        this.peso = peso,
        this.chip = chip,
        this.foto = foto
    }
}
/* variables render */

// Acordion variables
let accBtn = document.querySelectorAll('.acordionBtn');
// modalDosis variables
let modalDosis = document.querySelector('.modalDosis');
let ModalMascota = document.querySelector('.ModalMascota');
  /* eliminar */
let deleteModalDosis = document.querySelector('.modalDosisDelete');
  /* eliminar */
// modalDosis variables
//variables formulario dosis
let formDosis = document.querySelector('#form');
let name = document.querySelector('#name');
let checkD = document.querySelector('#dia');
let checkN = document.querySelector('#noche');
let medicamento = document.querySelector('#medicamento');
//variables formulario mascota
let formMascota = document.querySelector('#formMascota');
let nameMascota = document.querySelector('#mascota');
let chipMascota = document.querySelector('#chip');
let pesoMascota = document.querySelector('#peso');
let edadMascota = document.querySelector('#edad')
let maleMascota = document.querySelector('#checkM');
let femMascota = document.querySelector('#checkF');
let vetmascota = document.querySelector('#veterinario');
let vetControl = document.querySelector('#controlVet');
let photoMascota = document.querySelector('#photo');

//userData
let userNameSpan = document.querySelector('#userName');
//userData

//variables formulario dosis

function validadFormulario (ev) {
    ev.preventDefault();
    let user = firebase.auth().currentUser;  
    let ischeck1 = checkD.checked;
    let ischeck2 = checkN.checked;
//debugger
    if (user != null){
        if(ischeck1 ^ ischeck2 && name.value != '' && medicamento.value !=''){
            if(ischeck1){
                db.collection("dosis").add({
                    user: user.displayName,
                    mascota: name.value,
                    dosisTurno: checkD.value,
                    medicamento: medicamento.value,
                    userEmail: user.email,
                    userId: user.uid,
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
                      modalDosis.style.display = 'none';
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
            } else {
                db.collection("dosis").add({
                    user: user.displayName,
                    mascota: name.value,
                    dosisTurno: checkN.value,
                    medicamento: medicamento.value,
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
                      modalDosis.style.display = 'none';
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
async function upLoadPetPhoto () {
 
    let file = photoMascota.files[0]
    console.log(file)
    let user = firebase.auth().currentUser;
        let storageRef = firebase.storage().ref(`fotoMascotas/${user.uid}/${file.name}`);
        let task =  storageRef.put(file)
    
            task.on('state_changed', (snapshot) => {
            //debugger
            let bar = document.querySelector('.progesBar');
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
   
            bar.style.display = 'flex';
            if(progress == 100){
                
                bar.style.transition = '400ms'
               
                bar.style.width = progress + '%';
            }
            console.log('Upload is ' + progress + '% done');
        },
        err => {
            console.error('erro subiendo el archivo')
        },
        function getUrl () {

            task.snapshot.ref.getDownloadURL()
            .then(function(downloadURL) {
                console.log('File available at', downloadURL);
                localStorage.setItem('fotoMascota', downloadURL)
              }).catch(error => {
                console.log('error obteniendo url ' + error);
            })
        });
}
async function validarFormMascota (ev){
    ev.preventDefault();
    let user = firebase.auth().currentUser;
    let check1 = maleMascota.checked;
    let check2 = femMascota.checked; 
    if(user != null){
        console.log(user);  
        if(check1 ^ check2 && nameMascota.value != ""  && chipMascota.value != ""  && pesoMascota.value != "" && edadMascota.value != "" ){
            if(check1 && localStorage.length != 0){ 
                debugger
                console.log(+ nameMascota.value + nameMascota.value  + chipMascota.value  + pesoMascota.value + user.uid + vetmascota.value);
                 db.collection('mascotas').add({
                    mascota : nameMascota.value,
                    sexo: maleMascota.value,
                    chip: chipMascota.value ,
                    peso: pesoMascota.value,
                    edad: edadMascota.value,
                    veterinario: vetmascota.value,
                    ultimoControl: vetControl.value,
                    ownerId: user.uid,
                    ownerName: user.displayName,
                    foto: localStorage.fotoMascota,
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                
                })
                .then((docRef) => {
                    debugger
                    setTimeout(()=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Registro enviado',
                            text: ` Se registro a ${nameMascota.value}`,
                            buttonsStyling: false,                                            
                          })
                          ModalMascota.style.display = 'none';
                          formMascota.reset();
                          localStorage.clear()
                    },700);
                    console.log("Document written with ID: ", docRef.id);
                })
            } else if(check1 && localStorage.length == 0){
                console.log(+ nameMascota.value + nameMascota.value  + chipMascota.value  + pesoMascota.value + user.uid + vetmascota.value);
                 db.collection('mascotas').add({
                    mascota : nameMascota.value,
                    sexo: maleMascota.value,
                    chip: chipMascota.value ,
                    peso: pesoMascota.value,
                    edad: edadMascota.value,
                    veterinario: vetmascota.value,
                    ultimoControl: vetControl.value,
                    ownerId: user.uid,
                    ownerName: user.displayName,
                    foto: "../assets/icons/patita.png",
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()               
                })
                .then((docRef) => {
                    //debugger
                    setTimeout(()=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Registro enviado',
                            text: ` Se registro a ${nameMascota.value}`,
                            buttonsStyling: false,                                            
                          })
                          ModalMascota.style.display = 'none';
                          formMascota.reset();
                          localStorage.clear();
                    },700);
                    console.log("Document written with ID: ", docRef.id);
                })
            }
            else if(check2 && localStorage.length != 0) {
                console.log(femMascota.value + nameMascota.value  + chipMascota.value  + pesoMascota.value + user.uid + vetmascota.value)
                db.collection('mascotas').add({
                    mascota : nameMascota.value,
                    sexo: femMascota.value,
                    chip: chipMascota.value ,
                    peso: pesoMascota.value,
                    edad: edadMascota.value,
                    veterinario: vetmascota.value,
                    ultimoControl: vetControl.value,
                    ownerId: user.uid,
                    ownerName: user.displayName,
                    foto: localStorage.fotoMascota,
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then((docRef) => {
                    //debugger
                    setTimeout(()=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Registro enviado',
                            text: ` Se registro a ${nameMascota.value}`,
                            buttonsStyling: false,                                            
                          })
                          ModalMascota.style.display = 'none';
                          formMascota.reset();
                          localStorage.clear();               
                    },700);
                    console.log("Document written with ID: ", docRef.id);
                })
            } else if(check2 && localStorage.length == 0){
                console.log(femMascota.value + nameMascota.value  + chipMascota.value  + pesoMascota.value + user.uid + vetmascota.value)
                db.collection('mascotas').add({
                    mascota : nameMascota.value,
                    sexo: femMascota.value,
                    chip: chipMascota.value ,
                    peso: pesoMascota.value,
                    edad: edadMascota.value,
                    veterinario: vetmascota.value,
                    ultimoControl: vetControl.value,
                    ownerId: user.uid,
                    ownerName: user.displayName,
                    foto: "../assets/icons/patita.png",
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then((docRef) => {
                    //debugger
                    setTimeout(()=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Registro enviado',
                            text: ` Se registro a ${nameMascota.value}`,
                            buttonsStyling: false,                                            
                          })
                          ModalMascota.style.display = 'none';
                          formMascota.reset();
                          localStorage.clear();             
                    },700);
                    console.log("Document written with ID: ", docRef.id);
                })
            }
        }else if(check1 && check2){
            console.log('Incorrecto')
            Swal.fire({
             icon: 'error',
             title: 'Incorrecto',
             text: `Ooops...Solo puedes marcar un solo check para el sexo`,
             buttonsStyling: false,                      
           })
        }
        else{
            console.log('completa los campos')
            Swal.fire({
                icon: 'error',
                title: 'LLena los campos obligarotios',
                text: `Ooops...`,
                buttonsStyling: false,                      
              })
        }
    }else {
        console.log('No hay user');
    }
}
function showAcc (btn) {
    btn.classList.toggle('active');
    let card = btn.nextElementSibling;
    if(card.style.maxHeight){
        card.style.maxHeight = null;
    } else {
        card.style.maxHeight = card.scrollHeight + 'px';
    }
}
function renderMascotaCard (array) {
    for(let item of array){
        let cardContainer = document.createElement('div');
        cardContainer.classList.add('petCards__card');
        if(item.foto === '../assets/icons/patita.png'){
            cardContainer.innerHTML = `<div class="petCards__card-img">
                                        <img style="
                                        width: 24px;
                                        height: 24px;
                                    " src="${item.foto}" alt="">
                                        <span>${item.name}</span>
                                    </div>
                                    <div class="petCards__card-description">
                                        <div class="petCards__card-description__edad">
                                            <span>Edad:</span>
                                            <span>${item.edad}</span>
                                        </div>
                                        <div class="petCards__card-description__peso">
                                            <span>Peso:</span>
                                            <span>${item.peso}</span>
                                        </div>
                                        <div class="petCards__card-description__chip">
                                            <span>Chip:</span>
                                            <span>${item.chip}</span>
                                        </div>
                                    </div>`;
            mascotaMount.append(cardContainer);
        }else {

            cardContainer.innerHTML = `<div class="petCards__card-img">
                                        <img src="${item.foto}" alt="">
                                        <span>${item.name}</span>
                                    </div>
                                    <div class="petCards__card-description">
                                        <div class="petCards__card-description__edad">
                                            <span>Edad:</span>
                                            <span>${item.edad}</span>
                                        </div>
                                        <div class="petCards__card-description__peso">
                                            <span>Peso:</span>
                                            <span>${item.peso}</span>
                                        </div>
                                        <div class="petCards__card-description__chip">
                                            <span>Chip:</span>
                                            <span>${item.chip}</span>
                                        </div>
                                    </div>`;
            mascotaMount.append(cardContainer);
        }

    }
} 
let getMascotas = () => {
    firebase.auth().onAuthStateChanged((userloged) => {
        const user = firebase.auth().currentUser; 
        //console.log(user)
        if(user != null) {
            db.collection('mascotas')
            .where('ownerId', '==', user.uid )
            .orderBy('serverDate', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) =>{
                    console.log(doc.id, " => ", doc.data());
                    let name = doc.data().mascota;
                    let edad = doc.data().edad;
                    let peso = doc.data().peso;
                    let chip = doc.data().chip;
                    let foto = doc.data().foto;
                    console.log(`${name} ${edad} ${peso} ${chip} ${foto}`)
                    mascotaData.push(new mascotaCardConstructor(name,edad,peso,chip,foto));

                })
                console.log(mascotaData);
                renderMascotaCard(mascotaData); 
            })
        }
    });
}
let getDosisUsuario = () => {
    firebase.auth().onAuthStateChanged((userloged) => {
        const user = firebase.auth().currentUser;
        
        if(user) {
            const userEmail = user.email;
            //debugger
            //console.log(`usuario ${userEmail}`);
            db.collection('dosis')
            .where('userId', '==', user.uid )
            .orderBy('serverDate', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  //  debugger
                    //console.log(doc.id, " => ", doc.data());
                    let docId = doc.id;
                    let userName =  doc.data().user; 
                    let mascota =  doc.data().mascota;
            
                    let dosis =  doc.data().dosisTurno;
                    let serverDate = doc.data().serverDate;
                    let medicamento = doc.data().medicamento
                    dosisData.push(new dosisContructor(docId, userName, mascota, dosis,serverDate, medicamento))
                })
              //  console.log(dosisData);
                renderDosisCard(dosisData);
            }) 
           

        }else {
            console.log('no hay nadie loging')
        }
    })
}
const getDosisRealTime = () => {
    //debugger
    return new Promise ((resolve,reject) => {
        firebase.auth().onAuthStateChanged((userloged) => {
            if(userloged){
                db.collection("dosis")
                .where('userId', '==', userloged.uid )
                .orderBy('serverDate', 'desc')
                .limit(1)
                .onSnapshot((querySnapshot) => {
            
                    if(querySnapshot.metadata.hasPendingWrites){
                        querySnapshot.forEach((doc) => {
                            resolve(doc.data())
                       
                        });
                    }else {
                        console.log('nada por escribir')
                    }
                    
                });
            }else {
                reject((error) => {
                    console.log(error)
                });

            }
            //resolve(userloged);
        });
        
      
    })
}
getDosisRealTime()
.then((data)=>{
console.log(data)
    let docId = data.userId;
    let userName =  data.user; 
    let mascota =  data.mascota;

    let dosis =  data.dosisTurno;
    let serverDate = new Date();
    let medicamento = data.medicamento
console.log(docId + userName + mascota + dosis +serverDate + medicamento );
renderRealtime(mascota,userName,dosis,medicamento,serverDate); 
}).catch(error => {
    console.log(error)
})
function renderDosisCard (array) {
//debugger
    for(let item of array){ 
        let cardContainer = document.createElement('div');
        cardContainer.classList.add('dosisCards__card');
        dosisMount.append(cardContainer);
    
    
        let mascota = document.createElement('div');
        mascota.classList.add('dosisCards__card-mascota');
        let iconM = document.createElement('i');
        let spanM = document.createElement('span');
        iconM.classList.add('mascota-icon');
        spanM.append(`${item.mascota}`);
        mascota.append(iconM,spanM);
    
    
    
        let user = document.createElement('div');
        user.classList.add('dosisCards__card-user');
        let iconU = document.createElement('i');
        let spanU = document.createElement('span');
        iconU.classList.add('user-icon');
        spanU.append(`${item.userName}`);
        user.append(iconU,spanU);
        
    //debugger
    
        let med = document.createElement('div');
        med.classList.add('dosisCards__card-med');
        let iconMed = document.createElement('i');
        let spanMed = document.createElement('span');
        let spanNameMed = document.createElement('span')
        let spanRender = document.createElement('div');
        spanRender.classList.add('dosisCards__card-med__text')
        iconMed.classList.add('dosis-icon');
        spanMed.append(`${item.dosisTurno}`);
        spanNameMed.append(`${item.medicamento}`)
        spanRender.append(spanMed,spanNameMed)
        med.append(iconMed,spanRender);
        //debugger
        //let fecha = new Date(item.serverDate.seconds)
        //console.log(fecha)
        let seconds = item.serverDate.seconds;
        let fecha = new Date(0);
        fecha.setUTCSeconds(seconds);
        //console.log(fecha)
       
        let date = document.createElement('div');
        date.classList.add('dosisCards__card-date');
        let iconD = document.createElement('i');
        let spanD = document.createElement('span');
        iconD.classList.add('fecha-icon');
        spanD.append(`${fecha}`);
        date.append(iconD,spanD);
    
        cardContainer.append(mascota,user,med,date); 
    }
}
function renderRealtime(mascota, userName, dosis, medicamento, serverDate){
    //debugger
    let cardContainer = document.createElement('div');
    cardContainer.classList.add('dosisCards__card');
    



    let mascotaC = document.createElement('div');
    mascotaC.classList.add('dosisCards__card-mascota');
    let iconM = document.createElement('i');
    let spanM = document.createElement('span');
    iconM.classList.add('mascota-icon');
    spanM.append(`${mascota}`);
    mascotaC.append(iconM,spanM);



    let userC = document.createElement('div');
    userC.classList.add('dosisCards__card-user');
    let iconU = document.createElement('i');
    let spanU = document.createElement('span');
    iconU.classList.add('user-icon');
    spanU.append(`${userName}`);
    userC.append(iconU,spanU);


    let medC = document.createElement('div');
    medC.classList.add('dosisCards__card-med');
    let iconMed = document.createElement('i');
    let spanMed = document.createElement('span');
    let spanNameMed = document.createElement('span')
    let spanRender = document.createElement('div');
    spanRender.classList.add('dosisCards__card-med__text')
    iconMed.classList.add('dosis-icon');
    spanMed.append(`${dosis}`);
    spanNameMed.append(`${medicamento}`)
    spanRender.append(spanMed,spanNameMed)
    medC.append(iconMed,spanRender);
    //debugger
    //let fecha = new Date(item.serverDate.seconds)
    //console.log(fecha)
    let seconds = serverDate.seconds;
    let fechaS = new Date();
    console.log(fechaS)
   
    let date = document.createElement('div');
    date.classList.add('dosisCards__card-date');
    let iconD = document.createElement('i');
    let spanD = document.createElement('span');
    iconD.classList.add('fecha-icon');
    spanD.append(`${fechaS}`);
    date.append(iconD,spanD);
    cardContainer.append(mascotaC,userC,medC,date); 
    dosisMount.insertAdjacentElement('afterbegin',cardContainer);
}
 function eliminarDosis (ev) {
    ev.preventDefault();
    const user = firebase.auth().currentUser;
    if(user){
        console.log(user.displayName)
        db.collection("dosis").doc(inputDocID.value).delete()
        .then(() => {
            console.log("Document successfully deleted!");
            Swal.fire({
                icon: 'success',
                title: 'eliminado',
                buttonsStyling: false,                                            
              }) 
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }else {
        console.log('no hay user')
    }
    
} 
function renderUserData () {
    let imgMout = document.querySelector('.userContainer__img');
    firebase.auth().onAuthStateChanged((user)=>{
        //console.log(user);
        if(user){
            //debugger
            let name = user.displayName;
            let userImg = new Image();
            userNameSpan.append(name);
            userImg.src = `${user.photoURL}`;
           
            imgMout.append(userImg);
        }
    })
}
function acordion() {
    for(let btn of accBtn){
        
        btn.addEventListener('click', (event) => {
            if(event.target.classList[0] == "displayBtn"){
                showAcc(btn);
            } else if(event.target.classList[0] == "plus"){           
                if(btn.nextElementSibling.classList[0] == "dosisCards" ){
                    showModal(modalDosis);            
                    
                }else if(btn.nextElementSibling.classList[0] == "petCards") {
                    showModal(ModalMascota)
                    
                }
               
            } else if(event.target.classList[0] == "deleteMenos"){
                if(btn.nextElementSibling.classList[0] == "dosisCards" ){           
                    showModal(deleteModalDosis);
                }
            } 
            else {
                console.log(event.target)
            }
            
        })
    }
}
document.addEventListener("DOMContentLoaded",function() {
    localStorage.clear();
    console.log(localStorage)
    photoMascota.addEventListener('change', () => {
        upLoadPetPhoto();
    } );
    formDosis.addEventListener('submit', validadFormulario);
    formMascota.addEventListener('submit', validarFormMascota);
    elimarDosisForm.addEventListener('submit', eliminarDosis);
    Home();
    hammburBtn();
    logout();
    renderUserData ();
    acordion();
    getDosisUsuario();
    getMascotas();
});