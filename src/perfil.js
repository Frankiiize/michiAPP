//import {Toast} from './sweetAlerts.js';
import {hammburBtn,Home} from './components/hamburger.js'
import {logout} from './utils/login.js'

var db = firebase.firestore(); 
//alert('hola')
let elimarDosisForm = document.querySelector('#elimarDosisForm');
let inputDocID = document.getElementById('eliminarDoc');

// Acordion variables
let accBtn = document.querySelectorAll('.acordionBtn');
console.log(accBtn)

function showAcc () {
    for(let i = 0; i < accBtn.length ; i++){
        accBtn[i].addEventListener('click', () => {
            //debugger
            //accBtn[i].classList.toggle("active")
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
    
   

});