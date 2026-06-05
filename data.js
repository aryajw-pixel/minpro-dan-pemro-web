// ── Produk default ──
var DEFAULT_PRODUCTS=[
  {id:1,name:'Risol Mayo Original',emoji:'🥟',photo:'',price:3500,unit:'per pcs',desc:'Isi ragout ayam + wortel + mayo, kulit tipis renyah. Favorit semua kalangan!',badge:'Best Seller',active:true},
  {id:2,name:'Risol Keju Mozarella',emoji:'🧀',photo:'',price:4500,unit:'per pcs',desc:'Keju mozzarella meleleh dengan isian creamy yang memanjakan lidah.',badge:'Baru',active:true},
  {id:3,name:'Risol Sayur Segar',emoji:'🥦',photo:'',price:3000,unit:'per pcs',desc:'Isian sayuran segar (wortel, kol, daun bawang) cocok untuk yang sehat.',badge:null,active:true},
  {id:4,name:'Risol Telur + Sosis',emoji:'🌭',photo:'',price:4000,unit:'per pcs',desc:'Kombinasi telur rebus dan sosis ayam dalam balutan kulit gurih renyah.',badge:null,active:true},
  {id:5,name:'Donat Gula Halus',emoji:'🍩',photo:'',price:3000,unit:'per pcs',desc:'Donat klasik lembut bertabur gula halus. Cocok untuk sarapan dan camilan.',badge:'Best Seller',active:true},
  {id:6,name:'Donat Coklat Meses',emoji:'🍫',photo:'',price:3500,unit:'per pcs',desc:'Dilapisi coklat cair dan taburan meses warna-warni. Favorit si kecil!',badge:null,active:true},
  {id:7,name:'Donat Strawberry',emoji:'🍓',photo:'',price:3500,unit:'per pcs',desc:'Topping selai strawberry manis asem yang bikin nagih. Segar dan enak!',badge:null,active:true},
  {id:8,name:'Donat Matcha',emoji:'🍵',photo:'',price:4000,unit:'per pcs',desc:'Donat premium dengan topping matcha Jepang asli. Unik dan kekinian!',badge:'Premium',active:true},
  {id:9,name:'Paket Risol 10 Pcs',emoji:'📦',photo:'',price:30000,unit:'per paket',desc:'Pilih 10 risol bebas varian! Hemat + dapat potongan harga spesial.',badge:'Hemat',active:true},
  {id:10,name:'Paket Donat 12 Pcs',emoji:'🎁',photo:'',price:35000,unit:'per paket',desc:'12 donat pilihan bebas varian. Cocok buat arisan, ulang tahun, keluarga.',badge:'Hemat',active:true},
  {id:11,name:'Paket Mix 20 Pcs',emoji:'🥳',photo:'',price:55000,unit:'per paket',desc:'10 risol + 10 donat pilihan bebas. Solusi snack kantor dan gathering!',badge:'Terlaris',active:true},
  {id:12,name:'Risol + Donat Box',emoji:'🎀',photo:'',price:25000,unit:'per box',desc:'5 risol + 5 donat dalam satu box cantik. Cocok buat kado dan hampers!',badge:'Gift',active:true},
];

function getProducts(){
  var s=localStorage.getItem('dma_products');
  return s?JSON.parse(s):DEFAULT_PRODUCTS.map(function(p){return Object.assign({},p);});
}
function saveProducts(p){localStorage.setItem('dma_products',JSON.stringify(p));}
function getActiveProducts(){return getProducts().filter(function(p){return p.active!==false;});}
function getProductById(id){return getProducts().find(function(p){return p.id===parseInt(id);});}
function rp(n){return 'Rp '+parseInt(n||0).toLocaleString('id-ID');}

// ── Keranjang ──
function getCart(){return JSON.parse(localStorage.getItem('dma_cart')||'[]');}
function saveCart(c){localStorage.setItem('dma_cart',JSON.stringify(c));}
function getCartCount(){return getCart().reduce(function(s,x){return s+x.qty;},0);}

function addToCart(id){
  var p=getProductById(id);if(!p)return;
  var cart=getCart();
  var ex=cart.find(function(x){return x.id===id;});
  if(ex)ex.qty++;else cart.push({id:p.id,name:p.name,emoji:p.emoji,photo:p.photo,price:p.price,qty:1});
  saveCart(cart);
  refreshCartUI();
  renderQtyCtrl(id);
  showToast(p.emoji+' '+p.name+' ditambahkan!','');
}

function removeFromCart(id){
  var cart=getCart();
  var ex=cart.find(function(x){return x.id===id;});
  if(!ex)return;
  ex.qty--;
  if(ex.qty<=0)cart=cart.filter(function(x){return x.id!==id;});
  saveCart(cart);
  refreshCartUI();
  renderQtyCtrl(id);
}

function renderQtyCtrl(id){
  var el=document.getElementById('ctrl_'+id);
  if(!el)return;
  var item=getCart().find(function(x){return x.id===id;});
  if(!item){
    el.innerHTML='<button class="add-btn" onclick="addToCart('+id+')">+</button>';
  }else{
    el.innerHTML='<div class="qty-ctrl"><button class="qty-btn" onclick="removeFromCart('+id+')">−</button><span class="qty-num">'+item.qty+'</span><button class="qty-btn" onclick="addToCart('+id+')">+</button></div>';
  }
}

function refreshCartUI(){
  var cart=getCart();
  var sub=cart.reduce(function(s,x){return s+x.price*x.qty;},0);
  var count=cart.reduce(function(s,x){return s+x.qty;},0);
  var ongkir=sub>0?5000:0;
  var total=sub+ongkir;
  document.querySelectorAll('.cart-count').forEach(function(el){el.textContent=count;});
  var s=document.getElementById('cart-sub');if(s)s.textContent=rp(sub);
  var o=document.getElementById('cart-ongkir');if(o)o.textContent=rp(ongkir);
  var t=document.getElementById('cart-total');if(t)t.textContent=rp(total);
  var btn=document.getElementById('checkoutBtn');if(btn)btn.disabled=cart.length===0;
  var el=document.getElementById('cartItems');
  if(!el)return;
  if(cart.length===0){
    el.innerHTML='<div class="cart-empty"><div style="font-size:52px">🛒</div><p>Keranjang masih kosong</p></div>';
    return;
  }
  el.innerHTML=cart.map(function(item){
    return '<div class="cart-item"><div class="cart-thumb">'+(item.photo?'<img src="'+item.photo+'" onerror="this.outerHTML=\''+item.emoji+'\'" alt="">':item.emoji)+'</div><div class="cart-info"><div class="cart-name">'+item.name+'</div><div class="cart-price">'+rp(item.price*item.qty)+'</div></div><div class="cart-ctrl"><button class="qty-btn" onclick="removeFromCart('+item.id+')">−</button><span class="qty-num">'+item.qty+'</span><button class="qty-btn" onclick="addToCart('+item.id+')">+</button></div></div>';
  }).join('');
}

function toggleCart(){
  var s=document.getElementById('cartSidebar');
  var o=document.getElementById('cartOverlay');
  if(s)s.classList.toggle('open');
  if(o)o.classList.toggle('open');
}

// ── Toast ──
var _toastTmr;
function showToast(msg,type){
  var t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;
  t.className='toast show'+(type?' '+type:'');
  clearTimeout(_toastTmr);
  _toastTmr=setTimeout(function(){t.className='toast';},2800);
}

// ── Demo Data ──
function injectDemoIfEmpty(){
  if(localStorage.getItem('dma_demo_ok'))return;
  if(getOrders().length>0){localStorage.setItem('dma_demo_ok','1');return;}
  var now=Date.now();
  var demo=[
    {id:'DR-10001',customerId:null,customerName:'Sari Rahmawati',phone:'081234567801',district:'Tanjungpinang Kota',deliveryTime:'10:00–12:00',address:'Jl. Merdeka No. 12',notes:'',payment:'bca',total:38000,status:'done',items:[{id:1,name:'Risol Mayo Original',emoji:'🥟',price:3500,qty:5},{id:5,name:'Donat Gula Halus',emoji:'🍩',price:3000,qty:4},{id:6,name:'Donat Coklat Meses',emoji:'🍫',price:3500,qty:2}],createdAt:new Date(now-86400000*5).toISOString()},
    {id:'DR-10002',customerId:null,customerName:'Budi Hartono',phone:'081234567802',district:'Bintan Utara',deliveryTime:'14:00–16:00',address:'Jl. Ahmad Yani No. 7',notes:'Tanpa saus pedas',payment:'cod',total:40000,status:'done',items:[{id:8,name:'Donat Matcha',emoji:'🍵',price:4000,qty:4},{id:2,name:'Risol Keju Mozarella',emoji:'🧀',price:4500,qty:4}],createdAt:new Date(now-86400000*4).toISOString()},
    {id:'DR-10003',customerId:null,customerName:'Dewi Lestari',phone:'081234567803',district:'Tanjungpinang Timur',deliveryTime:'16:00–18:00',address:'Perum Griya Pinang C4',notes:'Untuk arisan',payment:'qris',total:60000,status:'done',items:[{id:11,name:'Paket Mix 20 Pcs',emoji:'🥳',price:55000,qty:1}],createdAt:new Date(now-86400000*3).toISOString()},
    {id:'DR-10004',customerId:null,customerName:'Ahmad Fauzi',phone:'081234567804',district:'Bukit Bestari',deliveryTime:'12:00–14:00',address:'Jl. Teuku Umar No. 55',notes:'',payment:'bni',total:37000,status:'process',items:[{id:1,name:'Risol Mayo Original',emoji:'🥟',price:3500,qty:4},{id:9,name:'Paket Risol 10 Pcs',emoji:'📦',price:30000,qty:1}],createdAt:new Date(now-86400000*1).toISOString()},
    {id:'DR-10005',customerId:null,customerName:'Linda Susanti',phone:'081234567805',district:'Tanjungpinang Barat',deliveryTime:'10:00–12:00',address:'Ruko Pinang Mas No. 3B',notes:'Buat kado',payment:'bca',total:31000,status:'pending',items:[{id:12,name:'Risol + Donat Box',emoji:'🎀',price:25000,qty:1},{id:5,name:'Donat Gula Halus',emoji:'🍩',price:3000,qty:2}],createdAt:new Date(now-3600000*3).toISOString()},
    {id:'DR-10006',customerId:null,customerName:'Rizky Ananda',phone:'081234567806',district:'Tanjungpinang Kota',deliveryTime:'18:00–20:00',address:'Jl. Hang Tuah No. 88',notes:'',payment:'cod',total:47000,status:'pending',items:[{id:10,name:'Paket Donat 12 Pcs',emoji:'🎁',price:35000,qty:1},{id:3,name:'Risol Sayur Segar',emoji:'🥦',price:3000,qty:2},{id:4,name:'Risol Telur + Sosis',emoji:'🌭',price:4000,qty:1}],createdAt:new Date(now-3600000*1).toISOString()},
  ];
  saveOrders(demo);
  localStorage.setItem('dma_demo_ok','1');
}