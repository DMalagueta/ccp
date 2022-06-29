(function () {

	/* globals $, $bl, bond, CONTENT, $$ */



	var API_URL = "https://us-central1-bndlyr.cloudfunctions.net/ccp";
	//API_URL = " https://ccpsite.loca.lt/ccp";

	window.goBack = function () {
		window.history.back();
	};

	window.scrollToTop = function () {
		console.log("go to top");
		window.scrollTo(0, 0);
	};

	function shuffle(a) {
		for (var i = a.length;i;i--) {
			var j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
		}
		return a;
	}

	window.shuffleGrid = function (id) {
		var repeaterId = id;
		if (!window.shuffeling && CONTENT.cursor(repeaterId).size > 0) {
			window.shuffeling = true;
			CONTENT.cursor(repeaterId).set("items", window.Immutable.fromJS(shuffle(CONTENT.cursor([repeaterId, "items"]).toJS())));
			CONTENT.cursor(repeaterId).set("state", 1);
			CONTENT.cursor(repeaterId).set("state", 2);
			setTimeout(function () {
				window.shuffeling = false;
			}, 800);
		}

	};

	window.onload = function () {
		window.shuffleGrid("chTx3K9RoB");
		window.shuffleGrid("cd6blN3nEtiw");
	};



	var filterItems = $$(".ciNEsDIOnsU .bl-filter");
	var filterItems2 = $$(".cPIEDpd6lvQ .bl-filter");


	if (filterItems.length > 0) {
		filterOnHover(filterItems);
		filterOnHover(filterItems2);
	}

	function filterOnHover(item) {
		item.forEach(function (el) {
			el.addEventListener("mouseover", function (event) {
				event.target.click();
			}, false);
		});
	}

	function parseQuery(queryString) {
		var query = {};
		if (queryString.length > 0) {
			var pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
			for (var i = 0;i < pairs.length;i++) {
				var pair = pairs[i].split("=");
				query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
			}
		}
		return query;
	}

	var handleResponse = function (status, res, done) {
		if (status >= 400) {
			user.logout("profile-login/");
		} else {
			done(status, JSON.parse(res));
		}
	};


	var user = {};
	var ctx;

	if (bond.content !== undefined) {
		ctx = bond.content;
	} else {
		ctx = CONTENT;
	}

	window.updateRepeater = function (repeaterId) {
		ctx.cursor([repeaterId]).set("state", 1);
		setTimeout(function () {
			ctx.cursor([repeaterId]).set("state", 2);
		}, 400);
	};

	/** USER **/

	user.defaultFilter = (function () {
		var executed = false;
		return function () {
			if (!executed) {
				executed = true;
				if ($bl("defaultFilter") !== null) {
					console.log("defaultFilter");
					$bl("defaultFilter").click();
				}
			}
		};
	})();

	user.checkStatus = function () {

		var token = window.localStorage.getItem("accessToken");

		bond.setState({
			"UserLogged": token !== null && token !== "" && token !== undefined,
		});

	};

	user.request = function (opts, done) {

		try {

			var xhr = new XMLHttpRequest();
			xhr.open(opts.method, opts.url);
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

			if (opts.auth) {
				var token = localStorage.accessToken;
				if (token) {
					xhr.setRequestHeader("x-access-token", token);
				} else {
					user.logout("profile-login/");
				}
			}

			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) return;
				if (xhr.responseText !== "") {
					handleResponse(xhr.status, xhr.responseText, done);
				}
			};

			if (opts.method === "POST") {
				xhr.send(JSON.stringify(opts.data));
			} else {
				xhr.send();
			}

		} catch (e) {

			user.logout("profile-login/");
			//console.log(e);

		}
	};

	var onChangeHandlerFiles = function (input, preview) {
		var file = input.files[0];
		if (window.FileReader && file !== undefined && file !== null) {
			var reader = new FileReader();
			var allowedSize = 5;
			if (file.size > (1024000 * allowedSize)) {
				alert("O tamanho do ficheiro é maior que o permitido: " + allowedSize + "Mb");
			} else {
				reader.readAsDataURL(file);
				reader.onloadend = function () {
					preview.src = reader.result;
				};
			}
		}
	};

	user.loadFiles = function (files) {

		for (var index = 0;index < files.length;index++) {
			var element = files[index];
			var input = $("input[data-bl-name='" + element + "']");
			var preview = $("img[data-bl-name='" + element + "']");
			//console.log(input, preview);
			input.setAttribute("accept", ".jpeg,.jpg,.png");
			input.value = "";
			input.onchange = onChangeHandlerFiles.bind(null, input, preview);
		}
	};


	user.pickFile = function (e, index, contentItem, el, opts) {
		var input = $("input[name='" + opts.input + "']");
		//console.log(opts, input);
		if (input !== null) {
			input.click();
		}
	};


	user.saveUserForm = function (form) {

		bond.setState({
			"UserSaving": true,
		});

		user.request({
			url: API_URL + "/save",
			method: "POST",
			data: form,
			auth: true,
		}, function (status, res) {

			var newState = {
				"UserSaving": false,
			};

			if (res.error) {
				newState.UserError = true;
			} else {
				newState.UserDone = true;
			}

			setTimeout(function () {
				bond.setState({ UserDone: false });
			}, 2000);

			bond.setState(newState);


		});

	};

	user.formatDescription = function (item) {
		var str = item.text_texto_apresentacao || { all: "" };
		str = str.all.replace(/(?:\r\n|\r|\n)/g, "<br>");
		return str;
	};

	user.formatWorkDescription = function (item) {
		var str = item.text_work_description || { all: "" };
		str = str.all.replace(/(?:\r\n|\r|\n)/g, "<br>");
		return str;
	};

	user.refreshDirectory = function () {
		$bl("sort").click();
	};

	user.getLink = function (e, index, contentItem, el) {
		el.setAttribute("href", "/socio/#id=" + contentItem.id);
	};

	user.saveWork = function (e, form) {

		bond.setState({
			"UserSaving": true,
		});

		var cover = $("input[name='image_work_cover']");
		var thumbnail = $("input[name='image_work_thumbnail']");

		user.uploadPic(cover, function (image_work_cover_url) {

			if (image_work_cover_url !== "") {
				form.image_work_cover = image_work_cover_url;
			} else {
				delete form.image_work_cover;
			}

			user.uploadPic(thumbnail, function (image_work_thumbnail_url) {

				if (image_work_thumbnail_url !== "") {
					form.image_work_thumbnail = image_work_thumbnail_url;
				} else {
					delete form.image_work_thumbnail;
				}

				form.boolean_work_active = bond.getState("UserWorkActive") || false;

				user.saveUserForm(form, "work");
			});
		});
	};

	user.saveLinks = function (e, form) {
		user.saveUserForm(form, "links");
	};

	user.saveAccount = function (e, form) {
		user.saveUserForm(form, "account");
	};

	user.saveInfo = function (e, form) {
		bond.setState({
			"UserSaving": true,
		});
		var image = $("input[name='userImage']");
		user.uploadPic(image, function (image_image_url) {
			if (image_image_url !== "") {
				form.image_image = image_image_url;
			}
			user.saveUserForm(form, "info");
		});
	};

	user.toggleWork = function () {

		let UserWorkActive = bond.getState("UserWorkActive") || false;

		bond.setState({
			UserWorkActive: !UserWorkActive
		});

	};

	user.uploadPic = function (input, _cb) {

		//console.log("uploadPic", file);

		var file = input.files || null;

		if (file !== null && file[0] !== undefined) {

			file = file[0];
			var ext = file.name.split(".");

			var fileData = {
				name: file.name,
				size: file.size,
				type: file.type,
				extension: ext[ext.length - 1]
			};

			user.request({
				url: API_URL + "/pic",
				method: "POST",
				data: fileData,
				auth: true,
			}, function (status, res) {

				if (res.url !== undefined) {
					var xhrs3 = new XMLHttpRequest();
					xhrs3.open("PUT", res.url);
					xhrs3.setRequestHeader("Content-Type", file.type);
					xhrs3.onreadystatechange = function () {
						if (xhrs3.readyState !== 4) return;
						var picurl = "https://assets.bondlayer.com/" + res.Key;
						input.value = "";
						_cb(picurl);
					};
					xhrs3.send(file);
				} else {
					_cb("");
				}
			});

		} else {
			_cb("");
		}
	};

	user.reset = function (e, form) {

		var qs = parseQuery(window.location.search);

		if (qs.reset) {
			form.resetHash = qs.reset;
		}

		bond.setState({
			"RegisterError": "",
			"RegisterLoading": true
		});

		user.request({
			url: API_URL + "/reset",
			method: "POST",
			data: form,
			auth: false,
		}, function (status, res) {

			var error = res.error || "";

			var newState = {
				"RegisterError": error,
				"RegisterLoading": true,
				"RegisterDone": false
			};

			if (error === "") {
				newState.RegisterLoading = false;
				newState.RegisterDone = true;
				setTimeout(function () {
					window.location.href = "/profile-login";
				}, 800);
			}

			bond.setState(newState);


		});

	};

	user.recover = function (e, form) {

		if (form.password) {
			form.resetHash = user.resetCode;
		}

		bond.setState({
			"RegisterError": "",
			"RegisterLoading": true
		});

		user.request({
			url: API_URL + "/recover",
			method: "POST",
			data: form,
			auth: false,
		}, function (status, res) {

			var error = res.error || "";

			var newState = {
				"RegisterError": error,
				"RegisterLoading": true,
				"RegisterDone": false
			};

			if (error === "") {
				newState.RegisterLoading = false;
				newState.RegisterDone = true;
			}

			bond.setState(newState);


		});

	};

	user.register = function (e, form) {

		bond.setState({
			"RegisterError": "",
			"RegisterLoading": true
		});

		user.request({
			url: API_URL + "/register",
			method: "POST",
			data: form,
			auth: false,
		}, function (status, res) {

			var error = res.error || "";

			var newState = {
				"RegisterError": error,
				"RegisterLoading": false,
				"RegisterDone": false
			};

			if (error === "") {
				newState.RegisterLoading = true;
				newState.RegisterDone = true;
				setTimeout(function () {
					window.location.href = "/profile-login";
				}, 800);
			}

			bond.setState(newState);


		});

	};


	user.billing = function () {

		var loading = bond.getState("UserBilling");

		if (loading === false) {

			bond.setState({ UserBilling: true });

			user.request({
				url: API_URL + "/billing",
				method: "GET",
				auth: true,
			}, function (status, res) {

				bond.setState({ UserBilling: false });

				if (res.session) {
					window.location.href = res.session.url;
				}
			});
		}


	};

	user.profile = function () {

		var forms = ["csH3Oglv6O9", "cBCVXN14jQT", "c5uCwy2G8nk"];

		user.loadFiles(["userImage", "image_work_thumbnail", "image_work_cover"]);

		user.request({
			url: API_URL + "/profile",
			method: "GET",
			auth: true,
		}, function (status, res) {

			var user = res.user;
			var UserPlan = user.text_plan || { all: "" };
			UserPlan = UserPlan.all || "";

			var UserApproved = user.boolean_approved || false;

			if (UserPlan === "") {
				UserPlan = "gratuito";
			}

			Object.keys(user).map(function (k) {
				var input = $(".bl-input[name='" + k + "']");
				if (input !== null && user[k] !== null && k !== "id") {
					if (k.indexOf("image") === -1) {
						input.value = user[k].all;
					}
					CONTENT.cursor(["forms", forms[0], "values"]).set(k, user[k].all);
					CONTENT.cursor(["forms", forms[1], "values"]).set(k, user[k].all);
					CONTENT.cursor(["forms", forms[2], "values"]).set(k, user[k].all);
				}
			});

			var userImage = user.image_image || { all: "" };
			userImage = userImage.all || "";

			var image_work_cover = user.image_work_cover || { all: "" };
			image_work_cover = image_work_cover.all || "";

			var image_work_thumbnail = user.image_work_thumbnail || { all: "" };
			image_work_thumbnail = image_work_thumbnail.all || "";

			var text_passworks_link = user.text_passworks_link || { all: "" };
			text_passworks_link = text_passworks_link.all;

			var UserNumber = user.text_numero_socio || { all: "" };
			UserNumber = UserNumber.all;

			var boolean_work_active = user.boolean_work_active || false;


			if (userImage !== "") {
				$bl("userImage").src = userImage;
			}

			if (image_work_thumbnail !== "") {
				$("img[data-bl-name='image_work_thumbnail']").src = image_work_thumbnail;
			}

			if (image_work_cover !== "") {
				$("img[data-bl-name='image_work_cover']").src = image_work_cover;
			}

			if (image_work_cover !== "") {
				$("img[data-bl-name='image_work_cover']").src = image_work_cover;
			}


			var UserStatus = user.boolean_approved ? "ativo" : "inativo";

			bond.setState({
				UserWorkActive: boolean_work_active,
				UserNumber: UserNumber,
				UserApproved: UserApproved,
				UserPlan: UserPlan,
				UserStatus: UserStatus
			});


			setTimeout(function () {
				if (text_passworks_link !== "" && $bl("PassworksLink") !== null) {
					$bl("PassworksLink").classList.add("extra1");
					$bl("PassworksLink").setAttribute("href", text_passworks_link);
				}
			}, 500);

		});

	};

	user.login = function (e, form) {

		bond.setState({
			"LoginError": false,
			"LoginLoading": true
		});

		user.request({
			url: API_URL + "/login",
			method: "POST",
			data: form,
			auth: false,
		}, function (status, res) {


			if (res.token !== undefined) {

				var user = JSON.stringify(res.user);

				window.localStorage.setItem("accessToken", res.token);

				bond.setState({
					"LoginLoading": false,
					"LoginError": false,
					"UserLogged": true,
					"UserProfile": user
				});

				setTimeout(function () {
					window.location.href = "/profile";
				}, 800);

			} else {

				bond.setState({
					"LoginLoading": false,
					"LoginError": true,
					"UserLogged": false,
					"UserProfile": ""
				});
			}


		});

	};

	user.logout = function (link) {

		var href = "";

		if (typeof link === "string") {
			href = link;
		}

		bond.setState({
			"LoginLoading": false,
			"LoginError": false,
			"UserLogged": false,
			"UserProfile": ""
		});

		delete window.localStorage.accessToken;

		setTimeout(function () {
			window.location.href = "/" + href;
		}, 10);

	};

	var firstBy = (function () {

		function identity(v) { return v; }

		function ignoreCase(v) { return typeof (v) === "string" ? v.toLowerCase() : v; }

		function makeCompareFunction(f, opt) {
			opt = typeof (opt) === "object" ? opt : { direction: opt };

			if (typeof (f) != "function") {
				var prop = f;
				// make unary function
				f = function (v1) { return !!v1[prop] ? v1[prop] : ""; }
			}
			if (f.length === 1) {
				// f is a unary function mapping a single item to its sort score
				var uf = f;
				var preprocess = opt.ignoreCase ? ignoreCase : identity;
				var cmp = opt.cmp || function (v1, v2) { return v1 < v2 ? -1 : v1 > v2 ? 1 : 0; }
				f = function (v1, v2) { return cmp(preprocess(uf(v1)), preprocess(uf(v2))); }
			}
			var descTokens = { "-1": "", desc: "" };
			if (opt.direction in descTokens) return function (v1, v2) { return -f(v1, v2) };
			return f;
		}

		/* adds a secondary compare function to the target function (`this` context)
		   which is applied in case the first one returns 0 (equal)
		   returns a new compare function, which has a `thenBy` method as well */
		function tb(func, opt) {
			/* should get value false for the first call. This can be done by calling the
			exported function, or the firstBy property on it (for es6 module compatibility)
			*/
			var x = (typeof (this) == "function" && !this.firstBy) ? this : false;
			var y = makeCompareFunction(func, opt);
			var f = x ? function (a, b) {
				return x(a, b) || y(a, b);
			}
				: y;
			f.thenBy = tb;
			return f;
		}
		tb.firstBy = tb;
		return tb;
	})();

	window.allowSort = true;

	window.parseAwardType = function (obj) {

		var typesKeys = Object.keys(obj);
		var types = typesKeys.join(",").toLowerCase();
		types = types.replaceAll("_", "").replaceAll("type", "");
		types = types.replaceAll("shortlist", "zshortlist");
		types = types.replaceAll("bronze", "xbronze");
		if (typesKeys.length > 1) {
			types = types.split(",");
			types = types.sort(function (a, b) {
				return a.localeCompare(b);
			});
			types = types.join(",").toLowerCase();
		}
		//types = types.substring(0, types.indexOf(","));
		//console.log(obj, types);
		return types;
	};

	window.sortAwards = function () {


		if (window.allowSort) {

			var rpId = "czaJu1etUWRg9xRE";

			window.allowSort = false;

			var rp = CONTENT.cursor(rpId).toJS();
			var emptyItem = { _title: { all: "" } };

			rp.items = rp.items.sort(function (a, b) {

				var typA = window.parseAwardType(a.multiRef_types);
				var typB = window.parseAwardType(b.multiRef_types);

				var aCat = rp.related[a.ref_category] || emptyItem;
				var bCat = rp.related[b.ref_category] || emptyItem;
				var aTitle = aCat._title.all;
				var bTitle = bCat._title.all;

				//console.log("cat", aTitle, bTitle);

				return aTitle.localeCompare(bTitle) || typA.localeCompare(typB);
			});

			//console.log(rp.items);
			CONTENT.cursor(rpId).set("items", window.Immutable.fromJS(rp.items));
			window.updateRepeater(rpId);

			setTimeout(function () {
				window.allowSort = true;
			}, 1000);

		}

	};

	var sliderList = document.querySelector('.cBG3tp2Rp0R .bl-slider-list');

	if (sliderList !== null) {
		for (var i = sliderList.children.length;i >= 0;i--) {
			sliderList.appendChild(sliderList.children[Math.random() * i | 0]);
		}
	}

	window.clearSearch = function () {
		$bl("Search input clear").value = ""
		$bl("Search submit clear").click();
	}

	window.user = user;

})();
