// GlobalNOC 2017

// Renders a resource in my_resource_list on index.html.
function renderMyResourceListElement(resource) {
    var table = document.getElementById('my_resource_list');
    var row   = table.insertRow(0);

    var id = resource.ip_block_id.toString();

    var name = row.insertCell(0);
    var addr = row.insertCell(1);

    name.innerHTML = resource.name;
    addr.innerHTML = resource.addr_str;

    row.addEventListener('click', function(e) {
        window.location.href = basePath + 'resource/index.html?resource_id=' + id;
    });
}

// Renders a resource in resource_list on index.html.
function renderResourceListElement(resource) {
    var table = document.getElementById('resource_list');
    var row   = table.insertRow(0);

    var id = resource.ip_block_id.toString();

    var type = row.insertCell(0);
    var name = row.insertCell(1);
    var addr = row.insertCell(2);
    var ownr = row.insertCell(3);
    var location = row.insertCell(4);

    type.innerHTML = resource.role_name;
    name.innerHTML = resource.name;
    addr.innerHTML = resource.addr_str;
    ownr.innerHTML = resource.organization_name;
    location.innerHTML = resource.country_name;

    row.addEventListener('click', function(e) {
        window.location.href = basePath + 'resource/index.html?resource_id=' + id;
    });
}

// Renders events as list items under resource_event_list on
// resource/index.html
function renderResourceEventListElement(event) {
    var eventText = document.createElement('span');
    eventText.innerHTML = '<b>' + event.date + '</b> - ' + event.message;

    var entry = document.createElement('li');
    entry.setAttribute('class', 'list-group-item');
    entry.appendChild(eventText);

    var listGroup = document.getElementById('resource_event_list');
    listGroup.appendChild(entry);
}

// Renders a resource in resource_list on index.html.
function renderResourceListSelectableElement(resource) {
    var table = document.getElementById('resource_list');
    var row   = table.insertRow(0);

    var id = resource.ip_block_id.toString();

    var type = row.insertCell(0);
    var name = row.insertCell(1);
    var addr = row.insertCell(2);
    var ownr = row.insertCell(3);
    var location = row.insertCell(4);

    type.innerHTML = resource.role_name;
    name.innerHTML = resource.name;
    addr.innerHTML = resource.addr_str;
    ownr.innerHTML = resource.organization_name;
    location.innerHTML = resource.country_name;

    row.addEventListener('click', function(e) {
        addResourceListSelectableElement(resource);
    });
}

// Adds a resource to #selected_resource_list. An onClick event
// listener is added to remove the item from the list once
// selected. The `data-id` attribute on the table row is set to the id
// of resource.
function addResourceListSelectableElement(resource) {
    var table = document.getElementById('selected_resource_list');
    for (var i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[2].innerHTML === resource.addr_str) {
            return 1;
        }
    }

    var row   = table.insertRow(0);
    row.setAttribute('data-id', resource.ip_block_id);

    var type = row.insertCell(0);
    var name = row.insertCell(1);
    var addr = row.insertCell(2);
    var ownr = row.insertCell(3);
    var location = row.insertCell(4);

    type.innerHTML = resource.role_name;
    name.innerHTML = resource.name;
    addr.innerHTML = resource.addr_str;
    ownr.innerHTML = resource.organization_name;
    location.innerHTML = resource.country_name;

    row.addEventListener('click', function(e) {
        for (var i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[2].innerHTML === resource.addr_str) {
                table.deleteRow(i);
                return 1;
            }
        }
    });
}

function renderEmptyResourceList() {
    document.getElementById('resource_list').innerHTML = '';
}

// Renders the number of resources resource_list should contain.
function renderResourceCount(count) {
    var text = document.getElementById('resource_list_count');

    text.innerHTML = count.toString() + ' records found';
}

// Given a resource record, set the innerHTML of the elements
// identified by resource_name and resource_description.
function renderResourceHeader(resource) {
    var name = document.getElementById('resource_name');
    var desc = document.getElementById('resource_description');

    name.innerHTML = resource.name;
    desc.innerHTML = resource.description;
}

// Given a resouce record, set the innerHTML of the elements
// identified by resource_cidr, resource_country,
// resource_geolocation, resource_address, resource_organization, and
// resource_role.
function renderResourceRecord(resource) {
    var cidr = document.getElementById('resource_cidr');
    var country = document.getElementById('resource_country');
    var geolocation = document.getElementById('resource_geolocation');
    var organization = document.getElementById('resource_organization');
    var role = document.getElementById('resource_role');
    var link = document.getElementById('resource_edit_link');

    cidr.innerHTML = resource.addr_str;
    country.innerHTML = resource.country_name;

    if (resource.latitude == null || resource.longitude == null) {
        geolocation.innerHTML = 'Location is not available';
    } else {
        geolocation.innerHTML = resource.latitude.toString() + ' ' + resource.longitude.toString();
    }

    organization.innerHTML = resource.organization_name;
    role.innerHTML = resource.role_name;
    link.href = basePath + 'resource/edit.html?resource_id=' + resource.ip_block_id.toString();
}

var countries = {
      'AF' : 'Afghanistan',
      'AX' : 'Aland Islands',
      'AL' : 'Albania',
      'DZ' : 'Algeria',
      'AS' : 'American Samoa',
      'AD' : 'Andorra',
      'AO' : 'Angola',
      'AI' : 'Anguilla',
      'AQ' : 'Antarctica',
      'AG' : 'Antigua And Barbuda',
      'AR' : 'Argentina',
      'AM' : 'Armenia',
      'AW' : 'Aruba',
      'AU' : 'Australia',
      'AT' : 'Austria',
      'AZ' : 'Azerbaijan',
      'BS' : 'Bahamas',
      'BH' : 'Bahrain',
      'BD' : 'Bangladesh',
      'BB' : 'Barbados',
      'BY' : 'Belarus',
      'BE' : 'Belgium',
      'BZ' : 'Belize',
      'BJ' : 'Benin',
      'BM' : 'Bermuda',
      'BT' : 'Bhutan',
      'BO' : 'Bolivia',
      'BA' : 'Bosnia And Herzegovina',
      'BW' : 'Botswana',
      'BV' : 'Bouvet Island',
      'BR' : 'Brazil',
      'IO' : 'British Indian Ocean Territory',
      'BN' : 'Brunei Darussalam',
      'BG' : 'Bulgaria',
      'BF' : 'Burkina Faso',
      'BI' : 'Burundi',
      'KH' : 'Cambodia',
      'CM' : 'Cameroon',
      'CA' : 'Canada',
      'CV' : 'Cape Verde',
      'KY' : 'Cayman Islands',
      'CF' : 'Central African Republic',
      'TD' : 'Chad',
      'CL' : 'Chile',
      'CN' : 'China',
      'CX' : 'Christmas Island',
      'CC' : 'Cocos (Keeling) Islands',
      'CO' : 'Colombia',
      'KM' : 'Comoros',
      'CG' : 'Congo',
      'CD' : 'Congo, Democratic Republic',
      'CK' : 'Cook Islands',
      'CR' : 'Costa Rica',
      'CI' : 'Cote D\'Ivoire',
      'HR' : 'Croatia',
      'CU' : 'Cuba',
      'CY' : 'Cyprus',
      'CZ' : 'Czech Republic',
      'DK' : 'Denmark',
      'DJ' : 'Djibouti',
      'DM' : 'Dominica',
      'DO' : 'Dominican Republic',
      'EC' : 'Ecuador',
      'EG' : 'Egypt',
      'SV' : 'El Salvador',
      'GQ' : 'Equatorial Guinea',
      'ER' : 'Eritrea',
      'EE' : 'Estonia',
      'ET' : 'Ethiopia',
      'FK' : 'Falkland Islands (Malvinas)',
      'FO' : 'Faroe Islands',
      'FJ' : 'Fiji',
      'FI' : 'Finland',
      'FR' : 'France',
      'GF' : 'French Guiana',
      'PF' : 'French Polynesia',
      'TF' : 'French Southern Territories',
      'GA' : 'Gabon',
      'GM' : 'Gambia',
      'GE' : 'Georgia',
      'DE' : 'Germany',
      'GH' : 'Ghana',
      'GI' : 'Gibraltar',
      'GR' : 'Greece',
      'GL' : 'Greenland',
      'GD' : 'Grenada',
      'GP' : 'Guadeloupe',
      'GU' : 'Guam',
      'GT' : 'Guatemala',
      'GG' : 'Guernsey',
      'GN' : 'Guinea',
      'GW' : 'Guinea-Bissau',
      'GY' : 'Guyana',
      'HT' : 'Haiti',
      'HM' : 'Heard Island & Mcdonald Islands',
      'VA' : 'Holy See (Vatican City State)',
      'HN' : 'Honduras',
      'HK' : 'Hong Kong',
      'HU' : 'Hungary',
      'IS' : 'Iceland',
      'IN' : 'India',
      'ID' : 'Indonesia',
      'IR' : 'Iran, Islamic Republic Of',
      'IQ' : 'Iraq',
      'IE' : 'Ireland',
      'IM' : 'Isle Of Man',
      'IL' : 'Israel',
      'IT' : 'Italy',
      'JM' : 'Jamaica',
      'JP' : 'Japan',
      'JE' : 'Jersey',
      'JO' : 'Jordan',
      'KZ' : 'Kazakhstan',
      'KE' : 'Kenya',
      'KI' : 'Kiribati',
      'KR' : 'Korea',
      'KW' : 'Kuwait',
      'KG' : 'Kyrgyzstan',
      'LA' : 'Lao People\'s Democratic Republic',
      'LV' : 'Latvia',
      'LB' : 'Lebanon',
      'LS' : 'Lesotho',
      'LR' : 'Liberia',
      'LY' : 'Libyan Arab Jamahiriya',
      'LI' : 'Liechtenstein',
      'LT' : 'Lithuania',
      'LU' : 'Luxembourg',
      'MO' : 'Macao',
      'MK' : 'Macedonia',
      'MG' : 'Madagascar',
      'MW' : 'Malawi',
      'MY' : 'Malaysia',
      'MV' : 'Maldives',
      'ML' : 'Mali',
      'MT' : 'Malta',
      'MH' : 'Marshall Islands',
      'MQ' : 'Martinique',
      'MR' : 'Mauritania',
      'MU' : 'Mauritius',
      'YT' : 'Mayotte',
      'MX' : 'Mexico',
      'FM' : 'Micronesia, Federated States Of',
      'MD' : 'Moldova',
      'MC' : 'Monaco',
      'MN' : 'Mongolia',
      'ME' : 'Montenegro',
      'MS' : 'Montserrat',
      'MA' : 'Morocco',
      'MZ' : 'Mozambique',
      'MM' : 'Myanmar',
      'NA' : 'Namibia',
      'NR' : 'Nauru',
      'NP' : 'Nepal',
      'NL' : 'Netherlands',
      'AN' : 'Netherlands Antilles',
      'NC' : 'New Caledonia',
      'NZ' : 'New Zealand',
      'NI' : 'Nicaragua',
      'NE' : 'Niger',
      'NG' : 'Nigeria',
      'NU' : 'Niue',
      'NF' : 'Norfolk Island',
      'MP' : 'Northern Mariana Islands',
      'NO' : 'Norway',
      'OM' : 'Oman',
      'PK' : 'Pakistan',
      'PW' : 'Palau',
      'PS' : 'Palestinian Territory, Occupied',
      'PA' : 'Panama',
      'PG' : 'Papua New Guinea',
      'PY' : 'Paraguay',
      'PE' : 'Peru',
      'PH' : 'Philippines',
      'PN' : 'Pitcairn',
      'PL' : 'Poland',
      'PT' : 'Portugal',
      'PR' : 'Puerto Rico',
      'QA' : 'Qatar',
      'RE' : 'Reunion',
      'RO' : 'Romania',
      'RU' : 'Russian Federation',
      'RW' : 'Rwanda',
      'BL' : 'Saint Barthelemy',
      'SH' : 'Saint Helena',
      'KN' : 'Saint Kitts And Nevis',
      'LC' : 'Saint Lucia',
      'MF' : 'Saint Martin',
      'PM' : 'Saint Pierre And Miquelon',
      'VC' : 'Saint Vincent And Grenadines',
      'WS' : 'Samoa',
      'SM' : 'San Marino',
      'ST' : 'Sao Tome And Principe',
      'SA' : 'Saudi Arabia',
      'SN' : 'Senegal',
      'RS' : 'Serbia',
      'SC' : 'Seychelles',
      'SL' : 'Sierra Leone',
      'SG' : 'Singapore',
      'SK' : 'Slovakia',
      'SI' : 'Slovenia',
      'SB' : 'Solomon Islands',
      'SO' : 'Somalia',
      'ZA' : 'South Africa',
      'GS' : 'South Georgia And Sandwich Isl.',
      'ES' : 'Spain',
      'LK' : 'Sri Lanka',
      'SD' : 'Sudan',
      'SR' : 'Suriname',
      'SJ' : 'Svalbard And Jan Mayen',
      'SZ' : 'Swaziland',
      'SE' : 'Sweden',
      'CH' : 'Switzerland',
      'SY' : 'Syrian Arab Republic',
      'TW' : 'Taiwan',
      'TJ' : 'Tajikistan',
      'TZ' : 'Tanzania',
      'TH' : 'Thailand',
      'TL' : 'Timor-Leste',
      'TG' : 'Togo',
      'TK' : 'Tokelau',
      'TO' : 'Tonga',
      'TT' : 'Trinidad And Tobago',
      'TN' : 'Tunisia',
      'TR' : 'Turkey',
      'TM' : 'Turkmenistan',
      'TC' : 'Turks And Caicos Islands',
      'TV' : 'Tuvalu',
      'UG' : 'Uganda',
      'UA' : 'Ukraine',
      'AE' : 'United Arab Emirates',
      'GB' : 'United Kingdom',
      'US' : 'United States',
      'UM' : 'United States Outlying Islands',
      'UY' : 'Uruguay',
      'UZ' : 'Uzbekistan',
      'VU' : 'Vanuatu',
      'VE' : 'Venezuela',
      'VN' : 'Viet Nam',
      'VG' : 'Virgin Islands, British',
      'VI' : 'Virgin Islands, U.S.',
      'WF' : 'Wallis And Futuna',
      'EH' : 'Western Sahara',
      'YE' : 'Yemen',
      'ZM' : 'Zambia',
      'ZW' : 'Zimbabwe'
  };

// Sets up submitCreateResource to be called when the create button on
// resource/new.html is pressed.
function setupCreateResourceForm() {
    var id = document.getElementById('resource_id');
    id.value = -1;

    var form = document.getElementById('create_resource_form');
    form.onsubmit = submitCreateOrUpdateResource;

    var cancel = document.getElementById('cancel_resource_submit');
    cancel.onclick = function() {
        window.location.href = basePath + 'index.html';
    };

    var country = document.getElementById('resource_country');
    for (var i in countries) {
        var opt = document.createElement('option');

        opt.innerHTML = countries[i];
        opt.setAttribute('value', i);
        country.appendChild(opt);
    }

    var cidr = document.getElementById('resource_cidr');
    cidr.addEventListener('input', function(event) {
        if (cidr.validity.patternMismatch) {
            cidr.setCustomValidity('Expects a comma separated list of IPv4 CIDR addresses');
        } else {
            cidr.setCustomValidity("");
        }
    });

  getRoles(function(roles) {
    var role = document.getElementById('resource_role');
    for (var i = 0; i < roles.length; i++) {
      var opt = document.createElement('option');

      opt.innerHTML = roles[i].name;
      opt.setAttribute('value', roles[i].role_id);
      role.appendChild(opt);
    }
  });

  getDisciplines(function(disciplines) {
    var discipline = document.getElementById('resource_discipline');
    for (var i = 0; i < disciplines.length; i++) {
      var opt = document.createElement('option');

      opt.innerHTML = disciplines[i].name;
      opt.setAttribute('value', disciplines[i].discipline_id);
      discipline.appendChild(opt);
    }
  });
}

// Sets up submitEditResource to be called when the edit button on
// resource/edit.html is pressed.
function setupEditResourceForm(resource) {
    var id = document.getElementById('resource_id');

    var name = document.getElementById('resource_name');
    var desc = document.getElementById('resource_description');
    var cidr = document.getElementById('resource_cidr');
    cidr.addEventListener('input', function(event) {
        if (cidr.validity.patternMismatch) {
            cidr.setCustomValidity('Expects a comma separated list of IPv4 CIDR addresses');
        } else {
            cidr.setCustomValidity("");
        }
    });

    var asn = document.getElementById('resource_asn');

    var org = document.getElementById('resource_organization');

    var country = document.getElementById('resource_country');

    for (var i in countries) {
        var opt = document.createElement('option');

        opt.innerHTML = countries[i];
        opt.setAttribute('value', i);
        if (resource.country_code == i) {
            console.log(i);
            opt.setAttribute('selected', '');
        }
        country.appendChild(opt);
    }

    getRoles(function(roles) {
        var role = document.getElementById('resource_role');
        for (var i = 0; i < roles.length; i++) {
            var opt = document.createElement('option');

            opt.innerHTML = roles[i].name;
            opt.setAttribute('value', roles[i].role_id);
            if (resource.role_id == roles[i].role_id) {
                opt.setAttribute('selected', '');
            }
            role.appendChild(opt);
        }
    });

    getDisciplines(function(disciplines) {
        var discipline = document.getElementById('resource_discipline');
        for (var i = 0; i < disciplines.length; i++) {
            var opt = document.createElement('option');

            opt.innerHTML = disciplines[i].name;
            opt.setAttribute('value', disciplines[i].discipline_id);
            if (resource.discipline_id == disciplines[i].discipline_id) {
                opt.setAttribute('selected', '');
            }
            discipline.appendChild(opt);
        }
    });

    var lat = document.getElementById('resource_latitude');
    var lon = document.getElementById('resource_longitude');

    var discipline = document.getElementById('resource_discipline');
    var role = document.getElementById('resource_role');

    id.value = resource.ip_block_id;
    name.value = resource.name;
    desc.value = resource.description;
    cidr.value = resource.addr_str;
    asn.value = resource.asn;
    org.value = resource.organization_id;
    lat.value = resource.latitude;
    lon.value = resource.longitude;

    var form = document.getElementById('create_resource_form');
    form.onsubmit = submitCreateOrUpdateResource;

    var del = document.getElementById('delete_resource_submit');
    del.onclick = function(e) {
        deleteResource(resource.ip_block_id);
    };

    var cancel = document.getElementById('cancel_resource_submit');
    cancel.onclick = function() {
        window.location.href = basePath + 'resource/index.html?resource_id=' + resource.ip_block_id;
    };
}

// Appends an project option to the drop down box with id
// resource_project.
function renderCreateResourceFormProjectOption(project) {
    var dropd = document.getElementById('resource_project');
    var opt = document.createElement('option');

    opt.innerHTML = project.name;
    opt.setAttribute('value', project.project_id);

    dropd.appendChild(opt);
}

// Appends an option to the resource_organization drop down box on
// resource/new.html.
function renderCreateResourceFormOrganizationOption(org) {
    var dropd = document.getElementById('resource_organization');
    var opt = document.createElement('option');

    opt.innerHTML = org.name;
    opt.setAttribute('value', org.organization_id);

    dropd.appendChild(opt);
}

// Gathers values from create_resource_form on resource/new.html when
// the create button is pressed. Passes the collected values to
// createResource after parameters are validated.
function submitCreateOrUpdateResource(e) {
    e.preventDefault();

    var form = document.getElementById('create_resource_form');
    console.log('submitCreateResource');
    console.log(e);
    console.log(form.elements);

    var name = form.elements['resource_name'].value;
    var desc = form.elements['resource_description'].value;
    var cidr = form.elements['resource_cidr'].value;

    var asn = form.elements['resource_asn'].value;

    var org_id = form.elements['resource_organization'].value;

    var country_code = form.elements['resource_country'].value;

    var lat = parseFloat(form.elements['resource_latitude'].value);
    var lon = parseFloat(form.elements['resource_longitude'].value);

    var discipline_id = form.elements['resource_discipline'].value;
    var role_id = form.elements['resource_role'].value;

    // Hidden field resource_id
    var resource_id = parseInt(form.elements['resource_id'].value);

    if (resource_id === -1) {
        console.log('Creating a new resource');
        createOrEditResource(null, name, desc, cidr, asn, org_id, country_code,
                       lat, lon, discipline_id, role_id);
    } else {
        console.log('Editing resource ' + resource_id.toString());
        createOrEditResource(resource_id, name, desc, cidr, asn, org_id, country_code,
                             lat, lon, discipline_id, role_id);
    }
}

// Calls onChange and passes the updated value of resource_cidr as the
// first argument.
function onResourceCIDRChange(onChange) {
    var cidr = document.getElementById('resource_cidr');
    cidr.addEventListener('change', function(e) {
        onChange(e.target.value);
    });
}
