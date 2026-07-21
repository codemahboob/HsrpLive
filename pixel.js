// ================================
// BharatPlate Meta Pixel
// Pixel ID: 1362559915321801
// ================================

(function(f,b,e,v,n,t,s){
if(f.fbq)return;
n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;
n.push=n;
n.loaded=!0;
n.version='2.0';
n.queue=[];
t=b.createElement(e);
t.async=!0;
t.src=v;
s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s);
})(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init','1362559915321801');

// Disable Meta's automatic event detection (stops "Subscribed", etc. from auto-firing)
fbq('set','autoConfig',false,'1362559915321801');

// PageView — fires once on page load
fbq('track','PageView');

// Book Now → InitiateCheckout (fires once only)
const book=document.getElementById("bookBtn");
if(book){
let checkoutFired=false;
book.addEventListener("click",()=>{
if(checkoutFired) return;
checkoutFired=true;
fbq("track","InitiateCheckout");
});
}

// Address form → AddPaymentInfo (fires ONCE total, not once per field)
const addressFields=["addrName","addrPhone","addrStreet","addrCity","addrPin"];
let paymentInfoFired=false;
addressFields.forEach(id=>{
const el=document.getElementById(id);
if(el){
el.addEventListener("focus",()=>{
if(paymentInfoFired) return;
paymentInfoFired=true;
fbq("track","AddPaymentInfo");
},{once:true});
}
});

// Purchase — call window.metaPurchase(amount) on successful order
window.metaPurchase=function(amount){
fbq("track","Purchase",{
value:amount,
currency:"INR"
});
};