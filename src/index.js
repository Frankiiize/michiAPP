let form = document.querySelector('#form');
let name = document.querySelector('#name');
let checkD = document.querySelector('#dia');
let checkN = document.querySelector('#noche');
let fecha = document.querySelector('#fecha');
let print = document.querySelector('#print')




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
        console.log(` ${name.value} ${checkD.value} ${checkN.value} ${fecha.value} `)
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
    let headerBtn = document.querySelector('#hamburger');
    let loginContainer = document.querySelector('.headerContainer__login');

    headerBtn.onclick = () => {
        
        headerBtn.classList.toggle("change");
        loginContainer.classList.toggle("d-flex");
    }
   
});