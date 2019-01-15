//Budget Controller
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current, index, array) {
            sum += current.value;
        })
        data.totals[type] = sum;
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //Create New Id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            //create New Item Based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function () {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget income-expense
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percenatge of income that we spent
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        deleteItem: function (type, id) {
            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            var index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (curre) {
                return curre.getPercentage();
            });
            return allPercentages;
        }
    };

})();


/// UI Controller

var UIController = (function () {
    var Domstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itempercentages: '.item__percentage',
        dateLabel: '.budget__title--month'

    };
    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(Domstrings.inputType).value,
                description: document.querySelector(Domstrings.inputDescription).value,
                value: parseFloat(document.querySelector(Domstrings.inputValue).value)
            };
        },
        AddListItem: function (obj, type) {
            //Create HTML Dtring with placeholder text
            var html, newHtml, element;
            if (type === 'inc') {
                element = Domstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = Domstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace a placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            // Insert the HTML imto DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            //We can only remove a child
        },
        clearFields: function () {
            var fields, fieldArr;
            fields = document.querySelectorAll(Domstrings.inputDescription + ',' + Domstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            })
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(Domstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(Domstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(Domstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0 && isFinite(obj.percentage)) {
                document.querySelector(Domstrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(Domstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(Domstrings.itempercentages); //Node Lists
            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        displayMonth: function () {
            var now = new Date(); //returns today's Date
            var year, month, months;
            months = ['January', 'Feb', "Mar", 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Dec'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(Domstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        getDomStrings: function () {
            return Domstrings;
        },
        changeType: function () {
            var fields = document.querySelectorAll(
                Domstrings.inputType + ',' +
                Domstrings.inputDescription + ',' +
                Domstrings.inputValue);
            nodeListForEach(fields, function (current) {
                current.classList.toggle('red-focus');
            });
        }

    };
})();



// App Controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDomStrings();
        document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                controlAddItem();
            }
            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
            document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
        });

    };
    var updateBudget = function () {
        // Calculate the Budget
        budgetCtrl.calculateBudget();
        // Return the Budget
        var budget = budgetCtrl.getBudget();
        //Display the Budget on UI 
        UICtrl.DisplayBudget(budget);
    };

    var updatePercentages = function () {
        // Calculate percentages
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        // Read percentages from the budget controller
        UICtrl.displayPercentages(percentages);
         // Update the UI with the new percentages
    };

    var controlAddItem = function () {
        //Read input data

        var input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // Add item to budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // Add new item to UI
            UICtrl.AddListItem(newItem, input.type);
            //Clear the fields
            UICtrl.clearFields();
            // Calculate and Update Budget
            updateBudget();
            // Calculate and Update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemId, splitID, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // delete the item from the data struture
            budgetCtrl.deleteItem(type, ID);
            // deleter the item from the UI
            UICtrl.deleteListItem(itemId);
            // Update and show new budget
            updateBudget();
            // Calculate and Update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();