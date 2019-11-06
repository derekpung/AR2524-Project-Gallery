const ALL_GRPS = ["G1", "G2", "G3", "G4", "G5", "G6"];

function filter_group(ele) {
    const id = ele.id
    const all_figs = document.getElementsByTagName("figure");
    const all_btns = document.getElementsByClassName("btn");
    for (let btn_i=0; btn_i < all_btns.length; btn_i++) {
        const btn = all_btns[btn_i];
        btn.classList.remove("selected");
    }
    ele.classList.add("selected");
    let filtered_grp = id.substring(0,2);
    for (let fig_i=0; fig_i < all_figs.length; fig_i++) {
        const fig = all_figs[fig_i];
        fig.classList.remove("hide");
    }
    if (filtered_grp == "AL") {
        return;
    }
    for (let grp_i=0; grp_i < ALL_GRPS.length; grp_i++) {
        const grp = ALL_GRPS[grp_i];
        if (filtered_grp == grp) {
            continue;
        } else {
            fil_figs = document.getElementsByClassName(grp);
            for (let fil_i=0; fil_i<fil_figs.length; fil_i++) {
                fil_figs[fil_i].classList.add("hide");
                console.log(fil_figs[fil_i].classList);
            }
        }
    }
}