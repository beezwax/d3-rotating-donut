var expected =  {
  legendInitial: (function() {
    return '<ul class="legend">' +
        '<li class="legend-label" data-id="1" style="left: 12px; opacity: 1; top: 0px;">' +
        '<svg width="22" height="22">' +
        '<rect fill="red" width="20" height="20" x="1" y="1"></rect>' +
        '</svg>' +
        '<span>item 1</span>' +
        '</li>' +
        '<li class="legend-label" data-id="2" style="left: 12px; opacity: 1; top: 22px;">' +
        '<svg width="22" height="22">' +
        '<rect fill="blue" width="20" height="20" x="1" y="1"></rect>' +
        '</svg>' +
        '<span>item 2</span>' +
        '</li>' +
        '<li class="legend-label" data-id="3" style="left: 12px; opacity: 1; top: 44px;">' +
        '<svg width="22" height="22">' +
        '<rect fill="green" width="20" height="20" x="1" y="1"></rect>' +
        '</svg>' +
        '<span>item 3</span>' +
        '</li>' +
        '</ul>'
  }()),

  legendUpdated: (function() {
    return '<ul class="legend">' +
        '<li class="legend-label" data-id="1" style="left: 12px; opacity: 1; top: 0px;">' +
        '<svg width="22" height="22">' +
        '<rect fill="red" width="20" height="20" x="1" y="1"></rect>' +
        '</svg>' +
        '<span>item 1</span></li>' +
        '<li class="legend-label" data-id="3" style="left: 12px; opacity: 1; top: 22px;">' +
        '<svg width="22" height="22">' +
        '<rect fill="green" width="20" height="20" x="1" y="1"></rect>' +
        '</svg>' +
        '<span>item 3</span></li>' +
        '<li class="legend-label" data-id="4" style="left: 12px; opacity: 1; top: 44px;">' +
        '<svg width="22" height="22">' +
        '<rect fill="yellow" width="20" height="20" x="1" y="1"></rect>' +
        '</svg>' +
        '<span>item 4</span></li>' +
        '</ul>'
  }()),

  descriptionInitial: (function() {
    return '<div class="desc-left arrow">←</div>' +
        '<div class="desc-right">' +
        '<div class="label">a</div>' +
        '<div class="text">item 1</div>' +
        '</div>'
  }()),

  descriptionUpdated: (function() {
    return '<div class="desc-left arrow">←</div>' +
        '<div class="desc-right">' +
        '<div class="label">b</div>' +
        '<div class="text">item 2</div>' +
        '</div>'
  }()),

  pieIconsInitial: (function() {
    return '<svg>' +
        '<g></g>' +
        '<g></g>' +
        '<g></g>' +
        '<image class="icon" href="../images/car.svg" width="20" height="20" style="opacity: 0;"></image>' +
        '<image class="icon" href="../images/cutlery.svg" width="20" height="20" style="opacity: 0;"></image>' +
        '<image class="icon" href="../images/idea.svg" width="20" height="20" style="opacity: 0;"></image>' +
        '</svg>'
  }()),

  pieIconsTweened: (function() {
    return '<svg>' +
        '<g></g>' +
        '<g></g>' +
        '<g></g>' +
        '<image class="icon" href="../images/car.svg" width="20" height="20" transform="translate(28.90365984439606,21.408681136136956)" style="opacity: 1;"></image>' +
        '<image class="icon" href="../images/cutlery.svg" width="20" height="20" transform="translate(28.90365984439606,21.408681136136956)" style="opacity: 1;"></image>' +
        '<image class="icon" href="../images/idea.svg" width="20" height="20" transform="translate(28.90365984439606,21.408681136136956)" style="opacity: 1;"></image>' +
        '</svg>'
  }())

};
