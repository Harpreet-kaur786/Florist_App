import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * music API for Firebase
 */

class MusicDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }
    open() {
        return new Promise((resolve, reject) => {
            try {
                // Your web app's Firebase configuration
                const firebaseConfig = {
                    apiKey: "AIzaSyCeBPwUoq47vBLWNocOWk3A9hSHYKct15I",
                    authDomain: "musicapp-75122.firebaseapp.com",
                    projectId: "musicapp-75122",
                    storageBucket: "musicapp-75122.appspot.com",
                    messagingSenderId: "894998127371",
                    appId: "1:894998127371:web:57af1c801824e3622db80e"
                };

                // Initialize Firebase
                const app = initializeApp(firebaseConfig);

                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);
                if (db) {
                    this.db = db;
                    this.isAvailable = true;
                    resolve();
                } else {

                    reject('The database is not available');
                }
            }
            catch (error) {
                reject(error.message);
            }
        });


    }
    add(title, artist) {

        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened')
            }

            //Create the music object to be add

            const music = {
                title: title,
                artist: artist
            };

            //Connect to the firebase collection
            const dbCollection = collection(this.db, 'MusicList');

            // Include the new object to the collection
            addDoc(dbCollection, music)
                .then((docRef) => {
                    resolve();
                })
                .catch((error) => {
                    reject(error.message);
                })
        });
    }

    getAll() {
        console.log('MusicDB getAll:');
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opend!');

            }

            //Connect to the Firebase Collection
            const dbCollection = collection(this.db, 'MusicList');


            //Get the data from the collection
            getDocs(dbCollection)
                .then((querySnapshot) => {
                    const result = [];
                    querySnapshot.forEach((doc) => {

                        const data = doc.data();
                        data.id = doc.id;
                        result.push(data);

                    });
                    resolve(result);
                })
                .catch((error) => {
                    reject(error.message)
                })
        })
    }

    update(updateList) {
        console.log('MusicDb update:', updateList);
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('database not available!');
            }
            //Get the document refrence
            const docRef = doc(this.db, 'MusicList', updateList.id);

            //Update the document.
            updateDoc(docRef, {
                title: updateList.title

            }).then(() => {
                resolve();
            })
                .catch((error) => {
                    reject(error.message)
                })
        });
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database is not available!')
            }

            //Get the document refrence
            const docRef = doc(this.db, 'MusicList', id);

            //Delete the document
            deleteDoc(docRef)
                .then(() => {
                    resolve();
                }).catch((error) => {
                    console(error.message)
                })
        })
    }
}

export default new MusicDB();