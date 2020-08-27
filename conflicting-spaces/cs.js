const spaces = [document.querySelector('#first'), document.querySelector('#second'), document.querySelector('#third')]

document.addEventListener('keydown', (event) => {
  console.log(event.keyCode)
  switch(event.keyCode) {
    case 49:
      select(0)
      break
    case 50:
      select(1)
      break
    case 51:
      select(2)
      break
  }
})

function select (index) {
  spaces.forEach((element, i) => {
    if (i === index) {
      element.style.zIndex = '5'
    } else {
      element.style.zIndex = '1'
    }
  })
}

