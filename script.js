'use strict';

const companySearchURL = 'https://api.open.fec.gov/v1/schedules/schedule_a/';
const committeeSearchURL = 'https://api.open.fec.gov/v1/committee/';
const bulkCommitteSearchURL = 'https://api.open.fec.gov/v1/committees/?';
const apiKEY = '3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK';
const apiKEY2 = 'pBPM6wd5ZXMo7aAuN2bPE5Vm44Z1UuDvxvpmY5ZO';
let searchURL = '';
let totalContributions = 0;
let currentPage = 0;
let currentPageCompanyDonations = 1;
let businessName;
let dateRange;
let state;
let party = {rep:0, dem:0, ind:0};
let pacParty = {rep:0, dem:0, ind:0};
let allParty = [];

function watchForm() {
    console.log('watchForm ran');
    $('#js-filters').submit(event => {
        event.preventDefault();
        businessName = $('#js-contributor_employer').val();
        dateRange = $('#js_date_range').val();
        state = $('#js-state').val();
        totalContributions = 0;
        currentPage = 1;
        $('.business-name').text(businessName);
        $('.time-period').text(dateRange);
        $('.state').text(state);
        $('.progress').text('Loading...');
        $('#js-filters').hide();
        fetchInitialData(createDonationSearchURL(businessName, dateRange, state));
        console.log(allParty);
    })  
}

function fetchInitialData(url) {
    console.log('fetchInitialData ran');
    
    fetch(url)
        .then(function(response) {
            console.log(response.statusText);
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(function(responseJson) {
            collectPartyByDonation(responseJson);
            
        })
        .catch(function(err) {
            $('#js-error-message').text(`Something went wrong: ${err.message}`)
        })
}

function fetchCommittePacRecipients(url) {
    console.log('fetchCommittePacRecipients ran')
    fetch(url)
        .then(function(response) {
            console.log(response.statusText);
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(function(responseJson) {
            collectPACRecipients(responseJson);
            
        })
        .catch(function(err) {
            $('#js-error-message').text(`Something went wrong: ${err.message}`)
        })
}

function fetchBulkCommittees(url) {
    console.log('fetchBulkCommittees ran');
    
    fetch(url)
        .then(function(response) {
            console.log(response.statusText);
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(function(responseJson) {
            analyzePacParty(responseJson);
            
        })
        .catch(function(err) {
            $('#js-error-message').text(`Something went wrong: ${err.message}`)
        })
}



function createCommitteSearchURL(committeeID) {
    console.log('createCommitteSearchURL ran');
    const param = {
        api_key: apiKEY2,
        per_page: 100,
        page: currentPage
    }

    const newQueryString = formQueryParams(param);
    //searchURL = `${committeeSearchURL}${committeeID}/schedules/schedule_b/by_recipient_id/?${newQueryString}`
    //hard coded ID for testing
    searchURL = `${committeeSearchURL}C00632133/schedules/schedule_b/by_recipient_id/?${newQueryString}`
    console.log(searchURL);
    return searchURL;
}

function createDonationSearchURL(name, date, state) {
    console.log('createDonationSearchURL ran');
    const param = {
        api_key: apiKEY,
        is_individual: true,
        per_page: 100,
        contributor_employer: name,
        two_year_transaction_period: date,
        page: currentPageCompanyDonations
    }
    if(state!=""){
        param.contributor_state = state;
    }

    const newQueryString = formQueryParams(param);
    searchURL = `${companySearchURL}?${newQueryString}`
    console.log(searchURL);
    return searchURL;
}

function createBulkCommitteeSearchURL(bulkCommitteeString) {
    console.log('createBulkCommitteeSearchURL ran');
    console.log(`current page is ${currentPage}`)
    const param = {
        api_key: apiKEY2,
        per_page: 100,
        page: currentPage
    }

    const newQueryString = formQueryParams(param);
    let searchURL = `${bulkCommitteSearchURL}${newQueryString}${bulkCommitteeString}`
    fetchBulkCommittees(searchURL)
}




function createPACRecipientString(arr) {
    console.log('createPACRecipientString has run')
    let committeeStingQuery = '';
    let strLength = 0;
    let fetchNumber = 0;
    while (arr.length != 0) { //while there are ID's
      if (strLength < 100) { //get at most 100 committee IDs
        committeeStingQuery += `&committee_id=`+ arr.pop(); //string the committee IDs together
        strLength++;
        if (arr.length === 0) { //if there are no more committe ids process the final batch
          console.log(`fetch ${committeeStingQuery}`)
          fetchNumber++;
          strLength = 0;
          committeeStingQuery = '';
        }
      }
      else {
        console.log(`fetch ${committeeStingQuery}`)
        fetchNumber++;
        strLength = 0;
        committeeStingQuery = '';
      }
    };
    console.log(`completed ${fetchNumber} fetches`)
}

function bulkCommitteeIDQueryString(committeeArr) {
    console.log('bulkCommitteeIDQueryString ran');
    let committeeString = '';
    for (let i = 0; i < committeeArr.length; i++) {
        committeeString += `&committee_id=${committeeArr[i].recipient_id}`
    };
    createBulkCommitteeSearchURL(committeeString);
}



function formQueryParams(obj) {
    console.log('formQueryParams ran');
    const queryParams = Object.keys(obj).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
    );
    return(queryParams.join('&'));
}



function collectPartyByDonation(donationObj) {
    console.log('collectPartyByDonation ran');
    let committeeIDs = [];

    for(let i = 0; i < donationObj.results.length; i++) {
        if (donationObj.results[i].committee.party === null) {
            if(!committeeIDs[committee_id[i]].includes(donationObj.results[i].committee.committee_id)) {
                committeeIDs.push({
                    committee_id: `${donationObj.results[i].committee.committee_id}`,
                    donatations: 1
                })
            }
            else {
                // add committee ID and party affiliation to an array
                allParty.push(
                    {committeeID:`${donationObj.results[i].committee.committee_id}`, party:`${donationObj.results[i].committee.party}`}
                );
                if (donationObj.results[i].committee.party === 'DEM') {
                    party.dem++;
                }
                else if (donationObj.results[i].committee.party === 'REP') {
                    party.rep++;
                    }
                else {
                    party.ind++;
                }
            }
        }
    }
    console.log(committeeIDs);
    fetchCommittePacRecipients(createCommitteSearchURL(committeeIDs[0])); ///hard coded remove this 

    /*
    if(currentPage < donationObj.pagination.pages){ // get the next page of data if the currect page is less than the total pages
        $('.progress').text(`Loading (${Math.floor((currentPage/donationObj.pagination.pages)*100)}%)`); // update HTML to display loading progress
        currentPage++;
        fetchInitialData(createDonationSearchURL(businessName, dateRange, state)); //fetches more donation data
    }
    else { // if there's no more pages to fetch update the HTML
        console.log(`Total pages process was ${currentPage}`);    
        currentPage = 1;
        
        if (committeeIDs.length != 0) {
            console.log(`Processing committee PAC IDs ${committeeIDs}`);
            let pacParty = [];
            for (let i = 0; i < committeeIDs.length; i++) {
                fetchCommittePacRecipients(createCommitteSearchURL(committeeIDs[i]));
        };
        
        $('.progress').text(''); // display nothing for the progress status
        $('.data_results h2').text(`DEMS: ${party.dem} REP: ${party.rep}`); // display the total contributions amount
        }      
    }
    */
}

function collectPACRecipients(recipentsObj) {
    console.log('collectPACRecipients ran');
    let resultsData = [];

    for(let i = 0; i < recipentsObj.results.length; i++) {
        resultsData.push({
            recipient_id:`${recipentsObj.results[i].recipient_id}`, 
            totalAmt:`${recipentsObj.results[i].total}`
        });
    }

    

    // if(currentPage < recipentsObj.pagination.pages){ // get the next page of data if the currect page is less than the total pages
    //     $('.progress').text(`Loading (${Math.floor((currentPage/recipentsObj.pagination.pages)*100)}%)`); // update HTML to display loading progress
    //     console.log(currentPage)
    //     currentPage++;
    //     //fetchCommittePacRecipients(createCommitteSearchURL(recipentsObj.results[0].committee_id)); //fetches more donation data
    // }
    // else { // if there's no more pages to fetch update the HTML
    //     console.log(`Total pages process was ${currentPage}`);    
    //     currentPage = 1;
        
    //     $('.progress').text(''); // display nothing for the progress status
    //     $('.data_results h2').text(`DEMS: ${party.dem} REP: ${party.rep}`); // display the total contributions amount
    //     }
    bulkCommitteeIDQueryString(resultsData);
}



function analyzePacParty(bulkCommittees) {
    console.log('analyzePacParty ran')
    for (let i = 0; i < bulkCommittees.results.length; i++) {
        if (bulkCommittees.results[i].party === 'DEM') {
            pacParty.dem++;
        }
        else if (bulkCommittees.results[i].party === 'REP') {
            pacParty.rep++;
        }
        else {
            pacParty.ind++;
        }
    }
    console.log(pacParty)
}


/*
function fetchCommittePacRecipients(arr) {
    console.log('fetchCommittePacRecipients ran');
    let committeeIDString = '';
    let committeID = '';
    const param = {
        api_key: apiKEY2,
        per_page: 100,
        page = currentPage;
    }

    let newQueryString = formQueryParams(param);

    for (let i = 0; i < arr.length; i++) {
        committeID = arr[i];
        const url = `${committeeSearchURL}/${committeID}/schedules/schedule_b/by_recipient_id/?${newQueryString}`

        fetch(url)
            .then(function(response) {
                console.log(response.statusText);
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(function(responseJson) {
                collectPacRecipientIDs(responseJson);
                
            })
            .catch(function(err) {
                $('#js-error-message').text(`Something went wrong: ${err.message}`)
            })

    };
}

function calculateContributions(obj){
    console.log('totalContributions ran');
    
    for (let i = 0; i < obj.results.length; i++) { // loop through contributions found on page and add them together
        totalContributions += obj.results[i].contribution_receipt_amount // add total contributions to the Global var totalContributions
    };
    console.log(`Total Contributions: ${totalContributions} for page# ${currentPage}`);
    
    $('.progress').text(`Loading (${Math.floor((currentPage/obj.pagination.pages)*100)}%)`); // update HTML to display loading progress
    currentPage++; // increment the current page number
    
    if(currentPage <= obj.pagination.pages){ // get the next page of data if the currect page is less than the total pages
        fetchInitialData(businessName,dateRange,state);
    } else { // if there's no more pages to fetch update the HTML
        console.log('All Pages Calculated');
        $('.progress').text(''); // display nothing for the progress status
        $('.data_results h2').text(totalContributions); // display the total contributions amount
    }
}

function collectPacRecipientIDs(committeeObj) {
    console.log('collectPacRecipientIDs ran');
    let recipientIDs = []
    for (let i = 0; i < committeeObj.results.length; i++) {
        if(!recipientIDs.includes(committeeObj.results[i].recipient_id)) {
            recipientIDs.push(committeeObj.results[i].recipient_id)
        };
    }

    //fetchCommitteeInfo(recipientIDs);
    bulkCommitteeIDQueryString(committeeObj)
    //console.log(recipientIDs.);
}
*/















$(watchForm);