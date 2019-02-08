
const employeeSearchURL = 'https://api.open.fec.gov/v1/schedules/schedule_a/?per_page=100&'
const apiKey = '3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK'
let currentPage = 1;
let pacIDs = [];
let allEmployeeDonations = [];
let employeeDonations = [];
let lastIndex = ''; //this is the previous index that was obtained from API
let finalIndexReached = false;
let businessName = '';
let dateRange = '';
let state = '';
let resultsLength = 0;
let pacDonationsToPacs = [] //this is to capture PAC data if further analysis is needed
let tempPACs = [] //Moving PACs from pacDonationsToPacs so they can be processed


function watchForm() {
    console.log('watchForm ran');
    $('#js-filters').submit(event => {
        event.preventDefault();
        $('.js-data_results').hide();
        pacIDs = []
        allEmployeeDonations = []
        employeeDonations = []
        lastIndex = ''
        businessName = $('#js-contributor_employer').val();
        dateRange = $('#js_date_range').val();
        state = $('#js-state').val();
        totalContributions = 0;
        currentPage = 1;
        $('.business-name').text(businessName);
        $('.time-period').text(dateRange);
        $('.state').text(state);
        //$('.progress').text('Loading...');
        //$('#js-filters').hide();
        $('.js-loading').show();
        $('.js-data_results').show();
        $('.js-dem-results').text('');
        $('.js-rep-results').text('');
        processData(businessName);
    })  
}


function combineEmployeeData (arr) {
    console.log('combineEmployeeData ran')
    arr.forEach((itm) => {
        allEmployeeDonations.push(itm)
    })
}

function formatQueryParams(obj) {
    console.log('formartQueryParams ran')
    if(obj.contributor_state === '') {
        delete obj.contributor_state
    }

    const queryParms = Object.keys(obj).map(key => 
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])
        }`);
    return queryParms.join('&');
}



const getEmployeeDonations = async (company, index) => {
    console.log('getEmployeeDonations ran')

    const params = {
        contributor_employer: businessName,
        two_year_transaction_period: dateRange,
        contributor_state: state,
        api_key: apiKey,
    };

    const newQueryString = formatQueryParams(params)
    const url = `${employeeSearchURL}${newQueryString}`

    //if index is undefined, this is the first time the api is being called
    if(index === undefined) { 
        console.log('index not defined')

        try {
            $('.js-load-1').text(`Please be patient as we load results. This could take a minute...`)
            const response = await axios.get(url)

            resultsLength = response.data.results.length
            if (resultsLength === 0) {
                $('.js-load-1').text(`Couldn't find any data for ${businessName} during the ${dateRange} period in ${state}.`)
                $('.js-load-2').text(`Please try another time period or company.`)
                $('.js-loading').hide();
                throw 'No company data!'
            }
                
            totalPages = response.data.pagination.pages
            lastIndex = response.data.pagination.last_indexes.last_index
            combineEmployeeData(response.data.results)

            const totalEmployeeDonations = await processEmployeeDonations(response, lastIndex);
            return totalEmployeeDonations
        
        //how do I log the actual error that is being displayed (i.e. incorrect API key)    
        } catch(err) {
            throw(err);
        }
    }
    else {
        console.log('index is defined');
        
        try {
            const response = await axios.get(`${url}&last_index=${lastIndex}`)
            //console.log(`index just pulled: ${response.data.pagination.last_indexes.last_index}`)
            
            
            if(response.data.pagination.last_indexes === null) {
                console.log('Final Index Reached')
                finalIndexReached = true
                return
            }
            else {
                lastIndex = response.data.pagination.last_indexes.last_index
                resultsLength = response.data.results.length
                combineEmployeeData(response.data.results)
                return
            }
        }
        catch(error) {
            $('.js-load-1').text(`Oooops! Looks like we ran into some trouble`)
            $('.js-load-2').text(`Please try searching again!`)
            $('.js-loading').hide();
            throw(error)
        }
    }
}

const processEmployeeDonations = async (dataObj) => {
    console.log('processEmployeeDonations ran')

    //if there are more pages of donations to get
    //for (let i = 1; i <= dataObj.data.pagination.pages; i++) {
    for (let i = 1; i <= 10; i++) { //testing to see if using index works better
        //if (resultsLength === 100) { //this is to catch when the total pages is incorrect from API
        if (finalIndexReached === false) { //this is to catch when the total pages is incorrect from API
            console.log('current page processing is ', i);
            console.log('total pages to process are ', dataObj.data.pagination.pages);
            $('.js-load-2').text(`Now loading ${businessName} employee donations...`); //(${Math.floor((i/dataObj.data.pagination.pages)*100)}%)
            console.log(`just in case - the index now being passed through is: ${lastIndex}`)
            await getEmployeeDonations(businessName, lastIndex);
            
        } 
        else {
            //$('.progress').text('');
            let reduced = reduceDownParty(allEmployeeDonations)
            
            allEmployeeDonations.forEach((element) => {
                if (element.committee.party === null || element.committee.party === "NNE") {
                    pacIDs.push(element.committee.committee_id)
                }
            });
            
            pacIDs = _.countBy(pacIDs)

            //create array of data found when searching employee donations
            employeeDonations.partyData = reduced
            employeeDonations.pacData = pacIDs
            console.log(employeeDonations)
            //console.log(`Total pages of employee donations is: ${totalPages} and the last index was ${lastIndex}`)

            return employeeDonations
        }
    }
}

//returns an array with the pacID and the receipiants of it's donations (pacData)
const getPacDonations = async (pacID) => {
    console.log('getPacDonations ran')
    console.log(pacID)
    pacDonations = []

    for (i = 0; i < Object.keys(pacID).length; i++) {
        try {
            const response = await axios.get(`https://api.open.fec.gov/v1/committee/${Object.keys(pacID)[i]}/schedules/schedule_b/by_recipient_id/?page=1&sort_nulls_last=false&sort_hide_null=false&per_page=100&sort_null_only=false&api_key=3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK`)
            
            let pacData = [];
            const resultsData = response.data.results
            
            
            for(let i = 0; i < resultsData.length; i++) {
                if (resultsData[i].memo_total != 0) {
                    resultsData[i].total = resultsData[i].memo_total
                }
                pacData.push({
                    recipient_id:`${resultsData[i].recipient_id}`, 
                    totalAmt:`${resultsData[i].total}`
                    }
                );
            }
            
            pacData = reduceDownDonationsByID(pacData)
            
            pacDonations.push({
                pacID: Object.keys(pacID)[i],
                pacData
            })


        } catch(error) {
            throw new Error(error)
        }
    }
    
    return pacDonations;
}

const getPacRecipients = async (pacDonations) => {
    console.log('getPacRecipients ran')
    let processedPacData = [];
    
    //get PAC id
    for (i = 0; i < pacDonations.length; i++) {
        console.log(`PAC ${pacDonations[i].pacID} has donated to ${pacDonations[i].pacData.length} people/pacs.`)
        let pacString = '';
        let comboArr = [];
        if (pacDonations[i].pacData.length > 0) {
            //string together the committee ID's for all the donations for the PAC ID
            for (let x = 0; x < pacDonations[i].pacData.length; x++) {
                pacString += `&committee_id=${pacDonations[i].pacData[x].recipient_id}`
            };

            //go and fetch the the committe data for all the receipents of money from the PAC
            try {
                const response = await axios.get(`https://api.open.fec.gov/v1/committees/?page=1&sort_nulls_last=false&sort_null_only=false&api_key=3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK&sort=name${pacString}`)
                    
                const resultsData = response.data.results
                
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
                            })
                        }
                    })
                });

                for (let i = 0; i < comboArr.length; i++) {
                    if (comboArr[i].party === null) {
                    pacDonationsToPacs.push(comboArr[i])
                    }
                }

                //console.log(`PACs only Arr is:`)
                //console.log(pacDonationsToPacs)

                
                

            } catch(error) {
                throw new Error(error)
            }
            processedPacData.push(reduceDownDonationByParty(comboArr))
        }    
    }
    return processedPacData
}

const determinePacAffiliation = async (pacParties) => {
    console.log('determinePacAffiliation ran')
    let pacAff = []
    pacParties.forEach((pac, i) => {
        let pacID = pac.pop();
        let max = pac.reduce((prev, current) => (prev.totalAmt > current.totalAmt) ? prev : current)
        
        pacAff.push({
            pacID: pacID.pac,
            pacParty: max.party
        });
        
    });

    if (tempPACs.length === 0) {
        pacAff.forEach((party) => {
            if (party.pacParty === 'null') {
                pacDonationsToPacs.forEach((pacs, i) => {
                    if(pacs.pac === party.pacID) {
                        tempPACs.push(pacs)
                    }
                })
            }
        })
        
        console.log(tempPACs)
        const donationsPac = await tempPacDonations(tempPACs)
        
    }
    
    return(pacAff)
}


const tempPacDonations = async (tempPACs) => {
    console.log('tempPacDonations ran')
    const morePacDonations = await getPacDonations(tempPACs)
    console.log(morePacDonations)
    const morePartiesFoundInPacs = await getPacRecipients(morePacDonations)
    const pacAffiliaton = await determinePacAffiliation(morePartiesFoundInPacs)
    console.log('pacAffiliaton!!!!!')
    console.log(pacAffiliaton)
}


function reduceDownParty(arr) { 
    console.log('reduceDownParty ran');
    let holder = {};

    arr.forEach(function (d) {
        if(holder.hasOwnProperty(d.committee.party_full)) {
            holder[d.committee.party_full] = holder[d.committee.party_full] + 1
            holder[d.committee.party_full+' Donations'] += d.contribution_receipt_amount
        } else {
            holder[d.committee.party_full] = 1
            holder[d.committee.party_full+' Donations'] = d.contribution_receipt_amount
            //holder[d.contribution_receipt_amount] = d.contribution_receipt_amount
        }
    });

    return (holder)
}


//reduce down donations by party and combine their totals
function reduceDownDonationByParty(arr) { 
    console.log('reduceDownDonationByParty ran');
    let holder = {};

    arr.forEach(function (d) {
        if(holder.hasOwnProperty(d.party_full)) {
            holder[d.party_full] = holder[d.party_full] + Number(d.totalAmt);
        } else {
            holder[d.party_full] = Number(d.totalAmt);
        }
    });

    

    let obj2 = [];

    for(let prop in holder) {
        obj2.push({party: prop, totalAmt: holder[prop]});   
    }
    obj2.push({pac: arr[0].pac}) //push PacID into reduced Pac donations array

    return(obj2);
}

//reduce down donations and add together
function reduceDownDonationsByID(arr) {
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
  
    return donationsByID
}


function finalTallyOfDonations (arr1, arr2) {
    console.log('finalTallyOfDonations ran');
    arr2.forEach(function (d, i) {
        
        if(arr1.partyData.hasOwnProperty(d.pacParty)) {
          arr1.partyData[arr2[i].pacParty] += arr1.pacData[arr2[i].pacID]
          arr1.partyData[null] -= arr1.pacData[arr2[i].pacID]

        } else {
          arr1.partyData[arr2[i].pacParty] = arr1.pacData[arr2[i].pacID]
          arr1.partyData[null] -= arr1.pacData[arr2[i].pacID]
        }
    });
    
    return(arr1.partyData)
}

function loadResultsToPage(finalResults) {
    console.log('loadResultsToPage ran')
    $('.js-loading').hide();
    $('.js-load-1').text('');
    $('.js-load-2').text('');
    if (finalResults['DEMOCRATIC PARTY'] === 'null' && finalResults['REPUBLICAN PARTY'] === 'null') {
        $('.js-dem-results').text(`Hmm... There doesn't seem to be any data!`)
        $('.js-rep-results').text(`Try another company or possibly a differet time period.`)
    }
    else if (finalResults['DEMOCRATIC PARTY'] === 'null') {
        $('.js-dem-results').text(`Democatic Donations: 0`);
        $('.js-rep-results').text(`Republican Donations: ${finalResults['REPUBLICAN PARTY']}`);
    }
    else if (finalResults['REPUBLICAN PARTY'] === 'null') {
        $('.js-dem-results').text(`Democatic Donations: ${finalResults['DEMOCRATIC PARTY']}`);
        $('.js-rep-results').text(`Republican Donations: 0`);
    }
    else {
        $('.js-dem-results').text(`Democatic Donations: ${finalResults['DEMOCRATIC PARTY']}`);
        $('.js-rep-results').text(`Republican Donations: ${finalResults['REPUBLICAN PARTY']}`);
    }
    
    console.log(finalResults)
}



const processData = async (company) => {
    console.log('processData ran')
    const employeeData = await getEmployeeDonations(company)
    
    $('.js-load-1').text(`We were able to find ${allEmployeeDonations.length} ${businessName} employee donations from ${dateRange-1}-${dateRange}!`)
    $('.js-load-2').text(`Give us another moment while we analyze the data...`)
    
    const pacDonations = await getPacDonations(employeeDonations.pacData)
    $('.js-load-1').text(`Quite a bit of data!`)
    $('.js-load-2').text(`Shouldn't be much longer!`)
    
    const partiesFoundInPacs = await getPacRecipients(pacDonations)

    const pacAffiliaton = await determinePacAffiliation(partiesFoundInPacs)
    console.log(pacAffiliaton)

    const finalTally = await finalTallyOfDonations(employeeData, pacAffiliaton)
    loadResultsToPage(finalTally)
}

/*
processData('Monsanto', 2016, 'IL', 600)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message)
    })
*/


$(watchForm)