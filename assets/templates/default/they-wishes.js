function get_random(list) {
  let max_index = list.length;
  let index = Math.trunc(Math.random() * max_index);

  return list[index];
}

function setup_random_movement() {
  function MovementClass(class_name) {
    this.class_name = class_name;
    this.active = false;
  }

  let move_classes = [
    new MovementClass("move-right"),
    new MovementClass("move-up"),
    new MovementClass("move-left"),
    new MovementClass("move-down")
  ];

  function random_move_bkg() {
    let max_index = move_classes.length;

    let index = Math.trunc(Math.random() * max_index);


    let move_class = get_random(move_classes);
    while (move_class.active) {
      move_class.active = false;
      document.body.classList.remove(move_class.class_name);
      move_class = get_random(move_classes);
    }

    move_class.active = true;
    document.body.classList.add(move_class.class_name);
  }

  return random_move_bkg;
}

function show_wish() {
  let colors = [
    "siena",
    "purple",
    "olive",
    "darkred"
  ];

  document.getElementById("the-wish").classList.add("wish-visible");
  document.getElementById("top-layer").classList.add(get_random(colors));
}

function hide_title() {
  document.getElementById("title").classList.remove("wish-visible");
  document.getElementById("title").classList.add("wish-hidden");
}

function set_wish() {
  let wishes = get_wishes_list();

  document.getElementById("the-wish").innerHTML = get_random(wishes);
}

window.onload = function () {
  let move_fn = setup_random_movement();
  move_fn();
  set_wish();
  setInterval(move_fn, 4000);
  setTimeout(hide_title, 1500);
  setTimeout(show_wish, 3000);
};

