const users = {};

// Helper: send a JSON body with a status code
const respondJSON = (request,response,status,object) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    response.writeHead(status,headers);
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request,response,status) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    response.writeHead(status,headers);
    response.end();
};

const getUsers = (request,response) => {
    const responseJSON = {
        users,
    };

    respondJSON(request,response,200,responseJSON);
};

const getUsersMeta = (request,response) => {
    respondJSONMeta(request,response,200);
};

const notFound = (request,response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    respondJSON(request,response,404,responseJSON);
};

const notFoundMeta = (request,response) => {
    respondJSONMeta(request,response,404);
};

const addUser = (request,response) => {
    const { name,age } = request.body;

    if(!name || !age) {
        const responseJSON = {
            message: 'Name and age are both required.',
            id: 'missingParams',
        };

        return respondJSON(request,response,400,responseJSON);
    }

    let responseCode = 204;

    if(!users[name]) {
        responseCode = 201;
        users[name] = {};
    }

    users[name].name = name;
    users[name].age = age;

    if(responseCode ===201) {
        return respondJSON(request,response,201,users[name]);
    }

    return respondJSONMeta(request,response,204);
};

module.exports = {
    getUsers,
    getUsersMeta,
    notFound,
    notFoundMeta,
    addUser,
};