import pandas as pd
import json
from GRADE_RANGE import G_R

def score_to_grade(score):
    if score >= G_R[0]:
        return "A+"
    elif score >= G_R[1] and score < G_R[0]:
        return "A"
    elif score >= G_R[2] and score < G_R[1]:
        return "A-"
    elif score >= G_R[3] and score < G_R[2]:
        return "B+"
    elif score >= G_R[4] and score < G_R[3]:
        return "B"
    elif score >= G_R[5] and score < G_R[4]:
        return "B-"
    elif score >= G_R[6] and score <G_R[5]:
        return "C+"
    else:
        return "C"

data_xls = pd.read_excel("Project_Grades.xlsx")
grades_df = data_xls[1:]
grades_df.rename(columns={"Graded Items:": "STUDENT NAME",
                          "Unnamed: 1": "NUSNET",
                          "Unnamed: 2": "STUDENT NUMBER",
                          "Total Marks (ignoring weightage)": "SCORE"}
                          ,inplace=True)
grades_df = grades_df[["STUDENT NUMBER", "NUSNET", "SCORE", "STUDENT NAME"]]
grades_df["SCORE"] /= 4
grades_df.insert(2,"GRADE", grades_df["SCORE"].map(lambda x: score_to_grade(x)))
grades_df["NUSNET"] = grades_df["NUSNET"].map(lambda x: x.upper())

grades_df_cp = grades_df.copy(True)
grades_df_cp.set_index("STUDENT NUMBER", inplace=True)
grades_df_cp[["GRADE", "SCORE", "STUDENT NAME"]].to_json("ID_grade.json", orient="index")

grades_df_cp = grades_df.copy(True)
grades_df_cp.set_index("NUSNET", inplace=True)
grades_df_cp[["STUDENT NUMBER", "GRADE", "SCORE", "STUDENT NAME"]].to_json("NET_grade.json", orient="index")
