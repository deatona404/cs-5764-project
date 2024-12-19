import pandas as pd
import json

path = "./excel/state_M2023_dl.xlsx"
df = pd.read_excel(path)

# filter by job titles
df = df[df['OCC_TITLE'].str.contains(
    'Computer Systems Analysts|Network and Computer Systems Administrators|Software Developers|Web Developers|Data Scientists'
    )]
                                     
output = {}
for index, row in df.iterrows():
    state = row['AREA_TITLE']

    if not state in output:
        output[state] = {
            "fips": row['AREA'],
            "state": state,
        }

    occupation = row['OCC_TITLE']
    output[state][occupation] = {
        "employment": row['TOT_EMP'],
        "hourly_mean_wage": row['H_MEAN'],
        "annual_mean_wage": row['A_MEAN'],
        "hourly_median_wage": row['H_MEDIAN'],
        "annual_median_wage": row['A_MEDIAN'],
        "annual_10th_percentile_wage": row['A_PCT10'],
        "annual_25th_percentile_wage": row['A_PCT25'],
        "annual_75th_percentile_wage": row['A_PCT75'],
        "annual_90th_percentile_wage": row['A_PCT90']
    }

# export json
with open("./excel/state_M2023_dl.json", "w") as f:
    json.dump(list(output.values()), f, indent=4)
    