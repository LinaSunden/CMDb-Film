const cmdbUrl = "https://grupp6.dsvkurs.miun.se/api";

async function getApiKey(){
    const endpoint = "/keys/grupp7/46bc07e8-d9d7-4078-8516-e544d35e21e7";
    const response = await fetch(cmdbUrl + endpoint);
    const data = await response.json();
    return data.apiKey;
}

async function getUserAvatars(){
    try {
        const apiKey = await getApiKey();
        console.log(apiKey);
    } catch (error) {
        console.log(error);
    }
}

getUserAvatars();