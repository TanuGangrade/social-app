export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};


export const signout = (next) => {
    if (typeof window !== "undefined") localStorage.removeItem("jwt");//remove item with key of jwt, this is what we did in authenticate in signin.js
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {//http://localhost:8080
        method: "GET"
    })
        .then(response => {
            console.log("signout", response);
            return response.json();
        })
        .catch(err => console.log(err));
};
