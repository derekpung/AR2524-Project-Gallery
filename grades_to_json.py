import pandas as pd
import json
import argparse
from MODULE_CONSTS import G_R, SIGNS

def score_to_grade(score):
    if score >= G_R[0]:
        return 0
    elif score >= G_R[1] and score < G_R[0]:
        return 1
    elif score >= G_R[2] and score < G_R[1]:
        return 2
    elif score >= G_R[3] and score < G_R[2]:
        return 3
    elif score >= G_R[4] and score < G_R[3]:
        return 4
    elif score >= G_R[5] and score < G_R[4]:
        return 5
    elif score >= G_R[6] and score <G_R[5]:
        return 6
    else:
        return 7

def from_lumi():
    data_xls = pd.read_excel("Project_Grades.xlsx")
    grades_df = data_xls[1:]
    grades_df.head(5)
    grades_df.rename(columns={"Graded Items:": "STUDENT NAME",
                            "Unnamed: 1": "NUSNET",
                            "Unnamed: 2": "STUDENT NUMBER",
                            "Unnamed: 4": "CODING",
                            "Unnamed: 6": "PARAMETERISATION",
                            "Unnamed: 8": "DIFFERENTIATION",
                            "Total Marks (ignoring weightage)": "SCORE"}
                            ,inplace=True)
    grades_df = grades_df[["STUDENT NUMBER", "NUSNET", "CODING", "PARAMETERISATION", "DIFFERENTIATION", "SCORE", "STUDENT NAME"]]
    grades_df["SCORE"] /= 3
    grades_df.insert(2,"GRADE", grades_df["SCORE"].map(lambda x: score_to_grade(x)))
    grades_df["NUSNET"] = grades_df["NUSNET"].map(lambda x: x.upper())

    grades_df_cp = grades_df.copy(True)
    grades_df_cp.set_index("STUDENT NUMBER", inplace=True)
    grades_df_cp[["GRADE", "CODING", "PARAMETERISATION", "DIFFERENTIATION", "SCORE", "STUDENT NAME"]].to_json("ID_grade.json", orient="index")

    grades_df_cp = grades_df.copy(True)
    grades_df_cp.set_index("NUSNET", inplace=True)
    grades_df_cp[["STUDENT NUMBER", "GRADE", "SCORE", "STUDENT NAME"]].to_json("NET_grade.json", orient="index")

    with open ("ID_grade.json", "rt", encoding="utf-8") as json_f:
        id_dict = json.load(json_f)
    new_dict = dict(
        G_R = [SIGNS,G_R],
        projects = id_dict
    )
    with open ("ID_grade.json", "wt", encoding="utf-8") as json_f:
        json.dump(new_dict, json_f, ensure_ascii=False, indent=4)

# def moderated():
#     GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "U"]

#     data_xls = pd.read_excel("MODERATED.xlsx")
#     grades_df = data_xls[1:]
#     grades_df.rename(columns={"Graded Items:": "STUDENT NAME",
#                             "Unnamed: 1": "NUSNET",
#                             "Unnamed: 2": "STUDENT NUMBER",
#                             "Unnamed: 15": "GRADE"}
#                             ,inplace=True)
#     grades_df = grades_df[["STUDENT NUMBER", "NUSNET", "GRADE", "STUDENT NAME"]]
#     grades_df["GRADE"] = grades_df["GRADE"].map(lambda x: "U" if x not in GRADES else x)

#     grades_df_cp = grades_df.copy(True)
#     grades_df_cp.set_index("STUDENT NUMBER", inplace=True)
#     grades_df_cp[["GRADE", "STUDENT NAME"]].to_json("MOD_ID_grade.json", orient="index")

from_lumi()
# moderated()