const Services = (api, queryBody, requestType) => {
    let isFormData = false;

    if(queryBody){
        if(queryBody instanceof FormData){
            isFormData = true;
        }
    }

    const requestOptions = {
        method : requestType
        ? requestType.toUpperCase()
        : queryBody
        ? "POST"
        : "GET",
        headers: {
            //"Content-Type": 'application/json'
        },

        body: isFormData ? queryBody : JSON.stringify(queryBody),
    };

    if(!isFormData) {
        requestOptions.headers["Content-Type"] = "application/json";
    }

    return fetch (api, requestOptions)
        .then((response) => 
            response.json().then((response) => {
                return Promise.resolve(response)
            })
            )
            .catch((error) => {
                console.log("error for api",error);

                if(error.message === "Failed to Fetch"){
                    alert("Please check your Internet Connection")
                }else{
                    console.log("Sorry something went wrong");
                }
            });
    
};

export default Services;