"use strict"

function openChat() {
  let listSupportedOpen = {
    CarrotQuest: {
      name: "#CarrotQuest__open",
      originalName: "carrotquest.open()",
      style: {
        mode: "never",
        className: "styleFix",
        styleFix: {
          ".buttons_contact_block_header": {
            "justify-content": "center",
          },
        },
        styleFixOff: null,
      },
    },
    BitrixLiveChat: {
      name: "#BitrixLiveChat__open",
      originalName: "window.BX.LiveChat.openLiveChat()",
      style: {
        mode: "always",
        className: "styleFix",
        styleFix: null,
        styleFixOff: null,
      },
    },
    Calltouch: {
      name: "#Calltouch__open",
      originalName: "window.Calltouch.Callback.onClickCallButton()",
      style: {
        mode: "only_style",
        className: "styleFix",
        styleFix: {
          "#CalltouchWidgetFrame": {
            "pointer-events": "none",
          },
        },
        styleFixOff: {
          "#CalltouchWidgetFrame": {
            "pointer-events": "auto",
          },
        },
        oldStyleElement: null,
        newStyleElement: null,
      },
    },
  };

  // Если задано скрытие виджета - удаляем элементы вызова
  disableWidgetButton(listSupportedOpen);

  // Если в селекторе указан старый способ вызова виджета - меняем его на новый
  changeAttributeOpener(listSupportedOpen);

  // Создание обработчика клика по кнопке вызова виджета
  for (let listSupportedOpenKey in listSupportedOpen) {
    let getProperties = listSupportedOpen[listSupportedOpenKey];

    $(document).on('click', '[href="' + getProperties.name + '"]', () => {
      // Выполнение перед вызовом виджета
      additionalHandlersBegin(getProperties, listSupportedOpenKey);
      // Вызов виджета
      handlersMain(getProperties, listSupportedOpenKey);
      // Выполнение после вызова виджета
      additionalHandlersEnd(getProperties, listSupportedOpenKey);
    });
  }
}

function additionalHandlersBegin(properties, nameKey) {
  // Example
  if (nameKey === 'Calltouch' && Object.keys(properties.style.styleFixOff).length) {
    let el = document.querySelector(Object.keys(properties.style.styleFixOff)[0]);

    if (el) properties.style.oldStyleElement = el.attributes.style.value;
  }
}

function handlersMain(properties, nameKey) {
  try {
    eval(properties.originalName);

    if (properties.style.styleFixOff) disableStyleFix(properties);
  } catch (e) {
    console.log(e);
  }
}

function additionalHandlersEnd(properties, nameKey) {
  // Example
  if (nameKey === 'Calltouch' && Object.keys(properties.style.styleFixOff).length) {
    let el = document.querySelector(Object.keys(properties.style.styleFixOff)[0]);
    let intervalCloseCallTouch;

    if (el) {
      intervalCloseCallTouch = setInterval(() => {
        properties.style.newStyleElement = el.attributes.style.value;

        if (properties.style.oldStyleElement === properties.style.newStyleElement) {
          disableStyleFix(properties, false);
          clearInterval(intervalCloseCallTouch);
        } else if (properties.style.newStyleElement.search(/width\: 100\%\; height\: 100\%\;/ig) !== -1) {
          disableStyleFix(properties, true);
          // Не останавливаем setInterval, чтобы свойство в styleFix могло снова примениться
          // clearInterval(intervalCloseCallTouch);
        }
      }, 250);
    }
  }
}

function disableWidgetButton(listSupportedOpen) {
  for (let listSupportedOpenKey in listSupportedOpen) {
    let getProperties = listSupportedOpen[listSupportedOpenKey];

    if (getProperties.style.mode === 'never') {
      let el = document.querySelectorAll('[href="' + getProperties.name + '"], [onclick^="' + getProperties.originalName + '"]');

      if (el.length) {
        el.forEach((index) => {
          index.remove();
        });

        // Базовая корректировка стилей, когда кнопки удалены
        addStyleFix(getProperties.style.styleFix, getProperties.style.className);
      }
    } else if (getProperties.style.mode === 'only_style') {
      addStyleFix(getProperties.style.styleFix, getProperties.style.className);
    }
  }
}

function changeAttributeOpener(listSupportedOpen) {
  for (let listSupportedOpenKey in listSupportedOpen) {
    let getProperties = listSupportedOpen[listSupportedOpenKey];

    document.querySelectorAll('[onclick^="' + getProperties.originalName + '"]').forEach((index) => {
      index.removeAttribute("onclick");
      index.setAttribute("href", getProperties.name);
    });
  }
}

function addStyleFix(styleProperty, className) {
  if (styleProperty) {
    let style = document.createElement("style");
    style.type = "text/css";
    style.className = className;
    style.innerHTML = generateStyle(styleProperty);
    document.head.appendChild(style);
  }
}

function disableStyleFix(properties, action) {
  document.querySelectorAll('.' + properties.style.className).forEach((index) => {
    if (index.textContent === generateStyle(properties.style.styleFixOff)) index.remove();
  });

  if (action !== false) addStyleFix(properties.style.styleFixOff, properties.style.className);
}

function generateStyle(styleValue) {
  let styleResult = "";

  for (let styleFixKey in styleValue) {
    styleResult += styleFixKey + "{";

    for (let property in styleValue[styleFixKey]) {
      styleResult += property + ":" + styleValue[styleFixKey][property] + ";";
    }

    styleResult += "}";
  }

  return styleResult;
}

document.addEventListener("DOMContentLoaded", openChat);
