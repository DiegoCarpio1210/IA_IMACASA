"""Presupuesto propuesto, no datos adquiridos; cálculos del alcance corregido."""
import json
from math import pow
rows=[{'diarias':n,'horas_hipoteticas':h,'piezas_min':n/(60*h)} for n in (15000,20000) for h in (8,10,12,24)]
groups={'aceptadas':[300,210,45,45],'ondulaciones':[100,70,15,15],'enconchaduras':[100,70,15,15],'golpes':[100,70,15,15]}
assert all(sum(v[1:])==v[0] for v in groups.values())
pieces=[sum(v[i] for v in groups.values()) for i in range(4)]
images=[n*6 for n in pieces]
assert pieces==[600,420,90,90] and images==[3600,2520,540,540]
result={'nature':'propuesta no adquirida','scenarios':rows,'pieces_total_train_val_test':pieces,'images_total_train_val_test':images,'patchcore_normal_train_top_images':210*4,'train_presentations_max':images[1]*3,'zero_misses_15_upper95':1-pow(.05,1/15),'nominal_target_unconfirmed':45,'required_availability_20000_8h':20000/(45*60*8),'required_rate_at90pct':20000/(8*60*.9),'rgb_bytes_per_frame':2448*2048*3,'stream_MBps_at45':2448*2048*3*6*45/60/1e6,'storage_TB_8h':2448*2048*3*6*45*60*8/1e12,'mm_per_pixel_example':600/2448,'exposure_ms_one_pixel_example':(600/2448)/600*1000}
if __name__=='__main__':print(json.dumps(result,ensure_ascii=False,indent=2))
