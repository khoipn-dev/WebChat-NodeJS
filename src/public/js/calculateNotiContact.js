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

function increaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text();
  currentValue += number;

  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}

function decreaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text();
  currentValue -= number;

  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}
