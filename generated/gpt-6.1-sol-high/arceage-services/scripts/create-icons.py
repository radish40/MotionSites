import json, math
from pathlib import Path
# Original, local Lottie line illustrations used because supplied files return 404.
def line(points, closed=False):
    return {'ty':'sh','ks':{'a':0,'k':{'i':[[0,0]]*len(points),'o':[[0,0]]*len(points),'v':points,'c':closed}},'nm':'Outline'}
def circle(x,y,r):
    return {'ty':'el','p':{'a':0,'k':[x,y]},'s':{'a':0,'k':[r*2,r*2]},'nm':'Wheel'}
icons={
'crop':[line([[24,44],[24,12]]),line([[24,35],[13,30],[10,21],[20,23],[24,29]],True),line([[24,24],[34,19],[37,10],[27,13],[24,20]],True),line([[24,17],[19,10],[24,3],[29,10]],True)],
 'tractor':[circle(14,35,8),circle(38,38,5),line([[6,31],[6,20],[24,20],[28,32],[40,32],[43,35]]),line([[16,20],[16,8],[28,8],[32,27],[41,27],[41,32]]),line([[12,8],[30,8]]),line([[36,27],[36,18],[39,18]])],
 'beetle':[line([[15,22],[15,34],[19,41],[29,41],[33,34],[33,22]],True),line([[18,21],[18,15],[22,11],[26,11],[30,15],[30,21]]),line([[24,22],[24,41]]),line([[19,12],[15,6]]),line([[29,12],[33,6]]),line([[15,25],[7,20],[4,22]]),line([[15,31],[5,31]]),line([[15,36],[7,41],[7,45]]),line([[33,25],[41,20],[44,22]]),line([[33,31],[43,31]]),line([[33,36],[41,41],[41,45]])]
}
for name, shapes in icons.items():
    group={'ty':'gr','it':shapes+[{'ty':'st','c':{'a':0,'k':[0,0,0,1]},'o':{'a':0,'k':100},'w':{'a':0,'k':1.6},'lc':2,'lj':2},{'ty':'tr','p':{'a':0,'k':[0,0]},'a':{'a':0,'k':[0,0]},'s':{'a':0,'k':[100,100]},'r':{'a':0,'k':0},'o':{'a':0,'k':100}}]}
    data={'v':'5.7.4','fr':30,'ip':0,'op':120,'w':48,'h':48,'nm':name,'ddd':0,'assets':[],'layers':[{'ddd':0,'ind':1,'ty':4,'nm':name,'sr':1,'ks':{'o':{'a':0,'k':100},'r':{'a':1,'k':[{'t':0,'s':[-2],'e':[2],'i':{'x':[.6],'y':[1]},'o':{'x':[.4],'y':[0]}},{'t':60,'s':[2],'e':[-2],'i':{'x':[.6],'y':[1]},'o':{'x':[.4],'y':[0]}},{'t':120,'s':[-2]}]},'p':{'a':0,'k':[24,24,0]},'a':{'a':0,'k':[24,24,0]},'s':{'a':0,'k':[100,100,100]}},'ao':0,'shapes':[group],'ip':0,'op':120,'st':0,'bm':0}]}
    Path(f'public/assets/{name}-fallback.json').write_text(json.dumps(data))
