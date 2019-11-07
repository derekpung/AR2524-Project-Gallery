let ALL_GRPS = ["G1", "G2", "G3", "G4", "G5", "G6"];
const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "U"]

function filter_group(ele) {
    const id = ele.id;

    const all_figs = document.getElementsByTagName("figure");
    const all_btns = document.getElementsByClassName("btn");
    for (let btn_i=0; btn_i < all_btns.length; btn_i++) {
        const btn = all_btns[btn_i];
        btn.classList.remove("selected");
    }
    ele.classList.add("selected");
    let filtered_grp = id.substring(0,2).replace("_","");

    for (let fig_i=0; fig_i < all_figs.length; fig_i++) {
        const fig = all_figs[fig_i];
        fig.style.display = "none";
    }
    if (filtered_grp == "AL") {
        filtered_grp = ALL_GRPS;
    } else {
        filtered_grp = [filtered_grp];
    }
    for (let grp_i=0; grp_i < filtered_grp.length; grp_i++) {
        const grp = filtered_grp[grp_i];
        fil_figs = document.getElementsByClassName(grp);
        for (let fil_i=0; fil_i<fil_figs.length; fil_i++) {
            fil_figs[fil_i].style.display = "block";
        }
    }
}

function import_json() {
    let files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }

    ALL_GRPS = ALL_GRPS.concat(GRADES)
    for (let i=0; i<GRADES.length; i++) {
        let new_btn = document.createElement("div");
        new_btn.setAttribute("id" , GRADES[i]+'_fbtn');
        new_btn.setAttribute("onclick", "filter_group(this)");
        new_btn.className = "btn";
        new_btn.innerHTML = GRADES[i];
        new_btn.style.display = "none";
        document.getElementsByClassName("btn_grp")[0].appendChild(new_btn);
    }

    let fr = new FileReader();
    fr.onload = function(e) { 
        console.log(e);
        const id_obj = JSON.parse(e.target.result);
        const id_keys = Object.keys(id_obj);
        for (let i=0; i<id_keys.length; i++) {
            try {
                const student_id = id_keys[i];
                const student = id_obj[id_keys[i]];
                const student_grade = student["GRADE"];
                document.getElementById(student_grade+'_fbtn').style.display = "block";
                let breakdown = "C:" + student["CODING"] + " P:" + student["PARAMETERISATION"] + " D:"+ student["DIFFERENTIATION"];
                breakdown = breakdown.replace(/undefined/g, "U");

                document.getElementById(student_id).classList.add(student_grade);
                document.getElementById(student_id+'_bdwn').innerHTML = breakdown;
            } catch (error) {
                console.log("No submission: " + id_keys[i])
                continue
            }
        }
    }

    fr.readAsText(files.item(0));
}
