const EMPLOYEES_CLONE = JSON.parse(JSON.stringify(EMPLOYEES)) // [...]
const employeeRender = document.querySelector(".content-employee__list");
function renderEmployees(employees) {
  let template = "";
  employees.forEach((employee) => {
    const nameEmployee = employee.name.trim().split(" ");

    let firstName = nameEmployee[nameEmployee.length - 1][0];
    if (Number(firstName)) {
      firstName = nameEmployee[nameEmployee.length - 2][0];
    }
    template += `<div class="content-employee__item">
        <div class="employ-item">
            <div class="employee-img">
                ${
                  employee.img
                    ? `<img src=${employee.img} alt="">`
                    : `<span class="employee-img_default">${firstName}</span>`
                }
                <p class="employee-img__connect">
                    <i class="fas fa-comments"></i>15
                    <i class="fas fa-users"></i>23
                </p>
            </div>
            <div class="employee-info">
                <p class="employee-info__name">${employee.name}</p>
                <ul class="employee-info__job">
                    <li>${employee.job}</li>
                </ul>
                <p class="employee-info__email">
                    <i class="fas fa-envelope"></i> ${employee.email}
                </p>
                <button class="employee-follow__btn">Follow</button>
            </div>
        </div>
    </div>`;
  });
  employeeRender.innerHTML = template;
}

let inputSearch = document.querySelector("#keywordSearch");
let form = document.querySelector(".form_search");

//pagination here
let employeeList = EMPLOYEES_CLONE;
const selectPerpage = document.querySelector('.select_perpage')

const current_html = document.querySelector(".page-number__value");
const total_html = document.querySelector(".page-number__limit");
let currentPage = 1;
let perPage = 40;
let totalPage = 0;
let perUser = [];

const getEmployeePerPage = (emp, cPage, pPage) => {
  const prevBtn = document.querySelector('button.btn-page__prev');
  const nextBtn = document.querySelector('button.btn-page__next');
  const searchError = document.querySelector('.main__search--error')
  employeeList = emp;
  if(emp.length < 1) {
    searchError.innerHTML = 'Không thấy kết quả bạn cần tìm! <i class="fas fa-sad-tear"></i>';
  } else {
    searchError.innerHTML = '';
  } 
  totalPage = emp.length / pPage;
  current_html.innerHTML =
    emp.length >= cPage * pPage
      ? `${(cPage - 1) * pPage + 1} - ${(cPage - 1) * pPage + pPage}`
      : `${(cPage - 1) * pPage + 1} - ${emp.length + (cPage - 1) * pPage}`;
  total_html.innerHTML = totalPage * pPage; //emp.length
  let results = emp.slice(
    (cPage - 1) * pPage, //start
    (cPage - 1) * pPage + pPage //end
  );
  if(cPage <= 1 && Math.ceil(totalPage)===1) {
    prevBtn.style = 'opacity: .5; cursor: not-allowed;'
    nextBtn.style = 'opacity: .5; cursor: not-allowed;'
  }
  else if(cPage === Math.ceil(totalPage)) {
    nextBtn.style = 'opacity: .5; cursor: not-allowed;'
    prevBtn.style = 'opacity: 1; cursor: pointer;'
  } else if(cPage <= 1) {
    prevBtn.style = 'opacity: .5; cursor: not-allowed;'
    nextBtn.style = 'opacity: 1; cursor: pointer;'
  } else {
    nextBtn.style = 'opacity: 1; cursor: pointer;'
    prevBtn.style = 'opacity: 1; cursor: pointer;'
  }

  return results;
};
perUser = getEmployeePerPage(EMPLOYEES_CLONE, currentPage, perPage);
renderEmployees(perUser);

// click next or prev button
const navigatePage = (typeButton) => {
  let isLast = currentPage >= totalPage && typeButton == "next";
  let isFirst = currentPage <= 1 && typeButton == "prev";
  if (isFirst || isLast) return;
  currentPage += typeButton === "next" ? 1 : -1;
  perUser = getEmployeePerPage(employeeList, currentPage, perPage);
  current_html.innerHTML =
    perUser.length >= currentPage * perPage
      ? `${(currentPage - 1) * perPage + 1} - ${(currentPage - 1) * perPage + perPage}`
      : `${(currentPage - 1) * perPage + 1} - ${perUser.length + (currentPage - 1) * perPage}`;
  renderEmployees(perUser);
};

//search here
const search__content = document.querySelector(".search__content");

inputSearch.addEventListener("keyup", function () {
  if (inputSearch.value) {
    search__content.style.display = "block";
  } else search__content.style.display = "none";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const nameSearch = inputSearch.value.trim().toLowerCase();
  const employees_search = EMPLOYEES_CLONE.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(nameSearch) ||
      (employee.email && employee.email.toLowerCase().includes(nameSearch)) ||
      employee.job.toLowerCase().includes(nameSearch)
    );
  });
  perUser = getEmployeePerPage(employees_search, (currentPage = 1), perPage);
  renderEmployees(perUser);
});
//search by name here
let searchByName = document.querySelector(".searchByName");
let searchByJob = document.querySelector(".searchByJob");
let searchByEmail = document.querySelector(".searchByEmail");

searchByName.addEventListener("click", function () {
  const nameSearch = inputSearch.value.trim().toLowerCase();
  const employees_search = EMPLOYEES_CLONE.filter((employee) => {
    return employee.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .includes(nameSearch) || employee.name.toLowerCase().includes(nameSearch);
  });
  search__content.style.display = "none";
  perUser = getEmployeePerPage(employees_search, (currentPage = 1), perPage);
  renderEmployees(perUser);
});

//search by job here
searchByJob.addEventListener("click", function () {
  const nameSearch = inputSearch.value.trim().toLowerCase();
  const employees_search = EMPLOYEES_CLONE.filter((employee) => {
    return employee.job.toLowerCase().includes(nameSearch);
  });
  search__content.style.display = "none";
  perUser = getEmployeePerPage(employees_search, (currentPage = 1), perPage);
  renderEmployees(perUser);
});

//sort name here
const btnSortText = document.querySelector(".btn__sort");
const sortByName = (order, element) => {
  let temp = employeeList.sort((a, b) => {
    let nameA = a.name.trim().split(" ");
    let nameB = b.name.trim().split(" ");
    let sortA = Number(nameA[nameA.length - 1])
      ? nameA[nameA.length - 2]
      : nameA[nameA.length - 1];
    let sortB = Number(nameB[nameB.length - 1])
      ? nameB[nameB.length - 2]
      : nameB[nameB.length - 1];
    return sortA.localeCompare(sortB) * order;
  });
  btnSortText.innerText = element.innerHTML;
  perUser = getEmployeePerPage(temp, currentPage = 1, perPage);
  renderEmployees(perUser);
};

//add employee here
const formAddEmployee = document.querySelector(".form__add");
const form__error = document.querySelector(".form__add--error");

const convertNonAccented = (str) => {
  const result = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
  return result;
};
const createNameEmail = (name) => {
  const nameEmployee = name.trim().split(" ");
  if (nameEmployee.length <= 1) {
    return convertNonAccented(`${nameEmployee[0]}`);
  }
  return convertNonAccented(
    `${nameEmployee[nameEmployee.length - 1]}.${nameEmployee[0]}`
  );
};
const createName = (name) => {
  let convertName = name.toLowerCase().split(" ").filter((substr) => substr !== "").map((word) => word.replace(word.charAt(0), word.charAt(0).toUpperCase())).join(" ");
  const employeeNameList = [];
  const numberNameList = [];

  EMPLOYEES_CLONE.forEach((employee) => {
    const employeeName = employee.name.replace(/\s\d/g, ""); //lấy ra tên không có khoảng trắng và số
    const numberName = Number(employee.name.replace(/\D/g, "")); //lấy ra số của tên
    if (convertName === employeeName) {
      if (numberName) {
        numberNameList.push(numberName);
      }
      employeeNameList.push(employeeName);
    }
  });
  if (!employeeNameList.length) {
    return convertName;
  } else {
    let nameNumber = Math.max(0, ...numberNameList) + 1;
    return `${convertName} ${nameNumber}`;
  }
};

const createEmail = (name) => {
  const domainName = "@ntq-solution.com.vn";
  let employeeNameEmail = createNameEmail(name);
  const employeeEmailList = [];
  const numberEmailList = [];

  EMPLOYEES_CLONE.forEach((employee) => {
    let checkEmail = typeof employee.email === "boolean";
    if (!checkEmail) {
      const employeeEmail = employee.email.split('@')[0].replace(/\d/g, ""); //lấy ra tên email không có số
      const numberEmail = Number(employee.email.replace(/\D/g, "")); //lấy ra số của email
      if (employeeNameEmail === employeeEmail) {
        if (numberEmail) {
          numberEmailList.push(numberEmail);
        }
        employeeEmailList.push(employeeEmail);
      }
    }
  });
  if (!employeeEmailList.length) {
    return employeeNameEmail + domainName;
  } else {
    let emailNumber = Math.max(0, ...numberEmailList) + 1;
    return employeeNameEmail + emailNumber + domainName;
  }
};

const createId = () => {
  let maxId = EMPLOYEES_CLONE[0].id;
  EMPLOYEES_CLONE.forEach((employee) => {
    if (maxId < employee.id) {
      maxId = employee.id;
    }
  });
  return maxId + 1;
};
const inputName = document.querySelector(".input_name");
const inputJob = document.querySelector(".input_job");
const inputEmail = document.querySelector(".input_email");
const inputId = document.querySelector(".input_id");
inputName.addEventListener('input', function(e) {
  if(e.target.value) {
    form__error.innerHTML = "";
  }
})
formAddEmployee.addEventListener('submit', (event) => {
  event.preventDefault();
  form__error.innerHTML = "";
  if (inputSearch.value) {
    inputSearch.value = "";
  }
  if (!inputName.value.trim()) {
    form__error.innerHTML = "Vui lòng nhập đủ thông tin!";
  } else if(inputName.value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g)) {
    form__error.innerHTML = "Tên nhân viên không được chứa kí tự đặc biệt!";
  } else if(inputName.value.replace(/\D/g, '')) {
    form__error.innerHTML = "Tên nhân viên không được nhập số!";
  } else {
    form__error.innerHTML = "";
    EMPLOYEES_CLONE.unshift({
      id: createId(),
      name: createName(inputName.value),
      // name: createName(convertName(inputName.value)),
      email: createEmail(inputName.value),
      job: inputJob.value,
    });
    perUser = getEmployeePerPage(EMPLOYEES_CLONE, (currentPage = 1), perPage);
    renderEmployees(perUser);
    inputName.value = "";
    inputId.value = "";
    inputEmail.value = "";
  }
})

inputName.addEventListener('keyup', () => {
  if (inputName.value) {
    inputEmail.value = createEmail(inputName.value);
    inputId.value = createId();
  } else {
    inputEmail.value = "";
    inputId.value = "";
  }
});

// modal add here
let addEmployeeBtn = document.querySelector('.addEmployee-btn')
let modal = document.querySelector('.modal')
let addClose = document.querySelector('.modal-add-close')
let addContainer = document.querySelector('.modal-add-container')
addEmployeeBtn.addEventListener('click', function(e) {
  e.stopPropagation();
    modal.classList.add('modal-open')
})
addClose.addEventListener('click', function() {
    modal.classList.remove('modal-open')
})
document.body.addEventListener("click", function () {
  modal.classList.remove("modal-open");
});
addContainer.addEventListener('click', function (event) {
  event.stopPropagation()
})

//record perpage here
selectPerpage.addEventListener('change', function() {
  perPage = Number(selectPerpage.value);
  perUser = getEmployeePerPage(employeeList, currentPage = 1, perPage);
  renderEmployees(perUser);
})