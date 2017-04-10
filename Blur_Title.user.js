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
// @version     0.2.07
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==

// Append some text to the element with id someText using the jQuery library. TEST JQUERY
//$("#hsts_pixel").append(" more text.");


//not empty val
var titles = document.querySelectorAll("a.title"),
    titlesDivO = document.querySelectorAll("div.spoiler"),
    stringStartbdi = '<bdi class = "btr_main btr_title btr_trans">',
    stringEndbdi = '</bdi>';

//empty val
var res,
    currentLocation,
    string,
    stringCSS,
    i,
    firstB,
    lastB,
    col,
    lengthOfIndexes,
    settingsDiv;

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
    btr_pUsers;

if (currentLocation === undefined) {
    currentLocation = window.location;
}

Main();

  
function Main()
{

    console.log("Blur Title Reddit v" + GM_info.script.version + " Initialized");

    SetCSS();

    //$(document).ready(function () {
      //  CheckRES();
    //});

    //Menu Monkey Command
    GM_registerMenuCommand("Show Settings Blur Title Reddit", MenuCommand);

    if (titlesDivO.length != 0) {
        console.log(titlesDivO);
        //titlesDiv[1].parentNode.removeChild(titlesDiv[1]);
        for (i = 0; i < titlesDivO.length; i++) {
            titlesDiv[i] = titlesDivO[i];
        }
        console.log(titlesDiv);
        if (GM_getValue("btr_GMTitle")) {
            btr_pTitle = GM_getValue("btr_GMTitle");
            MyFunction();
        } else
        {
            GM_setValue("btr_GMTitle", false);
            btr_pTitle = GM_getValue("btr_GMTitle");
            MyFunction();
        }
    }
    OptionsUI();
    //console.log(GM_listValues());
}

//css
function SetCSS()
{
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
}

//Check  Reddit Enhancement Suite
function CheckRES()
{
        if ($(".neverEndingReddit").length === 0) {
            console.log($(".neverEndingReddit"));
            if ($(".neverEndingReddit").length === 0) {
                console.log($(".neverEndingReddit"));
                if ($(".neverEndingReddit").length === 0) {
                        console.log($(".neverEndingReddit"));
                        if ($(".neverEndingReddit").length === 0) {
                            setTimeout(function () {
                                    console.log($(".neverEndingReddit"));
                                    if ($(".neverEndingReddit").length === 0) {
                                        setTimeout(function () {
                                            console.log($(".neverEndingReddit"));
                                            if ($(".neverEndingReddit").length === 0) {
                                                return;
                                            } else {
                                                SearchForNER();
                                                return;
                                            }
                                        }, 7000);
                                    } else {
                                        SearchForNER();
                                        return;
                                    }                              
                            }, 3000);
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
        } 
    //console.log("Check current RES : " + res[0]);
}

function SearchForNER()
{
    res = true;
    console.log("Check current RES : " + res);
    $(".neverEndingReddit").on("click", function () {
        alert("Settings has been changed. Now brackets hiding.");
    });
}


//UI FOR SETTINGS
function OptionsUI()
{
//    $("head").append($("<style type=text/css></style>").text("div.btr_opt { \
//    height: 300px; \
//    width: 300px;\
//    background: #f0f0f0;\
//    position: fixed; bottom: 0; right: 0; border: 0; \
//    margin: 0px 5px 0px 5px;\
//    padding: 10px 0px 10px 0px;\
//    text-align: center;\
//    border: 1px solid #AAA;\
//    overflow: scroll;\
    //}"));
    $("head").append($("<style type=text/css></style>").text("div.btr_opt { \
    position: fixed; bottom: 0; right: 0; border: 0; \
}"));
    //var t = document.createTextNode("btr_opt {font: 20px verdana;}");
    //x.appendChild(t);
    //document.head.appendChild(x);

  //  settingsDiv = $("<div id=btrSettings></div>").html("<h1>Settings of Blur Title Reddit</h1>\
  //<form> \
  //<br> \
  //<p>Bluring option:</p>\
  //" + check + " \
  //</form> \
  //<button id=btr_hide>Hide Settings</button> \
    //");

    settingsDiv = $("<div id=btrSettings class=side></div>").html("<div class=spaser><div class=sidecontentbox><span class=btr_closeButton>&times</span> \
  <div class=title><h1>Settings of Blur Title Reddit</h1></div>\
  <ul class=content><li> \
  <form> \
  <br> \
  <p>Bluring option:</p>\
  <input type=radio name=title id=btr_showTitle >Show brackets</input><br> \
  <input type=radio name=title id=btr_hideTitle >Hide brackets</input><br> \
  </form> <br> \
  <button id=btr_hide>Hide Settings</button></li></ul></div></div> \
  ");



    $("body").append(settingsDiv);

    //console.log('btr_GMTitle: ' + GM_getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
    //console.log($("[name='title']")[1]);
    if (btr_pTitle === true)
    {
        $("#btr_hideTitle").prop("checked", true);
        //$("btr_showTitle").prop("checked", false);
    } else
    {
        $("#btr_showTitle").prop("checked", true);
        //$("btr_hideTitle").prop("checked", false);
    }

    $("#btrSettings").hide();
    //$("body").append($("<button type=button onclick=$(#btrSettings).show()>Click Me!</button>"));
    //$("body").append("<button id=btr_hide>Hide</button>");
    $("#btr_showTitle").change(function () {
        GM_setValue("btr_GMTitle", false);
        btr_pTitle = GM_getValue("btr_GMTitle");
        ReplaceOriginalTitles();
        MyFunction();
        alert("Settings has been changed. Now brackets showing.");
        console.log('btr_GMTitle: ' + GM_getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
    });
    $("#btr_hideTitle").change(function () {
        GM_setValue("btr_GMTitle", true);
        btr_pTitle = GM_getValue("btr_GMTitle");
        ReplaceOriginalTitles();
        MyFunction();
        alert("Settings has been changed. Now brackets hiding.");
        console.log('btr_GMTitle: ' + GM_getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
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

function MyFunction() {
    if (titlesTitle.length === 0) {
        for (i = 0; i < titlesDiv.length; i++) {
            if (titlesDiv[i].querySelector("div.entry.unvoted")) {
                titlesTitle[i] = titlesDiv[i].querySelector("div.entry.unvoted").querySelector("p.title").querySelector("a.title");
                originStrings[i] = titlesTitle[i].innerHTML;
            } else {
                titlesTitle[i] = titlesDiv[i].querySelector("div.entry").querySelector("p.title").querySelector("a.title");
                originStrings[i] = titlesTitle[i].innerHTML;
            }
        }
    }

    for (i = 0; i < titlesDiv.length; i++) {
        len[i] = titlesTitle[i].innerHTML.length;
        console.log(titlesTitle[i].innerHTML, len[i]);
        stringArr[i] = titlesTitle[i].innerHTML;
        if (col === undefined) {
            $(function () {
                col = $(titlesTitle[0]).css("color");
                console.log("origin color :", col);
                stringCSS = "                             \
            bdi.btr_title:hover,bdi.btr_title:focus     \
            {                                         \
                color:" + col + "!important;          \
                background:transparent!important;     \
                text-decoration:none!important;       \
                text-shadow:0 0.1px 0 #dcddce         \
            }                                         \
            ";
                //console.log(stringCSS);
                //GM_addStyle(stringCSS);
                $("head").append($("<style type=text/css></style>").text(stringCSS));
            });
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
    } else
    {
        // console.log(GetAllIndexes(sArr, "[", "("));
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
            ChangeString(l, sArr, tTitle, 1); //TODO 3
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
    console.log("*str of brackets :", arrBeg);
    console.log("*end of brackets :", arrEnd);
    if (amount === 0) {
        string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
        console.info(string);
        tTitle.innerHTML = string;
        return;
    }
    if (amount === 1) {
        console.log("*words in brackets :", sArr.substring(arrBeg[0], arrEnd[0] + 1));
        if (arrBeg[0] <= 2)
        {
            string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, l) + ' ' + stringEndbdi;
            console.info(string);
            tTitle.innerHTML = string;
            return;
        } else if (arrEnd[0] >= l - 2) {
            string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
            console.info(string);
            tTitle.innerHTML = string;
            return;
        } else
        {
            string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, l) + ' ' + stringEndbdi;
            console.info(string);
            tTitle.innerHTML = string;
            return;
        }
    }

    if (amount === 2) {
        var a;
        var s = '';
        for (a = 0; a < arrBeg.length; a++) {
            s += sArr.substring(arrBeg[a], arrEnd[a] + 1) + ' ';
        }
        console.log("*words in brackets :", s);
        if (arrBeg[0] <= 2) {
            if (arrEnd[0] + 4 > arrBeg[1])
            {
                string = sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
                console.info(string);
                tTitle.innerHTML = string;
                return;
            } else if (arrEnd[1] >= l - 2) {
                string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
                console.info(string);
                tTitle.innerHTML = string;
                return;
            } else
            {
                string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
                console.info(string);
                tTitle.innerHTML = string;
                return;
            }
        } else if (arrEnd[1] >= l - 2) {
            if (arrBeg[1] - 4 < arrEnd[0]) {
                string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
                console.info(string);
                tTitle.innerHTML = string;
                return;
            } else if (arrBeg[0] <= 2) {
                string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
                console.info(string);
                tTitle.innerHTML = string;
                return;
            } else {
                string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
                console.info(string);
                tTitle.innerHTML = string;
                return;
            }
        } else
        {
            if (arrEnd[0] + 3 >= arrBeg[1]) {
                string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
                console.info(string);
                tTitle.innerHTML = string;
                return;
            } else {
                string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
                console.info(string);
                tTitle.innerHTML = string;
                return;
            }
        }
    }
}

function GetAllIndexes(arr, val1, val2) {
    var indexes = [], x;
    for (x = 0; x < arr.length; x++)
        if (arr[x] === val1 || arr[x] === val2)
            indexes.push(x);
    return indexes;
}

function ReplaceOriginalTitles()
{
    for (i = 0; i < titlesTitle.length; i++) {
        titlesTitle[i].innerHTML = originStrings[i];
    }
}

function MenuCommand() {
    $("#btrSettings").show(1000);
    $("#btrSettings").addClass("btr_opt");
}

// ------------
//  TODO
// ------------

/* TODO STARTS
✓    1)Rewrite everything in Jquery ***RESEARCH NEEDED*** by this mean delete GM_addstyle //DONE 0.2.05
    2)Made it exclude of users, mean that post of their users WILL NOT bluring, Partial done(array) in 0.0.0.08
    3)Make it exclude of linkflairs, because every subreddit has its own flair its hard ***RESEARCH NEEDED***
     3.1)Some subreddits has own spoiler-flair, which can be good to blur, because they don't use buildin in reddit
    4)Support RES ***RESEARCH NEEDED*** NOPE NOPE NOPE 
     4.1)Or similar infinite reddit ***RESEARCH NEEDED***
✓    5)Support Chrome    //DONE 0.0.08    
    6)Make it different colors(if used, like in r/anime rewatch is blue and discussion are red) in css trough css [href=] or id # 
✓    7)Make it proporly edentity everything in brackets   //DONE 0.0.07                                                                           
     7.1)Make it blur title which have more then 3 groups of brackets
     7.2)Exclude some brackets which have text like 2011, jan 2007, etc. probably specific subreddit only
    8)What it make that if you clicked on post which are blurry WILL NOT going to blurry again ***RESEARCH NEEDED***
     8.1)What it remember color after you clicked ***RESEARCH NEEDED***
    9)Make it if brackets in the middle should unblury two or more part, dont know how currently ***RESEARCH NEEDED***
    10)Want it if title whithout brackets but has name of anime, show etc. blur everything exclude NAME, its hard
    11)Add if title(Somehow)... full title in brackets, forced blur anyway 
    12)Make it work when searching
    13)Make options ***RESEARCH NEEDED*** Partial done(array) in 0.0.0.09
✓    13.0)UI     //DONE 0.1.00 
✓        13.0.1)Make UI with style as subreddits    //DONE 0.2.00 
            13.0.1.1)To many subreddits break style of settings(unusable etc.), will be removed... probably
✓        13.0.2)Make it more clear UI   //DONE 0.2.00 
✓    13.1)Make option to blur full title, no matter of brackets     //DONE 0.1.00 
     13.2)Make it add users
✓     13.3)Make it a bit different opening settings(not as a button)    //DONE 0.2.00  
     13.4)Make settings per subreddit??? probably not
✓     13.5)Make it show settings through Menu Monkey    //DONE 0.2.02  
TODO ENDS */