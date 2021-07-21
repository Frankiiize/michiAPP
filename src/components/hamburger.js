
let headerBtn = document.querySelector('#hamburger');
let loginForm = document.querySelector('#loginForm');
let userLoggedContainer = document.querySelector('.headerContainer__login-logged');
let loginContainer = document.querySelector('.headerContainer__login');
let userNameDisplay = document.querySelector('#userNameDisplay');
let userPhotoDisplay = document.querySelector('#userPhoto');
let logoImg = document.querySelector('#logo');
export  function hammburBtn ()  {
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
export   function Home () {
    logoImg.onclick = () => {
        window.location = './index.html';
    }
}