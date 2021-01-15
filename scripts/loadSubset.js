function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getUrlParam(parameter, defaultvalue) {
    let urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function displaySubsetSeriesInformation(subsetSeries, language){
    // var obj = JSON.parse(text);
    const languageCodesArray = ["nb", "nn", "en"];

    // Get all relevant html document elements from DOM api
    let subsetnameElement, subsetdescElement, statunitElement;
    subsetnameElement = document.getElementById("subset-name");
    subsetdescElement = document.getElementById("subset-description");
    statunitElement = document.getElementById("statistical-unit");


    let defaultlanguage, subsetnameValue, subsetdescValue, statunitsValue;

    if (language == null || String !==  language.type || "" === language || !languageCodesArray.includes(language)) {
        // Find the default language for this subset, or default to 'nb' if that fails
        let admindetails = subsetSeries.administrativeDetails;
        let admindetail;
        for (admindetail of admindetails) {
            if (admindetail.administrativeDetailType.type === String && "DEFAULTLANGUAGE" === admindetail.administrativeDetailType) {
                defaultlanguage = admindetail["values"][0];
                if(!languageCodesArray.includes(defaultlanguage)) {
                    alert("The default language retrieved from the administrativeDetails was "+defaultlanguage+", which is not one of the acceptable values. Setting defaultLanguage to 'nb'");
                    defaultlanguage = "nb";
                }
                language = defaultlanguage;
                break;
            }
        }
    }

    // Get all relevant values from 'subsetSeries' and 'subsetVersion' objects

    let nameMLTArray = subsetSeries["name"];
    let multilingualTextObject;
    subsetnameValue = "";
    for (multilingualTextObject of nameMLTArray) {
        if (language === multilingualTextObject["languageCode"])
            subsetnameValue = multilingualTextObject["languageText"];
    }

    let descMLTArray = subsetSeries["description"];
    subsetdescValue = "";
    for (multilingualTextObject of descMLTArray) {
        if (language === multilingualTextObject["languageCode"])
            subsetdescValue = multilingualTextObject["languageText"];
    }

    if (subsetSeries["statisticalUnits"].type === Array)
        statunitsValue = subsetSeries["statisticalUnits"];
    else {
        alert("subsetSeries['statisticalUnits'] was not an array. Setting to empty array.");
        statunitsValue = [];
    }
}

function displaySubsetVersion(subsetVersion, language) {
    let validrangeElement, codeslistElement, currverinfoElement, versionslistElement;

    validrangeElement = document.getElementById("subset-validity-range");
    codeslistElement = document.getElementById("codes-list");
    currverinfoElement = document.getElementById("current-version-info");
    versionslistElement = document.getElementById("versions-list");

    let validFrom, validUntil, codeslistValue, currverinfoValue, versionslistValue;

    // Get values from subsetVersion object

    validFrom = subsetVersion["validFrom"];
    validUntil = subsetVersion["validUntil"];
    codeslistValue = subsetVersion["codes"];

    // Insert values from subset object into relevant elements from html documents
    let code;
    for (code of codeslistValue) {
        let codeName = "";
        let nameMLTObject;
        for (nameMLTObject of code["name"]) {
            if (language === nameMLTObject["languageCode"])
                codeName = nameMLTObject["languageText"];
        }

        let codeNote = "";
        let noteMLTObject;
        for (noteMLTObject of code["notes"]) {
            if (language === noteMLTObject["languageCode"])
                codeNote = noteMLTObject["languageText"];
        }
        codeslistElement.add(`<li>#${code["rank"]} : ${code["code"]} - ${codeName} <div class="note-container"><p>${codeNote}</p></div></li>`)
    }

}

function loadSubsetWebView(){
    const defaultSubsetIdValue = "Empty";
    let subsetId = getUrlParam("subsetId", defaultSubsetIdValue);
    let cluster = getUrlParam("cluster", "prod");
    let language = getUrlParam("language", "");
    let subsetByIdURL = `https://subsets-api.${cluster}-bip-app.ssb.no/v2/subsets/${subsetId}`

    if (subsetId !== defaultSubsetIdValue) {
        let seriesRequest = new XMLHttpRequest();
        seriesRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log(this.responseText);
                    let responseSeriesObject = JSON.parse(this.responseText);
                    displaySubsetSeriesInformation(responseSeriesObject, language);
                } else if (this.response == null && this.status === 0) {
                    console.log("The computer appears to be offline.");
                } else {

                }
            }
        };
        seriesRequest.open("GET", subsetByIdURL, true);
        seriesRequest.send(null);


        let versionsUrl = `https://subsets-api.${cluster}-bip-app.ssb.no/v2/subsets/${subsetId}/versions`
        let versionsRequest = new XMLHttpRequest();
        versionsRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log(this.responseText);
                    let responseVersionsArray = JSON.parse(this.responseText);
                    displaySubsetVersion(responseVersionsArray, language);
                } else if (this.response == null && this.status === 0) {
                    console.log("The computer appears to be offline.");
                } else {

                }
            }
        };
        versionsRequest.open("GET", versionsUrl, true);
        versionsRequest.send(null);
    }
}

loadSubsetWebView();
