import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const base=process.argv[2] || 'HEAD';
if(!/^[a-zA-Z0-9_./-]+$/.test(base))throw new Error('Invalid revision reference');
for(const version of [1,2]) {
 const file=`catalogue/v${version}.json`;let previous;
 try{previous=JSON.parse(execFileSync('git',['show',`${base}:${file}`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}));}
 catch{console.log(`Initial v${version} publication.`);continue;}
 const next=JSON.parse(await readFile(new URL('../'+file,import.meta.url),'utf8'));
 if(next.revision<previous.revision || (JSON.stringify(next)!==JSON.stringify(previous) && next.revision<=previous.revision))throw new Error('Public catalogue changes require a strictly higher revision');
 console.log(`v${version} revision consistent.`);
}
