'use strict';

const searchURL = 'https://api.open.fec.gov/v1/schedules/schedule_a/';
const apiKEY = '3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK'
let totalContributions = 0;
let currentPage = 1;
let businessName;
let dateRange;
let state;

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
        fetchInitialData(businessName, dateRange, state);
    })  
}

function fetchInitialData(name, date, state) {
    console.log('fetchData ran');
    const param = {
        api_key: apiKEY,
        is_individual: true,
        per_page: 100,
        contributor_employer: name,
        two_year_transaction_period: date,
        page: currentPage
    }
    if(state!=""){
        param.contributor_state = state;
    }

    const newQueryString = formQueryParams(param);
    const url = `${searchURL}?${newQueryString}`

    fetch(url)
        .then(function(response) {
            console.log(response.statusText);
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(function(responseJson) {
            calculateContributions(responseJson);
            
        })
        .catch(function(err) {
            $('#js-error-message').text(`Something went wrong: ${err.message}`)
        })
}

function formQueryParams(obj) {
    console.log('formQueryParams ran');
    const queryParams = Object.keys(obj).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
    );
    return(queryParams.join('&'));
}



/*
function checkTotalPages() {
    console.log('checkTotalPages ran');
    let currentPage = 0;
    let totalPages = obj.pagination.pages;
    if (totalPages > 0) {

    }
}
*/

function calculateContributions(obj){
    console.log(obj);
    console.log('totalContributions ran');
    console.log(obj.results.length)
    
    
    for (let i = 0; i < obj.results.length; i++) {
        totalContributions += obj.results[i].contribution_receipt_amount
    };
    console.log(`Total Contributions: ${totalContributions} for page# ${currentPage}`);
    $('.progress').text(`Loading (${Math.floor((currentPage/obj.pagination.pages)*100)}%)`);
    currentPage++;
    if(currentPage <= obj.pagination.pages){
        fetchInitialData(businessName,dateRange,state);
    } else {
        console.log('All Pages Calculated');
        $('.progress').text('');
        $('.data_results h2').text(totalContributions);
    }
}





$(watchForm);