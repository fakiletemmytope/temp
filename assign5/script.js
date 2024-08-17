//number 1
const even_or_odd = (num) =>{
    value = num%2
    if(value == 1){
        return "the number is an odd number"
    }
    else{
        return "the number is an even number"
    }
}

console.log(even_or_odd(7))
console.log(even_or_odd(8))
console.log(even_or_odd(54))

//number 2
const btn = document.getElementById("list-gen")
btn.addEventListener('click', (e)=>{
    e.preventDefault()
    const ul = document.getElementById("list")
    const li = document.getElementById("list").querySelectorAll("li")
    index = li.length - 1
    const last_li = li[index]
    value = parseInt(last_li.innerText) + 1
    const newLi = document.createElement("li");
    newLi.textContent = value;
    ul.append(newLi)

})

//number 3
const res = document.getElementById("res")
const ans = document.getElementById("ans")
const resbtn = document.getElementById("resbtn")
resbtn.addEventListener('click', (e)=>{
    e.preventDefault()
    if(ans.value == "Biden" || ans.value== "biden"){
        res.style.backgroundColor = "Green"
    }else{
        res.style.backgroundColor = "red"
    }

})

//number 4
const generate_api_response = () =>{
    const randomNumber = Math.floor(Math.random() * 20) + 1;
    fetch(`https://jsonplaceholder.typicode.com/todos/${randomNumber}`)
        .then(response => response.json())
        .then(
                (json) =>{
                    console.log(json)
                    const newDiv = document.createElement("div");
                    const newP1 = document.createElement("p");
                    newP1.textContent = `Title: ${json.title}`
                    const newP2 = document.createElement("p");
                    newP2.textContent = `Status: ${json.completed}`
                    newDiv.append(newP1)
                    newDiv.append(newP2)
                    const res = document.getElementById("api-res").append(newDiv)
                }
        )
        
    

}

generate_api_response()


//number 5
const area_of_circle = (radius) =>{
    return ((22/7) * radius * radius)
}

console.log(area_of_circle(7))
console.log(area_of_circle(42))


