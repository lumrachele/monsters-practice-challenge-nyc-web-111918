document.addEventListener('DOMContentLoaded', ()=>{

  ////////////////////////////////////////////////////////////////////
// constants and variables for nodes
let allMonsterData = []
const monsterContainer = document.body.querySelector("#monster-container")
const createMonsterContainer = document.body.querySelector("#create-monster")
const createMonsterForm = document.body.querySelector("#create-monster-form")
const monsterNameInput = document.body.querySelector("#monster-name-input")
const monsterAgeInput = document.body.querySelector("#monster-age-input")
const monsterDescriptionInput = document.body.querySelector("#monster-description-input")
const monsterSubmit = document.body.querySelector("#monster-submit")
const forwardButton = document.body.querySelector("#forward")
const backButton = document.body.querySelector("#back")
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// fetch get request
function fetchMonsters(){
  fetch('http://localhost:3000/monsters')
    .then(function(response) {
      // console.log(response);
      return response.json();
    })
    .then(function(myJson) {
      allMonsterData = myJson
      // monsterContainer.innerHTML = allMonsterData
      // debugger
      monsterContainer.innerHTML = renderMonsters(allMonsterData, 0)
    })  // end of fetch method GET
} //end of fetchMonsters function
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// function to render monster details on page
const renderMonsters = (monsterArray, num1)=>{
  return monsterArray.slice(num1,num1+49).map((monster)=>{
    return `<h2>${monster.name}</h2>
    <h4>Age: ${monster.age}</h4>
    <p>Bio: ${monster.description}</p>`
  }).join("")
}// end of function to render monster details on page



// function to render form on page
const renderCreateMonsterForm = ()=>{
  return`
  <form id="create-monster-form" action="http://localhost:3000/monsters/" method="post">
  <label for="name">Name:</label>
<input type="text" id="monster-name-input" name="name" required
       minlength="2" maxlength="8" size="10" value="">
  <label for="age">Age:</label>
<input type="number" id="monster-age-input" name="age" required value="" >
  <label for="description">Description:</label>
<input type="text-area" id="monster-description-input" name="description" required
       minlength="4" value="">
  <input type="submit" id="monster-submit" value="Create Monster">
  </form>
  `
}// end of render create form function


// assigning form to createMonsterContainer
createMonsterContainer.innerHTML = renderCreateMonsterForm()
// end of form display


////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// event listeners

// event listener to create new monster
// don't forget - must update in 3 places - db, local variables, and the dom

createMonsterContainer.addEventListener("submit", (e)=>{
  // debugger
  e.preventDefault()
  // if (e.target === createMonsterForm){
    // e.target.preventDefault()

// if e.target is a FORM, then the form has children - the inputs
// we can get these relevant inputs by querySelecting on the event target
    const newMonsterName = e.target.querySelector("#monster-name-input").value
    const newMonsterAge = e.target.querySelector("#monster-age-input").value
    const newMonsterDescription = e.target.querySelector("#monster-description-input").value
    // console.log(newMonsterName)

// pessimistic rendering in the database
  fetch('http://localhost:3000/monsters', {
    method:"POST",
    headers: {
    "Content-Type": "application/json",//type of data being sent
    "Accept": "application/json" //type of data I want back
    },
    body: JSON.stringify({
      name: newMonsterName,
      age: newMonsterAge,
      description: newMonsterDescription
    }) //end of body
  })// end of fetch
    .then(response => response.json())
    .then(parsedJSON => {
      // console.log(parsedJSON);
      allMonsterData.push(parsedJSON); //update global data
      // this part ensures that the new monster is displayed on the dom
      monsterContainer.innerHTML +=`
      <h2>${newMonsterName}</h2>
      <h4>Age: ${newMonsterAge}</h4>
      <p>Bio: ${newMonsterDescription}</p>
      `
    })
    // we want to grab these inputs and render them on the page
    // in addition to the ones we already have. the thing is, we
    // have to make sure that it is added to the database, and then
    // we can do another fetch request
  })// end of event listener for submit



// event listener for forward and back buttons at bottom of page
let num2 = 0
forwardButton.addEventListener("click", (e)=>{
  console.log(e.target);
  // debugger
  // the issue is that I would have to hard code the splice
  // every time the user clicks the forward or back button.
  // this is not dynamic - how can we make this dynamic?
  monsterContainer.innerHTML = renderMonsters(allMonsterData, (num2+=50))
})

backButton.addEventListener("click", (e)=>{
    monsterContainer.innerHTML = renderMonsters(allMonsterData, (num2-=50))
})

fetchMonsters()

})// end of DOMContentLoaded
