//////////////////
//Business logic

// Order constructor
function Order() {
  this.pizzas = [];
  this.currentId = 0
}

Order.prototype.addPizza = function(pizza) {
  pizza.id = this.assignId();
  this.pizzas.push(pizza);
}

Order.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

Order.prototype.findPizza = function(id) {

  for (var i=0; i < this.pizzas.length; i++) {
    if (this.pizzas[i]) {
      if (this.pizzas[i].id == id) {
        return this.pizzas[i];
      }
    }
  }
  return false;
}

Order.prototype.deletePizza = function(id) {
  for (var i=0; i < this.pizzas.length; i++) {
    if (this.pizzas[i]) {
      if (this.pizzas[i].id == id) {
          this.pizzas.splice(i,1);
        return true;
      }
    }
  }
  return false;
}
Order.prototype.calculateOrderCost = function() {
  var cost = 0;
  for (var i=0; i < this.pizzas.length; i++) {
    cost+=this.pizzas[i].calculateCost();
  }
  return cost;
}

// Pizza constructor
function Pizza(size, crust, sauce, meatToppings, veggieToppings, cheeseToppings) {
  this.size = size;
  this.crust = crust;
  this.sauce = sauce;
  this.meatToppings = meatToppings;
  this.veggieToppings = veggieToppings;
  this.cheeseToppings = cheeseToppings;
}

// Calculate cost based on size
// Chicago style pizza is $2 more than the other crust types
// Small is $10, Medium is $13, Large is $18
// Meat toppings are $2 for small, $2.50 for medium and $3.50 for Large
// Veggie toppings are $1 for small, $1.50 for medium and $2 for Large
// Cheese toppings - 1 is included for free but
// $1 for additional for small, $1.50 for medium, and $2 for Large
Pizza.prototype.calculateCost = function() {
  var cost = 0;

  switch (this.size) {
    case "Small":
      cost += 10;
      cost += this.meatToppings.length*2;
      cost += this.veggieToppings.length;
      cost += this.cheeseToppings.length;
      cost -= 1; // for the free cheese topping
      break;

    case "Medium":
      cost += 13;
      cost += this.meatToppings.length*2.5;
      cost += this.veggieToppings.length*1.5;
      cost += this.cheeseToppings.length*1.5;
      cost -= 1.5; // for the free cheese topping
      break;

    case "Large":
      cost += 18;
      cost += this.meatToppings.length*3.5;
      cost += this.veggieToppings.length*2;
      cost += this.cheeseToppings.length*2;
      cost -= 2; // for the free cheese topping
      break;

  }
  // crust
  if (this.crust === "Chicago") {
    cost += 2;
  }
  return cost;
}

function clearFields() {
  $('input[type=checkbox]').prop('checked',false);
  // Comment out the line below because I do not know how to test that at least 1 radio button is selected
  // $('input[type=radio]').prop('checked',false);
}

//////////////////////////////////////////
// User logic

function showPizzaDetails (pizzaId){
  var pizzaDetails = $('ul#pizzaDetails');
  var pizza = order.findPizza(pizzaId);

  var meats = "";
  var veggies = "";
  var cheeses = "";

  $('#pizzaDetails').show(); // Display the orderDetails div
  $('#pizzaNum').empty();
  $('#pizzaNum').html("<strong>Pizza " + pizza.id + "</strong>");
  $("#pizzaSize").html(pizza.size);
  $("#pizzaCrust").html(pizza.crust);
  $("#pizzaSauce").html(pizza.sauce);

  // For each topping type, write them to the details section if they exist,
  // if there are no toppings of that type, hide the li
  if (pizza.meatToppings.length) {
    $('#meatLi').show();
    pizza.meatToppings.forEach(function(meat) {
      meats += meat + ", ";
    });
    meats = meats.replace(/, $/, ''); // remove the trailing comma
  } else {
    $('#meatLi').hide();
  }
  if(pizza.veggieToppings.length){
    $('#veggieLi').show();
    pizza.veggieToppings.forEach(function(veggie) {
      veggies += veggie + ", ";
    });
    veggies = veggies.replace(/, $/, ''); // remove the trailing comma
  } else {
    $('#veggieLi').hide();
  }
  if (pizza.cheeseToppings.length){
    $('#cheeseLi').show();
    pizza.cheeseToppings.forEach(function(cheese) {
      cheeses += cheese + ", ";
    });
    cheeses = cheeses.replace(/, $/, ''); // remove the trailing comma
  } else {
    $('#cheeseLi').hide();
  }

  $("#pizzaCheese").html(cheeses);
  $('#pizzaMeat').html(meats);
  $('#pizzaVeggies').html(veggies);

  var buttons = $('#buttons');
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" + pizza.id + ">Remove pizza</button>");
}


// This gives a list of pizzas in the order
function displayOrderDetails(order){
  var orderDetails = $("ul#orderDetails");
  var htmlForOrderDetails = "";
  order.pizzas.forEach(function(pizza) {
    var cost = pizza.calculateCost().toFixed(2);
    htmlForOrderDetails += "<li id=" + pizza.id + ">" + "Pizza " + pizza.id + " $" + cost + "</li>";
  });
  $('#orderDetails').show(); // Display the orderDetails div
  orderDetails.html(htmlForOrderDetails);
}

// For each pizza listed in the order, let the text be a link
// show the details of the pizza when the link is clicked along with a delete button
// If the delete button is clicked, delete the pizza and hide the pizzaDetails section,
// remove the delete button, and recalculate the total
function attachPizzaListeners() {
  var buttons = $('#buttons');
  var pizzaDetails = $('#pizzaDetails');
  var total = $('#total');
  $('ul#orderDetails').on("click", "li", function() {
    showPizzaDetails (this.id);
  });
    buttons.on("click",".deleteButton", function() {
    order.deletePizza(this.id);
    pizzaDetails.hide();
    displayOrderDetails(order);
    buttons.empty();
    total.html(order.calculateOrderCost().toFixed(2));
  });
}


var order = new Order();

$().ready(function() {
  attachPizzaListeners();
  $('#pizzaOrderForm').submit(function() {
    event.preventDefault();
    var meatToppings = [];
    var veggieToppings = [];
    var cheeseToppings = [];

    // Get the toppings
    var size=$('input:radio[name=size]:checked').val();
    var crust=$('input:radio[name=crust]:checked').val();
    var sauce=$('input:radio[name=sauce]:checked').val();
    $("input:checkbox[name=meat]:checked").each(function(){
     meatToppings.push($(this).val());
    });
    $("input:checkbox[name=veggie]:checked").each(function(){
     veggieToppings.push($(this).val());
    });
    $("input:checkbox[name=cheese]:checked").each(function(){
     cheeseToppings.push($(this).val());
    });
    var pizza = new Pizza(size, crust, sauce, meatToppings, veggieToppings, cheeseToppings);

    order.addPizza(pizza);
    clearFields();

    // Output
    $('#order').show();
    displayOrderDetails(order);
    $('#total').html(order.calculateOrderCost().toFixed(2));
  });
});
