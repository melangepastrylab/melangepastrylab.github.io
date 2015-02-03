var main = function() {

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
    metadata.quantity = $('#quantity').val();

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

  var updateQuantity = function() {
    /* update price based on quantity */
    var boxes = $('#quantity').val();
    var amount = 1500 * boxes;
    $('#stripeScript').attr('data-amount', amount);
    $('#amount').val(amount);
    updateMetadata();
  }


  $('#fullName').keyup(updateMetadata);
  $('#pickupDate').change(updateMetadata);
  $('#mailingList').change(updateMetadata);
  $('#quantity').change(updateQuantity);

};

$(document).ready(main);
