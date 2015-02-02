var main = function() {

  /*
  $('.dropdown-toggle').click(function() {
      $('.dropdown-menu').toggle();
  });
  
  $('.arrow-next').click(function() {
      var currentSlide = $('.active-slide');
      var nextSlide = currentSlide.next();
      if (nextSlide.length === 0) {
          nextSlide = $('.slide').first();
      }
      currentSlide.fadeOut(600).removeClass('active-slide');
      nextSlide.fadeIn(600).addClass('active-slide');
      
      var currentDot = $('.active-dot');
      var nextDot = currentDot.next()
      if (nextDot.length === 0) {
          nextDot = $('.dot').first();
      }
      currentDot.removeClass('active-dot');
      nextDot.addClass('active-dot');
  });


  $('.arrow-prev').click(function() {
      var currentSlide = $('.active-slide');
      var prevSlide = currentSlide.prev();
      if (prevSlide.length === 0) {
          prevSlide = $('.slide').last();
      }
      currentSlide.fadeOut(600).removeClass('active-slide');
      prevSlide.fadeIn(600).addClass('active-slide');
      
      var currentDot = $('.active-dot');
      var prevDot = currentDot.prev()
      if (prevDot.length === 0) {
          prevDot = $('.dot').last();
      }
      currentDot.removeClass('active-dot');
      prevDot.addClass('active-dot');
  });
  */

  // disable stripe button
  var button = $('.stripe-button-el');
  if (button) {
    button.prop('disabled', true);
  }

  // metadta triggers
  var updateMetadata = function() {
    var metadata = {};
    metadata.fullName = $.trim($('#fullName').val());
    metadata.pickupDate = $('#pickupDate').val();
    metadata.mailingList = $('#mailingList').prop('checked');

    if (metadata.fullName.length > 0
       && metadata.pickupDate !== "NotEntered") {

      // set metadata
      var stringified = JSON.stringify(metadata);
      $('input[name=metadata]').val(stringified);

      // re-enable submit button
      $('.stripe-button-el').prop('disabled', false);
    } else if (metadata.fullName.length === 0
        || metadata.pickupDate === "NotEntered") {
      // disable submit button
      $('.stripe-button-el').prop('disabled', true);
    }
  }

  $('#fullName').keyup(updateMetadata);
  $('#pickupDate').change(updateMetadata);
  $('#mailingList').change(updateMetadata);

};

$(document).ready(main);
