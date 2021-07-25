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
    constructor(docId, userName, mascota, fecha, dosis,serverDate){
        
        this.docId = docId,
        this.userName = userName,
        this.mascota = mascota,
        this.fecha = fecha,
        this.dosisTurno = dosis,
        this.serverDate = serverDate
    }
}
/* variables render */

// Acordion variables
let accBtn = document.querySelectorAll('.acordionBtn');



function showAcc () {
    for(let i = 0; i < accBtn.length ; i++){
        accBtn[i].addEventListener('click', (ev) => {
          
            ev.stopPropagation();
            console.log(ev)
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
            .limit(7)
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
                    dosisData.push(new dosisContructor(docId, userName, mascota,fecha,dosis,serverDate))
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
        
    
    
        let med = document.createElement('div');
        med.classList.add('dosisCards__card-med');
        let iconMed = document.createElement('i');
        let spanMed = document.createElement('span');
        iconMed.classList.add('dosis-icon');
        spanMed.append(`${item.dosisTurno}`);
        med.append(iconMed,spanMed);
    
        let date = document.createElement('div');
        date.classList.add('dosisCards__card-date');
        let iconD = document.createElement('i');
        let spanD = document.createElement('span');
        iconD.classList.add('fecha-icon');
        spanD.append(`${item.fecha}`);
        date.append(iconD,spanD);
    
        cardContainer.append(mascota,user,med,date); 
    }
}

// Acordion variables

/* function eliminarDosis (ev) {
    debugger
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
    
} */


document.addEventListener("DOMContentLoaded",function() {
    
    //elimarDosisForm.addEventListener('submit', eliminarDosis);
    Home();
    hammburBtn();
    logout();
    showAcc();
    getDosisUsuario();
    let plus = document.querySelectorAll('.plus');
    for(let i = 0; i < plus.length; i++){
        plus[i].addEventListener('click', (ev) => {
            ev.stopPropagation();
            alert('hola');
        })
    }
    
   
    //renderDosisCard('michi','francisco','mediZX','25/07/21');
    
   

});