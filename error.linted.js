let constReassigned = "hello" + " world";
constReassigned = "world";
const constNeverReassigned = "hello";
const constWithObject = {
  hello: "world"
};
constWithObject.hello = "Olá";
let constWithObjectReassigned = {
  hello: "world"
};
constWithObject.hello = "Olá";
constWithObjectReassigned = {
  hello: "world"
};
const letNeverReassigned = "hello" + " world";
let letReassigned = "hello";
letReassigned = "world";
const letWithObject = {
  hello: "world"
};
letWithObject.hello = "Olá";
let letWithObjectReassigned = {
  hello: "world"
};
letWithObject.hello = "Olá";
letWithObjectReassigned = {
  hello: "world"
};
const varNeverReassigned = "hello" + " world";
let varReassigned = "hello";
varReassigned = "world";
const varWithObject = {
  hello: "world"
};
varWithObject.hello = "Olá";
let varWithObjectReassigned = {
  hello: "world"
};
varWithObjectReassigned.hello = "Olá";
varWithObjectReassigned = {
  hello: "world"
};
