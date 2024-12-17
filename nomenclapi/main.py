import io
import zipfile

import pandas as pd
import requests
from fastapi import FastAPI

app = FastAPI()

FILE_URL = "https://inpn.mnhn.fr/docs-web/docs/download/421876"
FILENAMES = {
    "sex": "sexeValue_100523.xlsx",
    "life_stage": "stadeBiologiqueValue_100523.xlsx",
    "behaviour": "comportementValue_100523.xlsx",
    "biological_state": "etatBiologiqueValue_100523.xlsx",
}


def download_and_parse_data():
    result = {}
    response = requests.get(FILE_URL)
    with zipfile.ZipFile(io.BytesIO(response.content), "r") as zip_file:
        for key, filename in FILENAMES.items():
            path_file = f"nomenclatures_SINP_mai2023/{filename}"
            result[key] = {}
            if path_file in zip_file.namelist():
                with zip_file.open(path_file) as file:
                    df = pd.read_excel(file)
                    ncol = len(df.columns)
                    if ncol == 3:
                        df["LABEL"] = df["LABEL"].str.capitalize()
                    if ncol == 4:
                        df.columns = ["TYPE", "LABEL", "CODE", "PRECISION"]
                        df["TYPE"] = df["TYPE"].fillna(method="ffill")
                        df["LABEL"] = df["TYPE"].str.capitalize() + df["LABEL"].fillna(
                            ""
                        ).astype(str).apply(
                            lambda x: f" - {x.capitalize()}" if x != "" else ""
                        )
                    df = df.where(pd.notnull(df), None)
                    df = df.to_dict(orient="records")
                    result[key] = df
            else:
                print(f"Error: {path_file} is not in the zip archive.")
        return result


data = []
data = download_and_parse_data()


@app.get("/nomenclapi")
async def root():
    return data


# possible keys: sex, life_stage, behaviour, biological_state
@app.get("/nomenclapi/{key}")
def get_data(key: str):
    if key in FILENAMES.keys():
        return data[key]
    return "Error: not supported"


@app.get("/nomenclapi/{key}/{value}")
def get_data(key: str, value: str):
    ## exact match for CODE et contain for LABEL
    # subdata = data[key]
    # var = "LABEL"
    # if value.isdigit():
    #     var = "CODE"
    #     value = int(value)
    #     next((item for item in subdata if item.get(var) == value), None)
    # return [item for item in subdata if value in str(item.get(var, ""))]

    # contain for CODE and LABEL
    subdata = data[key]
    var = "LABEL"
    if value.isdigit():
        var = "CODE"
    return [item for item in subdata if value in str(item.get(var, ""))]
