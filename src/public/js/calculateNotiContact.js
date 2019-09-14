function increaseNumberNotiContact(className) {
  let currentValue = +$(`.${className}`)
    .find("em")
    .text();
  currentValue += 1;

  if (currentValue === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
}

function decreaseNumberNotiContact(className) {
  let currentValue = +$(`.${className}`)
    .find("em")
    .text();
  currentValue -= 1;

  if (currentValue === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
}

function increaseNumberNotiContactNavbar(className) {
  let currentValue = +$(`.${className}`).text();
  currentValue += 1;

  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}

function decreaseNumberNotiContactNavbar(className) {
  let currentValue = +$(`.${className}`).text();
  currentValue -= 1;

  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}
