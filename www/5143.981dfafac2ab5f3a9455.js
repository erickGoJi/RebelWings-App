(self.webpackChunkrebel_wings_app=self.webpackChunkrebel_wings_app||[]).push([[5143],{5143:(t,e,r)=>{"use strict";r.r(e),r.d(e,{FilesystemWeb:()=>o});var i=r(8384);function s(t){const e=t.split("/").filter(t=>"."!==t),r=[];return e.forEach(t=>{".."===t&&r.length>0&&".."!==r[r.length-1]?r.pop():r.push(t)}),r.join("/")}let o=(()=>{class t extends i.Uw{constructor(){super(...arguments),this.DB_VERSION=1,this.DB_NAME="Disc",this._writeCmds=["add","put","delete"]}async initDb(){if(void 0!==this._db)return this._db;if(!("indexedDB"in window))throw this.unavailable("This browser doesn't support IndexedDB");return new Promise((e,r)=>{const i=indexedDB.open(this.DB_NAME,this.DB_VERSION);i.onupgradeneeded=t.doUpgrade,i.onsuccess=()=>{this._db=i.result,e(i.result)},i.onerror=()=>r(i.error),i.onblocked=()=>{console.warn("db blocked")}})}static doUpgrade(t){const e=t.target.result;switch(t.oldVersion){case 0:case 1:default:e.objectStoreNames.contains("FileStorage")&&e.deleteObjectStore("FileStorage"),e.createObjectStore("FileStorage",{keyPath:"path"}).createIndex("by_folder","folder")}}async dbRequest(t,e){const r=-1!==this._writeCmds.indexOf(t)?"readwrite":"readonly";return this.initDb().then(i=>new Promise((s,o)=>{const a=i.transaction(["FileStorage"],r).objectStore("FileStorage")[t](...e);a.onsuccess=()=>s(a.result),a.onerror=()=>o(a.error)}))}async dbIndexRequest(t,e,r){const i=-1!==this._writeCmds.indexOf(e)?"readwrite":"readonly";return this.initDb().then(s=>new Promise((o,a)=>{const n=s.transaction(["FileStorage"],i).objectStore("FileStorage").index(t)[e](...r);n.onsuccess=()=>o(n.result),n.onerror=()=>a(n.error)}))}getPath(t,e){const r=void 0!==e?e.replace(/^[/]+|[/]+$/g,""):"";let i="";return void 0!==t&&(i+="/"+t),""!==e&&(i+="/"+r),i}async clear(){(await this.initDb()).transaction(["FileStorage"],"readwrite").objectStore("FileStorage").clear()}async readFile(t){const e=this.getPath(t.directory,t.path),r=await this.dbRequest("get",[e]);if(void 0===r)throw Error("File does not exist.");return{data:r.content?r.content:""}}async writeFile(t){const e=this.getPath(t.directory,t.path),r=t.data,i=t.recursive,s=await this.dbRequest("get",[e]);if(s&&"directory"===s.type)throw"The supplied path is a directory.";const o=t.encoding,a=e.substr(0,e.lastIndexOf("/"));if(void 0===await this.dbRequest("get",[a])){const e=a.indexOf("/",1);if(-1!==e){const r=a.substr(e);await this.mkdir({path:r,directory:t.directory,recursive:i})}}const n=Date.now(),d={path:e,folder:a,type:"file",size:r.length,ctime:n,mtime:n,content:!o&&r.indexOf(",")>=0?r.split(",")[1]:r};return await this.dbRequest("put",[d]),{uri:d.path}}async appendFile(t){const e=this.getPath(t.directory,t.path);let r=t.data;const i=e.substr(0,e.lastIndexOf("/")),s=Date.now();let o=s;const a=await this.dbRequest("get",[e]);if(a&&"directory"===a.type)throw"The supplied path is a directory.";if(void 0===await this.dbRequest("get",[i])){const e=i.indexOf("/",1);if(-1!==e){const r=i.substr(e);await this.mkdir({path:r,directory:t.directory,recursive:!0})}}void 0!==a&&(r=a.content+r,o=a.ctime);const n={path:e,folder:i,type:"file",size:r.length,ctime:o,mtime:s,content:r};await this.dbRequest("put",[n])}async deleteFile(t){const e=this.getPath(t.directory,t.path);if(void 0===await this.dbRequest("get",[e]))throw Error("File does not exist.");if(0!==(await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)])).length)throw Error("Folder is not empty.");await this.dbRequest("delete",[e])}async mkdir(t){const e=this.getPath(t.directory,t.path),r=t.recursive,i=e.substr(0,e.lastIndexOf("/")),s=(e.match(/\//g)||[]).length,o=await this.dbRequest("get",[i]),a=await this.dbRequest("get",[e]);if(1===s)throw Error("Cannot create Root directory");if(void 0!==a)throw Error("Current directory does already exist.");if(!r&&2!==s&&void 0===o)throw Error("Parent directory must exist");if(r&&2!==s&&void 0===o){const e=i.substr(i.indexOf("/",1));await this.mkdir({path:e,directory:t.directory,recursive:r})}const n=Date.now(),d={path:e,folder:i,type:"directory",size:0,ctime:n,mtime:n};await this.dbRequest("put",[d])}async rmdir(t){const{path:e,directory:r,recursive:i}=t,s=this.getPath(r,e),o=await this.dbRequest("get",[s]);if(void 0===o)throw Error("Folder does not exist.");if("directory"!==o.type)throw Error("Requested path is not a directory");const a=await this.readdir({path:e,directory:r});if(0!==a.files.length&&!i)throw Error("Folder is not empty");for(const n of a.files){const t=`${e}/${n}`;"file"===(await this.stat({path:t,directory:r})).type?await this.deleteFile({path:t,directory:r}):await this.rmdir({path:t,directory:r,recursive:i})}await this.dbRequest("delete",[s])}async readdir(t){const e=this.getPath(t.directory,t.path),r=await this.dbRequest("get",[e]);if(""!==t.path&&void 0===r)throw Error("Folder does not exist.");return{files:(await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)])).map(t=>t.substring(e.length+1))}}async getUri(t){const e=this.getPath(t.directory,t.path);let r=await this.dbRequest("get",[e]);return void 0===r&&(r=await this.dbRequest("get",[e+"/"])),{uri:(null==r?void 0:r.path)||e}}async stat(t){const e=this.getPath(t.directory,t.path);let r=await this.dbRequest("get",[e]);if(void 0===r&&(r=await this.dbRequest("get",[e+"/"])),void 0===r)throw Error("Entry does not exist.");return{type:r.type,size:r.size,ctime:r.ctime,mtime:r.mtime,uri:r.path}}async rename(t){return this._copy(t,!0)}async copy(t){return this._copy(t,!1)}async requestPermissions(){return{publicStorage:"granted"}}async checkPermissions(){return{publicStorage:"granted"}}async _copy(t,e=!1){let{toDirectory:r}=t;const{to:i,from:o,directory:a}=t;if(!i||!o)throw Error("Both to and from must be provided");r||(r=a);const n=this.getPath(a,o),d=this.getPath(r,i);if(n===d)return;if(function(t,e){t=s(t),e=s(e);const r=t.split("/"),i=e.split("/");return t!==e&&r.every((t,e)=>t===i[e])}(n,d))throw Error("To path cannot contain the from path");let c;try{c=await this.stat({path:i,directory:r})}catch(u){const t=i.split("/");t.pop();const e=t.join("/");if(t.length>0&&"directory"!==(await this.stat({path:e,directory:r})).type)throw new Error("Parent directory of the to path is a file")}if(c&&"directory"===c.type)throw new Error("Cannot overwrite a directory with a file");const h=await this.stat({path:o,directory:a}),l=async(t,e,i)=>{const s=this.getPath(r,t),o=await this.dbRequest("get",[s]);o.ctime=e,o.mtime=i,await this.dbRequest("put",[o])},y=h.ctime?h.ctime:Date.now();switch(h.type){case"file":{const t=await this.readFile({path:o,directory:a});return e&&await this.deleteFile({path:o,directory:a}),await this.writeFile({path:i,directory:r,data:t.data}),void(e&&await l(i,y,h.mtime))}case"directory":{if(c)throw Error("Cannot move a directory over an existing object");try{await this.mkdir({path:i,directory:r,recursive:!1}),e&&await l(i,y,h.mtime)}catch(u){}const t=(await this.readdir({path:o,directory:a})).files;for(const s of t)await this._copy({from:`${o}/${s}`,to:`${i}/${s}`,directory:a,toDirectory:r},e);e&&await this.rmdir({path:o,directory:a})}}}}return t._debug=!0,t})()}}]);