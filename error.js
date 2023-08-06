// Const

const constReassigned = 'hello' + ' world'
constReassigned = 'world'
const constNeverReassigned = 'hello'
// constNeverReassigned = 'world'
const constWithObject = {
    hello: 'world'
}
constWithObject.hello = 'Olá'
const constWithObjectReassigned = {
    hello: 'world'
}
constWithObject.hello = 'Olá'
constWithObjectReassigned = {
    hello: 'world'
}

// hello = "oi"

// Let

let letNeverReassigned = 'hello' + " world"
let letReassigned = 'hello'
letReassigned = 'world'
let letWithObject = {
    hello: 'world'
}
letWithObject.hello = 'Olá'
let letWithObjectReassigned = {
    hello: 'world'
}
letWithObject.hello = 'Olá'
letWithObjectReassigned = {
    hello: 'world'
}


// Var

var varNeverReassigned = "hello" + " world"
var varReassigned = 'hello'
varReassigned = 'world'
var varWithObject = {
    hello: 'world'
}
varWithObject.hello = 'Olá'
var varWithObjectReassigned = {
    hello: 'world'
}
varWithObjectReassigned.hello = 'Olá'
varWithObjectReassigned = {
    hello: 'world'
}
