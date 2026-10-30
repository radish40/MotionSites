from pathlib import Path
from html import escape
s=['<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="650" viewBox="0 0 1120 650"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8951f5" stop-opacity=".22"/><stop offset="1" stop-color="#8951f5" stop-opacity="0"/></linearGradient></defs><rect width="1120" height="650" fill="#faf9fc"/>']
def rect(x,y,w,h,fill,rx=0,stroke='none'):s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}"/>')
def text(x,y,t,size=12,color='#777381',weight=400):s.append(f'<text x="{x}" y="{y}" font-family="Arial,sans-serif" font-size="{size}" fill="{color}" font-weight="{weight}">{escape(t)}</text>')
def line(x,y,x2,y2,c='#efedf3'):s.append(f'<path d="M{x} {y}H{x2}" stroke="{c}"/>' if y==y2 else f'<path d="M{x} {y}L{x2} {y2}" stroke="{c}"/>')
rect(0,0,196,650,'#fff');line(196,0,196,650)
rect(22,25,27,27,'#7b39fc',8);text(29,45,'F',20,'#fff',700);text(58,45,'Finlytic',22,'#24212c',700);text(137,43,'AI',9,'#8c54f8',700)
rect(17,79,161,41,'#faf9fc',7,'#efedf2');rect(28,90,20,20,'#ebe2fc',5);text(34,104,'W',10,'#8246e8',700);text(58,104,'My workspace',11,'#484251',600);text(159,104,'⌄',12)
text(26,154,'WORKSPACE',8,'#a5a0ac',600)
for i,(label,glyph) in enumerate([('Overview','▦'),('AI Agents','✧'),('Workflows','◇'),('Conversations','◷'),('Knowledge base','▤'),('Analytics','▥')]):
 y=184+i*43
 if i==0:rect(16,y-22,163,37,'#f0e8ff',7)
 text(29,y,glyph,17,'#7b39fc' if i==0 else '#8d8797');text(58,y-1,label,11,'#7835e9' if i==0 else '#736d7e',600 if i==0 else 400)
rect(17,491,161,94,'#faf7ff',9,'#eee5fc');text(29,513,'A little more possibility.',10,'#40334f',600);text(29,531,'Unlock your team’s potential.',9);rect(29,545,137,26,'#7b39fc',5);text(69,562,'Upgrade plan',10,'#fff',600)
line(16,602,178,602);rect(26,616,23,23,'#eee5ff',12);text(33,632,'JD',8,'#7951ab',600);text(58,625,'Jamie Davis',10,'#423b4d',600);text(58,639,'Personal account',8);text(163,631,'⋯',15)
rect(197,0,923,70,'#fff');line(197,70,1120,70);text(225,41,'Workspace',11);text(298,41,'/',11,'#d3cfd9');text(315,41,'Overview',11,'#413a4d',600)
text(935,41,'⌕',20);text(973,41,'♧',19);line(1005,24,1005,47);rect(1023,23,26,26,'#eee4ff',13);text(1030,40,'JD',9,'#7e4ac2',600);text(1060,41,'Jamie ⌄',10,'#61576d')
text(225,112,'Good morning, Jamie',24,'#2c2436',600);text(225,136,'Here’s what your AI agents have been up to.',11)
rect(959,99,132,32,'#7b39fc',6);text(974,119,'+  Create AI Agent',11,'#fff',600)
metrics=[('Active agents','12','+2 this month','✧'),('Tasks completed','2,846','+18.6% this month','✓'),('Hours saved','148.5','+24.2% this month','◷'),('Leads generated','384','+12.8% this month','↗')]
for i,(label,val,sub,icon) in enumerate(metrics):
 x=225+i*222;rect(x,161,208,118,'#fff',9,'#eae7ef');text(x+16,187,label,11,'#777080');rect(x+166,174,27,27,'#f5efff',7);text(x+174,193,icon,15,'#8a4aef');text(x+16,225,val,28,'#332a40',600);text(x+17,253,'↗',10,'#3aaf80');text(x+31,253,sub,9,'#58a184')
rect(225,298,565,264,'#fff',9,'#eae7ef');text(243,327,'Agent activity',13,'#382e46',600);rect(679,311,92,25,'#fff',5,'#eae7ef');text(691,327,'Last 7 days  ⌄',9)
for y,t in [(365,'1,000'),(405,'750'),(445,'500'),(485,'250')]:text(245,y,t,8,'#a39baa');line(280,y-3,770,y-3,'#f1eef5')
path='M280 487 C305 487 305 454 330 455 S371 468 397 443 S421 450 449 420 S480 438 507 413 S536 433 565 391 S590 407 617 378 S647 396 673 361 S709 373 735 344 S758 355 770 340'
s.append(f'<path d="{path} L770 510H280Z" fill="url(#area)"/><path d="{path}" fill="none" stroke="#8a4aef" stroke-width="2.5"/>')
for i,t in enumerate(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']):text(280+i*78,533,t,9,'#9c94a6')
rect(808,298,283,264,'#fff',9,'#eae7ef');text(826,327,'Your AI agents',13,'#382e46',600);text(1062,327,'⋯',15)
for i,(title,sub,color) in enumerate([('Lead generation agent','128 leads found today','#7b39fc'),('Customer support agent','94 conversations resolved','#df8a37'),('Data entry agent','216 records processed','#3b9e87')]):
 y=368+i*68;rect(826,y-17,32,32,color,8);text(837,y+4,'✧',16,'#fff');text(870,y-3,title,10,'#4c4159',600);text(870,y+14,sub,8,'#9b91a5');s.append(f'<circle cx="1070" cy="{y-3}" r="3" fill="#50ae80"/>')
text(225,601,'Recent automations',14,'#382e46',600);text(1030,601,'View all →',10,'#8643e9');rect(225,617,866,33,'#fff',7,'#eae7ef');text(242,637,'WORKFLOW',8);text(550,637,'STATUS',8);text(726,637,'TASKS',8);text(926,637,'LAST RUN',8)
s.append('</svg>');Path('public/assets/dashboard.svg').write_text(''.join(s))
