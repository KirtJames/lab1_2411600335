document.addEventListener("DOMContentLoaded", () => {
const form=document.getElementById("loginForm"), message=document.getElementById("loginMessage");
form.addEventListener("submit",e=>{e.preventDefault();
const username=document.getElementById("username").value.trim(), password=document.getElementById("password").value;
if(username==="admin" && password==="password123"){localStorage.setItem("quickcartLoggedIn","true");window.location.href="dashboard.html";}
else{message.className="alert alert-danger";message.textContent="Invalid username or password.";}
});
});