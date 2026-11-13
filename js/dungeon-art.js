/* Arte procedural da cripta. Coordenadas e colisões pertencem ao game.js. */
(function(global){
  'use strict';
  const cache=new Map();
  const hash=(x,y)=>((Math.imul(x+17,374761393)^Math.imul(y+31,668265263))>>>0);
  function sprite(kind,variant){
    const key=kind+':'+variant;
    if(cache.has(key))return cache.get(key);
    const tile=document.createElement('canvas');tile.width=tile.height=32;
    const c=tile.getContext('2d');
    const p=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
    const line=(points,color)=>{c.strokeStyle=color;c.lineWidth=1;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x+.5,y+.5):c.moveTo(x+.5,y+.5));c.stroke()};
    if(kind==='floor'){
      p(0,0,32,32,'#172a2b');
      const shades=['#2b3e3e','#304343','#293b3c','#354645','#2e4140','#283c3d'];
      // Juntas irregulares, bordas gastas e sulcos nas lajes.
      const columns=variant%3===0?1:2,slabWidth=32/columns;
      for(let row=0;row<2;row++)for(let col=0;col<columns;col++){
        const x=col*slabWidth,y=row*16,n=hash(variant+col,row+variant);
        p(x+1,y+1,slabWidth-1,15,shades[n%shades.length]);
        p(x+2,y+1,slabWidth-4,1,'#4b5a52');p(x+1,y+2,1,12,'#3e514c');
        p(x+2,y+15,slabWidth-2,1,'#142728');p(x+slabWidth-1,y+3,1,12,'#1d3031');
        for(let i=0;i<5;i++){const q=hash(n%997,i);p(x+2+q%12,y+2+(q>>>8)%12,1+(q%2),1,i%2?'#233737':'#3d4d47')}
        if(n%3===0)line([[x+9,y+2],[x+8,y+6],[x+11,y+8],[x+10,y+12]],'#182d2e');
        if(n%5===0){p(x+1,y+10,3,3,'#344637');p(x+3,y+13,4,1,'#3f5139')}
      }
      if(variant%5===0){p(3,22,7,3,'#222e2b');p(4,21,4,2,'#615b40');p(6,25,2,2,'#777054');p(25,8,3,2,'#202e2c')}
      if(variant%7===0){line([[20,23],[25,23],[27,25]],'#788071');p(20,22,2,3,'#7f8270');p(26,24,2,3,'#7f8270')}
      if(variant===11||variant===19){p(0,0,9,12,'#303c30');p(1,2,10,7,'#394234');p(0,12,5,7,'#2c382d');p(4,5,4,2,'#55543b');p(1,10,3,2,'#55543b');line([[9,0],[12,4],[10,8],[13,11]],'#152a2c')}
    }else if(kind==='wall'||kind==='edge'){
      p(0,0,32,32,'#102224');
      for(let row=0;row<4;row++){
        const offset=row%2?-8:0;
        for(let x=offset;x<32;x+=16){const n=hash(variant+x,row);p(x+1,row*8+1,15,7,n%2?'#283e3d':'#2d4340');p(x+2,row*8+1,13,1,'#43564d');p(x+1,row*8+2,1,5,'#354d46');p(x+2,row*8+7,14,1,'#172d2d');if(n%3===0)p(x+9,row*8+3,3,1,'#3a5047')}
      }
      if(variant%4===0){line([[5,0],[8,6],[7,11],[12,15],[10,22],[14,29]],'#182b28');line([[7,0],[10,6],[9,11],[14,15]],'#465043');p(12,12,3,2,'#405039')}
      if(variant===7||variant===13){
        line([[0,0],[18,8],[27,17]],'#65766a');line([[0,0],[8,22],[14,30]],'#65766a');line([[0,0],[22,24]],'#65766a');
        line([[10,4],[9,9],[4,12]],'#52665b');line([[17,8],[14,15],[8,20]],'#52665b');line([[23,13],[20,21],[13,27]],'#425a51');
      }
      if(kind==='edge'){
        p(0,23,32,2,'#526052');p(0,25,32,3,'#304940');p(0,28,32,2,'#152d2c');p(0,30,32,2,'#0c2022');
        p(3,24,10,1,'#6b7060');p(18,24,12,1,'#626c58');
        if(variant%3===0){
          // Nicho em arco gótico, confinado ao bloco sólido da parede.
          p(9,3,14,21,'#102528');p(7,9,2,15,'#536153');p(23,9,2,15,'#344e47');
          line([[8,9],[11,5],[16,2],[21,5],[24,9]],'#677363');
          line([[11,12],[13,8],[16,5],[19,8],[21,12]],'#2c4741');
          p(12,12,2,11,'#3e554c');p(19,12,2,11,'#334c45');p(15,13,2,10,'#233d3b');
        }
      }
    }else if(kind==='obstacle'){
      p(4,25,26,6,'#101f22');
      if(variant%2===0){
        // Sarcófago de pedra com cruz, moldura e musgo.
        p(5,6,23,23,'#172d2d');p(6,4,20,23,'#354c47');p(8,2,16,23,'#59675a');
        p(9,3,13,1,'#84907a');p(8,5,1,17,'#6f7c68');p(23,5,2,19,'#283f3b');
        p(11,6,10,16,'#374f48');p(12,7,8,1,'#273f3b');
        p(15,9,2,10,'#75816a');p(12,12,8,2,'#75816a');p(16,10,1,8,'#a09e7a');
        p(6,24,20,2,'#223b37');p(7,26,19,2,'#4c5e4e');p(6,20,4,3,'#455b3c');p(21,25,5,2,'#4b603f');
      }else{
        // Coluna brisée e blocos de alvenaria no mesmo obstáculo.
        p(4,23,24,6,'#233a38');p(6,22,20,3,'#536657');p(9,8,14,15,'#3f554c');
        p(10,7,12,3,'#7a8067');p(10,11,2,10,'#667460');p(15,10,2,12,'#293f3b');p(20,10,2,12,'#283e39');
        p(6,5,18,3,'#526757');p(9,3,12,2,'#788270');p(5,24,5,4,'#6b7560');p(25,24,4,3,'#53644d');
        line([[23,3],[28,6],[25,13]],'#6b7561');
      }
    }else if(kind.startsWith('hero-')){
      const mage=kind==='hero-mage',archer=kind==='hero-archer';
      const dark=mage?'#34304d':archer?'#263f34':'#2d3c43',mid=mage?'#645575':archer?'#4b6450':'#6b7a79',light=mage?'#9b84aa':archer?'#81916b':'#afb7a0';
      p(7,27,19,4,'#122227');p(9,24,5,5,'#3b302b');p(19,24,5,5,'#3b302b');
      p(7,12,18,14,dark);p(10,12,12,12,mid);p(7,14,3,8,mid);p(23,14,3,8,dark);
      p(11,13,3,10,light);p(20,14,2,10,dark);p(10,22,13,2,'#9a7849');p(16,22,2,2,'#dfc57c');
      p(10,3,13,10,dark);p(12,2,9,2,mid);p(11,4,11,3,light);p(12,7,9,5,'#ba9970');p(13,8,7,2,'#232c2e');p(14,11,5,1,'#d0b38a');
      if(mage){p(10,2,13,5,mid);p(13,0,7,3,light);p(8,6,17,2,dark);p(27,6,2,24,'#79603b');p(25,5,6,4,'#b59b60');p(27,3,2,4,'#d0bae3');p(15,15,3,5,'#c6b486')}
      else if(archer){p(10,2,13,4,mid);p(9,5,3,8,dark);p(21,5,3,8,dark);line([[27,9],[30,13],[31,21],[28,27]],'#c6ab70');line([[27,9],[28,27]],'#786a49');p(13,15,7,1,'#a28d59')}
      else{p(10,4,13,3,light);p(15,3,2,10,'#89978b');p(9,14,4,4,light);p(21,14,4,4,light);p(26,10,2,14,'#c7c9ac');p(24,23,6,2,'#c29f5c');p(26,25,2,4,'#715237');p(5,17,5,8,'#596b68');p(5,18,1,6,'#aeb39a')}
    }else if(kind==='chest'||kind==='open'){
      p(3,26,27,5,'#102325');p(5,15,23,13,'#322a23');p(6,16,20,10,'#78502c');
      for(let x=7;x<26;x+=5){p(x,17,3,8,'#946333');p(x+3,17,1,8,'#573b27')}
      p(6,25,21,2,'#352d25');p(7,16,2,10,'#bea05c');p(23,16,2,10,'#b18b48');
      if(kind==='chest'){p(5,12,23,5,'#4a3b28');p(7,9,19,5,'#a5763b');p(9,8,15,2,'#c69a55');p(7,13,19,1,'#dab571');p(14,15,5,6,'#e5bf68');p(16,17,1,3,'#4e402b')}
      else {p(5,5,23,6,'#604a2b');p(7,3,19,3,'#b28b46');p(8,5,17,4,'#3b3327');p(6,13,21,3,'#131f20');p(11,15,3,2,'#d4af5d');p(19,14,3,2,'#e5c879')}
    }else if(kind==='stairs'){
      p(2,2,28,29,'#14282a');p(2,2,2,28,'#697362');p(28,2,2,28,'#344d45');
      for(let i=0;i<5;i++){const y=4+i*5;p(5,y,22,3,'#56665a');p(5,y,22,1,'#87907a');p(5,y+3,22,2,'#203735')}
    }else if(kind==='altar'){
      p(3,24,26,7,'#102328');p(5,8,22,20,'#3d4b47');p(7,5,18,20,'#596254');p(8,6,16,2,'#93917b');
      p(10,10,12,11,'#263f3c');line([[16,11],[20,15],[16,20],[12,15],[16,11]],'#bb8057');p(15,13,3,5,'#e6b474');
      p(4,25,24,3,'#75806a');p(7,28,18,2,'#324b43');
    }
    cache.set(key,tile);return tile;
  }
  function draw(ctx,kind,x,y,sx,sy){const variant=hash(x,y)%24;ctx.drawImage(sprite(kind,variant),Math.floor(sx),Math.floor(sy),16,16)}
  function torch(ctx,x,y,time,seed){
    const flick=Math.sin(time*7+seed)*.8+Math.sin(time*13+seed)*.3;
    const glow=ctx.createRadialGradient(x+8,y+5,1,x+8,y+5,36+flick);
    glow.addColorStop(0,'rgba(255,205,119,.28)');glow.addColorStop(.35,'rgba(231,159,66,.14)');glow.addColorStop(1,'rgba(220,148,61,0)');
    ctx.fillStyle=glow;ctx.fillRect(x-30,y-32,76,76);
    const p=(dx,dy,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.floor(x+dx),Math.floor(y+dy),w,h)};
    p(4,12,9,2,'#10262a');p(7,6,2,7,'#a08247');p(5,10,6,1,'#d2ad63');
    for(const dx of [4,8,11]){p(dx,5,1,6,'#e3ce94');p(dx,3+flick,2,3,'#e99739');p(dx,2+flick,1,3,'#fff0ad')}
    if(Math.floor(time*3+seed)%4===0)p(8+Math.sin(time)*3,1-(time*4+seed)%7,1,1,'#e4b568');
  }
  function hero(ctx,x,y,classId){
    ctx.fillStyle='rgba(3,12,17,.5)';ctx.beginPath();ctx.ellipse(x,y+6,7,2.5,0,0,Math.PI*2);ctx.fill();
    ctx.drawImage(sprite('hero-'+classId,0),Math.floor(x-8),Math.floor(y-9),16,16);
  }
  global.DungeonArt=Object.freeze({draw,torch,hero});
})(window);
