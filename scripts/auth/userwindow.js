function orderSpr() {
	let type = document.getElementById('typeSelect').value
	let quantity = document.getElementById('quantity').value
	let description = document.getElementById('description').value
	description = description.length == 0 ? 'Нет' : description
	if (type != 'Выберите вид справки' && quantity != 'Количество' && !(type == 'Другое:' && description == 'Нет')) {
		let data = {
			date: new Date(),
			type: type,
			description: description,
			facultet: document.getElementById('facultet').placeholder,
			quantity: quantity,
			solved: false
		}
		console.log(data)
		fetch("http://localhost:5000/auth/makeorder", {
			    method: "POST",
			  	body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}})
			.then(() => {
				historyRefresh()
			})
	} else {
		alert('Заполните все поля')
	}
}

function letWrite(select) {
	if (select.value == 'Другое:') {
		document.getElementById('description').removeAttribute("disabled");
	} else {
		document.getElementById('description').setAttribute("disabled", "true");
		document.getElementById('description').value = ""
	}
}

function historyRefresh() {
	let answer =  "Тут пока пусто"
	let history = ""
	fetch("http://localhost:5000/auth/getHistory", {
		    method: "POST",
			})
		.then(function (response) {
			return response.json()})
		.then(function (ans) {
			//console.log(ans[0]);
			for (let i = 0; i < ans.length; i++) {
				let date = ans[i].date
				let block = `
				<div class="cell">
					<div>
						Дата: ${date.slice(0, 10) + " " + date.slice(11, 19)}
					</div>
					<div>
						Количество: ${ans[i].quantity}
					</div>
					<div>
						Тип: ${ans[i].type}
					</div>
					<div>
						Пояснение: ${ans[i].description}
					</div>
					<div>
						Состояние: ${ans[i].solved == true ? "Готова" : "Не готова"}
					</div>
				</div>
				`;
				history += block;
			}
			document.getElementById('history').innerHTML = history ? history : answer;
		})
		.catch(err => {
			console.log(err)
		})
}

function onStart() {
	inputFiller();
	historyRefresh();
}

function goBack() {
	location.href = '/main.html'
}

function inputFiller() {
	let fName = document.getElementById('fName')
	let mName = document.getElementById('mName')
	let lName = document.getElementById('lName')
	let facultet = document.getElementById('facultet')
	let group = document.getElementById('group')
	fetch("http://localhost:5000/auth/fillfields", {
		    method: "POST",})
		.then(function (response) {
			return response.json()})
		.then(function (ans) {
			//console.log(ans);
		    if (ans) {
		    	fName.placeholder = ans.fName
		    	fName.style.width = ans.fName.length * 20 + "px";
		    	mName.placeholder = ans.mName
		    	mName.style.width = ans.mName.length * 20 + "px"
		    	lName.placeholder = ans.lName
		    	lName.style.width = ans.lName.length * 20 + "px"
		    	facultet.placeholder = ans.facultet
		    	facultet.style.width = ans.facultet.length * 20 + "px"
		    	group.placeholder = ans.group
		    	group.style.width = ans.group.length * 20 + "px"
		    } else {
		    	alert("Что-то не так")
		    }
		})
}