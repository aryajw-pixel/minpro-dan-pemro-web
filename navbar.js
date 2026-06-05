// ── Render Navbar ──
function renderNavbar(active){
  var user=getCurrentUser();
  var count=(typeof getCartCount==='function')?getCartCount():0;

  var pages=[
    {id:'home',href:'index.html',label:'Beranda'},
    {id:'produk',href:'produk.html',label:'Produk'},
    {id:'tentang',href:'tentang.html',label:'Tentang'},
    {id:'ulasan',href:'ulasan.html',label:'Ulasan'},
    {id:'kontak',href:'kontak.html',label:'Kontak'},
  ];

  var links=pages.map(function(p){
    return '<a href="'+p.href+'"'+(active===p.id?' class="active"':'')+'>'+p.label+'</a>';
  }).join('');

  var mlinks=pages.map(function(p){
    return '<a href="'+p.href+'"'+(active===p.id?' class="active"':'')+'>'+p.label+'</a>';
  }).join('');

  var userHtml='';
  if(user){
    var ini=user.name?user.name[0].toUpperCase():'?';
    if(user.role==='admin'){
      userHtml='<a href="admin.html" class="btn-login" style="background:var(--primary-lt);">⚙️ Admin</a>'
        +'<div class="user-menu"><button class="user-avatar" onclick="toggleDd(event)">'+ini+'</button>'
        +'<div class="dropdown" id="uDd"><div class="dd-head"><div class="dn">'+user.name+'</div><div class="de">'+user.email+'</div></div>'
        +'<a href="admin.html">⚙️ Admin Panel</a><div class="dd-div"></div>'
        +'<button class="dd-danger" style="display:flex;align-items:center;gap:8px;width:100%;padding:11px 16px;font-size:13px;font-weight:600;color:var(--danger);text-decoration:none;background:none;border:none;cursor:pointer;" onclick="logout()">🚪 Keluar</button>'
        +'</div></div>';
    }else{
      userHtml='<div class="user-menu"><button class="user-avatar" onclick="toggleDd(event)">'+ini+'</button>'
        +'<div class="dropdown" id="uDd"><div class="dd-head"><div class="dn">'+user.name+'</div><div class="de">'+user.email+'</div></div>'
        +'<a href="pesanan.html">📦 Pesanan Saya</a><div class="dd-div"></div>'
        +'<button class="dd-danger" style="display:flex;align-items:center;gap:8px;width:100%;padding:11px 16px;font-size:13px;font-weight:600;color:var(--danger);text-decoration:none;background:none;border:none;cursor:pointer;" onclick="logout()">🚪 Keluar</button>'
        +'</div></div>';
    }
  }else{
    userHtml='<a href="login.html" class="btn-login">👤 Masuk</a>';
  }

  var showCart=(typeof toggleCart==='function');
  var cartHtml=showCart
    ?'<button class="cart-btn" onclick="toggleCart()">🛒 <span class="cart-count">'+count+'</span></button>'
    :'';

  var html='<nav id="mainNav">'
    +'<div class="nav-inner">'
    +'<a href="index.html" class="logo"><div class="logo-icon">🍩</div>Dapur Mama Arya</a>'
    +'<div class="nav-links">'+links+'</div>'
    +'<div class="nav-right">'+userHtml+cartHtml+'<button class="hamburger" onclick="toggleHamburger()">☰</button></div>'
    +'</div>'
    +'<div class="mobile-menu" id="mobileMenu" style="display:none;">'+mlinks+'</div>'
    +'</nav>';

  document.body.insertAdjacentHTML('afterbegin',html);
}

function toggleDd(e){
  e.stopPropagation();
  var d=document.getElementById('uDd');
  if(d)d.classList.toggle('show');
}
function toggleHamburger(){
  var m=document.getElementById('mobileMenu');
  if(m)m.style.display=m.style.display==='block'?'none':'block';
}
document.addEventListener('click',function(){
  var d=document.getElementById('uDd');
  if(d)d.classList.remove('show');
});

// ── Render Cart Sidebar ──
function renderCartSidebar(){
  var html='<div class="overlay" id="cartOverlay" onclick="toggleCart()"></div>'
    +'<div class="cart-sidebar" id="cartSidebar">'
    +'<div class="cart-head"><h2>🛒 Keranjang Belanja</h2><button class="close-btn" onclick="toggleCart()">✕</button></div>'
    +'<div class="cart-items" id="cartItems"><div class="cart-empty"><div style="font-size:52px">🛒</div><p>Keranjang masih kosong</p></div></div>'
    +'<div class="cart-foot">'
    +'<div class="cart-summary">'
    +'<div class="cart-row"><span>Subtotal</span><span id="cart-sub">Rp 0</span></div>'
    +'<div class="cart-row"><span>Ongkos Kirim</span><span id="cart-ongkir">Rp 0</span></div>'
    +'<div class="cart-row total"><span>Total</span><span id="cart-total">Rp 0</span></div>'
    +'</div>'
    +'<button class="checkout-btn" id="checkoutBtn" onclick="openCheckout()" disabled>Lanjut ke Pembayaran →</button>'
    +'</div></div>'
    +checkoutModalHTML()
    +'<div class="toast" id="toast"></div>';
  document.body.insertAdjacentHTML('beforeend',html);
  refreshCartUI();
}

// ── Checkout Modal ──
function checkoutModalHTML(){
  return '<div class="modal-wrap" id="coModal">'
    +'<div class="modal">'
    +'<div class="modal-head"><h2 id="coTitle">📋 Data Pengiriman</h2><button class="close-btn" onclick="closeCheckout()">✕</button></div>'
    +'<div class="modal-body">'
    +'<div class="step-dots"><div class="step-dot done" id="sd1"></div><div class="step-dot" id="sd2"></div><div class="step-dot" id="sd3"></div></div>'

    // Step 1
    +'<div class="modal-step active" id="coS1">'
    +'<div class="form-group"><label>Nama Lengkap *</label><input id="co_nama" placeholder="Nama lengkap penerima"></div>'
    +'<div class="form-group"><label>Nomor WhatsApp *</label><input id="co_telp" type="tel" placeholder="08xxxxxxxxxx"></div>'
    +'<div class="form-row">'
    +'<div class="form-group" style="margin-bottom:0"><label>Kecamatan *</label><select id="co_kec"><option value="">Pilih...</option><option>Tanjungpinang Kota</option><option>Tanjungpinang Timur</option><option>Tanjungpinang Barat</option><option>Bukit Bestari</option><option>Bintan Utara</option><option>Bintan Timur</option><option>Lainnya</option></select></div>'
    +'<div class="form-group" style="margin-bottom:0"><label>Jam Pengiriman *</label><select id="co_jam"><option value="">Pilih...</option><option>10:00–12:00</option><option>12:00–14:00</option><option>14:00–16:00</option><option>16:00–18:00</option><option>18:00–20:00</option></select></div>'
    +'</div>'
    +'<div class="form-group" style="margin-top:14px"><label>Alamat Lengkap *</label><textarea id="co_alamat" placeholder="Nama jalan, nomor rumah, patokan..."></textarea></div>'
    +'<div class="form-group"><label>Catatan (Opsional)</label><input id="co_note" placeholder="Misal: tanpa saus, extra pedas..."></div>'
    +'</div>'

    // Step 2
    +'<div class="modal-step" id="coS2">'
    +'<p style="font-size:13px;color:var(--muted);margin-bottom:14px;">Pilih metode pembayaran:</p>'
    +'<div class="pay-methods">'
    +'<div class="pay-opt" onclick="selPay(this,\'bca\')"><div class="poi">🏦</div><div class="pon">Transfer BCA</div><div class="pod">Bank Central Asia</div></div>'
    +'<div class="pay-opt" onclick="selPay(this,\'bni\')"><div class="poi">🏛️</div><div class="pon">Transfer BNI</div><div class="pod">Bank Negara Indonesia</div></div>'
    +'<div class="pay-opt" onclick="selPay(this,\'qris\')"><div class="poi">📲</div><div class="pon">QRIS</div><div class="pod">GoPay, OVO, DANA</div></div>'
    +'<div class="pay-opt" onclick="selPay(this,\'cod\')"><div class="poi">💵</div><div class="pon">COD</div><div class="pod">Bayar di tempat</div></div>'
    +'</div>'
    +'<div class="pay-info" id="payInfo"></div>'
    +'<div style="background:var(--primary-lt);border-radius:10px;padding:13px;margin-top:12px;border:1px solid rgba(232,93,4,.2);">'
    +'<p style="font-size:12px;color:var(--brown);font-weight:800;margin-bottom:7px;">📦 Ringkasan Pesanan</p>'
    +'<div id="coSummary" style="font-size:13px;color:var(--muted);"></div>'
    +'<div style="border-top:1px solid rgba(232,93,4,.15);margin-top:7px;padding-top:7px;display:flex;justify-content:space-between;font-weight:800;color:var(--primary);font-size:14px;"><span>Total Bayar</span><span id="coTotal">Rp 0</span></div>'
    +'</div></div>'

    // Step 3
    +'<div class="modal-step" id="coS3">'
    +'<div class="success-box">'
    +'<div style="font-size:64px;margin-bottom:12px;">✅</div>'
    +'<h3 style="font-size:21px;font-weight:800;color:var(--ok);margin-bottom:8px;">Pesanan Berhasil!</h3>'
    +'<p style="font-size:14px;color:var(--muted);">Terima kasih! Kami akan segera memproses pesanan Anda.</p>'
    +'<div class="order-num" id="coOrderNum">DR-00000</div>'
    +'<div class="order-detail" id="coDetail"></div>'
    +'<div style="margin-top:14px;background:var(--primary-lt);border-radius:10px;padding:13px;font-size:13px;color:var(--brown);">💬 <strong>Konfirmasi via WhatsApp 085167201891</strong><br>Kirim foto bukti transfer jika pakai transfer bank.</div>'
    +'</div></div>'

    +'</div>'
    +'<div class="modal-foot" id="coFoot">'
    +'<button class="btn-back" id="coBtnBack" onclick="coPrev()" style="display:none">← Kembali</button>'
    +'<button class="btn-next" id="coBtnNext" onclick="coNext()">Lanjutkan →</button>'
    +'</div>'
    +'</div></div>';
}

var _coStep=1,_coPay='';

function openCheckout(){
  toggleCart();
  _coStep=1;_coPay='';
  // Pre-fill jika sudah login
  var user=getCurrentUser();
  var ni=document.getElementById('co_nama');
  var ti=document.getElementById('co_telp');
  if(user){
    if(ni&&!ni.value)ni.value=user.name||'';
    if(ti&&!ti.value)ti.value=user.phone||'';
  }
  renderCoStep();
  document.getElementById('coModal').classList.add('open');
}
function closeCheckout(){document.getElementById('coModal').classList.remove('open');}

function selPay(el,type){
  document.querySelectorAll('.pay-opt').forEach(function(e){e.classList.remove('sel');});
  el.classList.add('sel');_coPay=type;
  var cart=getCart();
  var total=cart.reduce(function(s,x){return s+x.price*x.qty;},0)+5000;
  var pi=document.getElementById('payInfo');
  pi.style.display='block';
  var inf={
    bca:'<h4>🏦 Transfer BCA</h4><div class="pay-row"><span>No. Rekening</span><div style="display:flex;align-items:center;gap:7px;"><span class="pay-val">1234567890</span><button class="copy-btn" onclick="copyTxt(\'1234567890\')">Salin</button></div></div><div class="pay-row"><span>Atas Nama</span><span class="pay-val">ARYA JUNIANTO WINATA</span></div><div class="pay-row"><span>Jumlah</span><span class="pay-val">'+rp(total)+'</span></div><p style="font-size:11px;color:var(--muted);margin-top:8px;">⚠️ Transfer tepat sesuai jumlah</p>',
    bni:'<h4>🏛️ Transfer BNI</h4><div class="pay-row"><span>No. Rekening</span><div style="display:flex;align-items:center;gap:7px;"><span class="pay-val">0987654321</span><button class="copy-btn" onclick="copyTxt(\'0987654321\')">Salin</button></div></div><div class="pay-row"><span>Atas Nama</span><span class="pay-val">ARYA JUNIANTO WINATA</span></div><div class="pay-row"><span>Jumlah</span><span class="pay-val">'+rp(total)+'</span></div><p style="font-size:11px;color:var(--muted);margin-top:8px;">⚠️ Transfer tepat sesuai jumlah</p>',
    qris:(function(){
      var QRIS_FILE = 'qris gopay.jpeg';
      return '<h4>📲 QRIS — Semua Dompet Digital</h4>'
        +'<div style="background:#fff;border-radius:9px;padding:14px;text-align:center;margin:8px 0;">'
        +'<img src="'+QRIS_FILE+'" alt="QRIS Dapur Mama Arya" '
        +'style="width:190px;height:190px;object-fit:contain;border-radius:8px;display:block;margin:0 auto;" '
        +'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
        +'<div style="display:none;width:190px;height:190px;background:#f3f4f6;border:2px dashed #d1b89a;border-radius:10px;flex-direction:column;align-items:center;justify-content:center;gap:8px;margin:0 auto;">'
        +'<span style="font-size:36px;">📲</span>'
        +'<span style="font-size:11px;color:#6b7280;text-align:center;line-height:1.5;">Foto QRIS belum ada<br><strong style="color:#E85D04;">Ganti nama file jadi qris.jpg</strong><br>lalu taruh di folder website</span>'
        +'</div>'
        +'<p style="font-size:11px;color:var(--muted);margin-top:8px;">Scan dengan GoPay / OVO / DANA / ShopeePay</p>'
        +'</div>'
        +'<div class="pay-row"><span>Total</span><span class="pay-val">'+rp(total)+'</span></div>'
        +'<p style="font-size:11px;color:var(--muted);margin-top:6px;">Atas Nama: <strong>ARYA JUNIANTO WINATA</strong></p>';
    })(),
    cod:'<h4>💵 Bayar di Tempat (COD)</h4><p style="font-size:13px;color:var(--muted);margin-bottom:9px;">Siapkan uang pas saat kurir tiba.</p><div class="pay-row"><span>Siapkan</span><span class="pay-val">'+rp(total)+'</span></div><p style="font-size:12px;color:var(--ok);font-weight:700;margin-top:8px;">✅ Bayar saat barang tiba!</p>',
  };
  pi.innerHTML=inf[type]||'';
}

function copyTxt(t){navigator.clipboard&&navigator.clipboard.writeText(t).then(function(){showToast('✅ Disalin!','ok');});}

function renderCoStep(){
  [1,2,3].forEach(function(i){
    document.getElementById('coS'+i).classList.toggle('active',i===_coStep);
    document.getElementById('sd'+i).classList.toggle('done',i<=_coStep);
  });
  var titles={1:'📋 Data Pengiriman',2:'💳 Pilih Pembayaran',3:'✅ Pesanan Selesai'};
  document.getElementById('coTitle').textContent=titles[_coStep];
  document.getElementById('coBtnBack').style.display=(_coStep>1&&_coStep<3)?'block':'none';
  var nb=document.getElementById('coBtnNext');
  nb.style.display=_coStep<3?'inline-block':'none';
  nb.textContent=_coStep===1?'Lanjut ke Pembayaran →':'Konfirmasi Pesanan ✓';
  document.getElementById('coFoot').style.display=_coStep===3?'none':'flex';

  if(_coStep===2){
    var cart=getCart();
    var sub=cart.reduce(function(s,x){return s+x.price*x.qty;},0);
    document.getElementById('coSummary').innerHTML=
      cart.map(function(x){return '<div style="display:flex;justify-content:space-between;padding:2px 0;">'+x.emoji+' '+x.name+' ×'+x.qty+' <span>'+rp(x.price*x.qty)+'</span></div>';}).join('')
      +'<div style="display:flex;justify-content:space-between;padding:2px 0;">🚴 Ongkos Kirim <span>Rp 5.000</span></div>';
    document.getElementById('coTotal').textContent=rp(sub+5000);
  }
}

function coNext(){
  if(_coStep===1){
    var nama=document.getElementById('co_nama').value.trim();
    var telp=document.getElementById('co_telp').value.trim();
    var alamat=document.getElementById('co_alamat').value.trim();
    var kec=document.getElementById('co_kec').value;
    var jam=document.getElementById('co_jam').value;
    if(!nama||!telp||!alamat||!kec||!jam){showToast('⚠️ Lengkapi semua data!','err');return;}
    if(!/^08[0-9]{8,11}$/.test(telp)){showToast('⚠️ Format WhatsApp tidak valid!','err');return;}
    _coStep=2;renderCoStep();
  }else if(_coStep===2){
    if(!_coPay){showToast('⚠️ Pilih metode pembayaran!','err');return;}
    _coStep=3;
    var cart=getCart();
    var total=cart.reduce(function(s,x){return s+x.price*x.qty;},0)+5000;
    var onum='DR-'+Date.now().toString().slice(-5);
    document.getElementById('coOrderNum').textContent=onum;
    var pLbl={bca:'Transfer BCA',bni:'Transfer BNI',qris:'QRIS',cod:'COD'};
    var nama=document.getElementById('co_nama').value;
    var telp=document.getElementById('co_telp').value;
    var kec=document.getElementById('co_kec').value;
    var jam=document.getElementById('co_jam').value;
    var alamat=document.getElementById('co_alamat').value;
    var note=document.getElementById('co_note').value;
    document.getElementById('coDetail').innerHTML=[
      '<div class="dr"><span>Nama</span><span>'+nama+'</span></div>',
      '<div class="dr"><span>WhatsApp</span><span>'+telp+'</span></div>',
      '<div class="dr"><span>Kecamatan</span><span>'+kec+'</span></div>',
      '<div class="dr"><span>Jam Kirim</span><span>'+jam+'</span></div>',
      '<div class="dr"><span>Pembayaran</span><span>'+pLbl[_coPay]+'</span></div>',
      '<div class="dr"><span>Total</span><span>'+rp(total)+'</span></div>',
    ].join('');
    var user=getCurrentUser();
    var order={id:onum,
      customerId:user?user.id:null,
      customerName:nama,phone:telp,
      district:kec,deliveryTime:jam,address:alamat,notes:note,
      items:cart.map(function(x){return{id:x.id,name:x.name,emoji:x.emoji,price:x.price,qty:x.qty};}),
      payment:_coPay,total:total,status:'pending',createdAt:new Date().toISOString()};
    // Simpan ke riwayat pesanan pelanggan (terpisah dari admin)
    var myOrders = JSON.parse(localStorage.getItem('dma_my_orders') || '[]');
    myOrders.unshift(order);
    localStorage.setItem('dma_my_orders', JSON.stringify(myOrders));
    saveCart([]);
    refreshCartUI();
    cart.forEach(function(item){renderQtyCtrl(item.id);});
    renderCoStep();
    showToast('🎉 Pesanan berhasil!','ok');
  }
}
function coPrev(){if(_coStep>1&&_coStep<3){_coStep--;renderCoStep();}}