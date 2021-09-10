// SELECTORS START //
const table = document.getElementById("table");
const carWrapper = document.getElementsByClassName("carWrapper");
const dropdownBrands = document.getElementById("formBrands");
const dropdownModels = document.getElementById("formModels");
const submitButton = document.getElementById("submit");
const yearDropdown = document.getElementById("formYear");
const sortBrand = document.getElementById("sortBrand");
const sortModel = document.getElementById("sortModel");
const sortYear = document.getElementById("sortYear");
const deleteButtons = document.getElementsByClassName("delete-button");
const editButtons = document.getElementsByClassName("edit-button");
const closeModal = document.getElementById("btn-close");
const filterModels = document.getElementById("filterModels");
// SELECTORS ENDS //

function recreateNode(el, withChildren) {
  if (withChildren) {
    el.parentNode.replaceChild(el.cloneNode(true), el);
  }
  else {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }
}

//*** GETTING INITIAL DATA ***//
let listData = {};
const listDataResponse = await axios.get('../initialModels.json')
  .catch(error => {
    // console.log(error);
  })
listData = listDataResponse.data;

//*** GETTING DATA FOR DROPDOWNS ***//
let cars = [];
await fetch('../modelOptions.json')
  .then(response => response.json())
  .then(data => {
    return cars = data;
  })
  .catch(error => {
    // console.log(error);
  })
// I created arrowFunc to sort the responsed data, because I couldnt find sorted one in net :o
const getSortOrder = (prop) => {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}
const getReverseSortOrder = (prop) => {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return 1;
    }
    else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  }
}
// Sorting 
cars.sort(getSortOrder("brand"))

//*** TEMPLATES ***//
let uniqueId = Object.keys(listData).length;
let counter = 0;
const tableItemsTemplate = (uniqueId, brand, model, year) => {
  counter++;
  // <td class="carCounter" scope="row">${counter}</td>
  return `
    <tr class="carWrapper" id="${counter}">
      <td valign="center" class="col-3 col-sm-3" id="${uniqueId}">${brand}</td>
      <td valign="center" class="col-3 col-sm-3" >${model}</td>
      <td valign="center" class="col-3 col-sm-3" >${year}</td>
      <td valign="center" class=" col-3 col-sm-3 buttons-column"><div class="d-grid gap-2 d-md-block">
        <button type="button" class="col-sm-12 col-lg-5 btn btn-primary edit-button" data-toggle="modal" data-target="#exampleModal">Edit</button>
        <button type="button" class="col-sm-12 col-lg-5 btn btn-danger delete-button">Delete</button></div>
      </td>
    </tr>
  `;
};
// brands template
const brandsTemplate = (brand) => {
  return `
    <option value="${brand}">${brand}</option>
  `;
}
const yearTemplate = () => {
  let html = '';
  let htmlTemplate = (year) => `
    <option value="${year}">${year}</option>
  `;
  let currentYear = new Date().getFullYear()
  for (let i = 0; i < 100; i++) {
    html += htmlTemplate(currentYear - i);
  }
  yearDropdown.insertAdjacentHTML('beforeend', html);
  modalYear.insertAdjacentHTML('beforeend', html);
}

const dropdownModelsTemplate = (model) => {
  return `
    <option value="${model}">${model}</option>
  `;
}

//*** EVENT LISTENERS ***//
// Close modal
closeModal.addEventListener('click', function (event) {
  event.preventDefault();
  let modal = (document.getElementById("myModal"));
  modal.style.display = "none";
})

// Setting the dropdownModels content depending on which Brand is selected :)
dropdownBrands.addEventListener('change', function (event) {
  event.preventDefault();
  for (let car in cars) {
    if (dropdownBrands.value == cars[car].brand) {
      dropdownModels.innerHTML = '';
      for (let model in cars[car].models) {
        dropdownModels.insertAdjacentHTML('beforeend', dropdownModelsTemplate(cars[car].models[model]));
      }
    }
  }
})

submitButton.addEventListener('click', function (event) {
  event.preventDefault();
  let brandVal = dropdownBrands.value;
  let modelVal = dropdownModels.value;
  let yearVal = yearDropdown.value;
  listData[`${parseInt(counter) + 1}`] = {
    "id": ++uniqueId,
    "brand": `${brandVal}`,
    "model": `${modelVal}`,
    "year": `${yearVal}`
  }
  table.insertAdjacentHTML('beforeend', tableItemsTemplate(uniqueId, brandVal, modelVal, yearVal));
  console.log(listData);
  deleteItem();
  editItem();
  saveItem();
})

// Delete Item //
const deleteItem = () => {
  // let carsIds = document.getElementsByClassName("carCounter")
  for (let button of deleteButtons) {
    let mockList = [];
    button.addEventListener('click', function () {
      for(let item in listData){
        console.log(listData[item].id);
        console.log();
        if(parseInt(listData[item].id) === parseInt(button.parentNode.parentNode.parentNode.children[0].id)){
        // if(listData[item].brand === button.parentNode.parentNode.parentNode.children[0].innerHTML &&
        //   listData[item].brand.id === button.parentNode.parentNode.parentNode.id && 
        //   listData[item].model === button.parentNode.parentNode.parentNode.children[1].innerHTML&& 
        //   listData[item].year === button.parentNode.parentNode.parentNode.children[2].innerHTML){
            console.log("hello")
            delete listData[item];
          }
      }
      for(let el in listData){
        mockList.push(listData[el])
      }
      console.log(mockList);
      for (var member in listData) delete listData[member];
      for(let i = 1; i < mockList.length+1 ; i++){
        listData[i] = mockList[i-1];
      }
      console.log(listData);
      this.parentNode.parentNode.parentNode.remove();
      sortitems();
      // let items = document.getElementsByClassName("carCounter");
      // for (let i = 0; i < items.length; i++) {
      //   items[i].innerHTML = i + 1;
      //   console.log(items[i]);
      // }
      counter = (Object.keys(listData)[parseInt(Object.keys(listData).length) - 1]);
      // console.log(listData);
    });
  }
}
// Edit item / pushing this data into edit modal dropdowns
const modalBrands = document.getElementById("modalBrands");
const modalModels = document.getElementById("modalModels");
const modalYear = document.getElementById("modalYear");
const saveButton = document.getElementById("saveButton");
let modal = (document.getElementById("myModal"));
let model, brand, year;
const editItem = () => {
  for (let button of editButtons){
    recreateNode(button);
  }
  for (let button of editButtons) {
    button.addEventListener('click', function () {
      modal.style.display = "block";
      modal.style.opacity = "1";

      // //sending this button parrents data into edit modal

      // modalContent.innerHTML = '';
      // modalContent.insertAdjacentHTML('beforeend', editTemplate());
      console.log(this.parentNode.parentNode.parentNode.children[0].id);
      brand = this.parentNode.parentNode.parentNode.children[0].innerHTML;
      model = this.parentNode.parentNode.parentNode.children[1].innerHTML;
      year = this.parentNode.parentNode.parentNode.children[2].innerHTML;
      // console.log(this.parentNode.parentNode.parentNode.id);
      // console.log(brand, model, year)
      const setdefault = new Event("change");
      for (let car in cars) {
        modalBrands.insertAdjacentHTML('beforeend', brandsTemplate(cars[car].brand));
        modalBrands.value = brand;
      }
      modalBrands.value = brand;
      for(let car in cars){
        if ((cars[car].brand).toLowerCase() === brand.toLowerCase()) {
          // console.log(cars[car].brand);
          // console.log(brand);
          modalYear.value = year;
          modalYear.parentNode.parentNode.parentNode.id = this.parentNode.parentNode.parentNode.children[0].id;
        }
      }
      modalBrands.dispatchEvent(setdefault);
      modalBrands.value = brand;
    });
  }
}
// Save item fun
const saveItem = () => {
  saveButton.addEventListener('click', function (event) {
    event.preventDefault();
    let currentTable = table.children;
    //getting edited element
    for (let element of currentTable) {
      // console.log(element.children)
      console.log(element.children[0].id);
      console.log(modalYear.parentNode.parentNode.parentNode.id);
      if (element.children[0].id === modalYear.parentNode.parentNode.parentNode.id) {
        // console.log(modalYear.parentNode.parentNode.parentNode.id)
        //changing item appeareance
        // console.log(element.children[0].innerHTML, element.children[1].innerHTML, element.children[2].innerHTML);
        // console.log(listData);
        // element.children[0].innerHTML = modalBrands.value
        // element.children[1].innerHTML = modalModels.value
        // element.children[2].innerHTML = modalYear.value
        
        // console.log(listData);
          listData[parseInt(modalYear.parentNode.parentNode.parentNode.id)].brand=  `${modalBrands.value}`;
          listData[parseInt(modalYear.parentNode.parentNode.parentNode.id)].model= `${modalModels.value}`;
          listData[parseInt(modalYear.parentNode.parentNode.parentNode.id)].year= `${modalYear.value}`;
        
        console.log(element.children[0].innerHTML, element.children[1].innerHTML, element.children[2].innerHTML);
        console.log(listData);
        // console.log(listData);
        reloadList(listData);
        modal.style.display = "none";
        sortYear.value = "-";
      }
    }

    //reset filter value to avoid showing not fitted elements in filtered list
    //different option would be diptachEvent into filter eventListener but i wanted to differentiate these functions :)
    filterModels.value = "";
  });
}

modalBrands.addEventListener('change', function () {
  for (let car in cars) {
    if (modalBrands.value === cars[car].brand) {
      modalModels.innerHTML = '';
      for (let model in cars[car].models) {
        modalModels.insertAdjacentHTML('beforeend', dropdownModelsTemplate(cars[car].models[model]));
      }
      for (let item in cars[car].models) {
        if ((cars[car].models[item]).toLowerCase() === model.toLowerCase()) {
          modalModels.value = cars[car].models[item];
        }
      }
    }
  }
})
// Sort Aplhabetically fun for brands/models
const sortAlphabetically = (list, prop) => {
  let orderedList = [];
  let i = 1;
  for (let item in list) {
    orderedList.push(list[item]);
  }
  orderedList.sort(getSortOrder(`${prop}`));
  reloadList(orderedList);
}
const sortitems = () => {
  sortBrand.addEventListener('click', function (event) {
    sortAlphabetically(listData, "brand");
  })

  sortModel.addEventListener('click', function (event) {
    sortAlphabetically(listData, "model");
  })

  sortYear.addEventListener('change', function (event) {
    event.preventDefault();
    let orderedList = [];
    if (sortYear.value === "old") {
      for (let item in listData) {
        orderedList.push(listData[item]);
      }
      orderedList.sort(getSortOrder(`year`));
      for(let item in listData){
        listData[item] = orderedList[item-1];
      }
      reloadList(listData);
    } else if (sortYear.value === "new") {
      for (let item in listData) {
        orderedList.push(listData[item]);
      }
      orderedList.sort(getReverseSortOrder(`year`));
      for(let item in listData){
        listData[item] = orderedList[item-1];
      }
      reloadList(listData);
    }
  });
}
// Dynamically filter models
const filterModelsFunc = () => {
  filterModels.addEventListener('keyup', function(){
    let filteredModels=[];
    for(let item in listData){
      // I choosed startsWith(), but includes() is also an option here if we wanna see all models that contains certain phrase.
      if((listData[item].model).toLowerCase().startsWith(filterModels.value)){
        filteredModels.push(listData[item])
      }
    }
    let tableContent = table.children;
    for(let i=0; i<tableContent.length ; i++){
      if((tableContent[i].children[1].innerHTML).toLowerCase().startsWith(filterModels.value)){
        // console.log(tableContent[i])
        // console.log(tableContent[i].id);
        tableContent[i].style.display = "flex";
      }
      else if (!(tableContent[i].children[1].innerHTML).toLowerCase().startsWith(filterModels.value)){
        tableContent[i].style.display = "none";
      }
    }
  });
}

// Reload list
const reloadList = (list) => {
  counter = 0;
  table.innerHTML = '';
  let mockList = [];
  for(let el in list){
    mockList.push(list[el])
  }
  console.log(mockList);
  for (var member in list) delete list[member];
  for(let i = 1; i < mockList.length+1 ; i++){
    list[i] = mockList[i-1];
  }
  console.log(list);
  for (let item in list) {
    if(item>=1){
    table.insertAdjacentHTML('beforeend', tableItemsTemplate(list[item].id, list[item].brand, list[item].model, list[item].year));
    }
  }
  console.log(list);
  deleteItem();
  editItem();
}

// APP INIT
const appInit = () => {
  // Render default cars
  for (let item in listData) {
    table.insertAdjacentHTML('beforeend', tableItemsTemplate(listData[item].id, listData[item].brand, listData[item].model, listData[item].year))
  }
  // Render brands options
  for (let car in cars) {
    dropdownBrands.insertAdjacentHTML('beforeend', brandsTemplate(cars[car].brand));
  }
  // Setting dropdownModels content to default selected brands option :)
  const setDefaultModels = new Event("change");
  saveItem();
  yearTemplate();
  deleteItem();
  editItem();
  dropdownBrands.dispatchEvent(setDefaultModels);
  filterModelsFunc();
  sortitems();
}
appInit();