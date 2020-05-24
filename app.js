//Module - Budget data  strucures

var budgetController = (function () {
    //Constructors for Income-Expenses

    var Expense = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    //addes method the prototype for expense every object than gets that method

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage
    }

    var Income = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var calculateTotal = function (type) {
        var sum = 0
        data.allitems[type].forEach(function (current) {
            sum += current.value
        })

        data.total[type] = sum
    }

    //Objects - datastructure

    var data = {
        allitems: {
            exp: [],
            inc: []
        },

        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    //Using the constructors above, we add new item in the datastructure

    return {
        addItem: function (type, desc, val) {
            var newItem, ID

            // creating a new id

            if (data.allitems[type].length > 0) {
                ID = data.allitems[type][data.allitems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            //creaing a new item based on constructor

            if (type === 'exp') {
                newItem = new Expense(ID, desc, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val)
            }

            //Push it into datastructure

            data.allitems[type].push(newItem)

            //return new element

            return newItem
        },

        deleteItem: function (type, id) {
            var ids, index
            //data.allitems[type][id]

            ids = data.allitems[type].map(function (current) {
                return current.id
            })

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allitems[type].splice(index, 1)
            }
        },

        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')

            // calculate the budget income - expenses

            data.budget = data.total.inc - data.total.exp
            // calculate the precentage of income that we spent

            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100)
            } else {
                data.percentage = -1
            }

            // expense = 100 and icnome 200, spent 50% --> 100 / 200 = 0.5 * 100
        },

        calculatePercentages: function () {
            //a=20, b =30, c = 40, INCOME = 100, --> a.p = 40/100 = 40%
            data.allitems.exp.forEach(function (current) {
                current.calcPercentage(data.total.inc)
            })
        },

        getPercentages: function () {
            var allPerc = data.allitems.exp.map(function (current) {
                return current.getPercentage()
            })
            return allPerc
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data)
        }
    }
})()

//Module - UI

var uiController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')

        int = numSplit[0]
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3) //input 23510, output 23,510
        }

        dec = numSplit[1]

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec
    }

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    }

    return {
        //Method - Read Inputs
        getInput: function () {
            //return as an object
            return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc or ecp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        //Method - returning class values to avoid duplication

        addListItem: function (obj, type) {
            var html, newHtml, element
            // create html string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                console.log(element)
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                console.log(element)
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description"></div>%description%<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>'
            }

            // Replace the placeholder text with some actucal data

            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

            // Insert the HTML into the DOM

            //beforend last element of the list
            document.querySelector(element).insertAdjacentHTML('beforeEnd', newHtml)
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID)

            el.parentNode.removeChild(el)
        },

        clearFields: function () {
            //queryselectorAll lager en liste.
            var fields, fieldsArray
            fields = document.querySelectorAll(
                DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
            )
            // converting list to array
            fieldsArray = Array.prototype.slice.call(fields)

            fieldsArray.forEach(function (current, index, array) {
                current.value = ''
            })
            fieldsArray[0].focus()
        },

        displayBudget: function (obj) {
            var type
            obj.budget > 0 ? (type = 'inc') : (type = 'exp')

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
                obj.budget,
                type
            )
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
                obj.totalInc,
                'inc'
            )
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(
                obj.totalExp,
                'exp'
            )

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel)

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                } else {
                    current.textContent = '---'
                }
            })
        },

        displayMounth: function () {
            var now, months, month, year
            now = new Date()

            months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'Oktober',
                'November',
                'Desember'
            ]
            month = now.getMonth()
            year = now.getFullYear()
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType +
                    ',' +
                    DOMstrings.inputDescription +
                    ',' +
                    DOMstrings.inputValue
            )

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus')
            })

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
        },

        getDOMstrings: function () {
            return DOMstrings
        }
    }
})()

//Module - Controller

var controller = (function (budgetCtrl, uiCtrl) {
    //grouping eventlisteners

    var setupEventListeners = function () {
        var DOM = uiCtrl.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAdditem)

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAdditem()
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType)

        //document.addEventListener('keypress', ctrlAdditem);
    }

    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calculateBudget()
        //2. return the budget

        var budget = budgetCtrl.getBudget()

        //3. Display the budget in the UI

        uiController.displayBudget(budget)
    }

    var updatePercentages = function () {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages()

        // 2. Read percentages from the budget controller

        var percentages = budgetCtrl.getPercentages()
        //3. Update the UI with the new percentages
        uiCtrl.displayPercentages(percentages)
    }

    var ctrlAdditem = function () {
        //1. get the field input data
        var input, newItem

        input = uiCtrl.getInput()

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. Add an item to budget Controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. Add the item on the UI
            uiController.addListItem(newItem, input.type)

            //4 clear the fields
            uiController.clearFields()

            // 5 calculate and update budget
            updateBudget()

            //6 Calculate and update the percentages

            updatePercentages()
        }
    }

    var ctrlDeleteItem = function (event) {
        var itemId, splitId, type, ID

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemId) {
            //inc-1
            // retunere et array?
            splitId = itemId.split('-')
            type = splitId[0]
            ID = parseInt(splitId[1])

            //1 delete the item from the data struckture
            budgetCtrl.deleteItem(type, ID)

            //2. Delete the item from the UI

            uiCtrl.deleteListItem(itemId)
            //3 Update and show the new budget

            updateBudget()

            //4 Calculate and update the percentages

            updatePercentages()
        }
    }

    return {
        init: function () {
            console.log('Application is started')
            uiCtrl.displayMounth()
            uiController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            })

            setupEventListeners()
        }
    }
})(budgetController, uiController)

controller.init()
