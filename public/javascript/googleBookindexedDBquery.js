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
        console.log("init DB error", event, event.target.error.code,
        " - ", event.target.error.message);
      }

      request.onupgradeneeded = (event)=> {
        const db = event.target.result;
        const objectStore = db.createObjectStore('VolumesCart', {keyPath: "id"});
        objectStore.onerror = (event) =>{
          console.log('initialLoad - objectStore error: ', event.target.error.code,
          " - ", event.target.error.message);
        }
        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('dateadded', 'dateadded', { unique: false });

        console.log("indexedDB inited");
        db.close();
      }
    }

     addData = (data)=> {
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror=(event)=>{
        console.log("open DB error", event.target.error.code,
        " - ", event.target.error.message);
      }

      request.onsuccess=(event)=>{
        const db = event.target.result;
        const txn = db.transaction('VolumesCart', 'readwrite');
        txn.onerror = (event)=>{
          console.log("txn error", event.target.error.code,
          " - ", event.target.error.message);

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
          console.log("add error", event.target.error.code,
          " - ", event.target.error.message);
        }
      }
    }

    remove(volumeDataID){
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror= (event) =>{
        console.log("open DB error", event.target.error.code,
        " - ", event.target.error.message);
      }
      request.onsuccess = (event)=>{
        const db = event.target.result;
        const txn = db.transaction('VolumesCart', 'readwrite');
        txn.onerror = (event) => {
          console.log("txn error", event.target.error.code,
          " - ", event.target.error.message);
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

     updateData(data) {
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror=(event)=>{
        console.log("open DB error", event.target.error.code,
        " - ", event.target.error.message);
      }

      request.onsuccess=(event)=>{
        const db = event.target.result;
        const txn = db.transaction('VolumesCart', 'readwrite');
        txn.onerror = (event)=>{
          console.log("txn error", event.target.error.code,
          " - ", event.target.error.message);

        }
        txn.oncomplete=(event) =>{
          console.log("txm oncomplete");
        }
        const objectStore = txn.objectStore("VolumesCart");
        const updateValue = objectStore.put(data);
        updateValue.onsuccess=(event)=>{
          console.log("update success");
        }
        updateValue.onerror=(event)=>{
          console.log("update error", event.target.error.code,
          " - ", event.target.error.message);
        }
      }
    }

     queryAllrow() {
      const request = indexedDB.open(this.volumeCartDBname, version);
      request.onerror=(event)=>{
        console.log("open DB error", event.target.error.code,
        " - ", event.target.error.message);
      }

      return new Promise(function(resolve, reject) {
        request.onsuccess=(event)=>{
          const db = event.target.result;
          const txn = db.transaction('VolumesCart', 'readwrite');
          txn.onerror = (event)=>{
            console.log("txn error", event.target.error.code,
            " - ", event.target.error.message);

          }
          txn.oncomplete=(event) =>{
            console.log("txm oncomplete");
          }
          const objectStore = txn.objectStore('VolumesCart');
          //var queryData = objectStore.index("dateadded").openCursor(null,"next");
          var queryData = objectStore.getAll();
          queryData.onsuccess = (event) => {
            if (queryData.result !== undefined) {
              console.log('select obj success ');
              resolve(event.target.result);
            } else {
              reject(null);
            }
          }
        }
      });
    }

    queryItembyKey(key){
     const request = indexedDB.open(this.volumeCartDBname, version);
     request.onerror=(event)=>{
       console.log("open DB error", event.target.error.code,
       " - ", event.target.error.message);
     }

     return new Promise(function(resolve, reject) {
       request.onsuccess=(event)=>{
         const db = event.target.result;
         const txn = db.transaction('VolumesCart', 'readwrite');
         txn.onerror = (event)=>{
           console.log("txn error", event.target.error.code,
           " - ", event.target.error.message);

         }
         txn.oncomplete=(event) =>{
           console.log("txm oncomplete");
         }
         const objectStore = txn.objectStore('VolumesCart');
         var queryData = objectStore.get(key);
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

async function volumeCart_quantilyUp(volumeCart_ID){
  let volumeCart_ = new volumeCart(DBNAME);
  var data = await volumeCart_.queryItembyKey(volumeCart_ID);
  data.quantily +=1;
  volumeCart_.updateData(data);
}

async function volumeCart_quantilyDown(volumeCart_ID){
  let volumeCart_ = new volumeCart(DBNAME);
  var data = await volumeCart_.queryItembyKey(volumeCart_ID);
  if(data.quantily <=1)return;
  data.quantily -=1;
  volumeCart_.updateData(data);
}

async function volumeCart_selectItem(volumeCart_ID, selected){
  let volumeCart_ = new volumeCart(DBNAME);
  var data = await volumeCart_.queryItembyKey(volumeCart_ID);
  data.selected = selected;
  volumeCart_.updateData(data);
}
