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
let settings_tog = false;
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
    const ret_arr = []
    grade_btns.forEach(function(btn) {
        const n_grade = btn.children[0].getAttribute("data-numberGr");
        ret_arr.push(n_grade)
        btn.children[0].innerHTML = btn.children[0].dataset.grade + ("(" + n_grade + ")");
        if (n_grade > 0) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    });
    return ret_arr;
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
        let im_grade_json;
        let cut_off;
        try {
            im_grade_json = JSON.parse(e.target.result);
        } catch {
            _show_notif("Invalid JSON file.");
        }
        const id_keys = Object.keys(im_grade_json["projects"]);
        grade_range = im_grade_json["G_R"];
        for (let i=0; i<id_keys.length; i++) {
            try {
                const student_id = id_keys[i];
                const student = im_grade_json["projects"][id_keys[i]];
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

                let bump_up_btn = document.createElement('label')
                bump_up_btn.setAttribute("onclick","bump_up(this)");
                bump_up_btn.dataset.figParent = student_id;
                bump_up_btn.dataset.bump = "up";
                let arrow = document.createElement("i");
                arrow.setAttribute("class", "arrow up");
                bump_up_btn.appendChild(arrow);
                bump_up_btn.className = "bump";

                let bump_down_btn = document.createElement('label')
                bump_down_btn.setAttribute("onclick","bump_down(this)");
                bump_down_btn.dataset.figParent = student_id;
                bump_down_btn.dataset.bump = "down";
                arrow = document.createElement("i");
                arrow.setAttribute("class", "arrow down");
                bump_down_btn.appendChild(arrow);
                bump_down_btn.className = "bump";

                fig.querySelector("figcaption").appendChild(bump_up_btn);
                fig.querySelector("figcaption").appendChild(bump_down_btn);

            } catch (error) {
                _show_notif("No submission: " + id_keys[i]);
                continue
            }
        }
        const n_grade_arr = _number_grade();
        _update_breakdown();
        _display_bumps();
        _create_table(grade_range,n_grade_arr);
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
    let container_fig = document.querySelector(".container__figs");
    _sort_figures_by(all_figs, method, asc).forEach(function(ele) {
        container_fig.appendChild(ele);
    });
    _display_bumps();
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
        _update_fig_breakdown(fig);
    });
}

function _update_fig_breakdown(fig) {
    let breakdown = "C:" + fig.dataset.coding + " P:" + fig.dataset.parameterisation + " D:"+ fig.dataset.differentiation;
        fig.querySelector(".breakdown").innerHTML = breakdown;
}

function _display_bumps() {
    const ele = document.getElementById("dropdown");
    const method = ele.options[ele.selectedIndex].getAttribute("value");
    let disp = "none";
    if (method == "byOverall") {
        disp = "block"
    }
    Array.from(document.getElementsByClassName("bump")).forEach(function(bump_btn) {
        bump_btn.style.display = disp;
    });
}

function _swap_attribs(ele1, ele2, attrib) {
    const store_ele1 = ele1.getAttribute(attrib);
    ele1.setAttribute(attrib, ele2.getAttribute(attrib));
    ele2.setAttribute(attrib, store_ele1);
}

function _swap_grades(fig, tar) {
    let message = _attr_to_str(fig) + " <> " + _attr_to_str(tar);
    _show_notif(message);
    _swap_attribs(fig, tar, "data-grade");
    _swap_attribs(fig, tar, "data-overall");
    _swap_attribs(fig, tar, "data-coding");
    _swap_attribs(fig, tar, "data-parameterisation");
    _swap_attribs(fig, tar, "data-differentiation");
    _update_fig_breakdown(fig);
    _update_fig_breakdown(tar);
}

function _attr_to_str(fig) {
    return fig.dataset.group + " " +
           fig.dataset.name + " (" +
           fig.dataset.grade + ")";
}

function bump_up(btn) {
    const fig = document.getElementById(btn.dataset.figParent);
    let target;
    try {
        target = fig.previousElementSibling;
        _swap_grades(fig, target);
        fig.parentNode.insertBefore(fig,target);
        _display_filtered();
    } catch {
        let bound_typ = "lower";
        if (!asc) {bound_typ = "upper";}
        _show_notif("Error: " + bound_typ + " bound reached");
    }
}

function bump_down(btn) {
    const fig = document.getElementById(btn.dataset.figParent);
    let target;
    try {
        target = fig.nextElementSibling;
        _swap_grades(fig, target);
        fig.parentNode.insertBefore(target,fig);
        _display_filtered();
    }  catch {
        let bound_typ = "lower";
        if (asc) {bound_typ = "upper";}
        _show_notif("Error: " + bound_typ + " bound reached");
    }
}

function _show_notif(message) {
    const info_box = document.getElementById("info");
    const TA_h = document.getElementById("TA");
    TA_h.style.display = "none";
    const temp = document.createElement("span")
    temp.innerHTML = message;
    temp.className = "temp_msg";
    info_box.appendChild(temp);
    setTimeout(function() {
        temp.parentNode.removeChild(temp);
        if (!_temp_exists()) {TA_h.style.display = "block";}},2000);
}

function _temp_exists() {
    const arr = Array.from(document.getElementsByClassName("temp_msg"));
    if (arr.length > 0) {
        return true;
    } else {
        return false;
    }
}

function clk_settings() {
    settings_tog = !settings_tog;
    _vis_settings();
}

function _vis_settings() {
    if (settings_tog) {
        document.querySelector(".aside__settings").style.maxWidth = "100%";
        document.querySelector(".aside__settings").style.minWidth = "20%";
        document.querySelector(".aside__section").style.display = "flex";
        document.querySelector(".main__article").style.maxWidth = "80%";
        document.querySelector("body").style.marginRight = 0;
    } else {
        document.querySelector(".aside__settings").style.maxWidth = "0";
        document.querySelector(".aside__settings").style.minWidth = "0";
        document.querySelector(".aside__section").style.display = "none";
        document.querySelector(".main__article").style.maxWidth = "100%";
        document.querySelector("body").style.marginRight = "2em";
    }
}

function _create_table(grade_range, n_grades) {
    let TBL = document.createElement("table");
    TBL.className = "table__grade"
    let TBL_COLUMNS = ["grade", "", "cut-off", "quantity"];
    let TBL_HEAD = TBL.createTHead();
    let TBL_BODY = TBL.createTBody();
    let HEADER_ROW = TBL_HEAD.insertRow(0);
    let TBL_DATA = [GRADES, grade_range[0], grade_range[1], n_grades];
    for (let i=0; i<TBL_DATA[0].length; i++) {
        let curr_row = HEADER_ROW;
        if (i > 0) {
            curr_row = TBL_BODY.insertRow(i-1);
        }  
        for (let j = 0; j<TBL_COLUMNS.length; j++) {
            let cell = curr_row.insertCell(j);
            if (i==0) {
                cell.innerHTML = TBL_COLUMNS[j];
            } else {
                let ins_data = TBL_DATA[j][i-1];
                if (GRADES[i-1] == "C") {
                    switch (j) {
                        case 1:
                            ins_data = "<"
                            break;
                        case 2:
                            ins_data = TBL_DATA[j][i-2];
                            break;
                    }
                } else {
                    if (j > 1) {
                        cell.setAttribute("contenteditable", true);
                        cell.className = "editable";
                    }
                }
                cell.innerHTML = ins_data;
                cell.id = GRADES[i-1] + "_" + j;
                cell.className += " cell"
            }
        }
    }  
    document.querySelector(".aside__footer").appendChild(TBL);
}

window.addEventListener("load", sort_figures);
window.addEventListener("load", _display_filtered);