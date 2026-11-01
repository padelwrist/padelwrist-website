import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const base=process.argv[2] || 'HEAD';
if(!/^[a-zA-Z0-9_./-]+$/.test(base))throw new Error('Invalid revision reference');
let previous;
try{previous=JSON.parse(execFileSync('git',['show',`${base}:catalogue/v1.json`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}));}
catch{console.log('No previous shared catalogue on base; initial v1 publication.');process.exit(0);}
const next=JSON.parse(await readFile(new URL('../catalogue/v1.json',import.meta.url),'utf8'));
if(next.revision<previous.revision || (JSON.stringify(next)!==JSON.stringify(previous) && next.revision<=previous.revision))throw new Error('Public catalogue changes require a strictly higher revision');
console.log('Public catalogue revision is consistent.');
