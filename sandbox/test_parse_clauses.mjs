import fs from 'fs';
import path from 'path';

// Let's inspect the 3 clause JSON files
const no1Json = JSON.parse(fs.readFileSync('sandbox/csa_c22_1_clauses.json', 'utf8'));
const no60826Json = JSON.parse(fs.readFileSync('sandbox/csa_60826_clauses.json', 'utf8'));
const o15Json = JSON.parse(fs.readFileSync('sandbox/csa_o15_clauses.json', 'utf8'));

console.log('No1 clauses:', no1Json.clause_list.length, 'definitions:', Object.keys(no1Json.definitions || {}).length);
console.log('60826 clauses:', no60826Json.clause_list.length, 'definitions:', Object.keys(no60826Json.definitions || {}).length);
console.log('O15 clauses:', o15Json.clause_list.length, 'definitions:', Object.keys(o15Json.definitions || {}).length);

// Sample clauses
console.log('\nSample No1 clause:', JSON.stringify(no1Json.clause_list[5], null, 2));
console.log('\nSample 60826 clause:', JSON.stringify(no60826Json.clause_list[5], null, 2));
console.log('\nSample O15 clause:', JSON.stringify(o15Json.clause_list[5], null, 2));
