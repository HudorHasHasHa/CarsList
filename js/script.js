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
// SELECTORS ENDS //

//*** GETTING INITIAL DATA ***//
let listData = {};
const listDataResponse = await axios.get('../initialModels.json')
  .catch(error => {
    console.log(error);
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
    console.log(error);
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
let counter = 0;
const tableItemsTemplate = (brand, model, year) => {
  counter++;
  // <td class="carCounter" scope="row">${counter}</td>
  return `
    <tr class="carWrapper" id="${counter}">
      <td valign="center" class="col-3 col-sm-3" >${brand}</td>
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
    "brand": `${brandVal}`,
    "model": `${modelVal}`,
    "year": `${yearVal}`
  }
  table.insertAdjacentHTML('beforeend', tableItemsTemplate(brandVal, modelVal, yearVal));
  console.log(listData);
  deleteItem();
  editItem();
})

sortBrand.addEventListener('click', function () {

})

// Delete Item //
const deleteItem = () => {
  // let carsIds = document.getElementsByClassName("carCounter")
  for (let button of deleteButtons) {
    button.addEventListener('click', function () {
      delete listData[this.parentNode.parentNode.parentNode.id];
      this.parentNode.parentNode.parentNode.remove();
      let items = document.getElementsByClassName("carCounter");
      for (let i = 0; i < items.length; i++) {
        items[i].innerHTML = i + 1;
      }
      counter = (Object.keys(listData)[parseInt(Object.keys(listData).length) - 1]);
      console.log(listData);
    });
  }
}

const modalBrands = document.getElementById("modalBrands");
const modalModels = document.getElementById("modalModels");
const modalYear = document.getElementById("modalYear");
const saveButton = document.getElementById("saveButton");
let modal = (document.getElementById("myModal"));
let model;
const editItem = () => {
  for (let button of editButtons) {
    button.addEventListener('click', function () {
      modal.style.display = "block";
      modal.style.opacity = "1";

      // //sending this button parrents data into edit modal

      // modalContent.innerHTML = '';
      // modalContent.insertAdjacentHTML('beforeend', editTemplate());
      let brand = this.parentNode.parentNode.parentNode.children[0].innerHTML;
      model = this.parentNode.parentNode.parentNode.children[1].innerHTML;
      let year = this.parentNode.parentNode.parentNode.children[2].innerHTML;
      console.log(this.parentNode.parentNode.parentNode.id);

      for (let car in cars) {
        modalBrands.insertAdjacentHTML('beforeend', brandsTemplate(cars[car].brand));
        const setdefault = new Event("change");
        if ((cars[car].brand).toLowerCase() === brand.toLowerCase()) {
          modalBrands.value = brand;
          modalYear.value = year;
          modalYear.parentNode.parentNode.parentNode.id = this.parentNode.parentNode.parentNode.id;
        }
        modalBrands.dispatchEvent(setdefault);
      }
    });
  }
}
const saveItem = () => {
  saveButton.addEventListener('click', function (event) {
    event.preventDefault();
    // console.log(modalYear.parentNode.parentNode.parentNode.id);
    let currentTable = table.children;
    //getting edited element
    for (let element of currentTable) {
      if (element.id === modalYear.parentNode.parentNode.parentNode.id) {
        //changing item appeareance
        // element.children[0].innerHTML = modalBrands.value
        // element.children[1].innerHTML = modalModels.value
        // element.children[2].innerHTML = modalYear.value
        //
        listData[`${element.id}`] = {
          "brand": `${modalBrands.value}`,
          "model": `${modalModels.value}`,
          "year": `${modalYear.value}`
        };
        console.log(listData);
        reloadList(listData);
        modal.style.display = "none";
      }
    }
  });
}

modalBrands.addEventListener('change', function () {
  for (let car in cars) {
    if (modalBrands.value == cars[car].brand) {
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

const sortAlphabetically = (list, prop) => {
  let orderedList = [];
  for (let item in list) {
    orderedList.push(list[item]);
  }
  orderedList.sort(getSortOrder(`${prop}`));
  reloadList(orderedList);
}

sortBrand.addEventListener('click', function (event) {
  event.preventDefault();
  sortAlphabetically(listData, "brand");
})

sortModel.addEventListener('click', function (event) {
  event.preventDefault();
  sortAlphabetically(listData, "model");
})

sortYear.addEventListener('change', function (event) {
  event.preventDefault();
  if (sortYear.value === "old") {
    let orderedList = [];
    for (let item in listData) {
      orderedList.push(listData[item]);
    }
    orderedList.sort(getSortOrder(`year`));
    reloadList(orderedList);
  } else if (sortYear.value === "new") {
    let orderedList = [];
    for (let item in listData) {
      orderedList.push(listData[item]);
    }
    orderedList.sort(getReverseSortOrder(`year`));
    reloadList(orderedList);
  }
});


console.log(listData);
// Reload list
const reloadList = (list) => {
  console.log(list);
  counter = 0;
  table.innerHTML = '';
  for (let item in list) {
    console.log();
    table.insertAdjacentHTML('beforeend', tableItemsTemplate(list[item].brand, list[item].model, list[item].year));
  }
  deleteItem();
  editItem();
}

// APP INIT
const appInit = () => {
  // Render default cars
  for (let item in listData) {
    table.insertAdjacentHTML('beforeend', tableItemsTemplate(listData[item].brand, listData[item].model, listData[item].year))
  }
  // Render brands options
  for (let car in cars) {
    dropdownBrands.insertAdjacentHTML('beforeend', brandsTemplate(cars[car].brand));
  }
  // Setting dropdownModels content to default selected brands option :)
  const setDefaultModels = new Event("change");
  yearTemplate();
  deleteItem();
  editItem();
  saveItem();
  dropdownBrands.dispatchEvent(setDefaultModels);
}
appInit();