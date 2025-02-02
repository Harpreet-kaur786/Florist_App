

class MusicDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            // Validate whether IndexedDB is available
            if ('indexedDB' in window) {
                const request = indexedDB.open('MusicApp', 1);

                request.onerror = (event) => {
                    reject(event.target.error.message);
                };

                request.onsuccess = (event) => {
                    const db = event.target.result;
                    if(db){
                        this.db = db;
                        this.isAvailable = true;
                        resolve(); // Database successfully opened
                    }else{
                        reject('The database is not available.');
                    }
                    
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('MusicList')) {
                        db.createObjectStore('MusicList', { keyPath: 'id' });
                    }
                    console.log("Object store created or already exists.");
                };
            } else {
                reject('IndexedDB is not supported by this browser.');
            }
        });
    }

    add(title, artist) {
        return new Promise((resolve, reject) => {
            // Ensure the database is open and available
            if (!this.isAvailable || !this.db) {
                console.error("Database not open. Cannot add.");
                return reject('Database not opened!!');
            }

            const transaction = this.db.transaction(['MusicList'], 'readwrite');
            transaction.onerror = (event) => {
                console.error("[Transaction] Error:", event.target.error.message);
                reject(event.target.error.message);
            };

            const store = transaction.objectStore('MusicList');
            const storeRequest = store.add({
                id: Date.now(),
                title: title,
                artist: artist
            });

            storeRequest.onerror = (event) => {
                console.error('[Store] Add Error:', event.target.error.message);
                reject(event.target.error.message);
            };

            storeRequest.onsuccess = () => {
                resolve();
            };
        });
    }

 getAll(){
    
    return new Promise ((resolve, reject)=>{
      if(!this.isAvailable){
        reject('Database is not opened!');
      }
    
        //Transaction handlers.
        const transaction = this.db. transaction(['MusicList'], 'readonly');
        transaction.onerror = (event)=>{
            reject(event.target.error.message)
        };
    
        //Store handler
        const store = transaction.objectStore('MusicList');
        const request = store.getAll();
        request.onerror = (event)=>{
            reject(event.target.error.message)
        }
    
        request.onsuccess = (event) =>{
            
            resolve(event.target.result);
        };
    })
 }

 delete(id){
    return new Promise((resolve, reject)=>{
        if(!this.isAvailable){
            reject('Database is not opened!')
        }

        //Transaction handlers.
        const transaction = this.db.transaction(['MusicList'], 'readwrite');
        transaction.onerror = (event)=>{
            reject(event.target.error.message)
        }

        // Gets the store.

        const store = transaction.objectStore('MusicList');
        const request = store.delete(id);
        request.onerror = (event)=>{
            reject(event.target.error.message);
        }
        request.onsuccess = (event)=>{
            resolve();
        }
    })
 }
}
export default new MusicDB();
