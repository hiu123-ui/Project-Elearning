export const keyLocalStorage = {
   INFO_USER:"INFO_USER",
   REGISTER_SUCCESS: "REGISTER_SUCCESS"
}

export const LocalStorage = {
    set:(key,value)=>{
     let valueString = JSON.stringify(value);
     localStorage.setItem(key,valueString)
    },
    get:(key)=>{
        let valueString = localStorage.getItem(key);
        return JSON.parse(valueString);
    },
    remove:(key)=>{
        localStorage.removeItem(key);
    }
}

