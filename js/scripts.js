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
      if (this.pizzas[i].id === id) {
        return this.pizzas[i];
      }
    }
  }
  return false;
}

Order.prototype.deletePizza = function(id) {
  for (var i=0; i < this.pizzas.length; i++) {
    if (this.pizzas[i]) {
      if (this.pizzas[i].id === id) {
//        delete this.pizzas[i];
          this.pizzas.splice(i,1);
        return true;
      }
    }
  }
  return false;
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

  switch (size) {
    case "small":
      cost += 10;
      cost += meatToppings.length*2;
      cost += veggieToppings.length;
      cost += cheeseToppings.length;
      cost -= 1; // for the free cheese topping
      break;

    case "medium":
      cost += 13;
      cost += meatToppings.length*2.5;
      cost += veggieToppings.length*1.5;
      cost += cheeseToppings.length*1.5;
      cost -= 1.5; // for the free cheese topping
      break;

    case "large":
      cost += 18;
      cost += meatToppings.length*3.5;
      cost += veggieToppings.length*2;
      cost += cheeseToppings.length*2;
      cost -= 2; // for the free cheese topping
      break;

  }
  // crust
  if (this.crust === "Chicago") {
    cost += 2;
  }
  return cost;
}




//////////////////////////////////////////
// User logic
var order = new Order();


// function displayOrder()


$().ready(function() {
  $('#pizzaOrderForm').submit(function() {
    event.preventDefault();
    var size=$('input:radio[name=size]:checked').val();
    var crust=$('input:radio[name=crust]:checked').val();
    var sauce=$('input:radio[name=sauce]:checked').val();
    var meatToppings = [];
    var veggieToppings = [];
    var cheeseToppings = [];
    // var meatToppings = ['Canadian Bacon', 'Sausage'];
    // var veggieToppings = ['Black olives', 'Spinach', 'Tomatoes'];
    // var cheeseToppings = ['Mozzarella', 'Feta'];

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

    // Output
    $('#orderDetails').text(pizza);
    console.log(pizza);
    $('#orderDetails').show();
  });
});
