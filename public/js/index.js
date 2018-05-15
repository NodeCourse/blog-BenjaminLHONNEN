
function addIdToHiddenInput(id,type) {
    document.getElementById("changeValue-" + id).value = type;
    document.getElementById("form-" + id).submit();
}