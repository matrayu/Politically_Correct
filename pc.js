let axios = require('axios')
var _ = require('lodash');



const getEmployeeDonations = async (company, dateRange, state) => {
    console.log('getEmployeeDonations ran')
    try {
        const response = await axios.get(`https://api.open.fec.gov/v1/schedules/schedule_a/?contributor_employer=${company}&contributor_state=${state}&two_year_transaction_period=${dateRange}&per_page=100&sort_null_only=false&sort_hide_null=false&sort=contribution_receipt_date&contributor_type=individual&is_individual=true&api_key=3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK`)

        const len = response.data.results.length
        if (len == 0) throw `Couldn't find any data for ${company} during the ${dateRange} period in ${state}.`
        
        const donationObj = response.data.results
        let pacIDs = []
        let employeeDonations = []
        let partyCount = {rep:0, dem:0, ind:0, pac:0};
        let allPartyObj = []
        
        for(let i = 0; i < donationObj.length; i++) {
            if (donationObj[i].committee.party === null) {
              partyCount.pac++;
              pacIDs.push(donationObj[i].committee.committee_id)
            }
            else {
              // add committee ID and party affiliation to an array
              allPartyObj.push(
                  {committeeID:`${donationObj[i].committee.committee_id}`, party:`${donationObj[i].committee.party}`}
              );
              if (donationObj[i].committee.party === 'DEM') {
                  partyCount.dem++;
              }
              else if (donationObj[i].committee.party === 'REP') {
                  partyCount.rep++;
                  }
              else {
                  partyCount.ind++;
              }}
        }

        //array of pacIDs & total number of donations by employees
        pacIDs = _.countBy(pacIDs) 

        //create array of data found when searching employee donations
        employeeDonations.partyData = partyCount
        employeeDonations.pacData = pacIDs
        return(employeeDonations)
    
    //how do I log the actual error that is being displayed (i.e. incorrect API key)    
    } catch(error) {
        throw new Error(error)
    }
}

const getPacDonations = async (pacID) => {
    console.log('getPacDonations ran')

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
    //returns an array with the pacID and the receipiants of it's donations (pacData)
    return pacDonations;
}

const getPacRecipients = async (pacDonations) => {
    console.log('getPacRecipients ran')
    let processedPacData = [];
    let pacsOnlyArr = [];
    
    //get PAC id
    for (i = 0; i < pacDonations.length; i++) {
        console.log(`PAC ${pacDonations[i].pacID} has donated to ${pacDonations[i].pacData.length} people/pacs.`)
        let pacString = '';
        let comboArr = [];
        
    
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
                pacsOnlyArr.push(comboArr[i])
                }
            }
            

        } catch(error) {
            throw new Error(error)
        }

        processedPacData.push(reduceDownDonationByParty(comboArr))
    }

    return processedPacData
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
          //console.log('here');
          //console.log(holder)
          holder[d.recipient_id] = Number(d.totalAmt);
        }
    });
  
    //console.log(holder[d.recipient_id]);
    //let obj2 = [];
  
    for(let prop in holder) {
        donationsByID.push({recipient_id: prop, totalAmt: holder[prop]});   
    }
  
    return donationsByID
}

const processData = async (company, dateRange, state) => {
    console.log('processData ran')
    const employeeData = await getEmployeeDonations(company, dateRange, state)
    const pacDonations = await getPacDonations(employeeData.pacData)
    const pacParty = await getPacRecipients(pacDonations)
    console.log(employeeData)
    console.log(pacParty)
}









processData('Netflix', 2018, 'NY')
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message)
    })