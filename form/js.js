
//đối tượng 'validator'
validator = options => {
  
    var selectorRules = {}
    
    //thực hiện validate
    validate = (inputElement, rule) => {
      var errorMessage 
      var errorElement = inputElement.parentElement
      
      //lấy ra từng rule của selector
      var rules = selectorRules[rule.selector]
      
      //lập qua từng rule & kiểm tra
      for (var i = 0; i < rules.length; i++) {
        errorMessage = rules[i](inputElement.value)
        if (errorMessage) break;
      }
          
      if (errorMessage) {
        errorElement.classList.add('invalid')
        errorElement.querySelector(options.message).innerText = errorMessage
      } else {
        noError(inputElement)
      }
      
      return !errorMessage
    }
    
    //thực hiện validate khi ko có lỗi
    noError = (inputElement) => {
      var errorElement = inputElement.parentElement
      errorElement.classList.remove('invalid')
      errorElement.querySelector(options.message).innerText = ''
    }
    
    //lấy form cần thực hiện validate
    var formElement = document.querySelector(options.form)
    
    if (formElement) {
      
      var isFormValid = true
      
      //khi submit form
      formElement.onsubmit = function(e) {
        e.preventDefault()
        
        //lặp qua từng rule & validate
        options.rules.forEach(rule => {
          var inputElement = formElement.querySelector(rule.selector)
          var isValid = validate(inputElement, rule)
          if (!isValid) {
            isFormValid = false
          }
        })
        
        if (isFormValid) {
          //Trường hợp submit với js
          if (typeof options.onsubmit === 'function') {
            var enableInputs = formElement.querySelectorAll('[name]:not([disable])')
            var formValues = Array.form(enableInputs).reduce((values, input) => {
              return (values[input.name] = input.value) && values
            }, {})
            options.onsubmit(formValues)
          }
          //Trường hợp submit mặc định
          else {
            formElement.submit()
          }
        }     
      }
      
      //lặp qua mỗi rule và xử lí
      options.rules.forEach(rule => {
        var inputElement = formElement.querySelector(rule.selector)
        
        if (Array.isArray(selectorRules[rule.selector])) {
          selectorRules[rule.selector].push(rule.test)
        } else {
          selectorRules[rule.selector] = [rule.test]
        }
        
        if (inputElement) {
          inputElement.onblur = function() {
            
            //xử lí trường hợp blur
            validate(inputElement, rule)
            
            //xử lí khi user nhập 
            inputElement.oninput = function() {
              noError(inputElement)
            }
            
          }
        }
        
      })
      
    }
  }
  
  //định nghĩa rules
  validator.isRequired = (selector, message) => ({
    selector,
    test: function(value) {
      return value.trim() ? '' : message || 'Vui lòng nhập trường này'
    }
  })
  
  validator.isEmail = (selector, message) => ({
    selector,
    test: function(value) {
      var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return regex.test(value) ? '' : message || 'Trường này phải là email'
    }
  })
  
  validator.isPassword = (selector, min, message) => ({
    selector,
    test: function(value) {
      return (value.trim()).length >= min ? '' : message || `Vui lòng nhập đủ ${min} ký tự`
    }
  })
  
  validator.isConfirmed = (selector, getConfirmValue, message) => ({
    selector,
    test: function(value) {
      return value === getConfirmValue() ? '' : message || 'Vui lòng nhập đúng dữ liệu'
    }
  })
  