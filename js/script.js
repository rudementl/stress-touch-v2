// Получаем поле ввода и таблицу
const searchInput = document.getElementById("search-input");
const table = document.getElementById("my-table");
// Получаем первую строку таблицы (заголовки столбцов)
const headerRow = table.rows[0];
// Слушаем событие input на поле ввода
searchInput.addEventListener("input", function () {
  // Получаем значение поискового запроса
  const searchQuery = searchInput.value.toLowerCase();
  // Получаем все строки таблицы, кроме заголовка
  const rows = Array.from(table.rows).slice(1);
  // Счетчик страниц
  let pageCount = 0;
  // Проходим по всем строкам таблицы
  for (let i = 0; i < rows.length; i++) {
    // Получаем ячейки в текущей строке
    const cells = rows[i].getElementsByTagName("td");
    // Счетчик совпадений в текущей строке
    let matchCount = 0;
    // Проходим по всем ячейкам в текущей строке
    for (let j = 0; j < cells.length; j++) {
      // Получаем значение ячейки и приводим его к нижнему регистру
      const cellValue = cells[j].textContent.toLowerCase();
      // Проверяем, содержит ли значение ячейки поисковый запрос
      if (cellValue.includes(searchQuery)) {
        matchCount++;
      }
    }
    // Если текущая строка содержит хотя бы одно совпадение
    if (matchCount > 0) {
      // Показываем строку
      rows[i].style.display = "";
      // Увеличиваем счетчик страниц
      pageCount++;
      // Если мы уже показали 10 страниц, то выходим из цикла
      if (pageCount >= 10) {
        break;
      }
    } else {
      // Если текущая строка не содержит совпадений, то скрываем ее
      rows[i].style.display = "none";
    }
  }
  // Если не было найдено ни одного совпадения, то показываем сообщение об этом
  if (pageCount === 0) {
    const noResultsRow = document.createElement("tr");
    const noResultsCell = document.createElement("td");
    noResultsCell.style.fontSize = "24px";
    noResultsCell.style.textAlign = "center";
    noResultsCell.style.paddingTop = "300px";
    pagination.style.display = "none";
    noResultsCell.colSpan = headerRow.cells.length;
    noResultsCell.textContent = "Результатов не найдено";
    noResultsRow.appendChild(noResultsCell);
    table.appendChild(noResultsRow);
  } else {
    // Если были найдены совпадения, то удаляем сообщение об их отсутствии (если такое было)
    const noResultsRow = table.querySelector("tr:last-child");
    if (noResultsRow && noResultsRow.textContent === "Результатов не найдено") {
      table.removeChild(noResultsRow);
    }
  }
});

function deleteRow(btn) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function editRow(btn) {
  var row = btn.parentNode.parentNode;
  var name = row.cells[1].innerHTML;
  row.cells[1].innerHTML = '<input type="text" value="' + name + '">';

  // добавляем обработчик событий input на ячейку с названием таблицы для обрезания текста
  var input = row.cells[1].querySelector("input");
  input.addEventListener("input", function () {
    var maxLength = 28;
    if (input.value.length > maxLength) {
      input.value = input.value.substring(0, maxLength);
      input.value = input.value.substring(0, maxLength - 2) + "..";
    }
  });

  btn.innerHTML = "сохранить";
  btn.setAttribute("onclick", "saveRow(this)");
}

function saveRow(btn) {
  var row = btn.parentNode.parentNode;
  var name = row.cells[1].querySelector("input").value;

  row.cells[1].innerHTML =
    name.length > 28 ? name.substring(0, 28) + ".." : name;

  btn.innerHTML = "редактировать";
  btn.setAttribute("onclick", "editRow(this)");
}

// pagination

const pageSize = 10; // количество записей на странице
let currentPage = 1; // текущая страница

const tableRows = document.querySelectorAll("tbody tr"); // получаем все строки таблицы
const pageCount = Math.ceil(tableRows.length / pageSize); // вычисляем количество страниц

// функция, которая скрывает все строки таблицы, кроме тех, которые нужны для текущей страницы
const showPage = (page) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  tableRows.forEach((row, index) => {
    if (index >= startIndex && index < endIndex) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
};

// функция для обновления номера страницы в навигационной панели
const updatePageNumber = () => {
  const pageNumber = document.getElementById("page-number");
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(startRecord + pageSize - 1, tableRows.length);
  const totalRecords = tableRows.length;
  pageNumber.innerText = `${startRecord}-${endRecord} из ${totalRecords}`;
};

// обработчик события для кнопки "Вперед"
const nextButton = document.getElementById("next");
nextButton.addEventListener("click", () => {
  if (currentPage < pageCount) {
    currentPage++;
    showPage(currentPage);
    updatePageNumber();
  }
});

// обработчик события для кнопки "Назад"
const previousButton = document.getElementById("previous");
previousButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
    updatePageNumber();
  }
});

// показываем первую страницу таблицы
showPage(currentPage);
updatePageNumber();
