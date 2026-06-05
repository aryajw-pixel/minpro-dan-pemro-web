// ── Storage helpers ──
function getUsers(){return JSON.parse(localStorage.getItem('dma_users')||'[]');}
function saveUsers(u){localStorage.setItem('dma_users',JSON.stringify(u));}
function getCurrentUser(){return JSON.parse(localStorage.getItem('dma_current_user')||'null');}
function setCurrentUser(u){localStorage.setItem('dma_current_user',JSON.stringify(u));}
function getOrders(){return JSON.parse(localStorage.getItem('dma_orders')||'[]');}
function saveOrders(o){localStorage.setItem('dma_orders',JSON.stringify(o));}
function saveOrder(o){var a=getOrders();a.unshift(o);saveOrders(a);}

// ── Akun admin default ──
var ADMIN_DEFAULT={id:'admin',name:'Administrator',email:'admin@dapur.com',password:'Admin123!',role:'admin'};

function authLogin(email,password){
  email=email.trim().toLowerCase();
  // cek admin custom tersimpan
  var ca=JSON.parse(localStorage.getItem('dma_admin_creds')||'null');
  if(ca&&email===ca.email.toLowerCase()&&password===ca.password){
    var au=Object.assign({},ADMIN_DEFAULT,{name:ca.name||'Administrator',email:ca.email});
    setCurrentUser(au);return{success:true,user:au};
  }
  // cek admin default
  if(email===ADMIN_DEFAULT.email&&password===ADMIN_DEFAULT.password){
    setCurrentUser(ADMIN_DEFAULT);return{success:true,user:ADMIN_DEFAULT};
  }
  // cek pelanggan
  var users=getUsers();
  var u=users.find(function(x){return x.email===email&&x.password===password;});
  if(u){setCurrentUser(u);return{success:true,user:u};}
  return{success:false,error:'Email atau password salah.'};
}

function authRegister(name,email,password){
  name=name.trim();email=email.trim().toLowerCase();
  if(!name||!email||!password)return{success:false,error:'Semua kolom wajib diisi.'};
  if(password.length<6)return{success:false,error:'Password minimal 6 karakter.'};
  if(email===ADMIN_DEFAULT.email)return{success:false,error:'Email tidak tersedia.'};
  var users=getUsers();
  if(users.find(function(u){return u.email===email;}))return{success:false,error:'Email sudah terdaftar.'};
  var u={id:'u_'+Date.now(),name:name,email:email,password:password,role:'customer',phone:'',createdAt:new Date().toISOString()};
  users.push(u);saveUsers(users);setCurrentUser(u);
  return{success:true,user:u};
}

function logout(){
  localStorage.removeItem('dma_current_user');
  window.location.href='index.html';
}

function requireAdmin(){
  var u=getCurrentUser();
  if(!u||u.role!=='admin'){window.location.href='admin-login.html';return false;}
  return true;
}
function requireLogin(){
  if(!getCurrentUser()){window.location.href='login.html';return false;}
  return true;
}