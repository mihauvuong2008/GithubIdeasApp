let version = 3; // phien ban = 1 khong chay tren firefox cap nhat ngay 25/2/2021

class volumeCart{
  constructor(volumeCartDBname){
    this.volumeCartDBname = volumeCartDBname;
    if(!window.indexedDB){
      alert("your browser is not support indexedDB");
    }
  }

     initDB = ()=>{
      // open coonect
      const request = indexedDB.open(this.volumeCartDBname, version);

      request.onerror=(event)=>{
        console.log("init DB error", event);
      }

      request.onupgradeneeded = (event)=> {
        const db = event.target.result;
        const objectStore = db.createObjectStore('VolumesCart', {keyPath: "id"});
        objectStore.onerror = (event) =>{
          console.log('initialLoad - objectStore error: ', event.target.error.code,
          " - ", event.target.error.message);
        }
        objectStore.createIndex('title', 'title', { unique: false });
        objectStore.createIndex('authors', 'authors', { unique: true });

        console.log("indexedDB inited");
        db.close();
      }
    }

     addData = (data)=> {
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror=(event)=>{
        console.log("open DB error");
      }

      request.onsuccess=(event)=>{
        const db = event.target.result;
        const txn = db.transaction('VolumesCart', 'readwrite');
        txn.onerror = (event)=>{
          console.log("txn error");

        }
        txn.oncomplete=(event) =>{
          console.log("txm oncomplete");
        }
        const objectStore = txn.objectStore("VolumesCart");
        const addValue = objectStore.add(data);
        addValue.onsuccess=(event)=>{
          console.log("add success");
        }
        addValue.onerror=(event)=>{
          console.log("add error");
        }
      }
    }

    remove(volumeDataID){
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror= (event) =>{
        console.log("open DB error");
      }
      request.onsuccess = (event)=>{
        const db = event.target.result;
        const txn = db.transaction('VolumesCart', 'readwrite');
        txn.onerror = (event) => {
          console.log("txn error");
        }
        txn.completed = (event)=>{
          console.log("txn complete");
        }
        const objectStore = txn.objectStore("VolumesCart");
        objectStore.delete(volumeDataID);
          console.log("del complete");
        db.close();
      }
    }

     update(data) {
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror=(event)=>{
        console.log("open DB error");
      }

      request.onsuccess=(event)=>{
        const db = event.target.result;
        const txn = db.transaction('VolumesCart', 'readwrite');
        txn.onerror = (event)=>{
          console.log("txn error");

        }
        txn.oncomplete=(event) =>{
          console.log("txm oncomplete");
        }
        const objectStore = txn.objectStore("VolumesCart");
        const updateValue = objectStore.put(data);
        updateValue.onsuccess=(event)=>{
          console.log("add success");
        }
        updateValue.onerror=(event)=>{
          console.log("add error");
        }
      }
    }

     queryAllrow() {
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror=(event)=>{
        console.log("open DB error");
      }

      return new Promise(function(resolve, reject) {
        request.onsuccess=(event)=>{
          const db = event.target.result;
          const txn = db.transaction('VolumesCart', 'readwrite');
          txn.onerror = (event)=>{
            console.log("txn error");

          }
          txn.oncomplete=(event) =>{
            console.log("txm oncomplete");
          }
          const objectStore = txn.objectStore('VolumesCart');
          var queryData = objectStore.getAll();
          queryData.onsuccess = (event) => {
            if (queryData.result !== undefined) {
              console.log('select all Rows success :', queryData.result);
              resolve(event.target.result);
            } else {
              reject(null);
            }
          }
        }
      });
    }

}


const DBNAME = 'volumecart_db';

function volumeCart_idxDB_removeData(volumeDataID) {
  var volumecart = new volumeCart(DBNAME);
  volumecart.remove(volumeDataID);
}

function initindexedDB() {
  var volumecart = new volumeCart(DBNAME);
  volumecart.initDB();
}

function volumeCart_idxDB_addData(data) {
  var volumecart = new volumeCart(DBNAME);
  volumecart.addData(data);
}
async function loadAllData(){
  let volumeCart_ = new volumeCart(DBNAME);
  return await volumeCart_.queryAllrow();
}
