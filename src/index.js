import {hammburBtn, Home} from './components/hamburger.js'
import {logout,loginWhitGoogle,validarLogin} from './utils/login.js'


let googleBtn = document.querySelector('#google');


//variables baseDatos
var db = firebase.firestore(); 
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
//variables baseDatos

//variables imprimir data
let docData = [];
let dataDosis = []
let dataMout = document.querySelector('#dataSection');

//variables imprimir data


//variables formulario dosis
let form = document.querySelector('#form');
let name = document.querySelector('#name');
let checkD = document.querySelector('#dia');
let checkN = document.querySelector('#noche');
let fecha = document.querySelector('#fecha');
let print = document.querySelector('#print')
//variables formulario dosis




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
let consultarEnRealTime = () => {
    firebase.auth().onAuthStateChanged((userloged) => {
        const user = firebase.auth().currentUser;
        if(user){
            console.log(user.email)
            db.collection("dosis")
            .where('userId', '==', user.uid )
            .orderBy('serverDate', 'desc')
            .limit(1)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //debugger
                    if (querySnapshot.metadata.hasPendingWrites) {        
                            let docId = doc.id;
                            let userName =  doc.data().user; 
                            let mascota =  doc.data().mascota;
                            let fecha =  doc.data().fecha;
                            let dosis =  doc.data().dosisTurno;
                            let serverDate = doc.data().serverDate;
                            
                            console.log(docId + userName + mascota +fecha +dosis +serverDate)
                            //dataDosis.push(new dbData(userName,mascota,fecha,dosis,dosis,serverDate))
                            //console.log(dataDosis);
                            renderRealtime(userName,mascota,fecha,dosis,dosis,serverDate);
                        } else {
                            return console.log('nada por escribir')
                        }
                } )
                
               
            })
        }
        else {
            console.log('no hay user')
        }
    })
   
   
}

function renderRealtime (userName, mascota, fecha, dosis) {
    debugger
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
                               <span>${userName}</span>`;

    mascotaContainer.innerHTML = `<i class="mascota-icon"></i>
                                  <span>Mascota:</span>
                                  <span>${mascota}</span>`;

    fechaContainer.innerHTML = `<i class="fecha-icon"></i>
                                <span>fecha:</span>
                                <span>${fecha}</span>`;

    dosisContainer.innerHTML = `<i class="dosis-icon"></i>
                                <span>Dosis:</span>
                                 <span>${dosis}</span>`;
                               
    divCards.append(mascotaContainer);
    divCards.append(userContainer);
    divCards.append(fechaContainer);
    divCards.append(dosisContainer);
    dataMout.insertAdjacentElement('afterbegin',divCards);
    
    //dataMout.append(divCards);

}

/*  let consultarDosis = async () => {
   
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
            //console.log(docData)
        })
    }).catch(error => {
        console.error(error);
    });
    //debugger
    //console.log(docData)
    renderDocData (docData) ;
}  */

function renderDocData (array) {
   for(let item of array){
       //debugger
        //console.log(item.docId)
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
        dataMout.classList.add('data');


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
                    let serverDate = doc.data().serverDate;
                    docData.push(new dbData(docId, userName, mascota,fecha,dosis,serverDate))
                })
                //console.log(docData);
                renderDocData(docData);
            }) 
           

        }else {
            console.log('no hay nadie loging')
        }
    })
}

document.addEventListener("DOMContentLoaded",function() {
    form.addEventListener('submit', validadFormulario);
    googleBtn.addEventListener('click',loginWhitGoogle);
   
    hammburBtn();
    validarLogin();
    Home();
    logout();
  
    consultarEnRealTime();
    getDosisUsuario();
    //getMascotasUsuario();

});

