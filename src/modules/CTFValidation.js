
	class Validation {
	
		constructor(options) {
			this._fields        = options.fields;
			this._formElement   = document.querySelector(options.formSelector);

			this._formMethod	= options.method;
			this._formURL		= options.url;
			this._formAsync		= options.async;

			this._checkRules = {
				phone: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
				mail: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
			}

			this._defaultStyles = {
				failForm: {
					transition: '.3s',
					webkitBoxShadow: '0px 0px 9px 0px rgba(255, 0, 0, 0.75)',
                    mozBoxShadow: '0px 0px 9px 0px rgba(255, 0, 0, 0.75)',
                    boxShadow: '0px 0px 9px 0px rgba(255, 0, 0, 0.75)',
				},
				successForm : {
					transition: '.3s',
					webkitBoxShadow: '0px 0px 9px 0px rgba(46, 204, 113, 0.75)',
                    mozBoxShadow: '0px 0px 9px 0px rgba(46, 204, 113, 0.75)',
                    boxShadow: '0px 0px 9px 0px rgba(46, 204, 113, 0.75)',
				}
			}

			//Инициализация статуса поля
			this._fields.forEach(function(item) {
				item.status = item.required ? false : true; 
			})
		}

		init() {

			//Инициализация событий проверки полей
			if(Object.prototype.toString.call(this._fields) === '[object Array]') {
				
				this._fields.map((item) => {

					let fieldElement = document.querySelector(item.fieldSelector);

					this._connectEventListeners(fieldElement, 'blur change input ready load',(e) => {
						//target - DOM элемент, поле
						//item.text - Условие, по которому нужно проверять строку или регулярное выражение
						//item.required - Обязательное ли поле
						
						const target = e.target;

						if(this.fieldTest(target, item.test, item.required, item.type) === false) {
							let failCallback     = item.onFail ? item.onFail(target, item.test) : this.onFailField(item, target, item.move, item.type);
						} else {
							let succesCallback   = item.onSuccess ? item.onSuccess(target, item.test, item.move, item.type) : this.onSuccessField(item, target, item.move, item.type);
						}
						
					})

				})

			} else {
				console.log('You must pass an array to "fields"');
			}

			//Инициализация события отправки формы
			this._formElement.addEventListener('submit', (e) => {
				e.preventDefault();

				let readySubmit = true;
				let paramsObj = {};

				this._fields.forEach(function(item) {
					if(item.status == false) {
						readySubmit = false;
					}

					//Получаем данные из формы
					let fieldDOM       = document.querySelector(item.fieldSelector);
					let atrName        = fieldDOM.getAttribute('name');
					let atrValue       = fieldDOM.value;
					paramsObj[atrName] = atrValue;
				})


				if(readySubmit) {
					this.onSendForm(this._formMethod, this._formURL, this._formAsync, paramsObj);
				} else {
					this.onFailSend();
					readySubmit = true;
					return false;
				}


			})

		}


		//Метод для массовой привязки слушателей события
		_connectEventListeners(target, events, callback) {
			let eventsList = events.split(' ');

			for(let i = 0; i < eventsList.length; i++) {
				target.addEventListener(eventsList[i], callback); 
			}
		}

		//Метод для добавления стилей элементам
		_addCSS(target, styles) {
			for(let key in styles) {
				target.style[key] = styles[key];
			}
		}

		_innerText(domElement, text) {

		}

		//Метод для создания строки запроса из объекта с параметрами
		_createQuery(paramsObj, method) {

			if(method === 'GET') {
				let query = '';

				for(let key in paramsObj) {
					query += `${key}=${paramsObj[key]}&`;
				}

				return query.substring(0, query.length - 1);
			} else {
				let data = new FormData();
				for(let key in paramsObj) {
					data.append(key, paramsObj[key])
					console.log(data.get(key));
				}
				
				
				return data;
			}
			
		}

		onSendForm(method = 'GET', url, async, paramsObj) {

			const request = new XMLHttpRequest();
			console.log(url);

			if(method === 'GET') {
				url += '?' + this._createQuery(paramsObj, method);
				request.open(method, url, async);
				request.send();
			}

			if(method === 'POST') {
				request.open(method, url, async);

				request.send(this._createQuery(paramsObj, method));
			}

			request.addEventListener('readystatechange', () => {
				if(request.readyState == 4 && request.status == '200') {
					this.onSuccessSend();
				} else if(request.status == '404') {
					this.onFailSend();
				}
			})
			
		}

		onSuccessField(item, target, move = 'default', type='text') {
			item.status = true;



			switch(type) {
				case 'text':
					switch (move) {
						case 'textWarning':
										
 						break;
						default:
							this._addCSS(target, this._defaultStyles.successForm);
							break;
					}
				break;
				case 'checkbox':
					console.log(type);
				break;
			}

			

		}

		onFailField(item, target, move = 'default', type='text') {
			item.status = false;

			switch(type) {
				case 'text':
					switch (move) {
						case 'textWarning':
										
 						break;
						default:
							this._addCSS(target, this._defaultStyles.failForm);
							break;
					}
				break;
				case 'checkbox':
					console.log(type);
				break;
			}

		}

		onSuccessSend() {
			alert(1)
		}

		onFailSend () {
			alert(2)
		}
	
		fieldTest(field, test = 'default', required = false, type='text') {
			switch (type) {
				//Проверки поля, если оно текстовое
				case 'text':
					if(required && field.value == '') {
						return false;
					}
		
					if(!required && field.value == '') {
						return true;
					}
		
					if(typeof test != 'string') {
						return test.test(field.value);
					} else {
						switch (test) {
							case 'phone':
								return this._checkRules.phone.test(field.value);
							break;
							case 'mail':
								return this._checkRules.mail.test(field.value);
							break;
							case 'message':
								return field.value.length < 5 ? false : true;
							break;
							default:
								return true;
							break;
						}
					}
				break;
				case 'checkbox':
					if(required && field.checked) {
						return true;
					} else if (required && !field.checked) {
						return false;
					} else {
						return true;
					}

				break;
			}


			
		}	
	
	}



new Validation({
    formSelector: 'form',
    method: 'POST',
    url: '../send_t.php',
    async: true,
    fields: [
      {
        fieldSelector: '.name',
        test: 'name',
        required: true, 
      },
      {
        fieldSelector: '.phone',
        test: 'phone',
        required: true,
      },
      {
        fieldSelector: '.mail',
        test: 'mail',
        required: true,
      },
      {
        fieldSelector: '.ms',
        test: 'message'
      },
      {
        fieldSelector: '.file'
      },
    ]
  }).init();