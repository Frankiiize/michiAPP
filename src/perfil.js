//import {Toast} from './sweetAlerts.js';
import {hammburBtn,Home} from './components/hamburger.js'
import {logout} from './utils/login.js'

var db = firebase.firestore(); 
//alert('hola')
let elimarDosisForm = document.querySelector('#elimarDosisForm');
let inputDocID = document.getElementById('eliminarDoc');
/* variables render */
let dosisMount = document.querySelector('.dosisCards');
let dosisData = []
class dosisContructor {
    constructor(docId, userName, mascota, fecha, dosis,serverDate, medicamento){
        
        this.docId = docId,
        this.userName = userName,
        this.mascota = mascota,
        this.fecha = fecha,
        this.dosisTurno = dosis,
        this.serverDate = serverDate,
        this.medicamento = medicamento
    }
}
/* variables render */

// Acordion variables
let accBtn = document.querySelectorAll('.acordionBtn');
// modalDosis variables
let addDosisPlus = document.querySelector('#addDosis');
let modalDosis = document.querySelector('.modalDosis');
let closeModal = document.querySelectorAll('.closIconDosisModal');
  /* eliminar */
let deleteDosis = document.querySelector('#deleteDosis');
let deleteModalDosis = document.querySelector('.modalDosisDelete');
  /* eliminar */
// modalDosis variables
//variables formulario dosis
let form = document.querySelector('#form');
let name = document.querySelector('#name');
let checkD = document.querySelector('#dia');
let checkN = document.querySelector('#noche');
let medicamento = document.querySelector('#medicamento');

//userData
let userNameSpan = document.querySelector('#userName');
let userImg = document.querySelector('#userImg');
//userData

//variables formulario dosis

function validadFormulario (ev) {
    ev.preventDefault();
    let user = firebase.auth().currentUser;  
    let ischeck1 = checkD.checked;
    let ischeck2 = checkN.checked;
//debugger
    if (user){
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
function closeModalBtn (contenedor) {
    for(let i = 0; i<closeModal.length; i++){
        
        closeModal[i].addEventListener('click', () =>{
            contenedor.style.display = 'none';
        })
    }
}
function showDeleteModal() {
    deleteDosis.onclick = (ev) => {
        ev.stopPropagation();
        if(deleteModalDosis.style.display = 'none'){
            deleteModalDosis.style.display = 'flex'
            closeModalBtn(deleteModalDosis);
        } else {
            deleteModalDosis.style.display = 'none';
        }
    }
}
function showModal() {
    addDosisPlus.onclick = (ev) => {
        ev.stopPropagation();
        if(modalDosis.style.display == 'none'){
            modalDosis.style.display = 'flex'
           // debugger
           closeModalBtn (modalDosis)
        } else {
            modalDosis.style.display = 'none';
        }
    }
}
function showAcc () {
    for(let i = 0; i < accBtn.length ; i++){
        accBtn[i].addEventListener('click', (ev) => {
          
            ev.stopPropagation();
            //console.log(ev)
            //debugger
            //accBtn[i].classList.toggle("active")
            accBtn[i].classList.toggle('active');
         
            let card = accBtn[i].nextElementSibling;
            //console.log(card.style.maxHeight);
            if(card.style.maxHeight){
                card.style.maxHeight = null;
            } else {
                card.style.maxHeight = card.scrollHeight + 'px';
            }
        })
    }
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
                    //console.log(doc.id, " => ", doc.data());
                    let docId = doc.id;
                    let userName =  doc.data().user; 
                    let mascota =  doc.data().mascota;
                    let fecha =  doc.data().fecha;
                    let dosis =  doc.data().dosisTurno;
                    let medicamento = doc.data().medicamento
                    let serverDate = doc.data().serverDate;
                    dosisData.push(new dosisContructor(docId, userName, mascota,fecha,dosis,serverDate,medicamento))
                })
                console.log(dosisData);
                renderDosisCard(dosisData);
            }) 
           

        }else {
            console.log('no hay nadie loging')
        }
    })
}
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
        console.log(fecha)
       
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
        console.log(user);
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

document.addEventListener("DOMContentLoaded",function() {
    form.addEventListener('submit', validadFormulario);
    elimarDosisForm.addEventListener('submit', eliminarDosis);
    Home();
    hammburBtn();
    logout();
    showAcc();
    getDosisUsuario();
    showModal();
    showDeleteModal();
    renderUserData ();
   /*  let plus = document.querySelectorAll('.plus');
    for(let i = 0; i < plus.length; i++){
        plus[i].addEventListener('click', (ev) => {
            ev.stopPropagation();
            alert('hola');
        })
    } */
    
   
    //renderDosisCard('michi','francisco','mediZX','25/07/21');
    
   

});