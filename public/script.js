// we want to make a request to our server, asking the server to get us a url to a checkout page. we will give the server the id, the count of the product. It will get the pricing information from the server and it will use all this information and give us a unique url that we can use to redirect our user to checkout page. 
const button = document.querySelector('button');
button.addEventListener('click', () => {
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: [    
                {id: 1, quantity: 3},
                {id: 2, quantity: 1},
            ]
        })
    }).then (res => {
        if(res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    }).then(({url}) => {
        window.location = url
    }).catch(e => {
        console.log('helo')
        console.error(e.error)
    })
})