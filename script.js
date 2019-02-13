
const employeeSearchURL = 'https://api.open.fec.gov/v1/schedules/schedule_a/?per_page=100&';
const apiKey = '3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK';
let currentPage = 1;
let pacIDs = [];
let allEmployeeDonations = [];
let employeeDonations = [];
let lastIndex = ''; //this is the previous index that was obtained from API
let lastContributionAmount = ''; //use for pagination results
let finalIndexReached = false;
let businessName = '';
let dateRange = '';
let state = '';
let resultsLength = 0;
let pacDonationsToPacs = []; //this is to capture PAC data if further analysis is needed
let receivedMoneyFromUnknownPacArr = []; //Moving PACs from pacDonationsToPacs so they can be processed
let nullPacs = []; //Array of PAC ID's that could not be determined
let unknownPacDonations = {};
let unknownPacDonationsArr = [];
let foundPacAfflitation = {};
let allCombinedUnknownPacData = [];
let unknownPacDonationsReduced = [];
let unknownPacsAffiliation = [];
let employeeSearchLimit = 0;


function watchForm() {
    console.log('watchForm ran');
    $('#js-filters').submit(event => {
        event.preventDefault();
        $('.js-data_results').hide();
        $('.js-intro').hide();
        pacIDs = [];
        allEmployeeDonations = [];
        employeeDonations = [];
        lastIndex = '';
        lastContributionAmount = '';
        businessName = $('#js-contributor_employer').val();
        dateRange = $('#js_date_range').val();
        state = $('#js-state').val();
        totalContributions = 0;
        currentPage = 1;
        finalIndexReached = false;
        $('.business-name').text(businessName);
        $('.time-period').text(dateRange);
        $('.state').text(state);
        $('.js-loading').show();
        $('.js-data_results').show();
        $('.js-dem-results').text('');
        $('.js-rep-results').text('');
        pacDonationsToPacs = [];
        allCombinedUnknownPacData = [];
        unknownPacDonationsReduced = [];
        unknownPacsAffiliation = [];
        employeeSearchLimit = 0;
        processData(businessName);
    });
}


function combineEmployeeData(arr) {
    console.log('combineEmployeeData ran');
    arr.forEach((itm) => {
        allEmployeeDonations.push(itm);
    });
}

function formatQueryParams(obj) {
    console.log('formartQueryParams ran');
    if(obj.contributor_state === '') {
        delete obj.contributor_state;
    }

    const queryParms = Object.keys(obj).map(key => 
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])
        }`);
    return queryParms.join('&');
}

const getEmployeeDonations = async (company, index) => {
    console.log('getEmployeeDonations ran');

    const params = {
        contributor_employer: businessName,
        two_year_transaction_period: dateRange,
        contributor_state: state,
        api_key: apiKey,
    };

    const newQueryString = formatQueryParams(params);
    const url = `${employeeSearchURL}${newQueryString}`;

    //if index is undefined, this is the first time the api is being called
    if(index === undefined) {

        try {
            $('.js-load-1').text('');
            $('.js-load-2').text(`Please be patient as we gather data. This could take a minute...`);
            $('.js-load-3').text('');
            const response = await axios.get(url);

            resultsLength = response.data.results.length;
            if (resultsLength === 0) {
                $('.js-load-1').text(`Couldn't find any data for ${businessName} during the ${dateRange} period in ${state}.`);
                $('.js-load-2').text(`Please try another time period or company.`);
                $('.js-load-3').text('');
                $('.js-loading').hide();
                throw 'No company data!';
            }
                
            totalPages = response.data.pagination.pages;
            lastIndex = response.data.pagination.last_indexes.last_index;
            lastContributionAmount = response.data.pagination.last_indexes.last_contribution_receipt_date;

            combineEmployeeData(response.data.results);

            const totalEmployeeDonations = await processEmployeeDonations(response, lastIndex, lastContributionAmount);
            return totalEmployeeDonations;
        
        //how do I log the actual error that is being displayed (i.e. incorrect API key)    
        } catch(err) {
            $('.js-load-1').text(`Oooops! Looks like we ran into some trouble or couldn't find any company data`);
            $('.js-load-2').text(`Please try searching again!`);
            $('.js-load-3').text('');
            $('.js-loading').hide();
            throw(err);
        }
    }
    else {
        console.log('index is defined');
        //console.log('employeeSearchLimit is at ', employeeSearchLimit, 'of 15')
        
        
        try {
            const response = await axios.get(`${url}&last_index=${lastIndex}&last_contribution_receipt_date=${lastContributionAmount}`);
            
            if(response.data.pagination.last_indexes === null) {
                console.log('Final Index Reached');
                employeeSearchLimit = 0;
                finalIndexReached = true;
                return;
            }
            else {
                lastIndex = response.data.pagination.last_indexes.last_index;
                lastContributionAmount = response.data.pagination.last_indexes.last_contribution_receipt_date;

                resultsLength = response.data.results.length;
                combineEmployeeData(response.data.results);
                return;
            }
        }
        catch(error) {
            $('.js-load-1').text(`Oooops! Looks like we ran into some trouble`);
            $('.js-load-2').text(`Please try searching again!`);
            $('.js-load-3').text('');
            $('.js-loading').hide();
            throw(error);
        }
    }
};

const processEmployeeDonations = async (dataObj) => {
    console.log('processEmployeeDonations ran');

    //while there are more pages of donations to get
    while (finalIndexReached === false) {
        employeeSearchLimit++;
        console.log('current page processing is ', employeeSearchLimit);
        console.log('total pages to process are ', dataObj.data.pagination.pages);
        $('.js-load-1').text(`Now loading ${businessName} employee donations...`);
        $('.js-load-3').text(Math.floor((employeeSearchLimit/dataObj.data.pagination.pages)*100) + '%');
        await getEmployeeDonations(businessName, lastIndex, lastContributionAmount);
    } 

    let reduced = reduceDownParty(allEmployeeDonations);
    
    let uknonwnPacDonations = [];

    allEmployeeDonations.forEach((element) => {
        if (element.committee.party === null || element.committee.party === "NNE") {
            pacIDs.push(element.committee.committee_id);
            uknonwnPacDonations.push({recipient_id: element.committee.committee_id, totalAmt: element.contribution_receipt_amount});
        }
    });

    unknownPacDonationsReduced = reduceDownDonationsByID(uknonwnPacDonations);
    console.log('unknownPacDonationsReduced', unknownPacDonationsReduced);
    
    pacIDs = _.countBy(pacIDs);

    //create array of data found when searching employee donations
    employeeDonations.partyData = reduced;
    employeeDonations.pacData = pacIDs;

    console.log('employeeDonations', employeeDonations);

    return employeeDonations;
    
};

const getPacDonations = async (pacID) => {
    console.log('getPacDonations ran');
    console.log('pacID', pacID);
    
    pacDonations = [];

    for (i = 0; i < Object.keys(pacID).length; i++) {
        try {
            const response = await axios.get(`https://api.open.fec.gov/v1/committee/${Object.keys(pacID)[i]}/schedules/schedule_b/by_recipient_id/?page=1&sort_nulls_last=false&sort_hide_null=false&per_page=100&sort_null_only=false&api_key=3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK`);
            
            let pacData = [];
            const resultsData = response.data.results;
            
            for(let i = 0; i < resultsData.length; i++) {
                if (resultsData[i].memo_total != 0) {
                    resultsData[i].total = resultsData[i].memo_total;
                }
                pacData.push({
                    recipient_id:`${resultsData[i].recipient_id}`, 
                    totalAmt:`${resultsData[i].total}`
                    }
                );
            }
            
            pacData = reduceDownDonationsByID(pacData);
            
            pacDonations.push({
                pacID: Object.keys(pacID)[i],
                pacData
            });

        } catch(error) {
            throw new Error(error);
        }
    }
    
    //returns an array with the pacID and the receipiants of it's donations (pacData)
    return pacDonations;
};

const getPacRecipients = async (pacDonations) => {
    console.log('getPacRecipients ran');
    
    let processedPacData = [];
    
    for (i = 0; i < pacDonations.length; i++) {
        //console.log(`PAC ${pacDonations[i].pacID} has donated to ${pacDonations[i].pacData.length} people/pacs.`)
        let pacString = '';
        let comboArr = [];
        if (pacDonations[i].pacData.length > 0) {
            //string together the committee ID's for all the donations for the PAC ID
            for (let x = 0; x < pacDonations[i].pacData.length; x++) {
                pacString += `&committee_id=${pacDonations[i].pacData[x].recipient_id}`;
            }

            //go and fetch the the committe data for all the receipents of money from the PAC
            try {
                const response = await axios.get(`https://api.open.fec.gov/v1/committees/?page=1&sort_nulls_last=false&sort_null_only=false&api_key=3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK&sort=name${pacString}`);
                    
                const resultsData = response.data.results;
                
                //combine the pacDonation contribution amounts with the committee data fetched
                resultsData.forEach((itm) => {
                    pacDonations[i].pacData.forEach((donation) => {
                        if(donation.recipient_id === itm.committee_id) {
                            comboArr.push({
                            name: itm.name,
                            committee_id: itm.committee_id,
                            party: itm.party,
                            party_full: itm.party_full,
                            totalAmt: donation.totalAmt,
                            pac: pacDonations[i].pacID
                            });
                        }
                    });
                });

                for (let i = 0; i < comboArr.length; i++) {
                    if (comboArr[i].party === null) {
                    pacDonationsToPacs.push(comboArr[i]);
                    }
                }
                
            } catch(error) {
                throw new Error(error);
            }
            processedPacData.push(reduceDownDonationByParty(comboArr));
        }    
    }
    return processedPacData;
};

const determinePacAffiliation = async (pacParties) => {
    console.log('determinePacAffiliation ran');

    let pacAff = [];
    pacParties.forEach((pac, i) => {
        let pacID = pac.pop();
        let max = pac.reduce((prev, current) => (prev.totalAmt > current.totalAmt) ? prev : current);
        
        pacAff.push({
            pacID: pacID.pac,
            pacParty: max.party
        });
        
    });

    unknownPacsAffiliation = pacAff;
    //console.log('unknownPacsAffiliation')
    //console.log(unknownPacsAffiliation)

    //checking to see if any of the PACs could not be determined
    //if so, push receiptients of money from unknown pacs into array receivedMoneyFromUnknownPacArr
    /*
    if (receivedMoneyFromUnknownPacArr.length === 0) {
        pacAff.forEach((party, i) => {
            if (party.pacParty === 'null') {
                nullPacs.push(pacAff[i].pacID)
                pacDonationsToPacs.forEach((pacs, i) => {
                    if(pacs.pac === party.pacID) {
                        receivedMoneyFromUnknownPacArr.push(pacs)
                    }
                })
            }
        //console.log('donationsPac')
        //console.log(donationsPac)
        })
        const donationsPac = processDonationsFromUnknownPacs(receivedMoneyFromUnknownPacArr) //this line will start the process of finding additional pac donations
    }
    */
    console.log('pacAff', pacAff);

    return(pacAff);
};

const getPacDonationsFromUndertermined = async (pacID) => { //this currently is not being called
    console.log('getPacDonationsFromUndertermined ran');
    pacDonations = [];

    for (i = 0; i < Object.keys(pacID).length; i++) {
        try {
            const response = await axios.get(`https://api.open.fec.gov/v1/committee/${pacID[i].committee_id}/schedules/schedule_b/by_recipient_id/?page=1&sort_nulls_last=false&sort_hide_null=false&per_page=100&sort_null_only=false&api_key=3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK`);
            let pacData = [];
            const resultsData = response.data.results;
            
            
            for(let i = 0; i < resultsData.length; i++) {
                if (resultsData[i].memo_total != 0) {
                    resultsData[i].total = resultsData[i].memo_total;
                }
                pacData.push({
                    recipient_id:`${resultsData[i].recipient_id}`, 
                    totalAmt:`${resultsData[i].total}`
                    }
                );
            }
            
            pacData = reduceDownDonationsByID(pacData);
            
            pacDonations.push({
                pacID: Object.keys(pacID)[i],
                pacData
            });


        } catch(error) {
            throw new Error(error);
        }
    }
    
    console.log('pacDonations', pacDonations);

    //returns an array with the pacID and the receipiants of it's donations (pacData)
    return pacDonations;
};

function determineUndeterminedPacs(arr1, arr2) { //this is currently not being called
    console.log('determineUndeterminedPacs ran');
    console.log('arr2', arr2);
    let pacBeingChecked = (arr1[0].pac);
    for (i = 0; i < Object.keys(arr1).length; i++) {
        arr1[i].party_full = arr2[i].pacParty;
    }

    let holder = {};

    arr1.forEach(function (d) {
        if(holder.hasOwnProperty(d.party_full)) {
            holder[d.party_full] = holder[d.party_full] + 1;
            holder[d.party_full+' Donations'] += d.totalAmt;
        } else {
            holder[d.party_full] = 1;
            holder[d.party_full+' Donations'] = d.totalAmt;
            //holder[d.contribution_receipt_amount] = d.contribution_receipt_amount
        }
    });

    let pacResult = {};

    if (holder['DEMOCRATIC PARTY'] < holder['REPUBLICAN PARTY']) {
        pacResult[pacBeingChecked] = 'REPUBLICAN PARTY';
    }
    else {
        pacResult[pacBeingChecked] = 'DEMOCRATIC PARTY';
    }

    console.log('pacResult', pacResult);
}

const processDonationsFromUnknownPacs = async (receivedMoneyFromUnknownPacArr) => { //this is currently not being called
    console.log('processDonationsFromUnknownPacs ran');
    console.log('receivedMoneyFromUnknownPacArr', receivedMoneyFromUnknownPacArr);
    const morePacDonations = await getPacDonationsFromUndertermined(receivedMoneyFromUnknownPacArr);
    //console.log(morePacDonations)
    const morePartiesFoundInPacs = await getPacRecipients(morePacDonations);
    const pacAffiliaton = await determinePacAffiliation(morePartiesFoundInPacs);
    console.log('pacAffiliaton!!!!!', pacAffiliaton);
    foundPacAfflitation = pacAffiliaton;
    console.log('foundPacAfflitation', foundPacAfflitation);
    const pacAffResults = await determineUndeterminedPacs(tempreceivedMoneyFromUnknownPacArrPACs, pacAffiliaton);
};

function combineUnknownPacData(pacData, unknownPacDonationsReduced, foundPacAffiliation) {
    console.log('combineUnknownPacData ran');
    
    for(i = 0; i < Object.keys(pacData).length; i++) {
        allCombinedUnknownPacData.push({
          pacID: Object.keys(pacData)[i],
        });
    }
    
    allCombinedUnknownPacData.forEach(function (d, e) {
        unknownPacDonationsReduced.forEach(function (x, i) {
            if (d.pacID === unknownPacDonationsReduced[i].recipient_id) {
                allCombinedUnknownPacData[e].totalAmt = unknownPacDonationsReduced[i].totalAmt;
            }
        });
    });
  
    allCombinedUnknownPacData.forEach(function (d, e) {
        unknownPacDonationsReduced.forEach(function (x, i) {
            if (d.pacID === Object.keys(pacData)[i]) {
                allCombinedUnknownPacData[e].totalNum = Object.values(pacData)[i];
            }
        });
    });

    allCombinedUnknownPacData.forEach(function (d, e) {
        foundPacAffiliation.forEach(function (x, i) {
            if (d.pacID === x.pacID) {
                allCombinedUnknownPacData[e].party = x.pacParty;
            }
        });
    });

    return allCombinedUnknownPacData;
}

function reduceDownParty(arr) { 
    console.log('reduceDownParty ran');
    
    let totalNum = {};
    let totalCash = {};
    let unknownPacDonations = {};
    let obj1 = [];
  
    arr.forEach(function (d) {
        if(totalNum.hasOwnProperty(d.committee.party_full)) {
            totalNum[d.committee.party_full] = totalNum[d.committee.party_full] + 1;
        } else {
            totalNum[d.committee.party_full] = 1;
        }
    });
  
    arr.forEach(function (d) {
        if(totalCash.hasOwnProperty(d.committee.party_full)) {
            totalCash[d.committee.party_full] += d.contribution_receipt_amount;
        } else {
            totalCash[d.committee.party_full] = d.contribution_receipt_amount;
        }
    });
    
    arr.forEach(function (d) {
        if(d.committee.party_full === null || d.committee.party_full === 'None') {
            if(unknownPacDonations.hasOwnProperty(d.committee.committee_id)) {
                unknownPacDonations[d.committee.committee_id] += Number(d.contribution_receipt_amount);
            } else {
                unknownPacDonations[d.committee.committee_id] = Number(d.contribution_receipt_amount);
            }  
        }
    });
  
    for(i = 0; i < Object.keys(totalCash).length; i++) {
          obj1.push({party: Object.keys(totalCash)[i], totalAmt: Object.values(totalCash)[i], totalNum: Object.values(totalNum)[i]}); 
    }

    return (obj1);
}

function reduceDownDonationByParty(arr) { //reduce down donations by party and combine their totals
    console.log('reduceDownDonationByParty ran');

    let holder = {};

    arr.forEach(function (d) {
        if(holder.hasOwnProperty(d.party_full)) {
            holder[d.party_full] = holder[d.party_full] + Number(d.totalAmt);
        } else {
            holder[d.party_full] = Number(d.totalAmt);
        }
        //holder[committee_id] = [d.committee_id]
    });

    //console.log('reduceDownDonationByParty holder')
    //console.log(holder)

    let obj2 = [];

    for(let prop in holder) {
        obj2.push({party: prop, totalAmt: holder[prop]});   
    }
    obj2.push({pac: arr[0].pac}); //push PacID into reduced Pac donations array

    return(obj2);
}

function reduceDownDonationsByID(arr) { //reduce down donations and add together
    console.log('reduceDownDonationsByID ran');
    
    donationsByID = [];

    let holder = {};
  
    arr.forEach(function (d) {
        if(holder.hasOwnProperty(d.recipient_id)) {
          holder[d.recipient_id] = holder[d.recipient_id] + Number(d.totalAmt);
        } else {
          holder[d.recipient_id] = Number(d.totalAmt);
        }
    });
  
    for(let prop in holder) {
        donationsByID.push({recipient_id: prop, totalAmt: holder[prop]});   
    }
  
    return donationsByID;
}

function finalReduceDownParty(arr) { //once unknown PACs are determined, do a final reduce to combine them all
    console.log('finalReduceDownParty ran');
    console.log('Combined data for unknown pacs', arr);
    
    let totalNum = {};
    let totalCash = {};
    let unknownPacDonations = {};
    let obj1 = [];
  
    arr.forEach(function (d) {
        if(totalNum.hasOwnProperty(d.party)) {
            totalNum[d.party] += d.totalNum;
        } else {
            totalNum[d.party] = d.totalNum;
        }
    });
  
    arr.forEach(function (d) {
        if(totalCash.hasOwnProperty(d.party)) {
            totalCash[d.party] += d.totalAmt;
        } else {
            totalCash[d.party] = d.totalAmt;
        }
    });
    
    arr.forEach(function (d) {
        if(d.party_full === null || d.party_full === 'None') {
            if(unknownPacDonations.hasOwnProperty(d.committee_id)) {
                unknownPacDonations[d.committee_id] += Number(d.contribution_receipt_amount);
            } else {
                unknownPacDonations[d.committee_id] = Number(d.contribution_receipt_amount);
            }  
        }
    });
  
    for(i = 0; i < Object.keys(totalCash).length; i++) {
          obj1.push({party: Object.keys(totalCash)[i], totalAmt: Object.values(totalCash)[i], totalNum: Object.values(totalNum)[i]}); 
    }
  
    return (obj1);
}

function reallyFinalReduceDownParty(arr) { 
    console.log('reallyFinalReduceDownParty ran');
    
    let totalNum = {};
    let totalCash = {};
    let unknownPacDonations = {};
    let obj1 = [];
  
    arr.forEach(function (d) {
        if(totalNum.hasOwnProperty(d.party)) {
            totalNum[d.party] += d.totalNum;
        } else {
            totalNum[d.party] = d.totalNum;
        }
    });
  
    arr.forEach(function (d) {
        if(totalCash.hasOwnProperty(d.party)) {
            totalCash[d.party] += d.totalAmt;
        } else {
            totalCash[d.party] = d.totalAmt;
        }
    });
  
    for(i = 0; i < Object.keys(totalCash).length; i++) {
      obj1.push({
        party: Object.keys(totalCash)[i], 
        totalAmt: Math.round(Object.values(totalCash)[i]), 
        totalNum: Math.round(Object.values(totalNum)[i]) 
      });
    }
    return (obj1);
}

function finalTallyOfDonations(foundPacs, employees) {
    console.log('finalTallyOfDonations ran');
    console.log('foundPacs', foundPacs);
    console.log('employees', employees);

    finalResults = [];

    Array.prototype.push.apply(foundPacs,employees);

    console.log('foundPacs', foundPacs);

    let filtered = foundPacs.filter((el) => { 
        return el.party != "null"; 
    }); 

    console.log('filtered', filtered);

    finalReduced = reallyFinalReduceDownParty(filtered);

    console.log('finalReduced', finalReduced);

    return finalReduced;

}

function loadResultsToPage(finalResults) {
    console.log('loadResultsToPage ran');
    console.log('finalResults', finalResults);
    $('.js-loading').hide();
    $('.js-load-1').text('');
    $('.js-load-2').text('');

    let demTotalNum = 0;
    let demTotalCash = 0;
    let repTotalNum = 0;
    let repTotalCash = 0;

    finalResults.forEach((e) => {
        if(e.party === 'DEMOCRATIC PARTY') {
            demTotalNum = Number(e.totalNum);
            demTotalCash = Number(e.totalAmt);
        }
        else if (e.party === 'REPUBLICAN PARTY') {
            repTotalNum = Number(e.totalNum);
            repTotalCash = Number(e.totalAmt);
        }
    });




    if (demTotalNum === 'null' && repTotalNum === 'null') {
        $('.js-dem-results').text(`Hmm... There doesn't seem to be any data!`);
        $('.js-rep-results').text(`Try another company or possibly a differet time period.`);
    }
    else if (demTotalNum === 'null') {
        $('.js-dem-results').text(`Wow. Looks like there were 0 Democatic donations!`);
        $('.js-rep-results').text(`Republican Donations: ${repTotalNum}`);
    }
    else if (repTotalNum === 'null') {
        $('.js-dem-results').text(`Democatic Donations: ${demTotalNum}`);
        $('.js-rep-results').text(`Wow. Looks like there were 0 Repbulican donations!`);
    }
    else {
        $('.js-dem-results').text(`Democatic Donations: ${demTotalNum} / $${demTotalCash}`);
        $('.js-rep-results').text(`Republican Donations: ${repTotalNum} / $${repTotalCash}`);
    }
}

const processData = async (company) => {
    console.log('processData ran');

    const employeeData = await getEmployeeDonations(company);
    
    $('.js-load-1').text(`We were able to find ${allEmployeeDonations.length} ${businessName} employee donations from ${dateRange-1}-${dateRange}!`);
    $('.js-load-2').text(`Give us another moment while we analyze the data...`);
    $('.js-load-3').text('');

    const pacDonations = await getPacDonations(employeeDonations.pacData);
    $('.js-load-1').text(`Quite a bit of data!`);
    $('.js-load-2').text(`Shouldn't be much longer!`);

    const partiesFoundInPacs = await getPacRecipients(pacDonations);

    const pacAffiliaton = await determinePacAffiliation(partiesFoundInPacs);

    const unknownPacsFoundData = await combineUnknownPacData(employeeDonations.pacData, unknownPacDonationsReduced, pacAffiliaton);

    const finalReduce = await finalReduceDownParty(unknownPacsFoundData);
    
    const finalTally = await finalTallyOfDonations(finalReduce,employeeData.partyData);
    
    loadResultsToPage(finalTally);
};

$(watchForm);