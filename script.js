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
    console.log(`${name} ${date} ${state}`);
    const param = {
        contributor_employer: name,
        two_year_transaction_period: date
    }
    if(state!=""){
        param.contributor_state = state;
    }

    const newQueryString = formQueryParams(param);
    const url = `${searchURL}?${newQueryString}`
}

function formQueryParams(obj) {
    console.log('formQueryParams ran');
    const queryParams = Object.keys(obj).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
    );
    console.log(queryParams.join('&'))
}

$(watchForm);