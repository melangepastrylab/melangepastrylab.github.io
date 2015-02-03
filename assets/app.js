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

  var handler = StripeCheckout.configure({
    key: 'pk_test_q8NAb1ewbs64MPgELxVLCC1K',
    image: 'assets/melange_logo_small.png',
    token: function(token) {
      // Use the token to create the charge with a server-side script.
      // You can access the token ID with `token.id`
    }
  });

  $('#customButton').on('click', function(e) {
    var amount = $('#amount').val();

    // Open Checkout with further options
    handler.open({
      name: 'melange pastry lab',
      description: 'i (spring 2015): a taste of macarons',
      amount: amount
    });
    e.preventDefault();
  });

  // Close Checkout on page navigation
  $(window).on('popstate', function() {
    handler.close();
  });

  $('#fullName').keyup(updateMetadata);
  $('#pickupDate').change(updateMetadata);
  $('#mailingList').change(updateMetadata);
  $('#quantity').change(updateQuantity);

};

$(document).ready(main);
