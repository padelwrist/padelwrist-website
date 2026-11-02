import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {stageIntake} from '../src/shop-intake.mjs';
const [intakeFile,reconciliationFile]=process.argv.slice(2);
if(!intakeFile||!reconciliationFile)throw new Error('Usage: node scripts/import-shop-intake.mjs INTAKE.json RECONCILIATION.json');
const sourcePath=fileURLToPath(new URL('../data/shop/catalogue.json',import.meta.url));
const source=JSON.parse(await readFile(sourcePath,'utf8'));
source.staging=stageIntake(JSON.parse(await readFile(intakeFile,'utf8')),JSON.parse(await readFile(reconciliationFile,'utf8')));
// Preserve reviewed incumbent URLs and all commercial gates. Intake never promotes a product.
await writeFile(sourcePath,JSON.stringify(source,null,2)+'\n');
console.log(`Staged ${source.staging.records.length} ASIN records, ${source.staging.researchLeads.length} research-only leads and ${source.staging.proposedFamilies.length} proposed families; published nothing.`);
