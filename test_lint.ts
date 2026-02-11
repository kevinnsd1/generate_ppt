// This file contains intentional lint errors to test Husky
// prefer-const violation: 'x' is never reassigned, should be 'const'
let x = 10;
console.log(x);

// no-unused-vars violation (if enabled): 'y' is defined but never used
const y = 20; 
