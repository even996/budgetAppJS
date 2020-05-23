//Module - Budget data  strucures

var budgetController = (function () {
    //Constructors for Income-Expenses

    var Expense = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var Income = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
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
        }
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
        expensesContainer: '.expenses__list'
    }

    return {
        //Method - Read Inputs
        getInput: function () {
            //return as an object
            return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc or ecp
                description: document.querySelector(DOMstrings.inputDescription)
                    .value,
                value: document.querySelector(DOMstrings.inputValue).value
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
                    '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                console.log(element)
                html =
                    '<div class="item clearfix" id="expense-%id%"><div class="item__description"></div>%description%<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>'
            }

            // Replace the placeholder text with some actucal data

            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            // Insert the HTML into the DOM

            //beforend last element of the list
            document
                .querySelector(element)
                .insertAdjacentHTML('beforeEnd', newHtml)
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

        document
            .querySelector(DOM.inputBtn)
            .addEventListener('click', ctrlAdditem)

        //document.addEventListener('keypress', ctrlAdditem);
    }

    var ctrlAdditem = function () {
        //1. get the field input data
        var input, newItem

        input = uiCtrl.getInput()

        //2. Add an item to budget Controller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        // 3. Add the item on the UI

        uiController.addListItem(newItem, input.type)
        //4. Calculate the budget

        // 5. Display the budget in the UI
    }

    return {
        init: function () {
            console.log('Application is started')

            setupEventListeners()
        }
    }
})(budgetController, uiController)

controller.init()
