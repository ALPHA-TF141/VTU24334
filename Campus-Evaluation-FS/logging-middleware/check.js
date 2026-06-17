const expiry = 1781674983;

console.log("Expiry:", new Date(expiry * 1000));
console.log("Current:", new Date());

if (Date.now() / 1000 > expiry) {
    console.log("Token Expired");
} else {
    console.log("Token Valid");
}