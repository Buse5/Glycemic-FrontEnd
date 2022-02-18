import CryptoJS from 'crypto-js';
import { ResultFoods } from './models/IFoods';
import { UserResult } from './models/IUser';
                        
export const encryptData = (data:any, salt:string) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();


export const decryptData = (ciphertext:string, salt:string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
    try {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    catch(err){
        return null;
    }
}

// user object control
export const control = () => {

    const localUser = localStorage.getItem("user")
    if ( localUser ) {
        const key = process.env.REACT_APP_SALT
        const decrypt = decryptData(localUser, key!)
        if ( decrypt !== null ) {
            try {
                const usr:UserResult = decrypt
                return usr
            } catch (error) {
                localStorage.removeItem("user")
                return null
            }
        }else {
            localStorage.removeItem("user")
            return null
        }
    }else {
        return null
    }

}

// aut control
export const autControl = () => {
    const stLocal = localStorage.getItem("aut")
    if ( stLocal ) {
        const key = process.env.REACT_APP_SALT
        const decrypt = decryptData(stLocal, key!)
        if ( decrypt !== null ) { 
            try {
                return decrypt;
            } catch (error) {
                return null;
            }
        }else {
            return null; 
        }
    }else {
        return null;
    }
}

export const fncDateConvert = (time:number) : string =>  {
    let dt = new Date(time)
    if ( time === 0 ) {
        dt = new Date()
    }
    return (dt.getDate() > 9 ? dt.getDate() : "0"+dt.getDate() ) + "." + ((dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : "0" +( dt.getMonth() + 1)) + "." + dt.getFullYear()
}

// basket add item and control
export const basketAdd = ( item: ResultFoods ) => {

    let arr:ResultFoods[] = []
    const oldDataString = localStorage.getItem("basket")
    if ( oldDataString ) {
        arr = JSON.parse(oldDataString)
        arr.push(item)
        const newString = JSON.stringify( arr )
        localStorage.setItem("basket", newString)
    }else {
        arr.push(item)
        const newString = JSON.stringify( arr )
        localStorage.setItem("basket", newString)
    }
}

// basket all items data
export const allDataBasket = () => {
    let arr:ResultFoods[] = []
    try {
        // basket data kontrol
        const oldDataString = localStorage.getItem("basket")
        if ( oldDataString ) {
            arr = JSON.parse(oldDataString)
        }
    } catch (error) {
        localStorage.removeItem("basket")
    }
    return arr
}


// basket item delete for index
export const deleteItemBasket = ( index:number ) => {
    let arr:ResultFoods[] = []
    try {
        // basket data kontrol
        const oldDataString = localStorage.getItem("basket")
        if ( oldDataString ) {
            arr = JSON.parse(oldDataString)
            arr.splice(index, 1)
            const newString = JSON.stringify( arr )
            localStorage.setItem("basket", newString)
        }
    } catch (error) {
        localStorage.removeItem("basket")
    }
    return arr
}