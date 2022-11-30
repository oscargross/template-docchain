import { db } from './firebase-config';
import { doc, getDoc, setDoc, updateDoc, deleteField, collection, query, where, getDocs } from 'firebase/firestore';

// if !return = no exist
export const getSBT = async (address) => await getDoc(doc(db, "sbt", address)).then(r => Object.entries(r.data())).catch(e => []);
// if return = error
export const newRegister = async (address, prop) => await setDoc(doc(db, "sbt", address), prop).then(r => r).catch(e => e);
// if return = error

export const deleteRegister = async (address, key) => await updateDoc(doc(db, "sbt", address), { [key]: deleteField() }).then(r => r).catch(e => e);

export const getCollections = async (address) => {
  const q = query(collection(db, "collections"), where("owner", "==", address));
  const querySnapshot = await getDocs(q);
  let arr = []
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id })
  });
  return arr
}

export const setNameAddr = async (addr, name) => await setDoc(doc(db, "names", addr), {name:name}).then(r => r).catch(e => e);

export const editSBT = async (path) => await updateDoc(doc(db, "sbts", path), { accepted: true, mintDate: new Date(Date.now()).toLocaleString().split(',')[0] }).then(r => r).catch(e => e);

export const editCollection = async (contract, count) => await updateDoc(doc(db, "collections", contract), { sbts: count }).then(r => r).catch(e => e);

export const getNameByAddr = async (address) => await getDoc(doc(db, "names", address)).then(r => r.data()?.name).catch(e => undefined);


export const getSBTs = async (contract) => {
  const q = query(collection(db, "sbts"), where("contract", "==", contract));
  const querySnapshot = await getDocs(q);
  let arr = []
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id })
  });
  return arr
}
export const getSBTsSign = async (recipient, signed) => {
  const q = query(collection(db, "sbts"), where("recipient", "==", recipient), where('accepted', "==", signed));
  const querySnapshot = await getDocs(q);
  let arr = []
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id })
  });
  return arr
}

export const addSBT = async (path, prop) => await setDoc(doc(db, "sbts", path), prop).then(r => r).catch(e => e);

export const addCollection = async (address, prop) => await setDoc(doc(db, "collections", address), prop).then(r => r).catch(e => e);


// if !return = no exist
export const getSign = async (address) => await getDoc(doc(db, "sbt", address)).then(r => r.data()).catch(e => undefined);
// if return = error
export const newSign = async (address, prop) => await setDoc(doc(db, "sbt", address), prop).then(r => r).catch(e => e);
// if return = error
export const editSign = async (address, prop) => await updateDoc(doc(db, "sbt", address), prop).then(r => r).catch(e => e);
