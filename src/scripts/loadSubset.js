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

function getUrlVars() {
    let vars = [], hash;
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
        console.log("vars[hash[0]] where 'hash[0]' is evaluated '"+hash[0]+"' : "+vars[hash[0]])
    }
    return vars;
}

function getUrlParam(parameter, defaultValue) {
    let urlParameter = defaultValue;
    console.log("urlParameter '"+parameter+"': was set to defaultValue: '"+defaultValue+"' ")
    if(window.location.href.indexOf(parameter) > -1) {
        console.log("Index of parameter '"+parameter+"' in window.location.href was "+window.location.href.indexOf(parameter));
        urlParameter = getUrlVars()[parameter];
        console.log("urlParameter '"+parameter+"' was set to '"+urlParameter+"'")
        if (urlParameter === undefined) {
            console.log("was undefined")
        }
    }
    return urlParameter;
}

function getLanguageText(multilingualTextArray, languageCode) {
    let multilingualTextObject;
    for (multilingualTextObject of multilingualTextArray) {
        if (languageCode === multilingualTextObject["languageCode"])
            return multilingualTextObject["languageText"];
    }
    return "";
}

function getLanguageTextOrDefault(multilingualTextArray, languageCode, defaultLanguageCode){
    let text = getLanguageText(multilingualTextArray, languageCode);
    if (text === "")
        text = getLanguageText(multilingualTextArray, defaultLanguageCode);
    if (text === "" && multilingualTextArray.size > 0)
        text = multilingualTextArray[0]["languageText"];
    return text;
}

function displaySubsetSeriesInformation(subsetSeries, language, baseURL, defaultLanguage){
    // var obj = JSON.parse(text);

    // Get all relevant html document elements from DOM api
    let subsetNameElement, subsetDescElement, statUnitElement;
    subsetNameElement = document.getElementById("subset-name");
    subsetDescElement = document.getElementById("subset-description");
    statUnitElement = document.getElementById("statistical-unit");

    let subsetNameValue, subsetDescValue, statUnitsValue;

    // Get all relevant values from 'subsetSeries' and 'subsetVersion' objects

    let nameMLTArray = subsetSeries["name"];
    subsetNameValue = getLanguageTextOrDefault(nameMLTArray, language, defaultLanguage);
    console.log("subsetNameValue: '"+subsetNameValue+"'");
    subsetNameElement.innerText = '';
    subsetNameElement.appendChild(document.createTextNode(subsetNameValue));

    let descMLTArray = subsetSeries["description"];
    subsetDescValue = getLanguageTextOrDefault(descMLTArray, language, defaultLanguage);
    console.log("subsetDescValue: "+subsetDescValue);
    subsetDescElement.innerText = '';
    subsetDescElement.appendChild(document.createTextNode(subsetDescValue));

    if (Array.isArray(subsetSeries["statisticalUnits"]))
        statUnitsValue = subsetSeries["statisticalUnits"].toString();
    else {
        statUnitsValue = [];
        if (!subsetSeries.hasOwnProperty("statisticalUnits")) {
            console.log("The subsetSeries has no 'statisticalUnits' field present");
        } else {
            console.log("subsetSeries['statisticalUnits'] was not an array. The type was "+subsetSeries["statisticalUnits"]+". Setting to empty array.");
        }
    }
    console.log("statUnitsValue: "+statUnitsValue);
    statUnitElement.appendChild(document.createTextNode(statUnitsValue));
}

function displaySubsetVersion(subsetVersionsArray, language, defaultLanguage) {
    if (!Array.isArray(subsetVersionsArray)){
        alert("subsetVersionsArray was not an Array! Aborting")
        return;
    }

    console.log("subsetVersionsArray size: "+subsetVersionsArray.length);
    let subsetVersion = subsetVersionsArray[0];
    //TODO: Get the latest published version, no matter the order the versions are returned in?

    let codeslistElement, currverinfoElement, currentVersionRationaleElement, currentCreatedDateElement, currentLastModifiedElement, currentValidFromElement, currentValidUntilElement;

    codeslistElement = document.getElementById("codes-list");
    currverinfoElement = document.getElementById("current-version-info");
    currentVersionRationaleElement = document.getElementById("current-rationale");
    currentCreatedDateElement = document.getElementById("current-created-date");
    currentLastModifiedElement = document.getElementById("current-last-modified");
    currentValidFromElement = document.getElementById("current-valid-from");
    currentValidUntilElement = document.getElementById("current-valid-until");

    let validFrom, validUntil, codeslistValue, currverinfoValue;

    // Get values from subsetVersion object

    validFrom = subsetVersion["validFrom"];
    validUntil = subsetVersion["validUntil"];

    codeslistValue = subsetVersion["codes"];
    console.log("codes list : "+JSON.stringify(codeslistValue));

    codeslistElement.innerText = "";
    // Insert values from subset object into relevant elements from html documents
    let code;
    let index = 0; // Used to enumerate list items, to give them an ID
    for (code of codeslistValue) {
        let codeName = getLanguageTextOrDefault(code["name"], language, defaultLanguage);
        console.log("codeName in language '"+language+"': "+codeName)

        let codeNote = "";
        if (Array.isArray(code["notes"])) {
            codeNote = getLanguageTextOrDefault(code["notes"], language, defaultLanguage);
        }
        console.log("codeNote in language '"+language+"': "+codeNote)

        let codeLI = document.createElement("LI");
        let codeInfoSpan = document.createElement("SPAN");
        let textNode = document.createTextNode(`${code["code"]} - '${codeName}' `);
        codeInfoSpan.appendChild(textNode);
        codeLI.appendChild(codeInfoSpan);
        if (codeNote.length !== 0) {
            let noteContSpan = document.createElement("SPAN");
            noteContSpan.className = "hidden";
            noteContSpan.id = `note-code-${index}`;
            noteContSpan.appendChild(document.createTextNode(`- ${globalTextObject.comment[language]}: '${codeNote}'`));
            let showNoteButton = document.createElement("BUTTON");
            showNoteButton.className = "show-note";
            showNoteButton.id = `show-note-${index}`;
            showNoteButton.innerText = globalTextObject["show-note"][language];
            showNoteButton.onclick = function(){toggleHide(noteContSpan.id.toString())};
            codeLI.appendChild(showNoteButton);
            codeLI.appendChild(noteContSpan);
        }
        console.log("codeLI: "+codeLI.toString());
        codeslistElement.appendChild(codeLI);
        index++;
    }

    let rationale = "";
    let rationaleMLTObject;
    if (Array.isArray(subsetVersion["versionRationale"])) {
        for (rationaleMLTObject of subsetVersion["versionRationale"]) {
            if (language === rationaleMLTObject["languageCode"])
                rationale = rationaleMLTObject["languageText"];
        }
    }
    currentVersionRationaleElement.appendChild(document.createTextNode(rationale));

    let createdDate = subsetVersion["createdDate"];
    currentCreatedDateElement.appendChild(document.createTextNode(createdDate));

    let lastModified = subsetVersion["lastModified"];
    currentLastModifiedElement.appendChild(document.createTextNode(lastModified));

    currentValidFromElement.appendChild(document.createTextNode(validFrom));
    currentValidUntilElement.appendChild(document.createTextNode(validUntil));
}

function displaySubsetVersionsList(responseVersionsArray, versionsURL, language) {
    let versionslistElement = document.getElementById("versions-list");
    versionslistElement.innerText = "";
    let responseVersion;
    for (responseVersion of responseVersionsArray) {
        let versionId = responseVersion["versionId"];
        let validFrom = responseVersion["validFrom"];
        let validUntil = responseVersion["validUntil"];
        let versionInfoString = multilingualElementContent["current-valid-from"][language]+validFrom
        if ((typeof validUntil) === "string" && validUntil !== "")
            versionInfoString += multilingualElementContent["current-valid-until"][language]+validUntil
        versionInfoString += ` (Version-ID: '${versionId}')`;
        let versionLI = document.createElement("LI");
        let versionA = document.createElement("A");
        versionA.setAttribute("href", `${versionsURL}/${versionId}`);
        versionA.appendChild(document.createTextNode(versionInfoString))
        versionLI.appendChild(versionA);
        versionslistElement.appendChild(versionLI);
    }
}

function loadSubsetWebView() {
    const defaultSubsetIdValue = "Empty";
    let subsetId = getUrlParam("subsetId", defaultSubsetIdValue);
    console.log("subsetId: "+subsetId);
    let cluster = "prod";
    if ( window.location.href.includes("staging-bip-app") ) {
        cluster = "staging";
    }
    console.log("cluster: "+cluster);
    let language = getUrlParam("language", "nb");
    console.log("language: '"+language+"'");
    let baseURL = `https://subsets-api.${cluster}-bip-app.ssb.no`
    let subsetByIdURL = baseURL+`/v2/subsets/${subsetId}`
    console.log("subsetByIdURL: "+subsetByIdURL)

    //TODO: Update language of HTML elements based on input language
    let htmlId;
    for (htmlId in multilingualElementContent) {
        let translatedTextValue = multilingualElementContent[htmlId][language]
        console.log(`Updating innerText of element with id '${htmlId}' to value '${translatedTextValue}'`)
        document.getElementById(htmlId).innerHTML = '';
        document.getElementById(htmlId).appendChild(document.createTextNode(translatedTextValue));
    }

    let defaultLanguage = "nb";
    let subsetSeries;
    if (subsetId !== defaultSubsetIdValue) {
        let seriesRequest = new XMLHttpRequest();
        seriesRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log("GET series 200 OK . . .");
                    subsetSeries = JSON.parse(this.responseText);
                    console.log("subsetSeries responseText: "+this.responseText);

                    if (language === null || "string" !==  (typeof language) || "" === language || !languageCodesArray.includes(language)) {
                        console.log("language was not specified to a valid value by means of URL parameter");
                    }

                    let adminDetails = subsetSeries.administrativeDetails;
                    if ((typeof adminDetails) === "array") {
                        let adminDetail;
                        for (adminDetail of adminDetails) {
                            if ((typeof adminDetail.administrativeDetailType) === "string" && "DEFAULTLANGUAGE" === adminDetail.administrativeDetailType) {
                                defaultLanguage = adminDetail["values"][0];
                                if (!languageCodesArray.includes(defaultLanguage)) {
                                    alert("The default language retrieved from the administrativeDetails was "+defaultLanguage+", which is not one of the acceptable values. Setting defaultLanguage to 'nb'");
                                    defaultLanguage = "nb";
                                }
                                break;
                            }
                        }
                    }
                    console.log("Default language for subset series is '"+defaultLanguage+"'")

                    displaySubsetSeriesInformation(subsetSeries, language, baseURL, defaultLanguage);
                } else if (this.response == null && this.status === 0) {
                    console.log("The computer appears to be offline.");
                }
            }
        };
        seriesRequest.open("GET", subsetByIdURL, false);
        seriesRequest.send(null);

        let responseVersionsArray;
        let versionsUrl = `https://subsets-api.${cluster}-bip-app.ssb.no/v2/subsets/${subsetId}/versions?includeDrafts=false`
        let versionsRequest = new XMLHttpRequest();
        versionsRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log("GET versions before displaySubsetVersion 200 OK . . .")
                    console.log("subsetVersion responseText: "+this.responseText);
                    responseVersionsArray = JSON.parse(this.responseText);
                    responseVersionsArray.sort((e1, e2) => e2["validFrom"].localeCompare(e1["validFrom"]));
                    displaySubsetVersion(responseVersionsArray, language, defaultLanguage);
                    displaySubsetVersionsList(responseVersionsArray, versionsUrl, language);
                } else if (this.response == null && this.status === 0) {
                    console.log("The computer appears to be offline.");
                }
            }
        };
        versionsRequest.open("GET", versionsUrl, true);
        versionsRequest.send(null);
    }
}

function toggleHide(elementToToggle) {
    let element = document.getElementById(elementToToggle);
    if (element.className.toString().includes("unhidden")) {
        element.className = "hidden";
    } else if (element.className.toString().includes("hidden")) {
        element.className = "unhidden";
    }
}

loadSubsetWebView();
