'use strict';

const searchURL = 'https://api.open.fec.gov/v1/schedules/schedule_a/';
const apiKEY = '3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK'


function watchForm() {
    console.log('watchForm ran');
    $('#js-filters').submit(event => {
        event.preventDefault();
        let businessName = $('#js-contributor_employer').val();
        let dateRange = $('#js_date_range').val();
        let state = $('#js-state').val();
        fetchData(businessName, dateRange, state);
    })  
}

function fetchData(name, date, state) {
    console.log('fetchData ran');
    const param = {
        api_key: apiKEY,
        contributor_employer: name,
        two_year_transaction_period: date
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
            getResultsArray(responseJson)
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
    
function getResultsArray(arr) {
    console.log('getResultsArray ran');
}




$(watchForm);