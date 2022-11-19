import { db } from './firebase-config';
import { doc, getDoc, setDoc, updateDoc, deleteField, collection, query, where, getDocs } from 'firebase/firestore';

// if !return = no exist
export const getSBT = async (address) => await getDoc(doc(db, "sbt", address)).then(r => Object.entries(r.data())).catch(e => []);
// if return = error
export const newRegister = async (address, prop) => await setDoc(doc(db, "sbt", address), prop).then(r => r).catch(e => e);
// if return = error
export const editRegister = async (address, prop) => await updateDoc(doc(db, "sbt", address), prop).then(r => r).catch(e => e);

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

// if !return = no exist
export const getSign = async (address) => await getDoc(doc(db, "sbt", address)).then(r => r.data()).catch(e => undefined);
// if return = error
export const newSign = async (address, prop) => await setDoc(doc(db, "sbt", address), prop).then(r => r).catch(e => e);
// if return = error
export const editSign = async (address, prop) => await updateDoc(doc(db, "sbt", address), prop).then(r => r).catch(e => e);
