const userIdHerf = document.location.href
const userId = userIdHerf.split('=')[1]
const userName = document.getElementById('name')

userName.innerText = userId
