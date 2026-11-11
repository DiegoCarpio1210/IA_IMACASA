"""Presupuestos reproducibles posvisita, sin datos de inspección ni entrenamiento."""
import json, math
from pathlib import Path

def calcular():
    produccion = []
    for piezas in (15000, 20000):
        for horas in (8, 10):
            produccion.append(dict(piezas_dia=piezas, horas_efectivas=horas,
                                   piezas_h=piezas/horas, piezas_min=piezas/(60*horas),
                                   segundos_pieza=3600*horas/piezas))
    categorias = [('Aceptadas',400),('Golpes',100),('Enconchados',100),('Ondulado del lomo',100),
                  ('Huellas',40),('Poros',40),('Torcido',40),('Mal pulido',40),('Hoja ampollada/quemada',40)]
    datos=[]
    for nombre,n in categorias:
        split=[n*70//100,n*15//100,n*15//100]
        assert sum(split)==n
        datos.append(dict(categoria=nombre,piezas=n,fotos_base=8*n,particion_piezas=split))
    piezas=[sum(x['particion_piezas'][i] for x in datos) for i in range(3)]
    macro=[42*4,9*4,9*4]
    fotos=[piezas[i]*8+macro[i] for i in range(3)]
    assert piezas==[630,135,135] and fotos==[5208,1116,1116]
    assert sum(fotos)==7440 and sum(piezas)==900
    nominal=280*8+14*4
    assert nominal==2296
    return dict(naturaleza='PROPUESTA; no dataset recolectado; grupos disjuntos para presupuestar',
                produccion=produccion,objetivo_piezas_min=45,objetivo_segundos_pieza=60/45,
                capacidad_8h=45*60*8,capacidad_10h=45*60*10,
                margen_sobre_pico_8h=45/(20000/(8*60))-1,
                disponibilidad_minima_pico_8h=20000/(45*8*60),
                objetivo_con_disponibilidad_90=20000/(8*60*.9),
                incidencias_comunicadas=15000*.05,incidencias_alta_solo_si_prevalencia_constante=20000*.05,
                clases=datos,particion_piezas=piezas,particion_fotos=fotos,
                fotos_normales=400*8+20*4,fotos_piezas_defectuosas=500*8+40*4,
                fotos_nominales_train=nominal,max_presentaciones_train=3*fotos[0],
                cota_omision_95_cero_fallos={str(n):1-.05**(1/n) for n in (6,15,59)},
                test_independiente_para_cota_5=math.ceil(math.log(.05)/math.log(.95)),
                ejemplo_optico_mm_pixel=600/2448,ejemplo_exposicion_s=(600/2448)/600,
                ejemplo_rgb_bytes_imagen=2448*2048*3,
                ejemplo_rgb_bytes_8h=2448*2048*3*8*45*60*8)

if __name__=='__main__':
    output=Path(__file__).with_name('evidencias')/'calculos-posvisita.json'
    output.write_text(json.dumps(calcular(),ensure_ascii=False,indent=2),encoding='utf8')
    print('PASS: 900 piezas, 7440 fotos, partición 630/135/135 y 5208/1116/1116. '+str(output))
