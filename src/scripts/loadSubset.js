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
        console.log("Index of parameter "+parameter+" in window.location.href was "+window.location.href.indexOf(parameter));
        urlParameter = getUrlVars()[parameter];
        console.log("urlParameter was set to '"+urlParameter+"'")
        if (urlParameter === undefined) {
            console.log("was undefined")
        }
    }
    return urlParameter;
}

function displaySubsetSeriesInformation(subsetSeries, language, baseURL){
    // var obj = JSON.parse(text);

    // Get all relevant html document elements from DOM api
    let subsetnameElement, subsetdescElement, statunitElement;
    subsetnameElement = document.getElementById("subset-name");
    subsetdescElement = document.getElementById("subset-description");
    statunitElement = document.getElementById("statistical-unit");

    let subsetnameValue, subsetdescValue, statunitsValue;

    // Get all relevant values from 'subsetSeries' and 'subsetVersion' objects

    let nameMLTArray = subsetSeries["name"];
    let multilingualTextObject;
    subsetnameValue = "";
    for (multilingualTextObject of nameMLTArray) {
        if (language === multilingualTextObject["languageCode"])
            subsetnameValue = multilingualTextObject["languageText"];
    }
    console.log("subsetnameValue: "+subsetnameValue);
    subsetnameElement.innerText = '';
    subsetnameElement.appendChild(document.createTextNode(subsetnameValue));

    let descMLTArray = subsetSeries["description"];
    subsetdescValue = "";
    for (multilingualTextObject of descMLTArray) {
        if (language === multilingualTextObject["languageCode"])
            subsetdescValue = multilingualTextObject["languageText"];
    }
    console.log("subsetdescValue: "+subsetdescValue);
    subsetdescElement.innerText = '';
    subsetdescElement.appendChild(document.createTextNode(subsetdescValue));

    if (Array.isArray(subsetSeries["statisticalUnits"]))
        statunitsValue = subsetSeries["statisticalUnits"].toString();
    else {
        alert("subsetSeries['statisticalUnits'] was not an array. The type was "+subsetSeries["statisticalUnits"]+". Setting to empty array.");
        statunitsValue = [];
    }
    console.log("statunitsValue: "+statunitsValue);
    statunitElement.appendChild(document.createTextNode(statunitsValue));
}

function displaySubsetVersion(subsetVersionsArray, language) {
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
    for (code of codeslistValue) {
        let codeName = "";
        let nameMLTObject;
        for (nameMLTObject of code["name"]) {
            if (language === nameMLTObject["languageCode"])
                codeName = nameMLTObject["languageText"];
        }
        console.log("codeName in language '"+language+"': "+codeName)

        let codeNote = "";
        let noteMLTObject;
        if (Array.isArray(code["notes"])) {
            for (noteMLTObject of code["notes"]) {
                if (language === noteMLTObject["languageCode"])
                    codeNote = noteMLTObject["languageText"];
            }
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
            noteContSpan.id = `note-code-${code["code"]}`;
            noteContSpan.appendChild(document.createTextNode(`- Kommentar: '${codeNote}'`));
            let showNoteButton = document.createElement("BUTTON");
            showNoteButton.className = "show-note";
            showNoteButton.id = `show-note-${code["code"]}`;
            showNoteButton.innerText = "Vis kommentar";
            showNoteButton.onclick = function(){toggleHide(noteContSpan.id.toString())};
            codeLI.appendChild(showNoteButton);
            codeLI.appendChild(noteContSpan);
        }
        console.log("codeLI: "+codeLI.toString());
        codeslistElement.appendChild(codeLI);
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

function displaySubsetVersionsList(responseVersionsArray, versionsURL) {
    let versionslistElement = document.getElementById("versions-list");
    versionslistElement.innerText = "";
    let responseVersion;
    for (responseVersion of responseVersionsArray) {
        let versionId = responseVersion["versionId"];
        let validFrom = responseVersion["validFrom"];
        let validUntil = responseVersion["validUntil"];
        let versionInfoString = `Gyldig fra og med ${validFrom}`
        if ((typeof validUntil) === "string" && validUntil !== "")
            versionInfoString += ` til ${validUntil}`
        versionInfoString += ` (Versjons-ID: '${versionId}')`;
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
    let cluster = getUrlParam("cluster", "staging");
    console.log("cluster: "+cluster);
    let language = getUrlParam("language", "nb");
    console.log("language: "+language);
    let baseURL = `https://subsets-api.${cluster}-bip-app.ssb.no`
    let subsetByIdURL = baseURL+`/v2/subsets/${subsetId}`
    console.log("subsetByIdURL: "+subsetByIdURL)

    let subsetSeries;
    if (subsetId !== defaultSubsetIdValue) {
        let seriesRequest = new XMLHttpRequest();
        seriesRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log("GET series 200 OK . . .")
                    subsetSeries = JSON.parse(this.responseText);
                    console.log("subserSeries responseText: "+this.responseText)
                    const languageCodesArray = ["nb", "nn", "en"];
                    let defaultlanguage;
                    if (language == null || "string" !==  (typeof language) || "" === language || !languageCodesArray.includes(language)) {
                        console.log("language was not specified by means of URL parameter");
                        // Find the default language for this subset, or default to 'nb' if that fails
                        let admindetails = subsetSeries.administrativeDetails;
                        if ((typeof admindetails) === "array") {
                            let admindetail;
                            for (admindetail of admindetails) {
                                if ((typeof admindetail.administrativeDetailType) === "string" && "DEFAULTLANGUAGE" === admindetail.administrativeDetailType) {
                                    defaultlanguage = admindetail["values"][0];
                                    if (!languageCodesArray.includes(defaultlanguage)) {
                                        alert("The default language retrieved from the administrativeDetails was "+defaultlanguage+", which is not one of the acceptable values. Setting defaultLanguage to 'nb'");
                                        defaultlanguage = "nb";
                                    }
                                    language = defaultlanguage;
                                    break;
                                }
                            }
                        } else {
                            language = "nb";
                        }
                    }
                    console.log("language was finally set to '"+language+"'")
                    displaySubsetSeriesInformation(subsetSeries, language, baseURL);
                } else if (this.response == null && this.status === 0) {
                    console.log("The computer appears to be offline.");
                }
            }
        };
        seriesRequest.open("GET", subsetByIdURL, false);
        seriesRequest.send(null);

        let responseVersionsArray;
        let versionsUrl = `https://subsets-api.${cluster}-bip-app.ssb.no/v2/subsets/${subsetId}/versions`
        let versionsRequest = new XMLHttpRequest();
        versionsRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log("GET versions before displaySubsetVersion 200 OK . . .")
                    console.log("subsetVersion responseText: "+this.responseText);
                    responseVersionsArray = JSON.parse(this.responseText);
                    responseVersionsArray.sort((e1, e2) => e2["validFrom"].localeCompare(e1["validFrom"]));
                    displaySubsetVersion(responseVersionsArray, language);
                    displaySubsetVersionsList(responseVersionsArray, versionsUrl);
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
