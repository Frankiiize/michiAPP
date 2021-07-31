let closeModal = document.querySelectorAll('.closIconDosisModal');
export function closeModalBtn (contenedor) {
    for(let i = 0; i<closeModal.length; i++){
        
        closeModal[i].addEventListener('click', () =>{
            contenedor.style.display = 'none';
        })
    }
}
export function showModal(element) {
        if(element.style.display == 'none'){
            element.style.display = 'flex'
           // debugger
           closeModalBtn (element)
        } else {
            element.style.display = 'none';
        }
    
}