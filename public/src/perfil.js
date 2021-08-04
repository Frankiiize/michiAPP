//import {Toast} from './sweetAlerts.js';
import {hammburBtn,Home} from './components/hamburger.js';
import {logout} from './utils/login.js';
import {closeModalBtn,showModal} from './components/modal.js';

var db = firebase.firestore(); 
//alert('hola')
let elimarDosisForm = document.querySelector('#elimarDosisForm');
let eliminarMount = document.getElementById('eliminarDosis');
let eliminarMascotaForm = document.querySelector('#eliminarMascotaForm');

/* variables render */
let dosisMount = document.querySelector('.dosisCards');
let mascotaMount = document.querySelector('.petCards');
let medMount = document.querySelector('.medCards')
let dosisData = []
let mascotaData = [];
let medData = [];
let selecMascotaOptions = document.querySelector('#mascotas');
let selecMascotaOptMed = document.querySelector('#mascotasmed');
let selecMascotaDelete = document.querySelector('#eliminarMascota')
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
    constructor(name, edad, peso, chip, foto,mascotaID){
        this.name = name,
        this.edad = edad,
        this.peso = peso,
        this.chip = chip,
        this.foto = foto,
        this.mascotaId = mascotaID
    }
}
class medContructor {
    constructor(docId, mascota, medicamento, dosisAmount,administracion){
        this.docId = docId,
        this.mascota = mascota,
        this.medicamento = medicamento,
        this.dosisAmount = dosisAmount,
        this.administracion = administracion
    }
}
/* variables render */

// Acordion variables
let accBtn = document.querySelectorAll('.acordionBtn');
// modalDosis variables
let modalDosis = document.querySelector('.modalDosis');
let ModalMascota = document.querySelector('.ModalMascota');
let modalMed = document.querySelector('.modalMed');
  /* eliminar */
let deleteModalDosis = document.querySelector('.modalDosisDelete');
let deleteModalMascota = document.querySelector('.modalMascotaDelete')
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
let edadMascota = document.querySelector('#edad')//
let maleMascota = document.querySelector('#checkM');
let femMascota = document.querySelector('#checkF');
let vetmascota = document.querySelector('#veterinario');
let vetControl = document.querySelector('#controlVet');
let photoMascota = document.querySelector('#photo');
// variables formulario Medicamentos
let formMed = document.querySelector('#formMed');
let medName = document.querySelector('#medName');
let dosisAmount = document.querySelector('#dosisAmount');
let administracion = document.querySelector('#administracion');
//userData
let userNameSpan = document.querySelector('#userName');
//userData

//variables formulario dosis

function validadFormulario (ev) {
    ev.preventDefault();
    //selectOption (); 
    console.log(selectOption())
    let mascotaName = selectOption();
    let user = firebase.auth().currentUser;  
    let ischeck1 = checkD.checked;
    let ischeck2 = checkN.checked;
//debugger
    if (user != null){
        if(ischeck1 ^ ischeck2 && mascotaName != '' && medicamento.value !=''){
            if(ischeck1){
                db.collection("dosis").add({
                    user: user.displayName,
                    mascota: mascotaName,
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
                        text: `${mascotaName} tomo su docis del ${checkD.value}`,
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
                    mascota: mascotaName,
                    dosisTurno: checkN.value,
                    medicamento: medicamento.value,
                    serverDate: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro enviado',
                        text: `${mascotaName} tomo su docis de la ${checkN.value}`,
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
               // debugger
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
                   // debugger
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
function validarFormMed (ev) {
    ev.preventDefault()
    let mascotaName = selectOptionMed () ;
    let user = firebase.auth().currentUser;
    if(user != null){
        if(medName.value != "" && dosisAmount.value != "" && administracion.value != ""){
            db.collection('medicinas').add({
                medicina : medName.value,
                nombre : mascotaName,
                cantidad : dosisAmount.value,
                administracion : administracion.value,
                user : user.displayName,
                userId : user.uid,
                serverDate: firebase.firestore.FieldValue.serverTimestamp()

            })
            .then((docRef) => {
                //debugger
                setTimeout(()=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro enviado',
                        text: ` Medicamento ${medName.value} registrado para ${mascotaName}`,
                        buttonsStyling: false,                                            
                      })
                      modalMed.style.display = 'none';
                      formMed.reset();
                    
                },700);
                console.log("Document written with ID: ", docRef.id);
            })
            console.log(mascotaName + "" +medName.value  + "" + dosisAmount.value + "" + administracion.value)
        }else {
            Swal.fire({
                icon: 'error',
                title: 'LLena los campos obligarotios',
                text: `Ooops...`,
                buttonsStyling: false,                      
              })
        }
    }else {
        console.log('no hay user')
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

function selectOption () {
    console.log(selecMascotaOptions.value)
    return selecMascotaOptions.value;
}
function selectOptionMed () {
    console.log(selecMascotaOptMed.value)
    return selecMascotaOptMed.value;
}
function selecOptionEliminar () {
    console.log(eliminarMount.value)
    return eliminarMount.value;
}
function selectOptionMascotaDelete(){
    //debugger
    console.log(selecMascotaDelete.value)
    return selecMascotaDelete.value
}
let getMascotas = () => {
    //debugger
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
                    //debugger
                    //console.log(doc.id, " => ", doc.data());
                    let name = doc.data().mascota;
                    let edad = doc.data().edad;
                    let peso = doc.data().peso;
                    let chip = doc.data().chip;
                    let foto = doc.data().foto;
                    let mascotaID = doc.id
                    //console.log(`${name} ${edad} ${peso} ${chip} ${foto}`)
                    mascotaData.push(new mascotaCardConstructor(name,edad,peso,chip,foto,mascotaID));

                })
               // console.log(mascotaData);
                renderMascotaCard(mascotaData); 
            }).catch((error) => console.log(error));
        }
    });
}
let getDosisUsuario = () => {
    firebase.auth().onAuthStateChanged((userloged) => {
        const user = firebase.auth().currentUser;
        
        if(user) {
            //debugger
            const userEmail = user.email;
            //debugger
            //console.log(`usuario ${userEmail}`);
            db.collection('dosis')
            .where('userId', '==', user.uid )
            .orderBy('serverDate', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  //debugger
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
            }).catch((error) => console.log(error));
           

        }else {
            console.log('no hay nadie loging')
        }
    })
}
let getMedicamentos = () => {
    firebase.auth().onAuthStateChanged((userloged) => {
        const user = firebase.auth().currentUser;
        const userName = user.displayName;
        const userID = user.uid
        console.log(user.uid)
        if(userloged != null){
            db.collection('medicinas')
            .where('userId', '==', user.uid )
            .orderBy('serverDate', 'desc')
            .get()
            .then ((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //  debugger
                    console.log(doc.id, " => ", doc.data());
                    let docId = doc.id;
                    let mascota = doc.data().nombre;
                    let medicamento = doc.data().medicina;
                    let dosisAmount = doc.data().cantidad;
                    let administracion = doc.data().administracion;
                 
                    medData.push(new medContructor(docId, mascota, medicamento, dosisAmount,administracion))

                })
                console.log(medData)
                renderMedCard(medData);
            }).catch((error) => console.log(error));
        }
    })
}
const getDosisRealTime = () => {
        firebase.auth().onAuthStateChanged((userloged) => {
            if(userloged){
                db.collection("dosis")
                .where('userId', '==', userloged.uid )
                .orderBy('serverDate', 'desc')
                .limit(1)
                .onSnapshot((querySnapshot) => {   
                    if(querySnapshot.metadata.hasPendingWrites){
                        querySnapshot.forEach((data) => {
                            console.log(data)
                            let docId = data.data().userId;
                            let userName =  data.data().user; 
                            let mascota =  data.data().mascota;

                            let dosis =  data.data().dosisTurno;
                            let serverDate = new Date();
                            let medicamento = data.data().medicamento
                        console.log(docId + userName + mascota + dosis +serverDate + medicamento );
                        renderRealtime(mascota,userName,dosis,medicamento,serverDate);                       
                        });
                    }else {
                        console.log('nada por escribir')
                    }                
                });
            }
            //resolve(userloged);
        });
}
const getMascotasRealTime = () => {
    //debugger
    firebase.auth().onAuthStateChanged((userloged) => {
        const user = firebase.auth().currentUser; 
        //debugger
        if(userloged != null){
            db.collection("mascotas")
            .where('ownerId', '==', user.uid )
            .orderBy('serverDate', 'desc')
            .limit(1)
            .onSnapshot((querySnapshot) => {
              //  debugger
                if(querySnapshot.metadata.hasPendingWrites){
                    querySnapshot.forEach((data) => {
                        console.log(data)
                        let name = data.data().mascota;
                        let edad = data.data().edad;
                        let peso = data.data().peso;
                        let chip = data.data().chip;
                        let foto = data.data().foto;
                        let mascotaId = data.id
                        renderMascotaRealTime(name,edad,peso,chip,foto,mascotaId )
                    })
                }else {
                    console.log('sin mascota realTime')
                }
            });
    
        }
    });
}
function renderMedCard(array){
    for(let item of array){
        let cardContainer = document.createElement('div');
        cardContainer.classList.add('medCards__card');
        cardContainer.innerHTML = `  <div class="medCards__card-title">
                                        <i class="dosis-icon"></i>
                                        <span>${item.medicamento}</span>
                                    </div>
                                    <div class="medCards__card-table">
                                        <div class="medCards__card-table__nombre">
                                            <span>Nombre</span>
                                            <span>${item.mascota}</span>
                                        </div>

                                        <div class="medCards__card-table__dosis">
                                            <span>Dosis</span>
                                            <span>${item.dosisAmount}</span>
                                        </div>

                                        <div class="medCards__card-table__administracion">
                                            <span>Administracion</span>
                                            <span>${item.administracion}</span>
                                        </div>
                                    </div>`
        
        medMount.append(cardContainer);
        
    }
}
function renderMascotaCard (array) {
    for(let item of array){
       // debugger
        let cardContainer = document.createElement('div');
        let opcion = document.createElement('option');
        let opcionMed = document.createElement('option');
        let opcionDeteleMascota = document.createElement('option')
        cardContainer.classList.add('petCards__card');
        //console.log(opcion)
        opcion.value = `${item.name}`;
        opcion.append(`${item.name}`);
        opcionMed.value = `${item.name}`;
        opcionMed.append(`${item.name}`);
        opcionDeteleMascota.append(`${item.name}`);
        opcionDeteleMascota.value = `${item.mascotaId}`;
        
        
        //debugger
        selecMascotaOptions.append(opcion);
        selecMascotaOptMed.append(opcionMed);
        selecMascotaDelete.append(opcionDeteleMascota);
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
function renderMascotaRealTime(name,edad,peso,chip,foto,mascotaId) {
    //debugger
    let cardContainer = document.createElement('div');
    let opcion = document.createElement('option');
    let opcionMed = document.createElement('option');
    let opcionDeteleMascota = document.createElement('option');
    cardContainer.classList.add('petCards__card');
    //console.log(opcion)
    opcion.value = `${name}`;
    opcion.append(`${name}`);
    opcionMed.value = `${name}`;
    opcionMed.append(`${name}`);
    opcionDeteleMascota.append(`${name}`);
    opcionDeteleMascota.value = `${mascotaId}`;

    selecMascotaOptions.insertAdjacentElement('afterbegin',opcion)
    selecMascotaDelete.insertAdjacentElement('afterbegin',opcionDeteleMascota);
    selecMascotaOptMed.insertAdjacentElement('afterbegin',opcionMed);
    if(foto === '../assets/icons/patita.png'){
        cardContainer.innerHTML = `<div class="petCards__card-img">
                                    <img style="
                                    width: 24px;
                                    height: 24px;
                                " src="${foto}" alt="">
                                    <span>${name}</span>
                                </div>
                                <div class="petCards__card-description">
                                    <div class="petCards__card-description__edad">
                                        <span>Edad:</span>
                                        <span>${edad}</span>
                                    </div>
                                    <div class="petCards__card-description__peso">
                                        <span>Peso:</span>
                                        <span>${peso}</span>
                                    </div>
                                    <div class="petCards__card-description__chip">
                                        <span>Chip:</span>
                                        <span>${chip}</span>
                                    </div>
                                </div>`;
        mascotaMount.insertAdjacentElement('afterbegin',cardContainer);
    }else {

        cardContainer.innerHTML = `<div class="petCards__card-img">
                                    <img src="${foto}" alt="">
                                    <span>${name}</span>
                                </div>
                                <div class="petCards__card-description">
                                    <div class="petCards__card-description__edad">
                                        <span>Edad:</span>
                                        <span>${edad}</span>
                                    </div>
                                    <div class="petCards__card-description__peso">
                                        <span>Peso:</span>
                                        <span>${peso}</span>
                                    </div>
                                    <div class="petCards__card-description__chip">
                                        <span>Chip:</span>
                                        <span>${chip}</span>
                                    </div>
                                </div>`;
   
        mascotaMount.insertAdjacentElement('afterbegin',cardContainer);
    }
}
function renderDosisCard (array) {
    //debugger
    for(let item of array){ 
        //debugger
        let cardContainer = document.createElement('div');
        cardContainer.classList.add('dosisCards__card');
            cardContainer.dataset.id = `${item.docId}`
        dosisMount.append(cardContainer);
        let eliminarOption = document.createElement('option');
        eliminarOption.append(`${item.mascota}`)
        eliminarOption.value = `${item.docId}`;
        eliminarMount.append(eliminarOption);
    
    
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
    //debugger
    const user = firebase.auth().currentUser;
    let cards = document.querySelectorAll('.dosisCards__card');
    
    
   
    if(user){
        console.log(user.displayName)
        db.collection("dosis").doc(selecOptionEliminar()).delete()
        .then((doc) => {
            console.log("Document successfully deleted!" + selecOptionEliminar());
            Swal.fire({
                icon: 'success',
                title: 'eliminado',
                buttonsStyling: false,                                            
              })
              .then(() => {
                  location.reload();
              })
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }else {
        console.log('no hay user')
    }
} 
function eliminarMascota (ev){
    ev.preventDefault();
    //debugger
    const user = firebase.auth().currentUser;

    if(user != null){
        db.collection('mascotas').doc(selectOptionMascotaDelete()).delete()
        .then((doc) => {
            console.log("Document successfully deleted!" + selecOptionEliminar() );
            Swal.fire({
                icon: 'success',
                title: 'eliminado',
                buttonsStyling: false,                                            
              })
              .then(() => {
                  location.reload();
              })
        }).catch((error) => {
            console.error("Error removing document: ", error)
        });
    } else {
        console.log('no hay user');
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
        //debugger
        btn.addEventListener('click', (event) => {
            if(event.target.classList[0] == "displayBtn"){
                showAcc(btn);
            } else if(event.target.classList[0] == "plus"){     
                //debugger      
                if(btn.nextElementSibling.classList[0] == "dosisCards" ){
                    showModal(modalDosis);            
                    
                }else if(btn.nextElementSibling.classList[0] == "petCards") {
                    showModal(ModalMascota)
                    
                }else if(btn.nextElementSibling.classList[0]  == "medCards"){
                    showModal(modalMed);
                }else {
                    console.log(event.target)
                }
            } else if(event.target.classList[0] == "deleteMenos"){
                if(btn.nextElementSibling.classList[0] == "dosisCards" ){           
                    showModal(deleteModalDosis);
                } else if(btn.nextElementSibling.classList[0] == "petCards"){
                    showModal(deleteModalMascota);
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
    });
    formDosis.addEventListener('submit', validadFormulario);
    formMascota.addEventListener('submit', validarFormMascota);
    formMed.addEventListener('submit', validarFormMed )
    elimarDosisForm.addEventListener('submit', eliminarDosis);
    eliminarMascotaForm.addEventListener('submit',eliminarMascota);
    selecMascotaOptions.addEventListener('change', selectOption);
    selecMascotaOptMed.addEventListener('change', selectOptionMed);
    selecMascotaDelete.addEventListener('change', selectOptionMascotaDelete )
    eliminarMount.addEventListener('change', selecOptionEliminar)
    Home();
    hammburBtn();
    logout();
    renderUserData ();
    acordion();
    getDosisUsuario();
    getMascotas();
    getMedicamentos();
    getDosisRealTime();
    getMascotasRealTime();
});