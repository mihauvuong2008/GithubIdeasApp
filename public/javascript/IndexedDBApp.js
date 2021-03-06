
let version = 3; // phien ban = 1 khong chay tren firefox cap nhat ngay 25/2/2021
let showStatus = (msg)=>{
  let logBox =  document.getElementById("logBoxID");
  console.log(msg);
  var current = new Date()
  logBox.value+= current.getHours()+":"+current.getMinutes()+":"+current.getSeconds() + ' --> '+ msg + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

let showNotif = (msg)=>{
  let notibox = document.getElementById("notifBoxID");
  console.log(msg);
  notibox .value+= '--> '+ msg + "\n";
  notibox.scrollTop = notibox.scrollHeight;
}

class Customer {
  constructor(dbName) {

    this.dbName = dbName;
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. \
      Such and such feature will not be available.");
    }else{
      //window.alert("Conguration! your browser support IndexedDB");
    }
  }


  /**
  * Remove all rows from the database
  * @memberof Customer
  */
  removeAllRows = async () => {
    const request = indexedDB.open(this.dbName, version);
    // version 1 khong chay duoc tren firefox hien tai

    return new Promise( function (resolve, reject) {
      request.onerror = (event) => {
        console.log('removeAllRows - Database error: ', event.target.error.code,
        " - ", event.target.error.message)
        var msg = 'removeAllRows - Database error: '+ event.target.error.code+
        " - "+ event.target.error.message;
        showStatus(msg);
        resolve();
      };

      request.onsuccess = (event) => {
        showStatus('Deleting all customers...');
        const db = event.target.result;
        const txn = db.transaction('customers', 'readwrite');
        txn.onerror = (event) => {
          showStatus('removeAllRows - Txn error: '+ event.target.error.code+
          " - "+ event.target.error.message);
        };
        txn.oncomplete = (event) => {
          //  showStatus('All rows removed!');
          showNotif('All rows removed!');
          resolve();
        };
        const objectStore = txn.objectStore('customers');
        const getAllKeysRequest = objectStore.getAllKeys();
        getAllKeysRequest.onsuccess = (event) => {
          getAllKeysRequest.result.forEach(key => {
            objectStore.delete(key);
          });
        }
      }
    });
  }//end removeAllRows

  /**
  *add Data function
  *
  */
  add = async (data)=> {
    const request = indexedDB.open(this.dbName, version);

    return new Promise( function (resolve, reject) {
      request.onerror = (event) => {
        showStatus('add Data - Database error: '+ event.target.error.code+
        " - "+ event.target.error.message);
        resolve('data is not added');
      };

      request.onsuccess = async (event) => {
        showStatus('add data customers...');
        const db = event.target.result;
        const txn = db.transaction('customers', 'readwrite');
        txn.onerror = (event) => {
          showStatus('add Rows - Txn error: '+ event.target.error.code+
          " - "+ event.target.error.message);
          resolve('data is not added');
        };
        txn.oncomplete = (event) => {
          showStatus('txn add Rows -success');
          //console.log('txn add Rows -success');
        };
        const objectStore = txn.objectStore('customers');
        const addValue = objectStore.add(data);
        addValue.onsuccess =  (event) => {
          //console.log('add Rows -success ');
          showStatus('add Rows -success ');
          showNotif('put customer data....: ' + data.userid + ", "+ data.name + ", " + data.email);;
          resolve();
        }
        showNotif('add Rows -success ');
      }
    });
  }// end add row

  queryAllrow = async ()=>{
    var request = indexedDB.open(this.dbName, version);
    return new Promise(function (resolve, reject) {

      request.onerror = (event) => {
        showStatus('select all Data - Database error: '+ event.target.error.code+
        " - "+ event.target.error.message);
        return;
      };

      request.onsuccess = (event) => {
        showStatus('select all data customers...');
        const db = event.target.result;
        const txn = db.transaction('customers', 'readwrite');
        txn.onerror = (event) => {
          showStatus('select all Rows - Txn error: '+ event.target.error.code+
          " - "+ event.target.error.message);
        };
        txn.oncomplete = (event) => {
          showStatus('txn select all Rows -success');
        };
        const objectStore = txn.objectStore('customers');
        var queryData = objectStore.getAll();
        queryData.onsuccess = (event) => {
          if (queryData.result !== undefined) {
            showStatus('select all Rows success :', queryData.result);
            showNotif('select all Rows success ');
            resolve(event.target.result);
          } else {
            showStatus("No result");
            resolve(null);
          }
        }
      }
    });
  }//end query all row
  /**
  * Populate the Customer database with an initial set of customer data
  * @param {[object]} customerData Data to add
  * @memberof Customer
  */
  initialLoad = async (customerData) => {

      showStatus('init...');
    // mo ket noi IndexedDB
    const request = indexedDB.open(this.dbName, version);

    return new Promise(function (resolve, reject) {
    //kiem tra loi?!!
    request.onerror = (event) => {
         showStatus('initialLoad - Database error: '+ event.target.error.code+
         " - "+ event.target.error.message);
         resolve("database is not loaded!");
    };
    // khoi tao obj store

    request.onupgradeneeded = (event) => {
      showStatus('Populating customers...');
      const db = event.target.result;
      const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
      // log error:
      objectStore.onerror = (event) => {
        showStatus('initialLoad - objectStore error: '+ event.target.error.code+
        " - "+ event.target.error.message);
        resolve("database is not loaded!");
      };

      // Create an index to search customers by name and email
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });

      // Populate the database with the initial set of rows
      resolve("database loaded!");
      customerData.forEach(function(customer) {
        objectStore.put(customer);
        showStatus('put customer data to view textbox...: '+ customer.userid
         + ", "+ customer.name + ", " + customer.email);
         showNotif('put customer data...: ' + customer.userid + ", "+ customer.name + ", " + customer.email);
      });
      db.close();
    };
  });
  }
}// end class



// Web page event handlers
const DBNAME = 'customer_db';

/**
* Clear all customer data from the database
*/
const clearDB = async () => {
  console.log('Delete all rows from the Customers database');
  showNotif('start delete all rows from the Customers database ');
  let customer = new Customer(DBNAME);
  await customer.removeAllRows();
  showNotif('end delete all rows from the Customers database ');
    document.getElementById("loadDBID").disabled = false;
    document.getElementById("queryDBID").disabled = false;
    document.getElementById("clearDBID").disabled = true;
}

/**
* Add customer data to the database
*/


const addData = async ()=> {
  showNotif('start add data to database!');
  var data = {
    userid: document.getElementById("userid").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value
  }
  let customer = new Customer(DBNAME);
  await customer.add(data);
  showNotif('adding data to database is finished!');
}


const loadDB = async () => {
//  console.log('Load the Customers database');
  document.getElementById("loadDBID").disabled = true;
  showNotif('Load the Customers database');
  // Customers to add to initially populate the database with
  const customerData = [
    { userid: '444', name: 'Bill', email: 'bill@company.com' },
    { userid: '555', name: 'Donna', email: 'donna@home.org' }
  ];
  let customer = new Customer(DBNAME);
  await customer.initialLoad(customerData);
  showNotif('database loaded!');
    document.getElementById("clearDBID").disabled = false;
    document.getElementById("queryDBID").disabled = false;
}



const queryDB = async ()=>{
  document.getElementById("loadDBID").disabled = true;
  showNotif('start query all data!');
  let customer = new Customer(DBNAME);
  let  result = await customer.queryAllrow();
  //get table
  var table = document.getElementById("IndexedDBData_table_id");
  // insert table header
  table.innerHTML="<tr> <th>STT</th> <th>USER ID</th> <th>NAME</th> <th>EMAIL</th> </tr>"
  console.log("data: ",await  result );
  result.forEach((item, i) => {
    console.log("data2: ",   item );
    var row = table.insertRow(-1);// insert last
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = i;
    cell2.innerHTML = item.userid;
    cell3.innerHTML = item.name;
    cell4.innerHTML = item.email;
  });
    showNotif('query completed!');
      document.getElementById("clearDBID").disabled = false;
      document.getElementById("queryDBID").disabled = false;
}
