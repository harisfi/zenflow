var multipleCancelButton;
var teamStatusSelect;

document.addEventListener("DOMContentLoaded", function () {
  var multiSelect = document.getElementById("choices-multiple-remove-button");
  var teamSelect = document.getElementById("team-status");

  if (multiSelect) {
    multipleCancelButton = new Choices("#choices-multiple-remove-button", {
      removeItemButton: !0,
    });
  }

  if (teamSelect) {
    teamStatusSelect = new Choices("#team-status");
  }

  var e = document.querySelectorAll("[data-trigger]");
  for (i = 0; i < e.length; ++i) {
    var t = e[i];
    new Choices(t, {
      placeholderValue: "This is a placeholder set in the config",
      searchPlaceholderValue: "This is a search placeholder",
    });
  }
});
