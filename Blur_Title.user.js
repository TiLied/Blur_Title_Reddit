// ==UserScript==
// @name        Blur Title Reddit
// @namespace   https://greasyfork.org/users/102866
// @description Blurring a title which marked as spoiler in reddit, just like in fallout subreddit.
// @include     https://*.reddit.com/*
// @include     http://*.reddit.com/*
// @exclude     https://*.reddit.com/r/fallout/*
// @exclude     http://*.reddit.com/r/fallout/*
// @exclude     https://*.reddit.com/r/*/comments/*
// @exclude     http://*.reddit.com/r/*/comments/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @author      TiLied
// @version     0.5.01
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// ==/UserScript==

// Append some text to the element with id someText using the jQuery library. TEST JQUERY
//$("#hsts_pixel").append(" more text.");


//not empty val
var titles = document.querySelectorAll("a.title"),
	titlesDivO = document.querySelectorAll("div.spoiler");

//const
const stringStartbdi = '<bdi class = "btr_main btr_title btr_trans">',
	stringEndbdi = '</bdi>',
	oneSecond = 1000;

//empty val
var res,
	currentLocation,
	string,
	stringCSS,
	firstB,
	lastB,
	lengthOfIndexes;

//arrays
var titlesDiv = [],
	titlesTitle = [],
	stringArr = [],
	stringOri = [],
	originStrings = [],
	len = [],
	arrBeg = [],
	arrEnd = [];

//prefs
var btr_pTitle,
	btr_pUsers,
	asterisk,
	debug;


//tests
//if (currentLocation === undefined) {
//    currentLocation = window.location;
//}

Main();

  
function Main()
{
	console.log("Blur Title Reddit v" + GM_info.script.version + " Initialized");
	//Place css in <head>
	SetCSS();
	//Check settings or create them
	SetSettings();
	//Menu Monkey Command
	GM_registerMenuCommand("Show Settings Blur Title Reddit", MenuCommand);
	//Track scroll for infinite reddit
	$(document).ready(function ()
	{
		window.onscroll = function (ev)
		{
			if ((window.innerHeight + window.pageYOffset) >= document.getElementById("siteTable").scrollHeight)
			{
				UpdateDivs();
			}
		};

		CheckRES();
	});
	//Start function on bluring titles
	if (titlesDivO.length !== 0) {
		console.log(titlesDivO);
		for (let i = 0; i < titlesDivO.length; i++) {
			titlesDiv[i] = titlesDivO[i];
		}
		console.log(titlesDiv);
		MyFunction();
	}
	//Set UI of settings
	OptionsUI();
}

//set settings
function SetSettings()
{
	//Delete old values
	DeleteValues("old");

	//THIS IS ABOUT DEBUG
	if (HasValue("btr_debug", false))
	{
		debug = GM_getValue("btr_debug");
	}

	//THIS IS ABOUT TITLE
	if (HasValue("btr_GMTitle", false))
	{
		btr_pTitle = GM_getValue("btr_GMTitle");
	}

	//THIS IS ABOUT asterisk
	if (HasValue("btr_asterisk", false))
	{
		asterisk = GM_getValue("btr_asterisk");
	}

	//THIS IS ABOUT USERS
	if (HasValue("btr_pUsers", "none"))
	{
		btr_pUsers = GM_getValue("btr_pUsers");
	}

	//Console log prefs with value
	console.log("*prefs:");
	console.log("*-----*");
	var vals = [];

	//Find out that var in for block is not local... Seriously js?
	for (let i = 0; i < GM_listValues().length; i++)
	{
		vals[i] = GM_listValues()[i];
	}
	for (let i = 0; i < vals.length; i++)
	{
		console.log("*" + vals[i] + ":" + GM_getValue(vals[i]));
	}
	console.log("*-----*");
}

//Check if value exists or not.  optValue = Optional
function HasValue(nameVal, optValue)
{
	var vals = [];
	for (let i = 0; i < GM_listValues().length; i++)
	{
		vals[i] = GM_listValues()[i];
	}

	if (vals.length === 0)
	{
		if (optValue !== undefined)
		{
			GM_setValue(nameVal, optValue);
			return true;
		} else
		{
			return false;
		}
	}

	if (typeof nameVal !== "string")
	{
		return alert("name of value: '" + nameVal + "' are not string");
	}

	for (let i = 0; i < vals.length; i++)
	{
		if (vals[i] === nameVal)
		{
			return true;
		}
	}

	if (optValue !== undefined)
	{
		GM_setValue(nameVal, optValue);
		return true;
	} else
	{
		return false;
	}
}

//Delete Values
function DeleteValues(nameVal)
{
	var vals = [];
	for (let i = 0; i < GM_listValues().length; i++)
	{
		vals[i] = GM_listValues()[i];
	}

	if (vals.length === 0 || typeof nameVal !== "string")
	{
		return;
	}

	switch(nameVal)
	{
		case "all":
			for (let i = 0; i < vals.length; i++)
			{
				GM_deleteValue(vals[i]);
			}
			break;
		case "old":
			for (let i = 0; i < vals.length; i++)
			{
				if (vals[i] === "debug" || vals[i] === "debugA")
				{
					GM_deleteValue(vals[i]);
				}
			}
			break;
		default:
			for (let i = 0; i < vals.length; i++)
			{
				if (vals[i] === nameVal)
				{
					GM_deleteValue(nameVal);
				}
			}
			break;
	}
}

//css
function SetCSS()
{

	$("head").append($("<!--Start of Blur Title Reddit v" + GM_info.script.version + " CSS-->"));

	$("head").append($("<style type=text/css></style>").text("bdi.btr_title:hover \
	{                                         \
		color:inherit!important;          \
		background:transparent!important;     \
		text-decoration:none!important;       \
		text-shadow:0 0.1px 0 #dcddce         \
	}                                         \
			"));

	$("head").append($("<style type=text/css></style>").text(" bdi.btr_title   { \
		color:rgba(255,60,231,0) !important;        \
		text-shadow: 0px 0px 1em black;               \
		padding: 0 2px;                               \
	}                                         \
	"));

	$("head").append($("<style type=text/css></style>").text(" \
	bdi.btr_trans                             \
	{                                         \
		transition: all 0.5s ease;            \
	}                                         \
	"));

	$("head").append($("<style type=text/css></style>").text(" \
	.btr_closeButton                             \
	{                         \
		cursor: pointer; \
		text-align: center; \
		font-size: 11px; \
		float:right;                           \
		margin-top:0px;                     \
		border:1px solid #AAA;               \
		width:16px;                         \
		height:16px;                        \
	}                                         \
	"));

	$("head").append($("<style type=text/css></style>").text(" \
	.btr_closeButton:hover                             \
	{                         \
		border:1px solid #999;               \
		background-color: #ddd;                          \
	}                                         \
	"));

	$("head").append($("<style type=text/css></style>").text(" \
	.title                                    \
	{                                         \
		overflow: visible !important;         \
	}                                         \
	"));

	$("head").append($("<style type=text/css></style>").text("div.btr_opt { \
	position: fixed; bottom: 0; right: 0; border: 0; \
	}"));

	$("head").append($("<!--End of Blur Title Reddit v" + GM_info.script.version + " CSS-->"));
}

//Check  Reddit Enhancement Suite
function CheckRES()
{
	if (debug)
	{
		console.log("CHECK RES/NER:");
		console.group();
	}
		if ($(".neverEndingReddit").length === 0) {
			if (debug)
			{
				console.log($(".neverEndingReddit"));
			}
			if ($(".neverEndingReddit").length === 0) {
				if (debug)
				{
					console.log($(".neverEndingReddit"));
				}
				if ($(".neverEndingReddit").length === 0) {
					if (debug)
					{
						console.log($(".neverEndingReddit"));
					}
						if ($(".neverEndingReddit").length === 0) {
							setTimeout(function () {
								if (debug)
								{
									console.log($(".neverEndingReddit"));
								}
									if ($(".neverEndingReddit").length === 0) {
										setTimeout(function () {
											if (debug)
											{
												console.log($(".neverEndingReddit"));
												console.groupEnd();
											}
											if ($(".neverEndingReddit").length === 0)
											{
												res = false;
												return;
											} else {
												SearchForNER();
												return;
											}
										}, 4500);
									} else {
										SearchForNER();
										return;
									}                              
							}, 2000);
						} else {
							SearchForNER();
							return;
						}
				} else {
					SearchForNER();
					return;
				}
			} else
			{
				SearchForNER();
				return;
			}
			//console.log("Check current RES : " + res[0]);
		} else
		{
			SearchForNER();
			if (debug)
			{
				console.groupEnd();
			}
			return;
		}
	//console.log("Check current RES : " + res[0]);
}

function SearchForNER()
{
	res = true;
	if (debug)
	{
		console.log("Check current RES : " + res);
	}
	$(".neverEndingReddit").on("click", function () {
		//alert("Settings has been changed. Now brackets hiding.");
		TimeOut(oneSecond, function ()
		{
			UpdateDivs();
			CheckRES();
		});
	});
}

//DO NOT ASK ME WHY
function TimeOut(baseNumber, func)
{
	setTimeout(func, baseNumber);
}

//UI FOR SETTINGS
function OptionsUI()
{
	const settingsDiv = $("<div id=btrSettings class=side></div>").html("<div class=spaser><div class=sidecontentbox><span class=btr_closeButton>&times</span> \
  <div class=title><h1>Settings of Blur Title Reddit " + GM_info.script.version + "</h1></div>\
  <ul class=content><li> \
  <form> \
  <br> \
  <p>Bluring option:</p>\
  <input type=radio name=title id=btr_showTitle >Show brackets</input><br> \
  <input type=radio name=title id=btr_hideTitle >Hide brackets</input><br><br> \
	<input type=checkbox name=asterisk id=asterisk >Show what between asterisks like brackets</input><br><br> \
  <input type=checkbox name=debug id=debug >Debug</input><br> \
  </form> <br> \
  <button id=btr_hide>Hide Settings</button></li></ul></div></div> \
  ");



	$("body").append(settingsDiv);

	//SET UI SETTINGS
	$("#debug").prop("checked", debug);

	$("#asterisk").prop("checked", asterisk);

	if (btr_pTitle === true)
	{
		$("#btr_hideTitle").prop("checked", true);
	} else
	{
		$("#btr_showTitle").prop("checked", true);
	}

	$("#btrSettings").hide();

	//CHANGE SETTINGS BY INTERACT WITH UI
	$("#debug").change(function ()
	{
		if (debug === true)
		{
			GM_setValue("btr_debug", false);
			debug = GM_getValue("btr_debug");
		} else
		{
			GM_setValue("btr_debug", true);
			debug = GM_getValue("btr_debug");
		}

		confirm("Settings has been changed.");
		if (debug)
		{
			console.log('debug: ' + GM_getValue("btr_debug") + ' and debug: ' + debug);
		}
	});

	$("#asterisk").change(function ()
	{
		if (asterisk === true)
		{
			GM_setValue("btr_asterisk", false);
			asterisk = GM_getValue("btr_asterisk");
		} else
		{
			GM_setValue("btr_asterisk", true);
			asterisk = GM_getValue("btr_asterisk");
		}

		confirm("Settings has been changed.");
		if (debug)
		{
			console.log('btr_asterisk: ' + GM_getValue("btr_asterisk") + ' and asterisk: ' + asterisk);
		}
	});

	$("#btr_showTitle").change(function () {
		GM_setValue("btr_GMTitle", false);
		btr_pTitle = GM_getValue("btr_GMTitle");
		ReplaceOriginalTitles();
		MyFunction();
		alert("Settings has been changed. Now brackets showing.");
		if (debug)
		{
			console.log('btr_GMTitle: ' + GM_getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
		}
	});

	$("#btr_hideTitle").change(function () {
		GM_setValue("btr_GMTitle", true);
		btr_pTitle = GM_getValue("btr_GMTitle");
		ReplaceOriginalTitles();
		MyFunction();
		alert("Settings has been changed. Now brackets hiding.");
		if (debug)
		{
			console.log('btr_GMTitle: ' + GM_getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
		}
	});

	//TODO
	//$(".side").append("<div class=spacer><div class=sidecontentbox><div class=title><h1>BLUR TITLE REDDIT</h1></div><ul class=content><li><button id=btr_show >Show settings</button></li></ul></div></div>");
	//console.log(currentLocation.pathname);
	//if (currentLocation.pathname === "/r/Steam")
	//{
	//    $(".debuginfo").after("<p><a id=btr_show style={float=right;}>show settings blur title reddit</a></p>");
	//} else {
		//$(".side").append("<div class=spacer><div class=account-activity-box><p><a id=btr_show >show settings blur title reddit</a></p></div></div>");
	//}

	$(".side:first").append("<div class=spacer><div class=account-activity-box style=cursor:pointer;><p><a id=btr_show >show settings blur title reddit</a></p></div></div>");

	$(document).ready(function () {
		$("#btr_hide").click(function () {
			$("#btrSettings").hide(1000);
		});
		$(".btr_closeButton").click(function () {
			$("#btrSettings").hide(1000);
		});
		$("#btr_show").click(function () {
			$("#btrSettings").show(1000);
			$("#btrSettings").addClass("btr_opt");
		});
	});

}

function UpdateDivs()
{
	var oldLength = titlesDivO.length;
	titlesDivO = document.querySelectorAll("div.spoiler");
	if (titlesDivO.length > oldLength)
	{
		console.log(titlesDivO);
		for (let i = 0; i < titlesDivO.length; i++)
		{
			titlesDiv[i] = titlesDivO[i];
		}
		console.log(titlesDiv);
		for (let i = 0; i < titlesDiv.length; i++)
		{
			if (titlesDiv[i].querySelector("div.entry.unvoted"))
			{
				titlesTitle[i] = titlesDiv[i].querySelector("div.entry.unvoted").querySelector("p.title").querySelector("a.title");
				if (i >= oldLength)
				{
					originStrings.push(titlesTitle[i].innerHTML);
					// originStrings[i] = titlesTitle[i].innerHTML;
				}
			} else
			{
				titlesTitle[i] = titlesDiv[i].querySelector("div.entry").querySelector("p.title").querySelector("a.title");
				if (i >= oldLength)
				{
					originStrings.push(titlesTitle[i].innerHTML);
					// originStrings[i] = titlesTitle[i].innerHTML;
				}
			}
		}
		if (debug)
		{
			console.log(originStrings);
		}
		oldLength = titlesDivO.length;
		MyFunction();
	} else
	{
		if (res)
		{
			TimeOut(oneSecond, function ()
			{
				UpdateDivs();
				CheckRES();
			});
		} else
		{
			return;
		}
	}

}

function MyFunction() {
	if (titlesTitle.length === 0) {
		for (let i = 0; i < titlesDiv.length; i++) {
			if (titlesDiv[i].querySelector("div.entry.unvoted")) {
				titlesTitle[i] = titlesDiv[i].querySelector("div.entry.unvoted").querySelector("p.title").querySelector("a.title");
				originStrings[i] = titlesTitle[i].innerHTML;
			} else {
				titlesTitle[i] = titlesDiv[i].querySelector("div.entry").querySelector("p.title").querySelector("a.title");
				originStrings[i] = titlesTitle[i].innerHTML;
			}
		}
	}

	for (let i = 0; i < titlesDiv.length; i++) {
		len[i] = titlesTitle[i].innerHTML.length;
		if (debug)
		{
			console.log(titlesTitle[i].innerHTML, len[i]);
		}
		stringArr[i] = titlesTitle[i].innerHTML;
		if (stringArr[i].toString().search(stringStartbdi))
		{
			stringArr[i] = originStrings[i];
		}
		FindBracPref(len[i], stringArr[i], titlesTitle[i]);
		//console.log("array " + stringArr[i]);
	}

}

function FindBracPref(l, sArr, tTitle)
{
	//console.log(GM_getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
	if (btr_pTitle === true) {
		// console.log(GetAllIndexes(sArr, "[", "("));
		lengthOfIndexes = 0;
		FindBrac(l, sArr, tTitle, lengthOfIndexes);
	} else if (asterisk === true)
	{
		lengthOfIndexes = GetAllIndexes(sArr, "[", "(").length;
		lengthOfIndexes += GetAllIndexes(sArr, "*", "even").length;
		FindBrac(l, sArr, tTitle, lengthOfIndexes);
	} else
	{
		lengthOfIndexes = GetAllIndexes(sArr, "[", "(").length;
		FindBrac(l, sArr, tTitle, lengthOfIndexes);
	}
}

function FindBrac(l, sArr, tTitle, lengthOfIndexes) {
	switch(lengthOfIndexes) {
		case 0:
			ChangeString(l, sArr, tTitle, 0);
			break;
		case 1:
			ChangeString(l, sArr, tTitle, 1);
			break;
		case 2:
			ChangeString(l, sArr, tTitle, 2);
			break;
		case 3:
			ChangeString(l, sArr, tTitle, 3);
			break;
		case 4:
			ChangeString(l, sArr, tTitle, 1); //TODO 4
			break;
		case 5:
			ChangeString(l, sArr, tTitle, 1); //TODO MAYBE 5
			break;
		default:
			ChangeString(l, sArr, tTitle, 0);
			return;
	} 
}

function ChangeString(l, sArr, tTitle, amount) {
	arrBeg = GetAllIndexes(sArr, "[", "(");
	arrEnd = GetAllIndexes(sArr, "]", ")");

	if (asterisk === true)
	{
		arrBeg = arrBeg.concat(GetAllIndexes(sArr, "*", "even"));
		arrEnd = arrEnd.concat(GetAllIndexes(sArr, "*", "odd"));
	}

	if (debug)
	{
		console.log("*str of brackets :", arrBeg);
		console.log("*end of brackets :", arrEnd);
	}

	if (amount === 0) {
		string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
		if (debug)
		{
			console.info(string);
		}
		tTitle.innerHTML = string;
		return;
	}

	if (amount === 1)
	{
		if (debug)
		{
			console.log("*words in brackets :", sArr.substring(arrBeg[0], arrEnd[0] + 1));
		}
		//IF WHOLE TITLE IN BRACKETS
		if (arrBeg[0] <= 2 && arrEnd[0] >= l - 2)
		{
			string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
			if (debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		}

		if (arrBeg[0] <= 2)
		{
			string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, l) + ' ' + stringEndbdi;
			if (debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		} else if (arrEnd[0] >= l - 2) {
			string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
			if (debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		} else
		{
			string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, l) + ' ' + stringEndbdi;
			if (debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		}
	}

	if (amount === 2) {
		let s = '';
		for (let a = 0; a < arrBeg.length; a++) {
			s += sArr.substring(arrBeg[a], arrEnd[a] + 1) + ' ';
		}
		if (debug)
		{
			console.log("*words in brackets :", s);
		}
		//IF WHOLE TITLE IN BRACKETS, NOT WORKING CORRECTLY TODO!
		if ((arrBeg[0] <= 2 && arrEnd[0] >= l - 2) || (arrBeg[1] <= 2 && arrEnd[1] >= l - 2))
		{
			string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
			if (debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		}

		if (arrBeg[0] <= 2) {
			if (arrEnd[0] + 4 > arrBeg[1])
			{
				string = sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			} else if (arrEnd[1] >= l - 2) {
				string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			} else
			{
				string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}
		} else if (arrEnd[1] >= l - 2) {
			if (arrBeg[1] - 4 < arrEnd[0]) {
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			} else if (arrBeg[0] <= 2) {
				string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			} else {
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}
		} else
		{
			if (arrEnd[0] + 3 >= arrBeg[1]) {
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			} else {
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}
		}
	}

	//Three groups of brackets
	//example sentence: "[spoiler0]_text1_[spoiler1]_text2_[spoiler2]"
	if (amount === 3)
	{
		let s = '';
		for (let a = 0; a < arrBeg.length; a++)
		{
			s += sArr.substring(arrBeg[a], arrEnd[a] + 1) + ' ';
		}
		if (debug)
		{
			console.log("*words in brackets :", s);
		}

		//IF WHOLE TITLE IN BRACKETS, NOT WORKING CORRECTLY TODO!
		if ((arrBeg[0] <= 2 && arrEnd[0] >= l - 2) || (arrBeg[1] <= 2 && arrEnd[1] >= l - 2) || (arrBeg[2] <= 2 && arrEnd[2] >= l - 2))
		{
			string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
			if (debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		}

		//case one:"[spoiler0]..."
		if (arrBeg[0] <= 2)
		{
			//case one:one:"[spoiler0][spoiler1]..."
			if (arrEnd[0] + 4 > arrBeg[1])
			{
				//case one:one:one:"[spoiler0][spoiler1][spoiler2]_text"
				if (arrEnd[1] + 4 > arrBeg[2])
				{
					//"[spoiler0][spoiler1][spoiler2]<blur>text</blur>"
					string = sArr.substring(arrBeg[0], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
					if (debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				//case one:one:two:"[spoiler0][spoiler1]_text_[spoiler2]"
				} else if (arrEnd[2] >= l - 2)
				{
					//"[spoiler0][spoiler1]<blur>text</blur>[spoiler2]"
					string = sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], l);
					if (debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				//case one:one:three:"[spoiler0][spoiler1]_text1_[spoiler2]_text2"
				} else
				{
					//"[spoiler0][spoiler1]<blur>text1</blur>[spoiler2]<blur>text2</blur>"
					string = sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
					if (debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
			//case one:two:"[spoiler0]...[spoiler2]"
			//"[spoiler0]...[spoiler1]":NEVER HAPPEND
			} else if (arrEnd[2] >= l - 2)
			{
				//case one:two:one:"[spoiler0]_text_[spoiler1][spoiler2]"
				if (arrEnd[1] + 4 > arrBeg[2])
				{
					//"[spoiler0]<blur>text</blur>[spoiler1][spoiler2]"
					string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
					if (debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
				//case one:two:two:"[spoiler0]_text1_[spoiler1]_text2_[spoiler2]"
				else
				{
					//"[spoiler0]<blur>text1</blur>[spoiler1]<blur>text2</blur>[spoiler2]"
					string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], l);
					if (debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
			//case one:three:"[spoiler0]_text1_[spoiler1]_text2_[spoiler2]_text3"
			} else
			{
				//"[spoiler0]<blur>text1</blur>[spoiler1]<blur>text2</blur>[spoiler2]<blur>text3</blur>"
				string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}
		//case two:"...[spoiler2]"
		} else if (arrEnd[2] >= l - 2)
		{
			//case two:one:"...[spoiler1][spoiler2]"
			if (arrEnd[1] + 4 > arrBeg[2])
			{
				//case two:one:one:"text_[spoiler0][spoiler1][spoiler2]"
				if (arrEnd[0] + 4 > arrBeg[1])
				{
					//"<blur>text</blur>[spoiler0][spoiler1][spoiler2]"
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
					if (debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
					//case two:one:one:"text1_[spoiler0]_text2_[spoiler1][spoiler2]"
					//"[spoiler0]_text_[spoiler1][spoiler2]":NEVER HAPPEND
				} else
				{
					//"<blur>text1</blur>[spoiler0]<blur>text2</blur>[spoiler1][spoiler2]"
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrEnd[1] + 1, l);
					if (debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
				//case two:two:"text1_[spoiler0][spoiler1]_text2_[spoiler2]"
			} else if (arrEnd[0] + 4 > arrBeg[1])
			{
				//"<blur>text1</blur>[spoiler0][spoiler1]<blur>text2</blur>[spoiler2]"
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrEnd[2] + 1, l);
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
				//case two:two:"text1_[spoiler0]_text2_[spoiler1]_text3_[spoiler2]"
			} else
			{
				//"<blur>text1</blur>[spoiler0]<blur>text2</blur>[spoiler1]<blur>text3</blur>[spoiler2]"
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], l);
				if (debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}
		//case three:"text1_[spoiler0]_text2_[spoiler1]_text3_[spoiler2]_text4"
		//DO I NEED ALL CASES??? TODO!
		} else
		{
			//"<blur>text1</blur>[spoiler0]<blur>text2</blur>[spoiler1]<blur>text3</blur>[spoiler2]<blur>text4</blur>"
			string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
			if (debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		}

	}
}

//second value can be "even" or "odd"
function GetAllIndexes(arr, val1, val2) {
	var indexes = [], temp = [], x, i;
	switch (val2)
	{
		case "even":
			for (x = 0; x < arr.length; x++)
				if (arr[x] === val1)
					temp.push(x);
			for (i = 0; i < temp.length; i++)
			{
				if (IsEven(i))
				{
					indexes.push(temp[i]);
				}
			}
			break;
		case "odd":
			for (x = 0; x < arr.length; x++)
				if (arr[x] === val1)
					temp.push(x);
			for (i = 0; i < temp.length; i++)
			{
				if (!IsEven(i))
				{
					indexes.push(temp[i]);
				}
			}
			break;
		default:
			for (x = 0; x < arr.length; x++)
				if (arr[x] === val1 || arr[x] === val2)
					indexes.push(x);
			break;
	}
	return indexes;
}

function ReplaceOriginalTitles()
{
	for (let i = 0; i < titlesTitle.length; i++) {
		titlesTitle[i].innerHTML = originStrings[i];
	}
}

function MenuCommand() {
	$("#btrSettings").show(1000);
	$("#btrSettings").addClass("btr_opt");
}

function IsEven(n)
{
	return n === parseFloat(n) ? !(n % 2) : void 0;
}

// ------------
//  TODO
// ------------

/* TODO STARTS
✓	 1)Rewrite everything in Jquery ***RESEARCH NEEDED*** by this mean delete GM_addstyle //DONE 0.2.05
	2)Made it exclude of users, mean that post of their users WILL NOT bluring, Partial done(array) in 0.0.0.08
	3)Make it exclude of linkflairs, because every subreddit has its own flair its hard ***RESEARCH NEEDED***
	 3.1)Some subreddits has own spoiler-flair, which can be good to blur, because they don't use buildin in reddit
✓	 4)Support RES ***RESEARCH NEEDED*** NOPE NOPE NOPE, OMG        //DONE 0.3.00
✓	  4.1)Or similar infinite reddit ***RESEARCH NEEDED*** I think this too     //DONE 0.3.00
✓	 5)Support Chrome    //DONE 0.0.08    
✓	 6)Make it different colors(if used, like in r/anime rewatch is blue and discussion are red) in css trough css [href=] or id #  that was easy	//DONE 0.4.03 
✓	 7)Make it proporly edentity everything in brackets   //DONE 0.0.07                                                                           
✓	  7.1)Make it blur title which have more then 3 groups of brackets	//DONE 0.4.00
	   7.1.1)Do I need 4 group of brackets? its pretty rare when title has 3 groups of brackets.
	 7.2)Exclude some brackets which have text like 2011, jan 2007, etc. probably specific subreddit only
	8)What it make that if you clicked on post which are blurry WILL NOT going to blurry again ***RESEARCH NEEDED***
✓	 8.1)What it remember color after you clicked ***RESEARCH NEEDED***		a bit meh	//DONE 0.4.03
		8.1.1)Can i find fix for this? ***RESEARCH NEEDED***
	9)Make it if brackets in the middle should unblury two or more part, dont know how currently ***RESEARCH NEEDED***
	10)Want it if title whithout brackets but has name of anime, show etc. blur everything exclude NAME, its hard
✓    11)Add if title(Somehow)... full title in brackets, forced blur anyway      //DONE 0.2.08 
	12)Make it work when searching
	13)Make options ***RESEARCH NEEDED*** Partial done(array) in 0.0.0.09
✓   13.0)UI     //DONE 0.1.00 
✓	  13.0.1)Make UI with style as subreddits    //DONE 0.2.00 
	    13.0.1.1)To many subreddits break style of settings(unusable etc.), will be removed... probably
✓	  13.0.2)Make it more clear UI   //DONE 0.2.00 
✓   13.1)Make option to blur full title, no matter of brackets     //DONE 0.1.00 
	13.2)Make it add users
✓	 13.3)Make it a bit different opening settings(not as a button)    //DONE 0.2.00  
	13.4)Make settings per subreddit??? probably not
✓	 13.5)Make it show settings through Menu Monkey    //DONE 0.2.02
✓	 13.6)Make it option to exclude, what between **, because some people do not use brackets	//DONE 0.5.00
TODO ENDS */