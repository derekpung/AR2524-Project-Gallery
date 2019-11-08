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
    const all_btns = document.getElementsByClassName("btn");
    for (let btn_i=0; btn_i < all_btns.length; btn_i++) {
        const btn = all_btns[btn_i];
        btn.classList.remove("selected");
    }
    ele.classList.add("selected");
    _display_filtered();    
}

function _display_filtered() {
    const id = document.getElementsByClassName("selected")[0].id;
    let filtered_grp = id.substring(0,2).replace("_","");
    const all_figs = document.getElementsByTagName("figure");

    for (let fig_i=0; fig_i < all_figs.length; fig_i++) {
        const fig = all_figs[fig_i];
        if (filtered_grp == "AL" || fig.getAttribute("data-grade") == filtered_grp || fig.getAttribute("data-group") == filtered_grp){
            fig.style.display = "block";
        } else {
            fig.style.display = "none";
        }
    }
}

function _create_grade_btns() {
    GRADES.forEach(function(grd){
        let new_btn = document.createElement("div");
        new_btn.setAttribute("id" , grd+'_fbtn');
        new_btn.setAttribute("onclick", "filter_group(this)");
        new_btn.className = "btn grade_btn";
        let new_btn_span = document.createElement("span");
        new_btn_span.innerHTML = grd;
        new_btn_span.setAttribute("data-numberGr", 0);
        new_btn_span.setAttribute("data-grade", grd);
        new_btn.appendChild(new_btn_span);
        new_btn.style.display = "none";
        document.getElementsByClassName("btn_grp")[0].appendChild(new_btn);
    });
}

function _append_dropdown() {
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

function _number_grade() {
    const grade_btns = Array.from(document.getElementsByClassName("grade_btn"));
    grade_btns.forEach(function(btn) {
        const n_grade = btn.children[0].getAttribute("data-numberGr");
        btn.children[0].innerHTML = btn.children[0].dataset.grade + ("(" + n_grade + ")");
        if (n_grade > 0) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    });
}

function import_json() {
    let files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }
    _clear_attributes();
    const file_name = files.item(0).name;
    document.getElementById("import__fileName").innerHTML = file_name;
    ALL_GRPS = ALL_GRPS.concat(GRADES)
    _create_grade_btns();
    if (!imported) {_append_dropdown();}

    let fr = new FileReader();
    fr.onload = function(e) { 
        console.log(e);
        const id_obj = JSON.parse(e.target.result);
        const id_keys = Object.keys(id_obj);
        for (let i=0; i<id_keys.length; i++) {
            try {
                const student_id = id_keys[i];
                const student = id_obj[id_keys[i]];
                const student_grade = GRADES[student["GRADE"]];
                const code_grade = student["CODING"];
                const para_grade = student["PARAMETERISATION"];
                const diff_grade = student["DIFFERENTIATION"];
                const overall_grade = student["SCORE"];

                const grade_span = document.getElementById(student_grade+'_fbtn').children[0];
                grade_span.setAttribute("data-numberGr", Number(grade_span.getAttribute("data-numberGr")) + 1);
                
                let fig = document.getElementById(student_id)

                fig.setAttribute("data-grade", student_grade);
                fig.setAttribute("data-overall", overall_grade)
                fig.setAttribute("data-coding", code_grade);
                fig.setAttribute("data-parameterisation", para_grade);
                fig.setAttribute("data-differentiation", diff_grade);

            } catch (error) {
                console.log(error);
                console.log("No submission: " + id_keys[i])
                continue
            }
        }
        _number_grade();
        _update_breakdown();
    }
    fr.readAsText(files.item(0));
    imported = true;
}

function toggle_asc() {
    const ele =  document.getElementById("sort_toggle_btn")
    asc = !asc;
    const i = asc ? 1 : 0;
    ele.innerHTML = SORT_STATES[i];
    sort_figures();
}

function sort_figures() {
    const ele = document.getElementById("dropdown");
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

function _clear_attributes() {
    let all_figs = Array.from(document.getElementsByTagName("figure"));
    all_figs.forEach(function(fig) {
        fig.setAttribute("data-grade", "U");
        fig.setAttribute("data-overall", "U")
        fig.setAttribute("data-coding", "U");
        fig.setAttribute("data-parameterisation", "U");
        fig.setAttribute("data-differentiation", "U");
    });
    const grade_btns = Array.from(document.getElementsByClassName("grade_btn"));
    grade_btns.forEach(function(btn) {
        btn.children[0].setAttribute("data-numberGr", 0);
    });
}

function _update_breakdown() {
    let all_figs = Array.from(document.getElementsByTagName("figure"));
    all_figs.forEach(function(fig) {
        let breakdown = "C:" + fig.dataset.coding + " P:" + fig.dataset.parameterisation + " D:"+ fig.dataset.differentiation;
        fig.getElementsByClassName("breakdown")[0].innerHTML = breakdown;
    });
}

window.addEventListener("load", sort_figures);
window.addEventListener("load", _display_filtered);