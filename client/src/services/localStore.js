export function saveLocalStore(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

export function readLocalStore(key, undefineValue){
    const localData = JSON.parse(localStorage.getItem(key));
    return localData? localData : undefineValue;
}

export function deleteLocalStore(key){
    localStorage.removeItem(key)
}

export function clearLocalStore(){
    localStorage.clear()
}