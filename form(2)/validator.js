function Validator(option) {
  const formElement = document.querySelector(option.form);
  if (formElement) {
    const rules = {};
    function getParent(element, selector) {
      element = element.parentElement;
      while (!element?.classList.contains(selector))
        element = element.parentElement;
      return element;
    }

    function validate(inputElement, rule) {
      let errorMessage;
      const errorElement = getParent(
        inputElement,
        option.formGroupSelector
      ).querySelector(option.errorSelector);

      const arrRule = rules[rule.selector];
      for (let i = 0; i < arrRule.length; i++) {
        switch (inputElement.type) {
          case "radio":
          case "checkbox":
            const inputChecked = formElement.querySelector(
              rule.selector + ":checked"
            );
            errorMessage = arrRule[i](inputChecked);
            break;
          default:
            errorMessage = arrRule[i](inputElement.value);
        }
        if (errorMessage) break;
      }

      if (errorMessage) {
        errorElement.innerText = errorMessage;
        getParent(inputElement, option.formGroupSelector).classList.add(
          "invalid"
        );
      } else {
        resetErrorMessage(inputElement, errorElement);
      }
      return !errorMessage;
    }

    function resetErrorMessage(inputElement, errorElement) {
      errorElement.innerText = "";
      getParent(inputElement, option.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    option.rules.forEach(function (rule) {
      const inputElements = formElement.querySelectorAll(rule.selector);
      const errorElement = getParent(
        inputElements[0],
        option.formGroupSelector
      ).querySelector(option.errorSelector);

      if (Array.isArray(rules[rule.selector])) {
        rules[rule.selector].push(rule.test);
      } else {
        rules[rule.selector] = [rule.test];
      }

      if (inputElements.length) {
        inputElements[0].onblur = function () {
          validate(inputElements[0], rule);
        };

        inputElements.forEach((inputElement) => {
          inputElement.oninput = function () {
            resetErrorMessage(inputElement, errorElement);
          };
        });
      }
    });

    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isFormValid = true;
      option.rules.forEach(function (rule) {
        const inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (!isValid) isFormValid = false;
      });

      if (isFormValid) {
        // submit by js
        if (option.onSubmit) {
          const enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );
          const formValues = {};
          for (let enableInput of enableInputs) {
            if (enableInput.type == "checkbox") {
              if (enableInput.checked) {
                if (Array.isArray(formValues[enableInput.name])) {
                  formValues[enableInput.name].push(enableInput.value);
                } else {
                  formValues[enableInput.name] = [enableInput.value];
                }
              }
            } else if (enableInput.type == "radio") {
              if (enableInput.checked)
                formValues[enableInput.name] = enableInput.value;
            } else if (enableInput.type == "file") {
              formValues[enableInput.name] = enableInput.files;
            } else {
              formValues[enableInput.name] = enableInput.value;
            }
          }
          option.onSubmit(formValues);
        }
        // submit by default
        else {
          formElement.submit();
        }
      }
    };
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui long nhap truong nay";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(value)
        ? undefined
        : message || "Vui long nhap email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim().length >= min
        ? undefined
        : message || `Vui long nhap toi thieu ${min} ky tu`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Vui long nhap dung du lieu";
    },
  };
};

Validator.isChecked = function (selector, message) {
  return {
    selector: selector,
    test: function (element) {
      return element ? undefined : message || "Vui long chon";
    },
  };
};
