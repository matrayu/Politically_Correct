'use strict';

var axios = require('axios')


const companySearchURL = 'https://api.open.fec.gov/v1/schedules/schedule_a/';
const committeeSearchURL = 'https://api.open.fec.gov/v1/committee/';
const bulkCommitteSearchURL = 'https://api.open.fec.gov/v1/committees/?';
const apiKEY = '3vvb3VZE0SZq372eLAOqPJhIaaspSBH7HukmNTPK';
const apiKEY2 = 'pBPM6wd5ZXMo7aAuN2bPE5Vm44Z1UuDvxvpmY5ZO';
let searchURL = '';
let totalContributions = 0;
let currentPage = 1;
let currentPageCompanyDonations = 1;
let businessName;
let dateRange;
let state;
let partyCount = {rep:0, dem:0, ind:0, pac:0};
let pacDonations = {rep:0, dem:0, ind:0, pac:0};
let allPartyObj = [];
let pacArr = [];
let pacArrNum = 0;
let currentPacProcessing = '';
let currentPacDonations = 0;
let donationsByID = [];
let allFoundPacIDs = []; //use this to store all PAC ID and avoid rechecking
let trackPac = 0 //used to track which Pac is currently being processed


//Temp Code
let pacID = 'C00632133' // Pac with 9 donation disbursments

let empSearch = {
    "api_version": "1.0",
    "results": [
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "NY",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR DCCC (C00000935)",
            "report_type": "M2",
            "contributor_last_name": "GRUBER",
            "report_year": 2017,
            "contributor_occupation": "FREELANCE ART DIRECTOR",
            "contribution_receipt_date": "2017-01-03T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077347730",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "LARRY",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "11209",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462661016",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077347730",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:07:05.909000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "528 76TH STREET",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 75,
            "memoed_subtotal": false,
            "contributor_name": "GRUBER, LARRY",
            "contributor_city": "BROOKLYN",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 50,
            "transaction_id": "SA11AI_67832769",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "NY",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "CONTRIBUTION TO ACTBLUE",
            "report_type": "M2",
            "contributor_last_name": "GRUBER",
            "report_year": 2017,
            "contributor_occupation": "FREELANCE ART DIRECTOR",
            "contribution_receipt_date": "2017-01-03T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077347731",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "LARRY",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "11209",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462661018",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077347731",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:05:43.675000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "528 76TH STREET",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 5,
            "memoed_subtotal": false,
            "contributor_name": "GRUBER, LARRY",
            "contributor_city": "BROOKLYN",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "CONTRIBUTION TO ACT BLUE",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 5,
            "transaction_id": "SA11AI_67832771",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR CORY BOOKER FOR SENATE (C00540500)",
            "report_type": "M2",
            "contributor_last_name": "DIEFFENBACH",
            "report_year": 2017,
            "contributor_occupation": "SCREENWRITER",
            "contribution_receipt_date": "2017-01-11T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077295004",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "MIKE",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "91604",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462345223",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077295004",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:07:48.002000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "12050 VALLEYHEART DRIVE UNIT 304",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 25,
            "memoed_subtotal": false,
            "contributor_name": "DIEFFENBACH, MIKE",
            "contributor_city": "STUDIO CITY",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 25,
            "transaction_id": "SA11AI_68373940",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "CONTRIBUTION TO ACTBLUE",
            "report_type": "M2",
            "contributor_last_name": "GEOGHAN",
            "report_year": 2017,
            "contributor_occupation": "DISTRIBUTION SPECIALIST",
            "contribution_receipt_date": "2017-01-11T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077332732",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "JAMIE",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "90027",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462571167",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077332732",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:04:40.032000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "2918 ST GEORGE ST 10",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 0.3,
            "memoed_subtotal": false,
            "contributor_name": "GEOGHAN, JAMIE",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "CONTRIBUTION TO ACT BLUE",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 0.3,
            "transaction_id": "SA11AI_68372002",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR DCCC (C00000935)",
            "report_type": "M2",
            "contributor_last_name": "GEOGHAN",
            "report_year": 2017,
            "contributor_occupation": "DISTRIBUTION SPECIALIST",
            "contribution_receipt_date": "2017-01-11T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077332732",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "JAMIE",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "90027",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462571169",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077332732",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:06:35.282000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "2918 ST GEORGE ST 10",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 3,
            "memoed_subtotal": false,
            "contributor_name": "GEOGHAN, JAMIE",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 3,
            "transaction_id": "SA11AI_68371995",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "ADD",
            "memo_text": "EARMARKED CONTRIBUTION: SEE BELOW",
            "report_type": "Q1",
            "contributor_last_name": "GOMEZ URIBE",
            "report_year": 2017,
            "contributor_occupation": "ENGINEER",
            "contribution_receipt_date": "2017-01-13T00:00:00",
            "election_type_full": null,
            "original_sub_id": "2042720171400731323",
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201704200200123336",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "CARLOS",
            "file_number": 1160287,
            "conduit_committee_city": null,
            "committee_id": "C00571919",
            "contributor_zip": "950085812",
            "link_id": 1072120170035550500,
            "back_reference_schedule_name": null,
            "election_type": "P2022",
            "sub_id": "1072120170035551711",
            "memo_code": null,
            "contributor_employer": "NETFLIX, INC.",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": "2022",
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201704200200123336",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": "C00401224",
            "fec_election_type_desc": "PRIMARY",
            "amendment_indicator": "A",
            "load_date": "2017-07-22T02:00:12.860000+00:00",
            "candidate_id": null,
            "receipt_type_desc": "EARMARKED CONTRIBUTION",
            "contributor_street_1": "1775 REGINA WAY",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "90017",
                "committee_type_full": "Senate",
                "cycles": [
                    2016,
                    2018,
                    2020
                ],
                "party": "DEM",
                "cycle": 2018,
                "candidate_ids": [
                    "S6CA00584"
                ],
                "designation": "P",
                "state_full": "California",
                "state": "CA",
                "filing_frequency": "Q",
                "committee_type": "S",
                "treasurer_name": "STEPHEN J KAUFMAN",
                "designation_full": "Principal campaign committee",
                "party_full": "DEMOCRATIC PARTY",
                "committee_id": "C00571919",
                "name": "KAMALA HARRIS FOR SENATE",
                "street_1": "777 S FIGUEROA ST STE 4050",
                "organization_type_full": null,
                "city": "LOS ANGELES",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 250,
            "memoed_subtotal": false,
            "contributor_name": "GOMEZ URIBE, CARLOS",
            "contributor_city": "CAMPBELL",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": null,
            "candidate_office_state_full": null,
            "unused_contbr_id": "C00401224",
            "candidate_office_district": null,
            "recipient_committee_type": "S",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "candidate_office_state": null,
            "receipt_type": "15E",
            "contribution_receipt_amount": 150,
            "transaction_id": null,
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "ADD",
            "memo_text": "* EARMARKED CONTRIBUTION: SEE BELOW",
            "report_type": "MY",
            "contributor_last_name": "MARKMAN",
            "report_year": 2017,
            "contributor_occupation": "ATTORNEY",
            "contribution_receipt_date": "2017-01-15T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201707289069849498",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "STEFANIE",
            "file_number": 1176116,
            "conduit_committee_city": null,
            "committee_id": "C00619528",
            "contributor_zip": "900494559",
            "link_id": 4072820171442246908,
            "back_reference_schedule_name": "SA11AI",
            "election_type": "P",
            "sub_id": "4080320171442509363",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201707289069849498",
            "conduit_committee_name": null,
            "back_reference_transaction_id": "VSH8DEME2Q7E",
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": "C00468314",
            "fec_election_type_desc": "PRIMARY",
            "amendment_indicator": "A",
            "load_date": "2017-08-04T10:43:25.138000+00:00",
            "candidate_id": null,
            "receipt_type_desc": "EARMARKED CONTRIBUTION",
            "contributor_street_1": "11676 CHENAULT ST",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "90017",
                "committee_type_full": "PAC - Qualified",
                "cycles": [
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "California",
                "state": "CA",
                "filing_frequency": "M",
                "committee_type": "Q",
                "treasurer_name": "KANTROWITZ, JAMIE",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00619528",
                "name": "LOS ANGELES WOMEN'S GIVING COLLECTIVE PAC",
                "street_1": "777 S. FIGUEROA STREET #4050",
                "organization_type_full": null,
                "city": "LOS ANGELES",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 1000,
            "memoed_subtotal": false,
            "contributor_name": "MARKMAN, STEFANIE",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": null,
            "candidate_office_state_full": null,
            "unused_contbr_id": "C00468314",
            "candidate_office_district": null,
            "recipient_committee_type": "Q",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": {
                "street_2": null,
                "zip": "20001",
                "committee_type_full": "PAC - Nonqualified",
                "cycles": [
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "District Of Columbia",
                "state": "DC",
                "filing_frequency": "M",
                "committee_type": "N",
                "treasurer_name": "ZUCKER, JONATHAN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00468314",
                "name": "DEMOCRACY ENGINE, INC., PAC",
                "street_1": "237 FLORIDA AVENUE NW",
                "organization_type_full": "Corporation",
                "city": "WASHINGTON",
                "organization_type": "C"
            },
            "candidate_office_state": null,
            "receipt_type": "15E",
            "contribution_receipt_amount": 1000,
            "transaction_id": "VSH8DEME2Q7",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR HEIDI FOR SENATE (C00505552)",
            "report_type": "M2",
            "contributor_last_name": "DIEFFENBACH",
            "report_year": 2017,
            "contributor_occupation": "SCREENWRITER",
            "contribution_receipt_date": "2017-01-19T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077295004",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "MIKE",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "91604",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462345225",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077295004",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:07:31.975000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "12050 VALLEYHEART DRIVE UNIT 304",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 25,
            "memoed_subtotal": false,
            "contributor_name": "DIEFFENBACH, MIKE",
            "contributor_city": "STUDIO CITY",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 25,
            "transaction_id": "SA11AI_68913978",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "NY",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "CONTRIBUTION TO ACTBLUE",
            "report_type": "M2",
            "contributor_last_name": "FREY",
            "report_year": 2017,
            "contributor_occupation": "WRITER",
            "contribution_receipt_date": "2017-01-19T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077325279",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "JONATHAN",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "11106",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462526543",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077325279",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:06:43.612000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "3152 35TH ST APT 3R",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 0.5,
            "memoed_subtotal": false,
            "contributor_name": "FREY, JONATHAN",
            "contributor_city": "ASTORIA",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "CONTRIBUTION TO ACT BLUE",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 0.5,
            "transaction_id": "SA11AI_68951704",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "NY",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR ELLISON FOR CONGRESS (C00422410)",
            "report_type": "M2",
            "contributor_last_name": "FREY",
            "report_year": 2017,
            "contributor_occupation": "WRITER",
            "contribution_receipt_date": "2017-01-19T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077325280",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "JONATHAN",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "11106",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462526545",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077325280",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:08:56.094000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "3152 35TH ST APT 3R",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 5,
            "memoed_subtotal": false,
            "contributor_name": "FREY, JONATHAN",
            "contributor_city": "ASTORIA",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 5,
            "transaction_id": "SA11AI_68951696",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR DCCC (C00000935)",
            "report_type": "M2",
            "contributor_last_name": "GALUSKA",
            "report_year": 2017,
            "contributor_occupation": "TELEVISION WRITER",
            "contribution_receipt_date": "2017-01-20T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077328855",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "KELLY",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "90064",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462547957",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077328855",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:06:49.444000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "10424 ALMAYO AVENUE",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 38,
            "memoed_subtotal": false,
            "contributor_name": "GALUSKA, KELLY",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 38,
            "transaction_id": "SA11AI_69030883",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "CONTRIBUTION TO ACTBLUE",
            "report_type": "M2",
            "contributor_last_name": "GALUSKA",
            "report_year": 2017,
            "contributor_occupation": "TELEVISION WRITER",
            "contribution_receipt_date": "2017-01-20T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077328856",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "KELLY",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "90064",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462547959",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077328856",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:06:46.353000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "10424 ALMAYO AVENUE",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 3.8,
            "memoed_subtotal": false,
            "contributor_name": "GALUSKA, KELLY",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "CONTRIBUTION TO ACT BLUE",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 3.8,
            "transaction_id": "SA11AI_69030898",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "NY",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR DCCC (C00000935)",
            "report_type": "M2",
            "contributor_last_name": "GRUBER",
            "report_year": 2017,
            "contributor_occupation": "FREELANCE ART DIRECTOR",
            "contribution_receipt_date": "2017-01-20T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077347731",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "LARRY",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "11209",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462661020",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077347731",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:10:30.449000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "528 76TH STREET",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 75,
            "memoed_subtotal": false,
            "contributor_name": "GRUBER, LARRY",
            "contributor_city": "BROOKLYN",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 25,
            "transaction_id": "SA11AI_69010648",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR DCCC (C00000935)",
            "report_type": "M2",
            "contributor_last_name": "ROSS",
            "report_year": 2017,
            "contributor_occupation": "WRITER",
            "contribution_receipt_date": "2017-01-20T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077519553",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "MATT",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "90042",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171463685504",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077519553",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:04:46.907000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "5118 RAPHAEL ST",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 59,
            "memoed_subtotal": false,
            "contributor_name": "ROSS, MATT",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 19,
            "transaction_id": "SA11AI_69021708",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR KAMALA HARRIS FOR SENATE (C00571919)",
            "report_type": "M2",
            "contributor_last_name": "GREEN",
            "report_year": 2017,
            "contributor_occupation": "PRODUCTION EXECUTIVE",
            "contribution_receipt_date": "2017-01-24T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077344252",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "NOELLE",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "91401",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462640170",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077344252",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:05:55.578000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "5255 COLDWATER CANYON AVENUE",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 5,
            "memoed_subtotal": false,
            "contributor_name": "GREEN, NOELLE",
            "contributor_city": "SHERMAN OAKS",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 5,
            "transaction_id": "SA11AI_69330201",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "ADD",
            "memo_text": "EARMARKED CONTRIBUTION: SEE BELOW",
            "report_type": "Q1",
            "contributor_last_name": "MARKMAN",
            "report_year": 2017,
            "contributor_occupation": "ATTORNEY",
            "contribution_receipt_date": "2017-01-25T00:00:00",
            "election_type_full": "PRIMARY",
            "original_sub_id": "2042520171400444253",
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201704200200121844",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "STEFANIE",
            "file_number": 1160115,
            "conduit_committee_city": null,
            "committee_id": "C00413914",
            "contributor_zip": "900494513",
            "link_id": 1092120170035843690,
            "back_reference_schedule_name": null,
            "election_type": "P2018",
            "sub_id": "1092120170035843699",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": "2018",
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201704200200121844",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": "C00401224",
            "fec_election_type_desc": "PRIMARY",
            "amendment_indicator": "A",
            "load_date": "2017-09-22T09:29:00.539000+00:00",
            "candidate_id": null,
            "receipt_type_desc": "EARMARKED CONTRIBUTION",
            "contributor_street_1": "11676 CHENAULT ST",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": "2ND FLOOR",
                "zip": "20001",
                "committee_type_full": "Senate",
                "cycles": [
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": "DEM",
                "cycle": 2018,
                "candidate_ids": [
                    "H6NY20167",
                    "S0NY00410"
                ],
                "designation": "P",
                "state_full": "District Of Columbia",
                "state": "DC",
                "filing_frequency": "Q",
                "committee_type": "S",
                "treasurer_name": "LOWEY, KEITH D.",
                "designation_full": "Principal campaign committee",
                "party_full": "DEMOCRATIC PARTY",
                "committee_id": "C00413914",
                "name": "GILLIBRAND FOR SENATE",
                "street_1": "126 C STREET NW",
                "organization_type_full": null,
                "city": "WASHINGTON",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 1000,
            "memoed_subtotal": false,
            "contributor_name": "MARKMAN, STEFANIE",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": null,
            "candidate_office_state_full": null,
            "unused_contbr_id": "C00401224",
            "candidate_office_district": null,
            "recipient_committee_type": "S",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "candidate_office_state": null,
            "receipt_type": "15E",
            "contribution_receipt_amount": 1000,
            "transaction_id": null,
            "contributor_street_2": "APT 14"
        },
        {
            "filing_form": "F3",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "ADD",
            "memo_text": "EARMARKED CONTRIBUTION: SEE BELOW",
            "report_type": "Q1",
            "contributor_last_name": "MARKMAN",
            "report_year": 2017,
            "contributor_occupation": "ATTORNEY",
            "contribution_receipt_date": "2017-01-25T00:00:00",
            "election_type_full": null,
            "original_sub_id": "2050920171404074002",
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201704200200121844",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "STEFANIE",
            "file_number": 1161465,
            "conduit_committee_city": null,
            "committee_id": "C00413914",
            "contributor_zip": "900494513",
            "link_id": 1092120170035843690,
            "back_reference_schedule_name": null,
            "election_type": "P2018",
            "sub_id": "1092120170035856114",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": "2018",
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201704200200121844",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": "C00401224",
            "fec_election_type_desc": "PRIMARY",
            "amendment_indicator": "A",
            "load_date": "2017-09-22T09:29:34.641000+00:00",
            "candidate_id": null,
            "receipt_type_desc": "EARMARKED CONTRIBUTION",
            "contributor_street_1": "11676 CHENAULT ST",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": "2ND FLOOR",
                "zip": "20001",
                "committee_type_full": "Senate",
                "cycles": [
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": "DEM",
                "cycle": 2018,
                "candidate_ids": [
                    "H6NY20167",
                    "S0NY00410"
                ],
                "designation": "P",
                "state_full": "District Of Columbia",
                "state": "DC",
                "filing_frequency": "Q",
                "committee_type": "S",
                "treasurer_name": "LOWEY, KEITH D.",
                "designation_full": "Principal campaign committee",
                "party_full": "DEMOCRATIC PARTY",
                "committee_id": "C00413914",
                "name": "GILLIBRAND FOR SENATE",
                "street_1": "126 C STREET NW",
                "organization_type_full": null,
                "city": "WASHINGTON",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 1000,
            "memoed_subtotal": false,
            "contributor_name": "MARKMAN, STEFANIE",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": null,
            "candidate_office_state_full": null,
            "unused_contbr_id": "C00401224",
            "candidate_office_district": null,
            "recipient_committee_type": "S",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "candidate_office_state": null,
            "receipt_type": "15E",
            "contribution_receipt_amount": 1000,
            "transaction_id": null,
            "contributor_street_2": "APT 14"
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR DOUGLAS APPLEGATE FOR CONGRESS (C00581595)",
            "report_type": "M2",
            "contributor_last_name": "DIEFFENBACH",
            "report_year": 2017,
            "contributor_occupation": "SCREENWRITER",
            "contribution_receipt_date": "2017-01-25T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077295005",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "MIKE",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "91604",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171462345227",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077295005",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:07:16.872000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "12050 VALLEYHEART DRIVE UNIT 304",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 25,
            "memoed_subtotal": false,
            "contributor_name": "DIEFFENBACH, MIKE",
            "contributor_city": "STUDIO CITY",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 25,
            "transaction_id": "SA11AI_69434934",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR GILLIBRAND FOR SENATE (C00413914)",
            "report_type": "M2",
            "contributor_last_name": "MARKMAN",
            "report_year": 2017,
            "contributor_occupation": "ATTORNEY",
            "contribution_receipt_date": "2017-01-25T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077435044",
            "is_individual": false,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "STEFANIE",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "90049",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": "P",
            "sub_id": "4111520171463183994",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077435044",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": "C00413914",
            "fec_election_type_desc": "PRIMARY",
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:06:21.398000+00:00",
            "candidate_id": "S0NY00410",
            "receipt_type_desc": "EARMARKED INTERMEDIARY TREASURY OUT",
            "contributor_street_1": "11676 CHENAULT STREET APT 14",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 1000,
            "memoed_subtotal": false,
            "contributor_name": "MARKMAN, STEFANIE",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": "C00413914",
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": {
                "street_2": "2ND FLOOR",
                "zip": "20001",
                "committee_type_full": "Senate",
                "cycles": [
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": "DEM",
                "cycle": 2018,
                "candidate_ids": [
                    "H6NY20167",
                    "S0NY00410"
                ],
                "designation": "P",
                "state_full": "District Of Columbia",
                "state": "DC",
                "filing_frequency": "Q",
                "committee_type": "S",
                "treasurer_name": "LOWEY, KEITH D.",
                "designation_full": "Principal campaign committee",
                "party_full": "DEMOCRATIC PARTY",
                "committee_id": "C00413914",
                "name": "GILLIBRAND FOR SENATE",
                "street_1": "126 C STREET NW",
                "organization_type_full": null,
                "city": "WASHINGTON",
                "organization_type": null
            },
            "candidate_office_state": null,
            "receipt_type": "24T",
            "contribution_receipt_amount": 1000,
            "transaction_id": "SA11AI_69382174",
            "contributor_street_2": null
        },
        {
            "filing_form": "F3X",
            "candidate_last_name": null,
            "donor_committee_name": null,
            "contributor_suffix": null,
            "contributor_state": "CA",
            "candidate_middle_name": null,
            "conduit_committee_street1": null,
            "amendment_indicator_desc": "NO CHANGE",
            "memo_text": "EARMARKED FOR JEFF MERKLEY FOR OREGON (C00437277)",
            "report_type": "M2",
            "contributor_last_name": "ATHANASIADIS",
            "report_year": 2017,
            "contributor_occupation": "INFORMATION TECHNOLOGY",
            "contribution_receipt_date": "2017-01-27T00:00:00",
            "election_type_full": null,
            "original_sub_id": null,
            "candidate_first_name": null,
            "conduit_committee_street2": null,
            "pdf_url": "http://docquery.fec.gov/cgi-bin/fecimg/?201710319077216360",
            "is_individual": true,
            "line_number_label": "Contributions From Individuals/Persons Other Than Political Committees",
            "contributor_first_name": "ALEXANDROS",
            "file_number": 1189990,
            "conduit_committee_city": null,
            "committee_id": "C00401224",
            "contributor_zip": "90048",
            "link_id": 4103120171461553241,
            "back_reference_schedule_name": null,
            "election_type": null,
            "sub_id": "4111520171461874141",
            "memo_code": null,
            "contributor_employer": "NETFLIX",
            "conduit_committee_zip": null,
            "line_number": "11AI",
            "fec_election_year": null,
            "contributor_prefix": null,
            "committee_name": null,
            "image_number": "201710319077216360",
            "conduit_committee_name": null,
            "back_reference_transaction_id": null,
            "two_year_transaction_period": 2018,
            "national_committee_nonfederal_account": null,
            "contributor_middle_name": null,
            "contributor_id": null,
            "fec_election_type_desc": null,
            "amendment_indicator": "N",
            "load_date": "2017-11-16T02:05:47.208000+00:00",
            "candidate_id": null,
            "receipt_type_desc": null,
            "contributor_street_1": "105 S HAYWORTH AVE APT 14",
            "candidate_office": null,
            "conduit_committee_id": null,
            "schedule_type_full": "ITEMIZED RECEIPTS",
            "committee": {
                "street_2": null,
                "zip": "02144",
                "committee_type_full": "PAC with Non-Contribution Account - Qualified",
                "cycles": [
                    2004,
                    2006,
                    2008,
                    2010,
                    2012,
                    2014,
                    2016,
                    2018,
                    2020
                ],
                "party": null,
                "cycle": 2018,
                "candidate_ids": [],
                "designation": "U",
                "state_full": "Massachusetts",
                "state": "MA",
                "filing_frequency": "M",
                "committee_type": "W",
                "treasurer_name": "HILL, ERIN",
                "designation_full": "Unauthorized",
                "party_full": null,
                "committee_id": "C00401224",
                "name": "ACTBLUE",
                "street_1": "P.O. BOX 441146",
                "organization_type_full": null,
                "city": "SOMERVILLE",
                "organization_type": null
            },
            "increased_limit": null,
            "contributor_aggregate_ytd": 1.42,
            "memoed_subtotal": false,
            "contributor_name": "ATHANASIADIS, ALEXANDROS",
            "contributor_city": "LOS ANGELES",
            "candidate_name": null,
            "conduit_committee_state": null,
            "candidate_suffix": null,
            "schedule_type": "SA",
            "memo_code_full": null,
            "entity_type_desc": "INDIVIDUAL",
            "entity_type": "IND",
            "receipt_type_full": "EARMARK",
            "candidate_office_state_full": null,
            "unused_contbr_id": null,
            "candidate_office_district": null,
            "recipient_committee_type": "W",
            "candidate_prefix": null,
            "candidate_office_full": null,
            "contributor": null,
            "candidate_office_state": null,
            "receipt_type": null,
            "contribution_receipt_amount": 1.42,
            "transaction_id": "SA11AI_69584931",
            "contributor_street_2": null
        }
    ],
    "pagination": {
        "last_indexes": {
            "last_index": "4111520171461874141",
            "last_contribution_receipt_date": "2017-01-27T00:00:00"
        },
        "per_page": 20,
        "pages": 284,
        "count": 5674
    }
}

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
        //console.log(allParty);
    })  
}

const fetchInitialData = async (url) => {
    console.log('fetchInitialData ran');
    console.log(url)
    return
    
    const response = await axios.get(url);
    const 


    /*
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
    */
}


function collectPartyByDonation(donationObj) {
  console.log('collectPartyByDonation ran');
  let pacIDs = []; //Local to store the PACs found in inital search from employees
  

  //loop through results of company donations and return results to Party
  for(let i = 0; i < donationObj.results.length; i++) {
    if (donationObj.results[i].committee.party === null) {
      partyCount.pac++;
      pacIDs.push(donationObj.results[i].committee.committee_id)
    }
    else {
      // add committee ID and party affiliation to an array
      allPartyObj.push(
          {committeeID:`${donationObj.results[i].committee.committee_id}`, party:`${donationObj.results[i].committee.party}`}
      );
      if (donationObj.results[i].committee.party === 'DEM') {
          partyCount.dem++;
      }
      else if (donationObj.results[i].committee.party === 'REP') {
          partyCount.rep++;
          }
      else {
          partyCount.ind++;
      }
    }
  }
  //console.log(allPartyObj)
  console.log(partyCount)


  
  let pacsFound = _.countBy(pacIDs) //reduce PACs found and return the count of each
  //turn pacsFound into an Array of objects
  console.log(pacsFound)
  allFoundPacIDs = _.countBy(pacIDs) // store a global variable of all PACs to avoid searching for them again
  pacArr = Object.keys(pacsFound).map(data => [data, pacsFound[data]]);

  //loop though each PAC found and analyze their spend by recipient
  for (let i = 0; i < pacArr.length; i++) {
    //let pacArr[i].results = fetchPacDonations(createPacSearchURL(pacArr[i][0]));
    fetchPacDonations(createPacSearchURL(pacArr[i][0]));
    //checkComplete();
  }

  /*
  let completed = 0;
  function checkComplete(){
    completed++
    if(completed >= pacArr.length){
      // now do the step that fetchPacDonations was doing, but pass the array
      // every step returns back to this initial function
    }
  }
  */


  //NEED TO WAIT FOR PAC ANALYSIS TO COMPLETE OR THIS IS INCORRECT
  //console.log(`party count returned after loop through PAC donations`) 
  //console.log(partyCount)
  
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
            collectPACDonations(responseJson);
            
        })
        .catch(function(err) {
            $('#js-error-message').text(`Something went wrong: ${err.message}`)
        })
}




function loopThroughPacs(pacsArr) {
  console.log('loopThroughPacs ran');
  
  for (let i = 0; i < Object.keys(pacs).length; i++) {
    //featch all donations a pac made and also pass in the PAC id
    fetchPacDonations(createPacSearchURL(Object.keys(pacs)[i]));
    console.log(`fetched PAC ${Object.keys(pacs)[i]}`)
  } 
}

function createCommitteSearchURL(committeeID) {
    console.log('createCommitteSearchURL ran');
    const param = {
        api_key: apiKEY2,
        per_page: 100,
        page: currentPage
    }

    const newQueryString = formQueryParams(param);
    searchURL = `${committeeSearchURL}${committeeID}/schedules/schedule_b/by_recipient_id/?${newQueryString}`
    //hard coded ID for testing
    //searchURL = `${committeeSearchURL}C00632133/schedules/schedule_b/by_recipient_id/?${newQueryString}`
    console.log(searchURL);
    return searchURL;
}


function fetchBulkIds(url) {
  console.log('fetchBulkIds ran');
  console.log(url)
 
  fetch(url)
  .then(function(response) {
      console.log(response.statusText);
      if (response.ok) {
          return response.json();
      }
      throw new Error(response.statusText);
  })
  .then(function(responseJson) {
      //analyzePacParty(responseJson)
      combineDataWithDonations(responseJson, donationsByID);
      
  })
  .catch(function(err) {
      $('#js-error-message').text(`Something went wrong: ${err.message}`)
  })
}

function fetchPacDonations(url,cb) {
  console.log('fetchPacDonations ran')
  fetch(url)
      .then(function(response) {
          console.log(response.statusText);
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
      })
      .then(function(responseJson) {
          collectPacDonations(responseJson);
          
      })
      .catch(function(err) {
          $('#js-error-message').text(`Something went wrong: ${err.message}`)
      })
}

//Moved this function into the fetchPacDonations (without pagination) 
//create dataset of who a PAC has donated to by ID and amount
function collectPacDonations(recipentsObj) {
  console.log('collectPacDonations ran');
  let resultsData = [];
  //loop to move amount found in memo line to total amount value
  for(let i = 0; i < recipentsObj.results.length; i++) {
    if (recipentsObj.results[i].memo_total != 0) {
      recipentsObj.results[i].total = recipentsObj.results[i].memo_total
    }
    resultsData.push({
        recipient_id:`${recipentsObj.results[i].recipient_id}`, 
        totalAmt:`${recipentsObj.results[i].total}`
        }
    );
  }


  
  //COMMENTED OUT PAGINATION FOR NOW
  /*
  // get the next page of data if the currect page is less than the total pages
  if(currentPage < recipentsObj.pagination.pages){

    // update HTML to display loading progress 
    //$('.progress').text(`Loading (${Math.floor((currentPage/recipentsObj.pagination.pages)*100)}%)`); 
    console.log(currentPage)
    //fetches more donation data
    fetchCommittePacRecipients(createCommitteSearchURL(recipentsObj.results[0].committee_id)); 
    currentPage++;  
  }
  // if there's no more pages to fetch update the HTML
  else { 
    console.log(`Total pages process was ${currentPage}`);    
    currentPage = 1;
    // display nothing for the progress status
    //$('.progress').text('');
    // display the total contributions amount
    //$('.data_results h2').text(`DEMS: ${partyCount.dem} REP: ${partyCount.rep}`); 
  }
  */
  
  
  //send collected recipients out for a bulk search for their info
  let allPacDonations = reduceDownDonationsByID(resultsData);
  let totalDonationsToCheck = allPacDonations.length
  console.log(`TOTAL DONATIONS TO CHECK IS: ${totalDonationsToCheck}`)
  let pacsOf100 = []
  if (totalDonationsToCheck > 99) {
    for (let i = 0; i < totalDonationsToCheck; i++) {
        pacsOf100.push(allPacDonations[i])
        if (pacsOf100.length === 100) {
            bulkIdQueryString(pacsOf100);
            pacsOf100 = []
        }
    }
    //console.log(`pacsOf100 has ${pacsOf100.length} donations to check`)
    //totalDonationsToCheck -= 100
    //console.log(`about to search ${pacsOf100.length} PACs using the bulk search`)
    
  }
  console.log(`about to search ${totalDonationsToCheck} PACs using the bulk search`)
  console.log('here')
  if (pacsOf100.length != 0) {
    return bulkIdQueryString(pacsOf100);
  }
  else {
    bulkIdQueryString(allPacDonations);
    }
}


//remove duplicate recipients but combine their totals
function reduceDownDonationsByID(arr) { //reduce down donations and add together
  console.log('reduceDownDonationsByID ran');

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

  //console.log(donationsByID)
  return donationsByID;
}

//remove duplicate parties found but combine their totals
function reduceDownDonationByParty(arr) { //reduce down donations and add together
  console.log('reduceDownDonationByParty ran');

  let holder = {};

  arr.forEach(function (d) {
      if(holder.hasOwnProperty(d.party)) {
        holder[d.party] = holder[d.party] + Number(d.total);
      } else {
        //console.log('here');
        //console.log(holder)
        holder[d.party] = Number(d.total);
      }
  });

  //console.log(holder[d.recipient_id]);
  let obj2 = [];

  for(let prop in holder) {
      obj2.push({party: prop, totalAmt: holder[prop]});   
  }
  return obj2;
}


//create bulk ID query
function bulkIdQueryString(committeeArr) {
    console.log('bulkIdQueryString ran');
    let pacString = '';
    for (let i = 0; i < committeeArr.length; i++) {
        pacString += `&committee_id=${committeeArr[i].recipient_id}`
    };

    createBulkIdSearchURL(pacString);
}

//create bulk URL string
function createBulkIdSearchURL(bulkCommitteeString) {
    console.log('createBulkIdSearchURL ran');
    //console.log(`current page is ${currentPage}`)
    const param = {
        api_key: apiKEY2,
        per_page: 100,
        page: currentPage
    }

    const newQueryString = formQueryParams(param);
    let searchURL = `${bulkCommitteSearchURL}${newQueryString}${bulkCommitteeString}`
    fetchBulkIds(searchURL)
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



//create single PAC search url 
function createPacSearchURL(committeeID) {
    console.log('createPacSearchURL ran');
    const param = {
        api_key: apiKEY2,
        per_page: 100,
        page: currentPage
    }

    const newQueryString = formQueryParams(param);
    searchURL = `${committeeSearchURL}${committeeID}/schedules/schedule_b/by_recipient_id/?${newQueryString}`
    //hard coded ID for testing
    //searchURL = `${committeeSearchURL}C00632133/schedules/schedule_b/by_recipient_id/?${newQueryString}`
    //console.log(searchURL);
    return searchURL;
}


function formQueryParams(obj) {
    console.log('formQueryParams ran');
    const queryParams = Object.keys(obj).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
    );
    return(queryParams.join('&'));
}

//Function takes the recipient data fetched and combines it with the total amount that was donated
function combineDataWithDonations(arr1, arr2) {
  console.log('combineDataWithDonations ran');
  let comboArr = []; //Full recipient data with donation amount
  let comboArrMin = []; // Extracted from comboArr just the party, ID, and amount
  let pacsOfPacs = []; // Array of PACs found with ID and amount

  arr1.results.forEach((itm, i) => {
  comboArr.push(Object.assign({}, itm, arr2[i]));
  });

  for (let i = 0; i < comboArr.length; i++) {
    comboArrMin.push( {
      party: comboArr[i].party,
      committee_id: comboArr[i].committee_id,
      total: comboArr[i].totalAmt
    })
  }
  
  //reduce down to check total donations across all potential parties


  pacsOfPacs = getPacsFromPacs(comboArrMin)
  //loopThroughPacsFromPacs(pacsOfPacs)

  let pacDonations = reduceDownDonationByParty(comboArrMin)
  console.log(pacDonations)
  determinePacAffiliation(pacDonations)


}



function determinePacAffiliation(arr) {
  console.log('determinePacAffiliation ran');

  let max = arr.reduce((prev, current) => (prev.totalAmt > current.totalAmt) ? prev : current)
  if (max.totalAmt < 0 || max.party === 'null') {
    finishDataProcessing('N/A')
  }
  finishDataProcessing(max.party)
}

function getPacsFromPacs(arr) {
  console.log('getPacsFromPacs ran')
  let pacsOnlyArr = []
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].party === null) {
      pacsOnlyArr.push(arr[i])
    }
  }
  return pacsOnlyArr
}

//I've commented out the line below that results in an endless loop continues to ping the API looking for more and more PACs
function loopThroughPacsFromPacs(pacsArr) {
  console.log('loopThroughPacsFromPacs ran');

  for (let i = 0; i < pacsArr.length; i++) {

    //featch all donations a pac made and also pass in the PAC id
    //fetchPacDonations(createPacSearchURL(pacsArr[i].committee_id)); // <<-- This results in an infinite loop while search for more and more PACs
    console.log(`fetched PAC ${pacsArr[i].committee_id}`)
  } 
}


function analyzePacParty(bulkCommittees) {
    console.log('analyzePacParty ran')
    console.log(bulkCommittees)

    for (let i = 0; i < bulkCommittees.results.length; i++) {
        if (bulkCommittees.results[i].party === 'DEM') {
          pacDonations.dem++;
        }
        else if (bulkCommittees.results[i].party === 'REP') {
          pacDonations.rep++;
        }
        else if (bulkCommittees.results[i].party === 'null') {
          pacDonations.pac++;
        }
        else {
          pacDonations.ind++;
        }
    }
    //console.log(pacDonations)
    determinePacParty(pacDonations)
}

function determinePacParty(pacDonationsObj) {
  //need to also add up donation amounts
  console.log('determinePacParty ran');
  if (pacDonationsObj.dem > pacDonationsObj.rep && pacDonationsObj.dem > pacDonationsObj.ind) {
    partyCount.dem = partyCount.dem + pacArr[pacArrNum][1];
    console.log(`PAC ${pacArr[pacArrNum][0]} is Democratic based on who they donate to!}`)
    console.log(partyCount)
    pacArrNum++;
  }
  else if (pacDonationsObj.rep > pacDonationsObj.dem && pacDonationsObj.ind) {
    partyCount.rep = partyCount.rep + pacArr[pacArrNum][1];
    console.log(`PAC ${pacArr[pacArrNum][0]} is Republican based on who they donate to!}`)
    console.log(partyCount)
    pacArrNum++;
  }
  else {
    partyCount.ind = partyCount.ind + pacArr[pacArrNum][1];
    console.log(`PAC ${pacArr[pacArrNum][0]} is Independant based on who they donate to!}`)
    console.log(partyCount)
    pacArrNum++;
  }
}

function finishDataProcessing(party) {
  console.log('finishDataProcessing ran');
  console.log(`The party affiliation of PAC ID: ${pacArr[trackPac][0]} is ${party}`);
  if (pacArr.length > trackPac) {
    if (party === 'DEM') {
      partyCount.dem += pacArr[trackPac][1];
      partyCount.pac -= pacArr[trackPac][1];
    }
    else if (party === 'REP') {
       partyCount.rep += pacArr[trackPac][1];
       partyCount.pac -= pacArr[trackPac][1];
    }
    else if (party != 'N/A'){
      partyCount.other = pacArr[trackPac][1];
      partyCount.pac -= pacArr[trackPac][1];
    }
    else {
      console.log(`The party affliation of PAC ID: ${pacArr[trackPac][0]} could not be determined`)
    }
    trackPac++
  }
  console.log(partyCount)
}

//fetchPacDonations(createPacSearchURL(pacID));
//collectPartyByDonation(empSearch);

//$(watchForm);

fetchInitialData(createDonationSearchURL('Netflix', 2018, 'NY'))


