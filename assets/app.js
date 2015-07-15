var main = function() {

  // disable stripe button
  var button = $('#customButton');
  if (button) {
    button.prop('disabled', true);
  }

  var getMetadata = function() {
    var metadata = {};
    metadata.fullName = $.trim($('#fullName').val());
    metadata.email = $.trim($('#email').val());
    metadata.phone = $.trim($('#phone').val());
    metadata.address = $.trim($('#address').val());
    metadata.zipcode = $.trim($('#zipcode').val());
    metadata.pickupDate = $('#pickupDate').val();
    metadata.deliveryDate = $('#deliveryDate').val();
    metadata.mailingList = $('#mailingList').prop('checked');
    metadata.quantity = $('#quantity').val();
    metadata.deliveryType = $('#deliverType').val();
    return metadata;
  }


  // metadata triggers
  var updateMetadata = function() {
    var metadata = getMetadata();

    if ($('#deliverType').val() === 'delivery'
        && (metadata.fullName.length === 0
          || metadata.email.length === 0
          || metadata.phone.length === 0
          || metadata.address.length === 0
          || metadata.zipcode.length === 0
          || metadata.deliveryDate === "NotEntered")) {
      // disable submit button
      $('#customButton').prop('disabled', true);
    } else if ($('#deliverType').val() === 'pickup'
        && (metadata.fullName.length === 0
          || metadata.email.length === 0
          || metadata.pickupDate === "NotEntered")) {
      // disable submit button
      $('#customButton').prop('disabled', true);
    } else {
      // enable submit button
      $('#customButton').prop('disabled', false);
    }
  }

  var getQuantity = function() {
    return $('#quantity').val();
  }

  var getDeliveryFee = function() {
    if ($('#deliverType').val() === 'delivery') {
      return 500; // in cents
    } else {
      return 0;
    }
  }

  var getAmountCents = function() {
    debugger;
    var quantity = getQuantity();
    var amount = quantity * 1500 + getDeliveryFee(); // cents
    return amount;
  }

  /*
   * use token and other args to call out to heroku server which wil call
   * out to stripe to make payment
   */
  var onTokenRecv = function(token) {

    /* token
     * Object {id: "tok_123456123456123456123456", livemode: true, created: 1423112123, used: false, object: "token"…}card: Objectclient_ip: "107.192.0.177"created: 1423112123email: "mericsson@gmail.com"id: "tok_123456123456123456KMqDfv"livemode: trueobject: "token"type: "card"used: falseverification_allowed: true}
     */

    var metadata = getMetadata();

    var payload = {
      amount: getAmountCents(),
      description: 'summer: tea+fruit financiers',
      metadata: metadata,
      stripeToken: token.id,
      stripeTokenType: token.type,
      stripeEmail: token.email
    }

    var data = {
      payload: payload
    }

    // send to herokuapp
    $.ajax({
      type: 'POST',
      url: 'https://test-melange-checkout.herokuapp.com/',
      crossDomain: true,
      data: payload,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        window.location.replace('/success.html');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        window.location.replace('/error.html');
      },
    });
  };

    var stripeHandler = StripeCheckout.configure({
      // key: 'pk_live_lUrKXKuFxSYeqGbtqsjnytWd',
      key: 'pk_test_q8NAb1ewbs64MPgELxVLCC1K',
      image: '/assets/melange_logo_small.png',
      token: function(token, args) {
        onTokenRecv(token, args);
      }
    });

    var openStripeHandler = function() {
      stripeHandler.open({
        name: 'melange pastry lab',
        description: 'i (spring 2015): a taste of macarons',
        amount: getAmountCents()
      });
    }

    var updateDelivery = function() {
      var pickupSection = $('#pickupSection')[0];
      var deliverySection = $('#deliverySection')[0];
      if ($('#deliverType').val() === 'delivery') {
        deliverySection.classList.remove('hidden');
        pickupSection.classList.add('hidden');
      } else {
        pickupSection.classList.remove('hidden');
        deliverySection.classList.add('hidden');
      }
      /*update total cost*/
      updateTotalCost();
    }

    var updateTotalCost = function() {
      var cents = getAmountCents();
      var dollars = cents / 100;
      $('#totalCost').text(dollars);
    }

  /* bindings */
  $('#fullName').keyup(updateMetadata);
  $('#email').keyup(updateMetadata);
  $('#phone').keyup(updateMetadata);
  $('#address').keyup(updateMetadata);
  $('#zipcode').keyup(updateMetadata);
  $('#pickupDate').change(updateMetadata);
  $('#deliveryDate').change(updateMetadata);
  $('#mailingList').change(updateMetadata);
  $('#deliverType').change(updateDelivery);
  $('#quantity').change(updateTotalCost);
  $('#customButton').on('click', openStripeHandler);
}

$(document).ready(main);
