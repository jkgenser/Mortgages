# -*- coding: utf-8 -*-
"""
Created on Mon Sep 28 19:38:09 2015

@author: jgenser
"""

datadir = "H:/USER/JGenser/PROJECTS/Mortgage/Data"
javadir = "H:/USER/JGenser/PROJECTS/Javascript Leaflet"

import pandas as pd
import numpy as np
import geojson
import json
from pandas.io.json import json_normalize

## -- import results
results = pd.read_csv(datadir+"/state_results.csv", sep=",")


## -- import state boundaries geojson data
with open(javadir+"/us-states.json","r") as myfile:
    data = myfile.read().replace("\n","")
json_data = json.loads(data)


## - add model coefficients and pvalues to the geojson file
for feature in json_data['features']:
    for i in range(len(results)):
        if (results.loc[i]['state'] == int(feature['id'])) & (results.loc[i]['stat']=="coeff"):
            feature['properties'][u'female_coeff'] = 1/results.loc[i]['female_odd']
            feature['properties'][u'native_coeff'] = 1/results.loc[i]['native_odds']
            feature['properties'][u'asian_coeff'] = 1/results.loc[i]['asian_odds']
            feature['properties'][u'black_coeff'] = 1/results.loc[i]['black_odds']
            feature['properties'][u'latino_coeff'] = 1/results.loc[i]['latino_odds']
            feature['properties'][u'white_coeff'] = 1/results.loc[i]['white_odds']
        elif (results.loc[i]['state'] == int(feature['id'])) & (results.loc[i]['stat']=="pval"):
            feature['properties'][u'female_pval'] = results.loc[i]['female_odd']
            feature['properties'][u'native_pval'] = results.loc[i]['native_odds']
            feature['properties'][u'asian_pval'] = results.loc[i]['asian_odds']
            feature['properties'][u'black_pval'] = results.loc[i]['black_odds']
            feature['properties'][u'latino_pval'] = results.loc[i]['latino_odds']
            feature['properties'][u'white_pval'] = results.loc[i]['white_odds']


with open(javadir+'/json_clean.json','w') as outfile:
    json.dump(json_data,outfile)






###-- connecticut
json_data['features'][6]







