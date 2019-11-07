const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "U"];
const CRITERIA = ["Overall", "Coding", "Parameterisation", "Differentiation"];

const TAs = {
    G1:"CLIFTON WONG",
    G2:"MATTHEW LEE",
    G3:"ARIES YANG",
    G4:"DE QUAN",
    G5:"HUI YAO",
    G6:"MUHAMMAD SYUKRI"
};
let ALL_GRPS = Object.keys(TAs);
let imported = false;
let asc = true;
const SORT_STATES = ["DESCENDING", "ASCENDING"];

function filter_group(ele) {
    const id = ele.id;

    if (id[0]=="G") {
        document.getElementById("TA").innerHTML = "TA: " + TAs[id.substring(0,2)];
    } else {
        document.getElementById("TA").innerHTML = "";
    }

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

function create_grade_btns() {
    GRADES.forEach(function(grd){
        let new_btn = document.createElement("div");
        new_btn.setAttribute("id" , grd+'_fbtn');
        new_btn.setAttribute("onclick", "filter_group(this)");
        new_btn.className = "btn";
        let new_btn_span = document.createElement("span");
        new_btn_span.innerHTML = grd;
        new_btn.appendChild(new_btn_span);
        new_btn.style.display = "none";
        document.getElementsByClassName("btn_grp")[0].appendChild(new_btn);
    });
}

function append_dropdown() {
    let drop_down = document.getElementById("dropdown");
    let opt_group = document.createElement("optgroup");
    opt_group.setAttribute("label", "Grades");
    drop_down.appendChild(opt_group);
    CRITERIA.forEach(function(opt) {
        let new_opt = document.createElement("option");
        new_opt.setAttribute("value", "by" + opt);
        new_opt.innerHTML = opt;
        opt_group.appendChild(new_opt);
    });
}

function number_grade(grade_dict) {
    Object.keys(grade_dict).forEach(function(grade_i) {
        const fbtn = document.getElementById(GRADES[grade_i]+'_fbtn');
        fbtn.children[0].innerHTML = fbtn.children[0].innerHTML + "(" + grade_dict[grade_i] + ")";
    })
}

function import_json() {
    let files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }
    ALL_GRPS = ALL_GRPS.concat(GRADES)
    create_grade_btns();
    if (!imported) {append_dropdown();}

    let fr = new FileReader();
    fr.onload = function(e) { 
        console.log(e);
        const id_obj = JSON.parse(e.target.result);
        const id_keys = Object.keys(id_obj);
        let grade_dict = {};
        for (let i=0; i<id_keys.length; i++) {
            try {
                const student_id = id_keys[i];
                const student = id_obj[id_keys[i]];
                const student_grade = GRADES[student["GRADE"]];
                const code_grade = student["CODING"];
                const para_grade = student["PARAMETERISATION"];
                const diff_grade = student["DIFFERENTIATION"];
                const overall_grade = student["SCORE"];

                if (grade_dict[student["GRADE"]] == undefined) {
                    grade_dict[student["GRADE"]] = 0;
                }
                grade_dict[student["GRADE"]] = grade_dict[student["GRADE"]] + 1;
                document.getElementById(student_grade+'_fbtn').style.display = "flex";
                let breakdown = "C:" + code_grade + " P:" + para_grade + " D:"+ diff_grade;
                breakdown = breakdown.replace(/undefined/g, "U");

                let fig = document.getElementById(student_id)
                fig.classList.add(student_grade);

                fig.setAttribute("data-overall", overall_grade)
                fig.setAttribute("data-coding", code_grade);
                fig.setAttribute("data-parameterisation", para_grade);
                fig.setAttribute("data-differentiation", diff_grade);

                document.getElementById(student_id+'_bdwn').innerHTML = breakdown;
            } catch (error) {
                console.log("No submission: " + id_keys[i])
                continue
            }
        }
        number_grade(grade_dict);
    }
    fr.readAsText(files.item(0));
    imported = true;
}

function toggle_asc(ele) {
    asc = !asc;
    const i = asc ? 1 : 0;
    ele.innerHTML = SORT_STATES[i];
    sort_figures(document.getElementById("dropdown"));
}

function sort_figures(ele) {
    const method = "data-" + ele.options[ele.selectedIndex].text.toLowerCase();
    let all_figs = Array.from(document.getElementsByTagName("figure"));
    let container_fig = document.getElementsByClassName("container__figs")[0];
    _sort_figures_by(all_figs, method, asc).forEach(function(ele) {
        container_fig.appendChild(ele);
    });
}

function _sort_figures_by(arr, meth, ascd) {
    arr.sort(function(a,b) {
        if (a.getAttribute(meth) < b.getAttribute(meth)) { return -1; }
        else if (a.getAttribute(meth) > b.getAttribute(meth)) {return 1; }
        else {return 0;}
    });
    if (ascd) {
        return arr;
    } else {
        return arr.reverse();
    }
}
