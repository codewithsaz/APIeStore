var apiKey = document.getElementById('apiText').value;
var totalPrice = 0;
var totalVal = document.getElementById("totalVal");
var form = document.getElementById('addForm');
var prodList = document.getElementById('prodList');
var prodCard = document.getElementById('prodCard');

form.addEventListener('submit', storeProducts);
var updProdBtn = document.getElementById('updateBtn');


document.getElementById('apiBtn').addEventListener('click', () => {
    apiKey = document.getElementById('apiText').value
    window.location.reload();
})

window.addEventListener("DOMContentLoaded", () => {
    const response = getprod("https://crudcrud.com/api/" + apiKey + "/products")

    response.then((res) => {
        // console.log(res)
        for (var i = 0; i < res.data.length; i++) {

            addProductList(res.data[i]._id, res.data[i].infoObj)

        }
    }).catch((err) => window.alert("Crud API limit has been exeeded \n" + err));


})

// var delBtn = document.querySelector("#delete")
// var editBtn = document.getElementById('edit')
// console.log(delBtn);
// if (delBtn != null) {
//     console.log($(this).closest('li').attr('id'))
//     delBtn.addEventListener('click',);
//     editBtn.addEventListener('click', updateProduct);
// }

async function getprod(request) {
    const res = await axios.get(request)
    return res;
}
async function addProd(infoObj) {
    const res = await axios.post("https://crudcrud.com/api/" + apiKey + "/products", {
        infoObj
    })

    return res;
}
async function updProd(prodID, infoObj) {
    const res = axios.put("https://crudcrud.com/api/" + apiKey + "/products/" + prodID, {
        infoObj

    })

    return res;
}
async function delProd(prodID) {
    const res = await axios.delete("https://crudcrud.com/api/" + apiKey + "/products/" + prodID)

    return res;
}

function storeProducts(e) {
    e.preventDefault();

    var prodObj = {
        name: document.getElementById('prodName').value,
        sellingPrice: document.getElementById('sellingPrice').value,
        actualPrice: document.getElementById('actualPrice').value,
        imageURL: document.getElementById('imageURL').value,
    }

    let response = addProd(prodObj);
    response.then(addProductList("", prodObj)).catch((err) => window.alert("Not able to add product \n" + err));

}
function updateStore(prodID) {
    var prodObj = {
        name: document.getElementById('prodName').value,
        sellingPrice: document.getElementById('sellingPrice').value,
        actualPrice: document.getElementById('actualPrice').value,
        imageURL: document.getElementById('imageURL').value,
    }
    let response = updProd(prodID, prodObj);
    response.catch((err) => window.alert("not able to update product " + err));

    document.getElementById('updateBtn').style.visibility = "hidden";
    document.getElementById('submitBtn').style.display = 'initial';

    addProductList(prodID, prodObj)
}

function addProductList(prodID, receiveObj) {
    totalPrice += parseFloat(receiveObj.sellingPrice)
    totalVal.innerHTML = "Total value: " + totalPrice;

    if (document.getElementById('noAppDef')) {
        prodList.removeChild(document.getElementById('noAppDef'));
    }

    var newLi = document.createElement('li');
    var newCard = document.createElement('div');
    var newImg = document.createElement('img');

    var newCardBody = document.createElement('div');
    var newCardSPrice = document.createElement('h5');
    var newCardAPrice = document.createElement('h6');
    var newCardTitle = document.createElement('h5');
    var newCardBtnDel = document.createElement('button');
    var newCardBtnUpd = document.createElement('button');
    var newFact = document.createElement('p');

    newCardBtnDel.className = "btn btn-danger float-end ml-4";
    newCardBtnDel.id = "delete";
    newCardBtnDel.addEventListener('click', (event) => removeProduct(event, prodID, parseFloat(receiveObj.sellingPrice)));
    newCardBtnDel.appendChild(document.createTextNode("Delete"));

    newCardBtnUpd.className = "btn btn-info float-end ml-4";
    newCardBtnUpd.id = "update";
    newCardBtnUpd.addEventListener('click', (event) => updateProduct(event, prodID));
    newCardBtnUpd.appendChild(document.createTextNode("Update"));

    newCardAPrice.className = "card-subtitle mx-2 mb-2 text-body-secondary";
    newCardAPrice.style.textDecoration = "line-through";
    newCardAPrice.style.color = "red";
    newCardAPrice.appendChild(document.createTextNode("₹ " + receiveObj.actualPrice));

    newCardSPrice.className = "card-title";
    newCardSPrice.appendChild(document.createTextNode(`₹` + receiveObj.sellingPrice));

    newCardTitle.className = "card-title";
    newCardTitle.appendChild(document.createTextNode(receiveObj.name));

    newCardBody.className = "card-body "
    newCardBody.append(newCardSPrice, newCardAPrice, newCardTitle, newCardBtnDel, newCardBtnUpd);

    newImg.className = "card-img-top";
    newImg.src = receiveObj.imageURL;
    newImg.alt = "!! Error loading image !!"
    newImg.style.width = "auto";
    newImg.style.height = "215px";

    newCard.className = "prod card";
    newCard.id = "prodCard"
    newCard.style.width = "18rem";
    newCard.append(newImg, newCardBody);


    newLi.className = "list-unstyled col-auto mx-2 my-2";
    newLi.id = prodID
    newLi.appendChild(newCard);


    document.getElementById('prodList').appendChild(newLi);
    form.reset();

}

function removeProduct(e, prodID, price) {
    if (confirm('Want to delete ' + prodID + " ?")) {
        var li = $(e.target).parents().eq(2)[0]
        prodList.removeChild(li);

        totalPrice -= price;
        totalVal.innerHTML = "Total value: " + totalPrice;

        console.log("Deleted " + li.id)
        const response = delProd(prodID)
        response.catch((err) => window.alert("Not able to delete product \n" + err));
    }

}

function updateProduct(e, prodID) {
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('updateBtn').style.visibility = "visible";


    var li = $(e.target).parents().eq(2)[0]
    prodList.removeChild(li);
    console.log("Editing  " + li.id)

    const response = getprod("https://crudcrud.com/api/" + apiKey + "/products/" + prodID)
    response.then((response) => {

        editObj = response.data.infoObj
        console.log(editObj)
        totalPrice -= parseFloat(editObj.sellingPrice)
        totalVal.innerHTML = "Total value: " + totalPrice;
        document.getElementById('prodName').value = editObj.name
        document.getElementById('sellingPrice').value = editObj.sellingPrice
        document.getElementById('actualPrice').value = editObj.actualPrice
        document.getElementById('imageURL').value = editObj.imageURL

        updProdBtn.addEventListener('click', () => updateStore(prodID));

    }
    ).catch((err) => window.alert("Not able to get product \n" + err));

}



