function enterTry() {
	let email = document.getElementById('ent_email').value
	let password = document.getElementById('ent_password').value
	console.log(email, password)
	if (email.length == 0 || password.length == 0) {
		document.getElementById('loginMessage').innerHTML = "Заполните все поля"
	} else {
		data = {
			email: email,
			password: password
		}
		fetch("http://localhost:5000/setcookie", {
		    method: "POST",
		  	body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}})
		.then(function (response) {
			return response.json()})
		.then(function (ans) {
			console.log(ans);
		    if (ans) {
		    	location.href = '/auth/userwindow.html';
		    } else {
		    	document.getElementById('loginMessage').innerHTML = "Аккаунт не найден"
		    }
		})
	}
}


function regTry() {
	let email = document.getElementById('reg_email').value;
	let password1 = document.getElementById('reg_password1').value;
	let password2 = document.getElementById('reg_password2').value;

	document.getElementById('reg_password1').style.borderColor = "grey";
	document.getElementById('reg_password2').style.borderColor = "grey";
	document.getElementById('reg_email').style.borderColor = "grey";
	document.getElementById('warning2').style.color = "white";
	if (email == '' || password1 == '' || password2 == '') {
		document.getElementById('warning2').style.color = "red";
		document.getElementById('warning2').innerHTML = "Пожалуйста, заполните все поля";
		if (email == '') {
			document.getElementById('reg_email').style.borderColor = "red";
		}
		if (password1 == '') {
			document.getElementById('reg_password1').style.borderColor = "red";
		}
		if (password2 == '') {
			document.getElementById('reg_password2').style.borderColor = "red";
		}
	} else if (!email.endsWith('@edu.hse.ru')) {
		document.getElementById('warning2').style.color = "red";
		document.getElementById('warning2').innerHTML = "Адрес должен кончаться на @edu.hse.ru";
	} else if (password2 != password1) {
		document.getElementById('reg_password1').style.borderColor = "red";
		document.getElementById('reg_password2').style.borderColor = "red";
		document.getElementById('warning2').style.color = "red";
		document.getElementById('warning2').innerHTML = "Пароли не совпадают";
	} else {
		
		data = {
			email: document.getElementById('reg_email').value,
			password: document.getElementById('reg_password1').value
		};
		//console.log(data);

		fetch("http://localhost:5000/sendcode", {
		    method: "POST",
		  	body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}})
		.then(function (response) {
			return response.json()})
		.then(function (ans) {
		    if (ans == true) {
		    	location.href = '/code.html?' + document.getElementById('reg_email').value;
		    } else {
		    	document.getElementById('warning2').style.color = "red";
		    	document.getElementById('warning2').innerHTML = "Е-мейл уже зарегистрирован";
		    }
		})

	}
}

function enteredEmail() {
	let email = window.location.search.slice(1);
	document.getElementById("email").innerHTML = email;
}

function goBack() {
	location.href = '/main.html'
}

function codeCheck() {
	let codeU = document.getElementById('codeField').value;
	let emailU = window.location.search.slice(1);
	let data = {
			email: emailU,
			code: codeU
		};
	if (codeU.length != 6 || isNaN(codeU)) {
		document.getElementById('codeField').style.borderColor = "red";
		document.getElementById('message').innerHTML = "Должно быть 6 цифр";
		document.getElementById('message').style.color = "red";
	} else {
		fetch("http://localhost:5000/checkcode", {
			    method: "POST",
			  	body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}})
			.then(function (response) {
				return response.json()})
			.then(function (ans) {
			    if (ans == true) {
			    	alert("Сейчас вас перебросит на главную страницу. Пожалуйста, авторизируйтесь.")
			    	goBack();
			    } else {
			    	document.getElementById('codeField').style.borderColor = "red";
					document.getElementById('message').innerHTML = "Неверный код";
					document.getElementById('message').style.color = "red";
			    }
			})
	}
}