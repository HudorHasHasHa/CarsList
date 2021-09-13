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
const modalBrands = document.getElementById("modalBrands");
const modalModels = document.getElementById("modalModels");
const modalYear = document.getElementById("modalYear");
const saveButton = document.getElementById("saveButton");
const modal = (document.getElementById("myModal"));
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
  reloadOnChange(listData);
})

// Delete Item //
const deleteItem = () => {
  for (let button of deleteButtons) {
    button.addEventListener('click', function () {
      for (let item in listData) {
        if (parseInt(listData[item].id) === parseInt(button.parentNode.parentNode.parentNode.children[0].id)) {
          delete listData[item];
        }
      }

      // console.log(listData);
      // then deleting table row
      this.parentNode.parentNode.parentNode.remove();
      let items = document.getElementsByClassName("carCounter");
      for (let i = 0; i < items.length; i++) {
        items[i].innerHTML = i + 1;
        console.log(items[i]);
      }
      // setting counter to listdata length to prevent duplicating
      counter = (Object.keys(listData)[parseInt(Object.keys(listData).length) - 1]);
      reloadOnChange(listData);
    });
  }
}

const reloadOnChange = (list) => {
  let mockList = [];
  table.innerHTML = '';
  for (let el in list) {
    mockList.push(listData[el])
  }
  for (var member in list) delete list[member];
  for (let item in mockList) {
    list[parseInt((mockList[item].id))] = mockList[item];
  }
  for (let item in list) {
    if (item >= 1) {
      table.insertAdjacentHTML('beforeend', tableItemsTemplate(list[item].id, list[item].brand, list[item].model, list[item].year));
    }
  }
  for (let button of editButtons) {
    let old_element = button;
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
  }
  deleteItem();
  editItem();
  modalBrands.value = '';
}
// Edit item / pushing this data into edit modal dropdowns
let model, brand, year;
const editItem = () => {
  for (let button of editButtons) {
    button.addEventListener('click', function () {
      modal.style.display = "block";
      modal.style.opacity = "1";

      //sending this button parrents data into edit modal
      console.log(this.parentNode.parentNode.parentNode.children[0].id);
      brand = this.parentNode.parentNode.parentNode.children[0].innerHTML;
      model = this.parentNode.parentNode.parentNode.children[1].innerHTML;
      year = this.parentNode.parentNode.parentNode.children[2].innerHTML;
      //
      const setdefault = new Event("change");
      for (let car in cars) {
        modalBrands.insertAdjacentHTML('beforeend', brandsTemplate(cars[car].brand));
        modalBrands.value = '';
        modalBrands.value = this.parentNode.parentNode.parentNode.children[0].innerHTML;
      }
      for (let car in cars) {
        if ((cars[car].brand).toLowerCase() === brand.toLowerCase()) {
          modalYear.value = year;
          modalYear.parentNode.parentNode.parentNode.id = this.parentNode.parentNode.parentNode.children[0].id;
        }
      }
      modalBrands.dispatchEvent(setdefault);
    });
  }
}
// Save item fun
const saveItem = () => {
  saveButton.addEventListener('click', function (event) {
    event.preventDefault();
    let currentTable = table.children;
    //getting edited element
    for (let item in listData) {
      if (parseInt(listData[item].id) === parseInt(modalYear.parentNode.parentNode.parentNode.id)) {
        // changing this element data in listData
        listData[parseInt(listData[item].id)].brand = `${modalBrands.value}`;
        listData[parseInt(listData[item].id)].model = `${modalModels.value}`;
        listData[parseInt(listData[item].id)].year = `${modalYear.value}`;
        // reloading tableBody with updated list of items
        reloadOnChange(listData);
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

const sortItems = () => {
  sortBrand.addEventListener('click', function (event) {
    let items, itemsArr = [], itemsCopy;
    for (let item in table.children) {
      if (table.children[item].children) {
        items = table.children[item].children[0].innerHTML;
        itemsCopy = table.children[item].children[0].innerHTML;
        itemsArr.push(items);
        delete itemsCopy[items];
      }
      // console.log(items);
      // console.log(typeof itemsCopy);
    }

    itemsArr.sort(function (a, b) {
      return a == b
        ? 0
        : (a > b ? 1 : -1);
    });
    let array = [];
    let check = [];
    for (let element in table.children) {
      for (let item in itemsArr) {
        check.push(table.children[item].children[0].innerHTML)
        if (itemsArr[element] === table.children[item].children[0].innerHTML) {
          array.push(table.children[item]);
        }
      }
    }
    table.innerHTML = '';
    for (let item in array) {
      table.insertAdjacentElement('beforeend', array[item]);
    }

  })

  sortModel.addEventListener('click', function () {
    console.log(listData);
    let items, itemsArr = [], itemsCopy;
    for (let item in table.children) {
      if (table.children[item].children) {
        items = table.children[item].children[1].innerHTML;
        itemsCopy = table.children[item].children[1].innerHTML;
        itemsArr.push(items);
        delete itemsCopy[items];
      }
    }
    itemsArr.sort(function (a, b) {
      return a == b
        ? 0
        : (a > b ? 1 : -1);
    });
    let array = [];
    let check = [];
    for (let element in table.children) {
      for (let item in itemsArr) {
        check.push(table.children[item].children[1].innerHTML)
        if (itemsArr[element] === table.children[item].children[1].innerHTML) {
          array.push(table.children[item]);
        }
      }
    }
    table.innerHTML = '';
    for (let item in array) {
      table.insertAdjacentElement('beforeend', array[item]);
    }
  })

  sortYear.addEventListener('change', function (event) {
    event.preventDefault();
    let orderedList = [];
    let items, itemsArr = [], itemsCopy;
    for (let item in table.children) {
      if (table.children[item].children) {
        items = table.children[item].children[2].innerHTML;
        itemsCopy = table.children[item].children[2].innerHTML;
        itemsArr.push(items);
        delete itemsCopy[items];
      }
    }

    if (sortYear.value === "old") {
      itemsArr.sort(function (a, b) {
        return a == b
          ? 0
          : (a > b ? 1 : -1);
      });
    }

    else if (sortYear.value === "new") {
      itemsArr.sort(function (a, b) {
        return a == b
          ? 0
          : (a > b ? -1 : 1);
      });
    }
    let array = [];
    let check = [];
    for (let element in table.children) {
      for (let item in itemsArr) {
        check.push(table.children[item].children[2].innerHTML)
        if (itemsArr[element] === table.children[item].children[2].innerHTML) {
          array.push(table.children[item]);
        }
      }
    }
    table.innerHTML = '';
    for (let item in array) {
      table.insertAdjacentElement('beforeend', array[item]);
    }
  });
}
// Dynamically filter models
const filterModelsFunc = () => {
  filterModels.addEventListener('keyup', function () {
    let filteredModels = [];
    for (let item in listData) {
      // I choosed startsWith(), but includes() is also an option here if we wanna see all models that contains certain phrase.
      if ((listData[item].model).toLowerCase().startsWith(filterModels.value)) {
        filteredModels.push(listData[item])
      }
    }
    let tableContent = table.children;
    for (let i = 0; i < tableContent.length; i++) {
      if ((tableContent[i].children[1].innerHTML).toLowerCase().startsWith(filterModels.value)) {
        tableContent[i].style.display = "flex";
      }
      else if (!(tableContent[i].children[1].innerHTML).toLowerCase().startsWith(filterModels.value)) {
        tableContent[i].style.display = "none";
      }
    }
  });
}

document.onkeydown = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = (evt.key === "Escape" || evt.key === "Esc");
  } else {
    isEscape = (evt.keyCode === 27);
  }
  if (isEscape) {
    let modal = (document.getElementById("myModal"));
    modal.style.display = "none";
  }
};

// APP INIT
const appInit = () => {
  // Render default cars
  table.innerHTML = '';
  for (let item in listData) {
    table.insertAdjacentHTML('beforeend', tableItemsTemplate(listData[item].id, listData[item].brand, listData[item].model, listData[item].year))
  }
  // Render brands options
  for (let car in cars) {
    dropdownBrands.insertAdjacentHTML('beforeend', brandsTemplate(cars[car].brand));
  }
  // Setting dropdownModels content to default selected brands option :)
  const setDefaultModels = new Event("change");
  yearTemplate();
  deleteItem();
  dropdownBrands.dispatchEvent(setDefaultModels);
  filterModelsFunc();
  sortItems();
  editItem();
  saveItem();
}
appInit();