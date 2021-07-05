const searchwrapper = document.querySelector(".search-input");
const inputbox = searchwrapper.querySelector("input");
const suggestionbox = searchwrapper.querySelector(".autocom-box");


inputbox.onkeyup = (e) => {
    let userdata = e.target.value;
    let emptyarray = [];
    if (userdata) {
        emptyarray = suggestion.filter((data) => {
            return data.toLocaleLowerCase().startsWith(userdata.toLocaleLowerCase());

        });
        emptyarray = emptyarray.map((data) => {
            return data = '<li>' + data + '</li>';
        });
        // console.log(emptyarray)
        searchwrapper.classList.add("active");
        showsuggestion(emptyarray);
        let alllist = suggestionbox.querySelector("li");
        for (let i = 0; i < alllist.length; i++) {
            alllist[i].setAttribute("onclick", "select(this)");
        }
    }
    else {
        searchwrapper.classList.remove("active");
    }
}

function select(element) {
    let selectuserdata = element.textContent;
    inputbox.value = selectuserdata;
}

function showsuggestion(list) {
    let listdata;
    if (!list.length) {
        uservalue = inputbox.value;
        listdata = '<li>' + uservalue;
    }
    else {
        listdata = list.join('');
    }
    if (listdata != undefined) {
        suggestionbox.innerHTML = listdata;
    }
}



function grabplacedata() {
    var str = document.getElementById("place").value;
    search(str);

}