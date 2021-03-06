// GlobalNOC 2017

// Gets a resource from the backend by resource_id.
function getResource(resourceId, onSuccess) {
    var url = baseUrl + 'api/index.cgi?method=get_ip_blocks' + '&ip_block_id=' + resourceId.toString();
    fetch(url, {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {

        response.json().then(function(json) {
            console.log(json);
            onSuccess(json.results[0]);
        });

    }).catch(function(err) {
        console.log(err);
    });
}

// Gets a list of resources from the backend.
function getResources(on_success) {
    fetch(baseUrl + 'api/index.cgi?method=get_ip_blocks', {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {

        response.json().then(function(json) {
            console.log(json);
            on_success(json.results);
        });

    }).catch(function(err) {
        console.log(err);
    });
}

// Gets a list of resources from the backend.
function getResourcesLike(text, on_success) {
    var url = baseUrl + 'api/index.cgi?method=get_ip_blocks';
    url += '&addr_str_like=' + text;
    fetch(url, {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {

        response.json().then(function(json) {
            console.log(json);
            on_success(json.results);
        });

    }).catch(function(err) {
        console.log(err);
    });
}

// Gets an resource's events from the backend by resourceId.
function getResourceEvents(resourceId, onSuccess) {
    var url = baseUrl + 'api/index.cgi?method=get_events' + '&ip_block_id=' + resourceId.toString();
    fetch(url, {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {
        response.json().then(function(json) {
            console.log(json);
            onSuccess(json.results);
        });
    }).catch(function(err) {
        console.log(err);
    });
}

// Gets a list of resources from the backend that are filtered by
// project_id.
function getResourcesByProjectId(projectId, onSuccess) {
    var url = baseUrl + 'api/index.cgi?method=get_ip_blocks' + '&project_id=' + projectId.toString();
    fetch(url, {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {

        response.json().then(function(json) {
            console.log(json);
            onSuccess(json.results);
        });

    }).catch(function(err) {
        console.log(err);
    });
}

// Gets a list of resources from the backend that are filtered by
// organization_id.
function getResourcesByOrganizationId(organizationId, onSuccess) {
    var url = baseUrl + 'api/index.cgi?method=get_ip_blocks' + '&organization_id=' + organizationId.toString();
    fetch(url, {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {

        response.json().then(function(json) {
            console.log(json);
            onSuccess(json.results);
        });

    }).catch(function(err) {
        console.log(err);
    });
}

// Creates a new resouce using the backend api. On success, we
// redirect to the assoicated resource/index.html page.
function createOrEditResource(id, name, desc, cidr, asn, org_id, country_code,
                              lat, lon, discipline_id, role_id) {
    var url = baseUrl;
    if (id === null) {
        url += 'api/admin/index.cgi?method=add_ip_blocks';
    } else {
        url += 'api/admin/index.cgi?method=update_ip_blocks';
        url += '&ip_block_id=' + id.toString();
    }

    url += '&name=' + name;
    url += '&description=' + desc;
    url += '&addr_str=' + cidr;
    url += '&asn=' + asn;
    url += '&organization_id=' + org_id;
    url += '&country_code=' + country_code;
    url += '&latitude='  + lat.toFixed(5);
    url += '&longitude='  + lon.toFixed(5);
    url += '&discipline_id='  + discipline_id;
    url += '&role_id='  + role_id;

    function successCallback(resource) {
        var id = resource.ip_block_id;
        window.location.href = basePath + 'resource/index.html?resource_id=' + id;
    };

    console.log(url);

    fetch(url, {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {

        response.json().then(function(json) {
            console.log(json);
            successCallback(json.results[0]);
        });

    }).catch(function(err) {
        console.log(err);
    });
}

function deleteResource(id) {
    var url = baseUrl + 'api/admin/index.cgi?method=delete_ip_blocks';
    url += '&ip_block_id=' + id.toString();

    function successCallback(resource) {
        window.location.href = basePath + 'index.html';
    };

    fetch(url, {
        method: 'get',
        credentials: 'include'
    }).then(function(response) {

        response.json().then(function(json) {
            console.log(json);
            successCallback(json.results[0]);
        });

    }).catch(function(err) {
        console.log(err);
    });
}
